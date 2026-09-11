import React, { useState, useEffect } from 'react';
import { RouteType, CurrencyCode } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { 
  ChevronRight, 
  Calculator, 
  MapPin,
  Check,
  Sparkles,
  Shield,
  Layers,
  Clock,
  Lock
} from 'lucide-react';

interface PricingViewProps {
  onNavigate: (route: RouteType) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onNavigate }) => {
  const { 
    currency, 
    setCurrency, 
    locationInfo, 
    formatAmount, 
    formatCompact, 
    getPricingBracket, 
    getRetainerRate, 
    calculatorConfig, 
    currencyConfig 
  } = useCurrency();

  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [calculatorBudget, setCalculatorBudget] = useState<number>(calculatorConfig.initial);

  // Update calculator when currency changes
  useEffect(() => {
    setCalculatorBudget(calculatorConfig.initial);
  }, [currency, calculatorConfig.initial]);

  const websitePricing = getPricingBracket('website');
  const softwarePricing = getPricingBracket('software');
  const webappPricing = getPricingBracket('webapp');

  const deposit = Math.round(calculatorBudget * 0.5);
  const stagingApproval = Math.round(calculatorBudget * 0.3);
  const finalHandover = Math.round(calculatorBudget * 0.2);

  const projectPackages = [
    {
      id: 'website',
      code: 'CAPABILITY 01',
      name: 'Digital Flagship Platform',
      range: websitePricing.range,
      typicalTime: '4–6 Weeks',
      bestFor: 'High-growth brands, venture-backed companies, luxury studios',
      description: 'Custom React 19 web presence engineered with bespoke Figma design tokens, 120 FPS kinetic stage, and sub-40ms P99 speed.',
      features: [
        'Bespoke Figma UI/UX system (responsive desktop & mobile)',
        'Headless CMS integration (Sanity, Strapi, or Supabase)',
        '100/100 Core Web Vitals audited guarantee',
        'Lead ingestion pipelines (WhatsApp, email, CRM webhooks)',
        'Private Client Portal with real-time staging preview builds',
        '60-day post-launch warranty and telemetry monitoring'
      ],
      cta: 'Scope Flagship Web Platform'
    },
    {
      id: 'software',
      code: 'CAPABILITY 02',
      name: 'Custom Software & Enterprise ERP',
      range: softwarePricing.range,
      typicalTime: '6–10 Weeks',
      bestFor: 'Operational organizations scaling proprietary workflows',
      description: 'Tailor-made internal systems, dispatch consoles, capital portals, and high-throughput automated business workflows.',
      popular: true,
      features: [
        'ACID relational database architecture (PostgreSQL/SQL)',
        'Granular role-based access control (RBAC & multi-role)',
        'External API integrations (ERP, billing, banking, webhooks)',
        'Automated telemetry pipelines and event streaming',
        'Desktop & tablet responsive layouts with keyboard command palette',
        '100% full source code & IP ownership transfer'
      ],
      cta: 'Scope Custom Software'
    },
    {
      id: 'webapp',
      code: 'CAPABILITY 03',
      name: 'Cloud Web Application & SaaS',
      range: webappPricing.range,
      typicalTime: '8–12 Weeks',
      bestFor: 'Founders building multi-tenant SaaS or customer portals',
      description: 'Interactive digital products where users authenticate, manage portfolios, and subscribe with real-time state synchronization.',
      features: [
        'Secure multi-tenant authentication & session management',
        'Global payment gateway integration (Stripe, Razorpay, or Telr)',
        'Real-time WebSocket state synchronization & live charts',
        'Automated transactional emails & event notifications',
        'Continuous staging preview environment access',
        'Edge CDN & production DNS cutover with zero downtime'
      ],
      cta: 'Scope Cloud Application'
    }
  ];

  const retainerPlans = [
    {
      id: 'essentials' as const,
      name: 'Essentials Retainer',
      price: getRetainerRate('essentials', billingPeriod === 'annual'),
      period: 'per month',
      description: 'Continuous uptime, dependency maintenance, and security peace of mind for revenue-critical platforms.',
      hours: '2 hours dedicated / month',
      features: [
        '24/7 synthetic uptime monitoring (60s checks)',
        'Security patch updates & vulnerability audits',
        'Automated daily database & asset snapshots',
        '1 business day response SLA',
        'Minor UI adjustments & copy refinements',
        'Monthly telemetry & health report'
      ]
    },
    {
      id: 'growth' as const,
      name: 'Growth Engineering Retainer',
      price: getRetainerRate('growth', billingPeriod === 'annual'),
      period: 'per month',
      popular: true,
      description: 'Iterative feature development, performance tuning, and continuous deployment.',
      hours: '8 hours dedicated / month',
      features: [
        'Everything in Essentials',
        '8 hours dedicated senior engineering per month',
        'Sub-4-hour priority response SLA',
        'Continuous staging environment maintenance',
        'Monthly Core Web Vitals & technical SEO optimization',
        'Database query tuning & index optimization'
      ]
    },
    {
      id: 'scale' as const,
      name: 'Scale & Technical Advisory',
      price: getRetainerRate('scale', billingPeriod === 'annual'),
      period: 'per month',
      description: 'Senior technical director advisory, architectural reviews, and high-priority escalation.',
      hours: '20 hours dedicated / month',
      features: [
        'Everything in Growth',
        '20 hours dedicated senior engineering per month',
        'Sub-1-hour critical incident SLA',
        'Bi-weekly architectural consultation & roadmap review',
        'Dedicated Slack/Teams channel with principal engineers',
        'Quarterly security penetration audit assistance'
      ]
    }
  ];

  return (
    <div id="pricing-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-24">
      {/* Header */}
      <div className="space-y-4 pb-8 border-b border-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-foreground text-[12px] font-normal">
            <Sparkles className="w-3.5 h-3.5 text-[#2997ff]" />
            <span>Transparent Milestone Pricing</span>
          </div>

          {/* Region / Currency Indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-[#2997ff]" />
            <span>Region Detected:</span>
            <span className="text-foreground font-medium">{locationInfo.country}</span>
            <span className="text-muted-foreground">· Pricing in</span>
            <span className="px-2 py-0.5 rounded-full bg-[#0071e3]/10 text-[#2997ff] font-mono font-medium">
              {currency}
            </span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-semibold text-foreground tracking-[-0.03em] leading-[1.06]">
          Predictable Capital. Verifiable Milestones.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Fixed deliverable scopes structured around our 50/30/20 verification model. You maintain financial leverage from start to final repository transfer.
        </p>
      </div>

      {/* 3 Core Package Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {projectPackages.map((pkg) => {
          return (
            <div
              key={pkg.id}
              className={`p-6 sm:p-8 rounded-[20px] apple-tile-card flex flex-col justify-between space-y-6 ${
                pkg.popular 
                  ? 'border-[#0071e3] ring-1 ring-[#0071e3]/40 bg-muted' 
                  : 'bg-muted'
              }`}
            >
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#2997ff] font-medium">
                    {pkg.code}
                  </span>
                  {pkg.popular && (
                    <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#0071e3] text-white">
                      Most Selected
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-display font-semibold text-foreground tracking-tight">
                    {pkg.name}
                  </h3>
                  <div className="text-3xl font-display font-semibold text-foreground mt-2 tracking-tight">
                    {pkg.range}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#2997ff]" />
                    <span>Typical Delivery: {pkg.typicalTime}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {pkg.description}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-border">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Engineered Deliverables:
                  </div>
                  <ul className="space-y-2.5">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-foreground-soft">
                        <Check className="w-4 h-4 text-[#2997ff] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => onNavigate('start')}
                className={`w-full py-2.5 px-4 text-xs font-normal flex items-center justify-center gap-1.5 transition-all ${
                  pkg.popular ? 'apple-btn-primary' : 'apple-btn-secondary'
                }`}
              >
                <span>{pkg.cta}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Interactive Milestone Calculator (50 / 30 / 20 Rule) */}
      <div className="p-6 sm:p-10 rounded-[20px] apple-tile-card space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#2997ff] font-semibold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" /> 50 / 30 / 20 Capital Architecture
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-semibold text-foreground mt-1 tracking-tight">
              Verifiable Milestone Schedule
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mt-1">
              You maintain financial leverage at every step. We never bill vague sprint hours or request 100% upfront capital.
            </p>
          </div>

          {/* Budget Slider */}
          <div className="p-5 rounded-2xl bg-surface border border-border lg:w-96 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Target Investment:</span>
              <span className="font-display font-semibold text-foreground text-lg">
                {formatAmount(calculatorBudget)}
              </span>
            </div>
            <input
              type="range"
              min={calculatorConfig.min}
              max={calculatorConfig.max}
              step={calculatorConfig.step}
              value={calculatorBudget}
              onChange={(e) => setCalculatorBudget(Number(e.target.value))}
              className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-[#0071e3]"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>{formatCompact(calculatorConfig.min)}</span>
              <span>{formatCompact(Math.round((calculatorConfig.min + calculatorConfig.max) / 2))}</span>
              <span>{formatCompact(calculatorConfig.max)}+</span>
            </div>
          </div>
        </div>

        {/* 3 Interactive Milestone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#2997ff]">
                STAGE 01 // 50%
              </span>
              <span className="text-lg font-semibold text-foreground font-mono">
                {formatAmount(deposit)}
              </span>
            </div>
            <div className="text-sm font-display font-semibold text-foreground">
              Kickoff & Architecture Specification
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Paid upon signing the SOW and mutual NDA. Secures sprint engineering capacity, system architecture blueprints, and Figma design tokens.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-accent-text">
                STAGE 02 // 30%
              </span>
              <span className="text-lg font-semibold text-foreground font-mono">
                {formatAmount(stagingApproval)}
              </span>
            </div>
            <div className="text-sm font-display font-semibold text-foreground">
              Staging Validation & QA Sign-Off
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Paid only after you test the complete, interactive system on your private live staging link and verify all core user journeys.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-text">
                STAGE 03 // 20%
              </span>
              <span className="text-lg font-semibold text-foreground font-mono">
                {formatAmount(finalHandover)}
              </span>
            </div>
            <div className="text-sm font-display font-semibold text-foreground">
              Production Handover & Code Transfer
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Paid upon production cutover, GitHub repository transfer to your organization, and starts your 60-day telemetry warranty window.
            </p>
          </div>
        </div>
      </div>

      {/* Retainer & Maintenance Plans */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#2997ff] font-semibold">
              POST-LAUNCH TELEMETRY & ADVISORY
            </span>
            <h2 className="text-3xl font-display font-semibold text-foreground mt-1 tracking-tight">
              Monthly Engineering Retainers
            </h2>
          </div>

          {/* Billing Period Toggle */}
          <div className="flex items-center p-1 rounded-full bg-muted border border-border text-xs">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-3.5 py-1 rounded-full transition-all ${
                billingPeriod === 'monthly' ? 'bg-[#0071e3] text-white font-medium' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              MONTHLY
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-3.5 py-1 rounded-full transition-all ${
                billingPeriod === 'annual' ? 'bg-[#0071e3] text-white font-medium' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ANNUAL (SAVE 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {retainerPlans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 sm:p-8 rounded-[20px] apple-tile-card flex flex-col justify-between space-y-6 ${
                plan.popular ? 'border-[#0071e3] bg-muted ring-1 ring-[#0071e3]/40' : 'bg-muted'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <h4 className="text-xl font-display font-semibold text-foreground">
                    {plan.name}
                  </h4>
                  {plan.popular && (
                    <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#0071e3] text-white">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-display font-semibold text-foreground tracking-tight">
                    {formatAmount(plan.price)}
                    <span className="text-xs font-mono text-muted-foreground font-normal"> / mo</span>
                  </div>
                  <div className="text-xs text-[#2997ff] font-medium">
                    {plan.hours}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">{plan.description}</p>

                <ul className="space-y-2.5 pt-3 border-t border-border">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-foreground-soft">
                      <Check className="w-3.5 h-3.5 text-[#2997ff] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onNavigate('contact')}
                className="apple-btn-secondary w-full py-2.5 text-xs font-normal"
              >
                Inquire About Retainer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
