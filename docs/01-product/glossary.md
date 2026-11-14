# Glossary

Status: Draft.

Use one name for one concept. This page is the reference for names in the document, the data model, and the UI.

## Core identity

| Term | Definition | Do not use |
|---|---|---|
| Party | Any person or organization known to KNAPS. A Party holds identity data. It may or may not be a Client. | Person, Entity, Contact |
| Client | A Party with a client relationship with KNAPS. A Client is a role record for a Party. | Customer, Investor, Account |
| Related Person | A Party known to KNAPS that is not a Client. It can hold roles such as nominee, guardian, or signatory. | Contact, Nominee (as a general term) |
| Client Code | A short human-readable code shown to employees. It sits beside the UUID. Format `CL-000001`. Unique and immutable. | Client ID |
| UUID | A random identifier used as the internal key. It is not a business identifier. | Primary key, PAN |
| Family | A grouping of Clients used by employees to track a household. A Family is not a legal entity and cannot own assets. | Household, Group, HUF |
| Family Head | The Client who coordinates a Family. Every Active Family has one. The Head must be an Individual Client. A Client can head only one active Family. | Patriarch, Group Head |
| Family Membership | The link between a Client and a Family. It has a role and an active or inactive status. | Family Member (as a record name) |
| Primary Family | The Family that represents a Client's own household. A Client has at most one. | Main Family |
| Family View | The employee screen that groups Clients by Family. It has two forms: Families as nodes and People as nodes. | Family Tree |
| People Map | A read-only view of the Parties around one Client, to a depth of two hops. It is a graph, not a stored tree. | Family Tree |
| HUF | Hindu Undivided Family. An HUF is a Client of type HUF. The Karta manages it. | Family |
| Karta | The person who manages an HUF. The HUF is the Client and the owner. | HUF Head, Family Head |

## Sales and distribution

| Term | Definition | Do not use |
|---|---|---|
| Lead | A person or organization that has shown interest in a product. A Lead can link to an existing Client. | Prospect, Opportunity |
| Provider | An organization that issues or manages a product. Examples: AMC, insurer, NBFC, post office, NPS, PMS manager, AIF manager, national distributor. | Company, Vendor |
| Product | A sellable product family. Examples: a mutual fund scheme, an insurance plan, an FD product. | Scheme (as the generic term) |
| Plan | A sellable variant of a Product. Examples: direct or regular plan, growth or IDCW option, rider, tenure and rate slab. Use the UI label Scheme for MF and NPS, and Plan for insurance. | Variant, Option (as the record name) |
| Application | A request to buy a product or onboard into it. An Application can create at most one Holding. | Proposal, Order |
| Holding | The Client's position in a Product. Examples: policy, folio, PRAN, FD receipt, post office account, PMS account, AIF account. The UI label is Investment. | Account, Portfolio |
| Owner | A Party with an ownership share in a Holding. The legal owner of an entity Holding is the entity Client. | Holder |
| Primary Owner | The main owner of a Holding. A sole owner has 100%. | Primary Holder |
| Joint Holder | An Owner with another Owner on the same Holding. A Joint Holder has a share. | Co-holder |
| Nominee | A Party named to receive the value of a Holding on the owner's death. A Nominee is not an Owner until a claim or transfer. | Beneficiary |
| Beneficiary | A Party entitled to a benefit from a trust or Holding. A Beneficiary is not an Owner until vesting or transfer. | Nominee |
| Guardian | A Party who acts for a minor Client. The role expires at majority. | Custodian |
| POA Holder | A Party with a power of attorney to act for a Client. It has a scope and an expiry. | Authorized Signatory |
| Authorized Signatory | A Party who can sign for an entity Client. | Director |
| Beneficial Owner | A Party who ultimately owns or controls an entity Client. A Beneficial Owner is not an Owner of the entity's Holdings. | Shareholder |
| Business Source | How the business arrived. Examples: direct, national distributor, website, referral, campaign. | Lead Source |
| Distribution Partner | A national distributor or other intermediary that provides product access or pays commission. | Broker |

## Servicing and marketing

| Term | Definition | Do not use |
|---|---|---|
| Service Request | A tracked client request or service event. Examples: claim assistance, grievance, bank change, nominee change. | Ticket, Complaint |
| Review | A scheduled client or Family review meeting. | Meeting |
| Reminder | A scheduled task for a future event, such as a premium due date or maturity. | Alert, Notification |
| Consent | A recorded permission from a Party for a purpose and a channel. | Opt-in |
| Visibility Grant | Portal phase. A consent record that lets one Client see another Client's Family or Holding data. It is not built in phase 1. | Sharing |
| Campaign | A marketing activity aimed at a segment. | Promotion |

## Employees and access

| Term | Definition | Do not use |
|---|---|---|
| Employee | A KNAPS staff member with a Frappe User account. | User |
| Relationship Manager (RM) | An employee who manages client relationships. Use RM, not Advisor. Adviser is a regulated term. | Advisor, Agent |
| Team | A group of employees with a leader. Used for client assignment and visibility. | Department |
| Client Assignment | The link between a Client and an RM or another employee role. | Ownership |
| Commission | Revenue earned from a Provider or Distribution Partner on an Application, Holding, or Transaction. | Revenue, Fee |

## Product categories

| Term | Definition |
|---|---|
| SIF | Specialised Investment Fund. A SEBI product category. |
| MF | Mutual Fund. |
| NPS | National Pension System. |
| PMS | Portfolio Management Service. |
| AIF | Alternative Investment Fund. |
| NBFC FD | A fixed deposit with a Non-Banking Financial Company. |
| Post Office Scheme | A small savings or recurring deposit scheme offered by India Post. |

## Measures and records

| Term | Definition |
|---|---|
| KYC | Know Your Customer. The identity verification record for a Client. |
| AUM | Assets Under Management. The total value of Holdings owned by Clients, counted by the ownership rules. |
| Personal AUM | AUM of individual Clients. |
| Entity AUM | AUM of entity Clients, such as an HUF or a company. Reported on a separate line from personal AUM. |
| RTA | Registrar and Transfer Agent. A service provider for mutual fund records. |

## Naming rules

- Use **Client** in the UI. Do not use Customer or Investor.
- Use **Family** in the UI. Do not use Household or Group.
- Use **Related Person** for a Party without a Client record.
- Use **Investment** as the UI label for Holding. Show the type beside it: Policy, Folio, FD, PRAN.
- Use **Plan** in the data model. Show Scheme for MF and NPS, and Plan for insurance.
- Use **Provider** in the data model. Show AMC, Insurer, NBFC, or Post Office by category.
- Use **RM** in the UI. Do not use Advisor.
- Use **Service Request** for client requests. Use **Grievance** only for a formal complaint.
