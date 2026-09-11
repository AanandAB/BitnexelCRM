'use client';
import { StartProjectWizard } from '@/components/StartProjectWizard';
import { useAppRouter } from '@/lib/navigation';
import { usePortal } from '@/context/PortalContext';

export default function StartPage() {
  const { navigate } = useAppRouter();
  const { completeOnboarding } = usePortal();
  return (
    <StartProjectWizard
      onNavigate={navigate}
      onCompleteOnboarding={(project) => {
        completeOnboarding(project);
        navigate('portal');
      }}
    />
  );
}
