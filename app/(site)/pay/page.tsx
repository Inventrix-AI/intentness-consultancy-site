import { InvoiceRequestForm } from "@/components/invoice-request-form";
import { PageHero } from "@/components/page-hero";
import { PaymentForm } from "@/components/payment-form";

export default function PayPage() {
  return (
    <>
      <PageHero
        title="Secure Online Payment"
        description="Pay for services directly via Razorpay Checkout or request a custom invoice/payment link for enterprise engagements."
      />

      <section className="section-pad">
        <div className="container-shell grid gap-6">
          <PaymentForm />
          <InvoiceRequestForm />
        </div>
      </section>
    </>
  );
}
