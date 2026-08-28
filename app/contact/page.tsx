import { PageHero } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { LeadForm } from '@/components/lead-form';
import { WhatsApp } from '@/components/whatsapp';
export const metadata = pageMetadata(
  'Get in touch',
  'Ask about a legacy project, partnership, documentary enquiry or another aspect of our work.',
  '/contact',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero eyebrow="Get in touch" title="Let’s begin a conversation.">
        <p>
          Ask about a legacy project, partnership, documentary enquiry or another aspect of our
          work.
        </p>
      </PageHero>
      <section className="section wrap">
        <LeadForm type="contact" />
        <div className="actions">
          <WhatsApp />
        </div>
      </section>
    </main>
  );
}
