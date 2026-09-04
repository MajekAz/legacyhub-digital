import { PageHero } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { LeadForm } from '@/components/lead-form';
import { WhatsApp } from '@/components/whatsapp';
import { pageHeroes } from '@/content/heroes';
import { PageStructuredData } from '@/components/structured-data';
export const metadata = pageMetadata(
  'Book a Legacy Archive Consultation',
  'Discuss a family biography, digital memorial, photograph collection or organisational heritage archive with LegacyHub Digital Heritage.',
  '/book-consultation',
);
export default function Page() {
  return (
    <main id="main">
      <PageStructuredData
        title="Book a Legacy Archive Consultation"
        description="Discuss your family biography, photographs, memories or organisational heritage archive."
        path="/book-consultation"
        breadcrumbs={[
          ['Home', '/'],
          ['Book a Consultation', '/book-consultation'],
        ]}
      />
      <PageHero {...pageHeroes['/book-consultation']} />
      <section className="section wrap form-page" id="consultation-form">
        <aside>
          <p className="eyebrow">What happens next</p>
          <h2>A conversation, not a commitment.</h2>
          <ol>
            <li>
              <strong>We read your enquiry.</strong>
              <span>A person reviews what you have shared.</span>
            </li>
            <li>
              <strong>We contact you.</strong>
              <span>Using your chosen method, we arrange a suitable first conversation.</span>
            </li>
            <li>
              <strong>We discuss a scope.</strong>
              <span>
                If the service is a good fit, we explain the options and prepare a tailored quote.
              </span>
            </li>
          </ol>
          <p className="small">
            Please do not send sensitive documents or private archive material through this form.
          </p>
          <WhatsApp />
        </aside>
        <LeadForm />
      </section>
    </main>
  );
}
