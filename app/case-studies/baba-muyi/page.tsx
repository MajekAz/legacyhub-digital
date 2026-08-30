import { PageHero, Capabilities, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes } from '@/content/heroes';
export const metadata = pageMetadata(
  'Baba Muyi flagship case study',
  'Explore the Tioluwalase Majekodunmi Family Archive as an independent flagship example of digital family heritage.',
  '/case-studies/baba-muyi',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero {...pageHeroes['/case-studies/baba-muyi']} />
      <section className="section wrap split">
        <div>
          <p className="eyebrow">Baba Muyi</p>
          <p>Independent family archive</p>
        </div>
        <div>
          <h2>A life, told through many threads.</h2>
          <p>
            The Tioluwalase Majekodunmi Family Archive is LegacyHub Digital Heritage’s flagship
            example of how a family story can be preserved through biography, timeline, photographs,
            documents, family memories, lessons, tributes and documentary material.
          </p>
          <p>
            It illustrates how a narrative and its supporting material can come together. The scope
            of your own archive will reflect your family’s material, wishes and permissions.
          </p>
          <a
            className="button"
            href="https://tioluwalasemajekodunmi.com"
            target="_blank"
            rel="noopener noreferrer"
            data-event="case_study_click"
          >
            Explore the Live Archive ↗
          </a>
          <p className="small" style={{ marginTop: 18 }}>
            You are leaving LegacyHub Digital Heritage to view an independent family archive in a
            new tab. Its own privacy and access arrangements apply.
          </p>
          <p className="small">
            No private family information, media, administration or authentication data is
            reproduced on this commercial website.
          </p>
        </div>
      </section>
      <section className="section case-documentary">
        <div className="wrap">
          <div className="section-intro">
            <div>
              <p className="eyebrow">The preservation approach</p>
              <h2>One life, organised so its meaning remains visible.</h2>
            </div>
            <p>
              The archive demonstrates how family knowledge and documentary material can be given a
              clear structure without losing the warmth and character of the person at its centre.
            </p>
          </div>
          <div className="case-documentary-grid">
            <article>
              <span>01</span>
              <h3>The story</h3>
              <p>
                A long-form biography gives the life a narrative thread, connecting family,
                experience, values and contribution.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>The material</h3>
              <p>
                Photographs, documents, recollections, tributes and documentary material add
                evidence, texture and different family voices.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>The structure</h3>
              <p>
                Biography, timeline, memories and lessons are organised as connected parts of one
                archive rather than isolated files.
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>The purpose</h3>
              <p>
                The finished archive gives present and future generations a considered point of
                reference for the story and its context.
              </p>
            </article>
          </div>
        </div>
      </section>
      <Capabilities />
      <ConsultationCTA />
    </main>
  );
}
