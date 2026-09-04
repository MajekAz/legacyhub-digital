import { PageHero, Process, FAQ, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes } from '@/content/heroes';
import { PageStructuredData } from '@/components/structured-data';
import { faq } from '@/content/site';
export const metadata = pageMetadata(
  'How Digital Legacy Preservation Works',
  'See how LegacyHub develops a digital family archive through consultation, collection, curation, design, review and ongoing archive care.',
  '/how-it-works',
);
export default function Page() {
  return (
    <main id="main">
      <PageStructuredData
        title="How Digital Legacy Preservation Works"
        description="The LegacyHub consultation, collection, curation, design, review and delivery process."
        path="/how-it-works"
        breadcrumbs={[
          ['Home', '/'],
          ['How It Works', '/how-it-works'],
        ]}
        faq={faq}
      />
      <PageHero {...pageHeroes['/how-it-works']} />
      <Process />
      <FAQ />
      <ConsultationCTA />
    </main>
  );
}
