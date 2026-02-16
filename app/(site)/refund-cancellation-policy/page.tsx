import { PageHero } from "@/components/page-hero";

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero title="Refund / Cancellation Policy" description="Refund eligibility, cancellation timelines, and exceptions." />
      <section className="section-pad">
        <article className="container-shell card prose prose-slate max-w-none">
          <p>
            Cancellations before onboarding kickoff may be eligible for a partial refund after deducting processing and
            administrative charges.
          </p>
          <p>
            For active retainers or in-progress projects, refunds are governed by signed agreements and effort already delivered.
          </p>
          <p>
            Payment disputes should be raised within 7 calendar days of transaction date through the support contact page.
          </p>
        </article>
      </section>
    </>
  );
}
