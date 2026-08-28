import Link from 'next/link';
import { notFound } from 'next/navigation';
import { campaigns, type CampaignSlug } from '@/content/site';
import { PageHero, Capabilities, Process, Proof, FAQ } from '@/components/sections';
import { LeadForm } from '@/components/lead-form';
import { WhatsApp } from '@/components/whatsapp';
import { pageMetadata } from '@/lib/metadata';
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(campaigns).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = campaigns[slug as CampaignSlug];
  return c ? pageMetadata(c.title, c.benefit, `/landing/${slug}`) : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = campaigns[slug as CampaignSlug];
  if (!c) notFound();
  return (
    <main id="main" data-landing>
      <div className="wrap focus-header">
        <Link className="brand" href="/">
          LegacyHub<small>DIGITAL HERITAGE</small>
        </Link>
        <span className="small">Your story, thoughtfully preserved.</span>
      </div>
      <PageHero eyebrow={c.eyebrow} title={c.title}>
        <p>{c.problem}</p>
        <p>{c.benefit}</p>
        <div className="actions">
          <a className="button" href="#consultation" data-event="consultation_cta_click">
            Book a Legacy Consultation ↗
          </a>
          <WhatsApp />
        </div>
      </PageHero>
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
