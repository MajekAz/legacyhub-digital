import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { archiveCapabilities, audiences, faq, packages, processSteps } from '@/content/site';
import type { HeroAction, HeroContent } from '@/content/heroes';
import { WhatsApp } from './whatsapp';

function HeroLink({ action, secondary = false }: { action: HeroAction; secondary?: boolean }) {
  const className = secondary ? 'hero-secondary-link' : 'button hero-primary-button';
  const eventProps = action.event ? { 'data-event': action.event } : {};
  const content = (
    <>
      {action.label} {action.external && <span aria-hidden="true">↗</span>}
    </>
  );

  if (action.external) {
    return (
      <a
        className={className}
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        {...eventProps}
      >
        {content}
      </a>
    );
  }

  return (
    <Link className={className} href={action.href} {...eventProps}>
      {content}
    </Link>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  trustLine,
  backgroundImage,
  backgroundPosition = 'center',
  imageBrightness = 1.06,
  primaryCta,
  secondaryCta,
  minHeight = '70vh',
  overlay = 0.59,
  alignment = 'left',
  credit,
}: HeroContent) {
  const style = {
    '--hero-min-height': minHeight,
    '--hero-overlay': `rgba(8, 25, 31, ${overlay})`,
    '--hero-image-brightness': imageBrightness,
  } as CSSProperties;

  return (
    <section className={`page-hero page-hero-${alignment}`} style={style}>
      <Image
        className="page-hero-image"
        src={backgroundImage}
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectPosition: backgroundPosition }}
      />
      <div className="page-hero-overlay" aria-hidden="true" />
      <div className="wrap page-hero-content">
        <div className="page-hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-hero-description">{description}</p>
          {trustLine && <p className="page-hero-trust">{trustLine}</p>}
          <div className="page-hero-actions">
            <HeroLink action={primaryCta} />
            {secondaryCta && <HeroLink action={secondaryCta} secondary />}
          </div>
        </div>
        <a
          className="page-hero-credit"
          href={credit.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {credit.label} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

export function AudienceCards() {
  return (
    <div className="audience-grid">
      {audiences.map(([title, copy], index) => (
        <article className="audience-card" key={title}>
          <span aria-hidden="true">0{index + 1}</span>
          <h3>{title}</h3>
          <p>{copy}</p>
        </article>
      ))}
    </div>
  );
}

export function Capabilities() {
  return (
    <section className="section preserve-section">
      <div className="wrap">
        <div className="section-intro">
          <div>
            <p className="eyebrow">What we preserve</p>
            <h2>The material that makes a life recognisable.</h2>
          </div>
          <p>
            Not simply files in a folder, but photographs, voices and records organised with enough
            context for someone in the future to understand why they matter.
          </p>
        </div>
        <div className="preserve-list">
          {archiveCapabilities.map((title, index) => (
            <div key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{title}</strong>
            </div>
          ))}
        </div>
        <p className="small section-footnote">
          Each archive is scoped around the material available, the people involved and the
          permissions agreed.
        </p>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className="section wrap" id="process">
      <div className="section-intro">
        <div>
          <p className="eyebrow">A careful, guided process</p>
          <h2>From the first conversation to a finished archive.</h2>
        </div>
        <p>
          You do not need to arrive with everything organised. We help establish what exists, what
          is missing and what your family or organisation wants the archive to achieve.
        </p>
      </div>
      <ol className="process-list">
        {processSteps.map(([title, copy], index) => (
          <li key={title}>
            <span>0{index + 1}</span>
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Proof() {
  return (
    <section className="section case-study-section" id="featured-archive">
      <div className="wrap case-study-grid">
        <div className="case-study-label">
          <p className="eyebrow">A real archive example</p>
          <span>Independent family archive</span>
        </div>
        <div>
          <p className="case-kicker">The Tioluwalase Majekodunmi Family Archive</p>
          <h2>
            Biography, photographs, memories and lessons brought together in one family record.
          </h2>
          <p>
            The Baba Muyi archive shows how one life can be preserved through a long-form biography,
            timeline, family recollections, documents and documentary material. It is an independent
            family archive and our flagship case study.
          </p>
          <div className="actions">
            <Link
              className="button button-light"
              href="/case-studies/baba-muyi"
              data-event="case_study_click"
            >
              Read the Case Study
            </Link>
            <a
              className="case-live-link"
              href="https://tioluwalasemajekodunmi.com"
              target="_blank"
              rel="noopener noreferrer"
              data-event="case_study_click"
            >
              Visit the live archive <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="small">The live archive opens on an independent website.</p>
        </div>
      </div>
    </section>
  );
}

export function TrustReasons() {
  const reasons = [
    ['Respectful', 'Your family’s wishes, permissions and cultural context guide every decision.'],
    ['Private', 'Your materials remain your story. Access and handling are agreed with you.'],
    ['Guided', 'We help you move from scattered material to an agreed, manageable project.'],
    [
      'Considered',
      'Every biography, caption and section is reviewed before the archive is launched.',
    ],
    [
      'Approved by you',
      'Nothing is published until the agreed review and approval process is complete.',
    ],
  ];
  return (
    <section className="section wrap">
      <div className="section-intro">
        <div>
          <p className="eyebrow">Why families choose LegacyHub</p>
          <h2>Care is part of the work.</h2>
        </div>
        <p>
          A legacy archive involves real people, private memories and important decisions. Our
          process is designed to make those decisions clear and considered.
        </p>
      </div>
      <div className="trust-grid">
        {reasons.map(([title, copy]) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function StudioIntroduction() {
  return (
    <section className="studio-section">
      <div className="wrap studio-grid">
        <p className="eyebrow">About the studio</p>
        <div>
          <h2>A heritage preservation studio for real lives and shared histories.</h2>
          <p>
            LegacyHub Digital Heritage is a done-for-you service for families, leaders and
            organisations. We combine careful story development, archive organisation and thoughtful
            digital design. The result is shaped around your material — not a generic template or
            self-service subscription.
          </p>
          <Link className="text-link" href="/about">
            More about our approach <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PackageCards() {
  const packageIncludes = [
    ['Concise life story', 'Selected photographs', 'Focused archive structure'],
    ['Family narrative', 'Photographs and documents', 'Family review process'],
    ['Extended biography', 'Timeline and multimedia', 'Detailed curation and review'],
    ['Oral-history planning', 'Documentary production scope', 'Bespoke heritage structure'],
  ] as const;

  return (
    <>
      <div className="package-grid">
        {packages.map(([name, strap, copy], index) => (
          <article className="package-card" key={name}>
            <div className="package-heading">
              <span aria-hidden="true">0{index + 1}</span>
              <p className="eyebrow">{strap}</p>
            </div>
            <h3>{name}</h3>
            <p>{copy}</p>
            <ul>
              {packageIncludes[index].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link
              className="text-link"
              href="/book-consultation"
              data-event="consultation_cta_click"
            >
              Request a Quote <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
      <p className="small section-footnote">
        Pricing depends on archive size, research, media volume, design requirements and production
        complexity. Every project begins with a consultation.
      </p>
    </>
  );
}

export function FAQ({ extra }: { extra?: readonly [string, string] }) {
  return (
    <section className="section wrap faq">
      <div className="section-intro">
        <div>
          <p className="eyebrow">Common questions</p>
          <h2>What families often ask us.</h2>
        </div>
        <p>
          Every archive is different. These answers explain our usual starting point; the details
          are agreed with you before work begins.
        </p>
      </div>
      {[...(extra ? [extra] : []), ...faq].map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </section>
  );
}

export function ConsultationCTA() {
  return (
    <section className="final-cta">
      <div className="wrap final-cta-grid">
        <div>
          <p className="eyebrow">Begin with a conversation</p>
          <h2>What story would you like to preserve?</h2>
        </div>
        <div>
          <p>
            You do not need to have everything ready. Tell us what matters to you and what material
            you have.
          </p>
          <div className="actions">
            <Link
              className="button button-light"
              href="/book-consultation"
              data-event="consultation_cta_click"
            >
              Start Your Legacy Project
            </Link>
            <WhatsApp />
          </div>
        </div>
      </div>
    </section>
  );
}
