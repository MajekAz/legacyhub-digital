import { PageHero, PackageCards, FAQ, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes } from '@/content/heroes';
import { PageStructuredData } from '@/components/structured-data';
import { faq } from '@/content/site';
export const metadata = pageMetadata(
  'Digital Legacy Website Packages',
  'Compare three project scopes for complete personal, family and organisational heritage websites, with a tailored written quote.',
  '/packages',
);
export default function Page() {
  return (
    <main id="main">
      <PageStructuredData
        title="Digital Legacy Website Packages"
        description="Consultation-based project scopes for complete digital heritage websites."
        path="/packages"
        kind="Service"
        breadcrumbs={[
          ['Home', '/'],
          ['Packages', '/packages'],
        ]}
        faq={faq}
      />
      <PageHero {...pageHeroes['/packages']} />
      <section className="section wrap" id="packages">
        <div className="section-intro">
          <div>
            <p className="eyebrow">A tailored starting point</p>
            <h2>Project scopes, not software subscriptions.</h2>
          </div>
          <p>
            Choose a useful starting point, then agree what is included, optional or separately
            quoted around your material, domain, hosting and production requirements.
          </p>
        </div>
        <PackageCards />
      </section>
      <FAQ />
      <ConsultationCTA />
    </main>
  );
}
