import type { ReactNode } from 'react';

/**
 * Shared shell for the static legal pages (/privacy, /terms). Server component —
 * content is pre-rendered into the HTML for SEO and legal accessibility.
 */
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-accent-text text-xs font-medium">
          Legal
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-foreground tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
      </div>

      <div className="rounded-2xl studio-panel p-6 sm:p-10 space-y-8 text-sm leading-relaxed text-foreground-soft">
        {children}
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-display font-bold text-foreground mb-2.5">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
