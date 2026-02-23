import { neon, Pool } from "@neondatabase/serverless";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import type {
  AuditEvent,
  Invoice,
  InvoiceRequestPayload,
  Lead,
  PaymentLink,
  PaymentOrder,
  PaymentTransaction,
} from "@/lib/types";

/* ── Neon connection (lazy-initialized to avoid build-time errors) ── */

let _sql: NeonQueryFunction<false, false> | null = null;
function getSql() {
  if (!_sql) _sql = neon(process.env.DATABASE_URL!);
  return _sql;
}

let _pool: Pool | null = null;
function getPool(): Pool {
  if (!_pool) _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return _pool;
}

/* ── Row-to-type mappers (snake_case → camelCase) ── */

function ts(val: unknown): string {
  if (val instanceof Date) return val.toISOString();
  return String(val ?? "");
}

function dateStr(val: unknown): string {
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  return String(val ?? "");
}

function rowToLead(r: Record<string, unknown>): Lead {
  return {
    id: r.id as string,
    createdAt: ts(r.created_at),
    name: r.name as string,
    workEmail: r.work_email as string,
    company: r.company as string,
    country: r.country as string,
    serviceInterest: r.service_interest as string,
    message: r.message as string,
  };
}

function rowToOrder(r: Record<string, unknown>): PaymentOrder {
  return {
    id: r.id as string,
    createdAt: ts(r.created_at),
    amountMajor: Number(r.amount_major),
    amountMinor: Number(r.amount_minor),
    currency: r.currency as string,
    payer: r.payer as PaymentOrder["payer"],
    purpose: (r.purpose as string) || undefined,
    reference: (r.reference as string) || undefined,
    fxEstimate: (r.fx_estimate as PaymentOrder["fxEstimate"]) ?? undefined,
    razorpayOrderId: r.razorpay_order_id as string,
    status: r.status as PaymentOrder["status"],
  };
}

function rowToPaymentLink(r: Record<string, unknown>): PaymentLink {
  return {
    id: r.id as string,
    createdAt: ts(r.created_at),
    razorpayLinkId: r.razorpay_link_id as string,
    shortUrl: r.short_url as string,
    amountMajor: Number(r.amount_major),
    amountMinor: Number(r.amount_minor),
    currency: r.currency as string,
    description: r.description as string,
    reference: (r.reference as string) || undefined,
    client: r.client as PaymentLink["client"],
    notifyEmail: r.notify_email as boolean,
    notifySms: r.notify_sms as boolean,
    expiresAt: r.expires_at ? ts(r.expires_at) : undefined,
    status: r.status as PaymentLink["status"],
    paidAt: r.paid_at ? ts(r.paid_at) : undefined,
    razorpayPaymentId: (r.razorpay_payment_id as string) || undefined,
  };
}

function rowToInvoice(r: Record<string, unknown>): Invoice {
  return {
    id: r.id as string,
    invoiceNumber: r.invoice_number as string,
    createdAt: ts(r.created_at),
    updatedAt: ts(r.updated_at),
    invoiceDate: dateStr(r.invoice_date),
    dueDate: dateStr(r.due_date),
    status: r.status as Invoice["status"],
    seller: r.seller as Invoice["seller"],
    buyer: r.buyer as Invoice["buyer"],
    lineItems: r.line_items as Invoice["lineItems"],
    currency: r.currency as string,
    subtotal: Number(r.subtotal),
    totalCgst: Number(r.total_cgst),
    totalSgst: Number(r.total_sgst),
    totalIgst: Number(r.total_igst),
    totalTax: Number(r.total_tax),
    grandTotal: Number(r.grand_total),
    gstRatePercent: Number(r.gst_rate_percent),
    notes: (r.notes as string) || undefined,
    termsAndConditions: (r.terms_and_conditions as string) || undefined,
    paymentLinkId: (r.payment_link_id as string) || undefined,
    razorpayLinkId: (r.razorpay_link_id as string) || undefined,
    paymentLinkUrl: (r.payment_link_url as string) || undefined,
    pdfGenerated: true, // Always true — PDFs generated on demand
    pdfFileName: undefined,
    emailSentAt: r.email_sent_at ? ts(r.email_sent_at) : undefined,
    createdBy: r.created_by as string,
    paidAt: r.paid_at ? ts(r.paid_at) : undefined,
    razorpayPaymentId: (r.razorpay_payment_id as string) || undefined,
  };
}

/* ═══════════════════════════════════════════════
   LEADS
   ═══════════════════════════════════════════════ */

export async function saveLead(lead: Lead) {
  await getSql()`
    INSERT INTO leads (id, created_at, name, work_email, company, country, service_interest, message)
    VALUES (${lead.id}, ${lead.createdAt}, ${lead.name}, ${lead.workEmail},
            ${lead.company}, ${lead.country}, ${lead.serviceInterest}, ${lead.message})
  `;
}

/* ═══════════════════════════════════════════════
   ORDERS
   ═══════════════════════════════════════════════ */

export async function getOrderByRazorpayId(razorpayOrderId: string): Promise<PaymentOrder | null> {
  const rows = await getSql()`
    SELECT * FROM orders WHERE razorpay_order_id = ${razorpayOrderId} LIMIT 1
  `;
  return rows.length > 0 ? rowToOrder(rows[0]) : null;
}

export async function saveOrder(order: PaymentOrder) {
  await getSql()`
    INSERT INTO orders (id, created_at, amount_major, amount_minor, currency,
                        payer, purpose, reference, fx_estimate, razorpay_order_id, status)
    VALUES (${order.id}, ${order.createdAt}, ${order.amountMajor}, ${order.amountMinor},
            ${order.currency}, ${JSON.stringify(order.payer)}, ${order.purpose ?? null},
            ${order.reference ?? null}, ${order.fxEstimate ? JSON.stringify(order.fxEstimate) : null},
            ${order.razorpayOrderId}, ${order.status})
  `;
}

export async function markOrderStatus(razorpayOrderId: string, status: PaymentOrder["status"]) {
  await getSql()`UPDATE orders SET status = ${status} WHERE razorpay_order_id = ${razorpayOrderId}`;
}

/* ═══════════════════════════════════════════════
   TRANSACTIONS
   ═══════════════════════════════════════════════ */

export async function saveTransaction(txn: PaymentTransaction) {
  await getSql()`
    INSERT INTO transactions (id, created_at, order_id, razorpay_payment_id, razorpay_order_id,
                              currency, amount_minor, amount_major, status, settlement_currency, notes)
    VALUES (${txn.id}, ${txn.createdAt}, ${txn.orderId}, ${txn.razorpayPaymentId},
            ${txn.razorpayOrderId}, ${txn.currency}, ${txn.amountMinor}, ${txn.amountMajor},
            ${txn.status}, ${txn.settlementCurrency}, ${txn.notes ?? null})
  `;
}

/* ═══════════════════════════════════════════════
   WEBHOOK EVENTS (atomic dedup)
   ═══════════════════════════════════════════════ */

export async function hasWebhookEvent(eventId: string): Promise<boolean> {
  const rows = await getSql()`SELECT 1 FROM webhook_events WHERE event_id = ${eventId} LIMIT 1`;
  return rows.length > 0;
}

export async function saveWebhookEvent(eventId: string) {
  await getSql()`INSERT INTO webhook_events (event_id) VALUES (${eventId}) ON CONFLICT (event_id) DO NOTHING`;
}

/* ═══════════════════════════════════════════════
   INVOICE REQUESTS
   ═══════════════════════════════════════════════ */

export async function saveInvoiceRequest(payload: InvoiceRequestPayload) {
  await getSql()`
    INSERT INTO invoice_requests (id, created_at, name, email, company,
                                  preferred_currency, amount_target, project_scope, timeline)
    VALUES (${payload.id}, ${payload.createdAt}, ${payload.name}, ${payload.email},
            ${payload.company}, ${payload.preferredCurrency}, ${payload.amountTarget},
            ${payload.projectScope}, ${payload.timeline ?? null})
  `;
}

/* ═══════════════════════════════════════════════
   PAYMENT LINKS
   ═══════════════════════════════════════════════ */

export async function savePaymentLink(link: PaymentLink) {
  await getSql()`
    INSERT INTO payment_links (id, created_at, razorpay_link_id, short_url,
                               amount_major, amount_minor, currency, description, reference,
                               client, notify_email, notify_sms, expires_at, status)
    VALUES (${link.id}, ${link.createdAt}, ${link.razorpayLinkId}, ${link.shortUrl},
            ${link.amountMajor}, ${link.amountMinor}, ${link.currency}, ${link.description},
            ${link.reference ?? null}, ${JSON.stringify(link.client)}, ${link.notifyEmail},
            ${link.notifySms}, ${link.expiresAt ?? null}, ${link.status})
  `;
}

export async function markPaymentLinkPaid(razorpayLinkId: string, razorpayPaymentId: string) {
  await getSql()`
    UPDATE payment_links
    SET status = 'paid', paid_at = NOW(), razorpay_payment_id = ${razorpayPaymentId}
    WHERE razorpay_link_id = ${razorpayLinkId}
  `;
}

/* ═══════════════════════════════════════════════
   AUDITS
   ═══════════════════════════════════════════════ */

export async function saveAudit(event: AuditEvent) {
  await getSql()`
    INSERT INTO audits (id, at, action, entity, payload)
    VALUES (${event.id}, ${event.at}, ${event.action}, ${event.entity}, ${JSON.stringify(event.payload)})
  `;
}

/* ═══════════════════════════════════════════════
   INVOICES
   ═══════════════════════════════════════════════ */

export async function saveInvoice(invoice: Invoice) {
  await getSql()`
    INSERT INTO invoices (
      id, invoice_number, created_at, updated_at, invoice_date, due_date, status,
      seller, buyer, line_items,
      currency, subtotal, total_cgst, total_sgst, total_igst, total_tax, grand_total,
      gst_rate_percent, notes, terms_and_conditions,
      payment_link_id, razorpay_link_id, payment_link_url,
      email_sent_at, created_by, paid_at, razorpay_payment_id
    ) VALUES (
      ${invoice.id}, ${invoice.invoiceNumber}, ${invoice.createdAt}, ${invoice.updatedAt},
      ${invoice.invoiceDate}, ${invoice.dueDate}, ${invoice.status},
      ${JSON.stringify(invoice.seller)}, ${JSON.stringify(invoice.buyer)}, ${JSON.stringify(invoice.lineItems)},
      ${invoice.currency}, ${invoice.subtotal}, ${invoice.totalCgst}, ${invoice.totalSgst},
      ${invoice.totalIgst}, ${invoice.totalTax}, ${invoice.grandTotal},
      ${invoice.gstRatePercent}, ${invoice.notes ?? null}, ${invoice.termsAndConditions ?? null},
      ${invoice.paymentLinkId ?? null}, ${invoice.razorpayLinkId ?? null}, ${invoice.paymentLinkUrl ?? null},
      ${invoice.emailSentAt ?? null}, ${invoice.createdBy}, ${invoice.paidAt ?? null},
      ${invoice.razorpayPaymentId ?? null}
    )
  `;
}

export async function getInvoices(): Promise<Invoice[]> {
  const rows = await getSql()`SELECT * FROM invoices ORDER BY created_at DESC`;
  return rows.map(rowToInvoice);
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const rows = await getSql()`SELECT * FROM invoices WHERE id = ${id} LIMIT 1`;
  return rows.length > 0 ? rowToInvoice(rows[0]) : null;
}

export async function updateInvoiceStatus(
  id: string,
  status: Invoice["status"],
  extra?: Partial<Pick<Invoice, "paidAt" | "razorpayPaymentId" | "emailSentAt" | "updatedAt">>
) {
  await getSql()`
    UPDATE invoices SET
      status = ${status},
      updated_at = NOW(),
      paid_at = COALESCE(${extra?.paidAt ?? null}::timestamptz, paid_at),
      razorpay_payment_id = COALESCE(${extra?.razorpayPaymentId ?? null}, razorpay_payment_id),
      email_sent_at = COALESCE(${extra?.emailSentAt ?? null}::timestamptz, email_sent_at)
    WHERE id = ${id}
  `;
}

export async function updateInvoice(id: string, updates: Partial<Invoice>) {
  await getSql()`
    UPDATE invoices SET
      status = COALESCE(${updates.status ?? null}, status),
      payment_link_id = COALESCE(${updates.paymentLinkId ?? null}, payment_link_id),
      razorpay_link_id = COALESCE(${updates.razorpayLinkId ?? null}, razorpay_link_id),
      payment_link_url = COALESCE(${updates.paymentLinkUrl ?? null}, payment_link_url),
      email_sent_at = COALESCE(${updates.emailSentAt ?? null}::timestamptz, email_sent_at),
      paid_at = COALESCE(${updates.paidAt ?? null}::timestamptz, paid_at),
      razorpay_payment_id = COALESCE(${updates.razorpayPaymentId ?? null}, razorpay_payment_id),
      notes = COALESCE(${updates.notes ?? null}, notes),
      terms_and_conditions = COALESCE(${updates.termsAndConditions ?? null}, terms_and_conditions),
      updated_at = NOW()
    WHERE id = ${id}
  `;
}

/* ── Atomic invoice numbering with row-lock ── */

export async function getNextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}`;
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Upsert the sequence row, then lock it
    await client.query(
      `INSERT INTO invoice_sequences (prefix, last_seq) VALUES ($1, 0) ON CONFLICT (prefix) DO NOTHING`,
      [prefix]
    );

    const result = await client.query(
      `SELECT last_seq FROM invoice_sequences WHERE prefix = $1 FOR UPDATE`,
      [prefix]
    );

    const nextSeq = (result.rows[0].last_seq as number) + 1;

    await client.query(
      `UPDATE invoice_sequences SET last_seq = $1 WHERE prefix = $2`,
      [nextSeq, prefix]
    );

    await client.query("COMMIT");
    return `${prefix}-${String(nextSeq).padStart(3, "0")}`;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
