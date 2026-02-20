import { promises as fs } from "node:fs";
import path from "node:path";
import type { AuditEvent, InvoiceRequestPayload, Lead, PaymentOrder, PaymentTransaction } from "@/lib/types";

type DbShape = {
  leads: Lead[];
  orders: PaymentOrder[];
  transactions: PaymentTransaction[];
  webhookEvents: string[];
  invoiceRequests: InvoiceRequestPayload[];
  audits: AuditEvent[];
};

const dbPath = path.join(process.cwd(), "data", "db.json");

async function ensureDb() {
  try {
    await fs.access(dbPath);
  } catch {
    const seed: DbShape = {
      leads: [],
      orders: [],
      transactions: [],
      webhookEvents: [],
      invoiceRequests: [],
      audits: []
    };
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(seed, null, 2), "utf8");
  }
}

async function readDb(): Promise<DbShape> {
  await ensureDb();
  const raw = await fs.readFile(dbPath, "utf8");
  return JSON.parse(raw) as DbShape;
}

async function writeDb(db: DbShape) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), "utf8");
}

export async function saveLead(lead: Lead) {
  const db = await readDb();
  db.leads.push(lead);
  await writeDb(db);
}

export async function getOrderByRazorpayId(razorpayOrderId: string): Promise<PaymentOrder | null> {
  const db = await readDb();
  return db.orders.find((o) => o.razorpayOrderId === razorpayOrderId) ?? null;
}

export async function saveOrder(order: PaymentOrder) {
  const db = await readDb();
  db.orders.push(order);
  await writeDb(db);
}

export async function markOrderStatus(razorpayOrderId: string, status: PaymentOrder["status"]) {
  const db = await readDb();
  db.orders = db.orders.map((order) =>
    order.razorpayOrderId === razorpayOrderId
      ? {
          ...order,
          status
        }
      : order
  );
  await writeDb(db);
}

export async function saveTransaction(txn: PaymentTransaction) {
  const db = await readDb();
  db.transactions.push(txn);
  await writeDb(db);
}

export async function hasWebhookEvent(eventId: string) {
  const db = await readDb();
  return db.webhookEvents.includes(eventId);
}

export async function saveWebhookEvent(eventId: string) {
  const db = await readDb();
  if (!db.webhookEvents.includes(eventId)) {
    db.webhookEvents.push(eventId);
    await writeDb(db);
  }
}

export async function saveInvoiceRequest(payload: InvoiceRequestPayload) {
  const db = await readDb();
  db.invoiceRequests.push(payload);
  await writeDb(db);
}

export async function saveAudit(event: AuditEvent) {
  const db = await readDb();
  db.audits.push(event);
  await writeDb(db);
}
