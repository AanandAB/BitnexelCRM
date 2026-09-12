import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work & Case Studies',
  description:
    'Case studies from Bitnexel — Flutter field guides, bilingual marketplaces, restaurant POS, SaaS dashboards and offline systems shipped for real clients.',
  alternates: { canonical: '/work' },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
