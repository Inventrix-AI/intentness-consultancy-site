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
  if (!iso) return "—";
  return new Date(iso.includes("T") ? iso : iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function fmtAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount);
}

export function InvoiceDetail({ invoiceId }: { invoiceId: string }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionStatus, setActionStatus] = useState("");

  useEffect(() => {
    fetch(`/api/invoices/${invoiceId}`)
      .then((r) => {
        if (r.status === 401) { window.location.href = "/internal/login"; return null; }
        if (r.status === 404) { setError("Invoice not found."); return null; }
        return r.json();
      })
      .then((body) => { if (body) setInvoice(body.invoice); })
      .catch(() => setError("Failed to load invoice."))
      .finally(() => setLoading(false));
  }, [invoiceId]);

  async function resendEmail() {
    setActionStatus("Sending...");
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/send`, { method: "POST" });
      if (res.ok) setActionStatus("Email sent!");
      else setActionStatus("Failed to send.");
    } catch { setActionStatus("Network error."); }
    setTimeout(() => setActionStatus(""), 3000);
  }

  async function updateStatus(newStatus: "paid" | "cancelled") {
    setActionStatus(`Marking as ${newStatus}...`);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInvoice((prev) => prev ? { ...prev, status: newStatus } : prev);
        setActionStatus(`Marked as ${newStatus}.`);
      } else setActionStatus("Failed to update.");
    } catch { setActionStatus("Network error."); }
    setTimeout(() => setActionStatus(""), 3000);
  }

  if (loading) return <p className="py-8 text-center text-sm text-slate-500">Loading...</p>;
  if (error) return <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!invoice) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">{invoice.invoiceNumber}</h2>
          <span className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[invoice.status] ?? "bg-slate-100 text-slate-600"}`}>
            {invoice.status}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`/api/invoices/${invoiceId}/pdf`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            Download PDF
          </a>
          {invoice.status !== "paid" && invoice.status !== "cancelled" && (
            <>
              <button onClick={resendEmail} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                Resend Email
              </button>
              <button onClick={() => updateStatus("paid")} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
                Mark Paid
              </button>
              <button onClick={() => updateStatus("cancelled")} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {actionStatus && <p className="rounded-lg bg-sky-50 px-4 py-2 text-sm text-sky-700">{actionStatus}</p>}

      {/* Invoice Details Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Seller */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">From</p>
            <p className="mt-1 font-semibold text-slate-900">{invoice.seller.legalName}</p>
            <p className="text-sm text-slate-600">{invoice.seller.address}</p>
            {invoice.seller.gstin && <p className="text-sm text-slate-600">GSTIN: {invoice.seller.gstin}</p>}
            <p className="text-sm text-slate-600">PAN: {invoice.seller.pan}</p>
          </div>
          {/* Buyer */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bill To</p>
            <p className="mt-1 font-semibold text-slate-900">{invoice.buyer.company ?? invoice.buyer.name}</p>
            {invoice.buyer.company && <p className="text-sm text-slate-600">{invoice.buyer.name}</p>}
            {invoice.buyer.address && <p className="text-sm text-slate-600">{invoice.buyer.address}</p>}
            {invoice.buyer.gstin && <p className="text-sm text-slate-600">GSTIN: {invoice.buyer.gstin}</p>}
            {invoice.buyer.stateName && <p className="text-sm text-slate-600">State: {invoice.buyer.stateName}</p>}
            <p className="text-sm text-slate-600">{invoice.buyer.email}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500">Invoice Date</p>
            <p className="font-medium text-slate-900">{fmtDate(invoice.invoiceDate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Due Date</p>
            <p className="font-medium text-slate-900">{fmtDate(invoice.dueDate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Currency</p>
            <p className="font-medium text-slate-900">{invoice.currency}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">GST Treatment</p>
            <p className="font-medium text-slate-900 capitalize">{invoice.buyer.gstTreatment}</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="mt-6 overflow-x-auto border-t border-slate-100 pt-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-2 font-semibold text-slate-600">#</th>
                <th className="pb-2 font-semibold text-slate-600">Description</th>
                <th className="pb-2 font-semibold text-slate-600">SAC</th>
                <th className="pb-2 text-right font-semibold text-slate-600">Qty</th>
                <th className="pb-2 text-right font-semibold text-slate-600">Rate</th>
                <th className="pb-2 text-right font-semibold text-slate-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td className="py-2 text-slate-500">{i + 1}</td>
                  <td className="py-2 text-slate-900">{item.description}</td>
                  <td className="py-2 text-slate-500">{item.sacCode}</td>
                  <td className="py-2 text-right text-slate-900">{item.quantity}</td>
                  <td className="py-2 text-right text-slate-900">{item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 text-right font-medium text-slate-900">{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-4 space-y-2 text-right text-sm">
          <div className="flex justify-end gap-8">
            <span className="text-slate-600">Subtotal</span>
            <span className="w-28 font-medium text-slate-900">{invoice.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          {invoice.totalCgst > 0 && (
            <>
              <div className="flex justify-end gap-8">
                <span className="text-slate-600">CGST @ {invoice.gstRatePercent / 2}%</span>
                <span className="w-28 font-medium text-slate-900">{invoice.totalCgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-end gap-8">
                <span className="text-slate-600">SGST @ {invoice.gstRatePercent / 2}%</span>
                <span className="w-28 font-medium text-slate-900">{invoice.totalSgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </>
          )}
          {invoice.totalIgst > 0 && (
            <div className="flex justify-end gap-8">
              <span className="text-slate-600">IGST @ {invoice.gstRatePercent}%</span>
              <span className="w-28 font-medium text-slate-900">{invoice.totalIgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          {invoice.totalTax === 0 && (
            <div className="flex justify-end gap-8">
              <span className="italic text-slate-500">Zero-rated (Export)</span>
              <span className="w-28 text-slate-500">0.00</span>
            </div>
          )}
          <div className="flex justify-end gap-8 border-t border-slate-200 pt-2">
            <span className="text-base font-bold text-slate-900">Grand Total</span>
            <span className="w-28 text-base font-bold text-slate-900">{fmtAmount(invoice.grandTotal, invoice.currency)}</span>
          </div>
        </div>

        {/* Payment Link */}
        {invoice.paymentLinkUrl && (
          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment Link</p>
            <a href={invoice.paymentLinkUrl} target="_blank" rel="noopener noreferrer" className="mt-1 text-sm text-sky-600 hover:text-sky-700">
              {invoice.paymentLinkUrl}
            </a>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notes</p>
            <p className="mt-1 text-sm text-slate-600">{invoice.notes}</p>
          </div>
        )}
      </div>

      <Link href="/internal/invoices" className="inline-flex text-sm font-medium text-slate-600 hover:text-slate-900">
        &larr; Back to Invoices
      </Link>
    </div>
  );
}
