"use client";

import { useEffect, useState } from "react";
import type { CurrencyConfig } from "@/lib/types";

export function InvoiceRequestForm() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState<CurrencyConfig[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    amountTarget: "",
    preferredCurrency: "USD",
    projectScope: "",
    timeline: ""
  });

  useEffect(() => {
    const loadCurrencies = async () => {
      const response = await fetch("/api/payments/currencies");
      const body = await response.json();
      setCurrencies(body.currencies ?? []);
    };
    loadCurrencies().catch(() => setCurrencies([]));
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "invoice_request" })
      });

      const body = await response.json();
      if (!response.ok) {
        setStatus(body.error ?? "Unable to submit invoice request.");
      } else {
        setStatus("Invoice/payment-link request submitted. Our team will respond by email.");
      }
    } catch {
      setStatus("Unexpected error. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:outline-none";

  return (
    <form onSubmit={submit} className="card">
      <h3 className="font-display text-xl font-semibold text-slate-900">Request Invoice / Payment Link</h3>
      <p className="mt-2 text-sm text-slate-500">
        For enterprise scopes and negotiated contracts, share your requirements and we will issue a tailored Razorpay payment link.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Name</label>
          <input
            className={inputClass}
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
          <input
            className={inputClass}
            placeholder="email@company.com"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Company</label>
          <input
            className={inputClass}
            placeholder="Company name"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Target amount</label>
          <input
            className={inputClass}
            placeholder="e.g. 5000"
            value={form.amountTarget}
            onChange={(e) => setForm({ ...form, amountTarget: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Currency</label>
          <select
            className={inputClass}
            value={form.preferredCurrency}
            onChange={(e) => setForm({ ...form, preferredCurrency: e.target.value })}
          >
            {currencies.map((item) => (
              <option key={item.code}>{item.code}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Timeline (optional)</label>
          <input
            className={inputClass}
            placeholder="e.g. 2 weeks"
            value={form.timeline}
            onChange={(e) => setForm({ ...form, timeline: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Project scope</label>
        <textarea
          className={`${inputClass} min-h-24 resize-y`}
          placeholder="Describe your project scope and requirements..."
          value={form.projectScope}
          onChange={(e) => setForm({ ...form, projectScope: e.target.value })}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Request Payment Link"}
      </button>

      {status && (
        <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${status.includes("submitted") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {status}
        </div>
      )}
    </form>
  );
}
