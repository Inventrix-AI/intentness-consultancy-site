import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { makeId } from "@/lib/server-utils";
import { hasWebhookEvent, markOrderStatus, markPaymentLinkPaid, saveTransaction, saveWebhookEvent } from "@/lib/store";
import { fromMinorUnits, nowIso } from "@/lib/utils";

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
      payment_link?: {
        entity?: {
          id?: string;
          amount?: number;
          currency?: string;
          status?: string;
          reference_id?: string;
          short_url?: string;
        };
      };
    };
  };

  const event = payload.event ?? "unknown";
  const payment = payload.payload?.payment?.entity;

  if (event === "payment.captured" && payment?.order_id && payment.id) {
    await markOrderStatus(payment.order_id, "captured");
    await saveTransaction({
      id: makeId("tx"),
      createdAt: nowIso(),
      orderId: payment.order_id,
      razorpayPaymentId: payment.id,
      razorpayOrderId: payment.order_id,
      amountMinor: payment.amount ?? 0,
      amountMajor: fromMinorUnits(payment.amount ?? 0, payment.currency ?? "INR"),
      currency: payment.currency ?? "INR",
      settlementCurrency: "INR",
      status: "webhook_paid",
      notes: "Captured via webhook"
    });
    await logAudit("webhook_captured", "webhook", {
      eventId,
      paymentId: payment.id,
      orderId: payment.order_id,
      amount: payment.amount,
      currency: payment.currency
    });
  }

  if (event === "payment.failed" && payment?.order_id) {
    await markOrderStatus(payment.order_id, "failed");
    await logAudit("webhook_failed", "webhook", {
      eventId,
      orderId: payment.order_id,
      paymentId: payment.id
    });
  }

  if (event === "payment_link.paid") {
    const linkEntity = payload.payload?.payment_link?.entity;
    const paymentEntity = payload.payload?.payment?.entity;

    if (linkEntity?.id && paymentEntity?.id) {
      await markPaymentLinkPaid(linkEntity.id, paymentEntity.id);

      await saveTransaction({
        id: makeId("tx"),
        createdAt: nowIso(),
        orderId: linkEntity.id,
        razorpayPaymentId: paymentEntity.id,
        razorpayOrderId: linkEntity.id,
        amountMinor: paymentEntity.amount ?? 0,
        amountMajor: fromMinorUnits(paymentEntity.amount ?? 0, paymentEntity.currency ?? "INR"),
        currency: paymentEntity.currency ?? "INR",
        settlementCurrency: "INR",
        status: "webhook_paid",
        notes: `Payment link paid: ${linkEntity.id}`
      });

      await logAudit("payment_link_paid", "webhook", {
        eventId,
        paymentLinkId: linkEntity.id,
        paymentId: paymentEntity.id,
        amount: paymentEntity.amount,
        currency: paymentEntity.currency
      });
    }
  }

  await logAudit("webhook_processed", "webhook", {
    eventId,
    event,
    paymentId: payment?.id,
    orderId: payment?.order_id
  });

  return NextResponse.json({ status: "ok", eventId });
}
