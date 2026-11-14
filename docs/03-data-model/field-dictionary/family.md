# Family field dictionary

Status: Draft.

## 1. Family

A Family is a grouping of Clients. It is not a legal entity.

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| family_code | Data | Yes | Unique. Format `FAM-000001`. |
| family_name | Data | Yes | Name shown to employees. |
| status | Select | Yes | Draft, Active, Inactive. |
| head | Link (Client) | Yes | Required before the Family becomes Active. Must be an active Individual Client member. |
| primary_rm | Link (User) | No | Default RM for the Family. |
| legacy_id | Data | No | Old ID from a migrated system. |
| notes | Small Text | No | Internal notes. |

Rules:

- A Family has no PAN, no KYC, no bank account, and no Holding.
- A Family starts as Draft and becomes Active only when a Head is set.
- A Family has one active Head. The Head is a required field.
- The Head must be an active Family member and an Individual Client.
- A Client heads at most one active Family.
- A Family can contain individual Clients and entity Clients.
- The Head role does not grant ownership or data access.
- A Family is not hard deleted. Use status.
- A Family has no consent field in phase 1. See section 4.

## 2. Family Membership

A Family Membership links one Client to one Family.

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| family | Link (Family) | Yes | Parent Family. |
| client | Link (Client) | Yes | Member Client. |
| role | Select | Yes | Head, Spouse, Child, Parent, Sibling, HUF, Family Business, Family Trust, Dependent, Beneficiary, Other. |
| status | Select | Yes | Active, Inactive. |
| joined_on | Date | No | Date the Client joined the Family. |
| left_on | Date | No | Date the Client became inactive. |
| notes | Small Text | No | Internal notes. |

Rules:

- Unique on `family` and `client`.
- One active Head role per Family. It must match `Family.head`.
- The Head must have an active membership.
- A Client can have many memberships.
- A Client has one primary Family on the Client record. The primary Family must have an active membership.
- An inactive membership stays for reference. Do not keep a full membership history.
- Only a Client can be a member. A Related Person joins after becoming a Client.

## 3. Party Relationship

A Party Relationship is a global link between two Parties. It is not tied to one Holding.

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| from_party | Link (Party) | Yes | Source Party. |
| to_party | Link (Party) | Yes | Target Party. |
| relationship_type | Select | Yes | Spouse, Parent, Child, Sibling, Guardian, Ward, POA Holder, Authorized Signatory, Beneficial Owner, Referrer, Emergency Contact, Other. |
| status | Select | Yes | Active, Inactive, Expired. |
| start_date | Date | No | Start of the relationship. |
| end_date | Date | Conditional | Required for Guardian and POA. |
| share_percentage | Percent | Conditional | Used for Beneficial Owner. |
| scope | Small Text | No | Used for POA and Authorized Signatory. |
| evidence | Attach | No | POA deed or consent proof. Private file. |
| notes | Small Text | No | Internal notes. |

Direction rules:

- Parent links the parent to the child.
- Guardian links the guardian to the minor.
- POA Holder links the holder to the Client.
- Authorized Signatory links the signatory to the entity Client.
- Beneficial Owner links the owner to the entity Client.
- Spouse and Sibling are symmetric. Store one row and show both directions.

Rules:

- A Party cannot link to itself.
- One active relationship per pair and type.
- A Guardian relationship needs an end date. The default is the minor's majority date.
- A POA relationship needs a scope and an end date.
- A Beneficial Owner relationship needs `share_percentage`.
- A Party can be both a Client and a related person.

## 4. Visibility Grant (portal phase)

Status: Deferred. Not built in phase 1.

A Visibility Grant lets one Client see another Client's Family data. It records consent. The design is kept for the portal phase.

Access rules:

- In phase 1, a Family is an employee grouping. No client sees it.
- In the portal phase, the portal checks a Visibility Grant before it shows another Client's data.

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| family | Link (Family) | Yes | Family in scope. |
| grantor | Link (Client) | Yes | Client who gives consent. |
| grantee | Link (Client) | Yes | Client who receives access. |
| scope | Select | Yes | Family Summary, Family Holdings, Selected Holdings. |
| selected_holdings | Table (Visibility Grant Holding) | Conditional | Required when scope is Selected Holdings. |
| purpose | Data | Yes | Why the access is needed. |
| consent_date | Datetime | Yes | When consent was given. |
| expiry_date | Date | No | Optional end date. |
| status | Select | Yes | Active, Revoked, Expired. |
| evidence | Attach | No | Consent proof. Private file. |
| revoked_on | Datetime | No | When access was revoked. |
| revoked_by | Link (User) | No | Employee who recorded the revocation. |
| notes | Small Text | No | Internal notes. |

Rules:

- Grantor and grantee must be different Clients.
- Both must be active members of the Family.
- The grantee is normally the Family Head.
- An adult Client gives consent. A Guardian gives consent for a minor. An Authorized Signatory or Karta gives consent for an entity.
- A grant can be revoked at any time.
- An expired grant is read-only.
- The portal, when built, must check this record before showing another Client's data.
- Employees do not use Visibility Grant. They follow role-based access.

## 5. Open questions

- OQ-006: Head sees details or totals. Deferred to the portal phase.
- OQ-008: Non-Client members.
- OQ-009: Head limited to the primary Family.
- OQ-013: Multiple guardians.
- OQ-014: POA scope and expiry.
- OQ-029: Portal consent capture.
