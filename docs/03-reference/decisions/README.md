# Decision records

Status: Live. Last updated: 2026-11-16.

A decision record explains why a rule exists. The model pages state the current rule. These records hold the context, the alternatives, and the consequences. You do not need to read them to understand a concept.

## Recorded decisions

| ID | Title | Status | Question it settled |
|---|---|---|---|
| [ADR-0001](adr-0001-party-layer.md) | Party layer for identity | Accepted | How one person holds many roles without copied PII. |
| [ADR-0002](adr-0002-family-model.md) | Family model | Accepted | What a Family is, and what it is not. |
| [ADR-0003](adr-0003-product-model.md) | Product and Plan model | Proposed | How one catalog serves eleven product families. |
| [ADR-0004](adr-0004-client-identity-and-lifecycle.md) | Client identity and lifecycle | Accepted | Client key, code, PAN, statuses, and duplicates. |
| [ADR-0005](adr-0005-family-scope-and-employee-view.md) | Family scope and employee view | Accepted | Employee Family view and no client consent in phase 1. |
| [ADR-0006](adr-0006-family-membership-by-party.md) | Family membership by Party | Accepted | Why a membership links a Party, not a Client. |
| [ADR-0007](adr-0007-holdings-holders-and-nominees.md) | Holdings, holders, and nominees | Accepted | Owner rank, no share, nominee share, and guardian scope. |
| [ADR-0008](adr-0008-client-reports-are-holding-based.md) | Client reports are holding-based | Accepted | Why a client report never walks the Family. |

## Rule of use

- State the current rule in the model page. Do not bury it here.
- Add a decision record when a choice closes an open question or changes a rule.
- Do not edit an accepted record to reverse it. Write a new record and mark the old one Superseded.
- Keep unresolved items in the [open question register](../open-questions.md).
- Keep worked examples in [scenarios](../../04-scenarios/README.md).
