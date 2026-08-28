# Google Workspace CRM: manual setup

## Create a separate CRM

1. In the business Google Workspace account, create a new **private** spreadsheet named LegacyHub Digital CRM. Do not use the Baba Muyi spreadsheet or any existing family data.
2. Limit sharing to authorised staff; require appropriate account security. Do not publish to the web or grant anyone-with-link access.
3. Create a new Apps Script project. Copy `Schema.gs`, `Security.gs`, `Main.gs`, `Notifications.gs` and `appsscript.json` from this repository. Review the scopes before authorising.
4. Set Script Properties, not source-code secrets:

| Property                   | Purpose                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| `CRM_SPREADSHEET_ID`       | Private new CRM spreadsheet ID                                                               |
| `GOOGLE_CRM_SHARED_SECRET` | Cryptographically random secret, at least 32 characters; same value as website server secret |
| `LEAD_COUNTER`             | Created by setup at 0 only for a new empty CRM; never reset                                  |
| `BUSINESS_NAME`            | Verified business sender display name                                                        |
| `BUSINESS_REPLY_TO`        | Verified business email address                                                              |
| `LEGACYHUB_LEADS_EMAIL`    | Internal recipient, optional                                                                 |
| `EMAIL_ENABLED`            | `true` only after email testing and identity verification; otherwise disabled                |
| `FOLLOW_UP_DAYS`           | Optional integer 1–365; sets Next_Follow_Up                                                  |

5. Run `setupCrm` once as the owner. It creates the seven tabs and headers without clearing existing data. Existing mismatched headers cause a failure. Apply staff access and protect header/configuration cells as appropriate.
6. Deploy a **versioned Web App**, executing as the dedicated business owner. The server integration needs an access mode that permits unauthenticated network requests; the HMAC authenticates the request before any sheet access. Use this only if Workspace policy permits it. Stop if the organisation disallows this deployment mode; do not bypass its policy.
7. Copy the `/exec` URL into server-only `GOOGLE_CRM_WEBAPP_URL`. Never use `/dev` in production. Set the matching secret in the website's server environment.
8. Verify against a separate test sheet first. Deploy a new script version after edits; saving source alone does not update a versioned web app.

## API contract v1

`POST` with `Content-Type: application/json`:

```json
{
  "version": 1,
  "action": "createLead",
  "timestamp": 1787950000000,
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "payload": "{\"name\":\"Example\",\"...\":\"validated complete data\"}",
  "signature": "hex-hmac-sha256"
}
```

This is a structural illustration, not a valid lead fixture. `payload` is the exact JSON string of the normalised `CrmData` object from `lib/lead-schema.ts`, including empty defaults, `type`, `category`, `source`, `consent:true` and `consentVersion:2026-08-28-v1`. The signature is HMAC-SHA256 over `timestamp.requestId.payload`, UTF-8, using the shared secret. It is lowercase hex. The secret itself is never transmitted. The timestamp must be within five minutes of the script clock. Request IDs are UUIDs generated in the browser, not lead IDs.

Success: `{"ok":true,"leadId":"LHD-0001"}`.
Failure: `{"ok":false,"error":"internal_error"}`.
Apps Script ContentService may return HTTP 200 for logical errors and redirects its output. The website checks both HTTP status and the strict JSON response, not HTTP status alone. No raw Google error reaches the visitor.

## IDs, retries and concurrency

`saveLead` acquires a ScriptLock, validates headers, finds the exact Request_ID, checks Payload_Hash, increments a persistent Script Property counter and appends the lead. Counter increments precede append, so a failed append may leave a gap. Gaps are acceptable; duplicate IDs are not. Never reconstruct the counter from row count. After restoring backups, manually verify the high-water mark before accepting new writes.

An identical retry returns the original ID. A different payload with the same UUID is rejected. The browser retains the UUID after an uncertain response and creates a new one when submitted content changes. Reloading the page can create a fresh UUID; this is not person-level deduplication. Staff may merge genuine repeated enquiries manually. Do not delete Request_ID or Payload_Hash when editing a lead.

## Lead workflow

NEW → CONTACTED → QUALIFIED → CONSULTATION_BOOKED → PROPOSAL_SENT → WON.
LOST and ARCHIVED are supported. Staff update the status in Sheets. Project delivery statuses are separate; Phase 1 sets NOT_STARTED only. A request for consultation is NEW, not automatically CONSULTATION_BOOKED.

Initial score: consultation 60 / general contact 30; phone +10; chosen service +10; materials +10. Priority: Hot ≥80, Warm ≥50, otherwise Cold. These are routing hints, not automated eligibility decisions. Country is not used for scoring.

`FOLLOW_UP_DAYS` sets a date on the lead. Follow_Ups, Proposals and Projects are prepared tabs, not active automation engines.

## Emails and activity

The script can send a plain-text acknowledgement to the lead and a new-lead email to the configured internal recipient. Workspace supplies the actual sending account; the configured display name and reply-to must be authorised. Setting `LEGACYHUB_LEADS_EMAIL` only on the website does not configure the script: add it to Script Properties too.

The internal email includes the lead reference, contact details, country, service interest, preferred method and campaign. It instructs staff to open their private CRM. The enquiry message is not duplicated into logs. Email is sent after the lead is saved; failures are logged without failing the saved enquiry. No queued retries or marketing automation are implemented. Review Activity_Log and Workspace email quotas, and retry manually when needed.

## Operational care

Keep the sheet private; restrict script editors; rotate secrets in both environments together; review staff access; back up according to the approved retention plan. Monitor quota failures and `lead_delivery_unconfirmed` server events. Do not log request bodies, signatures, secrets or full messages. An Apps Script outage fails safely with a retry notice, not a success screen. High-volume campaigns require a future queue or approved alternative ingress, not more unbounded script traffic.
