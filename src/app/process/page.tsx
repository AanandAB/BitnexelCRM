'use client';
import { ProcessView } from '@/components/ProcessView';
import { useAppRouter } from '@/lib/navigation';

export default function ProcessPage() {
  const { navigate } = useAppRouter();
  return <ProcessView onNavigate={navigate} />;
}
