import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";
import { createRazorpayOrder } from "@/lib/razorpay";
import { assertRateLimit } from "@/lib/rate-limit";
import { makeId } from "@/lib/server-utils";
import { saveOrder } from "@/lib/store";
import { nowIso } from "@/lib/utils";
import { createOrderSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rate = assertRateLimit(`create_order:${ip}`, 10, 60_000);

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
    const receipt = makeId("receipt");
    const order = await createRazorpayOrder({
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      receipt,
      notes: {
        serviceId: parsed.data.serviceId,
        clientEmail: parsed.data.client.email,
        clientCountry: parsed.data.client.country
      }
    });

    const orderRecordId = makeId("order");
    await saveOrder({
      id: orderRecordId,
      createdAt: nowIso(),
      serviceId: parsed.data.serviceId,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      client: parsed.data.client,
      razorpayOrderId: order.id,
      status: "created"
    });

    await logAudit("payment_order_created", "payment", {
      orderRecordId,
      razorpayOrderId: order.id,
      amount: parsed.data.amount,
      currency: parsed.data.currency
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    await logAudit("payment_order_failed", "payment", {
      message: error instanceof Error ? error.message : "unknown"
    });
    return NextResponse.json({ error: "Could not create Razorpay order." }, { status: 500 });
  }
}
