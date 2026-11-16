# Field dictionary

Status: Draft. Last updated: 2026-11-16.

This folder holds field-level specifications for the core DocTypes.

## Conventions

- All DocTypes have the standard Frappe fields: `name`, `creation`, `modified`, `owner`, `modified_by`, and `docstatus`.
- **Required** means mandatory at creation or before activation.
- **Proposed** means the field is recommended and needs confirmation.
- Field names use `snake_case`.
- A link to `Party` is the source of identity. Do not copy name or PAN into other records.

## Files

- [`identity.md`](identity.md): Party, Identity Document, Client, client code.
- [`family.md`](family.md): Family, Family Membership, Party Relationship. Visibility Grant is listed for the portal phase.
- [`related-parties.md`](related-parties.md): Holding Party, Application Party, Visibility Grant Holding.
- [`distribution.md`](distribution.md): Provider, Product, Plan, seven category detail records, Rate Card, NAV History, Application, Holding, Transaction.

The product fields are a proposal. See OQ-017 and OQ-018 and the [question bank](../../02-domain/product-model/04-question-bank.md).

The Visibility Grant records are designed for the portal phase. They are not built in phase 1.

## Open questions

- OQ-004: Aadhaar storage. Deferred.
- OQ-011: Ownership history.
- OQ-017: Product model.
- OQ-018: Category depth.
- OQ-026: Naming.
