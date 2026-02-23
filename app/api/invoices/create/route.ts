import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { companyProfile } from "@/lib/content";
import { calculateTax, determineTaxType } from "@/lib/gst";
import { INDIAN_STATES } from "@/lib/indian-states";
import { generateInvoicePdf } from "@/lib/invoice-pdf";
import { sendInvoiceEmail } from "@/lib/email";
import { createRazorpayPaymentLink } from "@/lib/razorpay";
import { assertRateLimit } from "@/lib/rate-limit";
import { makeId } from "@/lib/server-utils";
import { getNextInvoiceNumber, saveInvoice, updateInvoice } from "@/lib/store";
import { nowIso, toMinorUnits } from "@/lib/utils";
import { createInvoiceSchema } from "@/lib/validators";
import type { Invoice, InvoiceBuyer, InvoiceLineItem, InvoiceSeller } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rate = assertRateLimit(`create_invoice:${ip}`, 5, 60_000);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please retry shortly.", retryAfterSeconds: rate.retryAfterSeconds },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = createInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid payload.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  let invoiceId = "";

  try {
    const d = parsed.data;
    const now = nowIso();
    const invoiceNumber = await getNextInvoiceNumber();
    invoiceId = makeId("inv");

    // ── Step 1: Build invoice data (pure computation, no side effects) ──

    const seller: InvoiceSeller = {
      legalName: companyProfile.legalName,
      brandName: companyProfile.brandName,
      gstin: companyProfile.gstin,
      pan: companyProfile.pan,
      cin: companyProfile.cin,
      address: companyProfile.registeredAddress,
      stateCode: companyProfile.stateCode,
      stateName: companyProfile.stateName,
      email: companyProfile.invoiceEmail,
      phone: companyProfile.contactPhone,
    };

    const buyer: InvoiceBuyer = {
      name: d.buyerName,
      email: d.buyerEmail,
      company: d.buyerCompany,
      phone: d.buyerPhone,
      address: d.buyerAddress,
      country: d.buyerCountry,
      gstin: d.buyerGstin,
      stateCode: d.buyerStateCode,
      stateName: d.buyerStateCode ? INDIAN_STATES[d.buyerStateCode] : undefined,
      gstTreatment: d.gstTreatment,
    };

    const taxType = determineTaxType(d.gstTreatment, seller.stateCode, d.buyerStateCode);

    const lineItems: InvoiceLineItem[] = d.lineItems.map((item) => {
      const amount = round2(item.quantity * item.unitPrice);
      const taxBreakdown = calculateTax(amount, d.gstRatePercent, taxType);
      return {
        description: item.description,
        sacCode: item.sacCode,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount,
        taxBreakdown,
        totalWithTax: round2(amount + taxBreakdown.totalTax),
      };
    });

    const subtotal = round2(lineItems.reduce((s, li) => s + li.amount, 0));
    const totalCgst = round2(lineItems.reduce((s, li) => s + (li.taxBreakdown.cgstAmount ?? 0), 0));
    const totalSgst = round2(lineItems.reduce((s, li) => s + (li.taxBreakdown.sgstAmount ?? 0), 0));
    const totalIgst = round2(lineItems.reduce((s, li) => s + (li.taxBreakdown.igstAmount ?? 0), 0));
    const totalTax = round2(totalCgst + totalSgst + totalIgst);
    const grandTotal = round2(subtotal + totalTax);

    // ── Step 2: Save invoice as "draft" (consumes the number, prevents collisions) ──

    const invoice: Invoice = {
      id: invoiceId,
      invoiceNumber,
      createdAt: now,
      updatedAt: now,
      invoiceDate: d.invoiceDate,
      dueDate: d.dueDate,
      status: "draft",
      seller,
      buyer,
      lineItems,
      currency: d.currency,
      subtotal,
      totalCgst,
      totalSgst,
      totalIgst,
      totalTax,
      grandTotal,
      gstRatePercent: d.gstRatePercent,
      notes: d.notes,
      termsAndConditions: d.termsAndConditions,
      pdfGenerated: false,
      createdBy: session.username,
    };

    await saveInvoice(invoice);

    // ── Step 3: Generate PDF (local, no external side effects — safe to fail) ──
    // First pass without payment link (validates PDF engine works)

    const pdfBufferDraft = await generateInvoicePdf(invoice);

    // ── Step 4: Create Razorpay payment link (external API) ──

    const amountMinor = toMinorUnits(grandTotal, d.currency);
    const expireBy = d.paymentLinkExpiryHours
      ? Math.floor(Date.now() / 1000) + d.paymentLinkExpiryHours * 3600
      : Math.floor(Date.now() / 1000) + 720 * 3600; // default 30 days

    const rpLink = await createRazorpayPaymentLink({
      amount: amountMinor,
      currency: d.currency,
      description: `Invoice ${invoiceNumber}`,
      customer: {
        name: d.buyerName,
        email: d.buyerEmail,
        contact: d.buyerPhone || undefined,
      },
      notify: {
        email: d.notifyEmail,
        sms: d.notifySms,
      },
      reminder_enable: true,
      reference_id: invoiceId,
      expire_by: expireBy,
    });

    // ── Step 5: Regenerate PDF with payment link embedded ──

    invoice.paymentLinkId = makeId("plink");
    invoice.razorpayLinkId = rpLink.id;
    invoice.paymentLinkUrl = rpLink.short_url;

    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await generateInvoicePdf(invoice);
    } catch {
      // If regeneration fails, fall back to the draft PDF (without payment link)
      pdfBuffer = pdfBufferDraft;
    }

    // ── Step 6: Update invoice to "sent" with all details ──

    await updateInvoice(invoiceId, {
      status: "sent",
      paymentLinkId: invoice.paymentLinkId,
      razorpayLinkId: rpLink.id,
      paymentLinkUrl: rpLink.short_url,
    });

    // ── Step 7: Send email (fire-and-forget) ──

    void sendInvoiceEmail(invoice, pdfBuffer)
      .then(async () => {
        await updateInvoice(invoiceId, { emailSentAt: nowIso() });
      })
      .catch((err) => console.error("[email] invoice send failed:", err));

    await logAudit("invoice_created", "invoice", {
      invoiceId,
      invoiceNumber,
      grandTotal,
      currency: d.currency,
      buyerEmail: d.buyerEmail,
      razorpayLinkId: rpLink.id,
      createdBy: session.username,
    });

    return NextResponse.json({
      invoice: {
        id: invoiceId,
        invoiceNumber,
        grandTotal,
        currency: d.currency,
        status: "sent",
        buyerEmail: d.buyerEmail,
      },
      paymentLinkUrl: rpLink.short_url,
    });
  } catch (error) {
    console.error("[invoice] create failed:", error);
    await logAudit("invoice_create_failed", "invoice", {
      invoiceId: invoiceId || undefined,
      message: error instanceof Error ? error.message : "unknown",
    });
    // If invoice was saved as "draft", it stays visible in admin for retry/cleanup
    return NextResponse.json({ error: "Could not create invoice." }, { status: 500 });
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
