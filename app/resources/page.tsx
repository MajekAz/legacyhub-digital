import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';
import { PageStructuredData } from '@/components/structured-data';

const title = 'Family Legacy Resources';
const description =
  'Practical guidance for preserving family photographs, documents, memories and life stories in a thoughtful digital archive.';
export const metadata = pageMetadata(title, description, '/resources');

export default function Page() {
  return (
    <main id="main">
      <PageStructuredData
        title={title}
        description={description}
        path="/resources"
        breadcrumbs={[
          ['Home', '/'],
          ['Resources', '/resources'],
        ]}
      />
      <section className="section wrap prose">
        <p className="eyebrow">Legacy preservation resources</p>
        <h1>Practical guidance for preserving your family story.</h1>
        <p className="resource-lead">
          Begin with clear, manageable steps for identifying the photographs, documents, memories
          and family-history details worth carrying forward.
        </p>
      </section>
      <section className="section home-resource">
        <div className="wrap home-resource-grid">
          <div>
            <p className="eyebrow">Free family legacy guide</p>
            <h2>A Legacy to Last: 25 Steps to Safeguard Family Memories</h2>
          </div>
          <div>
            <p>
              Use this practical guide to identify meaningful photographs, records, family stories
              and personal details before they become separated from their context.
            </p>
            <Link className="button" href="/resources/family-legacy-checklist">
              Get the Free Guide
            </Link>
          </div>
        </div>
      </section>
      <section className="section wrap prose">
        <h2>When you are ready for help</h2>
        <p>
          Explore our <Link href="/services">digital legacy archive services</Link>, see{' '}
          <Link href="/how-it-works">how the preservation process works</Link>, or{' '}
          <Link href="/book-consultation">discuss your family archive</Link> with LegacyHub.
        </p>
      </section>
    </main>
  );
}
