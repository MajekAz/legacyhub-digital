import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { it, expect } from 'vitest';
import { LeadForm } from '@/components/lead-form';
import { campaigns } from '@/content/site';
import Home from '@/app/page';
import CaseStudy from '@/app/case-studies/baba-muyi/page';
import Privacy from '@/app/privacy/page';
import Terms from '@/app/terms/page';
import { pageMetadata } from '@/lib/metadata';
import { StructuredData, PageStructuredData } from '@/components/structured-data';
import Resources from '@/app/resources/page';
import { pageHeroes } from '@/content/heroes';
import { familyLegacyChecklist } from '@/content/lead-magnets';
it('renders every consultation field and accessible consent', () => {
  const html = renderToStaticMarkup(<LeadForm />);
  for (const name of [
    'name',
    'email',
    'phone',
    'country',
    'legacySubjectType',
    'subjectName',
    'livingStatus',
    'materialsAvailable',
    'photoCountRange',
    'serviceInterest',
    'preferredContactMethod',
    'message',
    'consent',
    'website',
  ])
    expect(html).toContain(`name="${name}"`);
  expect(html).toContain('aria-live="polite"');
  expect(html).toContain('Book My Legacy Consultation');
});
it('contact has an enquiry category', () => {
  expect(renderToStaticMarkup(<LeadForm type="contact" />)).toContain('Partnership');
});
it('homepage contains primary positioning, proof, packages and FAQs', () => {
  const html = renderToStaticMarkup(<Home />);
  for (const copy of [
    'Preserve a life.',
    'Connect generations.',
    'Start Your Legacy Project',
    'Thoughtfully created. Personally meaningful.',
    'Family trees &amp; relationships',
    'Nothing is published until',
    'Care is part of the work.',
    'Tioluwalase',
    'The material that makes a life recognisable.',
    'A heritage preservation studio',
    'Free family legacy guide',
    'Preserve the stories your family should never lose.',
    'Get the Free Guide',
  ])
    expect(html).toContain(copy);
  expect(html).not.toContain('wa.me');
});
it('links the resources hub from desktop, mobile and footer navigation', () => {
  const layout = readFileSync('app/layout.tsx', 'utf8');
  const resourcePath = '/resources/family-legacy-checklist';
  expect(layout.match(new RegExp('href="/resources"', 'g'))).toHaveLength(3);
  expect(layout.match(new RegExp(resourcePath, 'g'))).toHaveLength(1);
  expect(layout.indexOf('Our Work')).toBeLessThan(layout.indexOf('Resources'));
  expect(layout.indexOf('Resources')).toBeLessThan(layout.indexOf('About'));
  expect(layout).toContain('Free Family Legacy Guide');
});
it('case study uses only an external archive link and clear notice', () => {
  const html = renderToStaticMarkup(<CaseStudy />);
  expect(html).toContain('https://tioluwalasemajekodunmi.com');
  expect(html).toContain('independent family archive in a new tab');
  expect(html).toContain('The preservation approach');
  expect(html).toContain('The material');
  expect(html).toContain('The structure');
});
it('all five campaigns have audience-specific content and FAQs', () => {
  expect(Object.keys(campaigns)).toHaveLength(5);
  for (const c of Object.values(campaigns)) {
    expect(c.problem.length).toBeGreaterThan(40);
    expect(c.benefit.length).toBeGreaterThan(40);
    expect(c.question).toBeTruthy();
  }
});
it('defines a unique, complete photographic hero for every major public route', () => {
  const heroes = Object.entries(pageHeroes);
  expect(heroes).toHaveLength(15);
  expect(new Set(heroes.map(([, hero]) => hero.title)).size).toBe(heroes.length);
  expect(new Set(heroes.map(([, hero]) => hero.backgroundImage)).size).toBe(heroes.length);

  for (const [route, hero] of heroes) {
    expect(route).toMatch(/^\//);
    expect(hero.eyebrow.length).toBeGreaterThan(5);
    expect(hero.description.length).toBeGreaterThan(60);
    expect(hero.primaryCta.label).toBeTruthy();
    expect(hero.credit.href).toMatch(/^https:\/\/www\.loc\.gov\//);
    expect(existsSync(join(process.cwd(), 'public', hero.backgroundImage))).toBe(true);
  }
});
it('legal drafts transparently disclose review status', () => {
  for (const Page of [Privacy, Terms])
    expect(renderToStaticMarkup(<Page />)).toContain('Pre-launch review draft');
});
it('page metadata has a page-specific canonical and complete social images', () => {
  expect(pageMetadata('Family', 'Description', '/landing/family-legacy')).toMatchObject({
    alternates: { canonical: '/landing/family-legacy' },
    openGraph: { title: 'Family', images: ['/og.png'] },
    twitter: { card: 'summary_large_image', images: ['/og.png'] },
  });
});
it('publishes a useful resources hub with contextual internal links', () => {
  const html = renderToStaticMarkup(<Resources />);
  expect(html).toContain('<h1>Practical guidance for preserving your family story.</h1>');
  for (const path of ['/resources/family-legacy-checklist', '/services', '/how-it-works', '/book-consultation'])
    expect(html).toContain(`href="${path}"`);
});
it('emits valid, factual organization and page structured data', () => {
  for (const html of [
    renderToStaticMarkup(<StructuredData />),
    renderToStaticMarkup(<PageStructuredData title="Services" description="Description" path="/services" kind="Service" breadcrumbs={[["Home", "/"], ["Services", "/services"]]} faq={[["Visible question?", "Visible answer."]]} />),
  ]) {
    const json = html.match(/<script type="application\/ld\+json">(.*)<\/script>/)?.[1];
    expect(() => JSON.parse(json || '')).not.toThrow();
    expect(html).not.toContain('streetAddress');
    expect(html).not.toContain('aggregateRating');
  }
});
it('gives every campaign unique search metadata and substantive page copy', () => {
  expect(new Set(Object.values(campaigns).map(c => c.seoTitle)).size).toBe(5);
  for (const campaign of Object.values(campaigns)) {
    expect(campaign.seoTitle.length).toBeLessThanOrEqual(45);
    expect(campaign.seoDescription.length).toBeGreaterThan(100);
    expect(campaign.seoDescription.length).toBeLessThanOrEqual(165);
  }
  const source = readFileSync('app/landing/[slug]/page.tsx', 'utf8');
  expect(source).toContain('{c.problem}');
  expect(source).toContain('{c.benefit}');
});
it('defines the checklist funnel with the approved production PDF', () => {
  expect(familyLegacyChecklist.landingPath).toBe('/resources/family-legacy-checklist');
  expect(familyLegacyChecklist.thankYouPath).toBe('/thank-you/family-legacy-checklist');
  expect(familyLegacyChecklist.downloadPath).toBe(
    '/downloads/LegacyHub_Family_Legacy_Preservation_Guide.pdf',
  );
  const pdf = readFileSync(
    'public/downloads/LegacyHub_Family_Legacy_Preservation_Guide.pdf',
  );
  expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  expect(pdf.byteLength).toBeGreaterThan(1_000_000);
});
