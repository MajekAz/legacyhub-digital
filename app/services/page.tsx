import { PageHero, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { serviceContent } from '@/content/site';
import { pageHeroes } from '@/content/heroes';
import { PageStructuredData } from '@/components/structured-data';
import Link from 'next/link';
export const metadata = pageMetadata(
  'Digital Legacy Archive Services UK',
  'Preserve biographies, family photographs, documents and oral histories with a professionally organised digital heritage archive in the UK.',
  '/services',
);
export default function Page() {
  return (
    <main id="main">
      <PageStructuredData
        title="Digital Legacy Archive Services UK"
        description="Professional digital legacy and heritage archive services for families, leaders and organisations."
        path="/services"
        kind="Service"
        breadcrumbs={[
          ['Home', '/'],
          ['Services', '/services'],
        ]}
      />
      <PageHero {...pageHeroes['/services']} />
      <section className="section wrap" id="services">
        <div className="section-intro">
          <div>
            <p className="eyebrow">Digital heritage services</p>
            <h2>Preservation shaped around your story and material.</h2>
          </div>
          <p>
            From a family biography to an organisational heritage archive, we help turn scattered
            records into a clear, connected digital collection.
          </p>
        </div>
        <div className="grid">
          {serviceContent.map(([title, copy]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <p className="small" style={{ marginTop: 24 }}>
          Specialist digitisation, filming, research and access systems are subject to assessment
          and a written scope, not automatic package inclusions.
        </p>
        <p>
          <Link href="/packages">Compare our archive service starting points</Link> or{' '}
          <Link href="/how-it-works">see how a LegacyHub project works</Link>.
        </p>
      </section>
      <ConsultationCTA />
    </main>
  );
}
