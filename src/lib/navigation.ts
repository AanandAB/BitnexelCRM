'use client';

import { useRouter, usePathname } from 'next/navigation';
import type { RouteType, CaseStudy } from '@/types';

/**
 * Maps the app's internal `RouteType` (legacy hash-routing vocabulary) to
 * real App Router paths. Kept in one place so the rest of the codebase
 * can keep calling `navigate('work')` etc. unchanged.
 */
const ROUTE_TO_PATH: Record<string, string> = {
  home: '/',
  services: '/services',
  'services/website': '/services/website',
  'services/software': '/services/software',
  'services/web-app': '/services/web-app',
  'services-website': '/services/website',
  'services-software': '/services/software',
  'services-webapp': '/services/web-app',
  work: '/work',
  shelf: '/shelf',
  process: '/process',
  pricing: '/pricing',
  about: '/about',
  contact: '/contact',
  start: '/start',
  login: '/login',
  portal: '/portal',
};

export function useAppRouter() {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (route: RouteType) => {
    router.push(ROUTE_TO_PATH[route] ?? '/');
  };

  const selectCaseStudy = (cs: CaseStudy) => {
    router.push(`/work/${cs.slug}`);
  };

  return { navigate, selectCaseStudy, pathname };
}

/**
 * Reverse mapping for Navbar active-state highlighting. `/work/<slug>` folds
 * back to `work` so the "Work" tab stays lit on case-study pages.
 */
export function pathToRoute(pathname: string): RouteType {
  const p = (pathname || '/').replace(/\/+$/, '') || '/';
  if (p === '/') return 'home';
  if (p === '/work' || p.startsWith('/work/')) return 'work';
  if (p === '/services') return 'services';
  if (p === '/services/website') return 'services/website';
  if (p === '/services/software') return 'services/software';
  if (p === '/services/web-app') return 'services/web-app';
  if (p === '/shelf') return 'shelf';
  if (p === '/process') return 'process';
  if (p === '/pricing') return 'pricing';
  if (p === '/about') return 'about';
  if (p === '/contact') return 'contact';
  if (p === '/start') return 'start';
  if (p === '/login') return 'login';
  if (p === '/portal') return 'portal';
  return 'home';
}
