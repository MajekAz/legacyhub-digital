import { PageHero, Proof, ConsultationCTA } from '@/components/sections';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes } from '@/content/heroes';
export const metadata = pageMetadata(
  'Our work',
  'Our flagship example offers a way to explore the possibilities before discussing your own project.',
  '/case-studies',
);
export default function Page() {
  return (
    <main id="main">
      <PageHero {...pageHeroes['/case-studies']} />
      <Proof />
      <ConsultationCTA />
    </main>
  );
}
