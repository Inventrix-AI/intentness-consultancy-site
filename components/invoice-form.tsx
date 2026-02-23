"use client";

import { useEffect, useMemo, useState } from "react";
import type { CurrencyConfig } from "@/lib/types";
import { INDIAN_STATE_OPTIONS } from "@/lib/indian-states";

type LineItemInput = {
  description: string;
  sacCode: string;
  quantity: string;
  unitPrice: string;
};

type InvoiceResult = {
  invoice: {
    id: string;
    invoiceNumber: string;
    grandTotal: number;
    currency: string;
    status: string;
    buyerEmail: string;
  };
  paymentLinkUrl: string;
  pdfFileName: string;
};

const GST_RATES = [0, 5, 12, 18, 28];

const inputClass =
  "block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";
const sectionClass = "border-t border-slate-100 pt-5";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function plus30(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

export function InvoiceForm() {
  const [currencies, setCurrencies] = useState<CurrencyConfig[]>([]);

  // Client details
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerCompany, setBuyerCompany] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerCountry, setBuyerCountry] = useState("India");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [gstTreatment, setGstTreatment] = useState<"registered" | "unregistered" | "export" | "sez">("unregistered");
  const [buyerGstin, setBuyerGstin] = useState("");
  const [buyerStateCode, setBuyerStateCode] = useState("");

  // Line items
  const [lineItems, setLineItems] = useState<LineItemInput[]>([
    { description: "", sacCode: "998311", quantity: "1", unitPrice: "" },
  ]);

  // Invoice meta
  const [currency, setCurrency] = useState("INR");
  const [invoiceDate, setInvoiceDate] = useState(today());
  const [dueDate, setDueDate] = useState(plus30());
  const [gstRatePercent, setGstRatePercent] = useState(18);
  const [notes, setNotes] = useState("Thank you for your business!");
  const [terms, setTerms] = useState("");

  // Payment link config
  const [expiryHours, setExpiryHours] = useState("720");
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifySms, setNotifySms] = useState(false);

  // State
  const [status, setStatus] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<InvoiceResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-set GST treatment based on country
  useEffect(() => {
    if (buyerCountry.toLowerCase() !== "india") {
      setGstTreatment("export");
    } else if (gstTreatment === "export") {
      setGstTreatment("unregistered");
    }
  }, [buyerCountry]);

  // Load currencies
  useEffect(() => {
    fetch("/api/payments/currencies")
      .then((r) => r.json())
      .then((body) => {
        setCurrencies(body.currencies ?? []);
      })
      .catch(() => setCurrencies([]));
  }, []);

  // Computed totals
  const computedItems = useMemo(() => {
    return lineItems.map((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      return { ...item, amount: Math.round(qty * price * 100) / 100 };
    });
  }, [lineItems]);

  const subtotal = useMemo(
    () => Math.round(computedItems.reduce((s, i) => s + i.amount, 0) * 100) / 100,
    [computedItems]
  );

  const isExport = gstTreatment === "export" || gstTreatment === "sez";
  const isSameState = !isExport && buyerStateCode === "10"; // 10 = Bihar (seller's state)

  const taxInfo = useMemo(() => {
    if (isExport) return { type: "zero", cgst: 0, sgst: 0, igst: 0, total: 0 };
    if (isSameState) {
      const half = gstRatePercent / 2;
      const cgst = Math.round(subtotal * half / 100 * 100) / 100;
      const sgst = Math.round(subtotal * half / 100 * 100) / 100;
      return { type: "cgst_sgst", cgst, sgst, igst: 0, total: Math.round((cgst + sgst) * 100) / 100 };
    }
    const igst = Math.round(subtotal * gstRatePercent / 100 * 100) / 100;
    return { type: "igst", cgst: 0, sgst: 0, igst, total: igst };
  }, [subtotal, gstRatePercent, isExport, isSameState]);

  const grandTotal = Math.round((subtotal + taxInfo.total) * 100) / 100;

  function updateLineItem(index: number, field: keyof LineItemInput, value: string) {
    setLineItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function addLineItem() {
    setLineItems((prev) => [...prev, { description: "", sacCode: "998311", quantity: "1", unitPrice: "" }]);
  }

  function removeLineItem(index: number) {
    setLineItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    setProcessing(true);

    try {
      const payload = {
        buyerName,
        buyerEmail,
        buyerCompany: buyerCompany || undefined,
        buyerPhone: buyerPhone || undefined,
        buyerAddress: buyerAddress || undefined,
        buyerCountry,
        buyerGstin: buyerGstin || undefined,
        buyerStateCode: buyerStateCode || undefined,
        gstTreatment,
        lineItems: lineItems.map((item) => ({
          description: item.description,
          sacCode: item.sacCode || "998311",
          quantity: Number(item.quantity) || 1,
          unitPrice: Number(item.unitPrice) || 0,
        })),
        currency,
        invoiceDate,
        dueDate,
        gstRatePercent,
        notes: notes || undefined,
        termsAndConditions: terms || undefined,
        paymentLinkExpiryHours: expiryHours ? Number(expiryHours) : undefined,
        notifyEmail,
        notifySms,
      };

      const res = await fetch("/api/invoices/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setStatus("Session expired. Please log in again.");
          setTimeout(() => (window.location.href = "/internal/login"), 1500);
          return;
        }
        setStatus(body.error ?? "Something went wrong.");
        return;
      }

      setResult(body);
    } catch {
      setStatus("Network error. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  function resetForm() {
    setResult(null);
    setStatus("");
    setBuyerName("");
    setBuyerEmail("");
    setBuyerCompany("");
    setBuyerPhone("");
    setBuyerAddress("");
    setBuyerCountry("India");
    setGstTreatment("unregistered");
    setBuyerGstin("");
    setBuyerStateCode("");
    setLineItems([{ description: "", sacCode: "998311", quantity: "1", unitPrice: "" }]);
    setCurrency("INR");
    setInvoiceDate(today());
    setDueDate(plus30());
    setGstRatePercent(18);
    setNotes("Thank you for your business!");
    setTerms("");
    setExpiryHours("720");
  }

  async function copyLink() {
    if (!result?.paymentLinkUrl) return;
    await navigator.clipboard.writeText(result.paymentLinkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Success screen
  if (result) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex items-center gap-2 text-emerald-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="font-display text-lg font-semibold">Invoice Created & Sent!</h3>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Invoice Number</p>
            <p className="text-lg font-semibold text-slate-900">{result.invoice.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Grand Total</p>
            <p className="text-lg font-semibold text-slate-900">
              {result.invoice.currency} {result.invoice.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sent to</p>
            <p className="text-sm text-slate-700">{result.invoice.buyerEmail}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment Link</p>
            <div className="mt-1 flex items-center gap-2">
              <input
                readOnly
                value={result.paymentLinkUrl}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              />
              <button
                onClick={copyLink}
                className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <a
              href={`/api/invoices/${result.invoice.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Download PDF
            </a>
            <button
              onClick={resetForm}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Create Another Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Client Details ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-slate-900">Client Details</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Client Name *</label>
            <input type="text" required value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className={inputClass} placeholder="Acme Corp" />
          </div>
          <div>
            <label className={labelClass}>Client Email *</label>
            <input type="email" required value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} className={inputClass} placeholder="billing@acme.com" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Company</label>
            <input type="text" value={buyerCompany} onChange={(e) => setBuyerCompany(e.target.value)} className={inputClass} placeholder="Acme Corp Pvt Ltd" />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} className={inputClass} placeholder="+91 98765 43210" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Country *</label>
            <input type="text" required value={buyerCountry} onChange={(e) => setBuyerCountry(e.target.value)} className={inputClass} placeholder="India" />
          </div>
          <div>
            <label className={labelClass}>GST Treatment *</label>
            <select value={gstTreatment} onChange={(e) => setGstTreatment(e.target.value as typeof gstTreatment)} className={inputClass}>
              <option value="registered">Registered Business (has GSTIN)</option>
              <option value="unregistered">Unregistered Business</option>
              <option value="export">Export (International)</option>
              <option value="sez">SEZ</option>
            </select>
          </div>
        </div>

        {gstTreatment === "registered" && (
          <div>
            <label className={labelClass}>GSTIN *</label>
            <input type="text" required value={buyerGstin} onChange={(e) => setBuyerGstin(e.target.value.toUpperCase())} className={inputClass} placeholder="29AABCU9603R1ZM" maxLength={15} />
          </div>
        )}

        {buyerCountry.toLowerCase() === "india" && (
          <div>
            <label className={labelClass}>State *</label>
            <select required value={buyerStateCode} onChange={(e) => setBuyerStateCode(e.target.value)} className={inputClass}>
              <option value="">Select state</option>
              {INDIAN_STATE_OPTIONS.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className={labelClass}>Address</label>
          <textarea value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} className={inputClass} rows={2} placeholder="Full billing address" />
        </div>
      </fieldset>

      {/* ── Line Items ── */}
      <fieldset className={`space-y-3 ${sectionClass}`}>
        <legend className="text-sm font-semibold text-slate-900">Line Items</legend>

        {lineItems.map((item, i) => (
          <div key={i} className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_80px_60px_100px_40px]">
              <div>
                <label className={labelClass}>Description *</label>
                <input type="text" required value={item.description} onChange={(e) => updateLineItem(i, "description", e.target.value)} className={inputClass} placeholder="Consulting Services" />
              </div>
              <div>
                <label className={labelClass}>SAC</label>
                <input type="text" value={item.sacCode} onChange={(e) => updateLineItem(i, "sacCode", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Qty</label>
                <input type="number" min="1" value={item.quantity} onChange={(e) => updateLineItem(i, "quantity", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Unit Price *</label>
                <input type="number" required min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateLineItem(i, "unitPrice", e.target.value)} className={inputClass} placeholder="0.00" />
              </div>
              <div className="flex items-end">
                <button type="button" onClick={() => removeLineItem(i)} className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500" title="Remove">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-2 text-right text-sm text-slate-500">
              Amount: <span className="font-medium text-slate-900">{computedItems[i]?.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        ))}

        <button type="button" onClick={addLineItem} className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-sky-400 hover:text-sky-600">
          + Add Line Item
        </button>
      </fieldset>

      {/* ── Tax Preview ── */}
      <div className={`rounded-lg border border-slate-200 bg-slate-50 p-4 ${sectionClass}`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tax Summary</p>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-medium text-slate-900">{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          {isExport ? (
            <div className="flex justify-between">
              <span className="text-slate-500 italic">Zero-rated (Export of Services)</span>
              <span className="text-slate-500">0.00</span>
            </div>
          ) : isSameState ? (
            <>
              <div className="flex justify-between">
                <span className="text-slate-600">CGST @ {gstRatePercent / 2}%</span>
                <span className="font-medium text-slate-900">{taxInfo.cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">SGST @ {gstRatePercent / 2}%</span>
                <span className="font-medium text-slate-900">{taxInfo.sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span className="text-slate-600">IGST @ {gstRatePercent}%</span>
              <span className="font-medium text-slate-900">{taxInfo.igst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-200 pt-2">
            <span className="font-semibold text-slate-900">Grand Total</span>
            <span className="text-lg font-bold text-slate-900">{currency} {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* ── Invoice Details ── */}
      <fieldset className={`space-y-4 ${sectionClass}`}>
        <legend className="text-sm font-semibold text-slate-900">Invoice Details</legend>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Currency *</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass}>
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Invoice Date *</label>
            <input type="date" required value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Due Date *</label>
            <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>GST Rate</label>
          <select value={gstRatePercent} onChange={(e) => setGstRatePercent(Number(e.target.value))} className={inputClass}>
            {GST_RATES.map((r) => (
              <option key={r} value={r}>{r}%{r === 18 ? " (Standard for IT Services)" : ""}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} rows={2} />
        </div>

        <div>
          <label className={labelClass}>Terms & Conditions</label>
          <textarea value={terms} onChange={(e) => setTerms(e.target.value)} className={inputClass} rows={2} placeholder="Payment due within 30 days of invoice date." />
        </div>
      </fieldset>

      {/* ── Payment Link Config ── */}
      <fieldset className={`space-y-4 ${sectionClass}`}>
        <legend className="text-sm font-semibold text-slate-900">Payment Link</legend>
        <div>
          <label className={labelClass}>Link Expiry (hours)</label>
          <input type="number" value={expiryHours} onChange={(e) => setExpiryHours(e.target.value)} className={inputClass} placeholder="720 (30 days)" min="1" max="8760" />
          <p className="mt-1 text-xs text-slate-400">Default: 720 hours (30 days)</p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-400">Invoice email with PDF &amp; payment link is always sent. These are <em>additional</em> Razorpay notifications:</p>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} className="rounded border-slate-300" />
              Razorpay email reminder
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={notifySms} onChange={(e) => setNotifySms(e.target.checked)} className="rounded border-slate-300" />
              Razorpay SMS reminder
            </label>
          </div>
        </div>
      </fieldset>

      {/* ── Submit ── */}
      {status && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{status}</p>
      )}

      <button
        type="submit"
        disabled={processing || !buyerName || !buyerEmail || grandTotal <= 0}
        className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {processing ? "Creating Invoice..." : `Generate Invoice & Send — ${currency} ${grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
      </button>
    </form>
  );
}
