import { PageHero, Proof, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Our work',
  'Our flagship example offers a way to explore the possibilities before discussing your own project.',
  '/case-studies',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero eyebrow="Our work" title="See what a digital legacy can become.">
        <p>
          Our flagship example offers a way to explore the possibilities before discussing your own
          project.
        </p>
      </PageHero>
      <Proof />
      <ConsultationCTA />
    </main>
  );
}
