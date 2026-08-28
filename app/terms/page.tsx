import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Website terms — review draft',
  'Pre-launch website terms for the LegacyHub Digital Heritage enquiry service.',
  '/terms',
);
export default function Page() {
  return (
    <main id="main" className="wrap section prose">
      <p className="eyebrow">Using this website</p>
      <h1>Website terms</h1>
      <p className="legal-note">
        Pre-launch review draft — 28 August 2026. Business identity, jurisdiction, service contracts
        and consumer terms require approval before launch. This draft is not a substitute for
        professional legal review.
      </p>
      <h2>About the service</h2>
      <p>
        LegacyHub Digital Heritage offers consultation-based digital heritage services. Website
        descriptions indicate possible scopes; they do not guarantee availability, turnaround,
        perpetual hosting or every feature for every project.
      </p>
      <h2>Enquiries and quotations</h2>
      <p>
        Submitting a form requests a response. It does not reserve an appointment, form a contract
        or create a payment obligation. Scope, pricing, milestones, review, payment and cancellation
        arrangements must be agreed in writing before work begins.
      </p>
      <h2>Your material and permissions</h2>
      <p>
        You must have the necessary rights and permissions for material you ask us to use. Content
        ownership, family approval, public or private access and handling of sensitive material must
        be agreed during scoping. Do not upload private archive material through the enquiry form.
      </p>
      <h2>Domains, hosting and care</h2>
      <p>
        Domain ownership, hosting duration, renewals, backups, handover and maintenance
        responsibilities are defined in each project agreement. An archive is not a promise of
        permanent availability.
      </p>
      <h2>External sites</h2>
      <p>
        The Baba Muyi archive is an independent external case study. Following its link takes you to
        another website with its own arrangements. We do not reproduce its private family data or
        administration.
      </p>
      <h2>Responsible use</h2>
      <p>
        Do not misuse this website, attempt unauthorised access or send harmful or unlawful content.
        No wording here is intended to exclude rights or liabilities that cannot lawfully be
        excluded. Final service-specific terms will be supplied with an agreed proposal.
      </p>
      <Link className="text-link" href="/contact">
        Ask a question →
      </Link>
    </main>
  );
}
