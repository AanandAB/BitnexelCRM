import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Process',
  description:
    'How Bitnexel ships software — a transparent, phase-gated process from discovery and proposal through design, engineering, QA and launch.',
  alternates: { canonical: '/process' },
};

export default function ProcessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
