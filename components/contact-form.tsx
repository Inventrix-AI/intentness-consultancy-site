"use client";

import { useState } from "react";

type LeadPayload = {
  name: string;
  workEmail: string;
  company: string;
  country: string;
  serviceInterest: string;
  message: string;
};

const initialState: LeadPayload = {
  name: "",
  workEmail: "",
  company: "",
  country: "",
  serviceInterest: "Collaboration and CX Management",
  message: ""
};

export function ContactForm() {
  const [form, setForm] = useState<LeadPayload>(initialState);
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const body = await response.json();
      if (!response.ok) {
        setStatus(body.error ?? "Unable to submit request.");
        return;
      }

      setStatus(`Thanks! Your inquiry has been received. We'll be in touch shortly.`);
      setForm(initialState);
    } catch {
      setStatus("Unexpected error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="card">
      <h2 className="font-display text-xl font-semibold text-slate-900">Send us a message</h2>
      <p className="mt-1 text-sm text-slate-500">Fill in the details and we will get back to you within 24 hours.</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Full name</label>
          <input
            className={inputClass}
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Work email</label>
          <input
            className={inputClass}
            placeholder="john@company.com"
            type="email"
            value={form.workEmail}
            onChange={(e) => setForm({ ...form, workEmail: e.target.value })}
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
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Country</label>
          <input
            className={inputClass}
            placeholder="United States"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Service interest</label>
        <select
          className={inputClass}
          value={form.serviceInterest}
          onChange={(e) => setForm({ ...form, serviceInterest: e.target.value })}
        >
          <option>Collaboration and CX Management</option>
          <option>Network and Security</option>
          <option>Audio and Video Integrations</option>
          <option>Custom Software Applications</option>
          <option>Automation</option>
          <option>Managed Services</option>
        </select>
      </div>

      <div className="mt-3">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Message</label>
        <textarea
          className={`${inputClass} min-h-32 resize-y`}
          placeholder="Tell us about your requirements..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg disabled:opacity-60"
      >
        {isLoading ? "Submitting..." : "Submit Inquiry"}
      </button>

      {status && (
        <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${status.startsWith("Thanks") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {status}
        </div>
      )}
    </form>
  );
}
