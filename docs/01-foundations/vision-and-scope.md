# Vision and scope

Status: Draft. Last updated: 2026-11-16.

## 1. Purpose

KNAPS distributes financial products. The current branches contain a SIF website and a light CRM. Dhanada will become the back-office system for the whole distribution business.

## 2. Business context

KNAPS distributes:

- SIF
- Mutual funds
- NPS
- Life insurance
- General insurance
- Health insurance
- NBFC fixed deposits
- Post office small savings and RD
- PMS
- AIF

KNAPS acts as a direct distributor for some products and as a sub-broker of a national distributor for others. In both cases, the client belongs to KNAPS. The national distributor pays commission for some products.

## 3. Goals for phase 1

- One client record across all products.
- One family view for relationship management.
- A product catalog for every line.
- Manual holdings and transactions for every line.
- Lead capture and conversion.
- Onboarding and KYC tracking.
- Servicing reminders for premiums, maturities, reviews, and KYC expiry.
- Commission recording and reconciliation.
- A public website for product information and lead capture.

## 4. Scope

### In scope

- Back-office suite for employees.
- Public website.
- Client, Party, Family, and related-party model.
- Product, provider, plan, application, holding, and transaction.
- Lead management.
- Onboarding and KYC.
- Servicing and reminders.
- Commission model.
- Consent records.
- Licensing and registration expiry.
- Roles, permissions, and audit.

### Out of scope for phase 1

- Client portal.
- Order placement and trading terminal.
- Accounting, payroll, and tax filing.
- Document vault and e-sign.
- Chatbot.
- Mobile app.
- Insurance quotes and benefit illustrations.
- Product comparison engine.
- RTA feeds.
- Family and revenue dashboards. They are documented and built later.

## 5. Users

The employee is the primary user in phase 1. The design must not require technical training.

| User | Phase | Read |
|---|---|---|
| Relationship Manager, Senior RM, Operations, Compliance, Management, Administrator | 1 | [Personas and roles](personas-and-roles.md) |
| Service Desk | 1 | [Servicing](../02-model/08-servicing.md) |
| Client and Family Head | 2, portal | [Personas and roles](personas-and-roles.md) |
| Website visitor | 1, as a Lead | [Leads and applications](../02-model/05-leads-and-applications.md) |

## 6. Operating principles

- Security and privacy come first.
- One client identity across products.
- Family is a grouping, not a legal owner.
- A role is not ownership.
- A client report lists Holdings, not Family.
- A Holding has at most three Owners and no owner share.
- A guardian belongs to a Holding.
- One source of truth for each fact.
- High-risk actions are auditable.
- Use plain business terms in the UI.

## 7. Phases

| Phase | Focus | Main additions |
|---|---|---|
| 1 | Back office and website | Party, Client, Family, products, holdings, manual transactions, leads, onboarding, servicing, commission recording, website lead capture |
| 2 | Automation and client access | RTA feeds, client portal, per-product KYC, family reporting, revenue dashboards, insurance quotes |
| 3 | Scale and advanced distribution | Sub-agents, advanced commission calculation, product comparison, e-sign, document vault |

## 8. Design position

The current rule for each area lives on its model page. This table is the index, not a second copy.

| Area | Position | Read |
|---|---|---|
| Identity | A hidden Party holds identity. Client is a role record. UUID key, immutable client code, PAN optional. No Prospect. | [Party and Client](../02-model/01-party-and-client.md) |
| Family | A grouping of Parties, never a legal entity. Membership links a Party. Every Active Family has one Head. Lineage is derived. | [Family](../02-model/02-family.md) |
| Ownership | One to three Owners by rank, no owner share. Guardian on the Holding. Nominee shares total 100. Entity AUM is separate. | [Related parties and ownership](../02-model/03-related-parties-and-ownership.md) |
| Products | One hybrid catalog for all lines. Plan is the unit of sale. Rate and NAV are history rows. | [Products and providers](../02-model/04-products-and-providers.md) |
| Sales | A Lead is separate and can link to an existing Client. A client report is holding-based. | [Leads and applications](../02-model/05-leads-and-applications.md) |
| Records | Do not hard delete. Keep an audit trail. Keep one source per fact. | [Data model](../03-reference/data-model.md) |
| Access | Least privilege, masked PII, audited high-risk actions. | [Access and audit](../02-model/09-access-and-audit.md) |
| Scope | One KNAPS instance, India and INR, employees in phase 1, website in phase 1. Aadhaar and POA are deferred. | This page |

## 9. Assumptions

- Single KNAPS instance, India, and INR.
- Employees use the back office in phase 1. The client portal is later.
- Manual transaction entry. RTA and provider feeds come later.
- One KYC record per Client in phase 1.
- No Aadhaar, document vault, or e-sign in phase 1.
- The website reads Product and Plan only.
- Client reports are holding-based.

## 10. Open questions

See the [open questions register](../03-reference/open-questions.md).

The most important open questions:

- OQ-017: Product model.
- OQ-019: Legal entity structure.
- OQ-020: Commission scope.
- OQ-023: Employee and RM model.
- OQ-021: Website features.
