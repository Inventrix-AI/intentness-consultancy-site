import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { createRazorpayPaymentLink } from "@/lib/razorpay";
import { assertRateLimit } from "@/lib/rate-limit";
import { makeId } from "@/lib/server-utils";
import { savePaymentLink } from "@/lib/store";
import { nowIso, toMinorUnits } from "@/lib/utils";
import { createPaymentLinkSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rate = assertRateLimit(`create_link:${ip}`, 5, 60_000);

  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please retry shortly.", retryAfterSeconds: rate.retryAfterSeconds },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = createPaymentLinkSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid payload.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  try {
    const amountMinor = toMinorUnits(parsed.data.amountMajor, parsed.data.currency);

    const expireBy = parsed.data.expiryHours
      ? Math.floor(Date.now() / 1000) + parsed.data.expiryHours * 3600
      : undefined;

    const rpLink = await createRazorpayPaymentLink({
      amount: amountMinor,
      currency: parsed.data.currency,
      description: parsed.data.description,
      customer: {
        name: parsed.data.clientName,
        email: parsed.data.clientEmail,
        contact: parsed.data.clientPhone || undefined
      },
      notify: {
        email: parsed.data.notifyEmail,
        sms: parsed.data.notifySms
      },
      reminder_enable: true,
      reference_id: parsed.data.reference || undefined,
      expire_by: expireBy
    });

    const recordId = makeId("plink");
    const expiresAt = expireBy ? new Date(expireBy * 1000).toISOString() : undefined;

    await savePaymentLink({
      id: recordId,
      createdAt: nowIso(),
      razorpayLinkId: rpLink.id,
      shortUrl: rpLink.short_url,
      amountMajor: parsed.data.amountMajor,
      amountMinor,
      currency: parsed.data.currency,
      description: parsed.data.description,
      reference: parsed.data.reference,
      client: {
        name: parsed.data.clientName,
        email: parsed.data.clientEmail,
        phone: parsed.data.clientPhone
      },
      notifyEmail: parsed.data.notifyEmail,
      notifySms: parsed.data.notifySms,
      expiresAt,
      status: "created"
    });

    await logAudit("payment_link_created", "payment_link", {
      recordId,
      razorpayLinkId: rpLink.id,
      shortUrl: rpLink.short_url,
      amountMajor: parsed.data.amountMajor,
      currency: parsed.data.currency,
      clientEmail: parsed.data.clientEmail,
      createdBy: session.username
    });

    return NextResponse.json({
      paymentLinkId: rpLink.id,
      shortUrl: rpLink.short_url,
      amountMajor: parsed.data.amountMajor,
      currency: parsed.data.currency,
      expiresAt,
      recordId
    });
  } catch (error) {
    await logAudit("payment_link_failed", "payment_link", {
      message: error instanceof Error ? error.message : "unknown"
    });
    return NextResponse.json({ error: "Could not create payment link." }, { status: 500 });
  }
}
