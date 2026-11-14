# Open questions

Status: Live. Last updated: 2026-11-14.

## How to use this register

- Every open question has an ID.
- Answer a question by updating its status and adding a decision record in `04-decisions/`.
- Do not delete a question. Mark it **Closed** or **Deferred** and link the decision.
- **Open** means no decision.
- **Deferred** means the decision is pushed to a later phase. The question stays visible.
- A **Closed** item names the ADR that records the decision.

## Register

| ID | Area | Question | Recommendation | Status |
|---|---|---|---|---|
| OQ-001 | Identity | Do you want a human-readable client code beside the UUID? | Yes. Use `CL-000001`. Unique and immutable. | Closed, [ADR-0004](adr-0004-client-identity-and-lifecycle.md) |
| OQ-002 | Identity | What is the final Client status list? | Onboarding, Active, Dormant, Closed. No Prospect. | Closed, [ADR-0004](adr-0004-client-identity-and-lifecycle.md) |
| OQ-003 | Identity | Which fields and rules detect duplicates? | Strong: PAN, CKYC, passport, CIN, LLPIN. Medium: mobile and name, email and name, name and DOB and address. Review queue. No auto-merge. | Closed, [ADR-0004](adr-0004-client-identity-and-lifecycle.md) |
| OQ-004 | Identity | How is Aadhaar stored? | Keep Aadhaar out of phase 1. Decide before the portal. | Deferred |
| OQ-005 | Family | Must the Family Head be an Individual Client? | Yes. An entity can be a member, not the Head. | Closed, [ADR-0005](adr-0005-family-scope-and-employee-view.md) |
| OQ-006 | Family | Does the Head see detailed holdings or only totals? | Not applicable in phase 1. Decide with the portal. | Deferred |
| OQ-007 | Family | Is lineage derived from shared Clients, or an explicit parent-family link? | Shared Clients. Family stays flat. Views are derived. | Closed, [ADR-0005](adr-0005-family-scope-and-employee-view.md) |
| OQ-008 | Family | Can a Family contain a person who is not a Client? | No. A Related Person joins a Family only after becoming a Client. | Open |
| OQ-009 | Family | Must the Head be limited to the primary Family? | Yes. | Open |
| OQ-010 | Ownership | Do you need joint ownership shares? | Yes. Shares must sum to 100%. | Open |
| OQ-011 | Ownership | Do you need ownership history on Holdings? | Yes. Death, claim, gift, and transfer need an audit trail. | Open |
| OQ-012 | Ownership | Do you need nominee history? | Yes. Insurers and regulators ask for changes. | Open |
| OQ-013 | Guardian | Can a minor have more than one guardian? Must a guardian be a Client? | One primary guardian. A guardian can be a Related Person. | Open |
| OQ-014 | POA | Is POA scope and expiry in phase 1? | Record scope and expiry. No approval workflow in phase 1. | Open |
| OQ-015 | Entity | Is beneficial owner tracking in phase 1? | Basic fields in phase 1. Full KYC later. | Open |
| OQ-016 | Reporting | Do related people appear in client reports? | Yes in employee views. No in client reports without consent. | Open |
| OQ-017 | Product | Is the hybrid Product and Plan model accepted? | Yes. Generic core plus category detail. | Open |
| OQ-018 | Product | Which category details are phase 1? | Basic fields for all. Rate cards for FD and post office. NAV for MF, SIF, and NPS. | Open |
| OQ-019 | Legal entity | Which products sit in which legal entity? | Model a Legal Entity record even if one entity is used now. | Open |
| OQ-020 | Commission | Is phase 1 calculation, reconciliation, or both? | Record and reconcile first. Calculate later. | Open |
| OQ-021 | Website | Which website features are phase 1? | Product pages, lead capture, appointment booking, risk profiler, blog and SEO. | Open |
| OQ-022 | Documents | Are simple private attachments allowed without a document vault? | Yes. Use categories and access control. | Open |
| OQ-023 | Employees | What is the RM model? | One primary RM per Client. Optional secondary RM or product specialist. Team Lead sees the team. | Open |
| OQ-024 | Licenses | Should an expired license block a sale? | Yes. Allow a compliance override with an audit note. | Open |
| OQ-025 | Controls | What needs maker-checker? | Client merge, bank change, nominee change, commission adjustment, high-value transaction. | Open |
| OQ-026 | Naming | Are the chosen names acceptable? | Client, Family, Related Person, Investment (UI), Holding (model), Plan, Provider, RM. | Open |
| OQ-027 | Mobile | Is a mobile app needed? | No in phase 1. | Open |
| OQ-028 | Modules | How should DocTypes split into Frappe modules? | Core, Distribution, Servicing, Marketing. | Open |
| OQ-029 | Portal | When is the portal planned, and how is consent captured? | Phase 2. Capture consent with evidence at grant time. | Open |
| OQ-030 | Retention | What retention periods apply? | Meet the minimum for each regulator. Legal review needed. | Open |
| OQ-031 | Currency | INR only or multi-currency? | INR only in phase 1. | Open |
| OQ-032 | Migration | How do we migrate the existing Client, Family, and Lead data? | Map to Party, Client, and Family. Dedupe. Keep a legacy ID. | Open |
| OQ-033 | Reporting | Is entity AUM part of the Family personal total? | No. Report entity AUM on a separate line. | Closed, [ADR-0005](adr-0005-family-scope-and-employee-view.md) |

## Deferred questions

### OQ-004: Aadhaar storage

Aadhaar is not collected in phase 1. Do not add an Aadhaar field, a document type, or a partial number. Reopen this question before the portal phase or before any product requires Aadhaar KYC.

When it reopens, the choice is:

- Store the last four digits only.
- Store an Aadhaar reference or token from a KYC provider.
- Store the full number, only with legal and compliance approval.

### OQ-006: Head sees details or totals

In phase 1, no client sees Family data. Employees see Family data by role and assignment. The question becomes a portal design question:

- Does the Family Head see a summary of the Family?
- Does the Head see each member's Holdings?
- Does each member give consent per Holding?

Decide this with OQ-029.

## Related decisions

- [`adr-0001-party-layer.md`](adr-0001-party-layer.md)
- [`adr-0002-family-model.md`](adr-0002-family-model.md)
- [`adr-0003-product-model.md`](adr-0003-product-model.md)
- [`adr-0004-client-identity-and-lifecycle.md`](adr-0004-client-identity-and-lifecycle.md)
- [`adr-0005-family-scope-and-employee-view.md`](adr-0005-family-scope-and-employee-view.md)
