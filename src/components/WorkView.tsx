'use client';

import React, { useState } from 'react';
import { CaseStudy } from '../types';
import { mockCaseStudies } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { SegmentedTabs } from './SegmentedTabs';
import { Reveal } from './Reveal';

interface WorkViewProps {
  onSelectCaseStudy: (caseStudy: CaseStudy) => void;
}

type FilterId = 'all' | 'website' | 'software' | 'webapp';

const FILTER_TABS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All Deployments' },
  { id: 'website', label: 'Digital Flagships' },
  { id: 'software', label: 'Custom Software' },
  { id: 'webapp', label: 'Cloud Web Apps' },
];

const CATEGORY_BADGE: Record<string, string> = {
  Website: 'Digital Flagship',
  'Custom Software': 'Custom Software',
  'Web App': 'Web App & SaaS',
};

const matchesFilter = (cs: CaseStudy, filter: FilterId): boolean => {
  if (filter === 'all') return true;
  const cat = cs.category.toLowerCase();
  if (filter === 'website') return cat.includes('website');
  if (filter === 'software') return cat.includes('software');
  if (filter === 'webapp') return cat.includes('app');
  return true;
};

export const WorkView: React.FC<WorkViewProps> = ({ onSelectCaseStudy }) => {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');

  const filteredStudies = mockCaseStudies.filter((cs) => matchesFilter(cs, activeFilter));

  const tabs = FILTER_TABS.map((t) => ({
    ...t,
    count: mockCaseStudies.filter((cs) => matchesFilter(cs, t.id)).length,
  }));

  return (
    <div id="work-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <Reveal className="space-y-5 pb-8 border-b border-border">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-foreground text-[12px] font-normal">
          <Sparkles className="w-3.5 h-3.5 text-[#2997ff]" />
          <span>Production Portfolio · Audited Deployments</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-semibold text-foreground tracking-[-0.03em] leading-[1.06]">
          Systems in Production. Measurable Outcomes.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          High-performance production systems engineered for leading tech startups and established enterprises. Each architecture is built from first principles with zero template bloatware.
        </p>
        <div className="pt-1">
          <SegmentedTabs
            tabs={tabs}
            active={activeFilter}
            onChange={(id) => setActiveFilter(id as FilterId)}
            layoutId="work-filter-tabs"
          />
        </div>
      </Reveal>

      {/* Case Studies Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredStudies.map((study, idx) => (
            <motion.article
              key={study.id}
              layout
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              onClick={() => onSelectCaseStudy(study)}
              className="group cursor-pointer rounded-[20px] bg-muted border border-border hover:border-border overflow-hidden flex flex-col transition-[border-color,box-shadow] duration-300 hover:shadow-[0_24px_60px_-24px_rgba(0,113,227,0.45)]"
            >
              {/* Case-study image with hover zoom + gradient */}
              {study.image && (
                <div className="relative h-48 sm:h-56 overflow-hidden shrink-0">
                  <img
                    src={study.image}
                    alt={study.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-[#0b0b0d]/15 to-transparent" />
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-[10px] font-mono font-medium text-[#2997ff]">
                    {CATEGORY_BADGE[study.category] || study.category}
                  </span>
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/85">
                    {study.timeline}
                  </span>
                </div>
              )}

              <div className="p-6 sm:p-7 flex flex-col gap-4 grow">
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-semibold text-foreground group-hover:text-[#2997ff] transition-colors tracking-tight">
                    {study.title}
                  </h3>
                  <div className="text-xs font-mono text-muted-foreground mt-1.5">Client: {study.client}</div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {study.shortDescription || study.tagline}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2">
                  {(study.metrics || []).slice(0, 3).map((metric, i) => (
                    <div key={i} className="p-3 rounded-xl bg-surface border border-border">
                      <div className="text-[10px] text-muted-foreground truncate">{metric.label}</div>
                      <div className="text-sm font-semibold text-emerald-text mt-0.5">{metric.value}</div>
                    </div>
                  ))}
                </div>

                {/* Tech stack chips */}
                {study.techStack && study.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {study.techStack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-surface border border-border text-[10px] font-mono text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Animated CTA */}
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-medium text-[#2997ff]">Inspect Technical Specification</span>
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/25 text-[#2997ff] transition-all duration-300 group-hover:bg-[#0071e3] group-hover:text-white group-hover:rotate-45">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
