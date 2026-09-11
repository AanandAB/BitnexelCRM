# Bitnexel — High-Performance Software & Systems Studio

Static marketing site + client portal for the Bitnexel studio.

## Stack

- **Next.js 16** (App Router, `output: 'export'` static export)
- **Tailwind CSS v4**
- **motion** (animations), **Three.js** (bookshelf), **lucide-react** (icons)
- **bun** (package manager)

## Local development

```bash
bun install
bun run dev   # http://localhost:4321
```

## Build (static export)

```bash
bun run build   # outputs to out/
```

## Deploy

- Hosted on **Cloudflare Pages** (project `bitnexel`) → https://bitnexel.pages.dev
- Every push to `main` auto-deploys via **GitHub Actions** (`.github/workflows/deploy.yml`).
- Lead intake (`/contact` + `/start`) POSTs to the `bitnexel-leads` Cloudflare
  Worker, which the **Lead to Close** desktop CRM polls every 30s.
