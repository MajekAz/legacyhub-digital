import { PageHero, AudienceCards, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Who we serve',
  'For families, leaders and organisations preserving the stories, values and contributions that connect generations.',
  '/who-we-serve',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero eyebrow="Who we serve" title="Every legacy begins with people.">
        <p>
          For families, leaders and organisations preserving the stories, values and contributions
          that connect generations.
        </p>
      </PageHero>
      <section className="section wrap">
        <AudienceCards />
      </section>
      <ConsultationCTA />
    </main>
  );
}
