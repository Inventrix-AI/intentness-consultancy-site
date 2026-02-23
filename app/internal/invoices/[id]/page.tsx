import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { InvoiceDetail } from "@/components/invoice-detail";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/internal/login");

  return <InvoiceDetail invoiceId={params.id} />;
}
