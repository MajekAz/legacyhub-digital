# Family Legacy Preservation Checklist funnel

## Funnel architecture

`/resources/family-legacy-checklist` is the paid-social landing page. Its low-friction form posts to the existing `/api/leads` Route Handler, which validates the request and forwards it through the existing authenticated Apps Script integration to the private Google Sheets CRM. A confirmed CRM response redirects the visitor to `/thank-you/family-legacy-checklist`; the download CTA points to `/downloads/LegacyHub_Family_Legacy_Preservation_Guide.pdf`.

The approved 18-page PDF is stored at `public/downloads/LegacyHub_Family_Legacy_Preservation_Guide.pdf`. The earlier `/downloads/family-legacy-checklist` route redirects to this stable production asset.

The reusable funnel definition lives in `content/lead-magnets.ts`. Add future lead magnets as new typed configurations and dedicated routes; do not duplicate CRM clients or create a parallel lead store.

## CRM contract and deployment order

Lead-magnet submissions use:

- `Enquiry_Type`: `lead_magnet`
- `Enquiry_Category`: `Family Legacy Checklist`
- `Service_Interest`: `Not sure yet`
- `Source`: `Facebook` or `Instagram` when the consented first-touch `utm_source` matches; otherwise `Lead Magnet`
- `Source_Page`: `/resources/family-legacy-checklist`

The append-only Leads migration adds `Marketing_Consent`, `Marketing_Consent_At` and `Marketing_Consent_Version`. Existing consultation and contact submissions do not send these fields.

Deploy in this order:

1. Back up the CRM spreadsheet.
2. Paste the updated Apps Script files.
3. Run `setupCrm()` once to append and verify the three new headers.
4. Deploy a new Apps Script Web App version.
5. Verify an existing contact submission still succeeds.
6. Deploy the website changes.
7. Submit one checklist QA lead with explicit optional-email consent off, then one with it on.

Never place the CRM URL or shared secret in a public environment variable.

## Consent and nurture activation

Checklist delivery consent is required. Optional practical follow-up is a separate unchecked checkbox and is stored independently. No nurture scheduler or paid email provider is activated by this implementation.

Before automation is enabled, the business must approve:

- sender identity, reply-to address and footer details;
- unsubscribe handling and suppression-list ownership;
- the lawful basis, retention period and final privacy wording;
- send timing and timezone behavior;
- whether Apps Script, Google Workspace or an approved email platform will send the sequence.

## Five-email nurture sequence

### Email 1 — Immediate

**Subject:** Your Family Legacy Preservation Checklist

Hello {{first_name}},

Thank you for requesting The Family Legacy Preservation Checklist. Use it as a calm starting point rather than a task you need to finish at once.

Begin with one box, album or family member. Mark what you already have, note what needs context, and leave anything uncertain for a later conversation.

**CTA:** Download Your Checklist — `https://legacyhubdigital.com/downloads/LegacyHub_Family_Legacy_Preservation_Guide.pdf`

### Email 2 — Day 2

**Subject:** The stories photographs cannot tell by themselves

A photograph becomes much more useful when someone records the names, date, place and reason the moment mattered. Without that context, future generations may recognise faces but not understand the story.

Choose ten photographs and write what you know about each. If something is missing, note the relative who may know more.

**CTA:** Choose 10 photographs and write what you know about each.

### Email 3 — Day 4

**Subject:** 5 family stories worth recording while you can

Consider asking about childhood, migration, work or career, marriage and family life, community history, and the lessons a relative most wants younger generations to remember.

One thoughtful conversation is enough for today. Ask one question, listen carefully and record the answer only with permission.

**CTA:** Ask one relative one meaningful question today.

### Email 4 — Day 7

**Subject:** From scattered memories to a family archive

A family archive can bring photographs, biographies, documents, timelines, audio, video, family trees and important places into one organised record. The purpose is to give the material context, permissions and a structure future relatives can understand.

LegacyHub works with the material a family already has and agrees the scope before work begins.

**CTA:** See How LegacyHub Works — `https://legacyhubdigital.com/how-it-works`

### Email 5 — Day 10

**Subject:** Would you like help preserving your family story?

You do not need a complete collection or a finished plan. Families can begin with a few photographs, a written memory, an interview idea or a box of documents that needs organising.

If you would like help understanding the right starting point, request a conversation with LegacyHub Digital Heritage.

**CTA:** Book a Legacy Consultation — `https://legacyhubdigital.com/book-consultation`

Every nurture email must include the approved sender identity and a working unsubscribe mechanism before activation.

## Analytics and Meta preparation

No pixel loads without marketing consent and a valid `NEXT_PUBLIC_META_PIXEL_ID`. No event contains names, email addresses, phone numbers or enquiry text.

- `lead_magnet_view` → Meta `ViewContent`
- `lead_magnet_form_start` → custom event
- `lead_magnet_submit` → custom attempt event
- `lead_magnet_success` → Meta `Lead`
- `lead_magnet_success` → Meta `CompleteRegistration`
- `lead_magnet_download` → custom event
- `consultation_cta_click` → consultation-intent custom event

`Lead` fires only after `/api/leads` returns a valid `LHD-` reference.
