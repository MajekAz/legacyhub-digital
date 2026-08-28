import { afterEach, beforeEach, it, expect, vi } from 'vitest';
import { track, initAnalytics } from '@/lib/analytics';
const ga = vi.fn();
const meta = vi.fn();
const append = vi.fn();
beforeEach(() => {
  ga.mockClear();
  meta.mockClear();
  append.mockClear();
  vi.stubGlobal('window', { gtag: ga, fbq: meta });
  vi.stubGlobal('location', new URL('https://legacyhubdigital.com/contact?utm_source=facebook'));
  vi.stubGlobal('document', {
    title: 'Contact',
    getElementById: () => null,
    head: { appendChild: append },
    createElement: () => ({}),
  });
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify({ analytics: false, marketing: false }),
  });
  vi.stubEnv('NEXT_PUBLIC_GA_ID', 'G-TEST123');
  vi.stubEnv('NEXT_PUBLIC_META_PIXEL_ID', '12345');
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
it('never sends analytics or loads scripts before consent', () => {
  track('lead_form_submitted');
  initAnalytics();
  expect(ga).not.toHaveBeenCalled();
  expect(meta).not.toHaveBeenCalled();
  expect(append).not.toHaveBeenCalled();
});
it('requires configuration even after consent', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify({ analytics: true, marketing: true }),
  });
  vi.stubEnv('NEXT_PUBLIC_GA_ID', '');
  vi.stubEnv('NEXT_PUBLIC_META_PIXEL_ID', '');
  track('lead_form_submitted');
  initAnalytics();
  expect(ga).not.toHaveBeenCalled();
  expect(meta).not.toHaveBeenCalled();
  expect(append).not.toHaveBeenCalled();
});
it('keeps GA and marketing permissions separate and strips URL queries', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify({ analytics: true, marketing: false }),
  });
  track('lead_form_submitted');
  expect(ga).toHaveBeenCalledWith('event', 'lead_form_submitted', {
    page_location: 'https://legacyhubdigital.com/contact',
    page_referrer: '',
    page_title: 'Contact',
  });
  expect(meta).not.toHaveBeenCalled();
});
it('maps only successful submission events to Meta Lead', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify({ analytics: false, marketing: true }),
  });
  track('lead_form_started');
  expect(meta).toHaveBeenCalledWith('trackCustom', 'lead_form_started');
  meta.mockClear();
  track('lead_form_submitted');
  expect(meta).toHaveBeenCalledWith('track', 'Lead');
});
