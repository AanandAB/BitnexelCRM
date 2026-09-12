import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio Shelf',
  description:
    "Bitnexel's studio shelf — a curated library of shipped products and volumes.",
  alternates: { canonical: '/shelf' },
  robots: { index: false, follow: false },
};

export default function ShelfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
