# Dhanada software design

Status: Draft. Last updated: 2026-11-14.

Dhanada is a Frappe app for KNAPS. It supports a multi-product financial distribution business.

## Purpose

This documentation set is the design reference for the Dhanada back-office suite. It covers the business scope, domain model, data model, access rules, and open decisions. It does not contain code.

## Audience

- Product owners
- Engineers
- Compliance and operations
- Relationship managers

## Reading order

1. [`01-product/vision-and-scope.md`](01-product/vision-and-scope.md)
2. [`01-product/personas-and-roles.md`](01-product/personas-and-roles.md)
3. [`01-product/requirements.md`](01-product/requirements.md)
4. [`01-product/glossary.md`](01-product/glossary.md)
5. [`02-domain/context-map.md`](02-domain/context-map.md)
6. [`02-domain/clients-and-families.md`](02-domain/clients-and-families.md)
7. [`02-domain/related-parties.md`](02-domain/related-parties.md)
8. [`02-domain/products-and-providers.md`](02-domain/products-and-providers.md)
9. [`03-data-model/conventions.md`](03-data-model/conventions.md)
10. [`03-data-model/erd.md`](03-data-model/erd.md)
11. [`03-data-model/field-dictionary/README.md`](03-data-model/field-dictionary/README.md)
12. [`03-data-model/access-control.md`](03-data-model/access-control.md)
13. [`03-data-model/lifecycles.md`](03-data-model/lifecycles.md)
14. [`04-decisions/open-questions.md`](04-decisions/open-questions.md)

Then read the worked examples in [`05-examples/README.md`](05-examples/README.md). They are the fastest way to understand the design.

## Status labels

- **Decided**: confirmed by the business. A change needs an ADR update.
- **Proposed**: recommended design. Needs confirmation.
- **Deferred**: the decision is pushed to a later phase.
- **Open**: not decided. See the open questions register.

## Scope summary

Phase 1 is a back-office suite and a public website. It covers all product lines for catalog and holdings. Transactions are entered manually. The client portal comes later.

## Current status

- **Decided**: Party layer, client code, Client statuses with no Prospect, duplicate rules, Family as a grouping, a mandatory Family Head, a flat Family model, the employee Family view, and separate entity AUM.
- **Deferred**: Aadhaar collection, and Family visibility consent for clients.
- **Proposed**: hybrid product model, employee and RM model, licensing rules.
- **Open**: legal entity structure, commission calculation, website features, migration, retention, currency, and naming. See the register.

## Document map

| Folder | Document | Status | Purpose |
|---|---|---|---|
| 01-product | [Vision and scope](01-product/vision-and-scope.md) | Draft | Business context, goals, phase 1 scope, non-goals. |
| 01-product | [Personas and roles](01-product/personas-and-roles.md) | Draft | Employee and client personas. |
| 01-product | [Requirements](01-product/requirements.md) | Draft | Functional and non-functional requirements by module. |
| 01-product | [Glossary](01-product/glossary.md) | Draft | One name for one concept. |
| 02-domain | [Context map](02-domain/context-map.md) | Draft | Business contexts and their links. |
| 02-domain | [Clients and families](02-domain/clients-and-families.md) | Draft | Core identity, Client, Family, lineage, employee views. |
| 02-domain | [Related parties](02-domain/related-parties.md) | Draft | Roles, ownership rules, AUM, scenarios. |
| 02-domain | [Products and providers](02-domain/products-and-providers.md) | Proposed | Product catalog, plans, applications, holdings, commission. |
| 03-data-model | [Conventions](03-data-model/conventions.md) | Draft | Frappe naming, keys, audit, PII, deletion, indexes. |
| 03-data-model | [ERD](03-data-model/erd.md) | Draft | Identity, family, and distribution diagrams. |
| 03-data-model | [Field dictionary](03-data-model/field-dictionary/README.md) | Draft | Core DocType fields. |
| 03-data-model | [Access control](03-data-model/access-control.md) | Draft | Roles, permissions, PII masking, audit. |
| 03-data-model | [Lifecycles](03-data-model/lifecycles.md) | Draft | State diagrams. |
| 04-decisions | [Open questions](04-decisions/open-questions.md) | Live | Single register of open decisions. |
| 04-decisions | [ADR-0001](04-decisions/adr-0001-party-layer.md) | Accepted | Party layer. |
| 04-decisions | [ADR-0002](04-decisions/adr-0002-family-model.md) | Accepted | Family model. |
| 04-decisions | [ADR-0003](04-decisions/adr-0003-product-model.md) | Proposed | Product and Plan model. |
| 04-decisions | [ADR-0004](04-decisions/adr-0004-client-identity-and-lifecycle.md) | Accepted | Client code, Client statuses, duplicate rules, Aadhaar deferral. |
| 04-decisions | [ADR-0005](04-decisions/adr-0005-family-scope-and-employee-view.md) | Accepted | Family scope, mandatory Head, employee views, entity AUM. |
| 05-examples | [Worked examples](05-examples/README.md) | Draft | The Sharma family and five client journeys. |

## Rules for this documentation

- Use one name for one concept. The glossary is the reference.
- Use Mermaid for diagrams.
- Give every open question an ID in the register.
- Put a plain-language explanation before a technical table.
- Do not put code in this folder.

## Open questions

The register is the single list: [`04-decisions/open-questions.md`](04-decisions/open-questions.md).
