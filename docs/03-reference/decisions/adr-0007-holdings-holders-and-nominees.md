# ADR-0007: Holdings, holders, and nominees

- Status: Accepted
- Date: 2026-11-16

## Context

Providers do not record an ownership percentage for joint holders. A mutual fund folio, a bank deposit, and an insurance policy record a first holder, a second holder, and a third holder. The forms also record a mode of holding.

A stored percentage would be an invented number. No statement would match it.

Nominees are different. Providers ask for a nominee share. Two nominees commonly split 100%.

A minor cannot be a joint holder. A minor holds as a single owner, and an adult acts as guardian. The guardian can differ from Holding to Holding. One parent may act on one deposit, the other parent on another.

## Decision

1. Do not store an ownership share on a Holding owner.
2. Store `holder_rank` on each Owner row. Values are 1, 2, and 3.
3. A Holding has at least one Owner and at most three.
4. Exactly one Owner has rank 1. The UI calls this the **Primary Holder**. Rank 2 and 3 are **Joint Holders**.
5. Store `mode_of_holding` on the Holding: Single, Joint, Anyone or Survivor, Former or Survivor.
6. Store `share_percentage` on Nominee rows. One nominee can be 100 or blank. Two or more must total 100.
7. A minor owner is the only owner on the Holding. A minor cannot be a joint holder.
8. A Guardian is a Holding-level role. A Holding has one Guardian for each minor Party on it.
9. A Guardian row carries `acts_for`, which points to the minor Party.
10. A Guardian may be a Client or a Related Person. A Guardian may also be an Owner, for example a parent who owns a policy and names a minor child as nominee.
11. A minor nominee needs a Guardian row. Do not use the term appointee. Use Guardian.
12. AUM credits the full value to the rank 1 Owner. Joint Holders show the Holding with a Joint badge and no value in their personal AUM.
13. A Family counts the Holding once if any Owner is a member. The firm counts it once.
14. Beneficial Owner shares on Party Relationship are unchanged. Company shareholding is real and separate from joint holding.
15. A nominee change is a Service Request, then a manual update. There is no separate nominee history table.
16. A data feed in phase 2 updates the current nominee. It does not copy provider history. Create a Service Request only when KNAPS performed the change.

## Consequences

- The stored data matches the provider form.
- The three-holder cap is a hard limit in phase 1.
- AUM totals avoid double counting without inventing shares.
- A joint holder outside the family sees a memo row, not a value.
- A minor's Holding needs one Guardian row. A missing guardian blocks activation.
- A nominee change leaves a Service Request and an audit trail.
- The holding form needs a guard against two Owners with the same rank.
- An insurer or registrar statement can be reproduced from the stored ranks and mode.

## Alternatives considered

| Option | Why not |
|---|---|
| Store owner shares | No provider records them. The number would be invented. |
| Equal split for AUM | Still an assumption. It also disagrees with the first-holder rule on most statements. |
| Unlimited holders | Providers cap at three. A longer list invites bad data. |
| Guardian on the Client record | One minor can have a different guardian on each Holding. A single client-level guardian is false. |
| Appointee field for a minor nominee | It is the same concept as a guardian. One name is enough. |
| Separate nominee history DocType | The provider owns the history. A Service Request plus audit is enough. |

## Related decisions

- [`adr-0004-client-identity-and-lifecycle.md`](adr-0004-client-identity-and-lifecycle.md): Client identity.
- [`adr-0006-family-membership-by-party.md`](adr-0006-family-membership-by-party.md): Party membership.

## Open questions

- OQ-011: Ownership history. Open.
- OQ-015: Beneficial owner depth.
