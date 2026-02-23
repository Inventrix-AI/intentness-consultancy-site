import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { getInvoiceById, updateInvoiceStatus } from "@/lib/store";
import { nowIso } from "@/lib/utils";

export const runtime = "nodejs";

const statusSchema = z.object({
  status: z.enum(["paid", "cancelled"]),
});

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const invoice = await getInvoiceById(params.id);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  const body = await request.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status. Must be 'paid' or 'cancelled'." }, { status: 400 });
  }

  const extra = parsed.data.status === "paid" ? { paidAt: nowIso() } : {};
  await updateInvoiceStatus(params.id, parsed.data.status, extra);

  await logAudit(`invoice_${parsed.data.status}`, "invoice", {
    invoiceId: params.id,
    invoiceNumber: invoice.invoiceNumber,
    updatedBy: session.username,
  });

  return NextResponse.json({ status: parsed.data.status });
}
