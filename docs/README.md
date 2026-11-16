# Dhanada design documentation

Status: Draft. Last updated: 2026-11-16.

This folder is the design reference for the Dhanada platform. It explains the business, the records, and the rules that connect them.

The set is organised by **concept**, not by document type. One page holds everything a reader needs for one concept: what it is, how it works, the rules, the records and fields, access, lifecycle, decisions, and a worked example. Reference material supports the pages but is not required reading.

## Documentation map

| Section | What it holds | Start here |
|---|---|---|
| [01-foundations](01-foundations/) | Why the business and system exist: vision, roles, glossary, requirements | [vision and scope](01-foundations/vision-and-scope.md) |
| [02-model](02-model/) | One self-contained page per business concept | [model overview](02-model/README.md) |
| [03-reference](03-reference/) | Data model, decision records, open questions, question bank | [data model](03-reference/data-model.md) |
| [04-scenarios](04-scenarios/) | Worked examples with the same family and cast | [scenarios](04-scenarios/README.md) |

### Model pages

| Page | Concept |
|---|---|
| [Party and Client](02-model/01-party-and-client.md) | Identity, client relationship, client types, lifecycle |
| [Family](02-model/02-family.md) | Household grouping, membership, Head, lineage, employee view |
| [Related parties and ownership](02-model/03-related-parties-and-ownership.md) | Roles, owners, nominees, guardians, AUM attribution |
| [Products and providers](02-model/04-products-and-providers.md) | Provider, Product, Plan, category details, rate and NAV |
| [Leads and applications](02-model/05-leads-and-applications.md) | Sales pipeline and purchase request |
| [Holdings and investments](02-model/06-holdings-and-investments.md) | What the Client owns, valuation, transactions |
| [Commission](02-model/07-commission.md) | Rules, earnings, statements, reconciliation |
| [Servicing](02-model/08-servicing.md) | Requests, reviews, reminders, claims, consent |
| [Access and audit](02-model/09-access-and-audit.md) | Roles, row-level access, PII, audit, maker-checker |

## Reading paths

### New reader

1. [Vision and scope](01-foundations/vision-and-scope.md)
2. [Personas and roles](01-foundations/personas-and-roles.md)
3. [Party and Client](02-model/01-party-and-client.md)
4. [Family](02-model/02-family.md)
5. [Related parties and ownership](02-model/03-related-parties-and-ownership.md)
6. [The Sharma family](04-scenarios/sharma-family.md)

### Implementer

1. [Data model](03-reference/data-model.md)
2. [Party and Client](02-model/01-party-and-client.md)
3. [Products and providers](02-model/04-products-and-providers.md)
4. [Holdings and investments](02-model/06-holdings-and-investments.md)
5. [Access and audit](02-model/09-access-and-audit.md)
6. [Open questions](03-reference/open-questions.md)

### Reviewer or decision maker

1. [Open questions](03-reference/open-questions.md)
2. [Decision records](03-reference/decisions/README.md)
3. [Product question bank](03-reference/product-question-bank.md)
4. [Requirements](01-foundations/requirements.md)

### Example-led reader

1. [Scenarios](04-scenarios/README.md)
2. [The Sharma family](04-scenarios/sharma-family.md)
3. [New client journey](04-scenarios/new-client-journey.md)
4. [Minor and guardian](04-scenarios/minor-and-guardian.md)
5. [Joint holders and nominee](04-scenarios/joint-holders-and-nominee.md)

## How each model page is built

Every model page uses the same parts, in this order where the concept has them:

1. **In plain words**: the idea in business language.
2. **How it works**: the rules and the flow.
3. **Rules and invariants**: the short list an implementer must not break.
4. **Records and fields**: the records, with the full field list in a collapsed block.
5. **Who can see or change it**: access rules for this concept.
6. **Lifecycle**: the states, where the concept has them.
7. **Decisions and open questions**: the current status and links to the record.
8. **Worked example**: the rule shown with real people.

A concept may add a section before the rules when it needs one, such as a catalog, a scope note, or trade-offs. A proposed concept may stop at the proposed fields. Read one page and stop. The page is complete for that concept. Follow a link only when you need another concept or the supporting evidence.

## Status labels

- **Decided**: accepted and recorded in a decision record.
- **Proposed**: recommended, not confirmed.
- **Open**: no decision. The open-question register is the single source of truth.
- **Deferred**: pushed to a later phase.

## Current design status

- **Decided:** party layer, client identity and duplicate rules, client code, client statuses, family structure, family membership by Party, Family Head, employee family view, holder ranks, guardian on the Holding, nominee handling, and holding-based client reports.
- **Proposed:** hybrid product model, application and holding model, commission recording and reconciliation, employee and RM roles, and category depth.
- **Deferred:** Aadhaar collection, POA, and family visibility consent for clients.
- **Open:** ownership history, beneficial-owner depth, legal entity structure, commission calculation, website scope, migration, retention, naming, and currency.

## Rules of use

- Use the [glossary](01-foundations/glossary.md) as the naming reference.
- State each rule in one place. Link to it from other pages. Do not restate it.
- Keep the current rule on the model page. Keep the rationale in a decision record.
- Keep unresolved items in the [open-question register](03-reference/open-questions.md).
- Keep illustrative stories in [scenarios](04-scenarios/README.md).
- Keep the full field list on the model page. Keep cross-cutting schema rules in the [data model](03-reference/data-model.md).
