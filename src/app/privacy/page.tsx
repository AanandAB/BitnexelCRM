import type { Metadata } from 'next';
import { LegalLayout, LegalSection } from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy — Bitnexel',
  description:
    'How Bitnexel Systems collects, uses, and protects your personal data in accordance with the DPDP Act 2023 and the Information Technology Act 2000.',
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy & Data Protection" updated="12 September 2026">
      <p>
        This Privacy Policy explains how <strong className="text-foreground">Bitnexel Systems</strong>{' '}
        (&ldquo;Bitnexel&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects, uses,
        stores, and protects your personal data when you use our website (https://bitnexel.in),
        including our contact form, project wizard, and client portal. We are committed to
        protecting your privacy in accordance with the{' '}
        <strong className="text-foreground">Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>{' '}
        and the <strong className="text-foreground">Information Technology Act, 2000</strong> (and the
        rules made thereunder).
      </p>

      <LegalSection title="1. Who We Are">
        <p>
          Bitnexel Systems is a software development studio based in Kerala, India. For any questions
          about this policy or your personal data, contact our Grievance Officer (Section 10).
        </p>
      </LegalSection>

      <LegalSection title="2. Data We Collect">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-foreground">Enquiry / contact data:</strong> when you submit our
            contact form or project wizard, we collect your name, email address, phone/WhatsApp number
            (optional), company, role, project details, budget range, and timeline.
          </li>
          <li>
            <strong className="text-foreground">Client portal data:</strong> when you sign in with
            Google, we receive your Google account name and email address and display the project,
            milestone, and billing information associated with that email.
          </li>
          <li>
            <strong className="text-foreground">Technical data:</strong> browser type, device, IP
            address, and pages visited via standard server logs, plus your theme preference (stored
            locally in your browser).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Purpose & Legal Basis">
        <p>
          We process your data to respond to enquiries, prepare proposals, provide the client portal,
          send project updates, and improve our services. We do so on the basis of your consent
          (which you may withdraw at any time) and our legitimate business interest in responding to
          enquiries and fulfilling contractual obligations.
        </p>
      </LegalSection>

      <LegalSection title="4. How We Use & Share Your Data">
        <ul className="list-disc pl-5 space-y-2">
          <li>We use your data only to coordinate the technical execution of your project and respond to your enquiry.</li>
          <li>We do not sell, rent, or broker your personal data to third parties.</li>
          <li>We share data only with the service providers strictly necessary to operate the site (Section 5).</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Third-Party Service Providers">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-foreground">Cloudflare</strong> — hosting, CDN, and security infrastructure.
          </li>
          <li>
            <strong className="text-foreground">Google</strong> — authentication for the client portal (OAuth identity provider).
          </li>
          <li>
            <strong className="text-foreground">WhatsApp</strong> — if you choose to contact us via that channel.
          </li>
        </ul>
        <p>
          These providers process data on our behalf under appropriate contractual and technical safeguards.
        </p>
      </LegalSection>

      <LegalSection title="6. Data Retention">
        <p>
          We retain enquiry and client data only as long as necessary to respond to your enquiry and
          fulfil our contractual obligations, and thereafter as required by applicable law. You may
          request deletion at any time (Section 8).
        </p>
      </LegalSection>

      <LegalSection title="7. Security">
        <p>
          We implement reasonable security practices and procedures as required under Section 43A of
          the IT Act, 2000, including TLS encryption in transit, secure (HttpOnly/Secure) session
          cookies, access controls, and Cloudflare&rsquo;s enterprise-grade infrastructure.
        </p>
      </LegalSection>

      <LegalSection title="8. Your Rights (DPDP Act 2023)">
        <p>As a data principal, you have the right to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Access a summary of your personal data and how it is processed.</li>
          <li>Correct inaccurate or incomplete data.</li>
          <li>Erase your personal data.</li>
          <li>Withdraw consent at any time.</li>
          <li>Grievance redressal (contact our Grievance Officer).</li>
        </ul>
        <p>
          To exercise any of these rights, email our Grievance Officer (Section 10). We will respond
          within the timelines prescribed by law.
        </p>
      </LegalSection>

      <LegalSection title="9. Cookies & Local Storage">
        <p>
          We use local storage to remember your theme preference (no personal data). Google Fonts may
          set cookies to serve fonts. We do not use advertising or cross-site tracking cookies. You
          can clear cookies and local storage in your browser at any time.
        </p>
      </LegalSection>

      <LegalSection title="10. Grievance Officer">
        <p>In accordance with the DPDP Act, our designated Grievance Officer is:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Name: Aanand AB</li>
          <li>Email: theblacklightstudio4@gmail.com</li>
        </ul>
        <p>You may also reach us through the contact page on this website.</p>
      </LegalSection>

      <LegalSection title="11. Children&rsquo;s Data">
        <p>
          Our services are not directed to children under 18. We do not knowingly collect personal
          data from children without verifiable parental consent.
        </p>
      </LegalSection>

      <LegalSection title="12. Cross-Border Transfer">
        <p>
          Your data may be processed on infrastructure located outside India. We transfer data only in
          accordance with the DPDP Act and applicable law.
        </p>
      </LegalSection>

      <LegalSection title="13. Breach Notification">
        <p>
          In the event of a personal data breach, we will notify the Data Protection Board of India and
          affected individuals as required by law.
        </p>
      </LegalSection>

      <LegalSection title="14. Changes to This Policy">
        <p>
          We may update this policy from time to time. The &ldquo;last updated&rdquo; date will be
          revised accordingly, and material changes will be highlighted on this page.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
