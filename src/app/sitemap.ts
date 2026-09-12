import type { MetadataRoute } from 'next';
import { CASE_STUDIES } from '@/data/mockData';

export const dynamic = 'force-static';

const BASE = 'https://bitnexel.in';

// Indexable routes (login + shelf are intentionally excluded — noindex/disallowed).
const STATIC_ROUTES = [
  '',
  '/services',
  '/services/website',
  '/services/software',
  '/services/web-app',
  '/work',
  '/process',
  '/pricing',
  '/about',
  '/contact',
  '/start',
  '/portal',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));

  const workEntries: MetadataRoute.Sitemap = CASE_STUDIES.map((cs) => ({
    url: `${BASE}/work/${cs.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...workEntries];
}
