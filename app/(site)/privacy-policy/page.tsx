import { PageHero } from "@/components/page-hero";
import { companyProfile } from "@/lib/content";

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" description="How we collect, use, and protect personal and business information." />
      <section className="section-pad">
        <article className="container-shell card prose prose-slate max-w-none">
          <p>
            {companyProfile.legalName} collects contact, business, and transaction information required to provide consulting and
            support staffing services.
          </p>
          <p>
            We use data for service delivery, invoicing, compliance, communication, and fraud prevention. Data is shared only
            with processors and partners required for payment and legal compliance.
          </p>
          <p>
            For payment processing, Razorpay and banking partners may process personal and transaction metadata as per applicable
            regulations.
          </p>
          <p>For privacy requests, contact {companyProfile.contactEmail}.</p>
        </article>
      </section>
    </>
  );
}
