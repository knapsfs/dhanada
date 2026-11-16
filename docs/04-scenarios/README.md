# Worked examples

Status: Draft. Last updated: 2026-11-16.

These pages show the design with real people and real money. Each page uses the same cast, so you can follow one family across every rule.

Read them in this order:

1. [The Sharma family](sharma-family.md): the cast, the memberships, both family views, and the AUM split.
2. [Newborn in the family](newborn-in-family.md): a Related Person joins a Family before becoming a Client.
3. [New client journey](new-client-journey.md): a website Lead becomes an Active Client.
4. [Existing client cross-sell](existing-client-cross-sell.md): a new Lead for an existing Client.
5. [Minor and guardian](minor-and-guardian.md): a minor owner and the holding-level guardian.
6. [Joint holders and nominee](joint-holders-and-nominee.md): holder ranks, nominee shares, and a claim.
7. [Company and HUF](company-and-huf.md): entity Clients, the signatory, the Karta, and entity AUM.

## How each page is built

- **In plain words**: the story in a few sentences.
- **What the employee does**: the steps in the back office.
- **What the system stores**: the records and the links.
- **Why it matters**: the rule the example proves.

## The cast

| Person or entity | Type | Families | Main role |
|---|---|---|---|
| Ram Sharma, 68 | Individual | A | Head of Family A. Karta of the Sharma HUF. |
| Sita Sharma, 65 | Individual | A | Ram's spouse. Joint Holder, rank 2, on the family FD. |
| Mohan Sharma, 40 | Individual | A, B | Head of Family B. Director of Sharma Textiles. Guardian on Aarav's FD. |
| Radha Sharma, 38 | Individual | B, D | Mohan's spouse. Member of the Verma Family. Guardian for Diya as nominee on Ram's FD. |
| Aarav Sharma, 12 | Minor | B | Mohan's son. Sole owner of one FD. Guardian is Mohan on that FD. |
| Diya Sharma, 8 | Minor | B | Mohan's daughter. Nominee on Ram's FD. Guardian is Radha on that FD. |
| Baby Sharma, 3 months | Related Person | B | Mohan and Radha's daughter. No Client record yet. |
| Suresh Sharma, 35 | Individual | A, C | Head of Family C. Ram's younger son. |
| Sharma HUF | HUF | A | Karta is Ram. |
| Sharma Textiles Pvt Ltd | Company | A | Director is Mohan. |
| Mr Verma, 70 | Individual | D | Head of Family D. Radha's father. |
| Mrs Verma, 66 | Individual | D | Radha's mother. |
| Rahul Mehta, 31 | Individual | None | New Client from the website. Used in the journey example. |

## Why the same cast

The Sharma family covers the hard cases in one place:

- Three generations.
- A Party in two Families.
- A Related Person who becomes a Client.
- An HUF and a company as Clients.
- Minors with a guardian on the Holding.
- Joint holders without shares, and nominees with shares.
- Entity AUM that must not inflate the personal total.

A rule that works for this family works for most of the book.
