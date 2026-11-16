# Vision and scope

Status: Draft. Last updated: 2026-11-16.

## 1. Purpose

KNAPS distributes financial products. The current branches contain a SIF website and a light CRM. Dhanada will become the back-office system for the whole distribution business.

## 2. Business context

KNAPS distributes financial products. The book has three commercial shapes.

| Shape | Lines | What KNAPS does |
|---|---|---|
| Investment and deposit | Mutual funds, SIF, fixed deposits, RBI floating rate savings bonds, 54EC capital gains bonds, NPS, PMS, AIF, post office schemes | KNAPS sells the product. The Client owns a Holding. |
| Protection | Life, health, and general insurance | KNAPS sells the policy. The Client has cover, not an asset. |
| Referral | Demat, CASA, loans | KNAPS refers the Client to a partner. KNAPS does not own or service the account. |

The book has 15 lines:

- Mutual funds (MF), regular plans only
- Specialised Investment Funds (SIF), regular plans only
- Fixed deposits: bank, corporate, and NBFC
- RBI Floating Rate Savings Bonds
- 54EC Capital Gains Bonds
- Life insurance
- Health insurance
- General insurance
- NPS: individual, corporate, and Vatsalya
- Portfolio Management Services (PMS)
- Alternative Investment Funds (AIF)
- Post office and small savings schemes
- Demat referral through Aditya Birla Money
- CASA referral through HDFC Bank
- Loan referral through banks and NBFCs

KNAPS acts as a direct distributor for some products and as a sub-broker of a national distributor for others. In both cases, the client belongs to KNAPS.

The firm holds one ARN, one APMI, one code per NBFC, and one code per AMC from the RTA.

KNAPS does not sell direct plans. It does not sell traded government securities such as Treasury Bills, State Development Loans, or dated GoI securities.

## 3. Goals for phase 1

- One client record across all products.
- One family view for relationship management.
- A product catalog for every line.
- Manual Holdings and valuations for every line.
- Referral cases for demat, CASA, and loans.
- Lead capture and conversion.
- Onboarding and KYC tracking.
- Servicing reminders for premiums, maturities, reviews, and KYC expiry.
- A public website for product information and lead capture.

## 4. Scope

### In scope

- Back-office suite for employees.
- Public website.
- Client, Party, Family, and related-party model.
- Product, provider, plan, application, and holding.
- Manual Holding entry at the service desk.
- Valuation rows for manual position updates.
- Referral cases for demat, CASA, and loans.
- Lead management.
- Onboarding and KYC.
- Servicing and reminders.
- Consent records.
- Licensing and registration expiry.
- Roles, permissions, and audit.

### Out of scope for phase 1

- Client portal.
- Order placement and trading terminal.
- Transaction recording: SIP, STP, SWP, redemption, switch, maturity posting.
- Commission and payout tracking.
- RTA, AMFI, BSE Star, broker, and NBFC feeds.
- Commission and statement reconciliation.
- Accounting, payroll, and tax filing.
- Document vault and e-sign.
- Chatbot.
- Mobile app.
- Insurance quotes and benefit illustrations.
- Product comparison engine.
- Family and revenue dashboards. They are documented and built later.

## 5. Users

The employee is the primary user in phase 1. The service desk enters most data. The design must not require technical training.

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
- A referral is not a Holding.
- One source of truth for each fact.
- High-risk actions are auditable.
- Use plain business terms in the UI.

## 7. Phases

| Phase | Focus | Main additions |
|---|---|---|
| 1 | Back office and website | Party, Client, Family, catalog, manual Holdings and valuations, referrals, leads, onboarding, servicing, website lead capture |
| 2 | Transactions and automation | Transaction entry, commission and payouts, RTA and AMFI and BSE Star feeds, reconciliation, client portal, family reporting, revenue dashboards, insurance quotes |
| 3 | Scale and advanced distribution | Sub-agents, advanced commission calculation, product comparison, e-sign, document vault |

## 8. Design position

The current rule for each area lives on its model page. This table is the index, not a second copy.

| Area | Position | Read |
|---|---|---|
| Identity | A hidden Party holds identity. Client is a role record. UUID key, immutable client code, PAN optional. No Prospect. | [Party and Client](../02-model/01-party-and-client.md) |
| Family | A grouping of Parties, never a legal entity. Membership links a Party. Every Active Family has one Head. Lineage is derived. | [Family](../02-model/02-family.md) |
| Ownership | One to three Owners by rank, no owner share. Guardian on the Holding. Nominee shares total 100. Entity AUM is separate. | [Related parties and ownership](../02-model/03-related-parties-and-ownership.md) |
| Products | One hybrid catalog. Plan is the unit of sale. Regular plans only. One FD family. Rate and NAV are history rows. | [Products and providers](../02-model/04-products-and-providers.md) |
| Sales | A Lead is separate and can link to an existing Client. A client report is holding-based. | [Leads and applications](../02-model/05-leads-and-applications.md) |
| Holdings | A manual position record. A Valuation row records each value update. No transaction ledger in phase 1. | [Holdings and investments](../02-model/06-holdings-and-investments.md) |
| Referrals | Demat, CASA, and loans are Referral Cases. They never create a Holding or AUM. | [Referrals](../02-model/10-referrals.md) |
| Records | Do not hard delete. Keep an audit trail. Keep one source per fact. | [Data model](../03-reference/data-model.md) |
| Access | Least privilege, masked PII, audited high-risk actions. | [Access and audit](../02-model/09-access-and-audit.md) |
| Scope | One KNAPS instance, India and INR, employees in phase 1, website in phase 1. No transactions, commission, or feeds in phase 1. Aadhaar and POA are deferred. | This page |

## 9. Assumptions

- Single KNAPS instance, India, and INR.
- Employees use the back office in phase 1. The client portal is later.
- Only regular plans are sold.
- Bank, corporate, and NBFC fixed deposits share one product family.
- The catalog is entered manually in phase 1. AMFI and BSE Star importers come in phase 2.
- Holdings are entered manually. A Valuation row records each value update.
- No transaction ledger, commission, or reconciliation in phase 1.
- One KYC record per Client in phase 1.
- No Aadhaar, document vault, or e-sign in phase 1.
- The website reads Product and Plan only.
- Client reports are holding-based.

## 10. Open questions

See the [open questions register](../03-reference/open-questions.md).

The most important open questions:

- OQ-017: Product model.
- OQ-019: Legal entity structure.
- OQ-023: Employee and RM model.
- OQ-021: Website features.
- OQ-034: Referral case scope.
- OQ-036: SIF minimum investment.
- OQ-039: Scheme master import.
