'use client';
import { LoginView } from '@/components/LoginView';
import { useAppRouter } from '@/lib/navigation';
import { usePortal } from '@/context/PortalContext';

export default function LoginPage() {
  const { navigate } = useAppRouter();
  const { login } = usePortal();
  return (
    <LoginView
      onLoginSuccess={() => {
        login();
        navigate('portal');
      }}
      onNavigate={navigate}
    />
  );
}
