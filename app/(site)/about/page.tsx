import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { capabilityPillars, companyProfile, projectStatement, teamMembers } from "@/lib/content";

const whyChooseUs = [
  {
    title: "End-to-End Solutions",
    desc: "Complete portfolio from architecture assessment through deployment and operational handover.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    )
  },
  {
    title: "Multi-Vendor Expertise",
    desc: "Deep expertise across Cisco, Webex, Genesys, SolarWinds and diverse technology ecosystems.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
      </svg>
    )
  },
  {
    title: "Customizable Delivery",
    desc: "Solutions tailored to client-specific workflows with agile, iterative development practices.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    title: "Prompt and Coherent Service",
    desc: "A focused team with specialized skills across networking, software and automation delivering consistent results.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    )
  }
];

const pillarIcons = [
  <svg key="1" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>,
  <svg key="2" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg>,
  <svg key="3" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>,
  <svg key="4" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
  <svg key="5" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12" /></svg>,
  <svg key="6" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
];

const pillarColors = [
  "bg-sky-50 text-sky-600",
  "bg-emerald-50 text-emerald-600",
  "bg-violet-50 text-violet-600",
  "bg-amber-50 text-amber-600",
  "bg-rose-50 text-rose-600",
  "bg-cyan-50 text-cyan-600"
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Intentness Consultancy"
        description="Founded in 2023 in Nawada, India. Offering end-to-end solutions across collaboration, networks, CX and automation."
        backgroundImage="/images/team-collaboration.jpg"
        breadcrumb="About"
      />

      {/* ─── Our Story — editorial split layout ─── */}
      <section className="section-pad">
        <div className="container-shell">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text side */}
            <div>
              <p className="eyebrow">Our Story</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                Built on domain expertise, driven by service excellence
              </h2>
              <p className="mt-6 text-base leading-relaxed text-slate-600">
                {projectStatement}
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                With our domain expertise and highly appreciated service, we are committed to providing the best support to our customers across networking, collaboration, software development and automation.
              </p>

              {/* Company facts inline */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-center">
                  <p className="font-display text-2xl font-bold text-slate-900">2023</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Founded</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-center">
                  <p className="font-display text-2xl font-bold text-slate-900">India</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Nawada, Bihar</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-center">
                  <p className="font-display text-lg font-bold text-slate-900">Private Ltd</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Company Type</p>
                </div>
              </div>
            </div>

            {/* Image side */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/images/client-consultation.jpg"
                  alt="Client consultation"
                  width={600}
                  height={450}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Floating accent card */}
              <div className="absolute -bottom-6 -left-6 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-lg max-sm:hidden">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Registered as</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{companyProfile.brandName}</p>
                <p className="text-xs text-slate-500">{companyProfile.companyType}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Operating Focus — icon grid ─── */}
      <section className="section-pad bg-white">
        <div className="container-shell">
          <div className="grid items-center gap-12 lg:grid-cols-[0.45fr_1fr]">
            <div>
              <p className="eyebrow">Operating Focus</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                Six practice areas powering your technology needs
              </h2>
              <p className="mt-4 text-slate-600">
                We deliver both solutions and services across these core domains, end-to-end.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilityPillars.map((item, i) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-colors hover:border-slate-200 hover:bg-white hover:shadow-sm">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${pillarColors[i]}`}>
                    {pillarIcons[i]}
                  </div>
                  <p className="pt-1.5 text-sm font-medium text-slate-800">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Why Choose Us — with image ─── */}
      <section className="section-pad">
        <div className="container-shell">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="eyebrow">Why Work With Us</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                What sets us apart
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {whyChooseUs.map((item) => (
                  <article key={item.title} className="group">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-100">
                      {item.icon}
                    </div>
                    <h3 className="font-display text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/images/network-operations.jpg"
                  alt="Network operations"
                  width={600}
                  height={500}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ─── Core Team ─── */}
      <section className="section-pad bg-white">
        <div className="container-shell">
          <div className="text-center">
            <p className="eyebrow">Leadership</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">Core team</h2>
            <p className="mx-auto mt-3 max-w-lg text-slate-600">
              A focused team with specialized skills across networking, software and automation.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-3">
            {teamMembers.map((member, i) => {
              const colors = ["from-sky-500 to-cyan-400", "from-emerald-500 to-teal-400", "from-violet-500 to-purple-400"];
              return (
                <article key={member.name} className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-center transition-all hover:border-slate-200 hover:bg-white hover:shadow-lg">
                  <div className={`mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-gradient-to-br ${colors[i % colors.length]} text-2xl font-bold text-white shadow-lg transition-transform group-hover:scale-105`}>
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">{member.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{member.focus}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section-pad">
        <div className="container-shell">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-12 text-center sm:px-12 sm:py-16">
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-sky-500/15 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative">
              <h3 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Ready to work together?
              </h3>
              <p className="mx-auto mt-4 max-w-md text-slate-300">
                Get in touch to discuss how we can support your technology goals.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-100 hover:shadow-lg"
                >
                  Start a Conversation
                </Link>
                <Link
                  href="/services"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  View Our Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
