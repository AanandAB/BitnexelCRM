import React from 'react';
import { RouteType } from '../types';
import { ChevronRight, Shield, ArrowUpRight, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: RouteType) => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'seo') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal }) => {
  return (
    <footer id="main-footer" className="relative mt-24 border-t border-border bg-muted/50 text-muted-foreground pt-16 pb-12 font-sans text-[12px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Apple Status Callout */}
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-muted border border-border">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <div className="text-xs">
              <span className="text-foreground font-medium uppercase tracking-wide">
                Production Capacity:
              </span>
              <span className="text-emerald-text ml-2 font-normal">
                1 Sprint Allocation Available for Q2 / Q3
              </span>
            </div>
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            GLOBAL ARCHITECTURE SLA: P99 &lt; 40MS
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-border">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/bitnexel-logo.png"
                alt="Bitnexel Systems"
                className="h-8 w-8 object-contain"
              />
              <span className="font-semibold text-foreground tracking-tight text-[14px]">
                Bitnexel Systems
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              World-class software development studio. We engineer custom enterprise systems, digital flagships, and cloud web applications where sub-second latency commands commercial market authority.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-surface border border-border text-foreground-soft">
                100% Repository IP Transfer
              </span>
              <span className="px-2.5 py-1 rounded-full bg-surface border border-border text-foreground-soft">
                60-Day Post-Launch Warranty
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 text-[#2997ff]">
                Zero Generic Templates
              </span>
            </div>
          </div>

          {/* Col 1: Disciplines */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-foreground font-medium">
              Capabilities
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('services/website')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Digital Flagships & 3D Web
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('services/software')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Custom Software & ERPs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('services/web-app')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cloud Web Applications & SaaS
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('pricing')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing & Retainers
                </button>
              </li>
              <li className="pt-1">
                <button 
                  onClick={() => onNavigate('start')}
                  className="text-[#2997ff] hover:text-foreground flex items-center gap-1 font-medium"
                >
                  <span>Launch Project Wizard</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Studio */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-foreground font-medium">
              Company
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('work')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Selected Deployments
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('process')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  11-Step Engineering Lifecycle
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  The Bitnexel Compact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Direct Founder Dispatch
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Telemetry */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-foreground font-medium">
              Client Portal
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('portal')}
                  className="text-[#2997ff] hover:text-foreground flex items-center gap-1 font-medium"
                >
                  <span>Verified Client Portal</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegal('privacy')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Security & SOC2 Compliance
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div>
            Copyright © {new Date().getFullYear()} Bitnexel Systems Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-muted-foreground">
            <span>SUB-40MS P99</span>
            <span className="text-foreground/20">/</span>
            <span>100% REPOSITORY IP</span>
            <span className="text-foreground/20">/</span>
            <span>AES-256 GCM</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
