'use client';
import { AboutView } from '@/components/AboutView';
import { useAppRouter } from '@/lib/navigation';

export default function AboutPage() {
  const { navigate } = useAppRouter();
  return <AboutView onNavigate={navigate} />;
}
