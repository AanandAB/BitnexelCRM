'use client';
import { ServicesView } from '@/components/ServicesView';
import { useAppRouter } from '@/lib/navigation';

export default function ServicesSoftwarePage() {
  const { navigate } = useAppRouter();
  return <ServicesView initialSubTab="software" onNavigate={navigate} />;
}
