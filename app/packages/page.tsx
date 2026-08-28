import { PageHero, PackageCards, FAQ, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Service packages',
  'Four consultation-based service levels. An agreed scope and tailored quote, with no obligation to proceed.',
  '/packages',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero eyebrow="Service packages" title="The right beginning for your legacy.">
        <p>
          Four consultation-based service levels. An agreed scope and tailored quote, with no
          obligation to proceed.
        </p>
      </PageHero>
      <section className="section wrap">
        <PackageCards />
      </section>
      <FAQ />
      <ConsultationCTA />
    </main>
  );
}
