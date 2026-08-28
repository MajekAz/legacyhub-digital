import { PageHero, Capabilities, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Baba Muyi flagship case study',
  'Explore the Tioluwalase Majekodunmi Family Archive as an independent flagship example of digital family heritage.',
  '/case-studies/baba-muyi',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero eyebrow="Flagship case study" title="The Tioluwalase Majekodunmi Family Archive">
        <p>
          A family story preserved with context, care and a connection to the generations that
          follow.
        </p>
      </PageHero>
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
      <Capabilities />
      <ConsultationCTA />
    </main>
  );
}
