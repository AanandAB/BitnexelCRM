'use client';

import React, { useState } from 'react';
import { RouteType } from '../types';
import { 
  ShieldCheck, 
  Key, 
  ArrowRight, 
  Lock, 
  Sparkles,
  CheckCircle2,
  Terminal,
  ExternalLink
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onNavigate: (route: RouteType) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setMagicSent(true);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

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
        {/* Quick Demo Access Bar */}
        <div className="p-4 rounded-2xl bg-[#6C63FF]/15 border border-[#6C63FF]/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#00D4FF]">
              One-Click Demo Project
            </span>
            <span className="text-[10px] text-[#3DDC97] bg-[#3DDC97]/10 px-2 py-0.5 rounded">
              Active Client Simulation
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Explore the live portal for <strong>Apex Dynamics</strong> (custom operational software build, active development sprint, real-time feedback tracker).
          </p>
          <button
            onClick={onLoginSuccess}
            className="w-full py-2.5 px-3 rounded-xl bg-[#00D4FF] hover:bg-[#3be0ff] text-[#07080C] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow"
          >
            <span>Launch Demo Project Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-border" />
          <span className="flex-shrink mx-4 text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
            Or Sign In With Client Email
          </span>
          <div className="flex-grow border-t border-border" />
        </div>

        {magicSent ? (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-[#3DDC97]/10 border border-[#3DDC97]/30 text-xs text-[#3DDC97] space-y-1">
              <CheckCircle2 className="w-6 h-6 mx-auto text-[#3DDC97]" />
              <div className="font-semibold">Magic Link Dispatched</div>
              <div className="text-[11px] text-muted-foreground">
                Check your inbox at <strong>{email}</strong> for instant sign-in.
              </div>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-3 text-xs text-left">
              <label className="block text-muted-foreground">Or enter 6-digit access token:</label>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 782941"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-center font-mono text-base tracking-widest text-foreground focus:outline-none focus:border-[#00D4FF]"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#6C63FF] hover:bg-[#5b51ff] text-white font-semibold text-xs transition-all"
              >
                Authenticate Session
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-muted-foreground mb-1">Registered Company Email</label>
              <input
                type="email"
                required
                placeholder="founder@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-[#00D4FF]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#6C63FF] hover:bg-[#5b51ff] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Send Magic Sign-In Link</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
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
