import { StructuredData } from '@/components/structured-data';
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

export default function Home() {
  return (
    <main id="main">
      <StructuredData />
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
      <Process />
      <Proof />
      <TrustReasons />
      <StudioIntroduction />
      <ConsultationCTA />
    </main>
  );
}
