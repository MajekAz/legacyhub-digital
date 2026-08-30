# Google Workspace CRM implementation report

## Status

Implemented locally on `feature/google-workspace-crm` in the LegacyHub repository. No commit, push, merge, Google deployment or live lead submission was performed. Main and Baba Muyi were not modified. Google Workspace setup and first-live-lead acceptance remain manual and unverified.

## Changed files

- `app/api/leads/route.ts`: require the actual JSON content type, preserving all validation, consent, honeypot, safe errors and no-store behaviour.
- `lib/crm-client.server.ts`: requested `{secret, action, data}` contract plus stable requestId, validated endpoint, safe Google redirect, 12-second timeout and streamed response size limit.
- `apps-script/Main.gs`: matching contract, optional direct-caller UUID, canonical payload hashing, counter collision/exhaustion checks, idempotent configured follow-up creation/recovery.
- `apps-script/Schema.gs`: expand new sheets to fit the 42-column schema; verify column capacity.
- `apps-script/Security.gs`: validate the server shared secret and request ID before lead data or Sheet access.
- `tests/lead.test.ts`, `tests/apps-script.test.ts`: contract, redirect, secret rejection, counter, sheet capacity and follow-up coverage.
- `README.md`, `docs/architecture.md`, `docs/crm-schema.md`, `docs/deployment.md`, `docs/google-workspace-crm.md`, `docs/handover.md`, `docs/testing.md`, this report: setup, contract, branch and operational documentation. The previous handover is marked historical.

Deploy all four Apps Script files together: Main.gs, Schema.gs, Security.gs, **Notifications.gs**. Notifications.gs and appsscript.json were retained unchanged; configured acknowledgement/internal email behaviour is covered by tests.

## Schema and lead flow

All seven requested tabs and all 35 requested Leads columns remain intact. Seven existing appended fields store enquiry category, consent evidence and duplicate-request protection. The initializer does not silently migrate mismatched existing headers.

Website form → POST /api/leads → Zod/consent/abuse checks → server-only authenticated Google request → ScriptLock/counter → Leads NEW row → optional Follow_Ups row → optional emails and Activity_Log. IDs are allocated centrally, not derived from row count. No Supabase or duplicate CRM is used. UTM/source/landing/referrer handling retains the existing marketing-consent boundary.

## Required configuration

Website server: `GOOGLE_CRM_WEBAPP_URL`, `GOOGLE_CRM_SHARED_SECRET`.
Optional: `LEGACYHUB_LEADS_EMAIL`, `NEXT_PUBLIC_BUSINESS_WHATSAPP`.

Apps Script Properties: `CRM_SPREADSHEET_ID`, matching `GOOGLE_CRM_SHARED_SECRET`; optional `FOLLOW_UP_DAYS`, `BUSINESS_NAME`, `BUSINESS_REPLY_TO`, `LEGACYHUB_LEADS_EMAIL`, `EMAIL_ENABLED`. Setup creates the persistent LEAD_COUNTER. Email recipient settings must be configured in the script, not only on the website.

## Manual Google steps and exact acceptance procedure

Follow [google-workspace-crm.md](google-workspace-crm.md), sections 1–7. It specifies creating the private Sheet and four script files, script properties, setupCrm, permissions and approved Web App deployment, environment connection and an eleven-step first-live-lead procedure.

The acceptance fixture is labelled `LegacyHub Integration Test`, uses an inbox the operator controls and the campaign `crm_live_smoke`. Verify one lead, the public reference, NEW/80/Hot, consent evidence, all five UTMs, correct paths, configured follow-up, emails and activity. Replay the same website request to verify no duplicate lead/follow-up/email. Test denied marketing consent separately. Never reset the counter when cleaning test data. Actual Google delivery has not been verified by this task.

## Validation

- pnpm typecheck: PASS.
- pnpm lint: PASS.
- pnpm test: PASS, 80 tests across six files, no live Google dependency.
- pnpm build: blocked by local Turbopack `binding to a port: Operation not permitted`, including escalated/bundled-runtime retries. This default build is **not** reported as passing.
- pnpm build --webpack: PASS, complete production compilation, types and page generation.
- git diff --check: PASS.
- Browser asset scan found no CRM environment-variable names or Apps Script endpoint string.

The Node runtime emits a module.register deprecation warning in test/build tooling; it did not fail the passing checks. No live email, Google redirect, Workspace quota or real concurrency verification is claimed.

## Security and rollout notes

The secret travels only server-to-server over HTTPS and is never returned to visitors. Google result redirects are followed with a body-free GET to the permitted Google host; credential-bearing POST redirects are not replayed. Treat the secret as a reusable bearer credential and rotate both environments if exposed. Idempotency is not a replacement for authentication or production rate limiting.

Keep Sheets private and restrict script editors. Respect Workspace policy; do not weaken account controls if anonymous Web App ingress is unavailable. Configure an edge/WAF for public POST rate limits before ads; the local in-memory limiter is not distributed. Email failures require manual review/retry; there is no durable queue. Deploy script and website together because the old HMAC prototype is no longer the accepted contract. No deployment is authorised by this report.
