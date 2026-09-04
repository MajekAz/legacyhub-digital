import { PageHero, Proof, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes } from '@/content/heroes';
import { PageStructuredData } from '@/components/structured-data';
export const metadata = pageMetadata(
  'Digital Legacy Archive Case Study',
  'Explore a real family archive example combining biography, photographs, memories, documents and a timeline in one digital heritage collection.',
  '/case-studies',
);
export default function Page() {
  return (
    <main id="main">
      <PageStructuredData
        title="Digital Legacy Archive Case Study"
        description="A real family archive example combining biography, photographs, memories and documents."
        path="/case-studies"
        breadcrumbs={[
          ['Home', '/'],
          ['Case Studies', '/case-studies'],
        ]}
      />
      <PageHero {...pageHeroes['/case-studies']} />
      <Proof />
      <ConsultationCTA />
    </main>
  );
}
