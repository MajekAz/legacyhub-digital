import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import { fromLocation, getAttribution, CONSENT_KEY, ATTRIBUTION_KEY } from '@/lib/attribution';
import { whatsappUrl } from '@/lib/whatsapp';
import { allowRequest } from '@/lib/rate-limit.server';
const storage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) || null,
    setItem: (key: string, value: string) => data.set(key, value),
    removeItem: (key: string) => data.delete(key),
  };
};
beforeEach(() => {
  vi.stubGlobal('localStorage', storage());
  vi.stubGlobal('sessionStorage', storage());
  vi.stubGlobal('document', { referrer: 'https://facebook.com/feed?private=hidden' });
  vi.stubGlobal(
    'location',
    new URL(
      'https://legacyhubdigital.com/landing/family-legacy?utm_source=facebook&utm_medium=paid_social&utm_campaign=family',
    ),
  );
});
afterEach(() => vi.unstubAllGlobals());
it('captures campaign values and strips referrer query and paths', () => {
  expect(fromLocation(location.href, document.referrer)).toMatchObject({
    utmSource: 'facebook',
    utmMedium: 'paid_social',
    referrer: 'https://facebook.com',
    landingPage: '/landing/family-legacy',
  });
});
it('does not persist or submit campaign history without consent', () => {
  expect(getAttribution().utmSource).toBe('');
  expect(sessionStorage.getItem(ATTRIBUTION_KEY)).toBeNull();
});
it('preserves first-touch attribution across internal navigation', () => {
  localStorage.setItem(CONSENT_KEY, JSON.stringify({ marketing: true }));
  getAttribution();
  vi.stubGlobal(
    'location',
    new URL('https://legacyhubdigital.com/book-consultation?utm_source=other'),
  );
  expect(getAttribution()).toMatchObject({
    sourcePage: '/book-consultation',
    landingPage: '/landing/family-legacy',
    utmSource: 'facebook',
  });
});
it('works when browser storage is blocked', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => {
      throw Error('blocked');
    },
  });
  expect(getAttribution().utmSource).toBe('');
});
it('hides missing or invalid WhatsApp configuration', () => {
  expect(whatsappUrl(undefined)).toBeNull();
  expect(whatsappUrl('not-a-number')).toBeNull();
  expect(whatsappUrl('+44 1234567890')).toContain('https://wa.me/441234567890?text=');
});
it('rate limits expire', () => {
  expect(allowRequest('test-bucket', 1, 100)).toBe(true);
  expect(allowRequest('test-bucket', 1, 101)).toBe(false);
  expect(allowRequest('test-bucket', 1, 60101)).toBe(true);
});
