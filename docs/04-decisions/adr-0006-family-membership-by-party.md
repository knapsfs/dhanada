# ADR-0006: Family membership by Party

- Status: Accepted
- Date: 2026-11-16

## Context

The first Family model allowed only Clients as members. A Related Person had to become a Client before joining a Family.

That rule fails in common cases:

- A newborn in the family has no PAN, no KYC, and no Investments.
- A spouse who has not invested is not a Client yet.
- A dependent or an elderly parent may never become a Client.
- A family trust may be known before it onboards.

Under the old rule, the employee either creates a Client record too early or leaves the family incomplete. Both outcomes are wrong. The Lead and Client split exists to keep the client list clean.

## Decision

1. A Family Membership links a **Party**, not a Client.
2. The membership has an optional Client link. It is read-only and fills in when the Party has a Client record.
3. Any Party can be a Family member. This includes Clients, Related Persons, minors, and entities.
4. The Family Head must be a Client with an active membership.
5. The Head must head their **primary** Family. A Client cannot head a Family that is not their primary Family.
6. A Client heads at most one active Family.
7. A non-client member has no KYC, no login, no Holding, and no AUM.
8. A Family with no Client stays in Draft, because it has no valid Head.
9. The membership is unique on `family` and `party`.
10. When a Related Person becomes a Client, the membership row does not change. Set the Client link.
11. The family view shows a non-client member with a **Related Person** badge and a **Create Client** action.

## Consequences

- The Family can show a newborn, a spouse, or a parent before any client relationship exists.
- The client list stays clean. A Client record is created only when the person onboards.
- The family view mixes Clients and Related Persons. It needs a badge and a filter.
- Family reports exclude non-clients from AUM and from client counts.
- Access to a non-client member follows the related-person rules: masked PII and permission checks.
- Membership uniqueness moves from Client to Party.
- The people map can show the newborn without a Client record.

## Alternatives considered

| Option | Why not |
|---|---|
| Keep Client-only membership | Forces a premature Client record or an incomplete family. |
| A separate Family Prospect record | Adds a second identity record. The Party layer already solves this. |
| A Client record with status Onboarding for a newborn | Creates KYC work and a client code for someone with no relationship. |

## Related decisions

- [`adr-0001-party-layer.md`](adr-0001-party-layer.md): the Party layer.
- [`adr-0002-family-model.md`](adr-0002-family-model.md): the Family model.

## Open questions

- OQ-004: Aadhaar storage. Deferred.
- OQ-029: Portal consent capture.
