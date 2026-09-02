import type { MetadataRoute } from 'next';
import { campaigns } from '@/content/site';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '',
    '/services',
    '/how-it-works',
    '/who-we-serve',
    '/case-studies',
    '/case-studies/baba-muyi',
    '/packages',
    '/about',
    '/contact',
    '/book-consultation',
    '/privacy',
    '/terms',
    '/resources/family-legacy-checklist',
    ...Object.keys(campaigns).map((s) => `/landing/${s}`),
  ].map((path) => ({
    url: `https://legacyhubdigital.com${path}`,
    changeFrequency: 'monthly',
    priority: path ? 0.7 : 1,
  }));
}
