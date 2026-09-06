import {
  PageHero,
  AudienceWebsiteCards,
  OwnershipPanel,
  ConsultationCTA,
} from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes } from '@/content/heroes';
import { PageStructuredData } from '@/components/structured-data';
export const metadata = pageMetadata(
  'Legacy Websites for Families, Leaders and Organisations',
  'Done-for-you personal, family, veteran, leadership and organisational heritage websites on your own domain and hosting.',
  '/who-we-serve',
);
export default function Page() {
  return (
    <main id="main">
      <PageStructuredData
        title="Legacy Websites for Families, Leaders and Organisations"
        description="Done-for-you digital heritage websites for families, individuals, leaders and organisations."
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
            <p className="eyebrow">A website shaped around each story</p>
            <h2>Personal histories, family connections and shared heritage.</h2>
          </div>
          <p>
            Each project results in a complete website deployed to the client’s hosting account and
            connected to their custom domain.
          </p>
        </div>
        <AudienceWebsiteCards />
      </section>
      <OwnershipPanel />
      <ConsultationCTA />
    </main>
  );
}
