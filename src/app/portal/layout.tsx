import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Portal',
  description:
    "Bitnexel client portal — track your project's milestones, messages and timeline in one place.",
  alternates: { canonical: '/portal' },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
