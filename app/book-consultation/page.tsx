import { PageHero } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { LeadForm } from '@/components/lead-form';
import { WhatsApp } from '@/components/whatsapp';
export const metadata = pageMetadata(
  'A first conversation',
  'Share what you have in mind. We will follow up using your preferred contact method to discuss the right next step.',
  '/book-consultation',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero eyebrow="A first conversation" title="Tell us about the legacy.">
        <p>
          Share what you have in mind. We will follow up using your preferred contact method to
          discuss the right next step.
        </p>
      </PageHero>
      <section className="section wrap">
        <LeadForm />
        <div className="actions">
          <WhatsApp />
        </div>
      </section>
    </main>
  );
}
