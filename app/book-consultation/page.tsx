import { PageHero } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { LeadForm } from '@/components/lead-form';
import { WhatsApp } from '@/components/whatsapp';
import { pageHeroes } from '@/content/heroes';
export const metadata = pageMetadata(
  'A first conversation',
  'Share what you have in mind. We will follow up using your preferred contact method to discuss the right next step.',
  '/book-consultation',
);
export default function Page() {
  return (
    <main id="main">
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
