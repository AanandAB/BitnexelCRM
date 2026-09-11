'use client';

import React, { useState, useEffect } from 'react';
import { ServiceBranch, OnboardingState, PortalProject, RouteType } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { WIZARD_BUDGET_OPTIONS } from '../utils/currency';
import { 
  Globe, 
  Cpu, 
  Layers, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Info, 
  Sparkles, 
  Lock, 
  FileText, 
  Shield, 
  CheckCircle2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { submitLead } from '../lib/leads';

interface StartProjectWizardProps {
  initialBranch?: ServiceBranch | null;
  onNavigate: (route: RouteType) => void;
  onCompleteOnboarding: (newProject: PortalProject) => void;
}

export const StartProjectWizard: React.FC<StartProjectWizardProps> = ({ 
  initialBranch = null, 
  onNavigate,
  onCompleteOnboarding 
}) => {
  const { currency, formatAmount, getPricingBracket } = useCurrency();
  const [branch, setBranch] = useState<ServiceBranch | null>(initialBranch);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Helper triage state for "Not sure — help me decide"
  const [showDecideHelper, setShowDecideHelper] = useState(false);
  const [decideStep, setDecideStep] = useState(1);
  const [decideAnswers, setDecideAnswers] = useState<{
    hasAccounts?: boolean;
    primaryPurpose?: 'marketing' | 'workflow' | 'product';
    customLogic?: boolean;
  }>({});

  // Form State
  const [answers, setAnswers] = useState<OnboardingState['answers']>({
    projectName: '',
    businessName: '',
    mainGoal: '',
    pageCount: '',
    hasBranding: '',
    features: [],
    contentProvider: '',
    timeline: '',
    budgetRange: '',
    // Software
    processToImprove: '',
    internalUsers: '',
    integrations: [],
    dataPrivacyStrict: '',
    accessType: '',
    // Web App
    needAccounts: '',
    coreUserAction: '',
    needPayments: '',
    paymentType: '',
    targetPlatforms: [],
    existingDesigns: ''
  });

  const [accountInfo, setAccountInfo] = useState({
    name: '',
    email: '',
    company: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewScreen, setShowReviewScreen] = useState(false);

  // Total steps per branch
  const getTotalSteps = () => {
    switch (branch) {
      case 'website': return 7;
      case 'software': return 6;
      case 'webapp': return 6;
      default: return 7;
    }
  };

  const totalSteps = getTotalSteps();

  const handleSelectBranch = (b: ServiceBranch) => {
    setBranch(b);
    setCurrentStep(1);
    setShowReviewScreen(false);
  };

  const handleAutoAdvance = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setTimeout(() => {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        setShowReviewScreen(true);
      }
    }, 280);
  };

  const toggleMultiSelect = (key: 'features' | 'integrations' | 'targetPlatforms', item: string) => {
    setAnswers(prev => {
      const currentList = (prev[key] as string[]) || [];
      const exists = currentList.includes(item);
      const updated = exists ? currentList.filter(x => x !== item) : [...currentList, item];
      return { ...prev, [key]: updated };
    });
  };

  const handleDecideHelperComplete = (primary: 'marketing' | 'workflow' | 'product') => {
    setShowDecideHelper(false);
    if (primary === 'marketing') {
      handleSelectBranch('website');
    } else if (primary === 'workflow') {
      handleSelectBranch('software');
    } else {
      handleSelectBranch('webapp');
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountInfo.email || !accountInfo.name) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Create new scoped project for portal
      const categoryMap = {
        website: 'Website' as const,
        software: 'Custom Software' as const,
        webapp: 'Web App' as const
      };

      const branchName = branch ? categoryMap[branch] : 'Web App';
      const projectName = answers.projectName || `${accountInfo.company || accountInfo.name}'s ${branchName}`;

      const bracket = getPricingBracket(branch || 'webapp');
      let budgetNumber = bracket.minAmount;
      if (answers.budgetRange) {
        if (answers.budgetRange.includes('+')) {
          budgetNumber = Math.round(bracket.maxAmount * 1.25);
        } else if (answers.budgetRange.includes('–') || answers.budgetRange.includes('-')) {
          budgetNumber = Math.round((bracket.minAmount + bracket.maxAmount) / 2);
        }
      }

      const newProject: PortalProject = {
        id: `proj-${Date.now().toString().slice(-4)}`,
        name: projectName,
        clientName: accountInfo.name,
        clientEmail: accountInfo.email,
        clientCompany: accountInfo.company || 'Private Client',
        category: branchName,
        currentStage: 'discovery',
        stageProgress: 12,
        statusSummary: `Discovery phase initiated: SOW blueprint generated from your ${branchName.toLowerCase()} specifications. Studio team reviewing architectural requirements.`,
        nextMilestone: 'Founder Discovery Call & Architecture Proposal',
        nextMilestoneDueDate: 'Within 24 Hours',
        stagingUrl: undefined,
        payment: {
          totalBudget: budgetNumber,
          percentReceived: 0,
          amountPaid: 0,
          nextDueAmount: Math.round(budgetNumber * 0.5),
          nextDueCondition: 'Standard 50% advance milestone deposit upon SOW sign-off to initiate sprints',
          milestones: [
            { name: 'Advance Milestone Deposit (50%)', percent: 50, amount: Math.round(budgetNumber * 0.5), status: 'current' },
            { name: 'Design Sign-Off & Architecture (30%)', percent: 30, amount: Math.round(budgetNumber * 0.3), status: 'upcoming' },
            { name: 'Launch & Handover (20%)', percent: 20, amount: Math.round(budgetNumber * 0.2), status: 'upcoming' },
          ]
        },
        pendingItems: [
          {
            id: 'item-new-1',
            title: 'Schedule 30-Minute Founder Alignment Call',
            description: 'Pick a convenient slot for technical scope alignment and contract review.',
            status: 'pending',
            dueDate: 'Tomorrow',
            category: 'Onboarding'
          }
        ],
        files: [
          {
            id: 'f-draft-1',
            name: `${projectName.replace(/\s+/g, '_')}_Intake_Spec.pdf`,
            size: '1.2 MB',
            type: 'PDF',
            category: 'Specification',
            date: 'Just now'
          }
        ],
        feedbackItems: [],
        changeRequests: [],
        messages: [
          {
            id: 'msg-welcome',
            sender: 'bitnexel',
            text: `Welcome to Bitnexel, ${accountInfo.name.split(' ')[0]}! Your intake specifications for ${projectName} have been secured. We are preparing your initial statement of work and milestone schedule.`,
            timestamp: 'Just now'
          }
        ],
        activityLog: [
          {
            id: 'act-new-1',
            title: 'Project Initialized from Intake Wizard',
            description: `Requirements recorded for ${branchName} build. Discovery sprint queue scheduled.`,
            timestamp: 'Just now',
            author: accountInfo.name,
            stage: 'discovery'
          }
        ],
        retainerPlan: {
          tier: 'Growth',
          uptime: 'Configuring',
          lastBackup: 'Pending First Staging Deploy',
          responseGuarantee: '< 2 Hours SLA',
          monthlyHoursRemaining: 10
        }
      };

      // Push the intake into the CRM lead pipeline (best-effort).
      submitLead({
        name: newProject.clientName,
        email: newProject.clientEmail,
        company: newProject.clientCompany,
        service: newProject.category,
        budget: String(newProject.payment.totalBudget),
        message: `Project: ${newProject.name} | Goal: ${answers.mainGoal || 'n/a'} | Features: ${(answers.features || []).join(', ') || 'n/a'} | Timeline: ${answers.timeline || 'n/a'}`,
        source: 'Intake Wizard',
      });

      setIsSubmitting(false);
      onCompleteOnboarding(newProject);
    }, 700);
  };

  // Step 0: The Fork
  if (!branch) {
    return (
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center max-w-5xl mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold uppercase tracking-wider text-[#00D4FF] mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Fast 3-Minute Intake
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-foreground tracking-tight">
            What are you looking to build?
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Select your discipline to load tailored architectural questions.
          </p>
        </div>

        {/* 3 Large Glass Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Tile 1: Website */}
          <button
            id="start-fork-website"
            onClick={() => handleSelectBranch('website')}
            className="p-8 rounded-3xl glass-panel-interactive border border-border text-left flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <Globe className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="text-2xl font-display font-bold text-foreground group-hover:text-[#00D4FF] transition-colors">Website</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "A site to inform, market, and generate leads."
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-[#00D4FF]">
              <span>Configure Website Branch</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Tile 2: Software */}
          <button
            id="start-fork-software"
            onClick={() => handleSelectBranch('software')}
            className="p-8 rounded-3xl glass-panel-interactive border border-border text-left flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <Cpu className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="text-2xl font-display font-bold text-foreground group-hover:text-[#00D4FF] transition-colors">Software</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "A custom tool or system to run part of your business."
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-[#00D4FF]">
              <span>Configure Software Branch</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Tile 3: Web App */}
          <button
            id="start-fork-webapp"
            onClick={() => handleSelectBranch('webapp')}
            className="p-8 rounded-3xl glass-panel-interactive border border-border text-left flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-[#3DDC97]"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <Layers className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="text-2xl font-display font-bold text-foreground group-hover:text-[#3DDC97] transition-colors">Web App</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "An interactive product your users log into and use."
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-[#3DDC97]">
              <span>Configure Web App Branch</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Subtle 4th Option: Not sure — help me decide */}
        <div className="mt-8 text-center">
          <button
            id="start-help-me-decide-btn"
            onClick={() => {
              setShowDecideHelper(true);
              setDecideStep(1);
            }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors py-2 px-4 rounded-xl hover:bg-surface"
          >
            <HelpCircle className="w-4 h-4 text-[#00D4FF]" />
            <span>Not sure — help me decide in 3 questions</span>
          </button>
        </div>

        {/* Decide Helper Modal */}
        {showDecideHelper && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="max-w-lg w-full p-8 rounded-3xl glass-panel bg-muted border border-border shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2 text-[#00D4FF] text-xs uppercase font-semibold tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Interactive Scope Triage</span>
                </div>
                <span className="text-xs text-muted-foreground">Question {decideStep} of 3</span>
              </div>

              {decideStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-display font-bold text-foreground">
                    Do your users need to create accounts and log in?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This determines whether we need authentication tables, token sessions, and role permissions.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => {
                        setDecideAnswers(prev => ({ ...prev, hasAccounts: true }));
                        setDecideStep(2);
                      }}
                      className="p-4 rounded-xl glass-panel-interactive border border-border text-center font-semibold text-foreground hover:border-[#00D4FF]"
                    >
                      Yes, accounts required
                    </button>
                    <button
                      onClick={() => {
                        setDecideAnswers(prev => ({ ...prev, hasAccounts: false }));
                        setDecideStep(2);
                      }}
                      className="p-4 rounded-xl glass-panel-interactive border border-border text-center font-semibold text-foreground hover:border-[#00D4FF]"
                    >
                      No accounts needed
                    </button>
                  </div>
                </div>
              )}

              {decideStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-display font-bold text-foreground">
                    Is this mainly informational, or does it run operational business logic?
                  </h3>
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        setDecideAnswers(prev => ({ ...prev, primaryPurpose: 'marketing' }));
                        setDecideStep(3);
                      }}
                      className="w-full p-4 rounded-xl glass-panel-interactive border border-border text-left"
                    >
                      <div className="font-semibold text-foreground">Mainly Informational / Marketing</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Brand showcase, lead capture, case studies, company presence</div>
                    </button>
                    <button
                      onClick={() => {
                        setDecideAnswers(prev => ({ ...prev, primaryPurpose: 'workflow' }));
                        setDecideStep(3);
                      }}
                      className="w-full p-4 rounded-xl glass-panel-interactive border border-border text-left"
                    >
                      <div className="font-semibold text-foreground">Operational / Internal Workflow</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Automating spreadsheets, routing data, syncing ERP/CRMs</div>
                    </button>
                    <button
                      onClick={() => {
                        setDecideAnswers(prev => ({ ...prev, primaryPurpose: 'product' }));
                        setDecideStep(3);
                      }}
                      className="w-full p-4 rounded-xl glass-panel-interactive border border-border text-left"
                    >
                      <div className="font-semibold text-foreground">External Digital Product / SaaS</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Customers pay to use software features, dashboards, interactive tools</div>
                    </button>
                  </div>
                </div>
              )}

              {decideStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-display font-bold text-foreground">
                    Do you need payments, subscriptions, or complex database queries?
                  </h3>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => {
                        if (decideAnswers.hasAccounts || decideAnswers.primaryPurpose === 'product') {
                          handleDecideHelperComplete('product');
                        } else if (decideAnswers.primaryPurpose === 'workflow') {
                          handleDecideHelperComplete('workflow');
                        } else {
                          handleDecideHelperComplete('marketing');
                        }
                      }}
                      className="p-4 rounded-xl glass-panel-interactive border border-border text-center font-semibold text-foreground hover:border-[#00D4FF]"
                    >
                      Yes, payments / database
                    </button>
                    <button
                      onClick={() => {
                        if (decideAnswers.primaryPurpose === 'workflow') {
                          handleDecideHelperComplete('workflow');
                        } else if (decideAnswers.hasAccounts) {
                          handleDecideHelperComplete('product');
                        } else {
                          handleDecideHelperComplete('marketing');
                        }
                      }}
                      className="p-4 rounded-xl glass-panel-interactive border border-border text-center font-semibold text-foreground hover:border-[#00D4FF]"
                    >
                      No, not right now
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowDecideHelper(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Question renderers for each branch
  const renderQuestion = () => {
    // WEBSITE BRANCH
    if (branch === 'website') {
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  What is your business or project name?
                </label>
                <p className="text-sm text-muted-foreground">
                  Used to generate your private workspace and staging URL.
                </p>
              </div>
              <input
                id="website-input-project-name"
                type="text"
                autoFocus
                value={answers.projectName || ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, projectName: e.target.value }))}
                placeholder="e.g. Lumina Technologies or Velora Atelier"
                className="w-full px-5 py-4 rounded-2xl bg-surface border border-border text-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && answers.projectName) {
                    setCurrentStep(2);
                  }
                }}
              />
              <button
                disabled={!answers.projectName}
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl bg-[#00D4FF] text-[#07080C] font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#38e1ff] transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  What is the primary goal of the website?
                </label>
                <p className="text-sm text-muted-foreground">
                  Select one. This drives the information architecture and hero conversion funnel.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Generate High-Intent Leads', value: 'leads', desc: 'Custom quote flows, inquiry forms, and WhatsApp conversion' },
                  { label: 'Showcase Brand & Portfolio', value: 'portfolio', desc: 'Editorial visuals, interactive case studies, tactile luxury feel' },
                  { label: 'Sell Products / E-Commerce', value: 'ecommerce', desc: 'Product listings, cart, checkout, inventory sync' },
                  { label: 'Explain Complex B2B Services', value: 'b2b_service', desc: 'Clarify tech offerings, whitepapers, book sales demos' },
                  { label: 'Investor & Talent Magnet', value: 'investor_talent', desc: 'Establish high institutional credibility for fundraising' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleAutoAdvance('mainGoal', item.label)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      answers.mainGoal === item.label
                        ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:bg-surface'
                    }`}
                  >
                    <div className="font-semibold text-base text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          );

        case 3:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Roughly how many pages do you envision?
                </label>
                <p className="text-sm text-muted-foreground">
                  Helps estimate timeline and sitemap depth.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: '1–5 Pages', value: '1-5', desc: 'Focused high-impact flagship (Home, About, Services, Contact)' },
                  { label: '6–10 Pages', value: '6-10', desc: 'Comprehensive studio or corporate site with dedicated service subpages' },
                  { label: '10+ Pages / Headless CMS', value: '10+', desc: 'Large publication, catalog, resource center, or dynamic blog' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleAutoAdvance('pageCount', item.label)}
                    className={`p-6 rounded-2xl border text-left transition-all ${
                      answers.pageCount === item.label
                        ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:bg-surface'
                    }`}
                  >
                    <div className="text-xl font-bold text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-2">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          );

        case 4:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Do you have existing visual branding?
                </label>
                <p className="text-sm text-muted-foreground">
                  Logos, color palette, typography guidelines, or starting from scratch?
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Yes, complete brand guidelines ready', value: 'ready', desc: 'Vector logo, established fonts, hex color tokens' },
                  { label: 'Have a logo only, need colors & styling', value: 'logo_only', desc: 'We expand your logo into a modern design system' },
                  { label: 'Starting completely from scratch', value: 'scratch', desc: 'Bitnexel crafts the typographic identity and visual direction' },
                  { label: 'Looking for a full visual refresh', value: 'refresh', desc: 'Re-imagining existing brand for modern premium polish' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleAutoAdvance('hasBranding', item.label)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      answers.hasBranding === item.label
                        ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:bg-surface'
                    }`}
                  >
                    <div className="font-semibold text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          );

        case 5:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Do you need any specialized integrations?
                </label>
                <p className="text-sm text-muted-foreground">
                  Select all that apply. (Multi-select)
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'whatsapp', label: 'WhatsApp / Instant Chat Trigger', tooltip: 'Direct floating click-to-chat configured with pre-filled lead messages' },
                  { id: 'booking', label: 'Calendar / Meeting Booking Embed', tooltip: 'Integrated scheduling widget (Cal.com/Calendly) with automated reminders' },
                  { id: 'blog', label: 'SEO Content Engine / Blog', tooltip: 'Headless markdown or CMS powered for rapid organic search acquisition' },
                  { id: 'ecommerce', label: 'Payment / E-Commerce Checkout', tooltip: 'Stripe or custom gateway for digital/physical purchases' },
                  { id: 'multilang', label: 'Multi-Language Localization', tooltip: 'Auto-detection and switchable language routes (e.g. EN / IT / ES)' },
                  { id: 'crm_sync', label: 'CRM & Newsletter Automation', tooltip: 'Direct API webhook to HubSpot, Mailchimp, or custom databases' }
                ].map((feat) => {
                  const isChecked = (answers.features || []).includes(feat.label);
                  return (
                    <button
                      key={feat.id}
                      type="button"
                      onClick={() => toggleMultiSelect('features', feat.label)}
                      className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all ${
                        isChecked 
                          ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground' 
                          : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-sm text-foreground">{feat.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{feat.tooltip}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        isChecked ? 'bg-[#00D4FF] border-[#00D4FF] text-black' : 'border-border'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentStep(6)}
                  className="px-6 py-3 rounded-xl bg-[#00D4FF] text-[#07080C] font-semibold text-sm hover:bg-[#38e1ff] transition-all flex items-center gap-2"
                >
                  <span>Continue ({answers.features?.length || 0} selected)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );

        case 6:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Who will provide content (copywriting & photography)?
                </label>
                <p className="text-sm text-muted-foreground">
                  Content creation impacts turnaround time and project velocity.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'We have all copy & images ready', value: 'client_ready', desc: 'Text is written and high-res photography is prepared' },
                  { label: 'Bitnexel Studio writes & curates', value: 'studio_curates', desc: 'Full studio copywriting, editorial direction, and visual assets' },
                  { label: 'Collaborative Mix', value: 'mix', desc: 'We provide rough drafts and Bitnexel polishes tone and craft' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleAutoAdvance('contentProvider', item.label)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      answers.contentProvider === item.label
                        ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:bg-surface'
                    }`}
                  >
                    <div className="font-semibold text-base text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-2">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          );

        case 7:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Target timeline & estimated budget range
                </label>
                <p className="text-sm text-muted-foreground">
                  Soft selection to align sprint resource allocation. (Non-binding)
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#00D4FF] mb-2">
                    Ideal Launch Timeline
                  </div>
                  <div className="space-y-2">
                    {['Urgent (3–4 weeks)', 'Standard (4–6 weeks)', 'Flexible (6–8+ weeks)'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, timeline: t }))}
                        className={`w-full p-3 rounded-xl border text-left text-sm font-medium transition-colors ${
                          answers.timeline === t
                            ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground'
                            : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#3DDC97] mb-2">
                    Investment Range
                  </div>
                  <div className="space-y-2">
                    {(WIZARD_BUDGET_OPTIONS['website'][currency] || WIZARD_BUDGET_OPTIONS['website']['INR']).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, budgetRange: b }))}
                        className={`w-full p-3 rounded-xl border text-left text-sm font-medium transition-colors ${
                          answers.budgetRange === b
                            ? 'bg-[#3DDC97]/20 border-[#3DDC97] text-foreground'
                            : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={!answers.timeline || !answers.budgetRange}
                  onClick={() => setShowReviewScreen(true)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00D4FF] text-[#07080C] font-semibold text-sm hover:bg-[#38e1ff] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <span>Review Project Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );

        default:
          return null;
      }
    }

    // SOFTWARE BRANCH
    if (branch === 'software') {
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  What business process are you trying to replace or improve?
                </label>
                <p className="text-sm text-muted-foreground">
                  Describe the friction, bottlenecks, or manual spreadsheets your team currently struggles with.
                </p>
              </div>
              <textarea
                rows={4}
                autoFocus
                value={answers.processToImprove || ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, processToImprove: e.target.value }))}
                placeholder="e.g., We manage fleet dispatch using 3 shared Google Sheets and endless WhatsApp groups. We lose hours manually copying load numbers and calculating fuel surcharges..."
                className="w-full p-4 rounded-2xl bg-surface border border-border text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all"
              />
              <button
                disabled={!answers.processToImprove}
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl bg-[#00D4FF] text-[#07080C] font-semibold text-sm disabled:opacity-40 hover:bg-[#38e1ff] transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Who will use this internally?
                </label>
                <p className="text-sm text-muted-foreground">
                  Target roles and approximate user volume.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Small Team (1–10 users)', value: '1-10', desc: 'Founders, operations leads, or small departmental squad' },
                  { label: 'Medium Fleet (10–50 users)', value: '10-50', desc: 'Dispatchers, warehouse supervisors, and account managers' },
                  { label: 'Enterprise (50+ users)', value: '50+', desc: 'Multi-location staff, field agents, with role-based permissions' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleAutoAdvance('internalUsers', item.label)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      answers.internalUsers === item.label
                        ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:bg-surface'
                    }`}
                  >
                    <div className="font-semibold text-base text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-2">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          );

        case 3:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Does it need to connect to existing tools?
                </label>
                <p className="text-sm text-muted-foreground">
                  Select all services requiring API or webhook synchronization.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'CRM (HubSpot, Salesforce, Pipedrive)' },
                  { label: 'Accounting (QuickBooks, Xero, Stripe Invoicing)' },
                  { label: 'Messaging (WhatsApp Business, Slack, Twilio SMS)' },
                  { label: 'Databases & Spreadsheets (Postgres, Google Sheets, Airtable)' },
                  { label: 'Email & Calendars (Google Workspace, Office 365)' },
                  { label: 'Custom Internal Legacy API / EDI' }
                ].map((tool) => {
                  const isChecked = (answers.integrations || []).includes(tool.label);
                  return (
                    <button
                      key={tool.label}
                      type="button"
                      onClick={() => toggleMultiSelect('integrations', tool.label)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isChecked 
                          ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground' 
                          : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="text-sm font-medium text-foreground">{tool.label}</span>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-[#00D4FF] border-[#00D4FF] text-black' : 'border-border'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-xl bg-[#00D4FF] text-[#07080C] font-semibold text-sm hover:bg-[#38e1ff] transition-all flex items-center gap-2"
                >
                  <span>Continue ({answers.integrations?.length || 0} selected)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );

        case 4:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Does it handle sensitive, compliance-regulated, or private data?
                </label>
                <p className="text-sm text-muted-foreground">
                  Flags encryption, SOC2 architectural requirements, and auditing constraints.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleAutoAdvance('dataPrivacyStrict', 'Yes — High Security & Compliance Required')}
                  className={`p-6 rounded-2xl border text-left transition-all ${
                    answers.dataPrivacyStrict?.startsWith('Yes')
                      ? 'bg-[#3DDC97]/20 border-[#3DDC97] text-foreground'
                      : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:bg-surface'
                  }`}
                >
                  <div className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#3DDC97]" />
                    <span>Yes, Strict Privacy</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Handles customer PII, financial ledgers, HIPAA medical data, or proprietary trade secrets.
                  </p>
                </button>

                <button
                  onClick={() => handleAutoAdvance('dataPrivacyStrict', 'No — Standard Industry Security is Sufficient')}
                  className={`p-6 rounded-2xl border text-left transition-all ${
                    answers.dataPrivacyStrict?.startsWith('No')
                      ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-foreground'
                      : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:bg-surface'
                  }`}
                >
                  <div className="font-bold text-lg text-foreground">
                    Standard Web Security
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Standard internal company data, operational schedules, and inventory tallies.
                  </p>
                </button>
              </div>
            </div>
          );

        case 5:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Preferred access medium
                </label>
                <p className="text-sm text-muted-foreground">
                  Where will your internal operators interact with this software?
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Web Browser Dashboard', value: 'web', desc: 'Accessible securely from any modern desktop or tablet browser' },
                  { label: 'Desktop App (Mac & Windows)', value: 'desktop', desc: 'Native executable with hardware shortcuts and offline cache' },
                  { label: 'Unified Hybrid (Web + Desktop)', value: 'hybrid', desc: 'Seamless synchronization across cloud web and desktop runners' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleAutoAdvance('accessType', item.label)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      answers.accessType === item.label
                        ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="font-semibold text-base text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-2">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          );

        case 6:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Timeline & Investment Range
                </label>
                <p className="text-sm text-muted-foreground">
                  Helps us assemble the dedicated engineering team sprint.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#00D4FF] mb-2">
                    Target Deployment Window
                  </div>
                  <div className="space-y-2">
                    {['Fast Sprint (6–8 weeks)', 'Standard (8–12 weeks)', 'Phased Rollout (3–6 months)'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, timeline: t }))}
                        className={`w-full p-3 rounded-xl border text-left text-sm font-medium transition-colors ${
                          answers.timeline === t
                            ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground'
                            : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#3DDC97] mb-2">
                    Budget Allocation
                  </div>
                  <div className="space-y-2">
                    {(WIZARD_BUDGET_OPTIONS['software'][currency] || WIZARD_BUDGET_OPTIONS['software']['INR']).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, budgetRange: b }))}
                        className={`w-full p-3 rounded-xl border text-left text-sm font-medium transition-colors ${
                          answers.budgetRange === b
                            ? 'bg-[#3DDC97]/20 border-[#3DDC97] text-foreground'
                            : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={!answers.timeline || !answers.budgetRange}
                  onClick={() => setShowReviewScreen(true)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00D4FF] text-[#07080C] font-semibold text-sm hover:bg-[#38e1ff] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <span>Review Software Specification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );

        default:
          return null;
      }
    }

    // WEB APP BRANCH
    if (branch === 'webapp') {
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Will users create accounts and log in?
                </label>
                <p className="text-sm text-muted-foreground">
                  Defines identity architecture, passwordless/magic links, and multi-tenant isolation.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Yes — Client & User Portals Required', desc: 'Secure email/pass, Google OAuth, magic link, and permission roles' },
                  { label: 'No — Public Interactive Web Application', desc: 'Calculator, public configurator, or anonymous utility tool' }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleAutoAdvance('needAccounts', item.label)}
                    className={`p-6 rounded-2xl border text-left transition-all ${
                      answers.needAccounts === item.label
                        ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="font-bold text-lg text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-2">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  What is the single core action a user takes in the app?
                </label>
                <p className="text-sm text-muted-foreground">
                  "The one thing they must be able to do flawlessly."
                </p>
              </div>
              <textarea
                rows={3}
                autoFocus
                value={answers.coreUserAction || ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, coreUserAction: e.target.value }))}
                placeholder="e.g. Investors log in to view real-time capital deployment graphs, sign tax documents, and authorize ACH wire transfers."
                className="w-full p-4 rounded-2xl bg-surface border border-border text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all"
              />
              <button
                disabled={!answers.coreUserAction}
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-xl bg-[#00D4FF] text-[#07080C] font-semibold text-sm disabled:opacity-40 hover:bg-[#38e1ff] transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );

        case 3:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Do you need payment processing?
                </label>
                <p className="text-sm text-muted-foreground">
                  Configures Stripe, Lemon Squeezy, or custom banking integration.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Yes: Recurring SaaS Subscriptions', desc: 'Monthly/annual plans, trial periods, tiered billing, invoice generation' },
                  { label: 'Yes: One-Time Invoicing & Deposits', desc: 'Fixed milestone checkout, escrow deposits, or digital product sales' },
                  { label: 'Yes: Two-Sided Marketplace Splits', desc: 'Split payments, escrow hold, vendor payouts via Stripe Connect' },
                  { label: 'No: Internal or Non-Monetized', desc: 'Internal enterprise tooling or free utility platform' }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleAutoAdvance('needPayments', item.label)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      answers.needPayments === item.label
                        ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="font-semibold text-base text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          );

        case 4:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Target client platforms
                </label>
                <p className="text-sm text-muted-foreground">
                  Select all required device targets.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Web (Responsive Desktop & Mobile)', desc: 'Optimized for Chrome, Safari, Edge across all screen sizes' },
                  { label: 'PWA / Mobile Home Screen App', desc: 'Installable on iOS & Android with offline support & push notifications' },
                  { label: 'Native iOS / Android App Store', desc: 'Capacitor or React Native cross-compiled store builds' }
                ].map((plat) => {
                  const isChecked = (answers.targetPlatforms || []).includes(plat.label);
                  return (
                    <button
                      key={plat.label}
                      type="button"
                      onClick={() => toggleMultiSelect('targetPlatforms', plat.label)}
                      className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isChecked 
                          ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground' 
                          : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-foreground mb-1">{plat.label}</div>
                        <div className="text-xs text-muted-foreground">{plat.desc}</div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                        <span className="text-xs text-[#00D4FF]">Toggle Platform</span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-[#00D4FF] border-[#00D4FF] text-black' : 'border-border'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-3 rounded-xl bg-[#00D4FF] text-[#07080C] font-semibold text-sm hover:bg-[#38e1ff] transition-all flex items-center gap-2"
                >
                  <span>Continue ({answers.targetPlatforms?.length || 0} selected)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );

        case 5:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Do you have wireframes or Figma designs ready?
                </label>
                <p className="text-sm text-muted-foreground">
                  Determines whether our engagement begins in UI/UX systems design or direct full-stack coding.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Yes, full Figma prototypes ready', desc: 'Ready for full-stack engineering and API architecture' },
                  { label: 'Rough wireframes / sketches only', desc: 'Bitnexel will elevate into production Figma design tokens' },
                  { label: 'No designs, start from product spec', desc: 'We handle entire user research, UX architecture, and UI polish' }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleAutoAdvance('existingDesigns', item.label)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      answers.existingDesigns === item.label
                        ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="font-semibold text-base text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-2">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          );

        case 6:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Timeline & Investment Scope
                </label>
                <p className="text-sm text-muted-foreground">
                  Soft range for multi-tenant web application architecture.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#00D4FF] mb-2">
                    Target MVP Launch
                  </div>
                  <div className="space-y-2">
                    {['High Velocity MVP (6–8 weeks)', 'Standard Production (8–12 weeks)', 'Multi-Phase Cloud Scale (3–5 months)'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, timeline: t }))}
                        className={`w-full p-3 rounded-xl border text-left text-sm font-medium transition-colors ${
                          answers.timeline === t
                            ? 'bg-[#6C63FF]/20 border-[#00D4FF] text-foreground'
                            : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#3DDC97] mb-2">
                    Budget Range
                  </div>
                  <div className="space-y-2">
                    {(WIZARD_BUDGET_OPTIONS['webapp'][currency] || WIZARD_BUDGET_OPTIONS['webapp']['INR']).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, budgetRange: b }))}
                        className={`w-full p-3 rounded-xl border text-left text-sm font-medium transition-colors ${
                          answers.budgetRange === b
                            ? 'bg-[#3DDC97]/20 border-[#3DDC97] text-foreground'
                            : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={!answers.timeline || !answers.budgetRange}
                  onClick={() => setShowReviewScreen(true)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00D4FF] text-[#07080C] font-semibold text-sm hover:bg-[#38e1ff] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <span>Review Web App Blueprint</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );

        default:
          return null;
      }
    }

    return null;
  };

  return (
    <div className="min-h-[85vh] py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Wizard Header Bar */}
      <div className="mb-8 p-4 rounded-2xl glass-panel border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (showReviewScreen) {
                setShowReviewScreen(false);
              } else if (currentStep > 1) {
                setCurrentStep(prev => prev - 1);
              } else {
                setBranch(null);
              }
            }}
            className="p-2 rounded-xl bg-surface hover:bg-surface border border-border text-muted-foreground hover:text-foreground transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#00D4FF]">
              {branch.toUpperCase()} INTAKE
            </span>
            <div className="text-sm font-bold text-foreground">
              {showReviewScreen ? 'Final Scope Verification' : `Step ${currentStep} of ${totalSteps}`}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 w-full sm:w-64">
          <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] h-2 rounded-full transition-all duration-300"
              style={{
                width: showReviewScreen ? '100%' : `${(currentStep / totalSteps) * 100}%`
              }}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground shrink-0">
            {showReviewScreen ? '100%' : `${Math.round((currentStep / totalSteps) * 100)}%`}
          </span>
        </div>
      </div>

      {/* Main Grid: Question View + Live Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form / Review */}
        <div className="lg:col-span-8 p-6 sm:p-10 rounded-3xl glass-panel border border-border relative overflow-hidden">
          {!showReviewScreen ? (
            <div>
              {renderQuestion()}

              {/* Navigation controls if multi-choice or input */}
              <div className="mt-12 pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div>
                  Auto-advances on selection · Answers saved continuously
                </div>
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="hover:text-foreground transition-colors"
                  >
                    ← Previous Step
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Final Summary & Lightweight Account Creation */
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-[#3DDC97]">
                  Intake Complete
                </span>
                <h2 className="text-3xl font-display font-bold text-foreground mt-1">
                  Ready to deploy your Bitnexel Client Portal
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Review your project specifications below. Create your lightweight credentials to access your private timeline, staging link, and live milestones.
                </p>
              </div>

              {/* Editable Scope Summary Card */}
              <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm font-bold text-[#00D4FF]">Selected Discipline</span>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-[#6C63FF]/20 text-foreground">
                    {branch.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {answers.projectName && (
                    <div>
                      <span className="text-muted-foreground">Project / Brand Name:</span>
                      <div className="font-semibold text-foreground mt-0.5">{answers.projectName}</div>
                    </div>
                  )}
                  {answers.mainGoal && (
                    <div>
                      <span className="text-muted-foreground">Primary Objective:</span>
                      <div className="font-semibold text-foreground mt-0.5">{answers.mainGoal}</div>
                    </div>
                  )}
                  {answers.processToImprove && (
                    <div className="sm:col-span-2">
                      <span className="text-muted-foreground">Friction Process:</span>
                      <div className="font-semibold text-foreground mt-0.5 italic line-clamp-2">"{answers.processToImprove}"</div>
                    </div>
                  )}
                  {answers.coreUserAction && (
                    <div className="sm:col-span-2">
                      <span className="text-muted-foreground">Core Action:</span>
                      <div className="font-semibold text-foreground mt-0.5 italic line-clamp-2">"{answers.coreUserAction}"</div>
                    </div>
                  )}
                  {answers.timeline && (
                    <div>
                      <span className="text-muted-foreground">Target Timeline:</span>
                      <div className="font-semibold text-[#00D4FF] mt-0.5">{answers.timeline}</div>
                    </div>
                  )}
                  {answers.budgetRange && (
                    <div>
                      <span className="text-muted-foreground">Investment Range:</span>
                      <div className="font-semibold text-[#3DDC97] mt-0.5">{answers.budgetRange}</div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowReviewScreen(false)}
                  className="text-xs text-[#00D4FF] hover:underline"
                >
                  Edit answers
                </button>
              </div>

              {/* Account Creation Form */}
              <form onSubmit={handleFinalSubmit} className="space-y-4 pt-2">
                <div className="text-sm font-semibold text-foreground">
                  Create Your Client Portal Access
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      id="account-input-name"
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={accountInfo.name}
                      onChange={(e) => setAccountInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Work Email *
                    </label>
                    <input
                      id="account-input-email"
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={accountInfo.email}
                      onChange={(e) => setAccountInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Company / Organization Name
                    </label>
                    <input
                      id="account-input-company"
                      type="text"
                      placeholder="e.g. Morgan Capital"
                      value={accountInfo.company}
                      onChange={(e) => setAccountInfo(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Portal Password (or magic link login)
                    </label>
                    <input
                      id="account-input-password"
                      type="password"
                      placeholder="••••••••"
                      value={accountInfo.password}
                      onChange={(e) => setAccountInfo(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#3DDC97]" />
                    <span>Instant dedicated portal setup · Zero spam</span>
                  </div>

                  <button
                    id="submit-project-intake-btn"
                    type="submit"
                    disabled={isSubmitting || !accountInfo.name || !accountInfo.email}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FF6B4A] hover:bg-[#ff5a34] text-white font-semibold text-sm shadow-xl shadow-[#FF6B4A]/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40"
                  >
                    {isSubmitting ? (
                      <span>Initializing Portal...</span>
                    ) : (
                      <>
                        <span>Submit Project & Open Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Live Glass Summary Panel (Desktop) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="p-6 rounded-3xl glass-panel border border-border space-y-5 bg-surface">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00D4FF] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Project Blueprint</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-surface text-foreground">
                {branch.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-surface border border-border">
                <div className="text-muted-foreground text-[11px]">Selected Category</div>
                <div className="text-sm font-semibold text-foreground mt-0.5">
                  {branch === 'website' ? 'Flagship Marketing Website' :
                   branch === 'software' ? 'Custom Operational Software' : 'Authenticated Cloud Web App'}
                </div>
              </div>

              {answers.projectName && (
                <div className="p-3 rounded-xl bg-surface border border-border">
                  <div className="text-muted-foreground text-[11px]">Identified Brand</div>
                  <div className="text-sm font-semibold text-foreground mt-0.5">{answers.projectName}</div>
                </div>
              )}

              {answers.timeline && (
                <div className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between">
                  <div>
                    <div className="text-muted-foreground text-[11px]">Sprint Speed</div>
                    <div className="text-xs font-semibold text-[#00D4FF] mt-0.5">{answers.timeline}</div>
                  </div>
                  <Calendar className="w-4 h-4 text-[#00D4FF]" />
                </div>
              )}

              {answers.budgetRange && (
                <div className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between">
                  <div>
                    <div className="text-muted-foreground text-[11px]">Estimated Investment</div>
                    <div className="text-xs font-semibold text-[#3DDC97] mt-0.5">{answers.budgetRange}</div>
                  </div>
                  <DollarSign className="w-4 h-4 text-[#3DDC97]" />
                </div>
              )}

              {/* Standard Guarantees */}
              <div className="pt-2 border-t border-border space-y-1.5 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5 text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC97]" />
                  <span>Dedicated Private Client Portal</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC97]" />
                  <span>50/30/20 Fixed Milestone Billing</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC97]" />
                  <span>30-Day Defect Warranty Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
