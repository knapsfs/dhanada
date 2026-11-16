# Product model

Status: Proposed. Last updated: 2026-11-16. OQ-017 and OQ-018 are open.

## What this folder is

The product model is the largest open part of the design. KNAPS sells many product families, and each family has facts the others do not need. This folder works through the model in five steps, from the plain idea to the draft DocTypes.

## Reading order

1. [The product model](01-product-model.md): why a hybrid model, the five records, and the five confirmation checks. Start here.
2. [Category catalog](02-category-catalog.md): all eleven product families, one Sharma example each, and the phase 1 depth.
3. [Money, dates, and values](03-money-dates-and-values.md): what each amount and date means, and how value is computed.
4. [Question bank](04-question-bank.md): 126 decisions, P-001 to P-126, grouped A to K.
5. [Data model draft](05-data-model-draft.md): the records, the purchase flow, the ERD, and the build order.

A short domain summary sits in [products and providers](../products-and-providers.md). The field list is in [distribution.md](../../03-data-model/field-dictionary/distribution.md).

## The idea in one line

A Client buys a **Plan**. A Plan belongs to a **Product**. A Product is offered by a **Provider**. Each Plan has one **Category Detail** record with the facts that family needs. What the Client owns is a **Holding**.

## The five checks that close OQ-017

| Check | Question | Recommendation |
|---|---|---|
| 1 | Do you accept Provider, Product, Plan, Category Detail, and Holding? | Yes |
| 2 | Is the Plan the unit of sale? | Yes |
| 3 | Is one category detail record per Plan enough? | Yes |
| 4 | Do we add rate and NAV rows instead of editing history? | Yes |
| 5 | Is the website limited to Product and Plan data? | Yes |

If all five are yes, OQ-017 can close. The category depth is OQ-018 and is settled by the question bank.

## Status

- OQ-017: the hybrid model. Proposed.
- OQ-018: the depth per category. Proposed.
- P-001 to P-126: awaiting answers. The top 12 unblock the most work.

## How to answer

Answer in batches by group, using the ID. For example:

```
P-001: yes
P-002: yes
P-023: two fields, variant and option
```

You do not need to answer all 126 at once.

## Related

- [Open questions](../../04-decisions/open-questions.md)
- [ADR-0003: Product and Plan model](../../04-decisions/adr-0003-product-model.md)
- [Products and providers](../products-and-providers.md)
