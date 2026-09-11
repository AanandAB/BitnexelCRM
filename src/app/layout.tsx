import type { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://bitnexel.in'),
  title: 'Bitnexel — High-Performance Software & Systems Studio',
  description:
    'We engineer high-throughput web applications, digital flagships, and bespoke software systems for businesses that demand sub-50ms performance.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
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
      </head>
      <body className="antialiased selection:bg-[#0071e3] selection:text-white min-h-screen overflow-x-hidden font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
