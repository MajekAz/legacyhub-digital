import { PageHero, AudienceCards, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes } from '@/content/heroes';
export const metadata = pageMetadata(
  'Who we serve',
  'For families, leaders and organisations preserving the stories, values and contributions that connect generations.',
  '/who-we-serve',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero {...pageHeroes['/who-we-serve']} />
      <section className="section wrap" id="audiences">
        <AudienceCards />
      </section>
      <ConsultationCTA />
    </main>
  );
}
