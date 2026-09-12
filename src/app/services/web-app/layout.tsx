import type { Metadata } from 'next';

const SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Web App & SaaS Development',
  serviceType: 'Web App & SaaS Development',
  provider: { '@id': 'https://bitnexel.in/#organization' },
  areaServed: { '@type': 'Country', name: 'India' },
  url: 'https://bitnexel.in/services/web-app',
  description:
    'Cloud web applications and SaaS platforms — multi-tenancy, billing and uptime engineered for production.',
};

export const metadata: Metadata = {
  title: { absolute: 'Web App & SaaS Development — Bitnexel' },
  description:
    'Cloud web applications and SaaS platforms by Bitnexel — multi-tenancy, billing and uptime engineered for production, from Kerala.',
  alternates: { canonical: '/services/web-app' },
};

export default function WebAppLayout({ children }: { children: React.ReactNode }) {
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
