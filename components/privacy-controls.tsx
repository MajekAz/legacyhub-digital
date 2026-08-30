'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ATTRIBUTION_KEY,
  CONSENT_KEY,
  getAttribution,
  readConsent,
  type Consent,
} from '@/lib/attribution';
import { initAnalytics, track } from '@/lib/analytics';
export function PrivacyControls() {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const timer = setTimeout(() => {
      const c = readConsent();
      setAnalytics(c.analytics);
      setMarketing(c.marketing);
      try {
        setOpen(!localStorage.getItem(CONSENT_KEY));
      } catch {
        setOpen(true);
      }
      initAnalytics();
      getAttribution();
      track('page_view');
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const target = (event.target as Element)?.closest?.('[data-event]');
      const name = target?.getAttribute('data-event');
      if (
        name === 'consultation_cta_click' ||
        name === 'case_study_click' ||
        name === 'whatsapp_click'
      )
        track(name);
    };
    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  }, []);
  function save(c: Consent) {
    const before = readConsent();
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
      if (!c.marketing) sessionStorage.removeItem(ATTRIBUTION_KEY);
    } catch {}
    setOpen(false);
    if ((before.analytics && !c.analytics) || (before.marketing && !c.marketing)) {
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim();
        if (name.startsWith('_ga') || name === '_fbp' || name === '_fbc') {
          for (const domain of ['', location.hostname, '.legacyhubdigital.com'])
            document.cookie = `${name}=; Max-Age=0; Path=/;${domain ? ` Domain=${domain};` : ''} SameSite=Lax`;
        }
      }
      location.reload();
      return;
    }
    initAnalytics();
    getAttribution();
    track('page_view');
  }
  return (
    <>
      <div className="privacy-controls-link">
        <button className="quiet-button" onClick={() => setOpen(true)}>
          Cookie preferences
        </button>
      </div>
      {open && (
        <section className="consent-bar" aria-label="Cookie preferences">
          <strong>Your story. Your choices.</strong>
          <p>
            We use essential storage to remember your choices. Optional analytics help improve the
            site; marketing consent allows campaign attribution and, if configured, Meta tracking.{' '}
            <Link className="text-link" href="/privacy">
              Privacy details
            </Link>
          </p>
          <div className="checks">
            <label>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
              Analytics
            </label>
            <label>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              Marketing & attribution
            </label>
          </div>
          <div className="actions">
            <button
              className="button secondary"
              onClick={() => save({ analytics: false, marketing: false })}
            >
              Reject optional
            </button>
            <button className="button secondary" onClick={() => save({ analytics, marketing })}>
              Save choices
            </button>
            <button className="button" onClick={() => save({ analytics: true, marketing: true })}>
              Accept optional
            </button>
          </div>
        </section>
      )}
    </>
  );
}
