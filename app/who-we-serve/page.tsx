import { PageHero, AudienceCards, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes } from '@/content/heroes';
import { PageStructuredData } from '@/components/structured-data';
export const metadata = pageMetadata(
  'Family, Leadership and Organisation Archives',
  'Digital heritage archives for UK families, diaspora communities, leaders, veterans, founders and organisations preserving their history.',
  '/who-we-serve',
);
export default function Page() {
  return (
    <main id="main">
      <PageStructuredData
        title="Family, Leadership and Organisation Archives"
        description="Digital heritage archives for families, leaders, veterans, founders and organisations."
        path="/who-we-serve"
        breadcrumbs={[
          ['Home', '/'],
          ['Who We Serve', '/who-we-serve'],
        ]}
      />
      <PageHero {...pageHeroes['/who-we-serve']} />
      <section className="section wrap" id="audiences">
        <div className="section-intro">
          <div>
            <p className="eyebrow">Archives for every kind of legacy</p>
            <h2>Family history, public service and shared heritage.</h2>
          </div>
          <p>
            Each archive reflects the people, permissions and cultural context behind it, whether
            the story belongs to one person, a family or an organisation.
          </p>
        </div>
        <AudienceCards />
      </section>
      <ConsultationCTA />
    </main>
  );
}
