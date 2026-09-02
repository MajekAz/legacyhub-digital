# CRM schema

The original seven tabs are Leads, Follow_Ups, Proposals, Projects, Business_Profile, System_Config and Activity_Log. `setupCrm` is the canonical schema initializer. Do not rename or reorder columns without a versioned migration. Secrets belong in Script Properties, never System_Config or Business_Profile.

## Leads columns, in order

| Position | Header                     |
| -------- | -------------------------- |
| 1        | `Lead_ID`                  |
| 2        | `Created_At`               |
| 3        | `Name`                     |
| 4        | `Email`                    |
| 5        | `Phone`                    |
| 6        | `Country`                  |
| 7        | `Legacy_Subject_Type`      |
| 8        | `Subject_Name`             |
| 9        | `Living_Status`            |
| 10       | `Materials_Available`      |
| 11       | `Photo_Count_Range`        |
| 12       | `Service_Interest`         |
| 13       | `Preferred_Contact_Method` |
| 14       | `Message`                  |
| 15       | `Source`                   |
| 16       | `Source_Page`              |
| 17       | `Landing_Page`             |
| 18       | `Referrer`                 |
| 19       | `UTM_Source`               |
| 20       | `UTM_Medium`               |
| 21       | `UTM_Campaign`             |
| 22       | `UTM_Content`              |
| 23       | `UTM_Term`                 |
| 24       | `Status`                   |
| 25       | `Lead_Score`               |
| 26       | `Priority`                 |
| 27       | `Assigned_To`              |
| 28       | `Next_Follow_Up`           |
| 29       | `Last_Contacted`           |
| 30       | `Admin_Notes`              |
| 31       | `Proposal_Status`          |
| 32       | `Quoted_Amount`            |
| 33       | `Deposit_Status`           |
| 34       | `Project_Status`           |
| 35       | `Updated_At`               |
| 36       | `Enquiry_Type`             |
| 37       | `Enquiry_Category`         |
| 38       | `Consent`                  |
| 39       | `Consent_At`               |
| 40       | `Consent_Version`          |
| 41       | `Request_ID`               |
| 42       | `Payload_Hash`             |
| 43       | `Marketing_Consent`        |
| 44       | `Marketing_Consent_At`     |
| 45       | `Marketing_Consent_Version` |

The first 42 headers preserve the deployed integration schema. The final three append-only fields record the distinct optional marketing choice for lead magnets. Timestamps use ISO 8601 UTC; Materials_Available is a semicolon-separated list; Lead_Score is numeric; Priority is Hot/Warm/Cold. Consent timestamps are assigned when Apps Script persists the request.

## Prepared tabs

- Follow_Ups: Follow_Up_ID, Lead_ID, Due_At, Owner, Status, Notes.
- Proposals: Proposal_ID, Lead_ID, Status, Quoted_Amount, Updated_At.
- Projects: Project_ID, Lead_ID, Project_Status, Updated_At.
- Business_Profile: Key, Value (non-secret business profile).
- System_Config: Key, Value (non-secret operational settings; not read automatically in Phase 1).
- Activity_Log: Timestamp, Lead_ID, Event, Outcome.

Leads persistence, Activity_Log writes and configured initial Follow_Ups records are automated. Other tabs remain scaffolding for future workflows.

## Phase 2 email tabs

`Email_Nurture`, `Email_Suppression` and `Email_Send_Log` are additive tables defined in `apps-script/EmailNurture.gs`. The Leads contract remains unchanged. See [email nurture architecture and exact headers](email-nurture-automation.md) for schema, token access restrictions, safe migration and recovery. No production migration is authorized by this document.
