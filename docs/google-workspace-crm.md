# Google Workspace CRM integration

This branch implements the requested shared-secret JSON contract. No live Google resource or deployment has been created or tested during this change. All automated tests use local mocks. Do not deploy or send a real lead until the implementation has been reviewed and deployment authorised.

## 1. Create the private Google Sheet

Using the dedicated business Workspace account, create **LegacyHub Digital CRM**. Restrict sharing to authorised staff; do not publish the spreadsheet or enable public link access. Do not reuse any Baba Muyi resources. Copy the spreadsheet ID privately from its URL.

The `setupCrm` function creates these tabs and headers without clearing data:

- Leads
- Follow_Ups
- Proposals
- Projects
- Business_Profile
- System_Config
- Activity_Log

The exact headers are defined in `apps-script/Schema.gs` and listed in `docs/crm-schema.md`. The deployed 42-column contract is preserved in order. Three append-only fields record a lead-magnet subscriber's distinct optional marketing choice. Setup expands a new sheet to 45 columns and safely appends those three headers to a matching 42-column Leads sheet. Existing mismatched headers fail safely: do not rename or reorder them, and back up the sheet before running setup.

## 2. Create and configure Apps Script

Create a **new** Apps Script project under the business account. Add four script files and paste the corresponding repository contents:

- `Schema.gs`: schema, setup and header checks.
- `Security.gs`: shared-secret comparison, input validation and spreadsheet text escaping.
- `Main.gs`: JSON endpoint, safe lead counter, idempotency, score and follow-ups.
- `Notifications.gs`: optional emails and activity logging.

Enable showing the manifest in Project Settings and replace `appsscript.json` with the repository manifest. Remove unused default code. Review spreadsheet and send-mail scopes before authorising.

In **Project Settings → Script Properties**, add:

| Property                 | Required/value                                                             |
| ------------------------ | -------------------------------------------------------------------------- |
| CRM_SPREADSHEET_ID       | The new private Sheet ID                                                   |
| GOOGLE_CRM_SHARED_SECRET | A random secret of at least 32 characters, generated in a password manager |
| BUSINESS_NAME            | Verified sender display name, required for email                           |
| BUSINESS_REPLY_TO        | Verified business email, required for email                                |
| LEGACYHUB_LEADS_EMAIL    | Optional internal notification recipient                                   |
| EMAIL_ENABLED            | `false` initially; `true` after sender/recipient approval                  |
| FOLLOW_UP_DAYS           | Optional integer 1–365; omit to disable automatic follow-up creation       |

Run `setupCrm` manually and approve the reviewed permissions. It creates `LEAD_COUNTER=0` only for a new empty CRM. Never reset, delete or reconstruct this counter from row count. After restoring a backup, reconcile the counter with previously issued IDs before accepting requests. Generated-ID collisions fail without appending another lead. Gaps are acceptable if a write fails after allocating an ID.

Business_Profile and System_Config are reserved non-secret tables; they do not replace Script Properties. No secrets belong in Sheet cells or script source.

## 3. Deploy the Web App — only after approval

In **Deploy → New deployment → Web app** select **Execute as: Me** (the dedicated business owner). Server-to-server requests need an access mode permitting requests without interactive Google login, usually **Who has access: Anyone**. The handler then authenticates every POST using the secret before accessing Sheets. The spreadsheet itself stays private.

Use this only if Workspace policy permits it. If the necessary access option is unavailable, stop and arrange an approved alternative; do not bypass organisational policy. Never send Google OAuth tokens to the browser.

Copy the deployed `/exec` URL privately. Do not use `/dev`. After future script edits, deploy a new version through Manage deployments; saving source alone is insufficient. This contract replaces the earlier HMAC prototype: update the script and website together during an approved maintenance window, with no mixed-version traffic.

Google documents the [deployment model](https://developers.google.com/apps-script/guides/web) and [ContentService result redirects](https://developers.google.com/apps-script/guides/content). The website follows only a Google result redirect with a body-free GET and never replays the credential-bearing POST to another URL.

## 4. Connect Next.js

Create an ignored `.env.local` locally, or set secrets in the separate website host's server environment:

```dotenv
GOOGLE_CRM_WEBAPP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
GOOGLE_CRM_SHARED_SECRET=YOUR_RANDOM_SECRET_FROM_SCRIPT_PROPERTIES
```

These are placeholders; do not commit actual values. Restart the local development server after changing them. The server requires an HTTPS script.google.com `/exec` URL and a secret at least 32 characters long. Missing configuration fails closed; it does not prevent building the website.

`LEGACYHUB_LEADS_EMAIL` is optional, but actual notifications are sent by Apps Script: set its Script Property, not just the website variable. `NEXT_PUBLIC_BUSINESS_WHATSAPP` is optional and public; use a verified international number or leave blank to hide the link. Never add NEXT_PUBLIC_ to CRM variables.

## 5. Request and response contract

Server-to-server JSON only:

```json
{
  "secret": "SERVER_ONLY_SHARED_SECRET",
  "action": "createLead",
  "data": {
    "name": "Example",
    "email": "example@example.test",
    "...": "complete normalised CrmData"
  },
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

The data above is a structural illustration, not a full valid fixture. The website supplies the complete normalised `CrmData` shape from `lib/lead-schema.ts`: optional fields have empty defaults, materials is an array, `consent=true`, `consentVersion=2026-08-28-v1`, and source/type/category are included. The script independently validates data. Unknown fields are rejected.

The exact three-field `{secret, action, data}` shape is supported: without requestId, Apps Script generates a UUID. The website always supplies a stable requestId so it can retry safely. Direct callers must also supply one for retry protection; omitting it on repeat requests can create multiple leads.

Success: `{"ok":true,"leadId":"LHD-0001"}`.
Failure: `{"ok":false,"error":"internal_error"}` (invalid JSON envelope may return invalid_request).

Apps Script may return HTTP 200 for logical errors. Next.js validates both status and response structure, limits response bytes and times out after 12 seconds. The browser receives only a reference or a safe generic error, never the secret, endpoint, Sheet ID or Google error details. The shared secret is a reusable bearer credential transmitted only server-to-server over HTTPS; it is not a timestamped signature. Rotate it in both environments if exposed. Idempotency prevents duplicate writes, not credential replay by someone who possesses the secret.

## 6. Lead workflow

Under ScriptLock: check headers and request ID, compare a stable payload hash, allocate the counter, append lead, flush and log. Status is NEW, never automatically CONSULTATION_BOOKED. Initial score is 60 for consultation or 30 for contact, plus 10 each for phone, chosen service and available materials. Hot ≥80; Warm ≥50; otherwise Cold.

With valid FOLLOW_UP_DAYS, store Next_Follow_Up and append one Follow_Ups record (`FU-LHD-0001`, lead ID, due date, blank owner, PENDING, initial follow-up note). Follow-up failure is logged without losing the lead. Retrying the same request repairs a missing follow-up without duplicate leads. Email failures also do not reverse a saved lead. No general project/proposal automation is included.

When EMAIL_ENABLED is true and identity is configured, send a plain-text acknowledgement; send an internal notification if its recipient is configured. Record sent/failed/disabled outcomes in Activity_Log. Duplicate requests do not resend email. Interrupted or failed emails require manual review/retry; no durable email queue is implemented.

## 7. Exact first-live-lead test — after deployment approval

Use an authorised test spreadsheet and mailboxes you control before production. Do not use a real prospective customer's personal data.

1. Finish steps 1–4. Check all seven tabs, all 45 Leads headers, and `LEAD_COUNTER=0` for a genuinely new test CRM. Set FOLLOW_UP_DAYS=2 if testing follow-ups. Configure controlled sender/recipient addresses and enable email only if sending those messages is authorised.
2. Start `pnpm dev`. In a fresh browser session open:
   `http://127.0.0.1:3100/landing/diaspora-family-archive?utm_source=facebook&utm_medium=paid_social&utm_campaign=crm_live_smoke&utm_content=test_01&utm_term=heritage`
3. Accept **marketing & attribution** storage in Cookie preferences (analytics can remain off). Navigate internally to Book Consultation if desired. This tests persistence from the campaign landing page to the consultation page.
4. Enter name `LegacyHub Integration Test`; use a real email address you control; leave phone blank and preferred contact Email; country UK; subject Family; name `Integration Test Collection`; living status Not applicable; materials Photographs; photo range Under 50; service Family Heritage Archive; message `Authorised CRM integration test — not a customer enquiry`. Tick the enquiry consent checkbox and submit once.
5. Expect the success message and reference LHD-0001 on a new empty CRM, or the next counter value otherwise. A timeout is **not** proof of failure: inspect the Sheet and retry the unchanged form before creating a new submission.
6. Inspect Leads: exactly one matching row, NEW status, score 80 and Hot priority, consent true with timestamp/version, source Website consultation, correct source path, original landing path, all five UTM values and empty referrer for a direct URL visit. For a referral test, use a controlled external page and expect only its origin. No query strings should appear in page-path columns.
7. Inspect Follow_Ups: one FU-LHD reference, due approximately two days ahead, PENDING. Inspect Activity_Log for lead_created/saved, follow_up/created and configured email outcomes. Confirm acknowledgement and internal email in the controlled inboxes and check the public reference matches.
8. To test idempotency, use the browser Network panel's **Replay XHR** or **Edit and Resend** on the same website `/api/leads` request with the exact same JSON/requestId and Origin (browser support varies). Do not replay the Apps Script request or copy secrets into browser tools. Expect the same reference, no extra lead/follow-up/email. If the browser cannot replay, the automated tests cover this locally; do not claim live retry verification.
9. In another fresh session reject optional cookies and submit a second labelled test enquiry. Expect the next reference, no UTM/referrer history, and the current path only. Remove a consent checkbox or use an invalid email to verify no new row is created for invalid submissions.
10. Inspect browser network requests: the form calls only the website `/api/leads`; its JSON contains no CRM secret or Apps Script URL. Do not share HAR exports containing test contact details. Inspect server logs for metadata-only failure messages, never request bodies.
11. Record date, app commit, script deployment version, returned reference, row count, email outcomes and test results in a private acceptance log. Mark the test leads ARCHIVED or delete according to policy; never reset the counter. Do not advertise until the real production endpoint passes equivalent authorised checks.

## Limits and launch controls

The in-memory website rate limiter is defence in depth, not distributed protection. Configure a trusted edge/WAF before ads. Apps Script quotas, real concurrency, account permissions, email delivery and redirects still require live acceptance. Keep the spreadsheet and script restricted, approve retention/backup policies, and never log secrets or full enquiries. UTM history is deliberately absent when marketing consent is withheld.
