'use client';
import { useEffect, useRef, useState } from 'react';
const messages = {
  ready:
    'Confirm below to stop marketing emails from LegacyHub. This will not delete your original enquiry or affect a resource you requested.',
  processing: 'Updating your email preferences…',
  unsubscribed: 'You have been unsubscribed from marketing emails. Your preference has been saved.',
  already_unsubscribed: 'You are already unsubscribed from marketing emails.',
  invalid_token:
    'This unsubscribe link is invalid or no longer available. Please use the link in your email, or reply to that email for help.',
  temporary_error:
    'We could not confirm your preference just now. Please try again, or reply to the email for help.',
};
export function UnsubscribeForm() {
  const token = useRef('');
  const initialized = useRef(false);
  const revision = useRef(0);
  const pending = useRef<AbortController | null>(null);
  const [state, setState] = useState<keyof typeof messages>('ready');
  useEffect(() => {
    function cancelPending() {
      revision.current++;
      pending.current?.abort();
      pending.current = null;
    }
    function readFragment() {
      cancelPending();
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      const candidate = fragment.get('token') || '';
      const valid = fragment.getAll('token').length === 1 && /^[a-f0-9]{64}$/.test(candidate);
      token.current = valid ? candidate : '';
      setState(valid ? 'ready' : 'invalid_token');
      // replaceState does not emit hashchange: scrubbing must not erase the captured token.
      if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
    }
    // React Strict Mode replays effects after we have already scrubbed the fragment.
    if (!initialized.current || window.location.hash) readFragment();
    initialized.current = true;
    window.addEventListener('hashchange', readFragment);
    return () => {
      window.removeEventListener('hashchange', readFragment);
      cancelPending();
    };
  }, []);
  async function confirm() {
    if (!/^[a-f0-9]{64}$/.test(token.current)) {
      setState('invalid_token');
      return;
    }
    if (pending.current) return;
    const requestRevision = revision.current;
    setState('processing');
    const controller = new AbortController();
    pending.current = controller;
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.current }),
        cache: 'no-store',
        signal: controller.signal,
      });
      const result = await response.json();
      if (requestRevision !== revision.current) return;
      if (
        response.ok &&
        result.ok === true &&
        ['unsubscribed', 'already_unsubscribed'].includes(result.status)
      )
        setState(result.status);
      else setState(result.error === 'invalid_token' ? 'invalid_token' : 'temporary_error');
    } catch {
      if (requestRevision === revision.current) setState('temporary_error');
    } finally {
      clearTimeout(timer);
      if (pending.current === controller) pending.current = null;
    }
  }
  return (
    <>
      <p role="status" aria-live="polite">
        {messages[state]}
      </p>
      {['ready', 'temporary_error', 'processing'].includes(state) && (
        <button className="button" onClick={confirm} disabled={state === 'processing'}>
          {state === 'processing' ? 'Processing…' : 'Unsubscribe from marketing emails'}
        </button>
      )}
    </>
  );
}
