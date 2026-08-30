import { PageHero } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { LeadForm } from '@/components/lead-form';
import { WhatsApp } from '@/components/whatsapp';
import { pageHeroes } from '@/content/heroes';
export const metadata = pageMetadata(
  'Get in touch',
  'Ask about a legacy project, partnership, documentary enquiry or another aspect of our work.',
  '/contact',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero {...pageHeroes['/contact']} />
      <section className="section wrap form-page" id="contact-form">
        <aside>
          <p className="eyebrow">A considered first step</p>
          <h2>Tell us enough to understand the enquiry.</h2>
          <p>
            We welcome questions from families in the UK, Nigeria and across the African diaspora,
            as well as leaders, institutions and community organisations.
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
