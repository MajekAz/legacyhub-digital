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
    eyebrow: 'Free family legacy guide',
    title: 'Preserve the stories your family should never lose.',
    description:
      'Download our practical Family Legacy Preservation Checklist and discover the photographs, documents, memories and stories worth organising for future generations.',
    backgroundImage: '/images/heroes/family-legacy.jpg',
    backgroundPosition: 'center 40%',
    primaryCta: { label: 'Get the Free Checklist', href: '#checklist-form' },
    minHeight: '70vh',
    overlay: 0.62,
    credit: {
      label: 'Family portrait · Library of Congress · No known restrictions',
      href: 'https://www.loc.gov/pictures/item/2017736954/',
    },
  },
} as const satisfies LeadMagnet;
