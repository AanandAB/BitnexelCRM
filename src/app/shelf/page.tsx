'use client';
import { ShelfView } from '@/components/ShelfView';
import { useAppRouter } from '@/lib/navigation';

export default function ShelfPage() {
  const { navigate } = useAppRouter();
  return <ShelfView onNavigate={navigate} />;
}
