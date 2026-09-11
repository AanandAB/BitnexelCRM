'use client';

import React, { useState } from 'react';
import { RouteType } from '../types';
import { CheckCircle2, ArrowRight, Terminal, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reveal } from './Reveal';

interface ProcessViewProps {
  onNavigate: (route: RouteType) => void;
}

export const ProcessView: React.FC<ProcessViewProps> = ({ onNavigate }) => {
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'First Contact & Fit',
      category: 'Inception',
      duration: 'Within 24 Hours',
      summary: 'Prompt, structured intake. No generic automated bot forms or endless back-and-forth.',
      whatWeDo: [
        'Lead architect reviews your business model, current stack, and scope objectives',
        'Direct email or WhatsApp response confirming immediate feasibility',
        'Calendar invite sent for a focused 15-minute qualification alignment'
      ],
      clientDeliverable: 'Initial project brief or problem description via /start or contact form',
      studioDeliverable: 'Confirmed calendar invite & preliminary feasibility notes'
    },
    {
      num: '02',
      title: 'Qualification Alignment',
      category: 'Inception',
      duration: '15–20 Minutes',
      summary: 'A fast, honest assessment. We ensure your goals align with what we build best.',
      whatWeDo: [
        'Deep dive into your technical constraints and commercial goals',
        'Honest assessment if custom software vs off-the-shelf SaaS is right for you',
        'High-level timeline and budget bracket confirmation'
      ],
      clientDeliverable: 'Clarification on decision makers and launch target',
      studioDeliverable: 'Go/No-Go confirmation and proposal prep'
    },
    {
      num: '03',
      title: 'Proposal & Master SOW',
      category: 'Scoping',
      duration: '48–72 Hours',
      summary: 'Fixed-price, milestone-driven scope of work. No surprise hourly invoices.',
      whatWeDo: [
        'Detailed architectural breakdown of every page, feature, and integration',
        'Fixed milestone schedule: 50% deposit, 30% milestone review, 20% post-launch handover',
        'Definitive deliverables checklist and warranty terms'
      ],
      clientDeliverable: 'Signed SOW and countersigned mutual NDA',
      studioDeliverable: 'Comprehensive fixed-scope contract & payment schedule'
    },
    {
      num: '04',
      title: 'Deposit & Portal Kickoff',
      category: 'Kickoff',
      duration: 'Day 1',
      summary: 'Immediate provisioning of your private Client Portal and staging infrastructure.',
      whatWeDo: [
        'Private GitHub repository, staging URL, and Discord/thread channels created',
        'Client Portal credentials issued with live status tracker',
        'Intake checklist for brand assets, typography, and API credentials'
      ],
      clientDeliverable: '50% kickoff deposit & brand assets upload',
      studioDeliverable: 'Active Client Portal & shared staging pipeline'
    },
    {
      num: '05',
      title: 'Discovery & Spec Definition',
      category: 'Architecture',
      duration: 'Week 1',
      summary: 'User journeys, database schemas, and edge cases mapped before touching Figma.',
      whatWeDo: [
        'Data models, RBAC permission matrices, and API route mapping',
        'Low-fidelity wireframing and user flow diagrams',
        'Edge case cataloging (offline states, error boundaries, rate limits)'
      ],
      clientDeliverable: 'Approval of data schemas and user flow diagrams',
      studioDeliverable: 'System architecture document & wireframe deck'
    },
    {
      num: '06',
      title: 'Bespoke UI/UX Design',
      category: 'Design',
      duration: 'Week 2–3',
      summary: 'Figma interactive prototypes styled to your exact brand aesthetics.',
      whatWeDo: [
        'Custom design system (typography, color tokens, dark/glass interfaces)',
        'Clickable prototype demonstrating mobile and desktop layouts',
        'Structured review sprint in Figma for clear, consolidated feedback'
      ],
      clientDeliverable: 'Consolidated design sign-off in Client Portal',
      studioDeliverable: 'Pixel-perfect, approved design token library & Figma prototype'
    },
    {
      num: '07',
      title: 'Sprint Engineering',
      category: 'Development',
      duration: 'Week 3–6',
      summary: 'Clean TypeScript codebase built iteratively with live staging access.',
      whatWeDo: [
        'Full-stack engineering (React 19, Vite, Tailwind CSS, SQL / PostgreSQL)',
        'Continuous staging deployment synced to our Git CI/CD',
        'Weekly async video walkthrough showing real, clickable progress'
      ],
      clientDeliverable: 'Async review of live staging builds and feedback log entries',
      studioDeliverable: 'Fully functional staging application updated weekly'
    },
    {
      num: '08',
      title: 'Rigorous QA & Auditing',
      category: 'Verification',
      duration: 'Week 6–7',
      summary: 'Cross-browser testing, accessibility compliance, and sub-second performance.',
      whatWeDo: [
        'Cross-device testing (iOS, Android, macOS, Windows, tablet viewports)',
        '100/100 Core Web Vitals optimization and database indexing',
        'Security hardening, SQL injection prevention, and penetration review'
      ],
      clientDeliverable: 'Internal team acceptance testing',
      studioDeliverable: 'Comprehensive QA audit report & Lighthouse 95+ certification'
    },
    {
      num: '09',
      title: 'Final Review & Sign-Off',
      category: 'Verification',
      duration: 'Day 45',
      summary: 'Pre-production verification on live data with staging sign-off.',
      whatWeDo: [
        'Staging candidate frozen for final client verification',
        'Structured resolution of all remaining feedback items',
        '30% pre-launch milestone invoice issued upon sign-off'
      ],
      clientDeliverable: 'Final milestone sign-off & payment authorization',
      studioDeliverable: 'Production-ready release candidate build'
    },
    {
      num: '10',
      title: 'DNS Cutover & Launch',
      category: 'Deployment',
      duration: 'Launch Day',
      summary: 'Zero-downtime deployment, SSL provisioning, and IP ownership handover.',
      whatWeDo: [
        'Production DNS routing with global edge CDN & SSL certificates',
        'Complete repository transfer to your company GitHub organization',
        'Recorded administrative walkthrough video for your team'
      ],
      clientDeliverable: 'DNS registrar access or CNAME configuration',
      studioDeliverable: 'Live production URL, repo ownership, & training video'
    },
    {
      num: '11',
      title: 'Post-Launch Warranty & Retainer',
      category: 'Support',
      duration: '60 Days Included',
      summary: '60-day bug warranty included standard, plus ongoing retainer peace of mind.',
      whatWeDo: [
        'Immediate remediation for any unintended behavior or browser regression',
        'Continuous error telemetry monitoring and uptime alerts',
        'Seamless rollover into monthly maintenance for ongoing feature development'
      ],
      clientDeliverable: 'Reporting of any real-world operational questions',
      studioDeliverable: '60-day bug-free warranty SLA and optional retainer activation'
    }
  ];

  const currentStep = steps[selectedStepIndex];

  return (
    <div id="process-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Header */}
      <Reveal className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-accent-text text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-accent-text" />
          <span>Systematic Engineering Methodology</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-foreground tracking-tight">
          The 11-Step Product Lifecycle.
        </h1>
        <p className="text-base sm:text-lg text-foreground-soft">
          From first technical qualification to 60 days post-launch warranty. Structured to eliminate ambiguity, scope creep, and chaotic communications.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: interactive step selector (horizontal scroll on mobile, vertical list on desktop) */}
        <div className="lg:col-span-5">
          <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:px-0 lg:pb-0 lg:snap-none lg:flex-col lg:gap-2 lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[720px] lg:pr-2 lg:pb-2">
            {steps.map((step, idx) => {
              const isSelected = idx === selectedStepIndex;
              return (
                <motion.button
                  key={step.num}
                  onClick={() => setSelectedStepIndex(idx)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative shrink-0 snap-center lg:snap-none min-w-[230px] lg:min-w-0 lg:w-full p-4 rounded-xl border text-left transition-colors ${
                    isSelected ? 'border-indigo-500/50' : 'border-border hover:border-border-strong'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="process-step-indicator"
                      className="absolute inset-0 rounded-xl bg-indigo-500/15"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md shrink-0 ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-surface text-muted-foreground'
                    }`}>
                      {step.num}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className={`block text-sm font-semibold truncate ${isSelected ? 'text-foreground' : 'text-foreground-soft'}`}>
                        {step.title}
                      </span>
                      <span className="block text-[11px] text-muted-foreground truncate">
                        {step.category} · {step.duration}
                      </span>
                    </span>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-accent-text translate-x-1' : 'text-muted-foreground'}`} />
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right: sticky detail card with animated step transitions + progress */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-10 rounded-2xl studio-panel space-y-6 lg:sticky lg:top-28">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="text-muted-foreground uppercase tracking-wider">Project Lifecycle</span>
                <span className="text-foreground">Step {currentStep.num} / {steps.length}</span>
              </div>
              <div className="h-1 w-full rounded-full bg-surface overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400"
                  animate={{ width: `${((selectedStepIndex + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedStepIndex}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-sky-text font-semibold">
                      Step {currentStep.num} of 11 · {currentStep.category}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mt-1">
                      {currentStep.title}
                    </h2>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-muted-foreground block">Typical Window</span>
                    <span className="text-xs font-mono font-bold text-emerald-text">{currentStep.duration}</span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-foreground-soft leading-relaxed">
                  {currentStep.summary}
                </p>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-accent-text flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-accent-text" /> What Bitnexel Executes
                  </h4>
                  <ul className="space-y-2.5">
                    {currentStep.whatWeDo.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-foreground-soft">
                        <CheckCircle2 className="w-4 h-4 text-emerald-text shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border text-xs">
                  <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                    <span className="text-sky-text font-semibold">Studio Deliverable:</span>
                    <p className="text-foreground mt-0.5">{currentStep.studioDeliverable}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
                    <span className="text-accent-text font-semibold">Client Action:</span>
                    <p className="text-foreground mt-0.5">{currentStep.clientDeliverable}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Animated nav buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <motion.button
                disabled={selectedStepIndex === 0}
                onClick={() => setSelectedStepIndex(prev => Math.max(0, prev - 1))}
                whileHover={selectedStepIndex === 0 ? undefined : { x: -3 }}
                whileTap={selectedStepIndex === 0 ? undefined : { scale: 0.97 }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous Step
              </motion.button>

              {selectedStepIndex < steps.length - 1 ? (
                <motion.button
                  onClick={() => setSelectedStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary px-5 py-2.5 text-xs font-semibold flex items-center gap-1.5 shadow-md"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => onNavigate('start')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary px-6 py-2.5 text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                >
                  <span>Start Your Lifecycle</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Quote Banner */}
      <Reveal className="p-8 sm:p-12 rounded-2xl studio-panel text-center max-w-3xl mx-auto space-y-3">
        <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground">
          "Major tech company precision without the agency overhead."
        </h3>
        <p className="text-xs sm:text-sm text-foreground-soft leading-relaxed">
          Traditional agencies pass your brief to junior subcontractors and hide behind account coordinators. At Bitnexel, the senior architects who write your code lead every call and engineer your architecture.
        </p>
      </Reveal>
    </div>
  );
};
