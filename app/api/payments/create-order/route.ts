import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";
import { createRazorpayOrder } from "@/lib/razorpay";
import { assertRateLimit } from "@/lib/rate-limit";
import { makeId } from "@/lib/server-utils";
import { saveOrder } from "@/lib/store";
import { nowIso, toMinorUnits } from "@/lib/utils";
import { createOrderSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rate = assertRateLimit(`create_order:${ip}`, 12, 60_000);

  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many payment attempts. Please retry shortly.", retryAfterSeconds: rate.retryAfterSeconds },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order payload." }, { status: 400 });
  }

  try {
    const amountMinor = toMinorUnits(parsed.data.amountMajor, parsed.data.currency);
    const receipt = makeId("receipt");

    const order = await createRazorpayOrder({
      amount: amountMinor,
      currency: parsed.data.currency,
      receipt,
      notes: {
        payerEmail: parsed.data.payer.email,
        payerCountry: parsed.data.payer.country,
        purpose: parsed.data.purpose ?? "NA",
        reference: parsed.data.reference ?? "NA"
      }
    });

    const orderRecordId = makeId("order");
    await saveOrder({
      id: orderRecordId,
      createdAt: nowIso(),
      amountMajor: parsed.data.amountMajor,
      amountMinor,
      currency: parsed.data.currency,
      payer: parsed.data.payer,
      purpose: parsed.data.purpose,
      reference: parsed.data.reference,
      fxEstimate: parsed.data.fxEstimate
        ? {
            base: parsed.data.currency,
            quote: "INR",
            amountMajor: parsed.data.amountMajor,
            rate: parsed.data.fxEstimate.rate,
            converted: parsed.data.fxEstimate.converted,
            timestamp: parsed.data.fxEstimate.timestamp,
            provider: "client_estimate",
            fallback: false
          }
        : undefined,
      razorpayOrderId: order.id,
      status: "created"
    });

    await logAudit("payment_order_created", "payment", {
      orderRecordId,
      razorpayOrderId: order.id,
      amountMinor,
      amountMajor: parsed.data.amountMajor,
      currency: parsed.data.currency
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      amountMajor: parsed.data.amountMajor,
      currency: order.currency
    });
  } catch (error) {
    await logAudit("payment_order_failed", "payment", {
      message: error instanceof Error ? error.message : "unknown"
    });
    return NextResponse.json({ error: "Could not create Razorpay order." }, { status: 500 });
  }
}
