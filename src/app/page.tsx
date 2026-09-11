'use client';
import { HomeView } from '@/components/HomeView';
import { useAppRouter } from '@/lib/navigation';

export default function HomePage() {
  const { navigate, selectCaseStudy } = useAppRouter();
  return <HomeView onNavigate={navigate} onSelectCaseStudy={selectCaseStudy} />;
}
