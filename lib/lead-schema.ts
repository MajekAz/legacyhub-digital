import { z } from 'zod';
export const subjects = [
  'Parent',
  'Grandparent',
  'Family',
  'Traditional/community leader',
  'Veteran/professional',
  'Business founder',
  'Organisation',
  'Other',
] as const;
export const services = [
  'Legacy Starter',
  'Family Heritage Archive',
  'Complete Digital Legacy Archive',
  'Documentary & Heritage Project',
  'Not sure yet',
] as const;
export const materials = [
  'Photographs',
  'Documents',
  'Videos',
  'Audio recordings',
  'Written biography',
  'Family stories',
  'Other',
] as const;
export const categories = [
  'General enquiry',
  'Legacy project',
  'Partnership',
  'Media/documentary',
  'Technical',
  'Other',
  'Family Legacy Checklist',
] as const;
export const photoRanges = ['Under 50', '50–200', '200–500', 'More than 500', 'Not sure'] as const;
export const consentText =
  'I agree to be contacted about my legacy archive enquiry and understand that submitting this form does not create a contract or obligation.';
export const CONSENT_VERSION = '2026-08-28-v1';
export const LEAD_MAGNET_MARKETING_CONSENT_VERSION = '2026-08-31-v1';
const short = (max = 120) => z.string().trim().max(max).default('');
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal('')]).default('');
const path = z
  .string()
  .max(250)
  .regex(/^\/[a-zA-Z0-9/_-]*$/)
  .or(z.literal(''))
  .default('');
export const leadSchema = z
  .object({
    requestId: z.uuid(),
    type: z.enum(['consultation', 'contact', 'lead_magnet']),
    name: z.string().trim().min(2, 'Please enter your name.').max(100),
    email: z
      .string()
      .trim()
      .email('Please enter a valid email address.')
      .max(254)
      .transform((v) => v.toLowerCase()),
    phone: short(40).refine(
      (v) => !v || /^[+()\d\s.-]{7,40}$/.test(v),
      'Please enter a valid phone number.',
    ),
    country: short(80),
    legacySubjectType: optionalEnum(subjects),
    subjectName: short(150),
    livingStatus: optionalEnum(['Living', 'Late', 'Not applicable']),
    materialsAvailable: z.array(z.enum(materials)).max(7).default([]),
    photoCountRange: optionalEnum(photoRanges),
    serviceInterest: optionalEnum(services),
    preferredContactMethod: z.enum(['WhatsApp', 'Email', 'Phone']).default('Email'),
    category: optionalEnum(categories),
    message: short(3000),
    consent: z.literal(true, { error: 'Please agree to be contacted about your enquiry.' }),
    marketingConsent: z.boolean().optional(),
    marketingConsentVersion: z.literal(LEAD_MAGNET_MARKETING_CONSENT_VERSION).optional(),
    website: z.string().max(0).default(''),
    sourcePage: path,
    landingPage: path,
    referrer: short(250).refine(
      (v) => !v || /^https?:\/\/[^/?#]+\/?$/.test(v),
      'Invalid referrer.',
    ),
    utmSource: short(),
    utmMedium: short(),
    utmCampaign: short(),
    utmContent: short(),
    utmTerm: short(),
  })
  .strict()
  .superRefine((v, ctx) => {
    if (v.preferredContactMethod !== 'Email' && !v.phone)
      ctx.addIssue({
        code: 'custom',
        path: ['phone'],
        message: 'Add a phone number for phone or WhatsApp contact.',
      });
    if (v.type === 'lead_magnet') {
      if (v.category !== 'Family Legacy Checklist')
        ctx.addIssue({ code: 'custom', path: ['category'], message: 'Invalid resource category.' });
      if (v.serviceInterest !== 'Not sure yet')
        ctx.addIssue({ code: 'custom', path: ['serviceInterest'], message: 'Invalid resource interest.' });
      if (typeof v.marketingConsent !== 'boolean' || !v.marketingConsentVersion)
        ctx.addIssue({ code: 'custom', path: ['marketingConsent'], message: 'Please confirm your email preference.' });
    } else if (v.marketingConsent !== undefined || v.marketingConsentVersion !== undefined) {
      ctx.addIssue({ code: 'custom', path: ['marketingConsent'], message: 'Unexpected marketing preference.' });
    }
  });
export type LeadInput = z.infer<typeof leadSchema>;
export type CrmData = Omit<LeadInput, 'website' | 'requestId'> & {
  consentVersion: string;
  source: string;
};
