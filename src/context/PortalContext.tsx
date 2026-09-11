'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { PortalProject } from '@/types';
import { mockClientProject } from '@/data/mockData';
import {
  getPortalSession,
  startGoogleLogin,
  logoutPortal,
} from '@/lib/portal';

interface PortalContextType {
  isLoggedIn: boolean;
  loading: boolean;
  email: string | null;
  activeProject: PortalProject;
  login: () => void;
  logout: () => void;
  completeOnboarding: (project: PortalProject) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

/**
 * Real client-portal auth state. On first load we ask the portal worker for an
 * existing httpOnly session cookie; `login()` redirects to Google OAuth, and
 * `logout()` revokes the session server-side.
 */
export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<PortalProject>(mockClientProject);

  useEffect(() => {
    getPortalSession().then((session) => {
      setIsLoggedIn(session.loggedIn);
      setEmail(session.email ?? null);
      setLoading(false);
    });
  }, []);

  const login = useCallback(() => {
    startGoogleLogin();
  }, []);

  const logout = useCallback(() => {
    logoutPortal().then(() => {
      setIsLoggedIn(false);
      setEmail(null);
    });
  }, []);

  const completeOnboarding = (project: PortalProject) => {
    setActiveProject(project);
    setIsLoggedIn(true);
  };

  return (
    <PortalContext.Provider
      value={{
        isLoggedIn,
        loading,
        email,
        activeProject,
        login,
        logout,
        completeOnboarding,
      }}
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
