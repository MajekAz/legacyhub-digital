import { PageHero, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { serviceContent } from '@/content/site';
export const metadata = pageMetadata(
  'Our services',
  'Explore digital legacy archives, biography development, archive organisation and bespoke heritage projects.',
  '/services',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero eyebrow="Our services" title="A considered service, built around your story.">
        <p>
          Explore digital legacy archives, biography development, archive organisation and bespoke
          heritage projects.
        </p>
      </PageHero>
      <section className="section wrap">
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
      </section>
      <ConsultationCTA />
    </main>
  );
}
