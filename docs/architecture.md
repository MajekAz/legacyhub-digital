# Architecture and boundaries

LegacyHub Digital Heritage is a done-for-you service, not SaaS. LegacyHub names the underlying platform. This checkout is independent of all Baba Muyi repositories and infrastructure. Only an external link and the supplied case-study description are used.

## Runtime

Next.js 16.3.3 App Router, React, TypeScript, Tailwind CSS 4 and Zod. The generated root `app/` convention is retained (rather than introducing `src/app/`). Next.js is the primary Node.js runtime for the intended Hostinger deployment. The initial Sites scaffold's separate Vite adapter is retained as an optional build target, not the production target. No Sites resources, Supabase, database or authentication are provisioned.

Server components render public content. Client components own forms, consent, attribution and optional analytics. Shared content is held in typed local modules. No CMS is needed in Phase 1. All marketing claims remain scope-dependent; no invented prices, testimonials, production guarantees, phone numbers or email addresses.

## Lead flow

Browser -> same-origin POST /api/leads -> Zod validation -> authenticated JSON POST -> Apps Script doPost -> private Leads sheet. The browser never receives the CRM endpoint or shared secret. The website only reports success after a valid `{ok:true,leadId:"LHD-0001"}` response.

A UUID request ID survives retry in the mounted form. Apps Script checks the ID and a payload fingerprint under the same script lock as its counter and append. Repeated identical requests return the original reference. A reused ID with different content is rejected. Counters live in Script Properties and are never based on row count. Deleting rows does not permit ID reuse. Operators must never reset the counter during redeployment.

The server sends `{secret, action: "createLead", data, requestId}` over HTTPS. Apps Script compares the shared secret before validating or writing data. The website handles Google result redirects as credential-free GETs. The previous HMAC prototype is superseded; deploy both ends together. See google-workspace-crm.md for the exact contract and live acceptance procedure.

## Operational limits

The in-process limiter is defence in depth for a single instance, not a distributed guarantee. Production requires a trusted reverse proxy/WAF with a per-client POST rate limit before enabling ads. Never trust forwarded IP headers unless the host overwrites them. Google Apps Script is quota-limited and publicly reachable when deployed for server ingress; anonymous requests are rejected before sheet access. It cannot provide a WAF or high-volume queue. Workspace policies must permit the chosen deployment mode. If they prohibit it, stop and design an approved OAuth integration rather than weakening policy.

Notifications are best-effort after persistence. Failure to email must not turn a saved lead into a failed website response. Activity_Log records operational outcomes without copying enquiry text. Phase 1 does not provide reliable queued email retries, project management, a public archive editor, or a dashboard.

## Content and legal review

Privacy and terms are explicit review drafts. Production launch is blocked on business identity, contact route, retention policy, service terms, processor/transfer assessment, consent testing and final approval. No compliance certification is implied. No analytics network request or attribution storage is allowed until the relevant consent is granted.

## References checked

- https://nextjs.org/docs/app/getting-started/route-handlers
- https://nextjs.org/blog/next-16
- https://developers.google.com/apps-script/guides/web
- https://developers.google.com/apps-script/reference/lock
- https://developers.google.com/apps-script/reference/properties
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-storage-and-access-technologies/
