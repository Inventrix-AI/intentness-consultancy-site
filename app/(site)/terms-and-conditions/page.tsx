import { PageHero } from "@/components/page-hero";
import { companyProfile } from "@/lib/content";

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms & Conditions" description="Terms governing use of this website and service engagements." />
      <section className="section-pad">
        <article className="container-shell card prose prose-slate max-w-none">
          <p>
            Services provided by {companyProfile.legalName} are governed by executed proposals, MSA/SOW, and project-specific
            deliverables.
          </p>
          <p>
            Website package pricing is indicative and subject to scope confirmation. Enterprise services may be billed through
            custom invoices/payment links.
          </p>
          <p>
            Users agree to provide accurate information for consultations and payments. Misuse, chargeback abuse, and fraudulent
            activity may result in service suspension.
          </p>
        </article>
      </section>
    </>
  );
}
