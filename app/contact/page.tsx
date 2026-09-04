import { PageHero } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { LeadForm } from '@/components/lead-form';
import { WhatsApp } from '@/components/whatsapp';
import { pageHeroes } from '@/content/heroes';
import { PageStructuredData } from '@/components/structured-data';
export const metadata = pageMetadata(
  'Contact Our Glasgow Heritage Studio',
  'Contact LegacyHub in Glasgow about preserving a family history, biography, photographs, documents or organisational heritage archive.',
  '/contact',
);
export default function Page() {
  return (
    <main id="main">
      <PageStructuredData
        title="Contact Our Glasgow Heritage Studio"
        description="Contact LegacyHub about a family, leadership or organisational heritage archive."
        path="/contact"
        breadcrumbs={[
          ['Home', '/'],
          ['Contact', '/contact'],
        ]}
      />
      <PageHero {...pageHeroes['/contact']} />
      <section className="section wrap form-page" id="contact-form">
        <aside>
          <p className="eyebrow">A considered first step</p>
          <h2>Tell us enough to understand the enquiry.</h2>
          <p>
            From our base in Glasgow, we welcome questions from families across the UK, Nigeria and
            the African diaspora, as well as leaders, institutions and community organisations.
          </p>
          <p className="small">
            Submitting an enquiry does not create a contract or reserve an appointment.
          </p>
          <WhatsApp />
        </aside>
        <LeadForm type="contact" />
      </section>
    </main>
  );
}
