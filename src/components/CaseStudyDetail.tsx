'use client';

import React from 'react';
import { CaseStudy, RouteType } from '../types';
import {
  ArrowLeft,
  ChevronRight,
  Check,
  Sparkles,
  ShieldCheck,
  Quote,
} from 'lucide-react';

interface CaseStudyDetailProps {
  caseStudy: CaseStudy;
  onNavigate: (route: RouteType) => void;
  onBack: () => void;
}

/**
 * CaseStudyDetail — the full, scrollable case study page shown when a book
 * card (or work listing) is clicked. Renders the complete architecture story:
 * challenge, solution, outcomes, metrics, stack, and client testimonial.
 */
export const CaseStudyDetail: React.FC<CaseStudyDetailProps> = ({
  caseStudy,
  onNavigate,
  onBack,
}) => {
  const categoryLabel =
    caseStudy.category === 'Website'
      ? 'DIGITAL FLAGSHIP'
      : caseStudy.category === 'Custom Software'
        ? 'CUSTOM SOFTWARE'
        : 'WEB APP & SAAS';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Back navigation */}
      <button
        onClick={onBack}
        className="apple-btn-secondary px-4 py-2 text-xs font-normal"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>All Case Studies</span>
      </button>

      {/* Header */}
      <div className="space-y-4 border-b border-border pb-8">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 text-[11px] font-mono text-[#2997ff] font-medium uppercase">
            {categoryLabel}
          </span>
          <span className="text-xs font-mono text-muted-foreground">{caseStudy.timeline}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-semibold text-foreground tracking-[-0.03em] leading-[1.06]">
          {caseStudy.title}
        </h1>

        <div className="text-sm text-muted-foreground">
          Client: <strong className="text-foreground">{caseStudy.client}</strong>
        </div>

        <p className="text-base sm:text-lg text-foreground-soft leading-relaxed max-w-3xl">
          {caseStudy.fullDescription || caseStudy.shortDescription}
        </p>
      </div>

      {/* Hero image */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-[24px] border border-border bg-muted">
        <img
          src={caseStudy.image}
          alt={caseStudy.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {(caseStudy.metrics || []).map((m, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-surface border border-border"
          >
            <div className="text-[11px] text-muted-foreground">{m.label}</div>
            <div className="text-xl sm:text-2xl font-semibold text-emerald-text mt-1">
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Challenge & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
          <div className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
            The Architectural Challenge
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {caseStudy.challenge}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 space-y-3">
          <div className="text-xs font-mono font-semibold text-[#2997ff] uppercase tracking-wider">
            The Bitnexel Solution
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {caseStudy.solution}
          </p>
        </div>
      </div>

      {/* Outcomes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2997ff]" />
          <h2 className="text-lg font-display font-semibold text-foreground">
            Measured Outcomes
          </h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(caseStudy.outcomes || []).map((outcome, i) => (
            <li
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border text-sm text-foreground-soft leading-relaxed"
            >
              <Check className="w-4 h-4 text-emerald-text mt-0.5 shrink-0" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tech stack */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2997ff]" />
          <h2 className="text-lg font-display font-semibold text-foreground">
            Technology Architecture
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {(caseStudy.techStack || []).map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-surface border border-border text-xs text-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      {caseStudy.testimonial && (
        <figure className="p-6 sm:p-8 rounded-2xl bg-muted border border-border space-y-4">
          <Quote className="w-6 h-6 text-[#2997ff]" />
          <blockquote className="text-base sm:text-lg font-display text-foreground leading-relaxed">
            "{caseStudy.testimonial.quote}"
          </blockquote>
          <figcaption className="text-sm">
            <span className="font-semibold text-foreground">{caseStudy.testimonial.author}</span>
            <span className="text-muted-foreground"> · {caseStudy.testimonial.role}</span>
          </figcaption>
        </figure>
      )}

      {/* CTA */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-muted border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-display font-semibold text-foreground">
            Want an outcome like this?
          </h3>
          <p className="text-sm text-muted-foreground">
            Scope a similar system for your business in under 3 minutes.
          </p>
        </div>
        <button
          onClick={() => onNavigate('start')}
          className="apple-btn-primary px-6 py-2.5 text-xs font-normal shrink-0"
        >
          <span>Scope Similar System</span>
          <ChevronRight className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
};
