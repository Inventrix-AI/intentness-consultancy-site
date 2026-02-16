import { PageHero } from "@/components/page-hero";
import { companyProfile } from "@/lib/content";

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Intentness Consultancy"
        description="Support staffing and consulting partner built to help US-facing teams deliver consistently from India."
      />

      <section className="section-pad">
        <div className="container-shell grid gap-6 lg:grid-cols-2">
          <article className="card">
            <h2 className="font-display text-2xl font-semibold text-base">Company snapshot</h2>
            <dl className="mt-4 space-y-2 text-sm text-slate-700">
              <div>
                <dt className="font-semibold">Legal name</dt>
                <dd>{companyProfile.legalName}</dd>
              </div>
              <div>
                <dt className="font-semibold">Incorporation date</dt>
                <dd>{companyProfile.incorporationDate}</dd>
              </div>
              <div>
                <dt className="font-semibold">CIN</dt>
                <dd>{companyProfile.cin}</dd>
              </div>
              <div>
                <dt className="font-semibold">PAN / TAN</dt>
                <dd>
                  {companyProfile.pan} / {companyProfile.tan}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Type</dt>
                <dd>{companyProfile.companyType}</dd>
              </div>
            </dl>
          </article>

          <article className="card">
            <h2 className="font-display text-2xl font-semibold text-base">How we operate</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Structured onboarding for support staffing and workflows.</li>
              <li>Weekly operations reviews and transparent KPI reporting.</li>
              <li>Hybrid model: advisory retainer with project surge capacity.</li>
              <li>Cross-border ready invoicing, payment, and compliance process.</li>
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}
