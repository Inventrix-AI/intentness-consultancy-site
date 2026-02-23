# Intentness Consultancy Website - Complete Project Documentation

## 1. Project Overview
This repository contains the production-ready website for **INTENTNESS CONSULTANCY PRIVATE LIMITED**.

The site was built and iteratively upgraded to support:
- Professional brand presence for global clients.
- Lead generation and inquiry management.
- International payments using Razorpay.
- Dual payment workflow:
  - Self-serve custom amount checkout.
  - Manual invoice/payment-link request.

Current implementation uses a **Next.js App Router + TypeScript + Tailwind CSS** stack.

---

## 2. Company Context Captured in Code
From provided incorporation details and proposal content, the following core company metadata is included:
- Legal name: `INTENTNESS CONSULTANCY PRIVATE LIMITED`
- CIN: `U85499BR2023PTC062498`
- PAN: `AAHCI0720M`
- TAN: `PTNI01703C`
- Incorporation date: `April 13, 2023`

Primary capability positioning integrated into content:
- Collaboration and CX Management
- Network and Security
- Automation and QA
- Custom Software Applications
- Managed Services

Source of content:
- Proposal deck content provided by client (`Request for Proposal.pptx`)

---

## 3. Repository and Runtime Stack
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS + custom CSS theme
- API layer: Next.js route handlers (`app/api/*`)
- Payment gateway: Razorpay Orders + Checkout + Webhooks
- Local persistence: JSON file (`data/db.json`) for development and traceability

Important directories:
- `app/(site)` - Frontend pages
- `app/api` - Backend API handlers
- `components` - Reusable UI
- `lib` - Shared business logic, types, validators, utilities
- `data/db.json` - Local dev persistence
- `docs` - Project documentation

---

## 4. UI/UX Evolution Completed
### Initial phase
- Core pages created (Home/About/Services/Contact/Pay + policy pages).
- Working but visually basic layout.

### Redesign phase (current)
User feedback requested:
- Less dark UI.
- Less repetitive "boxy" layout.
- More production-grade and visual variety.
- Keep logo-inspired color language.

Implemented outcome:
- Balanced dark-light visual approach.
- Strong hero and section contrast.
- Image-led sections with varied composition.
- Refined typography hierarchy.
- Improved CTA clarity.
- Reusable logo integration in header/footer/hero and app metadata icon.

Logo source integrated:
- `public/intentness logo.png`

---

## 5. Page Structure (Current)
### Marketing pages
- `/` Home
- `/about`
- `/services`
- `/contact`
- `/pay`

### Policy/Compliance pages
- `/privacy-policy`
- `/terms-and-conditions`
- `/refund-cancellation-policy`
- `/delivery-service-fulfillment-policy`
- `/support`

---

## 6. Payment System - What Was Built
## 6.1 Final payment UX
Payments page supports two modes:
1. **Pay Now (Custom Amount)**
   - User enters:
     - amount
     - currency
     - payer name/email/country
     - optional purpose/reference
   - Server creates Razorpay order.
   - Razorpay Checkout launched in selected currency.

2. **Request Invoice/Payment Link**
   - User submits enterprise request form.
   - Request stored and auditable for operations follow-up.

## 6.2 Why this matches business requirement
Requirement was: clients should enter amount in their own currency and proceed to payment.
This is now implemented through custom amount + custom currency checkout flow.

## 6.3 Currency handling
- Controlled allowlist of Razorpay-supported currencies defined in `lib/currencies.ts`.
- Currency precision (minor units) handled by per-currency decimals.

## 6.4 FX estimate behavior
- Live INR estimate endpoint implemented:
  - `GET /api/payments/fx-estimate?base=<CURRENCY>&amount=<AMOUNT>`
- Tries live provider (`exchangerate.host`), falls back to static estimate if unavailable.
- Estimate is informational; final settlement is gateway/bank-driven.

## 6.5 Payment lifecycle and safety
- Order creation audit events.
- Signature verification endpoint.
- Webhook signature validation.
- Webhook idempotency using event IDs.
- Status transitions for created/verified/captured/failed.
- Rate limiting on payment endpoints.

---

## 7. API Documentation
### 7.1 Leads
### `POST /api/leads`
Purpose:
- Standard contact form submission
- Invoice/payment-link request intake (when `type=invoice_request`)

Responses:
- Success: `{ leadId, status }`
- Error: `{ error }`

---

### 7.2 Payment order creation
### `POST /api/payments/create-order`
Input:
```json
{
  "amountMajor": 1000,
  "currency": "USD",
  "payer": {
    "name": "Client Name",
    "email": "client@example.com",
    "country": "United States"
  },
  "purpose": "Consulting Services",
  "reference": "INV-123"
}
```

Output:
```json
{
  "orderId": "order_xxx",
  "razorpayKeyId": "rzp_...",
  "amount": 100000,
  "amountMajor": 1000,
  "currency": "USD"
}
```

---

### 7.3 Payment verification
### `POST /api/payments/verify`
Input:
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "sig_xxx"
}
```

Output:
```json
{
  "status": "verified",
  "paymentId": "pay_local_xxx",
  "orderId": "order_xxx",
  "paymentGatewayId": "pay_xxx"
}
```

---

### 7.4 Webhook receiver
### `POST /api/payments/webhook`
Purpose:
- Trust source for capture/failure lifecycle updates.
- Verifies `x-razorpay-signature`.
- Rejects duplicate events.

Recommended events to enable in Razorpay:
- `payment.captured` (required)
- `payment.failed` (recommended)
- Optional if operationally needed:
  - `order.paid`
  - `invoice.paid`
  - `payment_link.paid`

---

### 7.5 Currency list
### `GET /api/payments/currencies`
Returns enabled currency allowlist for frontend dropdown.

---

### 7.6 FX estimate
### `GET /api/payments/fx-estimate`
Query params:
- `base` currency code
- `amount` decimal amount

Returns converted INR estimate with rate and provider info.

---

## 8. Data Model Summary
Key types are in `lib/types.ts`:
- `PaymentIntentInput`
- `CurrencyConfig`
- `FxEstimate`
- `PaymentLifecycleStatus`
- `InvoiceRequestPayload`
- `PaymentOrder`
- `PaymentTransaction`

Current persistence storage:
- `data/db.json`

Data tracked:
- Leads
- Payment orders
- Payment transactions
- Webhook events
- Invoice request entries
- Audit events

---

## 9. Razorpay Configuration Checklist
Required env vars:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

Recommended additional env vars:
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_CONTACT_PHONE`
- `LEAD_EMAIL_TO`
- `INVOICE_REQUEST_EMAIL`

Webhook URL:
- `https://www.intentsupportservices.com/api/payments/webhook`

Important:
- Keep test and live secrets separate.
- Ensure Vercel env values match mode in use.

---

## 10. Build/Run/Deploy
### Local
```bash
npm install
npm run dev
npm run build
npm test
```

### Vercel
- Deploy from `main` branch.
- Set env vars in Vercel Project Settings.
- Configure Razorpay webhook endpoint and secret.

---

## 11. Issues Encountered and Resolved
1. **SWC binary load issue on local machine**
   - Resolved by reinstalling dependencies.

2. **typedRoutes build type error (`href` as string)**
   - Resolved by typing nav links as Next `Route`.

3. **Node crypto import in client bundle**
   - Resolved by separating server-only ID logic from shared client utilities.

4. **Stale `.next` type artifact build failure**
   - Resolved by clearing `.next` and rebuilding.

---

## 12. Current Status
As of current state:
- Build passes.
- Test command passes.
- Premium UI and multi-currency payment architecture are implemented.
- Logo integrated from public assets.
- Payment summary side panel removed from pay UI as requested.

---

## 13. Recommended Next Production Steps
1. Replace temporary stock photos with licensed final assets approved by client.
2. Move from JSON persistence to managed DB (Postgres/Supabase) for production scale.
3. Add admin/internal dashboard for invoice requests and transaction status tracking.
4. Expand webhook event handling for invoice/payment-link events if operations require it.
5. Add E2E tests for:
   - custom amount flow
   - verification failure path
   - webhook idempotency
6. Verify final legal text and registered address before final compliance submission.

---

## 14. Maintainer Note
This file is intended to remain the canonical implementation log and architecture reference for this repository. Update this document with each major release.
