'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { getAttribution } from '@/lib/attribution';
import { track } from '@/lib/analytics';
import {
  leadSchema,
  LEAD_MAGNET_MARKETING_CONSENT_VERSION,
} from '@/lib/lead-schema';
import { familyLegacyChecklist } from '@/content/lead-magnets';

const captureSchema = z.object({
  firstName: z.string().trim().min(1, 'Please enter your first name.').max(60),
  lastName: z.string().trim().min(1, 'Please enter your last name.').max(60),
  email: z.string().trim().email('Please enter a valid email address.').max(254),
  country: z.string().trim().min(2, 'Please enter your country.').max(80),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((value) => !value || /^[+()\d\s.-]{7,40}$/.test(value), 'Please enter a valid phone number.'),
  consent: z.literal(true, { error: 'Please agree so we can deliver the checklist.' }),
  marketingConsent: z.boolean(),
  website: z.string().max(0),
});

export function LeadMagnetForm() {
  const id = useId();
  const router = useRouter();
  const requestId = useRef('');
  const started = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    track('lead_magnet_view');
  }, []);

  function field(name: 'firstName' | 'lastName' | 'email' | 'country' | 'phone', label: string, required = false, type = 'text') {
    const fieldId = `${id}-${name}`;
    return (
      <label className="field" htmlFor={fieldId}>
        {label}{required ? ' *' : ''}
        <input
          id={fieldId}
          name={name}
          type={type}
          required={required}
          maxLength={name === 'email' ? 254 : name === 'phone' ? 40 : name === 'country' ? 80 : 60}
          autoComplete={{ firstName: 'given-name', lastName: 'family-name', email: 'email', country: 'country-name', phone: 'tel' }[name]}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${fieldId}-error` : undefined}
        />
        {errors[name] && <span className="error" id={`${fieldId}-error`}>{errors[name]}</span>}
      </label>
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setErrors({});
    setStatus('');
    const form = new FormData(event.currentTarget);
    const capture = captureSchema.safeParse({
      firstName: form.get('firstName'),
      lastName: form.get('lastName'),
      email: form.get('email'),
      country: form.get('country'),
      phone: form.get('phone'),
      consent: form.get('consent') === 'on',
      marketingConsent: form.get('marketingConsent') === 'on',
      website: form.get('website'),
    });
    if (!capture.success) {
      const fields: Record<string, string> = {};
      for (const issue of capture.error.issues) fields[String(issue.path[0])] = issue.message;
      setErrors(fields);
      setStatus('Please check the highlighted fields.');
      setTimeout(() => document.getElementById(`${id}-${Object.keys(fields)[0]}`)?.focus(), 0);
      return;
    }
    if (!requestId.current) requestId.current = crypto.randomUUID();
    const payload = leadSchema.safeParse({
      requestId: requestId.current,
      type: 'lead_magnet',
      name: `${capture.data.firstName} ${capture.data.lastName}`,
      email: capture.data.email,
      phone: capture.data.phone,
      country: capture.data.country,
      category: familyLegacyChecklist.category,
      serviceInterest: 'Not sure yet',
      preferredContactMethod: 'Email',
      message: `Requested ${familyLegacyChecklist.title}.`,
      consent: true,
      marketingConsent: capture.data.marketingConsent,
      marketingConsentVersion: LEAD_MAGNET_MARKETING_CONSENT_VERSION,
      website: capture.data.website,
      ...getAttribution(),
    });
    if (!payload.success) {
      setStatus('Please check your details and try again.');
      return;
    }
    track('lead_magnet_submit');
    setBusy(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.data),
        signal: AbortSignal.timeout(18000),
      });
      const body = await response.json();
      if (!response.ok || !body.ok || !/^LHD-\d{4,}$/.test(body.leadId))
        throw new Error('unconfirmed');
      track('lead_magnet_success');
      router.push(familyLegacyChecklist.thankYouPath);
    } catch {
      setStatus('We could not confirm your request just now. Please retry shortly.');
      setBusy(false);
      setTimeout(() => statusRef.current?.focus(), 0);
    }
  }

  return (
    <form
      className="lead-form lead-magnet-form"
      id="checklist-form"
      onSubmit={submit}
      onFocus={() => {
        if (!started.current) {
          started.current = true;
          track('lead_magnet_form_start');
        }
      }}
      noValidate
      aria-label="Family Legacy Preservation Checklist request"
    >
      <p className="eyebrow">Get the free guide</p>
      <h2>Send me the checklist.</h2>
      <p className="small">Fields marked * are required. We do not ask for family records or private archive material here.</p>
      <fieldset disabled={busy}>
        <div className="form-grid">
          {field('firstName', 'First name', true)}
          {field('lastName', 'Last name', true)}
          {field('email', 'Email', true, 'email')}
          {field('country', 'Country', true)}
          <div className="full">{field('phone', 'WhatsApp / phone (optional)', false, 'tel')}</div>
          <div className="trap" aria-hidden="true">
            <label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <div className="full resource-consent">
            <label className="consent-label" htmlFor={`${id}-consent`}>
              <input id={`${id}-consent`} name="consent" type="checkbox" required aria-invalid={!!errors.consent} />
              <span>I agree that LegacyHub Digital Heritage may use my details to deliver the checklist and respond about this request. *</span>
            </label>
            {errors.consent && <p className="error">{errors.consent}</p>}
            <label className="consent-label" htmlFor={`${id}-marketingConsent`}>
              <input id={`${id}-marketingConsent`} name="marketingConsent" type="checkbox" />
              <span>I would also like occasional practical emails about preserving family history. This is optional, and I can unsubscribe at any time.</span>
            </label>
            <p className="small">We’ll send the guide and, only if you opt in above, occasional practical advice. Read our <Link className="text-link" href="/privacy">Privacy Policy</Link>.</p>
          </div>
          <div className="full">
            <button className="button" type="submit">{busy ? 'Sending your checklist…' : 'Send Me the Free Checklist'}</button>
          </div>
        </div>
      </fieldset>
      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true" className={status ? 'form-status' : ''}>{status}</div>
    </form>
  );
}
