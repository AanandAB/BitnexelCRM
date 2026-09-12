/**
 * Bitnexel client-portal worker — Google OAuth + session management + portal API.
 *
 * Auth flow (authorization-code + PKCE + CSRF state):
 *   1. GET /api/auth/login        -> redirect to Google consent screen
 *   2. GET /api/auth/callback     -> exchange code, issue httpOnly session cookie
 *   3. GET /api/auth/session      -> check session (for the SPA)
 *   4. POST /api/auth/logout      -> revoke session
 *   5. GET /api/portal            -> authed project/milestone data for the email
 *
 * Security:
 *   - Client secret lives ONLY here (env.GOOGLE_CLIENT_SECRET), never in the browser.
 *   - Opaque session tokens stored in D1 (revocable), delivered as an
 *     httpOnly + Secure + SameSite=Lax cookie scoped to `bitnexel.in`.
 *   - PKCE (S256) + a one-time `state` bound to the browser via httpOnly cookie.
 *   - CORS is an explicit allowlist (bitnexel.in + localhost), with credentials.
 */

export interface Env {
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  SITE_ORIGIN: string;
  PORTAL_SYNC_TOKEN: string;
}

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

const SESSION_COOKIE = 'btx_session';
const OAUTH_COOKIE = 'btx_oauth';
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

const ALLOWED_ORIGINS = ['https://bitnexel.in', 'https://www.bitnexel.in', 'http://localhost:4321'];

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
};

// Simple in-memory rate limiter for auth endpoints (resets on cold start).
// Pair with Cloudflare WAF rate rules for persistent, edge-level limits.
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}

function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...SECURITY_HEADERS, ...extraHeaders },
  });
}

function b64url(bytes: Uint8Array): string {
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomBytes(n: number): Uint8Array {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return bytes;
}

async function sha256Base64url(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return b64url(new Uint8Array(digest));
}

/** Cookie domain: shared across *.bitnexel.in; host-only otherwise (dev/workers.dev). */
function cookieDomain(hostname: string): string {
  if (hostname === 'bitnexel.in' || hostname.endsWith('.bitnexel.in')) return 'bitnexel.in';
  return '';
}

function cookieAttributes(hostname: string, maxAge: number, path = '/'): string {
  const parts = [
    `Path=${path}`,
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];
  const domain = cookieDomain(hostname);
  if (domain) parts.push(`Domain=${domain}`);
  return parts.join('; ');
}

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin');
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    };
  }
  return {};
}

function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

async function createSession(env: Env, email: string, name: string): Promise<string> {
  const token = b64url(randomBytes(32));
  const now = Date.now();
  await env.DB.prepare(
    'INSERT INTO sessions (token, email, name, created_at, expires_at) VALUES (?, ?, ?, ?, ?)'
  )
    .bind(token, email, name, new Date(now).toISOString(), new Date(now + SESSION_TTL_SECONDS * 1000).toISOString())
    .run();
  return token;
}

async function getSession(env: Env, token: string | null): Promise<{ email: string; name: string } | null> {
  if (!token) return null;
  const row = await env.DB.prepare(
    'SELECT email, name, expires_at FROM sessions WHERE token = ?'
  )
    .bind(token)
    .first<{ email: string; name: string; expires_at: string }>();
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;
  return { email: row.email, name: row.name };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const hostname = url.hostname;
    const cors = corsHeaders(request);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // ── Health ──────────────────────────────────────────────────────────────
    if (path === '/api/health' && request.method === 'GET') {
      return json({ ok: true, service: 'bitnexel-portal', time: new Date().toISOString() }, 200, cors);
    }

    // ── Login: build the Google consent URL + bind state/verifier ───────────
    if (path === '/api/auth/login' && request.method === 'GET') {
      if (isRateLimited(request.headers.get('CF-Connecting-IP') || 'anonymous')) {
        return json({ error: 'Too many requests. Please try again later.' }, 429, cors);
      }
      const state = b64url(randomBytes(16));
      const verifier = b64url(randomBytes(32));
      const challenge = await sha256Base64url(verifier);
      const redirectUri = `https://${hostname}/api/auth/callback`;

      const oauthCookieValue = JSON.stringify({ state, verifier });
      const params = new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        code_challenge: challenge,
        code_challenge_method: 'S256',
        access_type: 'online',
        prompt: 'select_account',
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: `${GOOGLE_AUTH_URL}?${params.toString()}`,
          'Set-Cookie': `${OAUTH_COOKIE}=${encodeURIComponent(oauthCookieValue)}; ${cookieAttributes(hostname, 600, '/api/auth')}`,
          ...SECURITY_HEADERS,
        },
      });
    }

    // ── Callback: exchange code, create session, redirect home ──────────────
    if (path === '/api/auth/callback' && request.method === 'GET') {
      if (isRateLimited(request.headers.get('CF-Connecting-IP') || 'anonymous')) {
        return json({ error: 'Too many requests. Please try again later.' }, 429, cors);
      }
      const error = url.searchParams.get('error');
      if (error) {
        return Response.redirect(`${env.SITE_ORIGIN}/login?error=${encodeURIComponent(error)}`, 302);
      }

      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      if (!code || !state) {
        return json({ error: 'Missing code or state' }, 400, cors);
      }

      // Verify the state matches the value we issued (CSRF protection).
      const oauthCookie = getCookie(request, OAUTH_COOKIE);
      if (!oauthCookie) {
        return json({ error: 'Missing OAuth state' }, 400, cors);
      }
      let verifier = '';
      try {
        const parsed = JSON.parse(decodeURIComponent(oauthCookie));
        if (parsed.state !== state) {
          return json({ error: 'State mismatch' }, 400, cors);
        }
        verifier = parsed.verifier ?? '';
      } catch {
        return json({ error: 'Invalid OAuth state' }, 400, cors);
      }

      const redirectUri = `https://${hostname}/api/auth/callback`;
      const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: env.GOOGLE_CLIENT_ID,
          client_secret: env.GOOGLE_CLIENT_SECRET,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
          code_verifier: verifier,
        }).toString(),
      });

      if (!tokenRes.ok) {
        return json({ error: 'Token exchange failed' }, 502, cors);
      }

      const tokens = (await tokenRes.json()) as { access_token?: string };
      if (!tokens.access_token) {
        return json({ error: 'No access token' }, 502, cors);
      }

      const userRes = await fetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      if (!userRes.ok) {
        return json({ error: 'Failed to fetch user info' }, 502, cors);
      }
      const user = (await userRes.json()) as { email?: string; name?: string };
      const email = (user.email ?? '').toLowerCase().trim();
      if (!email) {
        return json({ error: 'No email on Google account' }, 502, cors);
      }

      const sessionToken = await createSession(env, email, user.name ?? email);

      const headers = new Headers();
      for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
      headers.set('Location', `${env.SITE_ORIGIN}/portal`);
      headers.append(
        'Set-Cookie',
        `${SESSION_COOKIE}=${sessionToken}; ${cookieAttributes(hostname, SESSION_TTL_SECONDS)}`
      );
      const domain = cookieDomain(hostname);
      headers.append(
        'Set-Cookie',
        `${OAUTH_COOKIE}=; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0${domain ? `; Domain=${domain}` : ''}`
      );
      return new Response(null, { status: 302, headers });
    }

    // ── Session check ───────────────────────────────────────────────────────
    if (path === '/api/auth/session' && request.method === 'GET') {
      const session = await getSession(env, getCookie(request, SESSION_COOKIE));
      if (!session) return json({ loggedIn: false }, 200, cors);
      return json({ loggedIn: true, email: session.email, name: session.name }, 200, cors);
    }

    // ── Logout ──────────────────────────────────────────────────────────────
    if (path === '/api/auth/logout' && request.method === 'POST') {
      const token = getCookie(request, SESSION_COOKIE);
      if (token) {
        await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
      }
      return json(
        { ok: true },
        200,
        {
          ...cors,
          'Set-Cookie': `${SESSION_COOKIE}=; ${cookieAttributes(hostname, 0)}`,
        }
      );
    }

    // ── Portal data (authed) ────────────────────────────────────────────────
    if (path === '/api/portal' && request.method === 'GET') {
      const session = await getSession(env, getCookie(request, SESSION_COOKIE));
      if (!session) return json({ error: 'Unauthorized' }, 401, cors);

      const projects = await env.DB.prepare(
        'SELECT id, name, category, status, stage, summary, created_at FROM projects WHERE client_email = ? ORDER BY created_at DESC'
      )
        .bind(session.email)
        .all();

      const result = [];
      for (const p of projects.results as any[]) {
        const milestones = await env.DB.prepare(
          'SELECT id, name, status, due_date FROM milestones WHERE project_id = ? ORDER BY due_date ASC'
        )
          .bind(p.id)
          .all();
        result.push({ ...p, milestones: milestones.results });
      }

      return json({ email: session.email, name: session.name, projects: result }, 200, cors);
    }

    // ── Portal sync (CRM → D1) ─────────────────────────────────────────────
    if (path === '/api/portal/sync' && request.method === 'POST') {
      const auth = request.headers.get('Authorization') || '';
      if (auth !== `Bearer ${env.PORTAL_SYNC_TOKEN}`) {
        return json({ error: 'Unauthorized' }, 401, cors);
      }
      let payload: { clients?: any[]; projects?: any[]; milestones?: any[] };
      try {
        payload = await request.json();
      } catch {
        return json({ error: 'Invalid JSON' }, 400, cors);
      }

      const now = new Date().toISOString();
      let clients = 0;
      let projects = 0;
      let milestones = 0;

      for (const c of payload.clients ?? []) {
        const id = String(c?.id ?? '').trim();
        const email = String(c?.email ?? '').trim().toLowerCase();
        if (!id || !email) continue;
        await env.DB.prepare(
          'INSERT OR REPLACE INTO clients (id, email, name, company, created_at) VALUES (?, ?, ?, ?, ?)'
        ).bind(id, email, String(c?.name ?? ''), String(c?.company ?? ''), String(c?.created_at ?? now)).run();
        clients++;
      }

      for (const p of payload.projects ?? []) {
        const id = String(p?.id ?? '').trim();
        const clientEmail = String(p?.client_email ?? '').trim().toLowerCase();
        if (!id || !clientEmail) continue;
        await env.DB.prepare(
          'INSERT OR REPLACE INTO projects (id, client_email, name, category, status, stage, summary, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          id,
          clientEmail,
          String(p?.name ?? ''),
          String(p?.category ?? ''),
          String(p?.status ?? ''),
          String(p?.stage ?? ''),
          String(p?.summary ?? ''),
          String(p?.created_at ?? now)
        ).run();
        projects++;
      }

      for (const m of payload.milestones ?? []) {
        const id = String(m?.id ?? '').trim();
        const projectId = String(m?.project_id ?? '').trim();
        if (!id || !projectId) continue;
        await env.DB.prepare(
          'INSERT OR REPLACE INTO milestones (id, project_id, name, status, due_date) VALUES (?, ?, ?, ?, ?)'
        ).bind(id, projectId, String(m?.name ?? ''), String(m?.status ?? ''), m?.due_date ? String(m.due_date) : null).run();
        milestones++;
      }

      return json({ ok: true, clients, projects, milestones }, 200, cors);
    }

    return json({ error: 'Not found' }, 404, cors);
  },
};
