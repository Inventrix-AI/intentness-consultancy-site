import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { capabilityPillars, companyProfile, projectStatement, teamMembers } from "@/lib/content";

const whyChooseUs = [
  { title: "Global Delivery", desc: "Serving enterprise clients across US, India, Middle East and APAC with 24/7 operational coverage." },
  { title: "Vendor-Agnostic", desc: "Deep expertise across Cisco, Webex, Genesys, SolarWinds and multi-vendor ecosystems." },
  { title: "End-to-End Ownership", desc: "From architecture assessment to operational handover, we own the full delivery lifecycle." },
  { title: "Compliance-Ready", desc: "Incorporated in India with full KYC, FIRA-compliant international payments and transparent billing." }
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Intentness Consultancy"
        description="Founded in 2023, Intentness supports enterprise clients with practical execution across collaboration, networks, CX and automation."
        backgroundImage="/images/team-collaboration.jpg"
        breadcrumb="About"
      />

      {/* Company profile */}
      <section className="section-pad">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <article className="card">
            <h2 className="font-display text-2xl font-semibold text-slate-900">Company profile</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{projectStatement}</p>
            <dl className="mt-6 space-y-3 text-sm">
              {[
                ["Legal name", companyProfile.legalName],
                ["Incorporation", companyProfile.incorporationDate],
                ["CIN", companyProfile.cin],
                ["PAN / TAN", `${companyProfile.pan} / ${companyProfile.tan}`],
                ["Type", companyProfile.companyType]
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                  <dd className="font-medium text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="card p-0 overflow-hidden">
            <Image
              src="/images/team-collaboration.jpg"
              alt="Team collaboration"
              width={600}
              height={280}
              className="h-64 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="font-display text-2xl font-semibold text-slate-900">Operating focus</h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {capabilityPillars.map((item) => (
                  <li key={item} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm text-slate-700">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>

      <div className="section-divider" />

      {/* Why choose us */}
      <section className="section-pad bg-white">
        <div className="container-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Why Choose Us</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              Built for enterprise-grade delivery
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <article key={item.title} className="card card-hover">
                <h3 className="font-display text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Core team */}
      <section className="section-pad">
        <div className="container-shell">
          <p className="eyebrow">Leadership</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">Core team</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {teamMembers.map((member, i) => {
              const colors = ["from-sky-500 to-cyan-400", "from-emerald-500 to-teal-400", "from-violet-500 to-purple-400"];
              return (
                <article key={member.name} className="card card-hover text-center">
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${colors[i % colors.length]} text-2xl font-bold text-white shadow-lg`}>
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-slate-900">{member.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{member.focus}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
