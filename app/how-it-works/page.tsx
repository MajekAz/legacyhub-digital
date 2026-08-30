import { PageHero, Process, FAQ, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes } from '@/content/heroes';
export const metadata = pageMetadata(
  'Our approach',
  'From the first conversation to launch and care, we agree the scope, permissions and priorities together.',
  '/how-it-works',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero {...pageHeroes['/how-it-works']} />
      <Process />
      <FAQ />
      <ConsultationCTA />
    </main>
  );
}
