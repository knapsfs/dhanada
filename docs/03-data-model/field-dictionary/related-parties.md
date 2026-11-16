# Related party field dictionary

Status: Draft. Last updated: 2026-11-16.

## 1. Holding Party

A Holding Party is a Party with a role on one Holding. It covers owners and non-owners.

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| holding | Link (Holding) | Yes | Parent Holding. |
| party | Link (Party) | Yes | Person or organization in the role. |
| role | Select | Yes | Owner, Nominee, Life Assured, Beneficiary, Payer, Guardian, Authorized Signatory. |
| holder_rank | Int | Conditional | Required for Owner. Values 1, 2, 3. Rank 1 is the Primary Holder. |
| share_percentage | Percent | Conditional | Nominee only. Two or more nominees must total 100. |
| acts_for | Link (Party) | Conditional | Guardian only. The minor Party the guardian acts for. |
| status | Select | Yes | Active, Inactive, Expired. |
| effective_from | Date | No | Start of the role. |
| effective_to | Date | Conditional | Required for Guardian. Default is the minor's majority date. |
| notes | Small Text | No | Internal notes. |

Rules:

- Every Holding has at least one active Owner and at most three.
- Exactly one Owner has `holder_rank` 1. The UI calls this the **Primary Holder**.
- Rank 2 and 3 are **Joint Holders**. The UI shows a Joint badge.
- Do not store an ownership share. Providers do not record one.
- One Party has one active Owner role per Holding.
- A minor owner is the only Owner on the Holding. A minor cannot be a Joint Holder.
- A Holding with a minor owner needs one active Guardian row with `acts_for` set to the minor.
- A Guardian may be a Client or a Related Person. A Guardian may also be an Owner on another Holding.
- A Guardian row needs an end date. The default is the minor's majority date.
- A minor nominee needs a Guardian row. Use Guardian, not appointee.
- A Guardian role does not grant ownership.
- A Nominee role does not grant ownership until a claim or transfer.
- Two or more Nominee rows must total 100. One Nominee can be 100 or blank.
- Owner and Nominee are conflicting roles for the same Party on the same Holding. Use one active role.
- An Owner must be a Client. Proposed. A Related Person becomes a Client before becoming an Owner.
- Do not copy name, PAN, or contact data into this record. Link to Party.

`mode_of_holding` belongs on the Holding, not on this row. See [`distribution.md`](distribution.md).

## 2. Application Party

An Application Party is a Party with a role during an Application. It mirrors the Holding Party roles for the application stage.

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| application | Link (Application) | Yes | Parent Application. |
| party | Link (Party) | Yes | Person or organization in the role. |
| role | Select | Yes | Applicant, Nominee, Life Assured, Guardian, Payer, Authorized Signatory. |
| holder_rank | Int | Conditional | Required for Applicant. Values 1 to 3. Rank 1 is the main applicant. |
| share_percentage | Percent | Conditional | Nominee only. Two or more nominees must total 100. |
| acts_for | Link (Party) | Conditional | Guardian only. The minor Party. |
| status | Select | Yes | Active, Inactive. |
| notes | Small Text | No | Internal notes. |

Rules:

- An Application has at least one active Applicant and at most three.
- Exactly one Applicant has `holder_rank` 1.
- Do not store an applicant share.
- A Nominee, Guardian, or Payer can be a Related Person.
- On approval, the Application Party rows are copied to Holding Party rows. Proposed. Keep the Application rows for audit.
- Application Party is the snapshot of what the form said at submission. Holding Party is the current state.

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

## 4. Holder and nominee rules

| Rule | Value |
|---|---|
| Maximum owners per Holding | 3 |
| Owner share stored | No |
| Owner order stored | Yes, `holder_rank` |
| Primary Holder | Rank 1 |
| Joint Holder | Rank 2 or 3 |
| Maximum nominees | No limit in phase 1 |
| Nominee share stored | Yes, when there is more than one |
| Nominee share total | 100 |
| Guardian scope | Holding |
| Guardians per minor per Holding | 1 |
| Guardian can be a Related Person | Yes |
| Minor as joint holder | No |
| Minor as sole owner | Yes |

## 5. Ownership history and nominee history

- The Holding Party rows show the **current** state.
- An ownership change is recorded in `Ownership Event`. The event is append-only. See OQ-011.
- A nominee change is recorded in a Service Request, then the Holding Party rows are updated. There is no Nominee History DocType. See OQ-012.
- A data feed in phase 2 updates the current nominee. Create a Service Request only when KNAPS performed the change.

## 6. Open questions

- OQ-011: Ownership history options.
- OQ-014: POA scope and expiry. Deferred.
- OQ-015: Beneficial owner depth in phase 1.
