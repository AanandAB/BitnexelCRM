'use client';

import React, { useState } from 'react';
import { RouteType } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { ChevronRight, Clock, ChevronDown, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SegmentedTabs } from './SegmentedTabs';
import { Reveal } from './Reveal';

type DisciplineTab = 'all' | 'website' | 'software' | 'webapp';

const DISCIPLINE_TABS: { id: DisciplineTab; label: string }[] = [
  { id: 'all', label: 'All Disciplines' },
  { id: 'website', label: 'Digital Flagships' },
  { id: 'software', label: 'Custom Software' },
  { id: 'webapp', label: 'Web Applications' },
];

interface ServicesViewProps {
  initialSubTab?: DisciplineTab;
  onNavigate: (route: RouteType) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ initialSubTab = 'all', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<DisciplineTab>(initialSubTab);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { getPricingBracket, currency } = useCurrency();

  const websiteFaqs = [
    {
      q: "How long does a digital flagship take from kickoff to production?",
      a: "Our typical sprint is 4 to 6 weeks. Focused 1–4 page marketing flagships can launch in 3 weeks, while complex headless architectures with custom 3D WebGL interactions take around 6 weeks."
    },
    {
      q: "Do you build on WordPress or custom code?",
      a: "We engineer modern, headless web applications using React, TypeScript, and Tailwind CSS, paired with headless CMS engines (Sanity, Strapi). This guarantees sub-40ms page loads, zero plugin security vulnerabilities, and complete design freedom."
    },
    {
      q: "Who owns the code and domain after launch?",
      a: "You own 100% of all intellectual property, source code, Figma design files, and DNS configurations. We transfer the private GitHub repository upon final milestone sign-off."
    }
  ];

  const softwareFaqs = [
    {
      q: "What kind of custom software does Bitnexel engineer?",
      a: "We specialize in internal operations engines: logistics dispatchers, inventory management systems, financial capital allocation portals, automated document generation pipelines, and integrations between legacy ERPs/CRMs."
    },
    {
      q: "Can this software run on both desktop and mobile devices?",
      a: "Yes. We build responsive web software that runs smoothly across desktop monitors, iPads, and mobile browsers, and can compile to native desktop binaries when local hardware access is required."
    },
    {
      q: "How do you ensure enterprise data security and compliance?",
      a: "All data storage utilizes AES-256 encryption at rest, TLS 1.3 in transit, role-based access control (RBAC), and strict database security rules. We design systems to pass SOC2 Type II compliance audits."
    }
  ];

  const webAppFaqs = [
    {
      q: "What is the difference between a website and a web app?",
      a: "A website is primarily designed to present, market, and capture inbound inquiries. A web app is an interactive software product where authenticated users manage data, pay subscriptions, or execute automated business workflows."
    },
    {
      q: "Do you handle payment gateways and subscription billing?",
      a: "Yes. We integrate Stripe, Lemon Squeezy, or custom regional banking APIs (Razorpay / Telr) for one-time payments, tiered recurring subscriptions, and multi-tenant marketplace payouts."
    },
    {
      q: "Can you take over an existing half-finished codebase?",
      a: "We conduct a thorough architectural audit before committing. If the existing code is clean TypeScript, we can take it over. If it contains severe technical debt, we will recommend a clean, rapid re-architecture to guarantee long-term stability."
    }
  ];

  const currentFaqs = 
    activeTab === 'website' ? websiteFaqs :
    activeTab === 'software' ? softwareFaqs :
    activeTab === 'webapp' ? webAppFaqs :
    [...websiteFaqs.slice(0, 1), ...softwareFaqs.slice(0, 1), ...webAppFaqs.slice(0, 1)];

  return (
    <div id="services-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-24">
      {/* Header */}
      <Reveal className="space-y-4 pb-8 border-b border-border">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-foreground text-[12px] font-normal">
          <Sparkles className="w-3.5 h-3.5 text-[#2997ff]" />
          <span>Core Engineering Disciplines</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-semibold text-foreground tracking-[-0.03em] leading-[1.06]">
          Three Disciplines. Zero Generic Templates.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Engineered for companies where sub-second latency, deterministic milestones, and direct senior engineer communication are requirements, not luxuries.
        </p>

        {/* Animated discipline tabs */}
        <div className="pt-1">
          <SegmentedTabs
            tabs={DISCIPLINE_TABS}
            active={activeTab}
            onChange={(id) => setActiveTab(id as DisciplineTab)}
            layoutId="services-discipline-tabs"
          />
        </div>
      </Reveal>

      {/* DISCIPLINE 1: WEBSITE */}
      {(activeTab === 'all' || activeTab === 'website') && (
        <Reveal><section className="p-6 sm:p-10 rounded-[20px] apple-tile-card space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 text-xs font-mono text-[#2997ff] font-medium">
                DISCIPLINE 01 // DIGITAL FLAGSHIPS
              </span>
              <h2 className="text-3xl font-display font-semibold text-foreground tracking-tight">
                A flagship presence engineered to convert leads into revenue.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We craft bespoke corporate flagships and boutique digital experiences that reflect real craftsmanship. Never built on bloated themes or slow page builders — only clean, semantic code with 60–120fps micro-interactions.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-surface border border-border">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#2997ff]" /> Typical Sprint
                  </div>
                  <div className="text-base font-display font-semibold text-foreground mt-1">4–6 Weeks</div>
                </div>
                <div className="p-4 rounded-xl bg-surface border border-border">
                  <div className="text-xs text-muted-foreground">
                    Investment Baseline ({currency})
                  </div>
                  <div className="text-base font-display font-semibold text-foreground mt-1">
                    {getPricingBracket('website')?.range}
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="p-6 sm:p-8 rounded-[16px] bg-surface border border-border lg:w-96 space-y-5 shrink-0">
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Deliverable Checklist:
              </div>
              <ul className="space-y-2.5 text-xs text-foreground-soft">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>Bespoke UI/UX design tokens in Figma</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>100/100 Core Web Vitals audit score</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>WhatsApp & CRM webhook routing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>Comprehensive technical SEO & sitemaps</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>Dedicated private Client Portal access</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>60-day post-launch telemetry warranty</span>
                </li>
              </ul>

              <button
                onClick={() => onNavigate('start')}
                className="apple-btn-primary w-full py-2.5 text-xs font-normal"
              >
                <span>Scope Flagship Platform</span>
                <ChevronRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </section></Reveal>
      )}

      {/* DISCIPLINE 2: CUSTOM SOFTWARE */}
      {(activeTab === 'all' || activeTab === 'software') && (
        <Reveal><section className="p-6 sm:p-10 rounded-[20px] apple-tile-card space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-text font-medium">
                DISCIPLINE 02 // CUSTOM SOFTWARE & ERPS
              </span>
              <h2 className="text-3xl font-display font-semibold text-foreground tracking-tight">
                A custom tool or operational engine to run your business.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Replace brittle spreadsheets and clunky generic SaaS with software designed around your company's exact operational logic. Automated dispatchers, inventory managers, capital allocation suites, and automated workflow pipelines.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-surface border border-border">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#2997ff]" /> Typical Sprint
                  </div>
                  <div className="text-base font-display font-semibold text-foreground mt-1">6–10 Weeks</div>
                </div>
                <div className="p-4 rounded-xl bg-surface border border-border">
                  <div className="text-xs text-muted-foreground">
                    Investment Baseline ({currency})
                  </div>
                  <div className="text-base font-display font-semibold text-foreground mt-1">
                    {getPricingBracket('software')?.range}
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="p-6 sm:p-8 rounded-[16px] bg-surface border border-border lg:w-96 space-y-5 shrink-0">
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Deliverable Checklist:
              </div>
              <ul className="space-y-2.5 text-xs text-foreground-soft">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>Custom database architecture (PostgreSQL / Redis)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>Role-based access permissions (RBAC)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>API integrations (accounting, CRM, ERP)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>Desktop & tablet responsive interface</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>Full source code and database ownership</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>60-day warranty & automated snapshots</span>
                </li>
              </ul>

              <button
                onClick={() => onNavigate('start')}
                className="apple-btn-primary w-full py-2.5 text-xs font-normal"
              >
                <span>Scope Custom Software</span>
                <ChevronRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </section></Reveal>
      )}

      {/* DISCIPLINE 3: WEB APPLICATIONS */}
      {(activeTab === 'all' || activeTab === 'webapp') && (
        <Reveal><section className="p-6 sm:p-10 rounded-[20px] apple-tile-card space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-accent-text font-medium">
                DISCIPLINE 03 // CLOUD WEB APPS & SAAS
              </span>
              <h2 className="text-3xl font-display font-semibold text-foreground tracking-tight">
                An interactive digital product your users log into and use.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                From customer-facing investor portals and fintech workflows to multi-tenant SaaS products with subscription billing. Fast, secure, and built with production TypeScript architecture that scales.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-surface border border-border">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#2997ff]" /> Typical Sprint
                  </div>
                  <div className="text-base font-display font-semibold text-foreground mt-1">8–12 Weeks</div>
                </div>
                <div className="p-4 rounded-xl bg-surface border border-border">
                  <div className="text-xs text-muted-foreground">
                    Investment Baseline ({currency})
                  </div>
                  <div className="text-base font-display font-semibold text-foreground mt-1">
                    {getPricingBracket('webapp')?.range}
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="p-6 sm:p-8 rounded-[16px] bg-surface border border-border lg:w-96 space-y-5 shrink-0">
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Deliverable Checklist:
              </div>
              <ul className="space-y-2.5 text-xs text-foreground-soft">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>Secure multi-tenant authentication & sessions</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>Stripe subscription billing & tiered plans</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>Real-time interactive graphs & data tables</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>Automated email pipelines (Postmark / Resend)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>End-to-end continuous staging preview</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#2997ff] shrink-0" />
                  <span>Production DNS cutover & 60-day warranty</span>
                </li>
              </ul>

              <button
                onClick={() => onNavigate('start')}
                className="apple-btn-primary w-full py-2.5 text-xs font-normal"
              >
                <span>Scope Web Application</span>
                <ChevronRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </section></Reveal>
      )}

      {/* Service FAQs Accordion */}
      <Reveal><section className="p-6 sm:p-10 rounded-[20px] apple-tile-card space-y-6">
        <div className="border-b border-border pb-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#2997ff] font-semibold">
            ENGINEERING KNOWLEDGE BASE
          </div>
          <h3 className="text-2xl font-display font-semibold text-foreground mt-1 tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {currentFaqs.map((faq, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-surface border border-border cursor-pointer transition-colors hover:border-white/[0.15]"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="flex items-center justify-between text-sm font-display font-semibold text-foreground">
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openFaq === i ? 'rotate-180 text-foreground' : ''}`} />
              </div>
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-xs text-muted-foreground leading-relaxed font-sans border-t border-border pt-3">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section></Reveal>
    </div>
  );
};
