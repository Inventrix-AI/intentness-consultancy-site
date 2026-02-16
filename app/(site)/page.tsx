import Link from "next/link";
import { servicePackages, valuePoints } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <section className="section-pad">
        <div className="container-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
              India-based support staffing for US teams
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-base sm:text-5xl">
              Reliable support staffing that scales with your client operations.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-600">
              Intentness Consultancy Private Limited helps US-focused companies run support operations with clear ownership,
              reporting discipline, and flexible staffing models.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-xl bg-base px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                Book Consultation
              </Link>
              <Link href="/pay" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-400">
                Pay Online
              </Link>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50">
            <h2 className="font-display text-2xl font-semibold">Why clients choose us</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {valuePoints.map((point) => (
                <li key={point} className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-slate-200/70 bg-white/70">
        <div className="container-shell">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">Service Packages</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-base">Built for advisory retainers and scale</h2>
            </div>
            <Link href="/services" className="text-sm font-semibold text-accent hover:text-orange-700">
              View all services
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {servicePackages.map((pkg) => (
              <article key={pkg.id} className="card">
                <h3 className="font-display text-xl font-semibold text-base">{pkg.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{pkg.summary}</p>
                <p className="mt-4 text-2xl font-bold text-base">
                  {pkg.currency} {pkg.amount}
                </p>
                <p className="text-xs text-slate-500">{pkg.turnaround}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
