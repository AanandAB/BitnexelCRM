'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { PortalProject, ProjectLifecycleStage } from '@/types';
import { mockClientProject } from '@/data/mockData';
import {
  getPortalSession,
  startGoogleLogin,
  logoutPortal,
  getPortalData,
  sendPortalMessage,
  approvePortalMilestone,
} from '@/lib/portal';

interface PortalContextType {
  isLoggedIn: boolean;
  loading: boolean;
  email: string | null;
  activeProject: PortalProject;
  login: () => void;
  logout: () => void;
  completeOnboarding: (project: PortalProject) => void;
  sendMessage: (projectId: string, text: string) => Promise<boolean>;
  approveMilestone: (projectId: string, milestoneId: string, milestoneName: string) => Promise<boolean>;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

/** Collapse any worker/CRM stage onto the 6 lifecycle stages the UI shows. */
function toStage(s?: string): ProjectLifecycleStage {
  const map: Record<string, ProjectLifecycleStage> = {
    discovery: 'discovery',
    proposal: 'discovery',
    design: 'design',
    agreement: 'design',
    advance: 'design',
    'on-hold': 'design',
    development: 'development',
    review: 'qa',
    qa: 'qa',
    launch: 'launch',
    handover: 'launch',
    support: 'support',
    cancelled: 'support',
  };
  return map[s ?? ''] ?? 'discovery';
}

/**
 * Map the worker's simplified project shape (id/name/category/stage/summary +
 * milestones) onto the rich portal model the ClientPortal UI renders. Rich
 * fields are filled with sensible defaults; real data fills the meaningful ones.
 */
function mapPortalDataToProject(
  p: {
    id: string;
    name: string;
    category?: string;
    status?: string;
    stage?: string;
    summary?: string;
    milestones?: { id: string; name: string; status?: string; due_date?: string }[];
  },
  email: string
): PortalProject {
  const milestones = p.milestones ?? [];
  const done = milestones.filter((m) => m.status === 'done').length;
  const progress = milestones.length ? Math.round((done / milestones.length) * 100) : 0;
  const next = milestones.find((m) => m.status !== 'done');

  return {
    id: p.id,
    name: p.name,
    clientName: '',
    clientEmail: email,
    clientCompany: p.category ?? 'Client',
    category: p.category ?? 'Custom Software',
    currentStage: toStage(p.stage),
    stageProgress: progress,
    statusSummary: p.summary ?? '',
    nextMilestone: next?.name ?? 'All milestones complete',
    nextMilestoneDueDate: next?.due_date ?? '—',
    stagingUrl: undefined,
    payment: {
      totalBudget: 0,
      percentReceived: 0,
      amountPaid: 0,
      nextDueAmount: 0,
      nextDueCondition: '',
      milestones: milestones.map((m) => ({
        name: m.name,
        percent: 0,
        amount: 0,
        status: m.status === 'done' ? 'paid' : m.status === 'current' ? 'current' : 'upcoming',
      })),
    },
    pendingItems: [],
    files: [],
    feedbackItems: [],
    changeRequests: [],
    messages: [],
    activityLog: [],
    retainerPlan: undefined,
    milestones,
  };
}

/**
 * Real client-portal auth state. On first load we ask the portal worker for an
 * existing httpOnly session cookie; when logged in we also pull the client's
 * real projects/milestones from D1 (mapped onto the UI model). `sendMessage` /
 * `approveMilestone` post client actions back, which the CRM later pulls.
 */
export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<PortalProject>(mockClientProject);

  useEffect(() => {
    (async () => {
      const session = await getPortalSession();
      setIsLoggedIn(session.loggedIn);
      setEmail(session.email ?? null);
      if (session.loggedIn) {
        const data = await getPortalData();
        if (data && data.projects.length > 0) {
          setActiveProject(mapPortalDataToProject(data.projects[0], data.email));
        }
      }
      setLoading(false);
    })();
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

  const sendMessage = useCallback(
    (projectId: string, text: string) => sendPortalMessage(projectId, text),
    []
  );

  const approveMilestone = useCallback(
    (projectId: string, milestoneId: string, milestoneName: string) =>
      approvePortalMilestone(projectId, milestoneId, milestoneName),
    []
  );

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
        sendMessage,
        approveMilestone,
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
