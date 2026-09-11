import React from 'react';
import { RouteType } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { Reveal } from './Reveal';
import { 
  ArrowRight, 
  Check, 
  X, 
  Sparkles,
  Zap
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (route: RouteType) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const { currency } = useCurrency();

  return (
    <div id="about-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-24">
      {/* Header */}
      <Reveal>
        <div className="space-y-4 pb-8 border-b border-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-accent-text text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-accent-text" />
            <span>Studio Constitution · First Principles</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-foreground tracking-tight">
            Engineering Craftsmanship. Zero Agency Overhead.
          </h1>
          <p className="text-base sm:text-lg text-foreground-soft max-w-3xl leading-relaxed">
            Bitnexel was founded to solve a structural failure in the tech industry: the false choice between bloated, sluggish legacy agencies and unpredictable freelance contractors.
          </p>
        </div>
      </Reveal>

      {/* The 3-Way Comparison Matrix (Agency vs Freelancer vs Bitnexel) */}
      <Reveal delay={0.05}>
        <div className="p-6 sm:p-10 rounded-2xl studio-panel space-y-8">
          <div className="border-b border-border pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-text font-semibold">
              OPERATIONAL REALITY
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-1">
              Why Ambitious Teams Choose the Bitnexel Model
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Traditional Agency */}
            <Reveal delay={0.05} y={16}>
              <div className="h-full p-6 sm:p-7 rounded-xl bg-surface border border-border space-y-4 opacity-80 hover:opacity-100 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm font-display font-bold text-foreground-soft">TRADITIONAL AGENCY</span>
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-mono">✕</span>
                    <span>Layers of account coordinators between you and developers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-mono">✕</span>
                    <span>Work silently handed off to junior offshore contractors</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-mono">✕</span>
                    <span>{currency === 'INR' ? '₹50L+' : currency === 'AED' ? 'AED 220,000+' : '$60,000+'} minimums to fund real-estate overhead</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-mono">✕</span>
                    <span>Weeks to get simple revision cycles scheduled</span>
                  </li>
                </ul>
              </div>
            </Reveal>

            {/* Typical Freelancer */}
            <Reveal delay={0.15} y={16}>
              <div className="h-full p-6 sm:p-7 rounded-xl bg-surface border border-border space-y-4 opacity-80 hover:opacity-100 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm font-display font-bold text-foreground-soft">INDIVIDUAL FREELANCER</span>
                  <X className="w-4 h-4 text-amber-400" />
                </div>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-mono">✕</span>
                    <span>Disappears when overloaded with concurrent gigs</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-mono">✕</span>
                    <span>Zero documentation or automated regression testing</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-mono">✕</span>
                    <span>Fragmented feedback across chaotic messaging threads</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-mono">✕</span>
                    <span>Zero post-launch warranty or SLA infrastructure</span>
                  </li>
                </ul>
              </div>
            </Reveal>

            {/* The Bitnexel Model */}
            <Reveal delay={0.25} y={16}>
              <div className="h-full p-6 sm:p-7 rounded-xl bg-muted/90 border border-emerald-500/40 ring-1 ring-emerald-500/30 space-y-4 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm font-display font-bold text-emerald-text">THE BITNEXEL MODEL</span>
                  <Check className="w-4 h-4 text-emerald-text" />
                </div>
                <ul className="space-y-3 text-xs text-foreground-soft">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-text shrink-0 mt-0.5" />
                    <span>Direct collaboration with principal software architects</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-text shrink-0 mt-0.5" />
                    <span>Deterministic 50 / 30 / 20 milestone agreements</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-text shrink-0 mt-0.5" />
                    <span>Private Client Portal with real-time staging preview builds</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-text shrink-0 mt-0.5" />
                    <span>100% intellectual property & clean GitHub repository transfer</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-text shrink-0 mt-0.5" />
                    <span>Included 60-day post-launch telemetry warranty</span>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Reveal>

      {/* Studio Compact / Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Reveal delay={0}>
          <div className="h-full p-6 sm:p-8 rounded-2xl studio-panel space-y-3 transition-all duration-300 hover:-translate-y-1">
            <div className="text-xs font-mono text-sky-text font-semibold">PRINCIPLE 01</div>
            <h3 className="text-xl font-display font-bold text-foreground">
              Zero Runtime Baggage
            </h3>
            <p className="text-xs sm:text-sm text-foreground-soft leading-relaxed">
              Every library, CSS token, and asset must justify its existence in bytes and render cycles. We never bundle unused bloatware or speculative abstractions.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full p-6 sm:p-8 rounded-2xl studio-panel space-y-3 transition-all duration-300 hover:-translate-y-1">
            <div className="text-xs font-mono text-emerald-text font-semibold">PRINCIPLE 02</div>
            <h3 className="text-xl font-display font-bold text-foreground">
              Deterministic Milestones
            </h3>
            <p className="text-xs sm:text-sm text-foreground-soft leading-relaxed">
              We scope down ruthlessly to guarantee delivery dates. What is committed to in the Statement of Work is delivered without renegotiation or surprise cost overruns.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Direct CTA */}
      <Reveal>
        <div className="p-8 sm:p-14 rounded-2xl bg-gradient-to-b from-muted to-background border border-border text-center space-y-6 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-accent-text text-xs font-medium">
              <Zap className="w-3.5 h-3.5 text-accent-text" />
              <span>Direct Principal Access</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground">
              Work directly with senior engineering leadership.
            </h2>
            <p className="text-sm text-foreground-soft leading-relaxed">
              Schedule a technical discovery session or launch the project intake wizard to receive an accurate scope within 24 hours.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('start')}
              className="btn-primary px-8 py-3.5 text-xs font-semibold shadow-lg"
            >
              <span>Launch Project Wizard</span>
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="btn-secondary px-6 py-3.5 text-xs font-medium"
            >
              <span>Direct Technical Inquiry</span>
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
};
