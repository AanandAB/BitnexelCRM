'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { PortalProvider } from '@/context/PortalContext';
import { MotionConfig } from 'motion/react';
import { AmbientBackground } from '@/components/AmbientBackground';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAppRouter, pathToRoute } from '@/lib/navigation';

/**
 * The shared client shell that used to live inside App.tsx — providers,
 * ambient background, global nav/footer. Every route renders inside this,
 * so nav + footer persist exactly as before.
 */
export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { navigate, pathname } = useAppRouter();

  return (
    <ThemeProvider>
      <CurrencyProvider>
        <PortalProvider>
          <MotionConfig reducedMotion="user">
            <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-[#6366F1]/30 selection:text-foreground">
              {/* Ambient Animated Gradient Background Mesh */}
              <AmbientBackground />

              {/* Global Glass Navigation */}
              <Navbar currentRoute={pathToRoute(pathname)} onNavigate={navigate} />

              {/* Main Routed Content Area */}
              <main className="flex-grow pt-24 pb-16 z-10">{children}</main>

              {/* Global Footer */}
              <Footer onNavigate={navigate} />
            </div>
          </MotionConfig>
        </PortalProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
};
