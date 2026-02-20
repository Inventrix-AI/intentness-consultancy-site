import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { automationStrategies, networkingStack, qaMethodologies, servicePackages, softwareExperience } from "@/lib/content";

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Service Portfolio"
        description="A complete execution stack from network and collaboration programs to software engineering and QA automation."
        backgroundImage="/images/network-operations.jpg"
        breadcrumb="Services"
      />

      {/* Service packages */}
      <section className="section-pad">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Engagement Models</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              Service packages
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicePackages.map((pkg, i) => (
              <article key={pkg.id} className={`card card-hover relative ${i === 0 ? "gradient-border" : ""}`}>
                {i === 0 && (
                  <span className="absolute -top-3 right-4 rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                    Most Popular
                  </span>
                )}
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">{pkg.billingMode}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-slate-900">{pkg.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{pkg.summary}</p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-slate-900">{pkg.currency} {pkg.amount.toLocaleString()}</span>
                  <span className="text-sm text-slate-500">/ {pkg.billingMode}</span>
                </div>

                <p className="mt-2 text-xs text-slate-500">{pkg.turnaround}</p>

                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                  {pkg.deliverables.map((item) => (
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
                  Get Started
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
            <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">Networking and collaboration</h3>
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
              <h3 className="mt-2 font-display text-xl font-semibold text-white">Quality & automation stack</h3>
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
            Ready to scope your engagement?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-600">
            Share your requirements and we will propose the right delivery model within 48 hours.
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
