import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { it, expect } from 'vitest';
import { LeadForm } from '@/components/lead-form';
import { campaigns } from '@/content/site';
import Home from '@/app/page';
import CaseStudy from '@/app/case-studies/baba-muyi/page';
import Privacy from '@/app/privacy/page';
import Terms from '@/app/terms/page';
import { pageMetadata } from '@/lib/metadata';
import { pageHeroes } from '@/content/heroes';
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
  ])
    expect(html).toContain(copy);
  expect(html).not.toContain('wa.me');
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
it('page metadata has a page-specific canonical and clears inherited images', () => {
  expect(pageMetadata('Family', 'Description', '/landing/family-legacy')).toMatchObject({
    alternates: { canonical: '/landing/family-legacy' },
    openGraph: { title: 'Family', images: [] },
    twitter: { images: [] },
  });
});
