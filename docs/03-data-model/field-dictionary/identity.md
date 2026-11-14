# Identity field dictionary

Status: Draft.

## 1. Party

One Party is one person or one organization. A Party may or may not be a Client.

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. Read-only. |
| party_type | Select | Yes | Individual, Organization. |
| legal_name | Data | Yes | Full legal name. |
| display_name | Data | No | Name shown in the UI. Defaults to legal name. |
| date_of_birth | Date | Conditional | Required for Individual. |
| date_of_incorporation | Date | Conditional | Required for Organization. |
| organization_type | Select | Conditional | HUF, Company, Partnership, LLP, Trust, Society, Other. Required for Organization. |
| gender | Link (Gender) | No | Individual only. |
| primary_email | Data (Email) | No | Masked in list views. |
| primary_mobile | Data (Phone) | No | Masked in list views. |
| alternate_mobile | Data (Phone) | No | Masked in list views. |
| status | Select | Yes | Active, Inactive, Merged. |
| merged_into | Link (Party) | Conditional | Required when status is Merged. |
| notes | Small Text | No | Internal notes. |

Rules:

- A Party has at most one Client.
- A Party can hold many roles.
- A merged Party is read-only.
- Addresses use Frappe Address with a link to Party. Do not copy the address into Party.
- A login is linked from Client, not from Party.

## 2. Identity Document

An Identity Document is one proof for one Party. A Party can have many documents.

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| party | Link (Party) | Yes | Document owner. |
| document_type | Select | Yes | PAN, Passport, Voter ID, Driving License, Birth Certificate, CKYC, CIN, LLPIN, Registration Number, Other. |
| document_number | Data | Yes | Full value. Restricted by field-level permission. Masked in lists. |
| issuing_country | Link (Country) | No | Defaults to India. |
| issue_date | Date | No | Date on the document. |
| expiry_date | Date | No | Used for expiry reminders. |
| verification_status | Select | Yes | Unverified, Pending, Verified, Failed, Expired. |
| verified_on | Datetime | No | Set when verification completes. |
| verified_by | Link (User) | No | Employee who verified. |
| attachment | Attach | No | Private file. |
| is_primary | Check | No | One primary document per Party. |
| notes | Small Text | No | Internal notes. |

Rules:

- PAN is unique when present.
- Aadhaar is not collected in phase 1. Do not store the number, a partial number, or an attachment. See OQ-004.
- One primary document per Party.
- A document with an expiry date creates a reminder before it expires.
- Do not show the full number in a list, report, URL, log, or error message.

## 3. Client

A Client is a Party with a client relationship. The Client holds client-specific data.

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| party | Link (Party) | Yes | Unique. |
| client_code | Data | Yes | Unique and immutable. Format `CL-000001`. |
| client_type | Select | Yes | Individual, Minor, HUF, Company, Partnership, LLP, Trust, Society, Other. |
| client_status | Select | Yes | Onboarding, Active, Dormant, Closed. |
| onboarding_date | Date | No | Date the Client became Active. |
| kyc_status | Select | Yes | Pending, In Progress, Verified, Rejected, Expired. Phase 1 placeholder for the KYC record. |
| primary_family | Link (Family) | No | The Client's own household. |
| primary_rm | Link (User) | No | Derived from the active Primary RM assignment. Read-only in the UI. |
| segment | Select | No | Retail, HNI, Ultra HNI, Corporate, Institutional, Family Office. |
| risk_profile | Select | No | Conservative, Moderately Conservative, Moderate, Moderately Aggressive, Aggressive. |
| investment_objective | Select | No | Capital Preservation, Income, Balanced, Growth, Aggressive Growth. |
| source_lead | Link (Lead) | No | Lead that created the Client. |
| majority_date | Date | Conditional | Required for a Minor. Guardian roles expire on this date. |
| status_changed_on | Datetime | No | Last status change. |
| legacy_id | Data | No | Old ID from a migrated system. |
| notes | Small Text | No | Internal notes. |

Rules:

- One Client per Party.
- `client_type` is a business classification. It does not replace `Party.party_type`.
- There is no Prospect status. A sales opportunity is a Lead. See [ADR-0004](../../04-decisions/adr-0004-client-identity-and-lifecycle.md).
- A Minor must have an active Guardian before activation.
- A Minor becomes an adult on `majority_date`. Create a review task and change `client_type` to Individual.
- `primary_family` must have an active Family Membership for the Client.
- `primary_rm` follows the active Client Assignment. Do not edit it directly.
- A Client with status Closed keeps its Holdings and history.
- A Client is not hard deleted.
- A Client code is unique and immutable. See [ADR-0004](../../04-decisions/adr-0004-client-identity-and-lifecycle.md).

## 4. Client code format

The code uses the prefix `CL-` and a six-digit number, for example `CL-000123`.

- Assign the next number when the Client is created.
- Never reuse a number.
- Never change the code after creation.
- When two Clients merge, keep the surviving code. Keep the retired code as a legacy reference.

## 5. Standard fields to confirm

- `kyc_status` values.
- `segment` values.
- `investment_objective` values.
- `risk_profile` values.

These are proposed. They are not blocking the model.
