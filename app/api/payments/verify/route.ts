import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { makeId } from "@/lib/server-utils";
import { markOrderPaid, saveTransaction } from "@/lib/store";
import { nowIso } from "@/lib/utils";
import { verifyPaymentSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = verifyPaymentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid verification payload." }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  let isValid = false;
  try {
    isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  } catch (error) {
    await logAudit("payment_verification_error", "payment", {
      message: error instanceof Error ? error.message : "unknown"
    });
    return NextResponse.json({ status: "failed" }, { status: 500 });
  }

  if (!isValid) {
    await logAudit("payment_verification_failed", "payment", {
      razorpay_order_id,
      razorpay_payment_id
    });
    return NextResponse.json({ status: "failed" }, { status: 400 });
  }

  const paymentId = makeId("pay");
  await saveTransaction({
    id: paymentId,
    createdAt: nowIso(),
    orderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpayOrderId: razorpay_order_id,
    amount: 0,
    currency: "UNKNOWN",
    settlementCurrency: "INR",
    status: "verified",
    notes: "Client-side verification callback"
  });
  await markOrderPaid(razorpay_order_id);

  await logAudit("payment_verified", "payment", {
    paymentId,
    razorpay_order_id,
    razorpay_payment_id
  });

  return NextResponse.json({ status: "verified", paymentId });
}
