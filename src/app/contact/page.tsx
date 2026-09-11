'use client';
import { ContactView } from '@/components/ContactView';
import { useAppRouter } from '@/lib/navigation';

export default function ContactPage() {
  const { navigate } = useAppRouter();
  return <ContactView onNavigate={navigate} />;
}
