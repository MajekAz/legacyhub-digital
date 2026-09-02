import Link from 'next/link';
import { familyLegacyChecklist } from '@/content/lead-magnets';
import { pageMetadata } from '@/lib/metadata';

const baseMetadata = pageMetadata(
  'Your Family Legacy Checklist request',
  'Your Family Legacy Preservation Checklist request has been received.',
  familyLegacyChecklist.thankYouPath,
);
export const metadata = { ...baseMetadata, robots: { index: false, follow: false } };

export default function Page() {
  return (
    <main id="main" className="resource-thank-you">
      <section className="section wrap prose">
        <p className="eyebrow">Thank you</p>
        <h1>Your Family Legacy Checklist is ready.</h1>
        <p className="resource-lead">
          Check your email for your copy. You can also begin thinking about the photographs,
          memories and documents you would most like your family to preserve.
        </p>
        <div className="actions">
          <Link
            className="button"
            href={familyLegacyChecklist.downloadPath}
            data-event="lead_magnet_download"
          >
            Download the Checklist
          </Link>
          <Link
            className="text-link"
            href="/book-consultation"
            data-event="consultation_cta_click"
          >
            Book a Legacy Consultation
          </Link>
        </div>
      </section>
      <section className="section resource-next-steps">
        <div className="wrap">
          <p className="eyebrow">What happens next?</p>
          <ol className="process-list">
            {[
              ['Download the checklist', 'Save a copy somewhere you can return to easily.'],
              ['Choose one place to begin', 'Start with one family album, box or folder.'],
              ['Add what you know', 'Identify the people, dates and places you already recognise.'],
              ['Ask relatives', 'Find out what stories, names or dates may still be missing.'],
              ['Contact LegacyHub when you are ready', 'A consultation can help organise everything into a permanent digital archive.'],
            ].map(([title, copy], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><h2>{title}</h2><p>{copy}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
