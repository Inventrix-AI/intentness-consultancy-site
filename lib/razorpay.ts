import crypto from "node:crypto";

type RazorpayOrderRequest = {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
};

type RazorpayOrderResponse = {
  id: string;
  entity: "order";
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
};

function getCreds() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured");
  }
  return { keyId, keySecret };
}

export async function createRazorpayOrder(payload: RazorpayOrderRequest) {
  const { keyId, keySecret } = getCreds();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Razorpay order creation failed: ${response.status} ${body}`);
  }

  return (await response.json()) as RazorpayOrderResponse;
}

type RazorpayPaymentLinkRequest = {
  amount: number;
  currency: string;
  description: string;
  customer: {
    name: string;
    email: string;
    contact?: string;
  };
  notify: {
    email: boolean;
    sms: boolean;
  };
  reminder_enable: boolean;
  reference_id?: string;
  expire_by?: number;
};

type RazorpayPaymentLinkResponse = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  short_url: string;
  expire_by?: number;
  reference_id?: string;
};

export async function createRazorpayPaymentLink(payload: RazorpayPaymentLinkRequest) {
  const { keyId, keySecret } = getCreds();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/payment_links", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Razorpay payment link creation failed: ${response.status} ${body}`);
  }

  return (await response.json()) as RazorpayPaymentLinkResponse;
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error("Razorpay secret is not configured");
  }

  const payload = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", keySecret).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || !signature) return false;
  const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
