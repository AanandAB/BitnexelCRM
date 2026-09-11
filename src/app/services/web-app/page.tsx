'use client';
import { ServicesView } from '@/components/ServicesView';
import { useAppRouter } from '@/lib/navigation';

export default function ServicesWebAppPage() {
  const { navigate } = useAppRouter();
  return <ServicesView initialSubTab="webapp" onNavigate={navigate} />;
}
