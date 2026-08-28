import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="wrap section">
      <p className="eyebrow">Page not found</p>
      <h1>Let’s find your way back.</h1>
      <p>This page is not part of our collection.</p>
      <Link className="button" href="/">
        Return to LegacyHub
      </Link>
    </main>
  );
}
