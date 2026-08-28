import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { it, expect } from 'vitest';
import { LeadForm } from '@/components/lead-form';
import { campaigns } from '@/content/site';
import Home from '@/app/page';
import CaseStudy from '@/app/case-studies/baba-muyi/page';
import Privacy from '@/app/privacy/page';
import Terms from '@/app/terms/page';
import { pageMetadata } from '@/lib/metadata';
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
    'Preserve a Life.',
    'Connect Generations.',
    'Tioluwalase',
    'Legacy Starter',
    'Your questions',
  ])
    expect(html).toContain(copy);
  expect(html).not.toContain('wa.me');
});
it('case study uses only an external archive link and clear notice', () => {
  const html = renderToStaticMarkup(<CaseStudy />);
  expect(html).toContain('https://tioluwalasemajekodunmi.com');
  expect(html).toContain('independent family archive in a new tab');
});
it('all five campaigns have audience-specific content and FAQs', () => {
  expect(Object.keys(campaigns)).toHaveLength(5);
  for (const c of Object.values(campaigns)) {
    expect(c.problem.length).toBeGreaterThan(40);
    expect(c.benefit.length).toBeGreaterThan(40);
    expect(c.question).toBeTruthy();
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
