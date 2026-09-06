import { PageHero, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { serviceContent } from '@/content/site';
import { pageHeroes } from '@/content/heroes';
import { PageStructuredData } from '@/components/structured-data';
import Link from 'next/link';
export const metadata = pageMetadata(
  'Done-for-You Digital Heritage Websites UK',
  'A complete digital legacy website planned, organised, designed, built and deployed to your own hosting account and custom domain.',
  '/services',
);
export default function Page() {
  return (
    <main id="main">
      <PageStructuredData
        title="Done-for-You Digital Heritage Websites UK"
        description="Complete digital heritage websites for families, individuals, leaders and organisations."
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
            <p className="eyebrow">The main service</p>
            <h2>Done-for-You Digital Heritage Website</h2>
          </div>
          <p>
            A complete website planned, organised, written, designed and built around your approved
            stories and materials, then deployed to your hosting account and connected to your
            custom domain.
          </p>
        </div>
        <div className="primary-service">
          <p className="eyebrow">One complete outcome</p>
          <h3>Your independent digital heritage website.</h3>
          <p>
            You provide the stories, photographs, documents and memories. We manage the project with
            you from discovery to launch and handover. This is not a subscription platform, template
            builder or collection of services you must assemble yourself.
          </p>
          <strong>Your domain. Your hosting. Your content. Your legacy.</strong>
        </div>
        <div className="section-heading">
          <p className="eyebrow">Services that can be included within your project</p>
          <h2>The supporting work behind the complete website.</h2>
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
          <Link href="/packages">Compare our legacy website project scopes</Link> or{' '}
          <Link href="/how-it-works">see how a LegacyHub project works</Link>.
        </p>
      </section>
      <ConsultationCTA />
    </main>
  );
}
