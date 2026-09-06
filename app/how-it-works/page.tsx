import {
  PageHero,
  DetailedJourney,
  OwnershipPanel,
  FAQ,
  ConsultationCTA,
} from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes } from '@/content/heroes';
import { PageStructuredData } from '@/components/structured-data';
import { faq } from '@/content/site';
export const metadata = pageMetadata(
  'How We Build Your Digital Legacy Website',
  'See the complete done-for-you journey from discovery and content collection to website design, client approval, hosting and launch.',
  '/how-it-works',
);
export default function Page() {
  return (
    <main id="main">
      <PageStructuredData
        title="How We Build Your Digital Legacy Website"
        description="The complete LegacyHub journey from discovery to a client-owned website launch."
        path="/how-it-works"
        breadcrumbs={[
          ['Home', '/'],
          ['How It Works', '/how-it-works'],
        ]}
        faq={faq}
      />
      <PageHero {...pageHeroes['/how-it-works']} />
      <DetailedJourney />
      <OwnershipPanel />
      <FAQ />
      <ConsultationCTA />
    </main>
  );
}
