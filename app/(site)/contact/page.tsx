import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { companyProfile } from "@/lib/content";

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Intentness"
        description="Share your support staffing requirement and we will respond with a consultation plan."
      />

      <section className="section-pad">
        <div className="container-shell grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ContactForm />

          <aside className="card h-fit">
            <h2 className="font-display text-xl font-semibold text-base">Direct contact</h2>
            <p className="mt-3 text-sm text-slate-700">Email: {companyProfile.contactEmail}</p>
            <p className="text-sm text-slate-700">Phone: {companyProfile.contactPhone}</p>
            <p className="mt-4 text-sm text-slate-600">
              For contracts above standard packages, request an invoice/payment link on the Pay page.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
