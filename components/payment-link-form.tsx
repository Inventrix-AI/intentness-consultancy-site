"use client";

import { useEffect, useMemo, useState } from "react";
import type { CurrencyConfig, FxEstimate } from "@/lib/types";

type LinkResult = {
  paymentLinkId: string;
  shortUrl: string;
  amountMajor: number;
  currency: string;
  expiresAt?: string;
  recordId: string;
};

export function PaymentLinkForm() {
  const [currencies, setCurrencies] = useState<CurrencyConfig[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [amountMajor, setAmountMajor] = useState("1000");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("Consulting Services");
  const [reference, setReference] = useState("");
  const [expiryHours, setExpiryHours] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [fxEstimate, setFxEstimate] = useState<FxEstimate | null>(null);
  const [status, setStatus] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<LinkResult | null>(null);
  const [copied, setCopied] = useState(false);

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
        if (response.ok) setFxEstimate(body as FxEstimate);
      } catch {
        setFxEstimate(null);
      }
    }, 250);

    return () => clearTimeout(id);
  }, [currency, parsedAmount]);

  const handleSubmit = async () => {
    setProcessing(true);
    setStatus("");
    setResult(null);

    try {
      const response = await fetch("/api/payments/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientPhone: clientPhone || undefined,
          amountMajor: parsedAmount,
          currency,
          description,
          reference: reference || undefined,
          expiryHours: expiryHours ? Number(expiryHours) : undefined,
          notifyEmail,
          notifySms
        })
      });

      const body = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setStatus("Session expired. Please log in again.");
        } else {
          setStatus(body.error ?? "Failed to create payment link.");
        }
        return;
      }

      setResult(body as LinkResult);
      setStatus("Payment link created successfully!");
    } catch {
      setStatus("Network error. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const copyLink = async () => {
    if (!result?.shortUrl) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-HTTPS environments
      const textarea = document.createElement("textarea");
      textarea.value = result.shortUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:outline-none";

  if (result) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex items-center gap-2 text-emerald-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold">Payment link created!</p>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Share this link with your client</p>
          <div className="mt-2 flex items-center gap-2">
            <input
              readOnly
              value={result.shortUrl}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            />
            <button
              type="button"
              onClick={copyLink}
              className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-slate-800"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Amount</dt>
            <dd className="font-semibold text-slate-800">{result.currency} {result.amountMajor.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Razorpay ID</dt>
            <dd className="font-mono text-xs text-slate-600">{result.paymentLinkId}</dd>
          </div>
          {result.expiresAt && (
            <div className="col-span-2">
              <dt className="text-xs text-slate-500">Expires</dt>
              <dd className="text-slate-700">{new Date(result.expiresAt).toLocaleString()}</dd>
            </div>
          )}
        </dl>

        <button
          type="button"
          onClick={() => {
            setResult(null);
            setStatus("");
            setClientName("");
            setClientEmail("");
            setClientPhone("");
          }}
          className="mt-4 text-sm font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
        >
          Create another link
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Client details */}
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Client Details</p>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Client name</label>
          <input className={inputClass} placeholder="Full name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Client email</label>
          <input className={inputClass} type="email" placeholder="client@company.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
        </div>
      </div>
      <div className="mt-3">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Client phone (optional)</label>
        <input className={inputClass} type="tel" placeholder="+91 9876543210" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
        <p className="mt-1 text-xs text-slate-400">Required if you want Razorpay to send SMS notification</p>
      </div>

      {/* Amount */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Payment Details</p>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</label>
            <input className={inputClass} placeholder="1000" value={amountMajor} onChange={(e) => setAmountMajor(e.target.value)} inputMode="decimal" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Currency</label>
            <select className={inputClass} value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {currencies.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code} ({item.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {fxEstimate && currency !== "INR" && (
          <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50/50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Estimated INR equivalent</p>
            <p className="mt-1 font-display text-lg font-bold text-slate-900">
              INR {fxEstimate.converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Rate: 1 {currency} = {fxEstimate.rate.toFixed(4)} INR
            </p>
          </div>
        )}

        <div className="mt-3">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Description / Purpose</label>
          <input className={inputClass} placeholder="Consulting Services" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Reference (optional)</label>
            <input className={inputClass} placeholder="INV-123 or PO number" value={reference} onChange={(e) => setReference(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Link expires after (hours)</label>
            <input className={inputClass} type="number" placeholder="72 (default: never)" value={expiryHours} onChange={(e) => setExpiryHours(e.target.value)} min="1" max="8760" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Notifications</p>
        <p className="mt-1 text-xs text-slate-400">Razorpay will send the payment link directly to the client</p>
        <div className="mt-3 flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-sky-600" />
            Send email notification
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={notifySms} onChange={(e) => setNotifySms(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-sky-600" />
            Send SMS notification
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={processing || !parsedAmount || parsedAmount <= 0 || !clientName || !clientEmail || !description}
        className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg disabled:opacity-50"
      >
        {processing ? "Creating payment link..." : "Create Payment Link"}
      </button>

      {status && !result && (
        <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${status.includes("success") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {status}
        </div>
      )}
    </div>
  );
}
