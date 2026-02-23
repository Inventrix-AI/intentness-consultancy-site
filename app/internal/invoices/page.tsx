import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { InvoiceList } from "@/components/invoice-list";

export default async function InvoiceListPage() {
  const session = await getSession();
  if (!session) redirect("/internal/login");

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">Admin</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-slate-900">Invoices</h1>
        <p className="mt-1 text-sm text-slate-500">View and manage all invoices.</p>
      </div>
      <InvoiceList />
    </div>
  );
}
