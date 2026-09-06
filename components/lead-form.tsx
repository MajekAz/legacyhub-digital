'use client';
import { useRef, useState, useId } from 'react';
import Link from 'next/link';
import { categories, consentText, leadSchema, photoRanges, subjects } from '@/lib/lead-schema';
import { getAttribution } from '@/lib/attribution';
import { track } from '@/lib/analytics';
const projectTypes = [
  ['Personal Legacy Website', 'Legacy Starter'],
  ['Family Heritage Website', 'Family Heritage Archive'],
  ['Veteran or Leader Legacy Website', 'Complete Digital Legacy Archive'],
  ['Memorial / Tribute Website', 'Complete Digital Legacy Archive'],
  ['Organisation Heritage Website', 'Documentary & Heritage Project'],
  ['Bespoke Heritage Project', 'Documentary & Heritage Project'],
  ['Not Sure Yet', 'Not sure yet'],
] as const;
const projectMaterials = [
  ['Photographs', 'Photographs'],
  ['Documents', 'Documents'],
  ['Written Stories', 'Family stories'],
  ['Video', 'Videos'],
  ['Audio', 'Audio recordings'],
  ['Family Tree Information', 'Other'],
  ['Existing Website', 'Other'],
  ['Physical Archive', 'Other'],
  ['Not Sure', 'Other'],
] as const;
export function mapProjectDetails(
  projectType: string,
  selectedMaterials: string[],
  domainHostingStatus: string,
  message: string,
) {
  const serviceInterest = projectTypes.find(([label]) => label === projectType)?.[1] || '';
  const materialsAvailable = [
    ...new Set(
      selectedMaterials.flatMap((label) => {
        const value = projectMaterials.find(([name]) => name === label)?.[1];
        return value ? [value] : [];
      }),
    ),
  ];
  const context = [
    projectType && `Project type: ${projectType}`,
    selectedMaterials.length && `Materials selected: ${selectedMaterials.join(', ')}`,
    domainHostingStatus && `Domain / hosting status: ${domainHostingStatus}`,
  ]
    .filter(Boolean)
    .join('\n');
  return {
    serviceInterest,
    materialsAvailable,
    message: context ? `${message}${message ? '\n\n' : ''}${context}` : message,
  };
}
export function LeadForm({ type = 'consultation' }: { type?: 'consultation' | 'contact' }) {
  const id = useId();
  const requestId = useRef('');
  const submittedPayload = useRef('');
  const started = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const contact = type === 'contact';
  function field(
    name: string,
    label: string,
    options?: readonly string[],
    required = false,
    inputType = 'text',
  ) {
    const fieldId = `${id}-${name}`;
    return (
      <label className="field" key={name} htmlFor={fieldId}>
        {label}
        {required ? ' *' : ''}
        {options ? (
          <select
            id={fieldId}
            name={name}
            defaultValue={name === 'preferredContactMethod' ? 'Email' : ''}
            aria-invalid={!!errors[name]}
            aria-describedby={errors[name] ? `${fieldId}-error` : undefined}
          >
            <option value="">Please select</option>
            {options.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        ) : (
          <input
            id={fieldId}
            name={name}
            type={inputType}
            required={required}
            maxLength={name === 'email' ? 254 : name === 'phone' ? 40 : 100}
            autoComplete={
              { name: 'name', email: 'email', phone: 'tel', country: 'country-name' }[name]
            }
            aria-invalid={!!errors[name]}
            aria-describedby={errors[name] ? `${fieldId}-error` : undefined}
          />
        )}{' '}
        {errors[name] && (
          <span className="error" id={`${fieldId}-error`}>
            {errors[name]}
          </span>
        )}
      </label>
    );
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || success) return;
    setErrors({});
    setStatus('');
    const form = new FormData(event.currentTarget);
    const domainHostingStatus = String(form.get('domainHostingStatus') || '');
    const projectType = String(form.get('projectType') || '');
    const selectedMaterials = form.getAll('projectMaterials').map(String);
    const message = String(form.get('message') || '');
    form.delete('domainHostingStatus');
    form.delete('projectType');
    form.delete('projectMaterials');
    const projectDetails = mapProjectDetails(
      projectType,
      selectedMaterials,
      domainHostingStatus,
      message,
    );
    if (!requestId.current) requestId.current = crypto.randomUUID();
    const data = {
      ...Object.fromEntries(form),
      ...projectDetails,
      type,
      consent: form.get('consent') === 'on',
      ...getAttribution(),
      requestId: requestId.current,
    };
    const result = leadSchema.safeParse(data);
    if (!result.success) {
      const fields: Record<string, string> = {};
      for (const issue of result.error.issues) fields[String(issue.path[0])] = issue.message;
      setErrors(fields);
      setStatus('Please check the highlighted fields.');
      setTimeout(() => {
        const key = Object.keys(fields)[0];
        document.getElementById(`${id}-${key}`)?.focus();
      }, 0);
      return;
    }
    const fingerprint = JSON.stringify({ ...result.data, requestId: '' });
    if (submittedPayload.current && submittedPayload.current !== fingerprint)
      requestId.current = crypto.randomUUID();
    submittedPayload.current = fingerprint;
    setBusy(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.data, requestId: requestId.current }),
        signal: AbortSignal.timeout(18000),
      });
      const body = await res.json();
      if (!res.ok || !body.ok || !/^LHD-\d{4,}$/.test(body.leadId)) {
        setErrors(body.fields || {});
        throw new Error('unconfirmed');
      }
      setSuccess(true);
      setStatus(
        `Thank you. Your ${contact ? 'enquiry' : 'legacy consultation request'} has been received. We will contact you using your preferred contact method.\nReference: ${body.leadId}`,
      );
      track('lead_form_submitted');
    } catch {
      setStatus(
        'We could not confirm your enquiry just now. Please retry shortly. Your details remain in this form.',
      );
    } finally {
      setBusy(false);
      setTimeout(() => statusRef.current?.focus(), 0);
    }
  }
  return (
    <form
      className="lead-form"
      onSubmit={submit}
      onFocus={() => {
        if (!started.current) {
          started.current = true;
          track('lead_form_started');
        }
      }}
      noValidate
      aria-label={contact ? 'Contact enquiry' : 'Legacy consultation request'}
    >
      <p className="small">
        Fields marked * are required. Please do not include sensitive family documents or private
        archive material.
      </p>
      <fieldset disabled={busy || success}>
        <div className="form-grid">
          {field('name', 'Your name', undefined, true)}
          {field('email', 'Email', undefined, true, 'email')}
          {field('phone', 'Phone / WhatsApp', undefined, false, 'tel')}
          {field('country', 'Country')}
          {contact ? (
            field('category', 'Enquiry category', categories)
          ) : (
            <>
              {field('legacySubjectType', 'Whose legacy would you like to preserve?', subjects)}
              {field('subjectName', 'Name of person / family / organisation')}
              {field('livingStatus', 'Is the person:', ['Living', 'Late', 'Not applicable'])}
              {field('photoCountRange', 'Approximate photographs', photoRanges)}
            </>
          )}
          <fieldset className="full">
            <legend>What material do you currently have?</legend>
            <div className="checks">
              {projectMaterials.map(([label]) => (
                <label key={label}>
                  <input type="checkbox" name="projectMaterials" value={label} />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="field" htmlFor={`${id}-projectType`}>
            Project type
            <select id={`${id}-projectType`} name="projectType" defaultValue="">
              <option value="">Please select</option>
              {projectTypes.map(([label]) => (
                <option key={label}>{label}</option>
              ))}
            </select>
          </label>
          {field('domainHostingStatus', 'Do you already have a domain or hosting account?', [
            'I have both',
            'I have a domain only',
            'I have hosting only',
            'I have neither',
            'Not sure',
          ])}
          {field('preferredContactMethod', 'Preferred contact', ['WhatsApp', 'Email', 'Phone'])}
          <label className="field full" htmlFor={`${id}-message`}>
            {contact ? 'How can we help?' : 'Tell us about the legacy'}
            <textarea
              id={`${id}-message`}
              name="message"
              maxLength={2400}
              aria-invalid={!!errors.message}
            />
            {errors.message && <span className="error">{errors.message}</span>}
          </label>
          <div className="trap" aria-hidden="true">
            <label>
              Leave this blank
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="full">
            <label className="consent-label" htmlFor={`${id}-consent`}>
              <input
                id={`${id}-consent`}
                name="consent"
                type="checkbox"
                required
                aria-invalid={!!errors.consent}
                aria-describedby={`${id}-consent-help`}
              />
              <span>{consentText}</span>
            </label>
            <p className="small" id={`${id}-consent-help`}>
              Your enquiry is processed in our Google Workspace CRM.{' '}
              <Link className="text-link" href="/privacy">
                Read our privacy notice.
              </Link>
            </p>
            {errors.consent && <p className="error">{errors.consent}</p>}
          </div>
          <div className="full">
            <button className="button" type="submit">
              {busy
                ? 'Sending your enquiry…'
                : success
                  ? 'Request received'
                  : contact
                    ? 'Send My Enquiry'
                    : 'Start Your Legacy Website'}
            </button>
            <p className="small" style={{ marginTop: 12 }}>
              This requests a conversation; it does not reserve a calendar appointment or create a
              contract.
            </p>
          </div>
        </div>
      </fieldset>
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={status ? 'form-status' : ''}
      >
        {status}
      </div>
    </form>
  );
}
