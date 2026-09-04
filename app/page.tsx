import {
  PageHero,
  AudienceCards,
  Capabilities,
  Process,
  Proof,
  TrustReasons,
  StudioIntroduction,
  ConsultationCTA,
} from '@/components/sections';
import { pageHeroes } from '@/content/heroes';
import Link from 'next/link';

export default function Home() {
  return (
    <main id="main">
      <PageHero {...pageHeroes['/']} />

      <aside className="service-note" aria-label="Service summary">
        <div className="wrap service-note-grid">
          <strong>A guided, done-for-you service</strong>
          <span>For families</span>
          <span>For leaders</span>
          <span>For organisations</span>
        </div>
      </aside>

      <section className="section wrap section-intro">
        <div>
          <p className="eyebrow">Who we work with</p>
          <h2>Every archive begins with people.</h2>
        </div>
        <p>
          We help preserve the experiences, values and contributions that can otherwise become
          scattered across households, countries and generations.
        </p>
      </section>
      <section className="wrap section-tight">
        <AudienceCards />
      </section>
      <Capabilities />
      <section className="section home-resource">
        <div className="wrap home-resource-grid">
          <div>
            <p className="eyebrow">Free family legacy guide</p>
            <h2>Preserve the stories your family should never lose.</h2>
          </div>
          <div>
            <p>
              Download our practical Family Legacy Preservation Guide and discover 25 important
              photographs, documents, memories and stories worth organising for future generations.
            </p>
            <Link className="button" href="/resources/family-legacy-checklist">
              Get the Free Guide
            </Link>
          </div>
        </div>
      </section>
      <Process />
      <Proof />
      <TrustReasons />
      <StudioIntroduction />
      <ConsultationCTA />
    </main>
  );
}
