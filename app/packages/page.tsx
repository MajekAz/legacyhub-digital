import { PageHero, PackageCards, FAQ, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes } from '@/content/heroes';
export const metadata = pageMetadata(
  'Service packages',
  'Four consultation-based service levels. An agreed scope and tailored quote, with no obligation to proceed.',
  '/packages',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero {...pageHeroes['/packages']} />
      <section className="section wrap" id="packages">
        <PackageCards />
      </section>
      <FAQ />
      <ConsultationCTA />
    </main>
  );
}
