import type { Metadata } from 'next';

export const legacyHubSocialDescription =
  'Complete, done-for-you digital heritage websites for families, individuals, leaders, veterans and organisations — built around your stories and launched on your own domain and hosting.';

export const legacyHubSocialImage = {
  url: '/og-done-for-you-v2.png',
  width: 1200,
  height: 630,
  alt: 'LegacyHub Digital Heritage social preview showing “Turn Your Memories Into a Beautiful Website” and a complete done-for-you digital heritage website offer.',
};

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
      images: [legacyHubSocialImage],
    },
    twitter: { card: 'summary_large_image', title, description, images: [legacyHubSocialImage.url] },
  };
}
