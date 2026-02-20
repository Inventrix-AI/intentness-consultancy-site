import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { automationStrategies, networkingStack, qaMethodologies, servicePackages, softwareExperience } from "@/lib/content";

/* ── SVG Icons for service cards ── */
const serviceIcons = [
  /* Collaboration/CX */ <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>,
  /* Network/Security */ <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg>,
  /* Audio/Video */ <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>,
  /* Custom Software */ <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
  /* Automation */ <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12" /></svg>,
  /* Managed Services */ <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        description="A complete portfolio of end-to-end and customizable solutions across networking, collaboration, software development and automation."
        backgroundImage="/images/network-operations.jpg"
        breadcrumb="Services"
      />

      {/* Service areas */}
      <section className="section-pad">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Capabilities</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              Our service areas
            </h2>
            <p className="mt-3 text-slate-600">
              We deliver both solutions and services across six core practice areas, tailored to your specific requirements.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicePackages.map((pkg, i) => (
              <article key={pkg.id} className="card card-hover group relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-100">
                  {serviceIcons[i]}
                </div>
                <h3 className="font-display text-xl font-semibold text-slate-900">{pkg.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{pkg.summary}</p>

                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                  {pkg.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className="mt-5 block w-full rounded-xl bg-slate-900 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Contact Us
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Platforms + Engineering */}
      <section className="section-pad bg-white">
        <div className="container-shell grid gap-6 lg:grid-cols-3">
          <article className="card lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">Platforms</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">Networking and collaboration stack</h3>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {networkingStack.map((item) => (
                <li key={item} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="card-dark relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">Engineering</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-white">Quality and automation stack</h3>
              <ul className="mt-5 space-y-2.5 text-sm text-slate-200">
                {[...softwareExperience.slice(0, 3), ...qaMethodologies.slice(0, 2), ...automationStrategies.slice(0, 2)].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="container-shell text-center">
          <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
            Ready to discuss your requirements?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-600">
            Share your requirements and we will propose the right solution for your needs.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 hover:shadow-lg"
          >
            Start Discussion
          </Link>
        </div>
      </section>
    </>
  );
}
