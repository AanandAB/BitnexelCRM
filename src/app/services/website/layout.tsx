import type { Metadata } from 'next';

const SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Website Design & Development',
  serviceType: 'Website Design & Development',
  provider: { '@id': 'https://bitnexel.in/#organization' },
  areaServed: { '@type': 'Country', name: 'India' },
  url: 'https://bitnexel.in/services/website',
  description:
    'Digital flagship websites engineered for speed, SEO and conversion — sub-50ms performance, premium glassmorphism design, and mobile-first UX.',
};

export const metadata: Metadata = {
  title: { absolute: 'Website Design & Development — Bitnexel' },
  description:
    'Digital flagship websites engineered for speed, SEO and conversion — sub-50ms performance, premium glassmorphism design, and mobile-first UX by Bitnexel.',
  alternates: { canonical: '/services/website' },
};

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
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
