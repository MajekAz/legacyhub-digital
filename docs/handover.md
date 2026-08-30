> Historical foundation report. The shared-secret CRM contract and live setup procedure now supersede the HMAC prototype described below; see google-workspace-crm.md.

# Phase 1 handover — 28 August 2026

## 1. Architecture

Independent Next.js 16.3.3 App Router / React / TypeScript / Tailwind / Zod application. Node.js Route Handler is the only public lead ingress. Root `app/` follows the generated scaffold convention. The separate optional Sites adapter is retained but not deployed or validated as a production target. The intended production target remains a new Hostinger Node application. No Supabase, website admin CRM, archive authentication, ecommerce or checkout was created.

## 2. Page structure

17 public pages: `/`, `/services`, `/how-it-works`, `/who-we-serve`, `/case-studies`, `/case-studies/baba-muyi`, `/packages`, `/about`, `/contact`, `/book-consultation`, `/privacy`, `/terms`, and five `/landing/` pages: `family-legacy`, `diaspora-family-archive`, `memorial-archive`, `leaders-and-veterans`, `organisations`.

The API is `POST /api/leads`. Additional generated routes serve the icon, robots and sitemap. Unknown campaigns return 404. The requested route list contains 12 core pages, not 13 as initially estimated.

## 3. Files created

See [file inventory](files.md). Primary entry points: `app/page.tsx`, `app/layout.tsx`, `app/api/leads/route.ts`, `components/lead-form.tsx`, `content/site.ts`, `lib/lead-schema.ts`, `lib/crm-client.server.ts` and `apps-script/Main.gs`.

All files are inside the new `/Users/optiscale/Documents/web/legacyhub-digital` checkout. No files in Baba Muyi repositories were modified. No existing database, secrets, hosting settings, private media or family archive content were imported. The supplied brief is preserved in `docs/brief.txt`.

## 4. Google Sheets schema

Seven tabs with stable headers: Leads, Follow_Ups, Proposals, Projects, Business_Profile, System_Config, Activity_Log. All 35 proposed Leads columns are preserved in order, with seven additional fields for enquiry type/category, consent and retry protection. See [schema](crm-schema.md). No spreadsheet has yet been created in Google Workspace.

## 5. Apps Script integration

Versioned JSON action `createLead`; timestamped HMAC-SHA256 authentication; five-minute replay window; strict success response checking. Central LHD-0001 IDs use ScriptLock and a persistent counter. UUID idempotency and payload hashes protect identical retries. Schema mismatch fails safely. User-controlled spreadsheet values are escaped against formula injection.

## 6. Lead flow

Native form → same-origin API → Zod validation/consent/honeypot/size checks → local rate checks → server-signed request → Apps Script → private Leads tab → optional emails/activity log. Browser receives only the public reference on success. Secrets and the CRM endpoint are absent from browser code. Failures produce a generic retry message and preserve entered form values in the current page.

## 7. Consultation form

All requested fields and options are implemented, including materials, photo volume, service interest, preferred contact and exact enquiry consent wording. Phone/WhatsApp preference requires a phone number. Contact uses the same endpoint and CRM with an enquiry category. No calendar booking is implied. No file uploads or sensitive archive collection are enabled.

## 8. Campaign pages

Five focused pages with specific audience messaging, problem/outcome, capabilities, flagship proof, process, FAQ, consultation form and optional WhatsApp. Main-site navigation is hidden on campaign pages. Memorial copy avoids pressure or urgency claims. No invented prices or testimonials.

## 9. Attribution

UTM source/medium/campaign/content/term, first landing path and referrer origin are retained in tab session storage only with marketing consent. Original attribution is not overwritten during internal navigation. Source_Page reflects the current form path. Without consent, no campaign history or referrer is submitted. Lead information is never placed in URLs by the website.

## 10. Meta/advertising readiness

Consent-gated placeholders for GA4 and Meta Pixel; requested events are prepared. Meta Lead fires only after confirmed CRM persistence. No accounts, ads or tracking IDs are configured. Real-provider network checks, account configuration and legal approval are launch gates; no claim of live attribution or ad delivery is made.

## 11. WhatsApp

`NEXT_PUBLIC_BUSINESS_WHATSAPP` must contain a verified international number. Missing/invalid values hide the CTA. A dignified pre-filled enquiry message and whatsapp_click event are prepared. No number was invented.

## 12. Email

Optional plain-text lead acknowledgement and internal notification run in Apps Script after saving. Verified business name, reply-to, recipient and EMAIL_ENABLED are required. Failures log an outcome without reversing the saved lead. No marketing automation or queued retry worker is included.

## 13. SEO

Unique page metadata and canonicals, sitemap, robots, root social preview card, generated LH icon and static WebSite/Service structured data. Individual pages explicitly define their own social text and clear inherited images. No fake ratings, address, pricing or performance claims. Natural family, African heritage and diaspora relevance is reflected in content.

## 14. Privacy and compliance

Explicit pre-launch privacy/terms review drafts; consent choices default off. Google Workspace processing, communication, attribution, retention and rights are discussed without inventing a retention period or legal entity. This is not legal advice or a compliance certification. Final policies and verified privacy contact are mandatory before public lead collection.

## 15. Validation results

- `pnpm lint`: PASS, no warnings/errors in the final run.
- `pnpm test`: PASS, 60 tests across six files.
- `pnpm typecheck`: PASS.
- `pnpm build`: PASS; all requested public routes generated and dynamic lead endpoint built.
- `pnpm test:routes`: PASS for 17 public pages, sitemap, robots, social image, API method rejection and unknown campaign rejection against the local development server.
- `pnpm audit --prod`: no known production dependency vulnerabilities reported at check time.
- Compiled browser asset scan: no CRM secret-variable names, endpoint-variable names or Apps Script endpoint string found.
- `git diff --check` and staged whitespace check: recorded at the local checkpoint.

The image card was visually inspected. Website browser interaction/visual accessibility QA, live Workspace delivery, real concurrent Google writes, email delivery and real-provider tracking were not performed. Unit/HTTP tests do not replace these launch checks.

## 16. Environment variables

`.env.example` contains GOOGLE_CRM_WEBAPP_URL, GOOGLE_CRM_SHARED_SECRET, LEGACYHUB_LEADS_EMAIL, NEXT_PUBLIC_BUSINESS_WHATSAPP, NEXT_PUBLIC_GA_ID and NEXT_PUBLIC_META_PIXEL_ID. No real secrets are present. Script Properties are listed separately in the CRM setup guide. Production CRM URL and secret are validated at request time; missing configuration fails closed while allowing builds.

## 17. Workspace manual setup

Create a separate private spreadsheet and Apps Script project; add Script Properties; run setupCrm; review access/scopes; deploy a versioned Web App if organisation policy permits; configure website server variables; test with a separate test sheet; verify IDs, columns, emails and permissions. Full instructions: [Google Workspace CRM](google-workspace-crm.md).

## 18. Deployment checklist

New GitHub remote, separate Hostinger application, verified Node/runtime support, host-supplied DNS records, SSL, server secrets, trusted edge rate limiting, business email identity, legal approval, real tracking/consent validation and production acceptance. See [deployment checklist](deployment.md). Nothing was pushed, merged, deployed or connected to DNS. Suggested GitHub repository has not been created or verified. Local branch: feature/foundation.

## 19. Suggested PR

**Title:** feat: establish LegacyHub Digital Heritage platform

**Body:**

Establish the independent LegacyHub Digital Heritage commercial website with 17 public pages, audience landing pages, branded consultation/contact forms and a secure Next.js-to-Google Workspace CRM contract. Include Apps Script lead numbering, duplicate protection, stable Sheets schema, optional notifications, consent-aware attribution, metadata and deployment documentation.

Validation: typecheck, lint, 60 mocked tests, Next.js production build, local route checks and production dependency audit passed. No live Google Sheet or advertising account was used.

Launch remains gated on Workspace setup, business/legal details, trusted edge abuse controls, Hostinger/DNS/SSL configuration and live browser/integration checks. No Baba Muyi repository or infrastructure changes. No push or deployment included.

## 20. Recommended Phase 2

First complete the manual production launch gates. Then consider reliable queued CRM/email retries, staff follow-up reminders, versioned consent audit/retention automation and a contributor intake workflow. Calendar scheduling can be added with explicit booking semantics. Add approved case-study imagery and evidence only with permission. A future CRM dashboard should read the Google CRM, not introduce a duplicate sales database. Meta Conversions API or additional advertising tools require separate consent and privacy review.
