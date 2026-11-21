import type { Metadata } from "next";
import { LegalPage, Section, SubHeading } from "@/components/sections/LegalPage";

// Wording carried over unchanged from the original reckonwell.com privacy policy.
export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Reckonwell Privacy Policy — how we collect, use, store, and share your information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      href="/privacy-policy"
      meta={["Effective Date: 01/01/2024", "Last Updated: 02/09/2025"]}
      intro={
        <p>
          Reckonwell (&ldquo;we,&rdquo; &ldquo;our,&rdquo; &ldquo;us&rdquo;) respects your privacy and is committed to
          protecting your personal data. This Privacy Policy explains how we collect, use, store, and share your
          information when you use our website{" "}
          <a href="https://www.reckonwell.com" target="_blank" rel="noopener noreferrer">
            www.reckonwell.com
          </a>{" "}
          (the &ldquo;Site&rdquo;) or our services.
        </p>
      }
    >
      <Section number="1" title="Information We Collect">
        <p>We may collect and process the following types of information:</p>
        <SubHeading>a. Information you provide directly:</SubHeading>
        <ul>
          <li>Name, company name, job title.</li>
          <li>Email address, phone number, billing address.</li>
          <li>Financial and accounting information you choose to share with us for our services.</li>
          <li>Messages you send through contact forms, email, or chat.</li>
        </ul>
        <SubHeading>b. Information collected automatically:</SubHeading>
        <ul>
          <li>IP address, browser type, device information.</li>
          <li>Pages you visit, time spent on our Site, and referring website.</li>
          <li>Cookies and similar technologies (see Section 7).</li>
        </ul>
        <SubHeading>c. Information from third parties:</SubHeading>
        <ul>
          <li>
            Business directories, lead generation services, and partners (e.g., if you book via a linked service).
          </li>
        </ul>
      </Section>

      <Section number="2" title="How We Use Your Information">
        <p>We use your information to:</p>
        <ul>
          <li>Provide and manage accounting and finance services.</li>
          <li>Respond to enquiries and customer support requests.</li>
          <li>Process payments and invoices.</li>
          <li>Improve our website, services, and user experience.</li>
          <li>Send marketing communications (only if you opt in).</li>
          <li>Comply with legal obligations.</li>
        </ul>
      </Section>

      <Section number="3" title="Legal Basis for Processing (UK & EU GDPR)">
        <p>We rely on the following lawful bases to process your personal data:</p>
        <ul>
          <li>
            <strong>Contractual necessity</strong> – to provide you with services you request.
          </li>
          <li>
            <strong>Legitimate interests</strong> – to improve our services, market responsibly, and maintain security.
          </li>
          <li>
            <strong>Legal obligations</strong> – to comply with accounting, tax, or regulatory requirements.
          </li>
          <li>
            <strong>Consent</strong> – for optional marketing or cookies (you may withdraw consent at any time).
          </li>
        </ul>
      </Section>

      <Section number="4" title="Sharing Your Information">
        <p>We may share your personal data with:</p>
        <ul>
          <li>Service providers (e.g., payment processors, IT hosting, email platforms).</li>
          <li>Professional advisors (e.g., accountants, auditors, lawyers).</li>
          <li>Regulatory bodies if required by law.</li>
          <li>Third parties only with your consent or where necessary to deliver our services.</li>
        </ul>
        <p>We do not sell your personal data.</p>
      </Section>

      <Section number="5" title="Data Retention">
        <p>We retain your personal information only as long as necessary:</p>
        <ul>
          <li>To provide our services.</li>
          <li>To meet legal, accounting, and regulatory requirements.</li>
          <li>
            For up to [X years] after the end of our professional relationship, unless you request earlier deletion
            where legally possible.
          </li>
        </ul>
      </Section>

      <Section number="6" title="Data Security">
        <p>
          We implement appropriate technical and organisational measures to protect your personal information, including
          encryption, secure servers, and restricted access. However, no method of transmission over the internet is
          100% secure, and we cannot guarantee absolute security.
        </p>
      </Section>

      <Section number="7" title="Cookies & Tracking Technologies">
        <p>Our Site uses cookies and similar technologies to:</p>
        <ul>
          <li>Improve site functionality.</li>
          <li>Analyse visitor behaviour and website performance.</li>
          <li>Support targeted advertising (where applicable).</li>
        </ul>
        <p>You can manage or disable cookies in your browser settings. For more details, see our Cookie Policy.</p>
      </Section>

      <Section number="8" title="Your Rights (UK & EU GDPR)">
        <p>You have the following rights regarding your personal data:</p>
        <ul>
          <li>Access your information.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your data.</li>
          <li>Restrict or object to processing.</li>
          <li>Data portability.</li>
          <li>Withdraw consent (where processing is based on consent).</li>
        </ul>
        <p>
          To exercise these rights, contact us at: <a href="mailto:info@reckonwell.com">info@reckonwell.com</a>
        </p>
      </Section>

      <Section number="9" title="International Data Transfers">
        <p>
          If we transfer your personal data outside the UK/EEA, we ensure adequate protection (e.g., using standard
          contractual clauses or equivalent safeguards).
        </p>
      </Section>

      <Section number="10" title="Third-Party Links">
        <p>
          Our Site may contain links to third-party websites. We are not responsible for their privacy practices, and we
          encourage you to review their policies.
        </p>
      </Section>

      <Section number="11" title="Children's Privacy">
        <p>
          Our services are not directed at individuals under 18. We do not knowingly collect personal data from
          children.
        </p>
      </Section>

      <Section number="12" title="Your Rights Under CCPA/CPRA (California Residents)">
        <p>
          If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA)
          and the California Privacy Rights Act (CPRA). These rights include:
        </p>
        <ul>
          <li>
            <strong>Right to Know:</strong> You may request details about the personal information we collect, use,
            disclose, and share.
          </li>
          <li>
            <strong>Right to Delete:</strong> You may request that we delete personal information we hold about you,
            subject to legal obligations.
          </li>
          <li>
            <strong>Right to Correct:</strong> You may request correction of inaccurate personal information.
          </li>
          <li>
            <strong>Right to Opt Out of Sale/Sharing:</strong> We do not sell your personal information, but if we
            engage in sharing for targeted advertising in the future, you will have the right to opt out.
          </li>
          <li>
            <strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your
            privacy rights.
          </li>
          <li>
            <strong>Right to Limit Use of Sensitive Personal Information:</strong> If applicable, you may limit how your
            sensitive data is used or disclosed.
          </li>
        </ul>

        <SubHeading>Categories of Personal Information We Collect</SubHeading>
        <p>As defined by CCPA/CPRA, we may collect the following categories of personal information:</p>
        <ul>
          <li>Identifiers (e.g., name, email, phone number).</li>
          <li>Professional or employment-related information (e.g., company name, job title).</li>
          <li>Commercial information (e.g., billing details, transaction history).</li>
          <li>Internet or network activity (e.g., IP address, browsing behaviour on our Site).</li>
          <li>Financial information (if necessary to provide our services).</li>
        </ul>
        <p>We collect these categories for the purposes described in Section 2 of this Privacy Policy.</p>

        <SubHeading>Exercising Your CCPA/CPRA Rights</SubHeading>
        <p>You may exercise your rights by contacting us at:</p>
        <p>
          📧 <a href="mailto:info@reckonwell.com">info@reckonwell.com</a>
        </p>
        <p>
          We may need to verify your identity before responding to your request. You may also authorise an agent to make
          a request on your behalf.
        </p>
      </Section>

      <Section number="13" title="Updates to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated
          &ldquo;Last Updated&rdquo; date.
        </p>
      </Section>

      <Section number="14" title="Contact Us">
        <p>If you have questions about this Privacy Policy or how we handle your data, please contact us:</p>
        <div>
          <p>Reckonwell Ltd</p>
          <p>
            Website:{" "}
            <a href="https://www.reckonwell.com" target="_blank" rel="noopener noreferrer">
              www.reckonwell.com
            </a>
          </p>
          <p>
            Email: <a href="mailto:info@reckonwell.com">info@reckonwell.com</a>
          </p>
          <p>Address: 124 City Road, London, EC1V 2NX</p>
        </div>
      </Section>
    </LegalPage>
  );
}
