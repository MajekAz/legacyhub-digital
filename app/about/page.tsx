import { PageHero, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes } from '@/content/heroes';
import { PageStructuredData } from '@/components/structured-data';
export const metadata = pageMetadata(
  'About Our Digital Heritage Studio',
  'LegacyHub is a Glasgow-based digital heritage studio helping families, leaders and organisations preserve biographies, memories and records.',
  '/about',
);
export default function Page() {
  return (
    <main id="main">
      <PageStructuredData
        title="About Our Digital Heritage Studio"
        description="A Glasgow-based digital heritage studio preserving biographies, memories and records."
        path="/about"
        breadcrumbs={[
          ['Home', '/'],
          ['About', '/about'],
        ]}
      />
      <PageHero {...pageHeroes['/about']} />
      <section className="section wrap prose">
        <h2>A service with a human purpose</h2>
        <p>
          LegacyHub Digital Heritage is a done-for-you commercial service. LegacyHub is the
          underlying digital heritage technology used to deliver client archive projects; we are not
          selling a self-service SaaS subscription.
        </p>
        <p>
          Based in Glasgow, Scotland, we work with families and organisations across the United
          Kingdom and discuss remote collaboration for projects further afield.
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
