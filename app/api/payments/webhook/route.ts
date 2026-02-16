import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { makeId } from "@/lib/server-utils";
import { hasWebhookEvent, markOrderPaid, saveTransaction, saveWebhookEvent } from "@/lib/store";
import { nowIso } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  const eventId = request.headers.get("x-razorpay-event-id") ?? makeId("evt");

  const valid = verifyWebhookSignature(rawBody, signature);
  if (!valid) {
    await logAudit("webhook_signature_invalid", "security", { eventId });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (await hasWebhookEvent(eventId)) {
    return NextResponse.json({ status: "ignored_duplicate", eventId });
  }

  await saveWebhookEvent(eventId);

  const payload = JSON.parse(rawBody) as {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
        };
      };
    };
  };

  const event = payload.event ?? "unknown";
  const payment = payload.payload?.payment?.entity;

  if (event === "payment.captured" && payment?.order_id && payment.id) {
    await markOrderPaid(payment.order_id);
    await saveTransaction({
      id: makeId("tx"),
      createdAt: nowIso(),
      orderId: payment.order_id,
      razorpayPaymentId: payment.id,
      razorpayOrderId: payment.order_id,
      amount: payment.amount ?? 0,
      currency: payment.currency ?? "UNKNOWN",
      settlementCurrency: "INR",
      status: "webhook_paid",
      notes: "Captured via webhook"
    });
  }

  await logAudit("webhook_processed", "webhook", {
    eventId,
    event,
    paymentId: payment?.id,
    orderId: payment?.order_id
  });

  return NextResponse.json({ status: "ok", eventId });
}
