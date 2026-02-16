import { PageHero } from "@/components/page-hero";
import { companyProfile } from "@/lib/content";

export default function SupportPage() {
  return (
    <>
      <PageHero title="Contact & Support" description="Support channels for service, billing, and compliance-related queries." />
      <section className="section-pad">
        <div className="container-shell grid gap-6 md:grid-cols-2">
          <article className="card">
            <h2 className="font-display text-2xl font-semibold text-base">General Support</h2>
            <p className="mt-2 text-sm text-slate-700">Email: {companyProfile.supportEmail}</p>
            <p className="text-sm text-slate-700">Phone: {companyProfile.contactPhone}</p>
          </article>

          <article className="card">
            <h2 className="font-display text-2xl font-semibold text-base">Billing & Invoices</h2>
            <p className="mt-2 text-sm text-slate-700">Email: {companyProfile.invoiceEmail}</p>
            <p className="text-sm text-slate-600">Mention contract/SOW ID for faster reconciliation.</p>
          </article>
        </div>
      </section>
    </>
  );
}
