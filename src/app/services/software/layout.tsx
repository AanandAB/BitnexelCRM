import type { Metadata } from 'next';

const SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Custom Software Development',
  serviceType: 'Custom Software Development',
  provider: { '@id': 'https://bitnexel.in/#organization' },
  areaServed: { '@type': 'Country', name: 'India' },
  url: 'https://bitnexel.in/services/software',
  description:
    'Bespoke software, ERP and automation systems — process automation, integrations and data integrity engineered for scale.',
};

export const metadata: Metadata = {
  title: { absolute: 'Custom Software Development — Bitnexel' },
  description:
    'Bespoke software, ERP and automation systems built by Bitnexel — process automation, integrations and data integrity engineered for scale.',
  alternates: { canonical: '/services/software' },
};

export default function SoftwareLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_SCHEMA) }}
      />
      {children}
    </>
  );
}
