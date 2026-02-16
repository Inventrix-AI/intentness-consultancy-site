# Intentness Consultancy Website

Next.js + Tailwind website for support staffing consulting with:
- Credibility-first marketing pages.
- Lead capture API.
- Razorpay direct checkout flow.
- Invoice/payment-link request workflow.
- Compliance policy pages required for activation.

## Quick Start

1. Install dependencies:
```bash
npm install
```
2. Configure environment:
```bash
cp .env.example .env.local
```
3. Run development server:
```bash
npm run dev
```

## API Endpoints

- `POST /api/leads`
- `POST /api/payments/create-order`
- `POST /api/payments/verify`
- `POST /api/payments/webhook`

## Deployment (Vercel)

- Set env vars from `.env.example` in Vercel project settings.
- Add Razorpay webhook endpoint:
  - `https://<your-domain>/api/payments/webhook`
- Keep compliance pages live before requesting final international activation.

## Notes

- Data persistence uses `data/db.json` for local/dev tracing.
- For production-grade persistence, replace with Postgres/Supabase before scale.
