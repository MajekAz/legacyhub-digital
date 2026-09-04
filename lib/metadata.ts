import type { Metadata } from 'next';
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      siteName: 'LegacyHub Digital Heritage',
      images: ['/og.png'],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
  };
}
