import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { PrivacyControls } from '@/components/privacy-controls';
export const metadata: Metadata = {
  metadataBase: new URL('https://legacyhubdigital.com'),
  title: {
    default: 'LegacyHub Digital Heritage | Digital Legacy Archives',
    template: '%s | LegacyHub Digital Heritage',
  },
  description:
    'Digital Legacy Archives for Families, Leaders and Organisations. Preserve a Life. Protect a Story. Connect Generations.',
  alternates: { canonical: '/' },
  twitter: {
    card: 'summary_large_image',
    title: 'LegacyHub Digital Heritage',
    description: 'Preserve a Life. Protect a Story. Connect Generations.',
    images: ['/og.png'],
  },
  openGraph: {
    images: [
      {
        url: '/og.png',
        width: 1733,
        height: 907,
        alt: 'LegacyHub Digital Heritage — Preserve a Life. Protect a Story. Connect Generations.',
      },
    ],
    type: 'website',
    locale: 'en_GB',
    siteName: 'LegacyHub Digital Heritage',
    title: 'LegacyHub Digital Heritage',
    description: 'Preserve a Life. Protect a Story. Connect Generations.',
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="wrap nav">
            <Link className="brand" href="/" aria-label="LegacyHub Digital Heritage home">
              <span className="brand-mark" aria-hidden="true">
                L<span>H</span>
              </span>
              <span>
                LegacyHub<small>DIGITAL HERITAGE</small>
              </span>
            </Link>
            <nav aria-label="Main navigation">
              <Link href="/services">Our services</Link>
              <Link href="/how-it-works">Our approach</Link>
              <Link href="/case-studies">Our work</Link>
              <Link href="/about">About</Link>
              <Link className="button small-button" href="/book-consultation">
                Let’s preserve your story ↗
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <footer>
          <div className="wrap footer-grid">
            <div>
              <Link className="footer-brand" href="/">
                LegacyHub Digital Heritage
              </Link>
              <p>
                Digital Legacy Archives for Families,
                <br />
                Leaders and Organisations.
              </p>
            </div>
            <div>
              <Link href="/who-we-serve">Who we serve</Link>
              <Link href="/packages">Packages</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <p>© {new Date().getFullYear()} LegacyHub Digital Heritage</p>
            </div>
          </div>
        </footer>
        <PrivacyControls />
      </body>
    </html>
  );
}
