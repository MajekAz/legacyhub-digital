import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Privacy notice — review draft',
  'How LegacyHub Digital Heritage plans to handle enquiries, Google Workspace CRM data and optional analytics.',
  '/privacy',
);
export default function Page() {
  return (
    <main id="main" className="wrap section prose">
      <p className="eyebrow">Privacy & your information</p>
      <h1>Privacy notice</h1>
      <p className="legal-note">
        Pre-launch review draft — 28 August 2026. The legal business identity, privacy contact,
        retention schedule and processor arrangements must be confirmed before public lead
        collection begins.
      </p>
      <h2>What an enquiry collects</h2>
      <p>
        We collect the contact details and project information you choose to submit, your preferred
        contact method and a record of your consent to enquiry follow-up. Please do not submit
        identity documents, confidential records, sensitive family information or archive files
        here.
      </p>
      <h2>How we use it</h2>
      <p>
        Enquiries are used to respond, discuss your requirements, prepare a scope or quote, and
        manage follow-up. Agreeing to enquiry contact is not permission for unrelated marketing and
        does not create a contract.
      </p>
      <p>
        When you request a free resource, the required checkbox permits delivery of that resource
        and a response about the request. A separate, optional and unchecked checkbox records
        whether you would like occasional practical follow-up emails. Resource delivery is not
        conditional on choosing those optional emails.
      </p>
      <h2>Google Workspace CRM</h2>
      <p>
        The website sends validated enquiries through its server to Google Apps Script and a private
        Google Sheets CRM. Access is restricted to authorised business users. Google Workspace and
        the website hosting provider process information as part of delivering these services.
        Relevant contracts, data locations and international-transfer safeguards must be reviewed
        before launch.
      </p>
      <h2>Email and WhatsApp</h2>
      <p>
        When configured, we send an acknowledgement email and an internal notification. We may
        follow up by your chosen method. If you choose WhatsApp or open a WhatsApp link, WhatsApp’s
        own service and privacy terms also apply.
      </p>
      <h2>Cookies, attribution and analytics</h2>
      <p>
        Essential local storage remembers your privacy choices. Marketing consent permits session
        storage of the first landing page, referring site and campaign parameters. Without it, we
        submit only the current page path and no campaign history. Session attribution lasts for the
        browser tab session.
      </p>
      <p>
        Optional Google Analytics and Meta Pixel are disabled unless configured and the relevant
        consent is granted. We do not intentionally send names, emails, phone numbers or enquiry
        text to analytics. Third-party tools may process device and network identifiers. You can
        reject optional processing or change your choices using Cookie preferences in the footer.
      </p>
      <h2>Retention and security</h2>
      <p>
        A written retention and deletion schedule must be approved before launch. Enquiry
        information should be kept only for the approved period or an applicable contractual or
        legal need. Access controls, secure server communication and minimised operational logs
        support protection; no system is guaranteed risk-free.
      </p>
      <h2>Your choices and rights</h2>
      <p>
        You can ask about access, correction, deletion, restriction or objection where applicable,
        and withdraw consent without affecting prior lawful processing. Use the contact page to
        request a privacy response; a verified direct privacy contact must be added before launch.
        You may also contact the relevant supervisory authority, including the UK Information
        Commissioner’s Office.
      </p>
      <Link className="text-link" href="/contact">
        Contact LegacyHub Digital Heritage →
      </Link>
    </main>
  );
}
