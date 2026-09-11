/**
 * Lead submission helper — the single choke point through which every website
 * inquiry (Contact form + Start Project wizard) flows into the Bitnexel CRM.
 *
 * POSTs to the Cloudflare "bitnexel-leads" worker, which stores the lead in KV
 * and pings the studio. The Lead to Close (Naro) desktop app polls the same
 * worker every 30s and auto-imports new leads into its Pipeline.
 *
 * This module is imported by client components only, so it runs in the browser.
 * The endpoint is public (no credentials are involved) and is configurable via
 * NEXT_PUBLIC_LEAD_ENDPOINT at build time; it falls back to the deployed worker
 * URL when the variable is unset.
 */

export const LEAD_ENDPOINT =
  process.env.NEXT_PUBLIC_LEAD_ENDPOINT ??
  'https://bitnexel-leads.aanandab44.workers.dev/api/leads';

/** Studio WhatsApp number (E.164 digits) — used for the tap-to-chat fallback. */
export const STUDIO_WHATSAPP_NUMBER = '917034026295';

export interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  source?: string;
}

export interface LeadResult {
  ok: boolean;
  id?: string;
  notified?: boolean;
  error?: string;
}

/**
 * Submit a lead to the CRM pipeline. Best-effort: never throws, always resolves
 * to a `LeadResult` so callers can show a success state regardless of whether
 * the worker was reachable (the on-page WhatsApp deep link remains the fallback).
 */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        submittedAt: new Date().toISOString(),
        userAgent:
          typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      }),
    });

    const data: Record<string, unknown> = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        error:
          typeof data.error === 'string'
            ? data.error
            : `Lead endpoint returned HTTP ${res.status}`,
      };
    }

    return {
      ok: true,
      id: typeof data.id === 'string' ? data.id : undefined,
      notified: data.notified === true,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}

/**
 * Build a wa.me deep link prefilled with the given brief. Used as a
 * belt-and-braces fallback so a lead is never lost even if the worker is down.
 */
export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${STUDIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
