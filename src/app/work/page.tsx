'use client';
import { WorkView } from '@/components/WorkView';
import { useAppRouter } from '@/lib/navigation';

export default function WorkPage() {
  const { selectCaseStudy } = useAppRouter();
  return <WorkView onSelectCaseStudy={selectCaseStudy} />;
}
