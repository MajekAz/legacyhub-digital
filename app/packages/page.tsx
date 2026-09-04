import { PageHero, PackageCards, FAQ, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes } from '@/content/heroes';
import { PageStructuredData } from '@/components/structured-data';
import { faq } from '@/content/site';
export const metadata = pageMetadata(
  'Digital Legacy Archive Packages',
  'Compare four consultation-based options for family biographies, heritage websites, multimedia archives and documentary legacy projects.',
  '/packages',
);
export default function Page() {
  return (
    <main id="main">
      <PageStructuredData
        title="Digital Legacy Archive Packages"
        description="Consultation-based family archive, biography and documentary heritage service options."
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
            <h2>Family archive and biography service options.</h2>
          </div>
          <p>
            Choose a useful starting point, then agree the final scope around your material,
            permissions and preservation priorities.
          </p>
        </div>
        <PackageCards />
      </section>
      <FAQ />
      <ConsultationCTA />
    </main>
  );
}
