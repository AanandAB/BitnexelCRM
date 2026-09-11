'use client';

import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  /** Card visual classes (background, border, radius, padding, etc.) */
  className?: string;
  /** Maximum tilt angle in degrees */
  maxTilt?: number;
  /** Show the cursor-following spotlight glare */
  glare?: boolean;
  /** Hover scale factor */
  scale?: number;
  onClick?: () => void;
  /** Enable scroll-reveal entrance (fade + rise) */
  reveal?: boolean;
  /** Stagger delay in seconds for the entrance */
  revealDelay?: number;
}

/**
 * TiltCard — an interactive 3D card that tilts toward the cursor and casts a
 * mouse-tracking spotlight highlight, with an optional scroll-reveal entrance.
 * Built on `motion` (GPU-composited CSS transforms), so it stays silky at 60fps
 * without any WebGL overhead.
 *
 * Usage:
 *   <TiltCard className="apple-tile-card rounded-[18px] p-6" reveal revealDelay={0.1}>
 *     …
 *   </TiltCard>
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  glare = true,
  scale = 1.02,
  onClick,
  reveal = false,
  revealDelay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Normalised cursor position relative to card centre: -0.5 … 0.5
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  // Spring smoothing gives the tilt a premium, weighty settle
  const springX = useSpring(pointerX, { stiffness: 250, damping: 24, mass: 0.5 });
  const springY = useSpring(pointerY, { stiffness: 250, damping: 24, mass: 0.5 });

  // Rotate toward the cursor (opposite sign so the card "lifts" under it)
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Spotlight position in percentages for the radial gradient
  const glareX = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(springY, [-0.5, 0.5], [0, 100]);
  const spotlight = useMotionTemplate`radial-gradient(240px circle at ${glareX}% ${glareY}%, rgba(0,113,227,0.16), transparent 72%)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onClick={onClick}
      {...(reveal
        ? {
            initial: { opacity: 0, y: 24 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: '-60px' },
            transition: {
              duration: 0.6,
              delay: revealDelay,
              ease: [0.16, 1, 0.3, 1],
            },
          }
        : {})}
      whileHover={{ scale, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}

      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: spotlight }}
        />
      )}
    </motion.div>
  );
};
