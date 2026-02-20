import { PageHero } from "@/components/page-hero";
import { PaymentsShell } from "@/components/payments-shell";

export default function PayPage() {
  return (
    <>
      <PageHero
        title="Payments"
        description="Choose self-serve custom amount checkout or request a manual invoice/payment link for enterprise engagements."
        breadcrumb="Payments"
      />

      <section className="section-pad">
        <div className="container-shell max-w-4xl">
          {/* Trust indicators */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-slate-200/80 bg-white px-6 py-4 shadow-card">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="h-5 w-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Razorpay Protected</span>
            </div>
          </div>

          <PaymentsShell />
        </div>
      </section>
    </>
  );
}
