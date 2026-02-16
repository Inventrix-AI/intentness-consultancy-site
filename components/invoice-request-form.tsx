"use client";

import { useState } from "react";

export function InvoiceRequestForm() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    amountRange: "",
    preferredCurrency: "USD",
    requirement: ""
  });

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
        setStatus("Invoice/payment-link request submitted. Team will respond by email.");
      }
    } catch {
      setStatus("Unexpected error. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card grid gap-3">
      <h3 className="font-display text-xl font-semibold text-base">Need a custom invoice or payment link?</h3>
      <p className="text-sm text-slate-600">
        For enterprise scopes and negotiated contracts, request a Razorpay invoice/payment link.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          required
        />
        <input
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          placeholder="Amount range"
          value={form.amountRange}
          onChange={(e) => setForm({ ...form, amountRange: e.target.value })}
          required
        />
      </div>

      <select
        className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
        value={form.preferredCurrency}
        onChange={(e) => setForm({ ...form, preferredCurrency: e.target.value })}
      >
        <option>USD</option>
        <option>EUR</option>
        <option>GBP</option>
        <option>AED</option>
        <option>INR</option>
      </select>

      <textarea
        className="min-h-24 rounded-xl border border-slate-300 px-4 py-3 text-sm"
        placeholder="Project requirement"
        value={form.requirement}
        onChange={(e) => setForm({ ...form, requirement: e.target.value })}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-base px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Request Invoice Link"}
      </button>

      {status ? <p className="text-sm text-slate-700">{status}</p> : null}
    </form>
  );
}
