/**
 * Client-portal API client — talks to the `bitnexel-portal` Cloudflare Worker
 * on `api.bitnexel.in`. The worker owns the Google OAuth flow and the httpOnly
 * session cookie, so this client only ever does credentialed fetch() calls —
 * no secrets touch the browser.
 */

export const PORTAL_API =
  process.env.NEXT_PUBLIC_PORTAL_API ?? 'https://api.bitnexel.in';

export interface PortalSession {
  loggedIn: boolean;
  email?: string;
  name?: string;
}

export interface PortalProject {
  id: string;
  name: string;
  category?: string;
  status?: string;
  stage?: string;
  summary?: string;
  step?: number;
  total_steps?: number;
  created_at?: string;
  milestones?: { id: string; name: string; status?: string; due_date?: string }[];
}

export interface PortalData {
  email: string;
  name?: string;
  projects: PortalProject[];
}

/** Check whether the visitor has a valid session cookie. */
export async function getPortalSession(): Promise<PortalSession> {
  try {
    const res = await fetch(`${PORTAL_API}/api/auth/session`, {
      credentials: 'include',
    });
    if (!res.ok) return { loggedIn: false };
    return (await res.json()) as PortalSession;
  } catch {
    return { loggedIn: false };
  }
}

/** Kick off the Google sign-in (full-page redirect to the worker). */
export function startGoogleLogin(): void {
  window.location.href = `${PORTAL_API}/api/auth/login`;
}

/** Revoke the session and clear the cookie. */
export async function logoutPortal(): Promise<void> {
  try {
    await fetch(`${PORTAL_API}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // best-effort
  }
}

/** Fetch the signed-in client's projects + milestones. */
export async function getPortalData(): Promise<PortalData | null> {
  try {
    const res = await fetch(`${PORTAL_API}/api/portal`, { credentials: 'include' });
    if (!res.ok) return null;
    return (await res.json()) as PortalData;
  } catch {
    return null;
  }
}

/** Send a message from the client on the portal (flows back to the CRM). */
export async function sendPortalMessage(projectId: string, text: string): Promise<boolean> {
  try {
    const res = await fetch(`${PORTAL_API}/api/portal/message`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Approve a milestone from the client on the portal (flows back to the CRM). */
export async function approvePortalMilestone(
  projectId: string,
  milestoneId: string,
  milestoneName: string
): Promise<boolean> {
  try {
    const res = await fetch(`${PORTAL_API}/api/portal/milestone/approve`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, milestone_id: milestoneId, milestone_name: milestoneName }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** A single message in a portal thread (client + studio replies). */
export interface PortalThreadMessage {
  id: string;
  project_id: string;
  sender: 'client' | 'studio';
  text: string;
  created_at: string;
}

/** Fetch the full message thread for a project (client + studio replies). */
export async function getPortalMessages(projectId: string): Promise<PortalThreadMessage[]> {
  try {
    const res = await fetch(
      `${PORTAL_API}/api/portal/messages?project_id=${encodeURIComponent(projectId)}`,
      { credentials: 'include' }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { messages?: PortalThreadMessage[] };
    return data.messages ?? [];
  } catch {
    return [];
  }
}
