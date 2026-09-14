# Bitnexel Platform — Architecture & Working Document

> **Scope:** the complete Bitnexel system — marketing website, client portal,
> Cloudflare serverless backend, and the Lead-to-Close desktop CRM.
>
> **Last updated:** 12 September 2026 · **Domain:** bitnexel.in · **Entity:** Bitnexel Systems, Kerala, India

---

## 1. System Overview

Bitnexel is a small software studio's end-to-end delivery platform. It has four
layers that work together to turn a website visitor into a paying client and then
keep that client informed through delivery:

| Layer | Technology | Where it runs |
|---|---|---|
| **Marketing site** | Next.js 16 (App Router, static export), React 19, Tailwind 4, Three.js, `motion` | Cloudflare Pages (`bitnexel`) |
| **Client portal** | Same Next.js app (SPA views + `/portal`, `/start`, `/login`), Google OAuth | Cloudflare Pages |
| **Serverless backend** | Cloudflare Workers + D1 (SQLite) + KV | Cloudflare edge |
| **CRM desktop app** | Flutter (Windows), Riverpod, Hive, GoRouter | Studio Windows PC |

The system is **eventually-consistent**: the website and CRM are decoupled and
exchange data through two Workers on a schedule. No database is shared directly
between the website and the CRM.

---

## 2. High-Level Architecture

```
┌──────────────────────────────┐                 ┌──────────────────────────────────┐
│   VISITOR / CLIENT (browser) │                 │      STUDIO (Windows PC)          │
│                              │                 │                                  │
│  https://bitnexel.in         │                 │  Lead-to-Close CRM (Flutter)     │
│  ├─ Marketing site (SSG)     │                 │  ├─ Hive local database          │
│  ├─ Client Portal (SPA)      │                 │  ├─ Lead sync (poll, 30s)        │
│  └─ Start Project wizard     │                 │  ├─ Portal sync (push, 5min)     │
└───────┬──────────────┬───────┘                 │  ├─ 2-way messaging              │
        │              │                         │  └─ Lifecycle checklists         │
        │ POST (public)│ credentialled fetch      └──────┬──────────────┬────────────┘
        ▼              ▼ (httpOnly session cookie)       │              │
┌───────────────┐  ┌──────────────────────────────────┐  │ Bearer       │ Bearer
│ bitnexel-leads│  │  bitnexel-portal (api.bitnexel.in)│  │ PORTAL_SYNC  │ LEAD_SYNC
│ Worker        │  │  ├─ Google OAuth (PKCE+state)    │  ▼              ▼
│               │  │  ├─ Session mgmt (D1)            │  (POST /sync,   (GET /leads)
│  └─ KV LEADS  │  │  ├─ Portal data (GET)            │   /reply)       (PATCH /ack)
└───────────────┘  │  ├─ Client actions → events       │
                   │  └─ Studio replies               │
                   │  └─ D1 `bitnexel-db`              │
                   │     clients, projects, milestones,│
                   │     sessions, portal_messages,    │
                   │     portal_events                 │
                   └──────────────────────────────────┘
```

**Two data directions:**

1. **Inbound (website → CRM):** a lead submitted on the site is POSTed to the
   `bitnexel-leads` worker → stored in KV → the CRM polls and auto-imports it.
2. **Outbound (CRM → portal):** when a lead is converted to a client/project, the
   CRM pushes clients + projects + milestones to `bitnexel-portal` → upserted into
   D1 → the client sees them after signing in with a matching email.
3. **Bidirectional messaging:** the client sends messages / approves milestones on
   the portal (stored as `portal_events`), the CRM pulls those events and replies
   (stored as `portal_messages`).

---

## 3. Components

### 3.1 Marketing website — `bitnexel.in`

- **Stack:** Next.js 16.3.5 (App Router), React 19, TypeScript 5.8, Tailwind CSS 4,
  `motion` (Framer Motion), Three.js (`three`), lucide-react. Package manager: **bun**.
- **Build:** static export (`output: 'export'`, `images.unoptimized`). Outputs to `out/`.
- **Hosting:** Cloudflare Pages project **`bitnexel`**, auto-deployed on every push to
  `main` via GitHub Actions (`.github/workflows/deploy.yml`, `bun install → bun run build →
  wrangler pages deploy out/`).
- **Design:** dark-first glassmorphism (frosted `.apple-tile-card` / `.studio-panel`
  over an aurora `AmbientBackground`), animated `SegmentedTabs`, 3D book-cover case-study
  cards, `TiltCard` + `Reveal` scroll motion, light/dark theme toggle.
- **SEO (added 2026-09):** per-page `metadata` (title/description/canonical), OpenGraph +
  Twitter cards, `robots.txt`, `sitemap.xml`, JSON-LD (`Organization`, `WebSite`, `Service`),
  static 1200×630 `og.png`. See `docs/` note in repo and the `seo-metadata` skill reference.

**Routes (17):**

| Route | Purpose |
|---|---|
| `/` | Home — hero, services, case studies, testimonials, pricing teaser |
| `/services` | Services index (All / Website / Software / Web-app tabs) |
| `/services/website` | Digital flagship websites |
| `/services/software` | Custom software & ERP |
| `/services/web-app` | Cloud web apps & SaaS |
| `/work` | All case studies (book-cover cards) |
| `/work/[slug]` | Case-study detail (9 SSG pages) |
| `/process` | Delivery process |
| `/pricing` | Pricing (₹15,000 base · AED 750 · USD 225) |
| `/about` | Studio story |
| `/contact` | Contact / enquiry form |
| `/start` | Start-a-project wizard (Google sign-in gated) |
| `/portal` | Client portal |
| `/login` | Sign-in |
| `/shelf` | Hidden "working volumes" bookshelf (nav-hidden, `noindex`) |
| `/privacy`, `/terms` | Legal (DPDP Act 2023 + IT Act 2000) |

### 3.2 Client portal (part of the same site)

- Auth: **Google OAuth** — authorization-code flow + **PKCE (S256)** + CSRF `state`,
  issued by the portal worker. The browser holds only an `httpOnly` + `Secure` +
  `SameSite=Lax` session cookie (`btx_session`, 30 days, `Domain=bitnexel.in`).
- **Identity matching:** a client sees projects where `projects.client_email` equals
  their Google account email. Enquiry email → client email → portal login must match.
- Portal features: project list, per-project 11-step progress tracker, milestone
  timeline + **milestone approval**, and a **two-way message thread**.

### 3.3 Cloudflare Workers

**`bitnexel-leads`** (ingest only; source not in this repo)
- Route: `bitnexel-leads.aanandab44.workers.dev`
- Stores leads in KV namespace **`LEADS`** (`ecdc3b8d666b4e81813089702d47db90`).
- Endpoints: `POST /api/leads` (public), `GET /api/leads` (Bearer `LEAD_SYNC_TOKEN`),
  `PATCH /api/leads/:id/ack`.

**`bitnexel-portal`** (source: `portal-worker/`)
- Route: **`api.bitnexel.in`** (`routes = [{ pattern = "api.bitnexel.in/*", zone_name = "bitnexel.in" }]`).
- D1 binding `DB` → **`bitnexel-db`** (`76c12fa5-5962-4d35-a1b0-e181aa7acf9b`).
- Owns Google OAuth, session management, portal data, sync, messaging, events.
- CORS allowlist: `bitnexel.in`, `www.bitnexel.in`, `localhost:4321`.
- In-memory rate limiter (30 req/min) on auth endpoints; paired with Cloudflare WAF rules.

### 3.4 Storage

**D1 `bitnexel-db`** (serverless SQLite):

| Table | Columns |
|---|---|
| `clients` | id, email (unique), name, company, created_at |
| `projects` | id, client_email, name, category, status, stage, summary, step, total_steps, created_at |
| `milestones` | id, project_id, name, status, due_date |
| `sessions` | token, email, name, created_at, expires_at |
| `portal_messages` | id, project_id, client_email, sender, text, created_at |
| `portal_events` | id, client_email, project_id, type, payload, created_at, synced |

> ⚠️ **Note:** `portal_events` is used by the worker but is **not** present in
> `portal-worker/schema.sql` — it was created in the live D1 directly. Sync
> `schema.sql` to include it (see §9 Operations).

**KV `LEADS`** — lead records keyed by id, with `notified`/`synced` flags.

**CRM Hive (local)** — boxes for leads, clients, projects, tasks, milestones, invoices,
quotes, proposals, contracts, documents, time entries, events, communications, coupons,
checklists, settings, and sync bookkeeping (`remote_lead:*` seen-keys).

---

## 4. Data Flow (life of a lead)

1. **Enquiry** — visitor fills the Contact form or Start Project wizard → browser
   `POST /api/leads` (public) with `name, email, phone, company, service, budget,
   message, source, submittedAt, userAgent` → stored in KV `LEADS`.
2. **Import** — the CRM polls `GET /api/leads` every 30s (Bearer `LEAD_SYNC_TOKEN`),
   dedupes by `remote_lead:<id>`, creates a local `Lead` (stage `new_lead`, source
   `Website`), and best-effort `PATCH /api/leads/:id/ack`.
3. **Qualify** — the lead moves through the Kanban pipeline
   (`new_lead → contacted → qualified → proposal_sent → negotiation → won/lost`).
4. **Convert (Won)** — the studio converts the lead, which creates a **Client** + a
   **Project** + a **Lifecycle Checklist** (track chosen from the project category).
5. **Publish to portal** — the CRM pushes clients/projects/milestones to
   `POST /api/portal/sync` (Bearer `PORTAL_SYNC_TOKEN`) every 5 min (and on demand).
6. **Client views** — the client signs in with the matching email and sees the project,
   its 11-step progress, milestones, and message thread.
7. **Two-way** — client sends messages / approves milestones → stored as `portal_events`
   → CRM pulls `GET /api/portal/events`, applies them, `PATCH .../ack`; studio replies via
   `POST /api/portal/reply` → appears in the client's thread.

---

## 5. API Reference

### 5.1 `bitnexel-leads` worker

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/leads` | none | Create lead (website forms) |
| GET | `/api/leads?limit=50&since=…` | `Bearer LEAD_SYNC_TOKEN` | CRM polls new leads |
| PATCH | `/api/leads/:id/ack` | `Bearer LEAD_SYNC_TOKEN` | CRM acknowledges import |

### 5.2 `bitnexel-portal` worker (`api.bitnexel.in`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | none | Health check |
| GET | `/api/auth/login?returnTo=/…` | none | Redirect to Google consent (PKCE+state) |
| GET | `/api/auth/callback` | OAuth | Exchange code → create session → redirect |
| GET | `/api/auth/session` | cookie | Return `{ loggedIn, email, name }` |
| POST | `/api/auth/logout` | cookie | Revoke session |
| GET | `/api/portal` | cookie | Client's projects + milestones |
| POST | `/api/portal/sync` | `Bearer PORTAL_SYNC_TOKEN` | **Upsert** clients/projects/milestones from CRM |
| POST | `/api/portal/message` | cookie | Client sends a message (→ events + thread) |
| POST | `/api/portal/milestone/approve` | cookie | Client approves a milestone (→ event) |
| POST | `/api/portal/reply` | `Bearer PORTAL_SYNC_TOKEN` | Studio reply (→ thread) |
| GET | `/api/portal/messages?project_id=…` | cookie | Client reads the message thread |
| GET | `/api/portal/events` | `Bearer PORTAL_SYNC_TOKEN` | CRM pulls unsynced client actions |
| PATCH | `/api/portal/events/:id/ack` | `Bearer PORTAL_SYNC_TOKEN` | CRM acks an event |

---

## 6. Lead-to-Close CRM (Flutter desktop)

- **Package:** `freelancehub` · version **2.5.1** · Flutter + Dart 3.5, Riverpod,
  GoRouter, **Hive** (local persistence), `pdf`/`printing`, `share_plus`, `url_launcher`.
- **Platform:** Windows desktop, shipped as an Inno Setup installer
  (`FreelanceHub_Setup_v<X>.exe`). **Installer versions increment on every build**
  (current 2.5.1) — never reuse a version number.

### 6.1 Features (screens)

- **Dashboard** — stats, needs-attention, glass cards.
- **Pipeline** — Kanban lead board + full lead detail (message, notes, activity,
  follow-up/overdue, score, tags, service type).
- **Clients** — client records, contacts (primary email = portal identity).
- **Projects** — project detail with **11-step client tracker** + **Lifecycle Checklist**
  tab, milestones, tasks.
- **Tasks** · **Invoices** · **Quotes** · **Proposals** · **Contracts** — document modules.
- **Documents** · **Communication** · **Calendar** · **Time tracking** — workspace modules.
- **Reports** · **Recurring** — reporting & recurring work.
- **Checklists** — the three lifecycle checklist tracks (Website / Custom Software / Web App).
- **Settings** — portal sync (URL + token) and lead sync (URL + token) with **Save & Test Sync**.
- **Onboarding** — first-run setup.

### 6.2 Domain model (Hive)

`Lead` (stage, score, service type, message, notes, activities, follow-up) · `Client`
(company, contacts) · `Project` (category, status, step, description) · `Task` ·
`Milestone`/process-step · `Invoice` · `Quote` · `Contract` · `AppDocument` ·
`TimeEntry` · `CalendarEvent` · `Communication` · `ReferralCoupon` ·
`ChecklistInstance` · `AppSettings`.

### 6.3 Sync services

- **`LeadSyncService`** — polls the leads worker every 30s, imports new leads,
  dedupes by remote id, acks.
- **`PortalSyncService`** — every 5 min pushes clients/projects/milestones to
  `/api/portal/sync`; `sendPortalReply()` posts studio replies. **Read-only with
  respect to local data.**
- **`PortalEventsService`** — pulls unsynced client actions from `/api/portal/events`
  and applies messages + milestone approvals.

### 6.4 Key behaviours

- **Lead → Client conversion** auto-creates Client + Project + keyed Lifecycle Checklist.
- **11-step tracker** (client-facing): First Contact → Qualification → Proposal →
  Kickoff → Discovery → UI/UX Design → Engineering → QA & Audit → Final Review →
  Launch → Warranty.
- **Lifecycle checklists** (internal): 3 tracks × 9 phases, with DPDP Act 2023 and
  security hardening gates (OWASP, HTTPS, encryption, erasure, breach playbook, etc.).
- **Cascade delete** — deleting a client removes their projects, tasks, milestones,
  time entries, documents, invoices, quotes, contracts, communications, events, coupons,
  and lifecycle checklists (with confirmation).
- **Save & Test Sync** reads URL/token directly from the fields and auto-enables the
  sync switch (fixes the empty-value race).

---

## 7. Configuration & Secrets

| Setting | Where | Value / source |
|---|---|---|
| Site origin | worker `vars.SITE_ORIGIN` | `https://bitnexel.in` |
| Google OAuth client ID | `vars.GOOGLE_CLIENT_ID` | public, in `portal-worker/wrangler.toml` |
| Google OAuth client secret | **secret** `GOOGLE_CLIENT_SECRET` | `wrangler secret put` |
| Portal sync token | **secret** `PORTAL_SYNC_TOKEN` | `wrangler secret put` |
| Lead sync token | **secret** `LEAD_SYNC_TOKEN` | `wrangler secret put` |
| Lead endpoint | `NEXT_PUBLIC_LEAD_ENDPOINT` (build) | `https://bitnexel-leads.aanandab44.workers.dev/api/leads` |
| Portal API | `NEXT_PUBLIC_PORTAL_API` (build) | `https://api.bitnexel.in` |
| Cloudflare account | GH Actions secret `CLOUDFLARE_API_TOKEN` | account `82381df5150e583859bcccc1717c7ed2` |
| Studio WhatsApp | `STUDIO_WHATSAPP_NUMBER` | `917034026295` |

> **Tokens are NOT committed.** Actual values live in Cloudflare secrets and in the
> local copy-only file `~/Desktop/Bitnexel_Sync_Config.txt` (never commit this).

---

## 8. Security & Compliance

- **Auth:** Google OAuth authorization-code + PKCE (S256) + one-time CSRF `state`;
  opaque, revocable session tokens; `httpOnly`/`Secure`/`SameSite=Lax` cookies scoped
  to `bitnexel.in`. Client secret never reaches the browser.
- **Worker hardening:** CORS allowlist, in-memory + WAF rate limiting, security headers
  (`X-Frame-Options: DENY`, HSTS, CSP, `nosniff`, Referrer-Policy).
- **Site headers** (`public/_headers`): HSTS, CSP, `nosniff`, `X-Frame-Options`,
  Referrer-Policy, Permissions-Policy.
- **Data protection:** DPDP Act 2023 + IT Act 2000 (S.43A) compliance, Grievance
  Officer documented in the Privacy Policy; consent, erasure/correction, breach-notify
  obligations built into the lifecycle checklists.

---

## 9. Deployment & Operations

### 9.1 Deploy

- **Website:** push to `main` → GitHub Actions builds (`bun`) and runs
  `wrangler pages deploy out/ --project-name bitnexel`.
- **Portal worker:** `cd portal-worker && npx wrangler deploy` (route `api.bitnexel.in`).
- **CRM:** `flutter build windows --release` → `ISCC.exe installer.iss` →
  `installer/FreelanceHub_Setup_v<X>.exe` (version bumped each time).

### 9.2 Useful commands

```
# Portal worker local
cd portal-worker && npx wrangler dev            # local dev
npx wrangler secret list                        # list secrets
npx wrangler d1 execute bitnexel-db --local --file schema.sql

# Smoke tests
curl -s https://api.bitnexel.in/api/health
curl -s -X POST https://api.bitnexel.in/api/portal/sync \
     -H "Authorization: Bearer $PORTAL_SYNC_TOKEN" -H "Content-Type: application/json" \
     -d '{"clients":[],"projects":[],"milestones":[]}'

# Website
bun run dev        # http://localhost:4321
bun run build      # static export → out/
```

### 9.3 Known gaps / TODO

- `portal_events` table is missing from `portal-worker/schema.sql` (created live) — add it.
- Deleting a client in the CRM does **not** auto-remove their portal data from D1 (portal
  sync only upserts). A worker-side delete-sync is a known future item.
- The `bitnexel-leads` worker source is not in this repo (only the portal worker is).
- Case-study detail images may lack `alt` text (SEO follow-up).

---

## 10. Glossary

- **CF** — Cloudflare · **D1** — Cloudflare serverless SQLite · **KV** — Cloudflare key-value store.
- **PKCE** — Proof Key for Code Exchange (OAuth hardening) · **SSG** — static site generation.
- **Hive** — local NoSQL/box store used by the CRM · **Riverpod** — Flutter state management.
- **DPDP Act 2023** — India's Digital Personal Data Protection Act.
