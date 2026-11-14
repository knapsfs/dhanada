# Data model conventions

Status: Draft.

## 1. Purpose

This page sets the rules for Frappe DocTypes in Dhanada. It keeps the data model consistent and secure.

## 2. DocType names

- Use singular names in Title Case: `Client`, `Family`, `Family Membership`.
- Use business terms from the glossary.
- Do not use abbreviations in DocType names.
- Use a separate DocType when a record has its own identity, audit trail, or permissions.
- Use a child table when rows belong to one parent and have no independent life.

Examples:

| Record | Type | Reason |
|---|---|---|
| Party | DocType | Independent identity. |
| Client | DocType | Independent role record. |
| Family | DocType | Independent grouping. |
| Family Membership | DocType | Many-to-many link with its own status and dates. |
| Party Relationship | DocType | Independent relationship with dates and status. |
| Identity Document | DocType | Needs verification status and audit. |
| Holding Party | DocType | Role on a Holding with share and dates. |
| Visibility Grant | DocType | Portal phase. Consent record with evidence and expiry. |

## 3. Keys and naming

### 3.1 UUID

Party, Client, Family, Application, and Holding use a UUID as the DocType name. The UUID is the internal key. It is not shown as a business identifier.

Requirement: confirm the UUID naming method on Frappe 16 during implementation. If the framework method is not available, set the UUID in a controller before insert. This is an implementation detail, not a design change.

### 3.2 Human-readable codes

| Record | Code | Example | Status |
|---|---|---|---|
| Client | `client_code` | `CL-000001` | Decided, ADR-0004 |
| Family | `family_code` | `FAM-000001` | Proposed |
| Lead | `name` | `LEAD-2026-00001` | Proposed |
| Application | `name` | `APP-2026-00001` | Proposed |
| Holding | `name` | `HLD-2026-00001` | Proposed |

A code is unique and immutable. It is not a security key. Do not use PAN, mobile, or email as a key.

### 3.3 Naming series

Use a naming series only for records that employees must quote, such as Leads and Applications. Do not use a naming series as the only identifier for a Client or a Holding.

## 4. Fields

- Use `snake_case` for field names.
- Use clear words. Do not abbreviate. Use `mobile_no`, not `mob`.
- Use `_date` for Date fields and `_on` for Datetime fields.
- Use `is_*` for Check fields. Example: `is_primary`.
- Use `has_*` for Check fields that describe a state. Example: `has_guardian`.
- Use Title Case for Select options.
- Use a Select when the option list is stable. Use a Link when the list is managed data.
- Use a Link for a fixed target. Use a Dynamic Link only when the target DocType varies.
- Add a `notes` field only when a comment is not enough. Prefer the Frappe comment stream for discussion.

## 5. Links and relationships

- A link stores the DocType name of the target record.
- A role links to `Party`, not to a copied name or PAN.
- An ownership row links to `Party` and `Holding`.
- A Family membership links to `Client` and `Family`.
- Do not share child tables across DocTypes.
- Do not store the same fact in two places. Derive it or link it.

## 6. Status and workflow

- Use a `status` Select field for a simple lifecycle.
- Use Frappe Workflow only when a record needs approval steps and role-based transitions.
- Do not mix a status field and a workflow on the same record.
- High-risk actions need a separate approval record. Examples: client merge, bank change, nominee change, commission adjustment.

## 7. Audit

- Enable `track_changes` on Party, Client, Family, Holding, Application, and Commission.
- Use the Frappe comment stream for notes and decisions.
- Log sensitive actions: client merge, ownership change, bank change, nominee change, permission change, data export.
- Log PII views where the law or policy requires it.
- Keep an audit trail for the regulator retention period.

## 8. PII and security

- Store PII once, in Party or Identity Document.
- Mask PAN, mobile, email, and bank details in list views.
- Restrict full values with field-level permissions.
- Do not collect Aadhaar in phase 1. See OQ-004.
- Mark attachments private. Do not use public file URLs.
- Do not expose PAN in URLs, logs, or error messages.
- Encrypt sensitive fields at rest. Confirm the method during implementation.
- Reuse Frappe `Address` for addresses and `User` for login identities.
- Do not use Frappe `Contact` as the master for a person or organization.

## 9. Deletion and merge

- Do not hard delete Party, Client, Family, Holding, or Application.
- Use status to close a record.
- Merge duplicate Parties through an audited process.
- The merged Party is marked `Merged Into`. Links move to the surviving Party.
- A merge needs approval from Compliance or an Administrator.
- Keep the old UUID as a legacy reference.

## 10. Indexes and constraints

- Unique: `client_code`, `family_code`, PAN when present.
- Unique: Family Membership on `family` and `client`.
- Unique: one Client per Party.
- Unique: one active Head per Family.
- Unique: one primary Family per Client.
- Search: legal name, mobile, email, client code.
- Index: status, primary RM, primary Family, PAN.

## 11. Dates, currency, and locale

- Dates use the `Date` field. Timestamps use the `Datetime` field.
- Time zone: Asia/Kolkata.
- Currency: INR in phase 1. See OQ-031.
- Store amounts as Currency fields. Do not store money as text.
- Store percentages as Percent fields.

## 12. Module split

Proposed Frappe modules:

- Dhanada Core: Party, Client, Family, Identity, Visibility.
- Dhanada Distribution: Provider, Product, Plan, Lead, Application, Holding, Transaction, Commission.
- Dhanada Servicing: Service Request, Review, Reminder.
- Dhanada Marketing: Campaign, Segment, Consent use.

The split is proposed. See OQ-028.

## 13. Migration

The existing branches contain `Client`, `Family`, `Family Member`, and `Lead`.

Migration rules:

1. Map each existing `Client` to one Party and one Client.
2. Map `Family` to Family.
3. Map `Family Member` to Family Membership.
4. Map `Client.family` and `Client.family_role` to Family Membership. Remove the duplicate source.
5. Map `Lead` to Lead. Keep the existing Lead ID as a legacy reference.
6. Deduplicate by PAN, mobile, email, and name.
7. Keep a legacy ID field on migrated records.
8. Do not migrate the duplicate `client` and `converted_client` links on Lead without review.

See OQ-032.

## 14. Open questions

- OQ-001: Client code.
- OQ-026: Naming.
- OQ-028: Module split.
- OQ-031: Currency.
- OQ-032: Migration.
