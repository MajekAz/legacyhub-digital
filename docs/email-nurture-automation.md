# Family guide email nurture — implementation awaiting approval

Nothing in this implementation activates production automation. Do not deploy, run production setup, add a trigger, or send live QA emails without separate approval.

## Architecture and boundaries

The existing lead form, `/api/leads`, attribution, Meta tracking, consent payload, lead ID counter, follow-ups and PDF remain unchanged. Apps Script still saves the lead under its script lock. Eligible new guide leads receive a deterministic queue row; the same request cannot create a second row. A retry can repair a missing enrolment, but rechecks the saved consent first. No migration/backfill of historical leads is performed.

`notifyLead` replaces only the lead-magnet acknowledgement with the requested guide delivery. Contact/consultation acknowledgement and internal notification content are preserved. `EMAIL_FROM_NAME` and `EMAIL_REPLY_TO` override the existing `BUSINESS_NAME` and `BUSINESS_REPLY_TO`; otherwise existing settings work. MailApp sends as the authorized Google account: these properties do not select an arbitrary From address.

Email 1 is transactional, with the approved PDF link, and is allowed with marketing consent FALSE. Existing `EMAIL_ENABLED=true` and sender configuration remain required. Disabled email or a mail failure is logged; the saved lead still succeeds. Existing acknowledgement behaviour is at-most-one attempt per newly created request, with no automatic delivery retries. A successful MailApp call is not proof of inbox delivery. Review failures/bounces manually.

Emails 2–5 require a literal boolean TRUE in the saved `Marketing_Consent` cell, a matching recipient, a lead-magnet enquiry, an ACTIVE queue row, no unsubscribe timestamp and no normalized-address suppression. These checks run for every due send. Missing/false/text consent or a changed recipient pauses the row; no consent evidence is rewritten. Paused records are never automatically reactivated. Only the Family Legacy Checklist category enrols.

## New tabs

Existing Leads columns are unchanged. `setupCrm()` creates missing tabs, initializes only empty tabs and verifies existing headers; it never deletes or renames tabs or edits lead records. Existing legacy Leads header migration remains as before.

**Email_Nurture** (15 columns):

`Nurture_ID, Lead_ID, Email, Sequence, Status, Enrolled_At, Next_Email_Number, Next_Send_At, Last_Email_Number, Last_Sent_At, Unsubscribed_At, Completed_At, Last_Error, Updated_At, Unsubscribe_Token`

ID: `NUR-LHD-0010`; sequence: `family-legacy-v1`. Status: ACTIVE, PAUSED, UNSUBSCRIBED, COMPLETED or FAILED. ISO UTC timestamps. The final column holds a private, random bearer token formed from two UUIDs (hyphens removed). Restrict access to this sheet and never export tokens into analytics, logs or shared reports.

**Email_Suppression**:

`Email, Lead_ID, Reason, Suppressed_At, Source`

Address comparison trims and lowercases. Suppression applies across nurture records and future requests for that address, irrespective of a subsequent checked consent box. Removing suppression requires a separately approved manual process with fresh evidence; never do it as a routine retry. Transactional resource requests are not blocked by marketing suppression.

**Email_Send_Log**:

`Send_ID, Lead_ID, Email_Number, Status, Claimed_At, Sent_At`

ID: `NUR-LHD-0010-E2`. A CLAIMED entry is flushed before sending, then changed to SENT after MailApp returns. Keep this ledger indefinitely for the operational lifetime of the sequence (subject to an approved retention policy); deleting it may permit duplicates.

## Schedule and quota protection

One time-driven trigger runs `processEmailNurtureQueue()`, never one trigger per lead.

| Email | Earliest day | Subject                                           |
| ----- | -----------: | ------------------------------------------------- |
| 1     |   On request | Your Family Legacy Preservation Guide             |
| 2     |            2 | The stories photographs cannot tell by themselves |
| 3     |            4 | 5 family stories worth recording                  |
| 4     |            7 | From scattered memories to a family archive       |
| 5     |           10 | Would you like help preserving your family story? |

Day offsets use UTC elapsed time from enrolment. If a run is late, subsequent emails retain at least the intended 2/3-day gap after the actual previous send, avoiding a catch-up burst. Email 5 marks completion. Templates live in `apps-script/EmailTemplates.gs`; Email 3 groups values/life lessons with challenges/turning points to cover all requested topics in five prompts.

The processor requires both `NURTURE_ENABLED=true` and `EMAIL_ENABLED=true`. Defaults: sending OFF; batch 10. `NURTURE_BATCH_SIZE` accepts integers 1–25. Each run stops starting work after 45 seconds or the batch limit. It reserves five remaining recipients for other email activity and defers before claiming a send when quota is low. Google quotas are shared and can change; see [MailApp quota API](<https://developers.google.com/apps-script/reference/mail/mail-app#getRemainingDailyQuota()>) and [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas). These are safeguards for modest volume, not a bulk-email platform.

The processor holds the script lock while checking/sending/writing, serializing it with lead saves and unsubscribe. Keep batches small: a slow send can briefly delay form or unsubscribe requests, which return safe retryable errors. Shared-account activity can still consume quota between checks. Manual spreadsheet edits do not participate in ScriptLock; pause the processor before operational edits.

## Retry and recovery — no exactly-once claim

Sheets and MailApp cannot atomically commit email delivery together. This implementation favours avoiding duplicates over automatic retry:

- A SENT ledger entry advances stale queue state without sending again.
- A CLAIMED entry is ambiguous: a timeout/crash may have happened before or after delivery. It must never automatically resend. The row becomes FAILED on the next attempt; inspect Google execution/mail evidence before deciding recovery.
- A post-send write failure may leave FAILED even with SENT in the ledger. After review, restore ACTIVE with the original email number/due date; the ledger repairs progress without resending.
- For CLAIMED, establish actual delivery first. If confirmed sent, mark its ledger SENT with the verified sent time, then reactivate for repair. If delivery is unknown, leave FAILED. Only if definitely not sent and separately authorized may an operator remove that one claim and reactivate. Do not clear the entire ledger.
- PAUSED due to consent/suppression must not be reactivated as technical recovery. Resolve the permission issue through an approved process first.
- An enrolment failure logs `nurture_failed/enrolment_requires_review` without losing the lead. Investigate schema/configuration and the saved consent; avoid bulk backfills. Replaying the original unchanged request can repair a missing row but does not resend Email 1.
- Monitor both Activity_Log and Apps Script failed executions. Activity logging itself is best-effort; an unavailable log cannot be treated as evidence that an email was not sent.

## Unsubscribe

Marketing emails link to `https://legacyhubdigital.com/unsubscribe#token=...`. The token is a random capability, not the CRM shared secret. A URL fragment keeps it out of HTTP request URLs and referrer headers. The browser captures it in memory and removes it from the address bar before optional tracking starts. No tokens are stored in cookies/local storage. Reloading after removal requires reopening the original email link.

Opening the link does not mutate CRM: the recipient explicitly confirms on the branded, noindex page. This avoids ordinary email-link preview scanners causing unsubscribes. JavaScript is required. Recipients can also reply to the email for help. No sign-in or retention pitch is used.

`POST /api/unsubscribe` validates origin, JSON, size, token format and a bounded in-process rate limit. It calls a separate server-only transport with the existing CRM shared secret in the POST body. HTTPS endpoint and redirect allowlists, a 12-second timeout and bounded response parsing mirror the existing lead transport without modifying it. Only the authenticated `unsubscribe` action is added to Apps Script. Unknown tokens return a generic invalid result without writes.

Under the same script lock, suppression is written first and flushed, then all matching-address nurture rows become UNSUBSCRIBED with a timestamp. Retries repair partial writes; already-unsubscribed is a successful state. Original leads, consent timestamps/versions and transactional records remain untouched. Tokens do not expire automatically so old marketing emails remain usable; preserve them while retention policy permits. This is a confirmation flow, not RFC one-click List-Unsubscribe support.

No new website environment variables. Keep `GOOGLE_CRM_WEBAPP_URL` and `GOOGLE_CRM_SHARED_SECRET` server-side. Host access logs may record ordinary request paths, but not the fragment; configure infrastructure/APM not to log POST bodies. This does not promise legal compliance or control third-party email rewriting. Keep the existing analytics configuration unchanged and verify token handling with the actual production tracking stack before activation.

## Activity events

`guide_delivery` (sent/failed), `nurture_enrolled`, `nurture_email_2` through `nurture_email_5`, `nurture_completed`, `nurture_unsubscribed`, `nurture_suppressed`, `nurture_failed`. No full email bodies, tokens, exception text or secrets are logged. Existing acknowledgement/internal events remain.

## Deployment and trigger setup — future approved steps only

1. Approve email copy, sender display name, monitored reply-to, suppression handling, consent wording/scope, business identity/footer requirements, retention and operational owner. Check Workspace deliverability/authentication and quota capacity. No addresses or legal claims have been invented.
2. First copy the CRM structure to a private test spreadsheet with synthetic leads only. Create a separate test Apps Script project and test deployment. Set test `CRM_SPREADSHEET_ID` and a separate test shared secret. Never reuse production data/secrets in test fixtures.
3. Paste/update all six `.gs` files: Schema, Security, Main, Notifications, EmailTemplates and EmailNurture. Keep `NURTURE_ENABLED=false`. Run `setupCrm()` only against this test spreadsheet, checking all existing records remain unchanged and all three new tabs match headers.
4. Set `EMAIL_ENABLED=true`, approved test sender/reply settings and a controlled internal notification mailbox. Use only mailboxes you own for delivery tests. Confirm Email 1 for both consent states; contact/consultation acknowledgements and internal notifications must still work. Inspect lead attribution and consent evidence.
5. In the isolated test CRM, make consented rows due and invoke the processor with NURTURE_ENABLED=true. Test OFF/ON consent, suppression, missing/changed consent, duplicate requests, all four emails, completion, invalid tokens, repeated unsubscribe, and no further sends. Exercise the deployed test unsubscribe endpoint with a local/test website configured for that deployment. Reset NURTURE_ENABLED=false afterward.
6. After explicit production approval: back up the CRM; upload all six files; leave NURTURE_ENABLED=false; run production setup once; verify unchanged Leads and new tabs; deploy the new Apps Script version; release the website unsubscribe route. Keep the existing endpoint/secret unless intentionally rotating them. No triggers yet.
7. With further approval, perform controlled production end-to-end QA including actual inbox receipt and unsubscribe, mobile page use, invalid/temporary-error states and existing form regressions. Confirm the production unsubscribe route works before enabling any marketing send.
8. Only after sign-off, in Apps Script Triggers choose Add Trigger → processEmailNurtureQueue → Time-driven → Hour timer → Every hour. Ensure exactly one trigger exists under the intended Workspace owner. Set NURTURE_BATCH_SIZE=10 (or lower), then NURTURE_ENABLED=true. No trigger creation is performed by code/setup.
9. Monitor failures/quota and ledger daily at first. Stop marketing by setting NURTURE_ENABLED=false; unsubscribe must remain live while stopped. Removing the trigger is optional for a longer pause. This does not disable transactional notifications.

## Local validation

Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build --webpack`, `pnpm test:routes` against a running local server, and `git diff --check`.

The existing VM-based Apps Script tests load/parse every .gs file with mocked Sheets, Properties, MailApp and locks. Tests never require a live sheet or send mail. Unsubscribe HTTP tests mock Apps Script, exercise response/redirect/timeout handling and verify safe public results. Locks are mocked, so real Apps Script concurrency, authorization, quotas, trigger scheduling, email-link rewriting and inbox delivery need isolated Workspace QA before production activation. No business/legal compliance guarantee is made.
