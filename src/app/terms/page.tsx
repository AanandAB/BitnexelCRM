import type { Metadata } from 'next';
import { LegalLayout, LegalSection } from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Bitnexel',
  description:
    'Terms and conditions for engaging Bitnexel Systems for software development, website, and cloud application services.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" updated="12 September 2026">
      <LegalSection title="1. Agreement">
        <p>
          By using this website and engaging <strong className="text-foreground">Bitnexel Systems</strong>{' '}
          (&ldquo;Bitnexel&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) for services, you agree to these
          Terms &amp; Conditions. If you do not agree, please do not use this website.
        </p>
      </LegalSection>

      <LegalSection title="2. Services">
        <p>
          Bitnexel provides custom software development, website and 3D web design, and cloud web
          application / SaaS engineering. Specific deliverables are defined in a mutually agreed
          Statement of Work (SOW).
        </p>
      </LegalSection>

      <LegalSection title="3. Intellectual Property">
        <p>
          Upon full and final settlement of all agreed milestones (including the final release
          balance), Bitnexel transfers 100% ownership of the copyright, source code, database schema,
          and design assets to the client. Bitnexel retains the right to reuse non-identifying,
          generic techniques and tooling in its own work unless otherwise agreed in writing.
        </p>
      </LegalSection>

      <LegalSection title="4. Payments">
        <p>
          Projects are billed on a <strong className="text-foreground">50/30/20 milestone schedule</strong>{' '}
          (50% advance deposit, 30% at design/architecture sign-off, 20% at launch and handover)
          unless otherwise specified in a signed addendum. Enterprise retainers follow a separate
          schedule agreed in writing.
        </p>
      </LegalSection>

      <LegalSection title="5. Warranty">
        <p>
          Bitnexel provides a <strong className="text-foreground">30-day post-launch bug warranty</strong>{' '}
          covering defects, browser discrepancies, and regressions from the approved SOW. Features
          outside the SOW are estimated separately and billed only after your explicit approval.
        </p>
      </LegalSection>

      <LegalSection title="6. Client Responsibilities">
        <p>
          The client will provide timely access, materials, and feedback required for the project.
          Delays in client deliverables may reasonably affect the project timeline.
        </p>
      </LegalSection>

      <LegalSection title="7. Confidentiality">
        <p>
          Both parties will maintain the confidentiality of proprietary information. We countersign a
          mutual non-disclosure agreement on request, typically within hours.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, Bitnexel&rsquo;s total liability arising out of an
          engagement is limited to the fees actually paid for that engagement. Bitnexel is not liable
          for indirect, incidental, or consequential damages.
        </p>
      </LegalSection>

      <LegalSection title="9. Termination">
        <p>
          Either party may terminate an engagement upon written notice. On termination, the client
          pays for work completed to date, and completed, paid-for deliverables are transferred to
          the client.
        </p>
      </LegalSection>

      <LegalSection title="10. Governing Law & Jurisdiction">
        <p>
          These Terms are governed by the laws of India. Any disputes are subject to the exclusive
          jurisdiction of the courts of Kerala, India.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to These Terms">
        <p>
          We may update these Terms from time to time. Continued use of the website after changes
          constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Questions about these Terms may be sent to{' '}
          <a href="mailto:theblacklightstudio4@gmail.com" className="text-accent-text hover:underline">
            theblacklightstudio4@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
