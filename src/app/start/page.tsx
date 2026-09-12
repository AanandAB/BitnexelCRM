'use client';
import { StartProjectWizard } from '@/components/StartProjectWizard';
import { useAppRouter } from '@/lib/navigation';
import { usePortal } from '@/context/PortalContext';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export default function StartPage() {
  const { navigate } = useAppRouter();
  const { isLoggedIn, loading, login } = usePortal();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-muted-foreground">
        Checking session…
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-8 animate-in fade-in text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C63FF]/20 border border-[#6C63FF]/40 text-[#00D4FF] text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" /> Secure sign-in required
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Sign in to start your project.
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Your project is tied to your Google account — this keeps your brief,
          timeline and portal access in one place.
        </p>

        <div className="p-8 rounded-3xl glass-panel border border-border bg-muted/90 space-y-4 shadow-2xl">
          <button
            onClick={() => login('/start')}
            className="w-full py-3.5 px-4 rounded-xl bg-surface hover:bg-surface/80 border border-border text-foreground text-sm font-semibold flex items-center justify-center gap-3 transition-all hover:border-foreground/30 shadow"
          >
            <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>Sign in with Google</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock className="w-3.5 h-3.5 text-emerald-text" />
            <span>OAuth 2.0 · encrypted sessions · no passwords stored</span>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Already signed in?{' '}
          <button
            onClick={() => navigate('portal')}
            className="text-[#00D4FF] hover:underline font-semibold"
          >
            Go to your portal →
          </button>
        </div>
      </div>
    );
  }

  return <StartProjectWizard onNavigate={navigate} />;
}
