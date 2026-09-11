import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Canvas — light parchment in light mode, deep obsidian in dark */}
      <div className="absolute inset-0 bg-background" />

      {/* Subtle Aurora Glow - Top Center Indigo / Sky (slightly stronger in light so it reads through white) */}
      <div
        className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[1100px] h-[550px] rounded-full opacity-[0.28] dark:opacity-[0.2] blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #6366F1 0%, #38BDF8 45%, transparent 70%)'
        }}
      />

      {/* Subtle Emerald / Mint Accent Glow - Mid Left */}
      <div
        className="absolute top-[40%] -left-[12%] w-[750px] h-[500px] rounded-full opacity-[0.18] dark:opacity-[0.12] blur-[150px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #10B981 0%, transparent 65%)'
        }}
      />

      {/* Deep Violet / Sapphire Depth Glow - Bottom Right */}
      <div
        className="absolute -bottom-[12%] right-[2%] w-[850px] h-[550px] rounded-full opacity-[0.2] dark:opacity-[0.14] blur-[160px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #818CF8 0%, #4F46E5 40%, transparent 70%)'
        }}
      />
    </div>
  );
};
