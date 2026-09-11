'use client';

import React from 'react';
import { motion } from 'motion/react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds */
  delay?: number;
  /** Vertical travel distance before settling */
  y?: number;
  /** Only animate the first time it enters the viewport */
  once?: boolean;
}

/**
 * Reveal — fades and slides content up as it scrolls into view, using Apple's
 * signature ease curve. Wrap any section header, panel, or card grid with it.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  y = 24,
  once = true,
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};
