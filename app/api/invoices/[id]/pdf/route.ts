import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getInvoiceById } from "@/lib/store";
import { readInvoicePdf, generateInvoicePdf, saveInvoicePdf } from "@/lib/invoice-pdf";

export const runtime = "nodejs";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const invoice = await getInvoiceById(params.id);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await readInvoicePdf(invoice.pdfFileName ?? `${invoice.invoiceNumber}.pdf`);
  } catch {
    // Regenerate if file is missing
    pdfBuffer = await generateInvoicePdf(invoice);
    await saveInvoicePdf(invoice, pdfBuffer);
  }

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
    },
  });
}
