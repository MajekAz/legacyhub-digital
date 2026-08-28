# CRM schema

The seven tabs are Leads, Follow_Ups, Proposals, Projects, Business_Profile, System_Config and Activity_Log. `setupCrm` is the canonical schema initializer. Do not rename or reorder columns without a versioned migration. Secrets belong in Script Properties, never System_Config or Business_Profile.

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

The first 35 headers preserve the supplied integration schema. Added fields are Enquiry_Type, Enquiry_Category, Consent, Consent_At, Consent_Version, Request_ID and Payload_Hash. Timestamps use ISO 8601 UTC; Materials_Available is a semicolon-separated list; Lead_Score is numeric; Priority is Hot/Warm/Cold. Consent_At is assigned when Apps Script persists the request.

## Prepared tabs

- Follow_Ups: Follow_Up_ID, Lead_ID, Due_At, Owner, Status, Notes.
- Proposals: Proposal_ID, Lead_ID, Status, Quoted_Amount, Updated_At.
- Projects: Project_ID, Lead_ID, Project_Status, Updated_At.
- Business_Profile: Key, Value (non-secret business profile).
- System_Config: Key, Value (non-secret operational settings; not read automatically in Phase 1).
- Activity_Log: Timestamp, Lead_ID, Event, Outcome.

Only Leads persistence and Activity_Log writes are automated. Other tabs are scaffolding for future workflows.
