import type { HeroContent } from './heroes';

export type LeadMagnet = {
  slug: string;
  title: string;
  subtitle: string;
  category: 'Family Legacy Checklist';
  landingPath: string;
  thankYouPath: string;
  downloadPath: string;
  hero: HeroContent;
};

export const familyLegacyChecklist = {
  slug: 'family-legacy-checklist',
  title: 'The Family Legacy Preservation Checklist',
  subtitle:
    '25 things every family should preserve before photographs, memories and stories are lost.',
  category: 'Family Legacy Checklist',
  landingPath: '/resources/family-legacy-checklist',
  thankYouPath: '/thank-you/family-legacy-checklist',
  downloadPath: '/downloads/LegacyHub_Family_Legacy_Preservation_Guide.pdf',
  hero: {
    eyebrow: 'Free Family Legacy Guide',
    title:
      'Start preserving your family story — and discover what your legacy website could become.',
    description:
      'Get our free Family Legacy Preservation Checklist to identify the photographs, documents, memories and stories worth protecting. When you’re ready, LegacyHub can turn your approved material into a complete, done-for-you digital heritage website on your own hosting account and custom domain.',
    ownershipStatement: 'Your story. Your domain. Your hosting. Your legacy.',
    backgroundImage: '/images/heroes/family-legacy.jpg',
    backgroundPosition: 'center 40%',
    primaryCta: { label: 'Get the Free Guide', href: '#checklist-form' },
    secondaryCta: { label: 'Explore Done-for-You Legacy Websites', href: '/services' },
    minHeight: '70vh',
    overlay: 0.62,
    credit: {
      label: 'Family portrait · Library of Congress · No known restrictions',
      href: 'https://www.loc.gov/pictures/item/2017736954/',
    },
  },
} as const satisfies LeadMagnet;
