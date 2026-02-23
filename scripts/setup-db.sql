-- =============================================
-- Intentness Consultancy — Database Schema
-- Run once: psql "$DATABASE_URL" -f scripts/setup-db.sql
-- All statements are idempotent (IF NOT EXISTS)
-- =============================================

-- 1. leads
CREATE TABLE IF NOT EXISTS leads (
  id               TEXT PRIMARY KEY,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name             TEXT NOT NULL,
  work_email       TEXT NOT NULL,
  company          TEXT NOT NULL,
  country          TEXT NOT NULL,
  service_interest TEXT NOT NULL,
  message          TEXT NOT NULL
);

-- 2. orders
CREATE TABLE IF NOT EXISTS orders (
  id                TEXT PRIMARY KEY,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  amount_major      NUMERIC(12,2) NOT NULL,
  amount_minor      BIGINT NOT NULL,
  currency          TEXT NOT NULL,
  payer             JSONB NOT NULL,
  purpose           TEXT,
  reference         TEXT,
  fx_estimate       JSONB,
  razorpay_order_id TEXT NOT NULL UNIQUE,
  status            TEXT NOT NULL DEFAULT 'created'
);

-- 3. transactions
CREATE TABLE IF NOT EXISTS transactions (
  id                  TEXT PRIMARY KEY,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  order_id            TEXT NOT NULL,
  razorpay_payment_id TEXT NOT NULL,
  razorpay_order_id   TEXT NOT NULL,
  currency            TEXT NOT NULL,
  amount_minor        BIGINT NOT NULL,
  amount_major        NUMERIC(12,2) NOT NULL,
  status              TEXT NOT NULL,
  settlement_currency TEXT NOT NULL DEFAULT 'INR',
  notes               TEXT
);

-- 4. webhook_events (dedup)
CREATE TABLE IF NOT EXISTS webhook_events (
  event_id   TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. invoice_requests
CREATE TABLE IF NOT EXISTS invoice_requests (
  id                 TEXT PRIMARY KEY,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name               TEXT NOT NULL,
  email              TEXT NOT NULL,
  company            TEXT NOT NULL,
  preferred_currency TEXT NOT NULL,
  amount_target      TEXT NOT NULL,
  project_scope      TEXT NOT NULL,
  timeline           TEXT
);

-- 6. payment_links
CREATE TABLE IF NOT EXISTS payment_links (
  id                  TEXT PRIMARY KEY,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  razorpay_link_id    TEXT NOT NULL UNIQUE,
  short_url           TEXT NOT NULL,
  amount_major        NUMERIC(12,2) NOT NULL,
  amount_minor        BIGINT NOT NULL,
  currency            TEXT NOT NULL,
  description         TEXT NOT NULL,
  reference           TEXT,
  client              JSONB NOT NULL,
  notify_email        BOOLEAN NOT NULL DEFAULT TRUE,
  notify_sms          BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at          TIMESTAMPTZ,
  status              TEXT NOT NULL DEFAULT 'created',
  paid_at             TIMESTAMPTZ,
  razorpay_payment_id TEXT
);

-- 7. invoices
CREATE TABLE IF NOT EXISTS invoices (
  id                   TEXT PRIMARY KEY,
  invoice_number       TEXT NOT NULL UNIQUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  invoice_date         DATE NOT NULL,
  due_date             DATE NOT NULL,
  status               TEXT NOT NULL DEFAULT 'draft',
  seller               JSONB NOT NULL,
  buyer                JSONB NOT NULL,
  line_items           JSONB NOT NULL,
  currency             TEXT NOT NULL,
  subtotal             NUMERIC(14,2) NOT NULL,
  total_cgst           NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_sgst           NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_igst           NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_tax            NUMERIC(14,2) NOT NULL DEFAULT 0,
  grand_total          NUMERIC(14,2) NOT NULL,
  gst_rate_percent     NUMERIC(5,2) NOT NULL,
  notes                TEXT,
  terms_and_conditions TEXT,
  payment_link_id      TEXT,
  razorpay_link_id     TEXT,
  payment_link_url     TEXT,
  email_sent_at        TIMESTAMPTZ,
  created_by           TEXT NOT NULL,
  paid_at              TIMESTAMPTZ,
  razorpay_payment_id  TEXT
);

-- 8. audits
CREATE TABLE IF NOT EXISTS audits (
  id      TEXT PRIMARY KEY,
  at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action  TEXT NOT NULL,
  entity  TEXT NOT NULL,
  payload JSONB NOT NULL
);

-- 9. invoice_sequences (atomic numbering)
CREATE TABLE IF NOT EXISTS invoice_sequences (
  prefix   TEXT PRIMARY KEY,
  last_seq INTEGER NOT NULL DEFAULT 0
);

-- ── Indexes ──
CREATE INDEX IF NOT EXISTS idx_orders_rp    ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_plinks_rp    ON payment_links(razorpay_link_id);
CREATE INDEX IF NOT EXISTS idx_inv_status   ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_inv_rp       ON invoices(razorpay_link_id);
CREATE INDEX IF NOT EXISTS idx_inv_created  ON invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audits_at    ON audits(at DESC);
CREATE INDEX IF NOT EXISTS idx_audits_entity ON audits(entity);
