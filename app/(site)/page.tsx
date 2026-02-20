import Link from "next/link";
import Image from "next/image";
import {
  automationStrategies,
  companyProfile,
  networkingStack,
  projectStatement,
  servicePackages,
  softwareExperience,
  qaMethodologies,
  teamMembers
} from "@/lib/content";
import { HomeAnimations, StaggerContainer, StaggerItem } from "@/components/home-animations";

/* ── SVG Icons for service cards ── */
const serviceIcons = [
  /* Collabs/CX */ <svg key="collab" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>,
  /* Network/Security */ <svg key="network" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg>,
  /* Audio/Video */ <svg key="av" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>,
  /* Custom Software */ <svg key="software" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
  /* Automation */ <svg key="automation" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12" /></svg>,
  /* Managed Services */ <svg key="managed" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
];

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-28 lg:py-32">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-emerald-500/8 blur-3xl" />

        <div className="container-shell relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="inline-flex items-center rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
              Networks, Collabs, CX and Automation
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
                href="/services"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-100 transition-all hover:border-sky-300/40 hover:bg-white/5"
              >
                Explore Our Services
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <Image
                src="/images/hero-global-tech.jpg"
                alt="Technology operations"
                width={600}
                height={400}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Solutions & Services (single unified section) ─── */}
      <section className="section-pad">
        <div className="container-shell">
          <HomeAnimations section="services-header">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-xl">
                <p className="eyebrow">Solutions & Services</p>
                <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                  Six practice areas powering your technology needs
                </h2>
                <p className="mt-3 text-slate-600">
                  From collaboration platforms to managed services, we cover the full spectrum.
                </p>
              </div>
              <Link href="/services" className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700">
                View details
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </HomeAnimations>

          <StaggerContainer className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {servicePackages.map((pkg, i) => (
              <StaggerItem key={pkg.id}>
                <article className="card card-hover group h-full">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-100">
                    {serviceIcons[i]}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-slate-900">{pkg.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{pkg.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {pkg.highlights.slice(0, 2).map((h) => (
                      <span key={h} className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        {h}
                      </span>
                    ))}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Technical Expertise (light section for contrast) ─── */}
      <section className="section-pad bg-white">
        <div className="container-shell">
          <HomeAnimations section="expertise-header">
            <div className="max-w-2xl">
              <p className="eyebrow">Technical Expertise</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                Deep technology stack and proven methodologies
              </h2>
              <p className="mt-3 text-slate-600">
                Hands-on experience across enterprise networking, custom software, and modern automation pipelines.
              </p>
            </div>
          </HomeAnimations>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Networking Stack */}
            <HomeAnimations section="net-stack">
              <article className="h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-sky-50/50 p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-xl shadow-md" style={{ width: 40, height: 40, backgroundColor: '#0284c7' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.264.26-2.467.732-3.559" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">Networking Stack</p>
                    <h3 className="font-display text-xl font-semibold text-slate-900">Voice and network platforms</h3>
                  </div>
                </div>
                <StaggerContainer className="mt-5 grid gap-2 sm:grid-cols-2">
                  {networkingStack.map((item) => (
                    <StaggerItem key={item}>
                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition-colors hover:border-sky-300 hover:bg-sky-50">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                        {item}
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </article>
            </HomeAnimations>

            {/* Software + Automation */}
            <div className="grid gap-6">
              <HomeAnimations section="sw-stack">
                <article className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-emerald-50/50 p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-xl shadow-md" style={{ width: 40, height: 40, backgroundColor: '#059669' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">Software Development</p>
                      <h3 className="font-display text-xl font-semibold text-slate-900">Custom software and cloud</h3>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {softwareExperience.slice(0, 4).map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </HomeAnimations>

              <HomeAnimations section="qa-stack">
                <article className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50/60 to-orange-50/40 p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-xl shadow-md" style={{ width: 40, height: 40, backgroundColor: '#d97706' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">QA & Automation</p>
                      <h3 className="font-display text-xl font-semibold text-slate-900">Testing and CI/CD pipelines</h3>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {[...qaMethodologies.slice(0, 2), ...automationStrategies.slice(0, 2)].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </HomeAnimations>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Team ─── */}
      <section className="section-pad">
        <div className="container-shell">
          <HomeAnimations section="team-header">
            <div className="max-w-xl">
              <p className="eyebrow">Our Team</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                Core delivery team
              </h2>
              <p className="mt-3 text-slate-600">
                A focused team with specialized skills across networking, software and automation.
              </p>
            </div>
          </HomeAnimations>

          <StaggerContainer className="mt-10 grid gap-5 md:grid-cols-3">
            {teamMembers.map((member, i) => {
              const gradients = [
                "linear-gradient(135deg, #0284c7, #3b82f6)",
                "linear-gradient(135deg, #059669, #14b8a6)",
                "linear-gradient(135deg, #7c3aed, #a855f7)"
              ];
              return (
                <StaggerItem key={member.name}>
                  <article className="card card-hover text-center">
                    <div
                      className="mx-auto flex items-center justify-center rounded-full text-2xl font-bold text-white shadow-lg"
                      style={{ width: 64, height: 64, background: gradients[i % gradients.length] }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold text-slate-900">{member.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{member.focus}</p>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="section-pad bg-white">
        <div className="container-shell">
          <HomeAnimations section="cta">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-10 sm:px-12 sm:py-14">
              <div className="absolute inset-0 grid-pattern opacity-10" />
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-sky-500/15 blur-3xl" />
              <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">Next step</p>
                <h3 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                  Ready to take your business to the next level?
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
          </HomeAnimations>
        </div>
      </section>
    </>
  );
}
