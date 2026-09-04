import Link from 'next/link';
import { PageHero } from '@/components/sections';
import { LeadMagnetForm } from '@/components/lead-magnet-form';
import { familyLegacyChecklist } from '@/content/lead-magnets';
import { pageMetadata } from '@/lib/metadata';
import { PageStructuredData } from '@/components/structured-data';

export const metadata = pageMetadata(
  'Free Family Legacy Preservation Guide',
  'Download 25 practical steps for preserving family photographs, documents, memories and life stories before their context is lost.',
  familyLegacyChecklist.landingPath,
);

const benefits = [
  'Photographs',
  'Birth and family records',
  'Marriage records',
  'Education certificates',
  'Career and professional history',
  'Military or public service records',
  'Letters and handwritten notes',
  'Audio recordings',
  'Video recordings',
  'Family stories',
  'Migration stories',
  'Important family homes and places',
  'Family businesses',
  'Community leadership',
  'Cultural traditions',
  'Awards and achievements',
  'Family-tree information',
  'Important dates',
  'Newspaper clippings',
  'Religious and cultural ceremonies',
  'Recipes and family traditions',
  'Personal lessons and quotations',
  'Historical possessions',
  'Stories connected to photographs',
  'Messages for future generations',
];

export default function Page() {
  return (
    <main id="main" data-funnel>
      <PageStructuredData
        title="Free Family Legacy Preservation Guide"
        description="A practical guide to identifying and preserving family photographs, documents, memories and life stories."
        path={familyLegacyChecklist.landingPath}
        breadcrumbs={[
          ['Home', '/'],
          ['Resources', '/resources'],
          ['Family Legacy Guide', familyLegacyChecklist.landingPath],
        ]}
      />
      <div className="wrap focus-header">
        <Link className="brand" href="/" aria-label="LegacyHub Digital Heritage home">
          LegacyHub<small>Digital Heritage</small>
        </Link>
        <span className="small">A free practical family guide.</span>
      </div>
      <PageHero {...familyLegacyChecklist.hero} />

      <section className="section wrap resource-why">
        <div className="section-intro">
          <div>
            <p className="eyebrow">Why this guide matters</p>
            <h2>Family history rarely begins in one organised place.</h2>
          </div>
          <div>
            <p>
              It is often scattered across phones, photo albums, drawers, old documents, WhatsApp
              messages and relatives&apos; memories.
            </p>
            <p>
              Audio and video recordings, certificates and letters may hold just as much context.
              The checklist helps families understand what may be worth preserving before a full
              digital archive project begins.
            </p>
          </div>
        </div>
      </section>

      <section className="section wrap resource-benefits">
        <div className="section-intro">
          <div>
            <p className="eyebrow">Inside the checklist</p>
            <h2>Know what matters before you begin organising.</h2>
          </div>
          <p>
            The guide gives families a calm starting point for identifying material, adding context
            and noticing the stories that may still need to be recorded.
          </p>
        </div>
        <ol className="resource-benefit-list">
          {benefits.map((benefit, index) => (
            <li key={benefit}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <strong>{benefit}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="resource-capture-section">
        <div className="wrap resource-capture-grid">
          <div>
            <p className="eyebrow">A useful first step</p>
            <h2>Begin with the family material you already have.</h2>
            <p>
              You do not need an organised collection. The checklist helps you look through one
              album, box or conversation at a time.
            </p>
            <div className="resource-reassurance">
              <strong>Respectful by design</strong>
              <p>
                We ask only for contact details to deliver the resource. Do not upload or send
                private family documents through this form.
              </p>
            </div>
          </div>
          <LeadMagnetForm />
        </div>
      </section>

      <section className="section wrap resource-trust">
        <p className="eyebrow">About LegacyHub</p>
        <div>
          <h2>Thoughtful digital archives for real family stories.</h2>
          <p>
            LegacyHub Digital Heritage helps families, leaders and organisations preserve
            photographs, biographies, documents and memories in professionally organised digital
            archives.
          </p>
        </div>
      </section>

      <section className="final-cta">
        <div className="wrap final-cta-grid">
          <div>
            <p className="eyebrow">Start with what you have</p>
            <h2>Your family story deserves more than a folder of forgotten photographs.</h2>
          </div>
          <div>
            <p>Use the checklist to identify the material and memories that deserve context.</p>
            <a className="button button-light" href="#checklist-form">
              Get the Free Checklist
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
