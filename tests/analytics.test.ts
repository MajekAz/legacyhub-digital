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
  vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
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
  vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '');
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
  const safePayload = {
    page_location: 'https://legacyhubdigital.com/contact',
    page_referrer: '',
    page_title: 'Contact',
  };
  expect(ga).toHaveBeenCalledWith('event', 'lead_form_submitted', safePayload);
  expect(ga).toHaveBeenCalledWith('event', 'form_submit', safePayload);
  expect(ga).toHaveBeenCalledWith('event', 'generate_lead', safePayload);
  expect(ga).toHaveBeenCalledWith('event', 'lead', safePayload);
  expect(meta).not.toHaveBeenCalled();
});
it('loads and configures GA4 once without automatic duplicate page views', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify({ analytics: true, marketing: false }),
  });
  let loaded = false;
  vi.stubGlobal('document', {
    title: 'Contact',
    getElementById: (id: string) => (id === 'lhd-ga' && loaded ? {} : null),
    head: {
      appendChild: (element: { id?: string }) => {
        loaded = element.id === 'lhd-ga';
        append(element);
      },
    },
    createElement: () => ({}),
  });
  initAnalytics();
  initAnalytics();
  expect(append).toHaveBeenCalledTimes(1);
  const commands = (window.dataLayer || []).map((command) =>
    Array.from(command as ArrayLike<unknown>),
  );
  expect(commands).toContainEqual([
    'config',
    'G-TEST123',
    expect.objectContaining({
      send_page_view: false,
      page_location: 'https://legacyhubdigital.com/contact',
    }),
  ]);
});
it('keeps lead-magnet attempts separate from confirmed GA4 conversions', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify({ analytics: true, marketing: false }),
  });
  track('lead_magnet_submit');
  expect(ga).toHaveBeenCalledWith('event', 'lead_magnet_submit', expect.anything());
  expect(ga).not.toHaveBeenCalledWith('event', 'generate_lead', expect.anything());
  ga.mockClear();
  track('lead_magnet_success');
  expect(ga).toHaveBeenCalledWith('event', 'form_submit', expect.anything());
  expect(ga).toHaveBeenCalledWith('event', 'generate_lead', expect.anything());
  expect(ga).toHaveBeenCalledWith('event', 'lead', expect.anything());
});
it('maps only successful submission events to Meta Lead', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify({ analytics: false, marketing: true }),
  });
  track('lead_form_started');
  expect(meta).toHaveBeenCalledWith(
    'trackCustom',
    'lead_form_started',
    expect.objectContaining({ utm_source: 'facebook' }),
  );
  meta.mockClear();
  track('lead_form_submitted');
  expect(meta).toHaveBeenCalledWith('track', 'Lead', expect.objectContaining({ page_title: 'Contact' }));
});
it('fires Meta Lead and CompleteRegistration only after checklist success', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => JSON.stringify({ analytics: false, marketing: true }),
  });
  track('lead_magnet_submit');
  expect(meta).toHaveBeenCalledWith(
    'trackCustom',
    'lead_magnet_submit',
    expect.objectContaining({ utm_source: 'facebook' }),
  );
  expect(meta).not.toHaveBeenCalledWith('track', 'Lead', expect.anything());
  meta.mockClear();
  track('lead_magnet_success');
  expect(meta).toHaveBeenCalledWith('track', 'Lead', expect.anything());
  expect(meta).toHaveBeenCalledWith('track', 'CompleteRegistration', expect.anything());
});
