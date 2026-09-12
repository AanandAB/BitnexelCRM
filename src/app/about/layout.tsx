import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Bitnexel is a Kerala-based software & systems studio — a senior team shipping high-performance products for demanding clients worldwide.',
  alternates: { canonical: '/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
