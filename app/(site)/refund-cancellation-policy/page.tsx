import { PageHero } from "@/components/page-hero";
import { companyProfile } from "@/lib/content";

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero title="Refund / Cancellation Policy" description="Refund eligibility, cancellation timelines, processing periods, and exceptions." />
      <section className="section-pad">
        <article className="container-shell card prose prose-slate max-w-none">

          <p className="text-sm text-slate-500">Last updated: March 2025</p>

          <h2>1. Overview</h2>
          <p>
            This Refund and Cancellation Policy applies to all engagements entered into with{" "}
            {companyProfile.legalName} (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By making a
            payment through our platform, you agree to the terms described below.
          </p>

          <h2>2. Cancellation Before Onboarding Kickoff</h2>
          <p>
            If a client cancels an engagement <strong>before the onboarding kickoff date</strong> (i.e., before any
            project work, staffing deployment, or service delivery has commenced):
          </p>
          <ul>
            <li>A partial refund may be issued after deducting applicable processing fees and administrative charges.</li>
            <li>
              Processing and administrative charges are typically <strong>5–15% of the paid amount</strong> depending
              on the payment method and currency used.
            </li>
            <li>
              Refund requests must be submitted within <strong>7 calendar days</strong> of the original payment date.
            </li>
          </ul>

          <h2>3. Cancellation After Onboarding Kickoff</h2>
          <p>
            For <strong>active retainers or in-progress projects</strong>, refunds are governed by the signed
            engagement agreement or statement of work (SOW). In general:
          </p>
          <ul>
            <li>Fees for work already delivered or time already logged are non-refundable.</li>
            <li>
              Any advance or prepaid retainer balance for undelivered future months may be partially refundable subject
              to mutual agreement and notice period terms defined in the contract.
            </li>
            <li>
              A minimum notice period of <strong>30 days</strong> is required to terminate an active retainer. No
              refund is issued for the notice period.
            </li>
          </ul>

          <h2>4. Non-Refundable Situations</h2>
          <p>The following are explicitly non-refundable:</p>
          <ul>
            <li>Platform fees, currency conversion fees, or payment gateway charges.</li>
            <li>Payments for work milestones that have been approved or signed off by the client.</li>
            <li>Any custom development, design, or deliverable that has been completed and handed over.</li>
            <li>Setup fees or onboarding fees once the onboarding process has been initiated.</li>
          </ul>

          <h2>5. Refund Processing Timeline</h2>
          <p>
            Upon approval of a valid refund request, refunds are processed as follows:
          </p>
          <ul>
            <li>
              <strong>Credit/Debit Cards:</strong> 5–7 business days from the date of refund approval.
            </li>
            <li>
              <strong>UPI / Net Banking / Wallets:</strong> 3–5 business days from the date of refund approval.
            </li>
            <li>
              <strong>Bank Transfers (NEFT/RTGS/IMPS):</strong> 5–10 business days from the date of refund approval.
            </li>
            <li>
              <strong>International Payments:</strong> 10–15 business days depending on the originating bank and
              country. Refunds are issued in the original currency; exchange rate differences are not compensated.
            </li>
          </ul>
          <p>
            Refunds are credited to the original payment source only. We do not issue refunds to a different bank
            account or payment method than what was used for the original transaction.
          </p>

          <h2>6. How to Raise a Refund or Cancellation Request</h2>
          <p>To initiate a refund or cancellation:</p>
          <ol>
            <li>
              Email us at{" "}
              <a href={`mailto:${companyProfile.invoiceEmail}`}>{companyProfile.invoiceEmail}</a> with subject line{" "}
              <em>&ldquo;Refund Request – [Your Invoice / Order Number]&rdquo;</em>.
            </li>
            <li>Include your full name, company name, transaction date, transaction amount, and reason for request.</li>
            <li>
              Requests must be raised within <strong>7 calendar days</strong> of the transaction date. Requests raised
              beyond this window will not be entertained unless there is a verified technical error on our part.
            </li>
          </ol>

          <h2>7. Payment Disputes</h2>
          <p>
            If you believe an incorrect charge was made, raise a dispute within <strong>7 calendar days</strong> of
            the transaction date via our{" "}
            <a href="/support">Support page</a> or by emailing{" "}
            <a href={`mailto:${companyProfile.contactEmail}`}>{companyProfile.contactEmail}</a>. We will investigate
            and respond within 3 business days.
          </p>

          <h2>8. Contact</h2>
          <p>
            For any refund or cancellation related queries, contact us at:
            <br />
            <strong>{companyProfile.legalName}</strong>
            <br />
            {companyProfile.registeredAddress}
            <br />
            Email: <a href={`mailto:${companyProfile.invoiceEmail}`}>{companyProfile.invoiceEmail}</a>
            <br />
            Phone: {companyProfile.contactPhone}
          </p>

        </article>
      </section>
    </>
  );
}
