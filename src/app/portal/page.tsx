'use client';
import { ClientPortal } from '@/components/ClientPortal';
import { LoginView } from '@/components/LoginView';
import { useAppRouter } from '@/lib/navigation';
import { usePortal } from '@/context/PortalContext';

export default function PortalPage() {
  const { navigate } = useAppRouter();
  const { isLoggedIn, activeProject, login, logout } = usePortal();

  if (isLoggedIn) {
    return (
      <ClientPortal
        project={activeProject}
        onLogout={() => {
          logout();
          navigate('home');
        }}
        onNavigate={navigate}
      />
    );
  }

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
