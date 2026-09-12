import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description:
    "Explore Bitnexel's services — website design & development, custom software & ERP systems, and cloud web apps & SaaS — engineered end-to-end in Kerala.",
  alternates: { canonical: '/services' },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
