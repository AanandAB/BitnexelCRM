'use client';

import React, { useState } from 'react';
import { RouteType, CaseStudy } from '../types';
import { CASE_STUDIES } from '../data/mockData';
import { useCurrency } from '../context/CurrencyContext';
import { TiltCard } from './TiltCard';
import { Reveal } from './Reveal';
import { TestimonialsSection } from '@/components/blocks/testimonials-with-marquee';
import ShimmerText from '@/components/ui/shimmer-text';
import { TextEffect } from '@/components/core/text-effect';
import { GlowEffect } from '@/components/core/glow-effect';
import { 
  ChevronRight, 
  Check,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';

// Field Manuals book-cover palette & roman numerals (ThreeUI reference)
const COVER_COLORS = ['#363126', '#945a3e', '#566044'];
const COVER_INKS = ['#31291e', '#4b281a', '#293024'];
const COVER_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const BOOK_ROT = [-4, 0, 4];
const BOOK_YAW = [-4, 0, 4];
// Client testimonials for the marquee section (21st.dev testimonials-with-marquee)
const TESTIMONIALS = [
  {
    author: {
      name: 'Julian Vance',
      handle: 'Managing Partner · Apex Asset Management',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&q=80&auto=format&fit=crop',
    },
    text: "I got a live portal where I watched my platform come together sprint by sprint. Investor onboarding dropped from two weeks to two days.",
  },
  {
    author: {
      name: 'Daniel Okafor',
      handle: 'Head of Operations · Kinetix Freight Technologies',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&q=80&auto=format&fit=crop',
    },
    text: "We replaced spreadsheets and phone calls with a dispatch engine our drivers actually use. Fuel waste fell 31% in the first quarter.",
  },
  {
    author: {
      name: 'Elena Marchetti',
      handle: 'Creative Director · Velora Atelier Milan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&q=80&auto=format&fit=crop',
    },
    text: "The new flagship feels like walking through our showroom. B2B inquiries are up 185% within three months.",
  },
  {
    author: {
      name: 'Marcus Chen',
      handle: 'VP Engineering · Cobalt Robotics',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&q=80&auto=format&fit=crop',
    },
    text: "The live fleet map alone paid for the build. We went from reactive firefighting to proactive maintenance within a month.",
  },
  {
    author: {
      name: 'Sofia Anders',
      handle: 'Director of Operations · Hearthstone Hospitality',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&q=80&auto=format&fit=crop',
    },
    text: "For the first time, one screen tells the whole story — housekeeping, front desk, and revenue all off the same live data.",
  },
  {
    author: {
      name: 'Amara Osei',
      handle: 'Founder & CEO · Solstice Skincare',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&q=80&auto=format&fit=crop',
    },
    text: "The customizer made our products feel premium in a way no template could. Subscriptions took off almost immediately.",
  },
];


interface HomeViewProps {
  onNavigate: (route: RouteType) => void;
  onSelectCaseStudy: (caseStudy: CaseStudy) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onSelectCaseStudy }) => {
  const [activeDiscipline, setActiveDiscipline] = useState<'website' | 'software' | 'webapp'>('website');
  
  const { getPricingBracket, formatAmount, currency } = useCurrency();

  const disciplines = {
    website: {
      code: 'DISCIPLINE 01',
      title: 'Digital Flagship Platforms',
      badge: 'Interactive & 3D Web',
      summary: 'High-conversion, sub-second web platforms engineered for luxury, enterprise software, and high-growth brands where performance directly commands market authority.',
      benchmarks: [
        { label: 'Core Web Vitals', value: '100 / 100 / 100' },
        { label: 'Global TTFB', value: '< 38ms' },
        { label: 'Bundle Efficiency', value: '42KB gzipped' },
        { label: 'Rendering Rate', value: 'Steady 120 FPS' }
      ],
      stack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'Three.js / WebGL', 'Global Edge CDN'],
      startingAt: getPricingBracket('website').startingAt,
      route: 'services/website' as RouteType
    },
    software: {
      code: 'DISCIPLINE 02',
      title: 'Custom Software & Enterprise ERPs',
      badge: 'Bespoke Engineering',
      summary: 'Proprietary enterprise tools, automated workflow pipelines, and core business engines tailored exactly around your organization’s unique operational logic.',
      benchmarks: [
        { label: 'Query Response', value: '< 16ms P99' },
        { label: 'Event Throughput', value: '10,000+ evt/s' },
        { label: 'Availability SLA', value: '99.995%' },
        { label: 'Security Grade', value: 'SOC2 / AES-256' }
      ],
      stack: ['Go / Rust', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'Event Streams'],
      startingAt: getPricingBracket('software').startingAt,
      route: 'services/software' as RouteType
    },
    webapp: {
      code: 'DISCIPLINE 03',
      title: 'Cloud Web Applications & SaaS',
      badge: 'Multi-Tenant Scale',
      summary: 'High-concurrency SaaS products, financial portals, and interactive cloud systems with deterministic state machines, real-time collaboration, and bulletproof security.',
      benchmarks: [
        { label: 'State Sync Latency', value: '< 12ms' },
        { label: 'Concurrent Sessions', value: '50,000+' },
        { label: 'Auth Handshake', value: '< 55ms' },
        { label: 'Disaster Recovery', value: 'RPO < 30s' }
      ],
      stack: ['React 19', 'Node.js / Express', 'WebSockets', 'PostgreSQL', 'Stripe Billing', 'REST/GraphQL'],
      startingAt: getPricingBracket('webapp').startingAt,
      route: 'services/web-app' as RouteType
    }
  };

  const activeData = disciplines[activeDiscipline];

  return (
    <div id="home-view" className="space-y-24 sm:space-y-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Hero Product Section - Apple Style */}
      <section className="pt-8 sm:pt-14 text-center space-y-6">
        
        {/* Apple Category Tagline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-foreground text-[12px] font-normal tracking-tight">
          <Sparkles className="w-3.5 h-3.5 text-[#2997ff]" />
          <span>Bitnexel Engineering Studio · 2026 Systems Architecture</span>
        </div>

        {/* Hero Headline in SF Pro Display with negative letter spacing */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-semibold text-foreground tracking-[-0.03em] leading-[1.06]">
                      <TextEffect as="span" preset="fade-in-blur" speedReveal={1.1} speedSegment={0.3}>Engineered for speed. Built without compromise.</TextEffect>
                    </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
            We design and build bespoke web flagships, enterprise software engines, and cloud applications with zero runtime bloat.
          </p>
        </div>

        {/* Apple Pill Action Pair */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <div className="relative">
            <GlowEffect
              colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F']}
              mode="colorShift"
              blur="soft"
              duration={3}
              scale={0.9}
            />
            <button
              id="hero-start-project-btn"
              onClick={() => onNavigate('start')}
              className="group relative apple-btn-primary px-8 py-3.5 text-base font-medium hover:scale-[1.04] active:scale-95"
            >
              <span>Start Your Build</span>
              <ChevronRight className="w-4 h-4 text-white ml-0.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
          <button
            id="hero-see-work-btn"
            onClick={() => onNavigate('work')}
            className="apple-btn-secondary px-6 py-2.5 text-sm font-normal active:scale-95 transition-transform"
          >
            <span>Explore Case Studies</span>
            <ChevronRight className="w-4 h-4 text-[#2997ff] ml-0.5" />
          </button>
        </div>

      </section>

      {/* 2. Core Capabilities - Alternating Apple Tiles */}
      <section id="disciplines-matrix" className="space-y-8 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#2997ff] font-medium">
              DISCIPLINES
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-foreground mt-1 tracking-tight">
                          <ShimmerText>Three Disciplines. Zero Generic Templates.</ShimmerText>
                        </h2>
          </div>

          {/* Interactive Discipline Switcher */}
          <div className="flex items-center p-1 rounded-full bg-muted border border-border">
            {(['website', 'software', 'webapp'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveDiscipline(key)}
                className={`px-4 py-1.5 text-xs rounded-full font-medium transition-all ${
                  activeDiscipline === key
                    ? 'bg-[#0071e3] text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {key === 'website' ? 'Flagship Web' : key === 'software' ? 'Custom Software' : 'Web Applications'}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Discipline Panel */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-6 apple-tile-card p-6 sm:p-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-surface text-[11px] font-mono text-foreground font-medium">
                {activeData.code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0071e3]/10 text-[11px] text-[#2997ff] font-medium">
                {activeData.badge}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-semibold text-foreground tracking-tight">
              {activeData.title}
            </h3>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {activeData.summary}
            </p>

            {/* Benchmarks Grid */}
            <div className="space-y-2.5 pt-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Audited Engineering Benchmarks
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeData.benchmarks.map((b, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface border border-border">
                    <div className="text-[11px] text-muted-foreground">{b.label}</div>
                    <div className="text-sm font-semibold text-foreground mt-0.5">{b.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack Chips */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Technology Architecture
              </div>
              <div className="flex flex-wrap gap-2">
                {activeData.stack.map((item, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-surface border border-border text-xs text-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-[16px] bg-muted border border-border space-y-6">
            <div>
              <div className="text-[11px] font-mono uppercase text-muted-foreground tracking-wider">
                Investment Baseline
              </div>
              <div className="text-3xl sm:text-4xl font-display font-semibold text-foreground mt-1 tracking-tight">
                From {activeData.startingAt}
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Structured in clear 50 / 30 / 20 milestone agreements. 100% intellectual property and clean repository transfer upon completion.
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <button
                onClick={() => onNavigate(activeData.route)}
                className="apple-btn-primary w-full py-2.5 text-xs font-normal"
              >
                <span>Inspect Technical Scope</span>
                <ChevronRight className="w-3.5 h-3.5 text-white" />
              </button>
              <button
                onClick={() => onNavigate('start')}
                className="apple-btn-secondary w-full py-2.5 text-xs font-normal"
              >
                <span>Launch Project Wizard</span>
              </button>
            </div>
          </div>
        </Reveal>
      </section>

            {/* 3. Client Testimonials & Trust (marquee) */}
      <TestimonialsSection
        title="Built alongside people who care about their work"
        description="A few words from the founders, operators, and design directors we ship with."
        testimonials={TESTIMONIALS}
      />


      {/* 5. Selected Work & Production Deployments in Apple Utility Cards */}
      <section className="space-y-8 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="text-[12px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
              PROVEN DEPLOYMENTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-foreground mt-1 tracking-tight">
                          <ShimmerText>Production Case Studies</ShimmerText>
                        </h2>
          </div>
          <button
            onClick={() => onNavigate('work')}
            className="apple-link text-xs font-normal"
          >
            <span>View All Engineering Archives</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10" style={{ perspective: '1400px' }}>
          {CASE_STUDIES.filter((cs) => cs.featured).map((project, i) => (
            <button
              key={project.id}
              type="button"
              className="book-card"
              onClick={() => onSelectCaseStudy(project)}
              style={{
                '--cover-color': COVER_COLORS[i % COVER_COLORS.length],
                '--cover-ink': COVER_INKS[i % COVER_INKS.length],
                '--cover': `url('${project.image}')`,
                '--r': `${BOOK_ROT[i % BOOK_ROT.length]}deg`,
                '--yaw': `${BOOK_YAW[i % BOOK_YAW.length]}deg`,
              } as React.CSSProperties}
            >
              <span className="book" aria-hidden="true">
                <span className="book-shadow"></span>
                <span className="book-back"></span>
                <span className="page-block"></span>
                <span className="page-fan"><i></i><i></i><i></i><i></i></span>
                <span className="front-cover">
                  <span className="cover-copy">
                    <span className="cover-kicker">Field Manual · {COVER_ROMAN[i % COVER_ROMAN.length]}</span>
                    <span className="cover-title">{project.client.split(' ')[0]}</span>
                    <span className="cover-subtitle">{project.category}</span>
                    <span></span>
                    <span className="cover-footer">{project.techStack.slice(0, 2).join(' · ')}</span>
                  </span>
                </span>
                <span className="open-badge">Read</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 6. Studio Principles & Direct Commitments */}
      <section className="apple-tile-card p-6 sm:p-10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-text text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-text" />
            <span>The Bitnexel Client Compact</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground tracking-tight">
                      <ShimmerText>Engineering Transparency. Zero Agency Bureaucracy.</ShimmerText>
                    </h2>
          <p className="text-sm text-muted-foreground">
            How we protect your capital, engineering timeline, and commercial advantage from inception to deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TiltCard reveal revealDelay={0} className="p-6 rounded-2xl bg-surface border border-border space-y-2.5">
            <div className="text-xs font-mono text-[#2997ff] font-bold">01 // DIRECT ARCHITECTS</div>
            <h4 className="text-sm font-display font-semibold text-foreground">Direct Principal Access</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You collaborate directly with senior software architects, eliminating middle management and communication telephone games.
            </p>
          </TiltCard>

          <TiltCard reveal revealDelay={0.06} className="p-6 rounded-2xl bg-surface border border-border space-y-2.5">
            <div className="text-xs font-mono text-emerald-text font-bold">02 // FIXED MILESTONES</div>
            <h4 className="text-sm font-display font-semibold text-foreground">50/30/20 Milestone Billing</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Deposit to begin, verified prototype checkpoint, and final release sign-off. Guaranteed scope with zero hidden hourly fees.
            </p>
          </TiltCard>

          <TiltCard reveal revealDelay={0.12} className="p-6 rounded-2xl bg-surface border border-border space-y-2.5">
            <div className="text-xs font-mono text-accent-text font-bold">03 // 100% REPO IP</div>
            <h4 className="text-sm font-display font-semibold text-foreground">Complete Code Ownership</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Full GitHub repository and cloud infrastructure access transferred to your team. Clean TypeScript, zero lock-in.
            </p>
          </TiltCard>

          <TiltCard reveal revealDelay={0.18} className="p-6 rounded-2xl bg-surface border border-border space-y-2.5">
            <div className="text-xs font-mono text-purple-400 font-bold">04 // 60-DAY WARRANTY</div>
            <h4 className="text-sm font-display font-semibold text-foreground">Post-Launch Warranty</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every production release includes 60 days of telemetry monitoring, bug remediation, and performance tuning at zero cost.
            </p>
          </TiltCard>
        </div>
      </section>

      {/* 7. Final Action Product Tile - Edge-to-Edge Apple Style */}
      <section className="p-8 sm:p-14 rounded-[24px] bg-muted border border-border text-center space-y-6 shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface text-foreground text-xs font-medium">
            <Zap className="w-3.5 h-3.5 text-[#2997ff]" />
            <span>Ready to Build</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-semibold text-foreground tracking-tight">
                      <ShimmerText>Scope your project in under 3 minutes.</ShimmerText>
                    </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Step through our interactive project wizard. Select your exact technical requirements, review estimated timelines, and receive a milestone proposal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            id="final-cta-start-btn"
            onClick={() => onNavigate('start')}
            className="apple-btn-primary px-7 py-3 text-sm font-normal"
          >
            <span>Launch Project Wizard</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="apple-btn-secondary px-6 py-3 text-sm font-normal"
          >
            <span>Direct Technical Inquiry</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground pt-3 font-mono">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-text" /> P99 Latency &lt; 40ms SLA
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-text" /> 100% Repository IP Ownership
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-text" /> Fixed Deliverable Milestones
          </span>
        </div>
      </section>

    </div>
  );
};
