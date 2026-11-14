# Related party field dictionary

Status: Draft.

## 1. Holding Party

A Holding Party is a Party with a role on one Holding. It covers owners and non-owners.

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| holding | Link (Holding) | Yes | Parent Holding. |
| party | Link (Party) | Yes | Person or organization in the role. |
| role | Select | Yes | Primary Owner, Joint Holder, Nominee, Life Assured, Beneficiary, Payer, Guardian, Authorized Signatory. |
| share_percentage | Percent | Conditional | Required for Primary Owner and Joint Holder. Must sum to 100 per Holding. |
| status | Select | Yes | Active, Inactive, Expired. |
| effective_from | Date | No | Start of the role. |
| effective_to | Date | Conditional | Required for Guardian. Optional for POA-like roles. |
| notes | Small Text | No | Internal notes. |

Rules:

- Every Holding has at least one active Primary Owner.
- Owner shares sum to 100.
- One Party has one active Owner role per Holding.
- Owner and Nominee are conflicting roles for the same Party on the same Holding. Use one active role.
- An Owner must be a Client. Proposed. A Related Person becomes a Client before becoming an Owner.
- A Nominee, Guardian, Life Assured, Beneficiary, or Payer can be a Related Person.
- A Guardian role needs an end date. The default is the minor's majority date.
- A Guardian role does not grant ownership.
- A Nominee role does not grant ownership until a claim or transfer.
- Do not copy name, PAN, or contact data into this record. Link to Party.

## 2. Application Party

An Application Party is a Party with a role during an Application. It mirrors the Holding Party roles for the application stage.

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| application | Link (Application) | Yes | Parent Application. |
| party | Link (Party) | Yes | Person or organization in the role. |
| role | Select | Yes | Applicant, Joint Applicant, Nominee, Life Assured, Guardian, Payer, Authorized Signatory. |
| share_percentage | Percent | Conditional | Required for Applicant and Joint Applicant. |
| status | Select | Yes | Active, Inactive. |
| notes | Small Text | No | Internal notes. |

Rules:

- An Application has one active Applicant.
- Applicant shares sum to 100.
- A Nominee, Guardian, or Payer can be a Related Person.
- On approval, the Application Party rows are copied to Holding Party rows. Proposed. Keep the Application rows for audit.

## 3. Visibility Grant Holding (portal phase)

Status: Deferred. Not built in phase 1.

A child table for the holdings selected in a Visibility Grant.

| Field | Type | Required | Notes |
|---|---|---|---|
| holding | Link (Holding) | Yes | Holding in scope. |
| notes | Small Text | No | Why the Holding is included. |

Rules:

- Used only when `Visibility Grant.scope` is Selected Holdings.
- A Holding appears once per grant.

## 4. Open questions

- OQ-010: Joint ownership shares.
- OQ-011: Ownership history.
- OQ-012: Nominee history.
- OQ-013: Multiple guardians.
- OQ-014: POA scope and expiry.
- OQ-016: Related people in client reports.
