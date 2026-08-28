import Link from 'next/link';
import { StructuredData } from '@/components/structured-data';
import {
  AudienceCards,
  Capabilities,
  Process,
  Proof,
  PackageCards,
  FAQ,
  ConsultationCTA,
} from '@/components/sections';
export default function Home() {
  return (
    <main id="main">
      <StructuredData />
      <section className="hero wrap">
        <div>
          <p className="eyebrow">Digital heritage & legacy archives</p>
          <h1>
            Preserve a Life.
            <br />
            Protect a Story.
            <br />
            <em>Connect Generations.</em>
          </h1>
          <p className="intro">
            We create professionally designed digital legacy archives for families, leaders and
            organisations — preserving biographies, photographs, documents, memories, tributes and
            multimedia for future generations.
          </p>
          <div className="actions">
            <Link className="button" href="/book-consultation" data-event="consultation_cta_click">
              Book a Legacy Consultation ↗
            </Link>
            <Link
              className="text-link"
              href="/case-studies/baba-muyi"
              data-event="case_study_click"
            >
              See a Real Legacy Archive →
            </Link>
          </div>
          <p className="small hero-note">
            Thoughtfully created. Personally meaningful. Built around your story.
          </p>
        </div>
        <div
          className="heritage-art"
          aria-label="An editorial representation of a digital heritage collection"
        >
          <div className="art-top">
            THE LEGACY COLLECTION <span>FOR GENERATIONS</span>
          </div>
          <div className="archive-book">
            <span className="book-rule" />
            <p>
              A life.
              <br />A story.
              <br />
              <em>
                A lasting
                <br />
                connection.
              </em>
            </p>
            <span className="book-foot">
              LEGACYHUB
              <br />
              DIGITAL HERITAGE
            </span>
          </div>
          <div className="archive-note">
            <span>OUR STORIES, KEPT CLOSE</span>
            <p>
              For those who remember.
              <br />
              For those yet to discover.
            </p>
          </div>
          <div className="art-bottom">BIOGRAPHY · PHOTOGRAPHS · VOICES · MEMORIES</div>
        </div>
      </section>
      <div className="heritage-strip">
        <div className="wrap">
          Every family has a story worth keeping.<span>Families · Leaders · Organisations</span>
        </div>
      </div>
      <section className="section wrap split">
        <p className="eyebrow">More than a collection</p>
        <div>
          <h2>
            Some things are too important
            <br />
            to leave scattered.
          </h2>
          <p>
            Photographs in boxes. Stories held by one person. A voice on an old recording. We help
            bring these pieces together into an accessible, carefully organised archive, with your
            family’s priorities at its heart.
          </p>
          <Link className="text-link" href="/how-it-works">
            Discover our approach →
          </Link>
        </div>
      </section>
      <section className="section wrap">
        <p className="eyebrow">For the people who matter</p>
        <h2>A legacy takes many forms.</h2>
        <AudienceCards />
      </section>
      <Capabilities />
      <Process />
      <Proof />
      <section className="section wrap">
        <p className="eyebrow">Thoughtfully scoped</p>
        <h2>A starting point for your story.</h2>
        <PackageCards />
      </section>
      <FAQ />
      <ConsultationCTA />
    </main>
  );
}
