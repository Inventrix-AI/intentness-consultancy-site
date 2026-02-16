import { PageHero } from "@/components/page-hero";
import { servicePackages } from "@/lib/content";

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Support Staffing Services"
        description="Flexible staffing programs for customer support, operations support, and service execution teams."
      />

      <section className="section-pad">
        <div className="container-shell grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {servicePackages.map((pkg) => (
            <article key={pkg.id} className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">{pkg.billingMode}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-base">{pkg.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{pkg.summary}</p>
              <p className="mt-4 text-2xl font-bold text-base">
                {pkg.currency} {pkg.amount}
              </p>
              <p className="text-xs text-slate-500">{pkg.turnaround}</p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {pkg.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
