'use client';

import React, { createContext, useContext, useState } from 'react';
import type { PortalProject } from '@/types';
import { mockClientProject } from '@/data/mockData';

interface PortalContextType {
  isLoggedIn: boolean;
  activeProject: PortalProject;
  login: () => void;
  logout: () => void;
  completeOnboarding: (project: PortalProject) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

/**
 * Demo client-portal state (logged-in by default so the portal is testable
 * immediately). Replaces the `useState` block that used to live in App.tsx.
 */
export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeProject, setActiveProject] = useState<PortalProject>(mockClientProject);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);
  const completeOnboarding = (project: PortalProject) => {
    setActiveProject(project);
    setIsLoggedIn(true);
  };

  return (
    <PortalContext.Provider
      value={{ isLoggedIn, activeProject, login, logout, completeOnboarding }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return ctx;
}
