import React from 'react';
import { RouteType } from '../types';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { CompleteShelfLandingPage } from './CompleteShelfLandingPage';

interface ShelfViewProps {
  onNavigate: (route: RouteType) => void;
}

/**
 * ShelfView — the immersive "Working Volumes" bookshelf, framing the
 * self-contained Three.js scene with a light glass control layer so it
 * blends into the studio site.
 */
export const ShelfView: React.FC<ShelfViewProps> = ({ onNavigate }) => {
  return (
    <div id="shelf-view" className="space-y-4">
      {/* Glass control strip */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('work')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface backdrop-blur-xl border border-border text-foreground-soft hover:text-foreground hover:bg-surface text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Work</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface backdrop-blur-xl border border-border text-[11px] font-mono text-foreground-soft">
          <Sparkles className="w-3.5 h-3.5 text-[#2997ff]" />
          <span>Drag to orbit · Select a volume to open</span>
        </div>
      </div>

      {/* Full-bleed bookshelf frame */}
      <div className="rounded-[24px] overflow-hidden border border-border shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] bg-[#171a24]">
        <CompleteShelfLandingPage className="w-full h-[calc(100vh-210px)] min-h-[560px]" />
      </div>
    </div>
  );
};
