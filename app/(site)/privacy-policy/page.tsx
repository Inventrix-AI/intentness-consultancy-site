import { PageHero } from "@/components/page-hero";
import { companyProfile } from "@/lib/content";

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" description="How we collect, use, store, share, and protect your personal and business information." />
      <section className="section-pad">
        <article className="container-shell card prose prose-slate max-w-none">

          <p className="text-sm text-slate-500">Last updated: March 2025</p>

          <h2>1. Introduction</h2>
          <p>
            {companyProfile.legalName} (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
            is committed to protecting the privacy and security of personal information entrusted to us. This Privacy
            Policy explains how we collect, use, store, disclose, and protect personal and business information when
            you interact with our website, services, or make payments through our platform.
          </p>
          <p>
            This policy applies to all users of our website (<strong>intentsupportservices.com</strong>), clients,
            prospective clients, and any individuals whose information we process in connection with our services.
          </p>

          <h2>2. Information We Collect</h2>
          <p>We collect the following categories of information:</p>

          <h3>2.1 Information You Provide Directly</h3>
          <ul>
            <li><strong>Contact details:</strong> Name, work email address, phone number, company name, and country.</li>
            <li><strong>Business details:</strong> Company registration details, GSTIN, billing address, and project scope information.</li>
            <li><strong>Payment information:</strong> Billing name, billing address, and currency preference. Card numbers and sensitive payment credentials are not stored by us — they are handled directly by our payment processor (Razorpay).</li>
            <li><strong>Communication content:</strong> Messages, queries, and feedback submitted through our contact or support forms.</li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li><strong>Usage data:</strong> Pages visited, time spent on pages, referral URLs, and browser/device type.</li>
            <li><strong>IP address and location:</strong> Approximate geographic location derived from your IP address.</li>
            <li><strong>Cookies and similar technologies:</strong> Session cookies used for authentication and basic site functionality. We do not use tracking or advertising cookies.</li>
          </ul>

          <h3>2.3 Information from Third Parties</h3>
          <ul>
            <li>Transaction metadata from Razorpay (payment status, payment IDs, method used) to confirm and record payments.</li>
            <li>Webhook event data from Razorpay for payment verification and order status updates.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use collected information for the following purposes:</p>
          <ul>
            <li><strong>Service delivery:</strong> To onboard clients, manage projects, deploy staff, and deliver consulting and support services.</li>
            <li><strong>Invoicing and billing:</strong> To generate GST-compliant invoices, process payments, and maintain financial records as required by Indian law.</li>
            <li><strong>Communication:</strong> To respond to queries, send service updates, invoice emails, and payment receipts.</li>
            <li><strong>Legal and regulatory compliance:</strong> To comply with applicable laws including the Information Technology Act, GST regulations, and RBI payment guidelines.</li>
            <li><strong>Fraud prevention and security:</strong> To detect and prevent fraudulent transactions and unauthorized access.</li>
            <li><strong>Website improvement:</strong> To understand how users interact with our website and improve user experience.</li>
          </ul>
          <p>We do not use personal information for marketing or advertising purposes without explicit consent.</p>

          <h2>4. How We Store Your Information</h2>
          <ul>
            <li>Client and transaction data is stored in a secure cloud database hosted on Neon (PostgreSQL), located in the Singapore (Asia Pacific) region, compliant with industry-standard security practices.</li>
            <li>Data is encrypted at rest and in transit using TLS/SSL protocols.</li>
            <li>We retain client and transaction records for a minimum of <strong>7 years</strong> as required under Indian taxation and accounting laws.</li>
            <li>Contact form submissions and support queries are retained for <strong>2 years</strong> unless required longer for ongoing matters.</li>
            <li>Data that is no longer required is securely deleted.</li>
          </ul>

          <h2>5. Sharing Your Information with Third Parties</h2>
          <p>
            We do not sell, rent, or trade personal information. We share information only in the following limited
            circumstances:
          </p>
          <ul>
            <li>
              <strong>Razorpay Financial Solutions Pvt. Ltd.:</strong> Our payment processor. Razorpay processes
              payment transactions, stores card/bank details, and may share transaction data with banking partners and
              card networks as required for payment settlement. Razorpay is PCI-DSS compliant. Their privacy policy is
              available at razorpay.com.
            </li>
            <li>
              <strong>Email service provider (Hostinger / SMTP):</strong> Used to send transactional emails such as
              invoices, payment confirmations, and support replies. Email content may pass through Hostinger&apos;s
              mail servers.
            </li>
            <li>
              <strong>Cloud infrastructure providers:</strong> Vercel (hosting) and Neon (database) process data as
              part of operating our platform. Both providers maintain appropriate data processing agreements and
              security standards.
            </li>
            <li>
              <strong>Legal and regulatory authorities:</strong> We may disclose information to government authorities,
              courts, or regulators when required by law, court order, or to protect our legal rights.
            </li>
          </ul>
          <p>
            All third-party processors are bound by data processing agreements and are required to maintain
            confidentiality and security of the data shared with them.
          </p>

          <h2>6. Cookies</h2>
          <p>
            We use session cookies strictly for authentication purposes (admin login sessions). These cookies are
            deleted when you close your browser or log out. We do not use third-party advertising cookies, tracking
            pixels, or analytics cookies that identify individual users.
          </p>

          <h2>7. Your Rights</h2>
          <p>You have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information, subject to our legal retention obligations.</li>
            <li><strong>Objection:</strong> Object to processing of your information for specific purposes.</li>
            <li><strong>Portability:</strong> Request your data in a structured, machine-readable format.</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{" "}
            <a href={`mailto:${companyProfile.contactEmail}`}>{companyProfile.contactEmail}</a>. We will respond
            within <strong>30 days</strong>.
          </p>

          <h2>8. Data Security</h2>
          <p>
            We implement industry-standard technical and organisational security measures to protect your information
            against unauthorised access, loss, or misuse:
          </p>
          <ul>
            <li>All data in transit is encrypted using TLS 1.2 or higher.</li>
            <li>Database access is restricted to authorised application connections only.</li>
            <li>Admin access to our platform requires authenticated credentials with session-based security.</li>
            <li>Payment credentials (card numbers, CVV, bank credentials) are never stored on our servers — they are tokenised and managed entirely by Razorpay.</li>
          </ul>
          <p>
            Despite these measures, no system is completely secure. In the event of a data breach affecting your
            personal information, we will notify you as required under applicable law.
          </p>

          <h2>9. International Data Transfers</h2>
          <p>
            Our infrastructure (Vercel hosting, Neon database) is located outside India (USA and Singapore regions).
            By using our services, you consent to the transfer of your data to these regions. We ensure that such
            transfers are subject to appropriate safeguards as required under applicable data protection laws.
          </p>

          <h2>10. Children&apos;s Privacy</h2>
          <p>
            Our services are intended for businesses and professionals. We do not knowingly collect personal
            information from individuals under 18 years of age.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal
            requirements. The updated policy will be posted on this page with a revised &ldquo;Last updated&rdquo;
            date. We encourage you to review this page periodically.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            For any privacy-related questions, concerns, or requests, contact our data controller at:
            <br />
            <strong>{companyProfile.legalName}</strong>
            <br />
            CIN: {companyProfile.cin}
            <br />
            {companyProfile.registeredAddress}
            <br />
            Email: <a href={`mailto:${companyProfile.contactEmail}`}>{companyProfile.contactEmail}</a>
            <br />
            Phone: {companyProfile.contactPhone}
          </p>

        </article>
      </section>
    </>
  );
}
