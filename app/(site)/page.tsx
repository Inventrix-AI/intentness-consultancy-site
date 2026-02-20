import Image from "next/image";
import Link from "next/link";
import {
  automationStrategies,
  capabilityPillars,
  companyProfile,
  networkingStack,
  projectStatement,
  servicePackages,
  teamMembers
} from "@/lib/content";
import { HomeAnimations } from "@/components/home-animations";

/* ── SVG Icons for capability pillars ── */
const capabilityIcons = [
  /* Collabs/CX */ <svg key="collab" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>,
  /* Network */ <svg key="network" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg>,
  /* Audio/Video */ <svg key="av" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>,
  /* Software */ <svg key="software" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
  /* Automation */ <svg key="automation" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12" /></svg>,
  /* Managed Services */ <svg key="managed" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
];

const stats = [
  { value: "50+", label: "Enterprise Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "22", label: "Currencies Supported" },
  { value: "24/7", label: "Global Support" }
];

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-28 lg:py-32">
        {/* Background decorative elements */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-emerald-500/8 blur-3xl" />

        <div className="container-shell relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="inline-flex items-center rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
              Built for global support operations
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Technology delivery across{" "}
              <span className="gradient-text">collaboration, networking</span>
              , automation and software.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">{projectStatement}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100 hover:shadow-xl"
              >
                Book a Discovery Call
              </Link>
              <Link
                href="/pay"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-100 transition-all hover:border-sky-300/40 hover:bg-white/5"
              >
                Pay or Request Invoice
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <Image
                src="/images/hero-global-tech.jpg"
                alt="Global technology operations"
                width={600}
                height={400}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            {/* Decorative floating element */}
            <div className="absolute -bottom-4 -left-4 rounded-2xl border border-white/10 bg-slate-900/90 px-5 py-3 shadow-xl backdrop-blur-sm">
              <p className="text-xs font-medium text-slate-400">Serving clients in</p>
              <p className="text-sm font-bold text-white">US, India, Middle East & APAC</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="container-shell mt-16">
          <div className="grid grid-cols-2 gap-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-6 backdrop-blur-sm sm:grid-cols-4 sm:gap-8 sm:px-10 sm:py-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Capabilities ─── */}
      <section className="section-pad">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">What We Deliver</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              Capability bands aligned to your requirements
            </h2>
            <p className="mt-3 text-slate-600">
              Six integrated practice areas designed to deliver measurable outcomes for enterprise clients.
            </p>
          </div>

          <HomeAnimations section="capabilities">
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilityPillars.map((item, i) => (
                <article key={item} className="card card-hover group">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-100">
                    {capabilityIcons[i]}
                  </div>
                  <p className="text-base font-semibold text-slate-900">{item}</p>
                </article>
              ))}
            </div>
          </HomeAnimations>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Networking + Automation ─── */}
      <section className="section-pad bg-white">
        <div className="container-shell grid gap-8 lg:grid-cols-2">
          <HomeAnimations section="networking">
            <div className="grid gap-6">
              <article className="card card-hover">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">Networking Stack</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">Enterprise voice and network platforms</h3>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {networkingStack.slice(0, 8).map((item) => (
                    <li key={item} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </HomeAnimations>

          <HomeAnimations section="automation">
            <div className="grid gap-6">
              <article className="relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-card">
                <Image
                  src="/images/software-engineering.jpg"
                  alt="Software and QA engineering"
                  width={600}
                  height={240}
                  className="h-56 w-full object-cover"
                />
              </article>
              <article className="card-dark relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-10" />
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">Automation Strategy</p>
                  <ul className="mt-4 space-y-2.5 text-sm text-slate-200">
                    {automationStrategies.slice(0, 4).map((item) => (
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
          </HomeAnimations>
        </div>
      </section>

      {/* ─── Team + Services ─── */}
      <section className="section-pad">
        <div className="container-shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="eyebrow">Team + Commercials</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                Delivery leaders and flexible engagement models
              </h2>
            </div>
            <Link href="/services" className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700">
              View complete portfolio
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="card">
              <h3 className="font-display text-2xl font-semibold text-slate-900">Core team</h3>
              <div className="mt-5 grid gap-3">
                {teamMembers.map((member, i) => {
                  const colors = ["bg-sky-500", "bg-emerald-500", "bg-violet-500"];
                  return (
                    <div key={member.name} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                      <div className={`h-10 w-10 shrink-0 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-sm font-bold text-white`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{member.name}</p>
                        <p className="text-sm text-slate-600">{member.focus}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="card">
              <h3 className="font-display text-2xl font-semibold text-slate-900">Service packages</h3>
              <div className="mt-5 grid gap-3">
                {servicePackages.map((pkg) => (
                  <div key={pkg.id} className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{pkg.name}</p>
                        <p className="mt-0.5 text-sm text-slate-600">{pkg.summary}</p>
                      </div>
                      <p className="shrink-0 rounded-lg bg-sky-50 px-3 py-1 text-sm font-bold text-sky-700">
                        {pkg.currency} {pkg.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* CTA Banner */}
          <div className="mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-10 sm:px-12 sm:py-14">
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-sky-500/15 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">Next step</p>
              <h3 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Ready to elevate your enterprise operations?
              </h3>
              <p className="mt-3 text-sm text-slate-300">
                {companyProfile.contactEmail} &bull; {companyProfile.contactPhone}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-100 hover:shadow-lg"
                >
                  Start a Conversation
                </Link>
                <Link
                  href="/pay"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Make a Payment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
