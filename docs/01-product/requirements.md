# Requirements

Status: Draft.

## 1. Purpose

This page lists the functional and non-functional requirements by module. It is a working list. Detailed workflows come later.

## 2. How to read this page

- **Phase** shows when the requirement is needed.
- **Status** is Decided, Proposed, Open, or Deferred.
- An Open requirement links to an ID in the [open questions register](../04-decisions/open-questions.md).
- A requirement is a business need. It is not a screen design.

## 3. Pre-Sales

| ID | Requirement | Phase | Status |
|---|---|---|---|
| PS-01 | Capture a Lead from the website, phone, walk-in, referral, or campaign. | 1 | Decided |
| PS-02 | Link a Lead to an existing Client for a new product interest. | 1 | Decided |
| PS-03 | Record source, campaign, product interest, owner, and next follow-up. | 1 | Decided |
| PS-04 | Record interactions: call, meeting, email, WhatsApp, and note. | 1 | Proposed |
| PS-05 | Keep a Lead status history and a lost or junk reason. | 1 | Proposed |
| PS-06 | Convert a Lead to a Client or to an Application for an existing Client. | 1 | Decided |
| PS-07 | Warn about a possible duplicate before creating a Lead. | 1 | Decided |
| PS-08 | Show the Lead pipeline by owner, source, product, and stage. | 1 | Proposed |
| PS-09 | Book and track appointments from the website and the back office. | 1 | Proposed |
| PS-10 | Attribute a Lead to a campaign. | 1 | Open, OQ-021 |

## 4. Sales and onboarding

| ID | Requirement | Phase | Status |
|---|---|---|---|
| SL-01 | Create a Client from a Party with identity, contact, and type. | 1 | Decided |
| SL-02 | Track KYC status and identity documents. | 1 | Decided |
| SL-03 | Track an onboarding checklist and approvals. | 1 | Proposed |
| SL-04 | Create an Application for a Product and Plan. | 1 | Decided |
| SL-05 | Record applicant, joint applicant, nominee, guardian, and payer roles. | 1 | Decided |
| SL-06 | Create a Holding from an approved Application. | 1 | Decided |
| SL-07 | Enter transactions manually for every product. | 1 | Decided |
| SL-08 | Import RTA, CAS, and provider statements. | 2 | Proposed |
| SL-09 | Record commission and reconcile provider statements. | 1 | Open, OQ-020 |
| SL-10 | Track licenses and block a sale when a license is expired. | 1 | Open, OQ-024 |
| SL-11 | Use maker-checker for high-risk changes. | 1 | Open, OQ-025 |
| SL-12 | Record the business source and Distribution Partner on each Application. | 1 | Decided |
| SL-13 | Record ownership shares for joint holders. | 1 | Open, OQ-010 |
| SL-14 | Keep ownership and nominee history. | 1 | Open, OQ-011, OQ-012 |

## 5. Servicing

| ID | Requirement | Phase | Status |
|---|---|---|---|
| SV-01 | Record a portfolio value for each Holding. | 1 | Proposed |
| SV-02 | Create reminders for premium due, maturity, SIP failure, KYC expiry, and review due. | 1 | Decided |
| SV-03 | Schedule and record review meetings. | 1 | Decided |
| SV-04 | Track Service Requests and Grievances. | 1 | Decided |
| SV-05 | Support insurance claim assistance. | 1 | Decided |
| SV-06 | Support NPS partial withdrawal and annuity requests. | 1 | Decided |
| SV-07 | Produce a basic client statement or portfolio report. | 1 | Proposed |
| SV-08 | Produce a consolidated Family report. | 2 | Proposed |
| SV-09 | Show a client portal. | 2 | Decided, phase 2 |
| SV-10 | Show service levels and aging by owner. | 1 | Proposed |
| SV-11 | Record maturity instructions and renewal outcomes. | 1 | Proposed |
| SV-12 | Report personal AUM and entity AUM on separate lines at Family level. | 1 | Decided |

## 6. Marketing

| ID | Requirement | Phase | Status |
|---|---|---|---|
| MK-01 | Publish product information and updates. | 1 | Decided |
| MK-02 | Build segments by product, Family, risk, maturity, and Lead status. | 1 | Proposed |
| MK-03 | Run campaigns by email, WhatsApp, or SMS. | 1 | Open, OQ-021 |
| MK-04 | Record consent per product and per channel, with history. | 1 | Decided |
| MK-05 | Attribute a Lead or Application to a campaign. | 1 | Proposed |
| MK-06 | Publish website product pages, blog, SEO, and testimonials. | 1 | Decided |
| MK-07 | Offer appointment booking on the website. | 1 | Proposed |
| MK-08 | Offer a risk profiler on the website. | 1 | Proposed |
| MK-09 | Support a chatbot. | Out | Decided, out |

## 7. Platform and data

| ID | Requirement | Phase | Status |
|---|---|---|---|
| PL-01 | Model Party, Client, Family, and related parties. | 1 | Decided |
| PL-02 | Search related people globally with masked PII. | 1 | Decided |
| PL-03 | Apply role-based and row-level access. | 1 | Decided |
| PL-04 | Keep an audit trail for high-risk actions. | 1 | Decided |
| PL-05 | Manage a Provider, Product, and Plan catalog. | 1 | Proposed |
| PL-06 | Model a Legal Entity for licenses and commission. | 1 | Open, OQ-019 |
| PL-07 | Attach private documents to records. | 1 | Open, OQ-022 |
| PL-08 | Import and export data with permission. | 1 | Proposed |
| PL-09 | Provide basic operational reports and dashboards. | 1 | Proposed |
| PL-10 | Migrate existing Client, Family, and Lead data. | 1 | Open, OQ-032 |
| PL-11 | Support INR only. | 1 | Proposed |
| PL-12 | Support a mobile app. | Out | Open, OQ-027 |
| PL-13 | Show a Family list, a Family card, and a two-hop people map to employees. | 1 | Decided |
| PL-14 | Require a Head on every Active Family. | 1 | Decided |

## 8. Non-functional requirements

| ID | Requirement | Phase | Status |
|---|---|---|---|
| NF-01 | Enforce least privilege and mask PII by default. | 1 | Decided |
| NF-02 | Encrypt sensitive fields at rest and protect private files. | 1 | Proposed |
| NF-03 | Record consent and support data-principal requests. | 1 | Proposed |
| NF-04 | Keep audit records for the regulator retention period. | 1 | Open, OQ-030 |
| NF-05 | Keep list views and global search responsive at expected volume. | 1 | Open, volume target needed |
| NF-06 | Provide backup and restore. | 1 | Proposed |
| NF-07 | Validate data at entry and prevent duplicates. | 1 | Proposed |
| NF-08 | Allow basic tasks without technical training. | 1 | Decided |
| NF-09 | Meet SEBI, IRDAI, PFRDA, RBI, DPDP, and TRAI obligations. | 1 | Open, legal review |
| NF-10 | Be ready for RTA and provider integrations in phase 2. | 2 | Proposed |

## 9. Open questions

See the [open questions register](../04-decisions/open-questions.md). The major open areas are:

- Employee and RM model
- Legal entity structure
- Commission calculation
- Website features
- Data migration
- Retention
- Volume targets
