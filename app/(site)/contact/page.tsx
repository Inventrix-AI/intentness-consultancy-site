import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { companyProfile } from "@/lib/content";

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Let's Discuss Your Program"
        description="Share your required scope across network, collaboration, software or QA automation and we will propose the right delivery model."
        breadcrumb="Contact"
      />

      <section className="section-pad">
        <div className="container-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <ContactForm />

          <aside className="space-y-6">
            {/* Contact info card */}
            <div className="card">
              <h2 className="font-display text-xl font-semibold text-slate-900">Direct contact</h2>
              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-800">{companyProfile.contactEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-800">{companyProfile.contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-800">India (serving globally)</p>
                  </div>
                </div>
              </div>
              <p className="mt-5 rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                For larger contracts and negotiated delivery, use the invoice/payment-link flow on the Payments page.
              </p>
            </div>

            {/* Image */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-card">
              <Image
                src="/images/client-consultation.jpg"
                alt="Client consultation"
                width={600}
                height={240}
                className="h-48 w-full object-cover"
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
