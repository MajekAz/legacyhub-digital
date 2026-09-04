import Link from 'next/link';
import { notFound } from 'next/navigation';
import { campaigns, faq, type CampaignSlug } from '@/content/site';
import { PageHero, Capabilities, Process, Proof, FAQ } from '@/components/sections';
import { LeadForm } from '@/components/lead-form';
import { WhatsApp } from '@/components/whatsapp';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes, type HeroRoute } from '@/content/heroes';
import { PageStructuredData } from '@/components/structured-data';
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(campaigns).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = campaigns[slug as CampaignSlug];
  return c ? pageMetadata(c.seoTitle, c.seoDescription, `/landing/${slug}`) : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = campaigns[slug as CampaignSlug];
  if (!c) notFound();
  const hero = pageHeroes[`/landing/${slug}` as HeroRoute];
  return (
    <main id="main" data-landing>
      <PageStructuredData
        title={c.title}
        description={c.benefit}
        path={`/landing/${slug}`}
        kind="Service"
        breadcrumbs={[
          ['Home', '/'],
          [c.eyebrow, `/landing/${slug}`],
        ]}
        faq={[[c.question, c.answer], ...faq]}
      />
      <div className="wrap focus-header">
        <Link className="brand" href="/">
          LegacyHub<small>DIGITAL HERITAGE</small>
        </Link>
        <span className="small">Your story, thoughtfully preserved.</span>
      </div>
      <PageHero {...hero} />
      <section className="section wrap section-intro">
        <div>
          <p className="eyebrow">Why preserve this history</p>
          <h2>{c.problem}</h2>
        </div>
        <p>
          {c.benefit} <Link href="/services">Explore the digital archive services available</Link>.
        </p>
      </section>
      <Capabilities />
      <Proof />
      <Process />
      <FAQ extra={[c.question, c.answer]} />
      <section className="section wrap" id="consultation">
        <p className="eyebrow">Take the first step</p>
        <h2>Tell us about your story.</h2>
        <LeadForm />
        <div className="actions">
          <WhatsApp />
        </div>
      </section>
    </main>
  );
}
