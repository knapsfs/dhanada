# Dhanada design documentation

Status: Draft. Last updated: 2026-11-16.

This folder is the design reference for the Dhanada platform. It separates the business model from the implementation model so the product, domain, decisions, and examples remain easy to review and change.

## Purpose

The design set defines a working operating model for a multi-product financial distribution business. It explains:

- what the business does and why
- what objects exist in the domain and how they relate
- how the model is represented in records and controls
- which decisions are accepted, proposed, or still open
- how the model behaves in representative scenarios

## Documentation map

| Layer | Focus | Start here |
|---|---|---|
| [01-product](01-product/README.md) | Business context, scope, roles, and requirements | [01-product/README.md](01-product/README.md) |
| [02-domain](02-domain/README.md) | Business objects, relationships, and operating rules | [02-domain/README.md](02-domain/README.md) |
| [03-data-model](03-data-model/README.md) | Records, conventions, access control, and lifecycles | [03-data-model/README.md](03-data-model/README.md) |
| [04-decisions](04-decisions/README.md) | ADRs and the open-question register | [04-decisions/README.md](04-decisions/README.md) |
| [05-examples](05-examples/README.md) | Worked examples with the same family and participants | [05-examples/README.md](05-examples/README.md) |

## Reading paths

### Business-first path

1. [01-product/vision-and-scope.md](01-product/vision-and-scope.md)
2. [01-product/personas-and-roles.md](01-product/personas-and-roles.md)
3. [02-domain/context-map.md](02-domain/context-map.md)
4. [02-domain/clients-and-families.md](02-domain/clients-and-families.md)
5. [04-decisions/open-questions.md](04-decisions/open-questions.md)

### Implementation path

1. [01-product/requirements.md](01-product/requirements.md)
2. [02-domain/products-and-providers.md](02-domain/products-and-providers.md)
3. [02-domain/product-model/README.md](02-domain/product-model/README.md)
4. [03-data-model/conventions.md](03-data-model/conventions.md)
5. [03-data-model/erd.md](03-data-model/erd.md)
6. [03-data-model/field-dictionary/README.md](03-data-model/field-dictionary/README.md)

### Example-led path

1. [05-examples/README.md](05-examples/README.md)
2. [05-examples/sharma-family.md](05-examples/sharma-family.md)
3. [05-examples/new-client-journey.md](05-examples/new-client-journey.md)
4. [05-examples/minor-and-guardian.md](05-examples/minor-and-guardian.md)
5. [05-examples/joint-holders-and-nominee.md](05-examples/joint-holders-and-nominee.md)

## Decision and status rules

- Use the glossary as the naming reference.
- Keep policy and rationale in the ADRs and open-question register.
- Keep illustrative scenarios in the example folder.
- Keep implementation detail in the data-model folder.
- Treat the open-question register as the single source of truth for unresolved items.

## Current design status

- Decided: party layer, identity and duplicate rules, family structure, employee view, holder ranking, guardianship on holdings, nominee handling, and holding-based client reports.
- Deferred: Aadhaar collection, POA, and family visibility consent for clients.
- Proposed: hybrid product model, employee and RM model, licensing rules, and category depth decisions.
- Open: ownership history, beneficial-owner depth, legal entity structure, commission calculation, website scope, migration, retention, naming, and currency.
