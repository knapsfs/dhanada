# ADR-0005: Family scope and employee view

- Status: Accepted
- Date: 2026-11-14

## Context

The Family model started as a grouping with a consent layer. The consent layer let one Client see another Client's data. That layer belongs to the client portal, which is not in phase 1.

Employees still need to see that Ram, Sita, their sons, the family HUF, and the family company are related. They need this view for reviews, cross-sell, and service.

The team also asked whether a Frappe Tree DocType fits the family relationship.

## Decision

1. In phase 1, a Family is an employee grouping only. It helps an employee track a household. It is never a legal entity and never a Client.
2. Every Active Family has exactly one Head. The Head is mandatory.
3. The Head must be an Individual Client and an active member of the Family.
4. A Client can head at most one active Family.
5. The Family stays flat. Membership links a Client to a Family. Lineage comes from Clients who belong to more than one Family.
6. Do not use a Frappe Tree DocType for Family. Use a Tree DocType for the employee and Team hierarchy.
7. The employee family view uses **Families as nodes** by default. Each edge is a Client who belongs to two Families.
8. A read-only **people map** shows Parties around one Client, to a depth of two hops. It is a graph view, not a stored tree.
9. There is no client-facing Family view and no Visibility Grant in phase 1. The concept stays documented for the portal phase.
10. Family AUM reports personal AUM and entity AUM on separate lines. Entity Holdings stay with the entity Client and are never added to the personal total.

## Consequences

- The phase 1 build has no consent workflow, no grant record, and no client-facing sharing.
- The Family screen is a list and a card, not a tree.
- The people map needs access checks on every node. A node the employee cannot read shows as Restricted.
- Both views read the same records: Family, Family Membership, Party Relationship. No new DocType is needed for either view.
- A Family report can count the same Holding in two Families when a Client belongs to both. The firm total counts it once.
- The Head label does not grant access to other members' data, to an employee or to a client.
- The portal phase must add the consent model before it shows Family data to a client.

## Alternatives considered

| Option | Why not |
|---|---|
| Tree of Families | A tree gives each record one parent. Mohan belongs to his father's Family and his own. Radha belongs to her husband's Family and her parents' Family. The tree cannot show both. |
| Tree of Clients | The same limit applies. Marriage gives a person two parent links, and a tree allows one. |
| Visibility Grant in phase 1 | The consent model belongs to the portal. It adds records and rules that no phase 1 user needs. |
| Add entity AUM to the Family total | It counts the same money twice and hides which entity owns it. Report it on a separate line. |

## Open questions

- OQ-008: Can a Family contain a non-Client.
- OQ-009: Must the Head be limited to the primary Family.
- OQ-013: Multiple guardians.
- OQ-029: Portal consent capture.
