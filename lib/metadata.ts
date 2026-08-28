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
      images: [],
    },
    twitter: { card: 'summary', title, description, images: [] },
  };
}
