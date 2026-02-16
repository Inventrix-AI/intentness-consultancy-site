import { PageHero } from "@/components/page-hero";

export default function FulfillmentPolicyPage() {
  return (
    <>
      <PageHero
        title="Delivery / Service Fulfillment Policy"
        description="How staffing, onboarding, and consulting deliverables are fulfilled."
      />
      <section className="section-pad">
        <article className="container-shell card prose prose-slate max-w-none">
          <p>
            Service fulfillment begins after scope confirmation and payment receipt. Kickoff timelines vary by package and are
            specified during onboarding.
          </p>
          <p>
            Deliverables include staffing execution, workflow setup, reporting cadence, and operational support as per agreed
            service plan.
          </p>
          <p>
            Any dependency delays from client-side access, approvals, or data availability may shift fulfillment schedules.
          </p>
        </article>
      </section>
    </>
  );
}
