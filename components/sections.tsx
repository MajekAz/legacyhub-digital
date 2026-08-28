import Link from 'next/link';
import { archiveCapabilities, audiences, faq, packages, processSteps } from '@/content/site';
import { WhatsApp } from './whatsapp';
export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}
export function AudienceCards() {
  return (
    <div className="grid">
      {audiences.map(([title, copy]) => (
        <article className="card" key={title}>
          <h3>{title}</h3>
          <p>{copy}</p>
        </article>
      ))}
    </div>
  );
}
export function Capabilities() {
  return (
    <section className="section wrap">
      <p className="eyebrow">A collection with context</p>
      <h2>Many pieces. One connected story.</h2>
      <div className="grid">
        {archiveCapabilities.map((title, i) => (
          <article className="card" key={title}>
            <p className="eyebrow">0{i + 1}</p>
            <h3>{title}</h3>
          </article>
        ))}
      </div>
      <p className="small" style={{ marginTop: 20 }}>
        The content and capabilities of each archive are agreed during scoping.
      </p>
    </section>
  );
}
export function Process() {
  return (
    <section className="section wrap">
      <div className="split">
        <div>
          <p className="eyebrow">Our approach</p>
          <h2>
            From scattered memories
            <br />
            to a shared legacy.
          </h2>
        </div>
        <div className="steps">
          {processSteps.map(([title, copy]) => (
            <article className="step" key={title}>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Proof() {
  return (
    <section className="dark section">
      <div className="wrap split">
        <div>
          <p className="eyebrow">Our flagship case study</p>
          <p className="small">THE TIOLUWALASE MAJEKODUNMI FAMILY ARCHIVE</p>
        </div>
        <div>
          <h2>
            A family story.
            <br />
            <em>A living connection.</em>
          </h2>
          <p>
            The Tioluwalase Majekodunmi Family Archive is LegacyHub Digital Heritage’s flagship
            example of how a family story can be preserved through biography, timeline, photographs,
            documents, family memories, lessons, tributes and documentary material.
          </p>
          <Link className="button" href="/case-studies/baba-muyi" data-event="case_study_click">
            Discover the Baba Muyi archive →
          </Link>
          <p className="small" style={{ marginTop: 18 }}>
            An independent family archive. Presented here as an external case study only.
          </p>
        </div>
      </div>
    </section>
  );
}
export function PackageCards() {
  return (
    <>
      <div className="grid">
        {packages.map(([name, strap, copy]) => (
          <article className="card" key={name}>
            <p className="eyebrow">{strap}</p>
            <h3>{name}</h3>
            <p>{copy}</p>
            <Link
              className="text-link"
              href="/book-consultation"
              data-event="consultation_cta_click"
            >
              Request a Quote →
            </Link>
          </article>
        ))}
      </div>
      <p className="small" style={{ marginTop: 24 }}>
        Pricing depends on archive size, research, media volume, design requirements and production
        complexity. Every package is scoped through consultation. No online checkout or fixed
        prices.
      </p>
    </>
  );
}
export function FAQ({ extra }: { extra?: readonly [string, string] }) {
  return (
    <section className="section wrap faq">
      <p className="eyebrow">A few things you may be wondering</p>
      <h2>Your questions, considered.</h2>
      {[...(extra ? [extra] : []), ...faq].map(([q, a]) => (
        <details key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </section>
  );
}
export function ConsultationCTA() {
  return (
    <section className="section dark">
      <div className="wrap">
        <p className="eyebrow">Begin with a conversation</p>
        <h2>
          What story would you
          <br />
          like to preserve?
        </h2>
        <p>You don’t need to have everything ready. Tell us what matters to you.</p>
        <div className="actions">
          <Link className="button" href="/book-consultation" data-event="consultation_cta_click">
            Book a Legacy Consultation ↗
          </Link>
          <WhatsApp />
        </div>
      </div>
    </section>
  );
}
