"use client";

import { useState } from "react";
import { InvoiceRequestForm } from "@/components/invoice-request-form";
import { PaymentForm } from "@/components/payment-form";

export function PaymentsShell() {
  const [tab, setTab] = useState<"pay" | "invoice">("pay");

  return (
    <div className="grid gap-6">
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab("pay")}
          className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
            tab === "pay"
              ? "text-sky-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Pay Now (Custom Amount)
          {tab === "pay" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-sky-500" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("invoice")}
          className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
            tab === "invoice"
              ? "text-sky-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Request Invoice/Link
          {tab === "invoice" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-sky-500" />
          )}
        </button>
      </div>

      {tab === "pay" ? <PaymentForm /> : <InvoiceRequestForm />}
    </div>
  );
}
