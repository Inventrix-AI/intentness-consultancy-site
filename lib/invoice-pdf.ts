import PDFDocument from "pdfkit";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Invoice } from "@/lib/types";

const INVOICES_DIR = path.join(process.cwd(), "data", "invoices");
const LOGO_PATH = path.join(process.cwd(), "public", "intentness-logo-icon.png");

/* ── Colours ── */
const BRAND = "#0f172a";       // slate-900
const ACCENT = "#0284c7";      // sky-600
const MUTED = "#64748b";       // slate-500
const BORDER = "#e2e8f0";      // slate-200
const HEADER_BG = "#f1f5f9";   // slate-100
const WHITE = "#ffffff";

/* ── Helpers ── */

function fmt(n: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function fmtNum(n: number): string {
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function fmtDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** Convert a number to Indian words (supports up to 99,99,99,999). */
function amountToWords(n: number): string {
  if (n === 0) return "Zero Only";

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function twoDigits(num: number): string {
    if (num < 20) return ones[num];
    return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
  }

  function threeDigits(num: number): string {
    if (num >= 100) {
      return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " and " + twoDigits(num % 100) : "");
    }
    return twoDigits(num);
  }

  const intPart = Math.floor(n);
  const parts: string[] = [];
  let remaining = intPart;

  if (remaining >= 10000000) {
    parts.push(twoDigits(Math.floor(remaining / 10000000)) + " Crore");
    remaining %= 10000000;
  }
  if (remaining >= 100000) {
    parts.push(twoDigits(Math.floor(remaining / 100000)) + " Lakh");
    remaining %= 100000;
  }
  if (remaining >= 1000) {
    parts.push(twoDigits(Math.floor(remaining / 1000)) + " Thousand");
    remaining %= 1000;
  }
  if (remaining > 0) {
    parts.push(threeDigits(remaining));
  }

  let result = parts.join(" ");

  const decPart = Math.round((n - intPart) * 100);
  if (decPart > 0) {
    result += " and " + twoDigits(decPart) + " Paise";
  }

  return result + " Only";
}

/* ── PDF Drawing ── */

function drawLine(doc: PDFKit.PDFDocument, y: number) {
  doc.moveTo(50, y).lineTo(545, y).strokeColor(BORDER).lineWidth(0.5).stroke();
}

function drawHeader(doc: PDFKit.PDFDocument, invoice: Invoice) {
  const s = invoice.seller;

  // Try to add logo
  try {
    doc.image(LOGO_PATH, 50, 40, { width: 40, height: 40 });
  } catch { /* logo not found — skip */ }

  doc.fontSize(14).fillColor(BRAND).font("Helvetica-Bold").text(s.legalName, 100, 45, { width: 400 });
  doc.fontSize(7.5).fillColor(MUTED).font("Helvetica");
  let y = 64;
  if (s.gstin) { doc.text(`GSTIN: ${s.gstin}`, 100, y); y += 10; }
  doc.text(`CIN: ${s.cin}  |  PAN: ${s.pan}`, 100, y); y += 10;
  doc.text(s.address, 100, y); y += 10;
  doc.text(`${s.email}  |  ${s.phone}`, 100, y);

  // TAX INVOICE title
  y += 24;
  doc.fontSize(18).fillColor(ACCENT).font("Helvetica-Bold").text("TAX INVOICE", 50, y, { width: 495, align: "center" });
  drawLine(doc, y + 26);
}

function drawMeta(doc: PDFKit.PDFDocument, invoice: Invoice): number {
  let y = 150;
  const col2 = 310;

  doc.fontSize(8).fillColor(MUTED).font("Helvetica");
  doc.text("Invoice Number", 50, y);
  doc.text("Invoice Date", col2, y);
  y += 12;
  doc.fontSize(9.5).fillColor(BRAND).font("Helvetica-Bold");
  doc.text(invoice.invoiceNumber, 50, y);
  doc.text(fmtDate(invoice.invoiceDate), col2, y);
  y += 18;

  doc.fontSize(8).fillColor(MUTED).font("Helvetica");
  doc.text("Place of Supply", 50, y);
  doc.text("Due Date", col2, y);
  y += 12;
  doc.fontSize(9.5).fillColor(BRAND).font("Helvetica-Bold");
  const placeOfSupply = invoice.buyer.stateName ?? invoice.buyer.country;
  doc.text(placeOfSupply, 50, y);
  doc.text(fmtDate(invoice.dueDate), col2, y);
  y += 18;
  drawLine(doc, y);
  return y + 8;
}

function drawBillTo(doc: PDFKit.PDFDocument, invoice: Invoice, startY: number): number {
  let y = startY;
  const b = invoice.buyer;

  doc.fontSize(8).fillColor(ACCENT).font("Helvetica-Bold").text("BILL TO", 50, y);
  y += 14;
  doc.fontSize(10).fillColor(BRAND).font("Helvetica-Bold").text(b.company ?? b.name, 50, y, { width: 300 });
  y += 14;
  if (b.company) { doc.fontSize(8.5).fillColor(MUTED).font("Helvetica").text(b.name, 50, y); y += 12; }
  if (b.address) { doc.fontSize(8.5).fillColor(MUTED).font("Helvetica").text(b.address, 50, y, { width: 250 }); y += 12; }
  if (b.gstin) { doc.fontSize(8.5).fillColor(MUTED).font("Helvetica").text(`GSTIN: ${b.gstin}`, 50, y); y += 12; }
  if (b.stateName) { doc.fontSize(8.5).fillColor(MUTED).font("Helvetica").text(`State: ${b.stateName}`, 50, y); y += 12; }
  doc.fontSize(8.5).fillColor(MUTED).font("Helvetica").text(b.email, 50, y); y += 12;
  if (b.phone) { doc.text(b.phone, 50, y); y += 12; }

  y += 8;
  drawLine(doc, y);
  return y + 8;
}

function drawLineItems(doc: PDFKit.PDFDocument, invoice: Invoice, startY: number): number {
  let y = startY;

  // Table header
  doc.rect(50, y, 495, 18).fill(HEADER_BG);
  doc.fontSize(7).fillColor(MUTED).font("Helvetica-Bold");
  doc.text("#", 55, y + 5, { width: 20 });
  doc.text("Description", 75, y + 5, { width: 180 });
  doc.text("SAC", 260, y + 5, { width: 50 });
  doc.text("Qty", 315, y + 5, { width: 40, align: "right" });
  doc.text("Rate", 360, y + 5, { width: 70, align: "right" });
  doc.text("Amount", 435, y + 5, { width: 105, align: "right" });
  y += 22;

  // Table rows
  doc.font("Helvetica").fillColor(BRAND).fontSize(8);
  invoice.lineItems.forEach((item, i) => {
    if (y > 720) {
      doc.addPage();
      y = 50;
    }
    doc.text(String(i + 1), 55, y, { width: 20 });
    doc.text(item.description, 75, y, { width: 180 });
    doc.text(item.sacCode, 260, y, { width: 50 });
    doc.text(String(item.quantity), 315, y, { width: 40, align: "right" });
    doc.text(fmtNum(item.unitPrice), 360, y, { width: 70, align: "right" });
    doc.text(fmtNum(item.amount), 435, y, { width: 105, align: "right" });
    y += 16;
    drawLine(doc, y - 4);
  });

  return y + 4;
}

function drawTotals(doc: PDFKit.PDFDocument, invoice: Invoice, startY: number): number {
  let y = startY;
  const labelX = 360;
  const valX = 435;
  const valW = 105;

  function row(label: string, value: string, bold = false) {
    doc.fontSize(8.5).fillColor(MUTED).font("Helvetica").text(label, labelX, y, { width: 70, align: "right" });
    doc.fillColor(BRAND).font(bold ? "Helvetica-Bold" : "Helvetica").text(value, valX, y, { width: valW, align: "right" });
    y += 16;
  }

  row("Subtotal", fmtNum(invoice.subtotal));

  if (invoice.totalCgst > 0) {
    row(`CGST @ ${invoice.gstRatePercent / 2}%`, fmtNum(invoice.totalCgst));
    row(`SGST @ ${invoice.gstRatePercent / 2}%`, fmtNum(invoice.totalSgst));
  } else if (invoice.totalIgst > 0) {
    row(`IGST @ ${invoice.gstRatePercent}%`, fmtNum(invoice.totalIgst));
  } else {
    doc.fontSize(8).fillColor(MUTED).font("Helvetica").text("Zero-rated (Export of Services)", labelX - 80, y, { width: 255, align: "right" });
    y += 16;
  }

  drawLine(doc, y - 4);
  y += 2;

  doc.fontSize(11).fillColor(BRAND).font("Helvetica-Bold");
  doc.text("TOTAL", labelX, y, { width: 70, align: "right" });
  doc.text(fmt(invoice.grandTotal, invoice.currency), valX, y, { width: valW, align: "right" });
  y += 22;

  // Amount in words
  doc.fontSize(7.5).fillColor(MUTED).font("Helvetica").text(
    `Amount in words: ${amountToWords(invoice.grandTotal)}`,
    50, y, { width: 495 }
  );
  y += 16;
  drawLine(doc, y);
  return y + 8;
}

function drawPaymentInfo(doc: PDFKit.PDFDocument, invoice: Invoice, startY: number): number {
  let y = startY;
  if (!invoice.paymentLinkUrl) return y;

  doc.fontSize(8).fillColor(ACCENT).font("Helvetica-Bold").text("PAYMENT", 50, y);
  y += 14;
  doc.fontSize(8.5).fillColor(BRAND).font("Helvetica").text("Pay online via Razorpay:", 50, y);
  y += 12;
  doc.fillColor(ACCENT).text(invoice.paymentLinkUrl, 50, y, { link: invoice.paymentLinkUrl, underline: true });
  y += 18;
  drawLine(doc, y);
  return y + 8;
}

function drawFooter(doc: PDFKit.PDFDocument, invoice: Invoice, startY: number) {
  let y = startY;

  if (invoice.notes) {
    doc.fontSize(7.5).fillColor(MUTED).font("Helvetica-Bold").text("Notes", 50, y);
    y += 10;
    doc.font("Helvetica").text(invoice.notes, 50, y, { width: 300 });
    y += 16;
  }

  if (invoice.termsAndConditions) {
    doc.fontSize(7.5).fillColor(MUTED).font("Helvetica-Bold").text("Terms and Conditions", 50, y);
    y += 10;
    doc.font("Helvetica").text(invoice.termsAndConditions, 50, y, { width: 300 });
    y += 16;
  }

  // Signatory
  y = Math.max(y + 20, 720);
  doc.fontSize(8).fillColor(BRAND).font("Helvetica-Bold").text(
    `For ${invoice.seller.legalName}`, 300, y, { width: 245, align: "right" }
  );
  doc.fontSize(7.5).fillColor(MUTED).font("Helvetica").text(
    "Authorised Signatory", 300, y + 14, { width: 245, align: "right" }
  );

  // Page footer
  doc.fontSize(6.5).fillColor("#94a3b8").font("Helvetica").text(
    "This is a computer-generated invoice.", 50, 800, { width: 495, align: "center" }
  );
}

/* ── Public API ── */

export async function generateInvoicePdf(invoice: Invoice): Promise<Buffer> {
  await fs.mkdir(INVOICES_DIR, { recursive: true });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawHeader(doc, invoice);
    let y = drawMeta(doc, invoice);
    y = drawBillTo(doc, invoice, y);
    y = drawLineItems(doc, invoice, y);
    y = drawTotals(doc, invoice, y);
    y = drawPaymentInfo(doc, invoice, y);
    drawFooter(doc, invoice, y);

    doc.end();
  });
}

export async function saveInvoicePdf(invoice: Invoice, pdfBuffer: Buffer): Promise<string> {
  await fs.mkdir(INVOICES_DIR, { recursive: true });
  const fileName = `${invoice.invoiceNumber}.pdf`;
  const filePath = path.join(INVOICES_DIR, fileName);
  await fs.writeFile(filePath, pdfBuffer);
  return fileName;
}

export async function readInvoicePdf(fileName: string): Promise<Buffer> {
  const filePath = path.join(INVOICES_DIR, fileName);
  return fs.readFile(filePath);
}
