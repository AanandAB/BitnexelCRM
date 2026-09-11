'use client';
import { ClientPortal } from '@/components/ClientPortal';
import { LoginView } from '@/components/LoginView';
import { useAppRouter } from '@/lib/navigation';
import { usePortal } from '@/context/PortalContext';

export default function PortalPage() {
  const { navigate } = useAppRouter();
  const { isLoggedIn, loading, activeProject, logout } = usePortal();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-muted-foreground">
        Checking session…
      </div>
    );
  }

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

  return <LoginView onNavigate={navigate} />;
}
