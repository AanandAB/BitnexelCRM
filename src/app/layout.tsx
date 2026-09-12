import type { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';
import './globals.css';

const SITE = 'https://bitnexel.in';
const DESCRIPTION =
  'Bitnexel is a Kerala-based software & systems studio engineering high-throughput web applications, digital flagships, and bespoke software for businesses that demand sub-50ms performance.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Bitnexel — High-Performance Software & Systems Studio',
    template: '%s — Bitnexel',
  },
  description: DESCRIPTION,
  applicationName: 'Bitnexel',
  keywords: [
    'software development studio',
    'custom software development Kerala',
    'web application development',
    'website design Kerala',
    'SaaS development India',
    'Bitnexel',
    'Bitnexel Systems',
  ],
  authors: [{ name: 'Bitnexel Systems' }],
  creator: 'Bitnexel Systems',
  publisher: 'Bitnexel Systems',
  category: 'software development',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Bitnexel',
    locale: 'en_IN',
    url: SITE,
    title: 'Bitnexel — High-Performance Software & Systems Studio',
    description: DESCRIPTION,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Bitnexel — High-Performance Software & Systems Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitnexel — High-Performance Software & Systems Studio',
    description: DESCRIPTION,
    images: ['/og.png'],
  },
  formatDetection: { email: false, address: false, telephone: false },
};

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'Bitnexel Systems',
  url: SITE,
  logo: `${SITE}/assets/bitnexel-logo.png`,
  description: DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Kerala',
    addressCountry: 'IN',
  },
};

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Bitnexel',
  url: SITE,
  publisher: { '@id': `${SITE}/#organization` },
};

const THEME_SCRIPT =
  "try{if(localStorage.getItem('bitnexel_theme')==='light'){document.documentElement.classList.remove('dark');}}catch(e){}";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="icon" type="image/png" href="/assets/bitnexel-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
        />
      </head>
      <body className="antialiased selection:bg-[#0071e3] selection:text-white min-h-screen overflow-x-hidden font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
