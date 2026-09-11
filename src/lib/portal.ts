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
