'use client';

import React from 'react';
import { RouteType } from '../types';
import { ShieldCheck, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

interface LoginViewProps {
  onNavigate: (route: RouteType) => void;
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const { login } = usePortal();

  return (
    <div id="login-view" className="max-w-md mx-auto px-4 py-16 space-y-8 animate-in fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C63FF]/20 border border-[#6C63FF]/40 text-[#00D4FF] text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" /> Client Portal Access
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Welcome to your project vault.
        </h1>
        <p className="text-xs text-muted-foreground">
          Real-time lifecycle tracking, staging environments, structured QA feedback, and asset storage.
        </p>
      </div>

      <div className="p-8 rounded-3xl glass-panel border border-border bg-muted/90 space-y-6 shadow-2xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#00D4FF]">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-mono font-semibold">Secure single sign-on</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Sign in with the Google account you used for your project. Your session is encrypted
            and scoped to you only.
          </p>
        </div>

        <button
          onClick={login}
          className="w-full py-3.5 px-4 rounded-xl bg-surface hover:bg-surface/80 border border-border text-foreground text-sm font-semibold flex items-center justify-center gap-3 transition-all hover:border-foreground/30 shadow"
        >
          <GoogleMark />
          <span>Sign in with Google</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <Lock className="w-3.5 h-3.5 text-emerald-text" />
          <span>OAuth 2.0 · encrypted sessions · no passwords stored</span>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        Looking to start a new project?{' '}
        <button
          onClick={() => onNavigate('start')}
          className="text-[#00D4FF] hover:underline font-semibold"
        >
          Begin Onboarding Scoping →
        </button>
      </div>
    </div>
  );
};
