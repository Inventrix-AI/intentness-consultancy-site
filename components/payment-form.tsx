"use client";

import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import type { CurrencyConfig, FxEstimate } from "@/lib/types";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type PayerInfo = {
  name: string;
  email: string;
  country: string;
};

export function PaymentForm() {
  const [currencies, setCurrencies] = useState<CurrencyConfig[]>([]);
  const [currency, setCurrency] = useState("USD");
  const [amountMajor, setAmountMajor] = useState("1000");
  const [purpose, setPurpose] = useState("Consulting Services");
  const [reference, setReference] = useState("");
  const [payer, setPayer] = useState<PayerInfo>({ name: "", email: "", country: "United States" });
  const [fxEstimate, setFxEstimate] = useState<FxEstimate | null>(null);
  const [status, setStatus] = useState("");
  const [processing, setProcessing] = useState(false);

  const parsedAmount = useMemo(() => Number(amountMajor), [amountMajor]);

  useEffect(() => {
    const loadCurrencies = async () => {
      const response = await fetch("/api/payments/currencies");
      const body = await response.json();
      setCurrencies(body.currencies ?? []);
      if ((body.currencies ?? []).length > 0) {
        setCurrency(body.currencies.find((item: CurrencyConfig) => item.code === "USD")?.code ?? body.currencies[0].code);
      }
    };

    loadCurrencies().catch(() => setCurrencies([]));
  }, []);

  useEffect(() => {
    if (!parsedAmount || parsedAmount <= 0) {
      setFxEstimate(null);
      return;
    }

    const id = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/payments/fx-estimate?base=${encodeURIComponent(currency)}&amount=${encodeURIComponent(String(parsedAmount))}`
        );
        const body = await response.json();
        if (response.ok) {
          setFxEstimate(body as FxEstimate);
        }
      } catch {
        setFxEstimate(null);
      }
    }, 250);

    return () => clearTimeout(id);
  }, [currency, parsedAmount]);

  const launchCheckout = async () => {
    setProcessing(true);
    setStatus("");

    try {
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountMajor: parsedAmount,
          currency,
          payer,
          purpose,
          reference,
          fxEstimate: fxEstimate
            ? {
                rate: fxEstimate.rate,
                converted: fxEstimate.converted,
                timestamp: fxEstimate.timestamp
              }
            : undefined
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
        description: purpose || "Consulting Payment",
        order_id: orderBody.orderId,
        prefill: {
          name: payer.name,
          email: payer.email
        },
        notes: {
          reference: reference || "NA"
        },
        theme: {
          color: "#0ea5e9"
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
              ? `Payment verified successfully! Reference: ${verifyBody.paymentId}`
              : "Payment verification failed. Please contact support."
          );
        }
      });

      razorpay.open();
    } catch {
      setStatus("Checkout failed to initialize. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:outline-none";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="grid gap-6">
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">Pay Now</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900">Custom amount checkout</h2>
          <p className="mt-2 text-sm text-slate-500">Enter amount in your preferred currency and continue securely with Razorpay.</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</label>
              <input
                className={inputClass}
                placeholder="1000"
                value={amountMajor}
                onChange={(e) => setAmountMajor(e.target.value)}
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Currency</label>
              <select
                className={inputClass}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {currencies.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code} ({item.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>


          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Payer name</label>
              <input
                className={inputClass}
                placeholder="Full name"
                value={payer.name}
                onChange={(e) => setPayer({ ...payer, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Payer email</label>
              <input
                className={inputClass}
                placeholder="email@company.com"
                type="email"
                value={payer.email}
                onChange={(e) => setPayer({ ...payer, email: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Country</label>
              <input
                className={inputClass}
                placeholder="United States"
                value={payer.country}
                onChange={(e) => setPayer({ ...payer, country: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Reference (optional)</label>
              <input
                className={inputClass}
                placeholder="INV-123 or PO number"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Purpose (optional)</label>
            <input
              className={inputClass}
              placeholder="Consulting Services"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={launchCheckout}
            disabled={processing || !parsedAmount || parsedAmount <= 0}
            className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg disabled:opacity-50"
          >
            {processing ? "Preparing checkout..." : "Proceed to Secure Checkout"}
          </button>

          {status && (
            <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${status.includes("verified") || status.includes("success") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
