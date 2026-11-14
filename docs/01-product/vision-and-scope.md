# Vision and scope

Status: Draft.

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

- Relationship Manager (RM)
- Senior RM or Team Lead
- Operations
- Compliance
- Management
- Administrator
- Client, later through the portal
- Website visitor, as a lead

The employee is the primary user in phase 1. The design must not require technical training.

## 6. Operating principles

- Security and privacy come first.
- One client identity across products.
- Family is a grouping, not a legal owner.
- A role is not ownership.
- One source of truth for each fact.
- High-risk actions are auditable.
- Use plain business terms in the UI.

## 7. Phases

| Phase | Focus | Main additions |
|---|---|---|
| 1 | Back office and website | Party, Client, Family, products, holdings, manual transactions, leads, onboarding, servicing, commission recording, website lead capture |
| 2 | Automation and client access | RTA feeds, client portal, per-product KYC, family reporting, revenue dashboards, insurance quotes |
| 3 | Scale and advanced distribution | Sub-agents, advanced commission calculation, product comparison, e-sign, document vault |

## 8. Decisions already made

1. A Client is a legal person or entity. The internal key is a UUID, not PAN. PAN is optional and unique when present.
2. Every Client has a client code, `CL-000001`. It is unique and immutable.
3. There is no Prospect status. A sales opportunity is a Lead. Client statuses are Onboarding, Active, Dormant, Closed.
4. HUF, company, trust, and LLP are Client types. Family is always a grouping.
5. A Client may have no Family. A Client may belong to more than one Family, with one primary Family.
6. Family membership is back-office only. Only the current state is kept, with active and inactive members.
7. Every Active Family has a Head. The Head is an Individual Client. A Client can head at most one active Family.
8. Family stays flat. Lineage is derived from shared Clients. The employee view uses Families as nodes, plus a two-hop people map. No Tree DocType is used for Family.
9. Entity AUM is reported on a separate line. It is never added to personal AUM.
10. Minors are Clients and need a guardian.
11. A Lead is separate and can link to an existing Client. One Client can have many Leads over time.
12. Frappe `Address` and `User` are reused.
13. The app is one KNAPS instance. NPS, MF, SIF, PMS, and AIF sit in one legal entity.
14. Employees only for now. A national distributor pays commission for some products.
15. Track all licenses and registrations with expiry reminders.
16. All product lines are in phase 1 for catalog and holdings. Transactions are manual.
17. Commission and revenue are in scope.
18. KYC starts as one record per Client. Per-product KYC comes later.
19. Servicing covers premium due, policy lapse, FD and RD maturity, NPS contribution, SIP failure, KYC expiry, reviews, claims, and grievances.
20. Consent is captured per product and per channel, with history. Family visibility consent is a portal-phase feature.
21. Aadhaar is not collected in phase 1. See OQ-004.
22. Website is in phase 1. Chatbot, accounting, payroll, tax filing, trading terminal, and document vault are out.

## 9. Assumptions

- Single KNAPS instance.
- India and INR.
- Employees only.
- Manual transaction entry.
- One KYC record per Client in phase 1.
- No Aadhaar in phase 1.
- Family is an employee grouping in phase 1.
- No document vault.
- Website is in phase 1.
- Client portal is later.

## 10. Open questions

See [`04-decisions/open-questions.md`](../04-decisions/open-questions.md).

The most important open questions:

- OQ-017: Product model.
- OQ-019: Legal entity structure.
- OQ-020: Commission scope.
- OQ-023: Employee and RM model.
- OQ-021: Website features.
