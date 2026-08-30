# LegacyHub Digital Heritage

**Preserve a Life. Protect a Story. Connect Generations.**

Digital Legacy Archives for Families, Leaders and Organisations.

Independent commercial service website for https://legacyhubdigital.com. Not SaaS.
No Baba Muyi code, private media, data, authentication, database or hosting configuration is used. Its independent family archive is an external case study only.

## Local development

Requires Node 22.13+ and pnpm. Install with `pnpm install`, then `pnpm dev`.
The preview listens on http://127.0.0.1:3100. Copy `.env.example` to `.env.local` and configure server credentials only when a test CRM is ready. Do not commit secrets.

Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, and `git diff --check`.
With the local server running, run `pnpm test:routes`.

`pnpm start` runs the built Node app. The Sites scaffold's optional `build:sites` adapter is not the Hostinger production target and is not validated for deployment. No cloud resources were created.

## Structure

- `app/`: 17 public pages (12 core pages + five campaigns), metadata and secure lead endpoint.
- `components/`: shared editorial sections, native enquiry forms, consent and optional WhatsApp.
- `content/site.ts`: service, audience, package and campaign copy.
- `lib/`: Zod schema, authenticated CRM client, attribution, analytics and local abuse checks.
- `apps-script/`: private Google Workspace CRM workflow; deploy separately after setup.
- `tests/`: isolated contract, API, Apps Script harness, content, consent and attribution tests.
- `docs/`: architecture, CRM setup, schema, deployment and handover.

## Read before launch

The website is a local foundation, not a deployed or configured lead-generation system.
Live Apps Script, Google Sheets, email, Meta, GA and WhatsApp have not been connected.
Privacy and terms are review drafts. Configure the trusted edge rate limit, business identity and legal policies before accepting live leads or running ads.

See [Architecture](docs/architecture.md), [CRM setup](docs/google-workspace-crm.md), [CRM schema](docs/crm-schema.md), [Deployment](docs/deployment.md), [Testing](docs/testing.md), and [Handover](docs/handover.md).

## Git

Current CRM branch: `feature/google-workspace-crm`.
Configured remote: `https://github.com/MajekAz/legacyhub-digital.git` (no push made during this CRM change).
No push, merge, deployment or DNS change is authorised by this implementation.
