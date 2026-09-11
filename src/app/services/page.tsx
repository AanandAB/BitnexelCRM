'use client';
import { ServicesView } from '@/components/ServicesView';
import { useAppRouter } from '@/lib/navigation';

export default function ServicesPage() {
  const { navigate } = useAppRouter();
  return <ServicesView initialSubTab="all" onNavigate={navigate} />;
}
