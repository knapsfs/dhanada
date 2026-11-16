# ADR-0004: Client identity and lifecycle

- Status: Accepted
- Date: 2026-11-14

## Context

Dhanada must identify a Client without using PAN as the key. PAN is missing for some Clients, such as minors. PAN can also change on correction.

The first draft used five Client statuses. The first status was Prospect, which overlapped with Lead. Employees could not tell when a person stopped being a Lead and became a Client.

The business also needs a short code that employees can quote on a call, a form, or a cheque.

## Decision

1. The internal key of a Client stays a UUID. The UUID is not a business identifier.
2. Each Client has a client code in the format `CL-000001`. The code is unique and immutable.
3. PAN is optional and unique when present. PAN is not the key.
4. The Client status list is: **Onboarding**, **Active**, **Dormant**, **Closed**.
5. There is no Prospect status. A sales opportunity is a **Lead**, not a Client.
6. A Lead can link to an existing Client. A Client can have many Leads over time.
7. Create a Client record only when the person or entity agrees to onboard. Link the source Lead.
8. Duplicate detection uses the following keys:
   - Strong: PAN, CKYC number, passport number, CIN, LLPIN.
   - Medium: mobile and name, email and name, name and date of birth and address.
   - Weak: name and city.
   - Minor: name, date of birth, guardian name, and guardian mobile.
9. A duplicate creates a review item. Do not merge automatically. A merge is an audited operation.
10. Aadhaar is not collected in phase 1. The question stays open as OQ-004.

## Client statuses

| Status | Meaning | Typical next step |
|---|---|---|
| Onboarding | The Client agreed to onboard. KYC, documents, or the first Application is in progress. | Move to Active when KYC is verified and the first Application is issued. |
| Active | The relationship is live. The Client may hold zero or many Holdings. | No activity for the dormant period moves the Client to Dormant. |
| Dormant | The relationship is quiet. Holdings can still exist. | A new Application or contact moves the Client back to Active. |
| Closed | The relationship ended. Holdings and history stay. | No automatic reopen. Create a new relationship if the Client returns. |

## Why there is no Prospect

| Question | Lead | Client with status Onboarding |
|---|---|---|
| What is it? | A sales opportunity | A client relationship in progress |
| Is it a Client? | No | Yes |
| Has a Party record? | Optional | Yes |
| Has KYC? | No | In progress |
| Can hold an Application? | No | Yes |
| Can belong to a Family? | No | Yes |
| Can be lost or junk? | Yes | No, it can be Closed |
| How many per person? | Many over time | One |

A Lead that fails leaves no Client record. A person who agrees to onboard gets a Client record. The two records never compete, because they answer different questions.

## Consequences

- The Client list stays clean. Junk and lost sales never appear in it.
- An existing Client cross-sell uses a new Lead, not a second Client.
- Employees see one lifecycle with four states.
- The client code adds a second unique key to maintain.
- A Client can be Active with zero Holdings. This is normal for a newly onboarded family member.
- Reports that grouped by Prospect must be rebuilt on Lead stage.
- Aadhaar absence limits some KYC checks. Use PAN, CKYC, passport, and other documents in phase 1.

## Alternatives considered

| Option | Why not |
|---|---|
| Keep Prospect as a Client status | It duplicates Lead. Employees cannot tell the two apart. Lost sales leave Client records. |
| One record that turns from Lead into Client | The lifecycle mixes a sales stage with a legal relationship. History becomes ambiguous. |
| PAN as the key | Minors and some entities have no PAN. A PAN correction would break every link. |
| Collect Aadhaar in phase 1 | The business chose to defer it. Store less PII until the legal position is clear. |

## Open questions

- OQ-004: Aadhaar storage. Deferred.
- OQ-008: Can a Family contain a non-Client.
- OQ-009: Must the Head be limited to the primary Family.
- OQ-030: Retention.
- OQ-032: Migration from the current branches.
