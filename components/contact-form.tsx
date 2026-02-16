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
  serviceInterest: "Shared Support Pod",
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

      setStatus(`Thanks. Lead captured with ID ${body.leadId}.`);
      setForm(initialState);
    } catch {
      setStatus("Unexpected error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          placeholder="Work email"
          type="email"
          value={form.workEmail}
          onChange={(e) => setForm({ ...form, workEmail: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          required
        />
        <input
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          placeholder="Country"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          required
        />
      </div>

      <select
        className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
        value={form.serviceInterest}
        onChange={(e) => setForm({ ...form, serviceInterest: e.target.value })}
      >
        <option>Shared Support Pod</option>
        <option>Growth Support Cell</option>
        <option>Custom Enterprise Engagement</option>
      </select>

      <textarea
        className="min-h-32 rounded-xl border border-slate-300 px-4 py-3 text-sm"
        placeholder="Tell us your staffing and support goals"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-xl bg-base px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-70"
      >
        {isLoading ? "Submitting..." : "Submit Inquiry"}
      </button>

      {status ? <p className="text-sm text-slate-700">{status}</p> : null}
    </form>
  );
}
