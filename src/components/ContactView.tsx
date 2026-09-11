import React, { useState, useEffect } from 'react';
import { RouteType } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { CONTACT_BUDGET_OPTIONS } from '../utils/currency';
import { 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  Mail,
  Lock,
  SearchCheck,
  UserCheck,
  FileText,
  KeyRound
} from 'lucide-react';

interface ContactViewProps {
  onNavigate: (route: RouteType) => void;
}

// Shared input styling — keeps the dense form consistent and easy to theme.
const inputClass =
  'w-full px-3.5 py-3 rounded-xl bg-muted border border-border text-sm text-foreground ' +
  'placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 ' +
  'focus:ring-indigo-500 transition-colors';

// Consultation benefits — what every enterprise inquiry includes.
const CONSULTATION_BENEFITS = [
  { Icon: SearchCheck, title: 'Free feasibility assessment', detail: 'We evaluate your architecture and scope before any commitment.' },
  { Icon: UserCheck, title: '30 minutes with a senior architect', detail: 'No account managers — you talk to the engineers who build.' },
  { Icon: FileText, title: 'Fixed-scope proposal in 48–72h', detail: 'Milestone-based quote with a clear technical approach.' },
  { Icon: ShieldCheck, title: 'Mutual NDA in under 4 hours', detail: 'Zero NDA friction — we countersign immediately.' },
  { Icon: KeyRound, title: 'Full IP confidentiality', detail: 'Your code and ideas stay yours. 100% repository transfer.' },
];

const CONSULTATION_STATS = [
  { value: '1 day', label: 'Reply time' },
  { value: '100%', label: 'Senior engineers' },
  { value: '48–72h', label: 'Proposals' },
];

const COMPANY_SIZES = ['Startup (1–10)', 'Scale-up (11–50)', 'Mid-market (51–500)', 'Enterprise (500+)'];
const TIMELINES = ['ASAP', 'Within 3 months', '3–6 months', '6+ months', 'Exploratory'];
const DISCIPLINES = [
  'Digital Flagship Platform',
  'Custom Software & Enterprise ERP',
  'Cloud Web Application & SaaS',
  'Monthly Maintenance & Retainer',
  'Architectural Review & Audit'
];
const HEAR_ABOUTS = [
  'Referral / Peer Recommendation',
  'Tech Community / X',
  'GitHub / Open Source',
  'Industry Search',
  'Past Client Work'
];

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const { currency } = useCurrency();
  const [submitted, setSubmitted] = useState(false);
  const budgetOptions = CONTACT_BUDGET_OPTIONS[currency] || CONTACT_BUDGET_OPTIONS.USD;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    company: '',
    phone: '',
    companySize: COMPANY_SIZES[0],
    service: DISCIPLINES[0],
    budget: budgetOptions[0],
    timeline: TIMELINES[1],
    hearAbout: HEAR_ABOUTS[0],
    message: '',
  });

  // Update default budget selection if currency changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      budget: budgetOptions[0]
    }));
  }, [currency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div id="contact-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-accent-text text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-accent-text" />
          <span>Direct Studio Inquiry</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-foreground tracking-tight">
          Let’s discuss your technical roadmap.
        </h1>
        <p className="text-base sm:text-lg text-foreground-soft">
          You will communicate directly with senior software architects — never a non-technical sales rep. We review briefs and reply within 1 business day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Consultation Benefits & Direct Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl studio-panel space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              <span className="text-xs font-mono font-medium text-emerald-text">
                Active Capacity: Q2 / Q3 Sprint Available
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold text-foreground">
                Direct Engineering Channels
              </h3>
              <p className="text-xs sm:text-sm text-foreground-soft leading-relaxed">
                Prefer immediate messaging or have a quick architectural question? Connect directly with our team.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* WhatsApp direct */}
              <a
                href="https://wa.me/15550192834?text=Hi%20Bitnexel,%20I'd%20like%20to%20discuss%20a%20new%20project"
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl bg-surface hover:bg-surface border border-border flex items-center justify-between text-xs transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-text">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-emerald-text transition-colors">
                      Studio WhatsApp
                    </div>
                    <div className="text-[11px] text-muted-foreground">Typical reply in under 2 hours</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>

              {/* Direct Email */}
              <a
                href="mailto:theblacklightstudio4@gmail.com"
                className="p-4 rounded-xl bg-surface hover:bg-surface border border-border flex items-center justify-between text-xs transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-text">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-sky-text transition-colors">
                      theblacklightstudio4@gmail.com
                    </div>
                    <div className="text-[11px] text-muted-foreground">Direct to lead architect inbox</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>

              {/* Discovery Call */}
              <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-accent-text">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      15-Min Technical Fit Call
                    </div>
                    <div className="text-[11px] text-muted-foreground">Mon–Fri via Google Meet</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-text bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  Via Form Below
                </span>
              </div>
            </div>
          </div>

          {/* Consultation Benefits */}
          <div className="p-6 rounded-2xl studio-panel space-y-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-sky-text font-semibold">
                Consultation Benefits
              </span>
              <h3 className="text-lg font-display font-bold text-foreground mt-1">
                What every inquiry includes
              </h3>
            </div>
            <ul className="space-y-3.5">
              {CONSULTATION_BENEFITS.map(({ Icon, title, detail }) => (
                <li key={title} className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-accent-text shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">{title}</div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-3 gap-3">
            {CONSULTATION_STATS.map(({ value, label }) => (
              <div key={label} className="p-4 rounded-2xl studio-panel text-center">
                <div className="text-xl font-display font-bold text-foreground">{value}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Dense Interactive Inquiry Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 rounded-2xl studio-panel space-y-6">
          {submitted ? (
            <div className="py-12 text-center space-y-6 animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-text">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-foreground">
                  Technical Inquiry Received.
                </h3>
                <p className="text-sm text-foreground-soft max-w-md mx-auto">
                  Thank you, <strong className="text-foreground">{formData.name}</strong>. Our lead architect will review your brief and reply to <strong className="text-sky-text">{formData.email}</strong> within 1 business day.
                </p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => onNavigate('portal')}
                  className="btn-primary px-6 py-3 text-xs font-semibold"
                >
                  Preview Client Portal Experience
                </button>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary px-5 py-3 text-xs font-medium"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl font-display font-bold text-foreground">
                  Submit a Project Brief
                </h3>
                <p className="text-xs text-foreground-soft">
                  Prefer a step-by-step interactive calculator? You can also use our{' '}
                  <button type="button" onClick={() => onNavigate('start')} className="text-accent-text hover:underline font-semibold">
                    Project Wizard →
                  </button>
                </p>
              </div>

              {/* Row 1 — name + email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-foreground-soft font-medium mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-foreground-soft font-medium mb-1.5">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Row 2 — role + company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-foreground-soft font-medium mb-1.5">Role / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. CTO, Founder, Head of Product"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-foreground-soft font-medium mb-1.5">Company / Product</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Systems"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Row 3 — phone + company size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-foreground-soft font-medium mb-1.5">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 555 019 2834 (optional)"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-foreground-soft font-medium mb-1.5">Company Size</label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => setFormData(prev => ({ ...prev, companySize: e.target.value }))}
                    className={inputClass}
                  >
                    {COMPANY_SIZES.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4 — discipline + budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-foreground-soft font-medium mb-1.5">Discipline of Interest</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                    className={inputClass}
                  >
                    {DISCIPLINES.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-foreground-soft font-medium mb-1.5">Target Investment Bracket</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    className={inputClass}
                  >
                    {budgetOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5 — timeline + source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-foreground-soft font-medium mb-1.5">Preferred Timeline</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                    className={inputClass}
                  >
                    {TIMELINES.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-foreground-soft font-medium mb-1.5">How Did You Hear About Us?</label>
                  <select
                    value={formData.hearAbout}
                    onChange={(e) => setFormData(prev => ({ ...prev, hearAbout: e.target.value }))}
                    className={inputClass}
                  >
                    {HEAR_ABOUTS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="text-xs">
                <label className="block text-foreground-soft font-medium mb-1.5">Project Scope & Objectives *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Outline what you are building, the problem you solve, any preferred technology stack, and your ideal timeline..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3.5 text-sm font-semibold shadow-lg shadow-white/10"
              >
                <span>Submit Brief to Senior Engineering</span>
                <Send className="w-4 h-4 text-indigo-600" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5 text-emerald-text" />
                <span>Protected by mutual non-disclosure. We never sell or share contact details.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
