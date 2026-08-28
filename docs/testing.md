# Testing

Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` and `git diff --check`.
Run `pnpm test:routes` with the local server on port 3100; `TEST_BASE_URL` can target an authorised test instance.

The suite uses mocked fetch and a local Apps Script service harness. It never accesses a live Google Sheet. Tests cover Zod normalisation/validation, consent, honeypot, API origin/content type/size/rate errors, signed CRM requests, malformed or failed responses, timeout, central IDs, counter continuity after deletion, idempotency, signature expiry/tampering, schema drift, spreadsheet injection, email failure isolation, scoring, attribution consent/persistence, analytics gates, WhatsApp configuration, page content, forms and metadata.

The Apps Script harness verifies application logic, not Google's quota behaviour, permissions, real locking guarantees, ContentService redirects, Sheet formatting or MailApp delivery. Those require manual Workspace acceptance. HTTP route checks are not a substitute for visual/browser accessibility QA.

No credentials are required for build/tests. Fixtures use `.test` email domains and fake deployment identifiers. Native dependency lifecycle scripts remain disabled in `pnpm-workspace.yaml`; supplied platform packages were sufficient for these checks. Respect supply-chain policy when updating dependencies.

See handover.md for the recorded run results and deployment.md for manual production tests.
