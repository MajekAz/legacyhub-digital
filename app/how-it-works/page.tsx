import { PageHero, Process, FAQ, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Our approach',
  'From the first conversation to launch and care, we agree the scope, permissions and priorities together.',
  '/how-it-works',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero eyebrow="Our approach" title="Your story. A thoughtful process.">
        <p>
          From the first conversation to launch and care, we agree the scope, permissions and
          priorities together.
        </p>
      </PageHero>
      <Process />
      <FAQ />
      <ConsultationCTA />
    </main>
  );
}
