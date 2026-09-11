'use client';
import { PricingView } from '@/components/PricingView';
import { useAppRouter } from '@/lib/navigation';

export default function PricingPage() {
  const { navigate } = useAppRouter();
  return <PricingView onNavigate={navigate} />;
}
