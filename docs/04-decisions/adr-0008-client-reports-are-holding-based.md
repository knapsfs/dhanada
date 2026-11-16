# ADR-0008: Client reports are holding-based

- Status: Accepted
- Date: 2026-11-16

## Context

Two kinds of report were mixed in the first draft:

- An **employee** report about a household, which uses Family.
- A **client** report about what one Client owns, which should use Holdings.

The Family is an employee grouping. It can contain other Clients, a Related Person, an HUF, and a company. If a client report walked the Family, it would show money that the Client does not own. It could also expose another family member's data without consent.

The business confirmed that client reports are always based on Holdings, not on the Family view.

## Decision

1. A client report lists the Holdings where the Client is an Owner.
2. A holding where the Client is a Joint Holder appears with a Joint badge and no value. The value belongs to the Primary Holder.
3. A client report never includes a Holding that belongs to another family member.
4. A client report never includes an entity Holding unless the Client is the entity.
5. A client report never includes a Related Person's data.
6. Employee reports may use Family. They show personal AUM and entity AUM on separate lines.
7. The Family view is a navigation and coordination tool for employees. It is not the source of a client report.
8. The portal, when built, follows the same rule. It shows Holdings, not the Family.
9. A future consent feature can add another Client's Holding to a client view. It must be explicit, recorded, and revocable. That is the Visibility Grant in the portal phase.

## Consequences

- A client report has one clear source: Holding Party.
- The report is easy to explain to a client: "These are the investments in your name."
- A spouse cannot see the other spouse's Holdings without a consent record.
- An HUF or company report is separate from the family report.
- The employee Family report still shows the household view, with personal and entity lines.
- The portal needs no Family model to produce a client portfolio.
- OQ-016 is closed.

## Alternatives considered

| Option | Why not |
|---|---|
| Client report from the Family | Shows money the client does not own and data the client may not see. |
| Client report from the Family with a consent check | The consent model belongs to the portal. The report still mixes ownership. |
| Show every joint holder the full value | Double counts and hides who is the Primary Holder. |
| Show every joint holder a share | No provider records a share. The number would be invented. |

## Related decisions

- [`adr-0005-family-scope-and-employee-view.md`](adr-0005-family-scope-and-employee-view.md): Family is an employee grouping.
- [`adr-0007-holdings-holders-and-nominees.md`](adr-0007-holdings-holders-and-nominees.md): holder ranks and AUM attribution.

## Open questions

- OQ-029: Portal consent capture.
- OQ-011: Ownership history options.
