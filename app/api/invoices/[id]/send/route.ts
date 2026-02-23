import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { sendInvoiceEmail } from "@/lib/email";
import { generateInvoicePdf } from "@/lib/invoice-pdf";
import { getInvoiceById, updateInvoiceStatus } from "@/lib/store";
import { nowIso } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const invoice = await getInvoiceById(params.id);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  const pdfBuffer = await generateInvoicePdf(invoice);

  try {
    await sendInvoiceEmail(invoice, pdfBuffer);
    await updateInvoiceStatus(invoice.id, "sent", { emailSentAt: nowIso() });
    await logAudit("invoice_resent", "invoice", {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      buyerEmail: invoice.buyer.email,
      resentBy: session.username,
    });
    return NextResponse.json({ status: "sent" });
  } catch (error) {
    console.error("[email] invoice resend failed:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
