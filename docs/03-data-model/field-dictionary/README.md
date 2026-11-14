# Field dictionary

Status: Draft.

This folder holds field-level specifications for the core DocTypes. Product, distribution, and servicing fields come later.

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

The Visibility Grant records are designed for the portal phase. They are not built in phase 1.

## Open questions

- OQ-004: Aadhaar storage. Deferred.
- OQ-026: Naming.
