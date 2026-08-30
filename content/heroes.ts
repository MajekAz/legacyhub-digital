export type HeroAction = {
  label: string;
  href: string;
  external?: boolean;
  event?: 'consultation_cta_click' | 'case_study_click';
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  trustLine?: string;
  backgroundImage: string;
  backgroundPosition?: string;
  imageBrightness?: number;
  primaryCta: HeroAction;
  secondaryCta?: HeroAction;
  minHeight?: string;
  overlay?: number;
  alignment?: 'left' | 'center';
  credit: {
    label: string;
    href: string;
  };
};

export const pageHeroes = {
  '/': {
    eyebrow: 'Digital heritage & legacy archives',
    title: 'Preserve a life. Protect a story. Connect generations.',
    description:
      'LegacyHub Digital Heritage creates professionally designed digital archives for families, leaders and organisations — preserving biographies, photographs, memories, documents and multimedia for future generations.',
    trustLine: 'Thoughtfully created. Personally meaningful. Built around your story.',
    backgroundImage: '/images/archive-family-portrait.jpg',
    backgroundPosition: 'center 34%',
    imageBrightness: 1.07,
    primaryCta: {
      label: 'Start Your Legacy Project',
      href: '/book-consultation',
      event: 'consultation_cta_click',
    },
    secondaryCta: {
      label: 'View a Real Archive',
      href: '/case-studies/baba-muyi',
      event: 'case_study_click',
    },
    minHeight: '76vh',
    overlay: 0.6,
    credit: {
      label: 'Family portrait, circa 1900 · Library of Congress · No known restrictions',
      href: 'https://www.loc.gov/pictures/item/99472450/',
    },
  },
  '/services': {
    eyebrow: 'Our services',
    title: 'Turn scattered records into a story that lasts.',
    description:
      'From biography development and archive organisation to documentary material and dedicated heritage websites, every service is shaped around your collection.',
    backgroundImage: '/images/heroes/services-archives.jpg',
    backgroundPosition: 'center 54%',
    imageBrightness: 1.15,
    primaryCta: { label: 'Explore Our Services', href: '#services' },
    secondaryCta: {
      label: 'Start Your Legacy Project',
      href: '/book-consultation',
      event: 'consultation_cta_click',
    },
    credit: {
      label: 'Historical records at the National Archives · Library of Congress',
      href: 'https://www.loc.gov/pictures/item/2011633908/',
    },
  },
  '/how-it-works': {
    eyebrow: 'Our approach',
    title: 'Your story, shaped through a thoughtful process.',
    description:
      'We guide you from the first conversation through collection, curation, design and delivery, with permissions and family review built into each stage.',
    backgroundImage: '/images/heroes/how-it-works-reading.jpg',
    backgroundPosition: 'center 42%',
    primaryCta: { label: 'See How It Works', href: '#process' },
    secondaryCta: {
      label: 'Book a Legacy Consultation',
      href: '/book-consultation',
      event: 'consultation_cta_click',
    },
    credit: {
      label: 'A reader with a family volume · Library of Congress',
      href: 'https://www.loc.gov/pictures/item/98518743/',
    },
  },
  '/who-we-serve': {
    eyebrow: 'Who we serve',
    title: 'Every legacy begins with people.',
    description:
      'We work with families, leaders, veterans, founders, communities and organisations preserving the experiences that connect one generation to the next.',
    backgroundImage: '/images/heroes/who-we-serve-family.jpg',
    backgroundPosition: 'center 38%',
    primaryCta: { label: 'Discover Who We Help', href: '#audiences' },
    secondaryCta: {
      label: 'Discuss Your Archive',
      href: '/book-consultation',
      event: 'consultation_cta_click',
    },
    credit: {
      label: 'Family gathered at home · Library of Congress',
      href: 'https://www.loc.gov/pictures/item/2017760163/',
    },
  },
  '/case-studies': {
    eyebrow: 'Our work',
    title: 'See what a digital legacy can become.',
    description:
      'Explore how photographs, memories, biography and documentary records can become one coherent archive, created with context and care.',
    backgroundImage: '/images/heroes/case-studies-family.jpg',
    backgroundPosition: 'center 42%',
    primaryCta: { label: 'View Our Work', href: '#featured-archive' },
    secondaryCta: {
      label: 'Start Your Legacy Project',
      href: '/book-consultation',
      event: 'consultation_cta_click',
    },
    credit: {
      label: 'Family portrait on a lawn · Library of Congress',
      href: 'https://www.loc.gov/pictures/item/99472441/',
    },
  },
  '/case-studies/baba-muyi': {
    eyebrow: 'Flagship case study',
    title: 'The Tioluwalase Majekodunmi Family Archive',
    description:
      'A family story preserved through biography, photographs, memories and lessons, with a meaningful connection to the generations that follow.',
    backgroundImage: '/images/heroes/baba-muyi-case-study.jpg',
    backgroundPosition: 'center 31%',
    primaryCta: {
      label: 'Explore the Live Archive',
      href: 'https://tioluwalasemajekodunmi.com',
      external: true,
      event: 'case_study_click',
    },
    secondaryCta: {
      label: 'Start Your Legacy Project',
      href: '/book-consultation',
      event: 'consultation_cta_click',
    },
    overlay: 0.72,
    credit: {
      label: 'Illustrative documentary family photograph · Library of Congress',
      href: 'https://www.loc.gov/pictures/item/2013651295/',
    },
  },
  '/packages': {
    eyebrow: 'Service packages',
    title: 'Choose the right beginning for your legacy.',
    description:
      'Four consultation-based service levels provide a starting point. Your final scope reflects the story, material and production care your archive needs.',
    backgroundImage: '/images/heroes/packages-portrait.jpg',
    backgroundPosition: 'center 35%',
    primaryCta: { label: 'Compare Service Levels', href: '#packages' },
    secondaryCta: {
      label: 'Request a Tailored Quote',
      href: '/book-consultation',
      event: 'consultation_cta_click',
    },
    credit: {
      label: 'Documentary portrait · Library of Congress',
      href: 'https://www.loc.gov/pictures/item/2023630594/',
    },
  },
  '/about': {
    eyebrow: 'About LegacyHub Digital Heritage',
    title: 'Care for the story. Respect for the people.',
    description:
      'We combine careful story development, archive organisation and considered digital design to preserve real lives and shared histories.',
    backgroundImage: '/images/heroes/about-heritage-work.jpg',
    backgroundPosition: 'center 50%',
    primaryCta: { label: 'See How We Work', href: '/how-it-works' },
    secondaryCta: {
      label: 'Start Your Legacy Project',
      href: '/book-consultation',
      event: 'consultation_cta_click',
    },
    credit: {
      label: 'Documentary office interior · Library of Congress',
      href: 'https://www.loc.gov/pictures/item/2011635822/',
    },
  },
  '/contact': {
    eyebrow: 'Contact the studio',
    title: 'Let’s begin with what you have in mind.',
    description:
      'Ask about a family archive, organisational history, partnership or documentary project. We will respond using your preferred contact method.',
    backgroundImage: '/images/heroes/contact-family.jpg',
    backgroundPosition: 'center 28%',
    primaryCta: { label: 'Send an Enquiry', href: '#contact-form' },
    secondaryCta: {
      label: 'Book a Legacy Consultation',
      href: '/book-consultation',
      event: 'consultation_cta_click',
    },
    credit: {
      label: 'Mother and children, family archive photograph · Library of Congress',
      href: 'https://www.loc.gov/pictures/item/2021650590/',
    },
  },
  '/book-consultation': {
    eyebrow: 'Start your legacy project',
    title: 'Tell us about the story you want to preserve.',
    description:
      'You do not need a finished plan or an organised collection. A few details will help us understand the right place to begin.',
    backgroundImage: '/images/heroes/book-consultation.jpg',
    backgroundPosition: 'center 34%',
    primaryCta: {
      label: 'Begin Your Consultation',
      href: '#consultation-form',
      event: 'consultation_cta_click',
    },
    secondaryCta: { label: 'See How It Works', href: '/how-it-works' },
    credit: {
      label: 'Father and child with family material · Library of Congress',
      href: 'https://www.loc.gov/pictures/item/2010647928/',
    },
  },
  '/landing/family-legacy': {
    eyebrow: 'For parents, grandparents & families',
    title: 'Keep their stories close. For every generation.',
    description:
      'Bring scattered photographs, letters and memories together in a family archive that gives future generations context, connection and a way to remember.',
    backgroundImage: '/images/heroes/family-legacy.jpg',
    backgroundPosition: 'center 40%',
    primaryCta: {
      label: 'Discuss Your Family Archive',
      href: '#consultation',
      event: 'consultation_cta_click',
    },
    secondaryCta: { label: 'View a Real Archive', href: '/case-studies/baba-muyi' },
    credit: {
      label: 'Family portrait · Library of Congress · No known restrictions',
      href: 'https://www.loc.gov/pictures/item/2017736954/',
    },
  },
  '/landing/diaspora-family-archive': {
    eyebrow: 'For African diaspora families',
    title: 'Different countries. One family story.',
    description:
      'Reconnect photographs and memories with the people who know their meaning, creating a digital link to home across countries and generations.',
    backgroundImage: '/images/heroes/diaspora-family.jpg',
    backgroundPosition: 'center 34%',
    primaryCta: {
      label: 'Connect Your Family Story',
      href: '#consultation',
      event: 'consultation_cta_click',
    },
    secondaryCta: { label: 'See How It Works', href: '/how-it-works' },
    credit: {
      label: 'Multigenerational family group · Library of Congress',
      href: 'https://www.loc.gov/pictures/item/2010647808/',
    },
  },
  '/landing/memorial-archive': {
    eyebrow: 'A thoughtful space for remembrance',
    title: 'A life remembered, in its own fullness.',
    description:
      'Preserve the humour, values, work and everyday moments behind a life in a dignified archive, created at a pace that feels right for your family.',
    backgroundImage: '/images/heroes/memorial-archive.jpg',
    backgroundPosition: 'center 27%',
    primaryCta: {
      label: 'Preserve Their Story',
      href: '#consultation',
      event: 'consultation_cta_click',
    },
    secondaryCta: { label: 'Understand the Process', href: '/how-it-works' },
    overlay: 0.7,
    credit: {
      label: 'Historical portrait · Library of Congress',
      href: 'https://www.loc.gov/pictures/item/94512281/',
    },
  },
  '/landing/leaders-and-veterans': {
    eyebrow: 'For leaders, veterans & professionals',
    title: 'Honour a life of service. Preserve its lessons.',
    description:
      'Give speeches, photographs, documents and personal accounts the context they need to become a dignified record of contribution.',
    backgroundImage: '/images/heroes/leaders-veterans.jpg',
    backgroundPosition: 'center 24%',
    primaryCta: {
      label: 'Discuss a Legacy of Service',
      href: '#consultation',
      event: 'consultation_cta_click',
    },
    secondaryCta: { label: 'Explore Our Services', href: '/services' },
    credit: {
      label: 'Unidentified Civil War veteran · Library of Congress',
      href: 'https://www.loc.gov/pictures/item/2017659692/',
    },
  },
  '/landing/organisations': {
    eyebrow: 'For communities & organisations',
    title: 'Your shared history deserves a lasting home.',
    description:
      'Bring the story of your association, faith community, business or institution into an organised digital heritage archive.',
    backgroundImage: '/images/heroes/organisations.jpg',
    backgroundPosition: 'center 49%',
    primaryCta: {
      label: 'Build Your Organisation’s Archive',
      href: '#consultation',
      event: 'consultation_cta_click',
    },
    secondaryCta: { label: 'Explore Our Services', href: '/services' },
    credit: {
      label: 'Historical documents at the National Archives · Library of Congress',
      href: 'https://www.loc.gov/pictures/item/2016876642/',
    },
  },
} as const satisfies Record<string, HeroContent>;

export type HeroRoute = keyof typeof pageHeroes;
