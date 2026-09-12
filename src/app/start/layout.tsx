import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start a Project',
  description:
    'Kick off your project with Bitnexel — sign in and submit your brief to begin the discovery phase.',
  alternates: { canonical: '/start' },
};

export default function StartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
