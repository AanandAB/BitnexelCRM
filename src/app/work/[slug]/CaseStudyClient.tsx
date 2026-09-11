'use client';
import { CaseStudyDetail } from '@/components/CaseStudyDetail';
import { CASE_STUDIES } from '@/data/mockData';
import { useAppRouter } from '@/lib/navigation';

export function CaseStudyClient({ slug }: { slug: string }) {
  const { navigate } = useAppRouter();
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  if (!cs) return null;
  return (
    <CaseStudyDetail caseStudy={cs} onNavigate={navigate} onBack={() => navigate('work')} />
  );
}
