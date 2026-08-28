export const ATTRIBUTION_KEY = 'lhd-attribution-v1';
export const CONSENT_KEY = 'lhd-consent-v1';
export type Consent = { analytics: boolean; marketing: boolean };
export type Attribution = {
  sourcePage: string;
  landingPage: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
};
export function safePath(value: string) {
  try {
    return (
      new URL(value, 'https://legacyhubdigital.com').pathname
        .replace(/[^a-zA-Z0-9/_-]/g, '')
        .slice(0, 250) || '/'
    );
  } catch {
    return '/';
  }
}
export function fromLocation(href: string, referrer: string): Attribution {
  const url = new URL(href);
  let origin = '';
  try {
    origin = new URL(referrer).origin;
  } catch {}
  const param = (name: string) =>
    (url.searchParams.get(name) || '').replace(/[\u0000-\u001f]/g, '').slice(0, 120);
  return {
    sourcePage: safePath(href),
    landingPage: safePath(href),
    referrer: origin,
    utmSource: param('utm_source'),
    utmMedium: param('utm_medium'),
    utmCampaign: param('utm_campaign'),
    utmContent: param('utm_content'),
    utmTerm: param('utm_term'),
  };
}
export function readConsent(): Consent {
  try {
    const c = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
    return { analytics: c?.analytics === true, marketing: c?.marketing === true };
  } catch {
    return { analytics: false, marketing: false };
  }
}
export function getAttribution(): Attribution {
  const empty = fromLocation(location.origin + location.pathname, '');
  if (!readConsent().marketing) return empty;
  try {
    const saved = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (saved) return { ...JSON.parse(saved), sourcePage: safePath(location.href) };
    const fresh = fromLocation(location.href, document.referrer);
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(fresh));
    return fresh;
  } catch {
    return fromLocation(location.href, document.referrer);
  }
}
