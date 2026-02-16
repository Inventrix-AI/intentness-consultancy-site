import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";
import { assertRateLimit } from "@/lib/rate-limit";
import { makeId } from "@/lib/server-utils";
import { saveInvoiceRequest, saveLead } from "@/lib/store";
import { verifyTurnstile } from "@/lib/security";
import { nowIso } from "@/lib/utils";
import { invoiceRequestSchema, leadSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rate = assertRateLimit(`lead:${ip}`, 12, 60_000);

  if (!rate.ok) {
    await logAudit("lead_rate_limited", "security", { ip, retryAfterSeconds: rate.retryAfterSeconds });
    return NextResponse.json(
      { error: "Too many requests. Please retry shortly.", retryAfterSeconds: rate.retryAfterSeconds },
      { status: 429 }
    );
  }

  const body = await request.json();
  const turnstileToken = request.headers.get("x-turnstile-token");
  const captcha = await verifyTurnstile(turnstileToken);
  if (!captcha.ok) {
    await logAudit("lead_captcha_failed", "security", { ip, reason: captcha.reason ?? "unknown" });
    return NextResponse.json({ error: "Captcha verification failed." }, { status: 403 });
  }

  if (body.type === "invoice_request") {
    const parsedInvoice = invoiceRequestSchema.safeParse(body);
    if (!parsedInvoice.success) {
      return NextResponse.json({ error: "Invalid invoice request payload." }, { status: 400 });
    }

    const requestId = makeId("invreq");
    await saveInvoiceRequest({
      id: requestId,
      createdAt: nowIso(),
      ...parsedInvoice.data
    });
    await logAudit("invoice_request_created", "lead", { requestId, email: parsedInvoice.data.email });
    return NextResponse.json({ leadId: requestId, status: "received" });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lead payload." }, { status: 400 });
  }

  const leadId = makeId("lead");
  await saveLead({
    id: leadId,
    createdAt: nowIso(),
    ...parsed.data
  });

  await logAudit("lead_created", "lead", { leadId, email: parsed.data.workEmail });
  return NextResponse.json({ leadId, status: "captured" });
}
