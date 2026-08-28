import { readConsent } from './attribution';
type EventName =
  | 'page_view'
  | 'lead_form_started'
  | 'lead_form_submitted'
  | 'consultation_cta_click'
  | 'whatsapp_click'
  | 'case_study_click';
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      queue?: unknown[][];
      loaded?: boolean;
      version?: string;
      callMethod?: (...args: unknown[]) => void;
    };
  }
}
export function track(event: EventName) {
  if (typeof window === 'undefined') return;
  const consent = readConsent();
  const clean = {
    page_location: location.origin + location.pathname,
    page_referrer: '',
    page_title: document.title,
  };
  if (consent.analytics && process.env.NEXT_PUBLIC_GA_ID) window.gtag?.('event', event, clean);
  if (consent.marketing && process.env.NEXT_PUBLIC_META_PIXEL_ID) {
    if (event === 'page_view') window.fbq?.('track', 'PageView');
    else if (event === 'lead_form_submitted') window.fbq?.('track', 'Lead');
    else window.fbq?.('trackCustom', event);
  }
}
export function initAnalytics() {
  const c = readConsent();
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const meta = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (c.analytics && ga && /^G-[A-Z0-9]+$/.test(ga) && !document.getElementById('lhd-ga')) {
    window.dataLayer = window.dataLayer || [];
    // gtag requires an Arguments object in the dataLayer, per its command API.
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', ga, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: location.origin + location.pathname,
      page_referrer: '',
    });
    const s = document.createElement('script');
    s.id = 'lhd-ga';
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${ga}`;
    document.head.appendChild(s);
  }
  if (c.marketing && meta && /^\d+$/.test(meta) && !document.getElementById('lhd-meta')) {
    const fbq: NonNullable<Window['fbq']> = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue?.push(args);
    };
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    window.fbq = fbq;
    fbq('set', 'autoConfig', false, meta);
    fbq('init', meta);
    const s = document.createElement('script');
    s.id = 'lhd-meta';
    s.async = true;
    s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
  }
}
