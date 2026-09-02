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
    <html lang="en-GB" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="wrap nav">
            <Link className="brand" href="/" aria-label="LegacyHub Digital Heritage home">
              <span className="brand-mark" aria-hidden="true">
                LH
              </span>
              <span>
                LegacyHub<small>Digital Heritage</small>
              </span>
            </Link>
            <nav className="desktop-nav" aria-label="Main navigation">
              <Link href="/services">Services</Link>
              <Link href="/how-it-works">How It Works</Link>
              <Link href="/case-studies">Our Work</Link>
              <Link href="/resources/family-legacy-checklist">Resources</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link className="button small-button" href="/book-consultation">
                Start Your Legacy Project
              </Link>
            </nav>
            <details className="mobile-nav">
              <summary>
                Menu <span aria-hidden="true">+</span>
              </summary>
              <nav aria-label="Mobile navigation">
                <Link href="/services">Services</Link>
                <Link href="/how-it-works">How It Works</Link>
                <Link href="/case-studies">Our Work</Link>
                <Link href="/resources/family-legacy-checklist">Resources</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link className="button" href="/book-consultation">
                  Start Your Legacy Project
                </Link>
              </nav>
            </details>
          </div>
        </header>
        {children}
        <footer>
          <div className="wrap footer-top">
            <div>
              <Link className="footer-brand" href="/">
                LegacyHub Digital Heritage
              </Link>
              <p>
                We preserve biographies, photographs, memories and records in thoughtful digital
                archives for families, leaders and organisations.
              </p>
            </div>
            <div>
              <strong>Explore</strong>
              <Link href="/services">Services</Link>
              <Link href="/how-it-works">How It Works</Link>
              <Link href="/case-studies">Our Work</Link>
              <Link href="/resources/family-legacy-checklist">Free Family Legacy Guide</Link>
              <Link href="/about">About</Link>
            </div>
            <div>
              <strong>Begin</strong>
              <Link href="/book-consultation">Book a Consultation</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
          <div className="wrap footer-bottom">
            <span>© {new Date().getFullYear()} LegacyHub Digital Heritage</span>
            <span>Digital Legacy Archives for Families, Leaders and Organisations.</span>
          </div>
        </footer>
        <PrivacyControls />
      </body>
    </html>
  );
}
