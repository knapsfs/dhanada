# ADR-0001: Party layer for identity

- Status: Accepted
- Date: 2026-11-14

## Context

A person can be a Client, a nominee, a guardian, a joint holder, a company signatory, and a Family member. Some people become Clients after they already hold a role. Some Clients are organizations. Some Clients are minors with no PAN.

A separate record for each role duplicates PII. It also breaks the link when a nominee becomes a Client.

## Decision

Use a hidden Party layer.

- `Party` is any person or organization known to KNAPS. It holds identity data.
- `Client` is a role record for a Party with a client relationship.
- `Related Person` is a Party without a Client record.
- A role links to a Party.
- A Related Person becomes a Client by creating a Client record for the same Party.
- Employees can search related people globally, with masked PII and permission checks.
- Reuse Frappe `Address` and `User`.
- Do not use Frappe `Contact` as the master for a person or organization. `Contact` cannot represent an organization and it duplicates identity.

## Consequences

- One extra entity and one extra join for client queries.
- The UI shows Client and Related Person. Party stays behind the screen.
- All role records link to Party, not to a copy of a person.
- Duplicate Parties need a merge process.
- PII lives in one place. Masking and access rules apply once.
- A nominee can become a Client without a data copy.
- Entities and minors use the same identity model as adults.

## Alternatives considered

| Option | Why not |
|---|---|
| Client-only record for every person | The term Client includes nominees and guardians. The client list becomes noisy. PII is duplicated across roles. |
| Client plus a separate Related Party record | Conversion from Related Party to Client needs a merge. Cross-role reporting is harder. |
| Frappe Contact as the master | Contact is a person, not an organization. It does not fit entity Clients. |

## Open questions

- OQ-004: Aadhaar storage. Deferred.
- OQ-032: Migration from the current branches.

## Related decisions

- [`adr-0004-client-identity-and-lifecycle.md`](adr-0004-client-identity-and-lifecycle.md): Client code and duplicate rules.
