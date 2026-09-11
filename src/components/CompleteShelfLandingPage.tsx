'use client';

import React from 'react';

export interface CompleteShelfLandingPageProps {
  /** Authored typography is carried inside the source HTML; props kept for API parity. */
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: string | number;
  bodyWeight?: string | number;
  primaryColor?: string;
  headingSize?: number;
  bodySize?: number;
  headingLetterSpacing?: number;
  className?: string;
}

/**
 * CompleteShelfLandingPage — the ThreeUI "Working Volumes" bookshelf
 * (Seven Tools / projects), rendered from its self-contained authored HTML.
 *
 * The scene lives at `/public/landing-pages/complete-shelf-v2.html` (a
 * byte-complete Three.js r165 page) and is embedded in an iframe, preserving
 * the authored Three.js presentation 1:1 — OrbitControls, RoomEnvironment,
 * RoundedBoxGeometry, RectAreaLight — with no approximation.
 */
export function CompleteShelfLandingPage({
  className = '',
}: CompleteShelfLandingPageProps) {
  return (
    <iframe
      src="/landing-pages/complete-shelf-v2.html"
      title="Working Volumes — Seven Projects in Production"
      className={`w-full h-full border-0 bg-transparent block ${className}`}
      allow="fullscreen; xr-spatial-tracking; autoplay"
      loading="eager"
    />
  );
}

export default CompleteShelfLandingPage;
