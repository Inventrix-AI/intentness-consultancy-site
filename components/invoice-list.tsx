"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Invoice } from "@/lib/types";

const statusStyles: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  sent: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
  overdue: "bg-red-100 text-red-600",
};

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount);
}

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/invoices/list")
      .then((r) => {
        if (r.status === 401) {
          window.location.href = "/internal/login";
          return null;
        }
        return r.json();
      })
      .then((body) => {
        if (body) setInvoices(body.invoices ?? []);
      })
      .catch(() => setError("Failed to load invoices."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="py-8 text-center text-sm text-slate-500">Loading invoices...</p>;
  }

  if (error) {
    return <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  }

  if (invoices.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-12 text-center">
        <p className="text-sm text-slate-500">No invoices yet.</p>
        <Link href="/internal/invoices/create" className="mt-3 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800">
          Create your first invoice
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-slate-600">Invoice #</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Client</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Amount</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
            <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invoices.map((inv) => (
            <tr key={inv.id} className="transition-colors hover:bg-slate-50">
              <td className="px-4 py-3">
                <Link href={`/internal/invoices/${inv.id}`} className="font-medium text-sky-600 hover:text-sky-700">
                  {inv.invoiceNumber}
                </Link>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{inv.buyer.company ?? inv.buyer.name}</p>
                <p className="text-xs text-slate-500">{inv.buyer.email}</p>
              </td>
              <td className="px-4 py-3 font-medium text-slate-900">{fmtAmount(inv.grandTotal, inv.currency)}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[inv.status] ?? "bg-slate-100 text-slate-600"}`}>
                  {inv.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{fmtDate(inv.invoiceDate)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <a
                    href={`/api/invoices/${inv.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    PDF
                  </a>
                  <Link
                    href={`/internal/invoices/${inv.id}`}
                    className="rounded border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    View
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
