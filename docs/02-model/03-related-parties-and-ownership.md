# Related parties and ownership

Status: Draft. Last updated: 2026-11-16.

This page explains how Dhanada records the people around a Client or a Holding. It separates identity from roles, and roles from ownership.

## In plain words

Not everyone linked to a Client is a Client. A nominee, a guardian, a company director, or a family member can be a **Related Person**. A Related Person has an identity record but no client relationship.

A **role** links a person to a Client or an Investment. A role is not ownership. A nominee owns nothing until a claim. A guardian acts for a minor but does not own the minor's money. A director signs for a company but does not own the company's fixed deposit.

Only an **Owner** adds to AUM. A Holding has one to three Owners, in order. The first Owner is the Primary Holder. The others are Joint Holders. Dhanada stores the order, not a percentage, because providers do not record a percentage.

Worked examples: [joint holders and nominee](../04-scenarios/joint-holders-and-nominee.md), [minor and guardian](../04-scenarios/minor-and-guardian.md), and [company and HUF](../04-scenarios/company-and-huf.md).

## Principles

1. A Party is the identity. A role is a link to a Party.
2. A role is not ownership.
3. A Party can hold many roles across Clients and Holdings.
4. A Related Person can become a Client without a data copy.
5. Global relationships are separate from Holding roles.
6. AUM uses ownership, not roles.
7. A minor is a sole owner. A guardian acts for the minor on a Holding.

## Role catalog

| Role | Scope | Owner | Notes |
|---|---|---|---|
| Owner | Holding | Yes | Rank 1 to 3. Rank 1 is the Primary Holder. |
| Nominee | Holding | No | Receives on death, subject to claim. Share is stored when there are two or more. |
| Life Assured | Holding | No | Insurance only. |
| Beneficiary | Holding or trust | No | May become owner on vesting. |
| Guardian | Holding | No | Acts for a minor. One per minor per Holding. Expires at majority. |
| Payer | Holding | No | Premium or contribution payer. |
| Authorized Signatory | Client | No | Acts for an entity. |
| Beneficial Owner | Client | No | Owns or controls the entity, not its Holdings. |
| Karta | Client (HUF) | Yes, for the HUF | Manages the HUF. |
| Trustee | Client (Trust) | No | Manages trust assets. |
| Settlor | Client (Trust) | No | Creates the trust. |
| Referrer | Lead or Client | No | Attribution only. |
| Emergency Contact | Client | No | Service use only. |
| Family Head | Family | No | Coordination label for employees. No ownership and no data access. |
| Family Member | Family | No | Grouping only. A member can be a Related Person. |
| POA Holder | Client | No | Deferred. Not in phase 1. See OQ-014. |

The UI shows **Primary Holder** for rank 1 and **Joint Holder** for rank 2 or 3. Both are the Owner role in the data.

## Where roles live

| Record | Use | Examples |
|---|---|---|
| Party Relationship | A global link between two Parties. | Spouse, parent, child, authorized signatory, beneficial owner, referrer |
| Holding Party | A role on one Holding. | Owner, nominee, life assured, beneficiary, payer, guardian |
| Application Party | A role during an Application. | Applicant, nominee, guardian, payer |
| Family Membership | A role in a Family. | Head, spouse, child, HUF, family business, family trust |
| Client Assignment | An employee role for a Client. | Primary RM, secondary RM, service RM |

Do not store a person's name and PAN on a Holding. Link to a Party.

A guardian exists only on a Holding. There is no guardian field on Client and no Guardian type in Party Relationship. One parent can act on one deposit, the other parent on another.

### Global relationships

A Party Relationship is not tied to one Holding. It records the fact that two Parties are related, such as spouse, parent, child, sibling, authorized signatory, or beneficial owner.

- Parent links the parent to the child. Child is the reverse direction. Store Parent and show both.
- Authorized Signatory links the signatory to the entity Client.
- Beneficial Owner links the owner to the entity Client and needs a share percentage.
- Spouse and Sibling are symmetric. Store one row and show both directions.
- A Party cannot link to itself.
- One active relationship per pair and type.

### Application roles

An Application Party is the role row during an Application. It mirrors the Holding Party roles for the application stage.

- An Application has at least one active Applicant and at most three.
- Exactly one Applicant has `holder_rank` 1.
- Do not store an applicant share.
- A Nominee, Guardian, or Payer can be a Related Person.
- On approval, the Application Party rows are copied to Holding Party rows. Keep the Application rows for audit.
- Application Party is the snapshot of what the form said at submission. Holding Party is the current state.

## Ownership rules

1. Every Holding has at least one Owner and at most three.
2. Owners are ordered by `holder_rank`: 1, 2, and 3. Rank 1 is the Primary Holder.
3. Do not store an ownership share. Providers do not record one.
4. An Owner must be a Client. Proposed. A Related Person who becomes an Owner must first become a Client.
5. A minor owner is the only Owner. A minor cannot be a Joint Holder.
6. A Nominee, Guardian, Life Assured, Beneficiary, Payer, or Family Head is not an Owner unless a separate Owner row exists.
7. The legal Owner of an entity Holding is the entity Client. Its shareholders and Beneficial Owners are not Owners of the Holding.
8. The legal Owner of an HUF Holding is the HUF Client. The Karta acts for it. Family members are not Owners of HUF assets.
9. AUM uses Owner rows. It does not use roles.
10. A Related Person can become a Client without changing any role row. The Party link stays.
11. A Guardian role has an end date. Create a review task at majority.
12. An ownership change on death, claim, gift, or transfer is a recorded event. Keep the current Owner and an ownership history.
13. A nominee change is a Service Request, then an update of the current Nominee rows. There is no separate nominee history table.
14. POA is deferred.

### Joint holders and nominees

- The Holding stores `mode_of_holding`: Single, Joint, Anyone or Survivor, Former or Survivor.
- One to three Owner rows carry `holder_rank`.
- No owner share is stored.
- A nominee row may carry a share. One nominee can be 100 or blank. Two or more nominees must total 100.
- Owner and Nominee are conflicting roles for the same Party on the same Holding. Use one active role.
- A minor nominee needs a Guardian row. Use Guardian, not appointee.
- A Guardian row carries `acts_for`, which points to the minor Party.
- A Guardian may be a Client or a Related Person. A Guardian may also be an Owner on another Holding.

### Ownership history

The Holding Party rows show the **current** state. An ownership change is recorded in `Ownership Event`. The event is append-only.

| Option | What it stores | Result |
|---|---|---|
| 1. Current state only | Owner rows | Simplest. No answer to "who owned it then". |
| 2. Ownership Event log | Append-only row per change | Readable history, claim-ready. Recommended. |
| 3. Full temporal owner rows | Every row has effective dates | Complex validation and many rows. |

Rules for option 2:

1. Owner rows stay current.
2. The event log is append-only.
3. A wrong event is reversed by a new event, never edited.
4. A claim or transfer Service Request links to the event.
5. Event types: Death, Survivor Transfer, Claim Settlement, Gift, Sale, Transfer, Correction.

A nominee change is different. Record a Service Request, then update the Holding Party rows. There is no Nominee History DocType. A data feed in phase 2 updates the current nominee. Create a Service Request only when KNAPS performed the change.

## AUM and reporting

- Credit the full Holding value to the rank 1 Owner.
- A Joint Holder sees the Holding in their portfolio with a **Joint** badge and no personal value.
- Count each Holding once at the firm level.
- Count each Holding once per Family.
- Report personal AUM and entity AUM on separate lines at Family level.
- Entity Holdings belong to the entity Client. Do not count them again under directors or shareholders. Report them as Entity AUM.
- HUF Holdings belong to the HUF Client. Do not count them again under family members. Report them as Entity AUM.
- Nominee, Beneficiary, Guardian, and Payer roles do not add AUM.
- A joint holder outside the Family sees a memo row: "Joint interest in FD with Ram Sharma". The memo row has no value.
- The same Holding can appear in two Family reports when the Owners belong to different Families. The firm-level total counts it once.
- Client reports are holding-based. They do not use the Family view. See [ADR-0008](../03-reference/decisions/adr-0008-client-reports-are-holding-based.md).
- Use the current Owner for operational reports. Use ownership history for audit and claims.

## How the cases behave

### Nominee becomes a Client

Mr. A names Mrs. B as Nominee. Mrs. B is a Party with a Nominee role and no Client record. Later, Mrs. B becomes a Client. Create the Client record for the same Party. The Nominee row now resolves to a Client. No data is copied.

### Minor Client

Aarav is 12 and has no PAN. He is a Client of type Minor. He owns one FD as the only Owner, rank 1. Mohan is the Guardian on that FD. Sita is the Guardian on a second FD that Sita opened for him.

The Guardian row carries `acts_for` = Aarav. On the majority date, both Guardian rows expire and Aarav becomes the decision maker. Aarav is never a joint holder.

### Joint holders

Ram and Sita open one FD. Ram is rank 1 and Sita is rank 2. No share is stored.

- Ram's personal AUM includes the full FD value.
- Sita sees the FD with a Joint badge and no personal value.
- Family A counts the FD once.
- The firm counts the FD once.

The bank statement also shows first holder and second holder only. The stored data matches the statement.

### Company Client

The company is the Client and the Owner. The director is a Party with an Authorized Signatory role on the Client. The shareholders are Parties with Beneficial Owner roles on the Client. Company AUM stays with the company.

### HUF Client

The HUF is the Client and the Owner. The Karta is a Party with a Karta role on the HUF Client. The HUF's assets are not personal assets of the Karta or the family members.

### Death claim

The policyholder dies. The Nominee claims. The claim is a Service Request. On settlement, record an ownership event, expire the Nominee role, and add the Nominee as Owner. Keep the history.

For a joint deposit, the survivor becomes rank 1. Record an Ownership Event of type Survivor Transfer. Do not edit the old rows without an event.

## Rules and invariants

1. A Holding has at least one Owner and at most three.
2. Exactly one Owner has rank 1.
3. No ownership share is stored.
4. One Party has one active Owner role per Holding.
5. Owner and Nominee are conflicting roles for the same Party on the same Holding. Use one active role.
6. A minor owner is the only Owner on the Holding.
7. A Holding with a minor owner needs one active Guardian row with `acts_for`.
8. A Guardian role needs an end date for a minor.
9. Two or more Nominee rows on a Holding total 100.
10. A Party can be both a Client and a related person.
11. A Related Person can hold non-owner roles without a Client record.
12. A Related Person must become a Client before becoming an Owner. Proposed.
13. A Family Head cannot own Family assets through the Head role.
14. Entity AUM is never added to personal AUM.
15. Client reports never include related people. They list Holdings.

## Records and fields

| Record | Purpose | Key links |
|---|---|---|
| Party Relationship | Global relationship between two Parties. | Party, Party |
| Holding Party | Role on one Holding. | Holding, Party |
| Application Party | Role during one Application. | Application, Party |
| Ownership Event | Append-only ownership change on a Holding. | Holding, Party, Service Request |
| Client Assignment | Employee role for a Client. | Client, User |

<details>
<summary>Full field list: Party Relationship</summary>

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| from_party | Link (Party) | Yes | Source Party. |
| to_party | Link (Party) | Yes | Target Party. |
| relationship_type | Select | Yes | Spouse, Parent, Child, Sibling, Referrer, Emergency Contact, Authorized Signatory, Beneficial Owner, Other. |
| status | Select | Yes | Active, Inactive, Expired. |
| start_date | Date | No | Start of the relationship. |
| end_date | Date | No | End of a time-bound relationship. |
| share_percentage | Percent | Conditional | Used for Beneficial Owner. |
| scope | Small Text | No | Used for Authorized Signatory. |
| evidence | Attach | No | Consent proof. Private file. |
| notes | Small Text | No | Internal notes. |

Rules:

- A Party cannot link to itself.
- One active relationship per pair and type.
- A Beneficial Owner relationship needs `share_percentage`.
- There is no Guardian type in phase 1. A guardian exists on a Holding.
- POA Holder is deferred. Do not add the option in phase 1. See OQ-014.
- A Party can be both a Client and a related person.

</details>

<details>
<summary>Full field list: Holding Party</summary>

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
- Exactly one Owner has `holder_rank` 1.
- Rank 2 and 3 are Joint Holders. The UI shows a Joint badge.
- Do not store an ownership share.
- One Party has one active Owner role per Holding.
- A minor owner is the only Owner on the Holding.
- A Holding with a minor owner needs one active Guardian row with `acts_for` set to the minor.
- A Guardian may be a Client or a Related Person.
- A Guardian row needs an end date. The default is the minor's majority date.
- A minor nominee needs a Guardian row.
- A Guardian role does not grant ownership.
- A Nominee role does not grant ownership until a claim or transfer.
- Two or more Nominee rows must total 100. One Nominee can be 100 or blank.
- Owner and Nominee are conflicting roles for the same Party on the same Holding.
- An Owner must be a Client. Proposed.
- Do not copy name, PAN, or contact data into this record. Link to Party.

`mode_of_holding` belongs on the Holding, not on this row. See [Holdings and investments](06-holdings-and-investments.md).

</details>

<details>
<summary>Full field list: Application Party</summary>

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

</details>

<details>
<summary>Full field list: Ownership Event</summary>

| Field | Type | Required | Notes |
|---|---|---|---|
| holding | Link (Holding) | Yes | Holding that changed. |
| event_date | Date | Yes | Date of the change. |
| event_type | Select | Yes | Death, Survivor Transfer, Claim Settlement, Gift, Sale, Transfer, Correction. |
| from_party | Link (Party) | No | Previous owner. |
| to_party | Link (Party) | No | New owner. |
| service_request | Link (Service Request) | No | Claim or transfer request. |
| evidence | Attach | No | Supporting document. Private file. |
| notes | Small Text | No | Why the event was recorded. |

</details>

## Who can see or change it

Ownership roles follow the record that holds them. Holding roles use the Holding rules. Family roles use the Family Membership rules. Party relationships use the Party Relationship rules.

Nominee and guardian details are sensitive fields. They are masked by default. A nominee change is high risk and needs maker-checker. The full matrix is in [Access and audit](09-access-and-audit.md).

## Decisions and open questions

| Topic | Status | Decision | Record |
|---|---|---|---|
| Ownership share | Decided | Do not store it. Store rank 1 to 3. Maximum three holders. | [ADR-0007](../03-reference/decisions/adr-0007-holdings-holders-and-nominees.md) |
| Nominee share | Decided | Store it when there are two or more nominees. Total 100. | ADR-0007 |
| Guardian scope | Decided | One guardian per minor per Holding. No client-level guardian. | ADR-0007 |
| AUM attribution | Decided | Full value to the Primary Holder. Joint Holder sees no value. | ADR-0007 |
| Client reports | Decided | Holding-based, never Family-based. | [ADR-0008](../03-reference/decisions/adr-0008-client-reports-are-holding-based.md) |
| Ownership history | Open | Use an append-only Ownership Event log? | OQ-011 |
| Beneficial owner depth | Open | Basic fields or full KYC in phase 1? | OQ-015 |
| POA | Deferred | No POA role in phase 1. | OQ-014 |

## Worked example

Ram and Sita open a fixed deposit of ₹20,00,000. Ram is the Primary Holder. Sita is the Joint Holder. The bank records first holder and second holder. It does not record a percentage, so Dhanada does not store one either.

They name two nominees: Mohan gets 60% and Diya gets 40%. Diya is 8, so Radha is the guardian for Diya on this deposit.

Ram also has a life insurance policy of ₹50,00,000. Sita is the nominee on that policy, with 100%.

| Holding | Party | Role | Rank | Nominee share | Acts for |
|---|---|---|---|---|---|
| FD | Ram Sharma | Owner | 1 | - | - |
| FD | Sita Sharma | Owner | 2 | - | - |
| FD | Mohan Sharma | Nominee | - | 60% | - |
| FD | Diya Sharma | Nominee | - | 40% | - |
| FD | Radha Sharma | Guardian | - | - | Diya Sharma |
| Policy | Ram Sharma | Owner | 1 | - | - |
| Policy | Sita Sharma | Nominee | - | 100% | - |

A nominee is not an owner. A joint holder is an owner. Full story: [joint holders and nominee](../04-scenarios/joint-holders-and-nominee.md).
