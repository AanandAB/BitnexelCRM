'use client';
import { LoginView } from '@/components/LoginView';
import { useAppRouter } from '@/lib/navigation';

export default function LoginPage() {
  const { navigate } = useAppRouter();
  return <LoginView onNavigate={navigate} />;
}
