import type { Metadata } from 'next';
import { CaseStudyClient } from './CaseStudyClient';
import { CASE_STUDIES } from '@/data/mockData';

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  if (!cs) return { title: 'Case Study' };
  return {
    title: { absolute: cs.title },
    description: cs.shortDescription,
    alternates: { canonical: `/work/${cs.slug}` },
    openGraph: {
      type: 'article',
      title: cs.title,
      description: cs.shortDescription,
      images: [{ url: cs.image }],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CaseStudyClient slug={slug} />;
}
