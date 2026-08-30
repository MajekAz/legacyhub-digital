# Production deployment checklist — do not execute without approval

## Isolation

- The local remote is `https://github.com/MajekAz/legacyhub-digital.git`; verify access before any approved push. Do not point it at `MajekAz/baba-muyi-legacy`.
- Review and approve the implementation/validation report before pushing. CRM branch: feature/google-workspace-crm. No automatic push, merge or deploy.
- Create a separate Hostinger Node.js application, project secrets, domain mapping and logs. Confirm the actual Hostinger plan supports this Next.js version and server Route Handlers; static-only hosting is unsuitable.
- Do not reuse Baba Muyi production infrastructure or data. Do not publish the Sites adapter as a substitute for the intended deployment.

## Host configuration

Use Node 22.13+ with pnpm and the committed lockfile. Build: `pnpm install --frozen-lockfile` then `pnpm build`. Production command must bind to the host's assigned port and interface, e.g. `pnpm exec next start -H 0.0.0.0 -p <HOST_ASSIGNED_PORT>`. The repository's `pnpm start` is intentionally a loopback local preview, not a host-specific launch command. Use the host's current runtime instructions; these account/plan details have not been verified.

Set these variables in the new application, never in public source:

| Variable                      | Visibility / behaviour                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------------------- |
| GOOGLE_CRM_WEBAPP_URL         | Server only; validated HTTPS script.google.com `/exec` endpoint                                 |
| GOOGLE_CRM_SHARED_SECRET      | Server only; ≥32 characters, matches Script Properties                                          |
| LEGACYHUB_LEADS_EMAIL         | Optional server-side deployment reference; actual notifications configured in Script Properties |
| NEXT_PUBLIC_BUSINESS_WHATSAPP | Public build-time international number; blank/invalid hides CTA                                 |
| NEXT_PUBLIC_GA_ID             | Public build-time GA4 G- ID; blank disables GA                                                  |
| NEXT_PUBLIC_META_PIXEL_ID     | Public build-time numeric ID; blank disables Meta                                               |

Never copy `.env.local` into a public build artefact. Rebuild after public variable changes.

## Domain and HTTPS

After approval, map legacyhubdigital.com and www to the new app using the values Hostinger supplies. Do not invent an A record, IP or CNAME. Provision valid SSL, redirect HTTP to HTTPS, and select the apex as canonical. Configure www-to-apex redirects. Enable HSTS at the edge only after HTTPS is verified. Preview deployments must be access-controlled/noindexed. Domain ownership, DNS, SSL and Hostinger settings have not been inspected or changed.

## Security launch gates

- Configure a trusted reverse proxy/WAF to limit POST /api/leads per client, plus overall ingress/body/time limits. The included in-memory global/email limiter is not a distributed defence.
- Verify the host does not cache lead API responses and overwrites any trusted forwarding headers. The application does not trust client-supplied forwarding headers for rate limiting.
- Establish a Content Security Policy in report-only mode, test Next.js and any consented GA/Meta endpoints, then enforce a reviewed policy. A nonce-based strict policy is not implemented in this foundation.
- Ensure Workspace policy permits the web app access mode; validate a secret-free response to direct unauthenticated requests.
- Complete business identity, legal contact, privacy retention, processor/transfer review, contract and cancellation terms. Replace the explicit legal review drafts with approved text.
- Confirm permissions for all case-study copy and any future public images.

## Ads and analytics

- Each of the five landing pages includes audience-specific content, proof, process, FAQs and a native consultation form. No campaign has been created or connected.
- Use non-personal campaign codes such as `utm_source=facebook&utm_medium=paid_social&utm_campaign=diaspora_family_uk&utm_content=video_ad_02`. Never put emails, names or lead references in URL parameters.
- Original campaign attribution is retained in sessionStorage only with marketing consent. Without consent, only the current path is sent; campaign/referrer data is intentionally blank. Campaigns must account for this attribution loss.
- Add GA4 and Meta IDs only after approval. Disable GA enhanced measurement form interaction collection and automatic URL/history events in the property; this site emits its own sanitised page views. Disable automatic advanced matching and automatic event detection in Meta. Do not enable lead-content capture.
- Events: page_view, lead_form_started, lead_form_submitted, consultation_cta_click, whatsapp_click, case_study_click. Meta Lead is emitted only after confirmed CRM success, not on a thank-you-page visit. GA and marketing consent are independent.
- Test accept, reject, granular choices and withdrawal with the real configured providers. The consent implementation is a foundation, not a compliance certification. Vendor cookies and account settings require real-browser verification before launch.
- No Meta Conversions API, Google Ads tag, remarketing list or automated campaign is implemented. These need separate approval and privacy review.

## WhatsApp and email

Set a verified international WhatsApp number without inventing one. Test the link on mobile and desktop. Confirm a business Workspace sender, reply-to and internal recipient. Configure SPF/DKIM/DMARC for the real sending domain with the provider's supplied values. Test acknowledgement, internal email, failure logging and quotas.

## Production acceptance

- All 17 public pages, canonical URLs, sitemap, robots, social card and icon.
- Keyboard-only and mobile browser review; labels, errors and focus, reduced motion and contrast.
- Invalid email, missing consent, oversize payload, honeypot, rate limit, unconfigured CRM and network failure.
- One authorised test lead reaches the test CRM once; repeat request returns the same reference.
- New reference counter, status, score, source, UTMs, consent fields and optional follow-up date.
- Email delivery and Activity_Log outcomes; delete test data under the approved policy.
- Browser bundles contain no CRM secret/URL; logs contain no personal enquiry text.
- Consent accepted/rejected/withdrawn behaviours and vendor network traffic.
- External case study opens separately with a clear leaving-site notice.
- Monitoring, backup/restore, counter recovery, staff access and retention owner assigned.
