import { PageHero, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'About LegacyHub Digital Heritage',
  'We help families, leaders and organisations bring meaningful material together into professionally designed digital legacy archives.',
  '/about',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero
        eyebrow="About LegacyHub Digital Heritage"
        title="Care for the story. Respect for the people."
      >
        <p>
          We help families, leaders and organisations bring meaningful material together into
          professionally designed digital legacy archives.
        </p>
      </PageHero>
      <section className="section wrap prose">
        <h2>A service with a human purpose</h2>
        <p>
          LegacyHub Digital Heritage is a done-for-you commercial service. LegacyHub is the
          underlying digital heritage technology used to deliver client archive projects; we are not
          selling a self-service SaaS subscription.
        </p>
        <p>
          Our approach makes room for African family history, cultural context and the connections
          that span the UK, Nigeria and diaspora communities. Each story is treated on its own
          terms.
        </p>
        <h2>Built around your priorities</h2>
        <p>
          We begin with the material you have and the people you want to reach. Scope, permissions,
          review, ownership and ongoing care are agreed before production.
        </p>
        <h2>An independent flagship example</h2>
        <p>
          The Baba Muyi family archive illustrates the possibilities. It remains an independent
          family archive, separate from this commercial website and its enquiry systems.
        </p>
      </section>
      <ConsultationCTA />
    </main>
  );
}
