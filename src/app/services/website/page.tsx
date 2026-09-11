'use client';
import { ServicesView } from '@/components/ServicesView';
import { useAppRouter } from '@/lib/navigation';

export default function ServicesWebsitePage() {
  const { navigate } = useAppRouter();
  return <ServicesView initialSubTab="website" onNavigate={navigate} />;
}
