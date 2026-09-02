import { UnsubscribeForm } from '@/components/unsubscribe-form';
import { pageMetadata } from '@/lib/metadata';
export const metadata = {
  ...pageMetadata(
    'Email preferences',
    'Manage your LegacyHub marketing email preference.',
    '/unsubscribe',
  ),
  robots: { index: false, follow: false },
  referrer: 'no-referrer' as const,
};
export default function Page() {
  return (
    <main id="main">
      <section className="section wrap prose">
        <p className="eyebrow">Email preferences</p>
        <h1>Unsubscribe from marketing emails</h1>
        <UnsubscribeForm />
      </section>
    </main>
  );
}
