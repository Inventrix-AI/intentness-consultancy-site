"use client";

import Script from "next/script";
import { useMemo, useState } from "react";
import { servicePackages } from "@/lib/content";
import { estimateInr, formatCurrency, toMinorUnits } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type ClientInfo = {
  name: string;
  email: string;
  country: string;
};

export function PaymentForm() {
  const [serviceId, setServiceId] = useState(servicePackages[0].id);
  const [client, setClient] = useState<ClientInfo>({ name: "", email: "", country: "United States" });
  const [status, setStatus] = useState("");
  const [processing, setProcessing] = useState(false);

  const selectedService = useMemo(
    () => servicePackages.find((item) => item.id === serviceId) ?? servicePackages[0],
    [serviceId]
  );

  const launchCheckout = async () => {
    setProcessing(true);
    setStatus("");

    try {
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          amount: toMinorUnits(selectedService.amount),
          currency: selectedService.currency,
          client
        })
      });

      const orderBody = await orderResponse.json();
      if (!orderResponse.ok) {
        setStatus(orderBody.error ?? "Unable to create payment order.");
        return;
      }

      const razorpay = new window.Razorpay({
        key: orderBody.razorpayKeyId,
        amount: orderBody.amount,
        currency: orderBody.currency,
        name: "Intentness Consultancy",
        description: selectedService.name,
        order_id: orderBody.orderId,
        prefill: {
          name: client.name,
          email: client.email
        },
        theme: {
          color: "#c2410c"
        },
        handler: async (response: Record<string, string>) => {
          const verifyResponse = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          });
          const verifyBody = await verifyResponse.json();
          setStatus(
            verifyBody.status === "verified"
              ? `Payment verified. Reference: ${verifyBody.paymentId}`
              : "Payment failed verification."
          );
        }
      });

      razorpay.open();
    } catch {
      setStatus("Checkout failed to initialize.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card grid gap-4">
          <p className="text-sm font-medium uppercase tracking-wide text-accent">Direct Checkout</p>
          <h2 className="font-display text-2xl font-semibold text-base">Pay for services online</h2>

          <label className="text-sm font-medium text-slate-700">Service package</label>
          <select
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            {servicePackages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.currency} {item.amount})
              </option>
            ))}
          </select>

          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
              placeholder="Client name"
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
            />
            <input
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
              placeholder="Client email"
              type="email"
              value={client.email}
              onChange={(e) => setClient({ ...client, email: e.target.value })}
            />
          </div>

          <input
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
            placeholder="Client country"
            value={client.country}
            onChange={(e) => setClient({ ...client, country: e.target.value })}
          />

          <button
            type="button"
            onClick={launchCheckout}
            disabled={processing}
            className="rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
          >
            {processing ? "Preparing checkout..." : "Proceed to Razorpay Checkout"}
          </button>

          {status ? <p className="text-sm text-slate-700">{status}</p> : null}
        </div>

        <aside className="card">
          <h3 className="font-display text-xl font-semibold text-base">Pricing summary</h3>
          <p className="mt-3 text-sm text-slate-600">{selectedService.summary}</p>

          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p>Original amount: {formatCurrency(selectedService.amount, selectedService.currency)}</p>
            <p>
              Estimated INR equivalent: {formatCurrency(estimateInr(selectedService.amount, selectedService.currency), "INR")}
            </p>
            <p className="text-xs text-slate-500">
              INR shown is indicative only. Final settlement to the Indian account is processed by Razorpay and banking partners.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
