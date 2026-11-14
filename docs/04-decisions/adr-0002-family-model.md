# ADR-0002: Family model

- Status: Accepted
- Date: 2026-11-14
- Updated: 2026-11-14. Head is mandatory. Client visibility moves to the portal phase.

## Context

KNAPS serves families, not only individuals. A Family can contain several generations, an HUF, a family business, and a family trust. A Client can belong to more than one Family.

A Family is not a legal entity. It has no PAN, no KYC, and cannot own assets.

In phase 1, employees use the Family to track a household. Clients do not see the Family. A consent model that lets one Client see another Client's data belongs to the portal phase.

## Decision

1. A Family is a grouping of Clients. It is never a legal entity and never a Client.
2. Family membership is optional for a Client. A Client may have no Family.
3. A Client may belong to more than one Family, with at most one primary Family.
4. Membership is back-office only. It is not a client-facing feature in phase 1.
5. Only the current state is kept. Membership has an active or inactive status. No full history.
6. Every Active Family has one active Head. The Head is mandatory.
7. The Head must be an Individual Client and an active member of the Family.
8. A Client can head at most one active Family.
9. Lineage is derived from Clients who are members of more than one Family. No parent-family field in phase 1.
10. A Family can contain entity Clients, such as an HUF, company, or trust.
11. The Family stays flat. Do not use a Frappe Tree DocType for Family.
12. The employee family view uses Families as nodes. A read-only people map shows relationships around one Client.
13. No Visibility Grant in phase 1. The portal phase adds consent before any client sees another client's data.
14. Entity AUM is reported on a separate line. It is never added to the personal Family total.

## Consequences

- A Family report must deduplicate Holdings. An entity's assets stay with the entity.
- Lineage is a derived view, not a stored tree.
- The Head is a coordination label for employees. The label does not grant ownership or data access.
- A Client in two Families appears in two reports. The firm-level total counts each Holding once.
- The portal, when built, must add the Visibility Grant and enforce it.
- The Family screen is a list with a two-hop map. It is not a tree view.

## Alternatives considered

| Option | Why not |
|---|---|
| Family as a legal entity | A Family has no PAN and cannot own assets. HUF and trust are Clients, not Families. |
| One Family per Client | It cannot represent three generations or a Client who belongs to two households. |
| Parent-family tree | A tree allows one parent. Marriage and shared children create more than one link. |
| Membership history | The business asked for the current state only. |
| Client consent in phase 1 | No phase 1 user needs it. It belongs to the portal phase. |

## Related decisions

- [`adr-0005-family-scope-and-employee-view.md`](adr-0005-family-scope-and-employee-view.md): Family scope, Head, and employee view.

## Open questions

- OQ-008: Non-Client members.
- OQ-009: Head limited to the primary Family.
- OQ-013: Multiple guardians.
- OQ-029: Portal consent capture.
