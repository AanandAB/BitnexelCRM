'use client';

import React from 'react';
import { motion } from 'motion/react';

export interface SegmentedTab<T extends string> {
  id: T;
  label: string;
  count?: number;
}

interface SegmentedTabsProps<T extends string> {
  tabs: SegmentedTab<T>[];
  active: T;
  onChange: (id: T) => void;
  /** Unique id for the shared sliding indicator (must be unique per page). */
  layoutId?: string;
  className?: string;
}

/**
 * SegmentedTabs — a pill segmented control with a spring-animated sliding
 * indicator. The active highlight glides between options via `layoutId`,
 * giving a smooth, premium tab switch. Generic over the option id type.
 */
export function SegmentedTabs<T extends string>({
  tabs,
  active,
  onChange,
  layoutId = 'segmented-tabs-indicator',
  className = '',
}: SegmentedTabsProps<T>) {
  return (
    <div
      className={`inline-flex flex-wrap items-center gap-1 p-1 rounded-full bg-muted border border-border ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            whileTap={{ scale: 0.96 }}
            className="relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{ color: isActive ? '#ffffff' : 'var(--muted-fg)' }}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-[#0071e3] shadow-[0_2px_14px_rgba(0,113,227,0.55)]"
                transition={{ type: 'spring', stiffness: 450, damping: 34 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-mono ${isActive ? 'text-foreground/80' : 'text-muted-foreground/70'}`}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default SegmentedTabs;
