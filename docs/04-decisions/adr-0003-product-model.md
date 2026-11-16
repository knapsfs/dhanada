# ADR-0003: Product and Plan model

- Status: Proposed
- Date: 2026-11-14
- Updated: 2026-11-16

## Context

KNAPS distributes SIF, mutual funds, NPS, life insurance, general insurance, health insurance, bank and NBFC fixed deposits, Government of India bonds, post office schemes, PMS, and AIF. The products have different attributes, but the business needs one client portfolio and one reporting model.

One table for everything would be sparse and hard to validate. One table per category would split the portfolio and duplicate the application, holding, commission, and reporting logic.

## Decision

Use a hybrid model.

- `Provider`: the organization that issues or manages the product.
- `Product`: the sellable product family.
- `Plan`: the sellable variant. The Plan is the unit of sale.
- Category detail: a one-to-one record for SIF and MF, insurance, FD, bonds, post office, NPS, PMS, and AIF.
- `Rate Card` for FD and post office.
- `NAV History` for MF, SIF, NPS, PMS, and AIF.
- The employee sees Product and Plan. The UI label changes by category: Scheme for MF and NPS, Plan for insurance.
- The website reads Product and Plan only.

A Holding points to one Plan. It keeps a snapshot of the terms the deal fixed. A Rate Card or NAV row is never edited; a new row is added.

## Consequences

- One client portfolio across all product lines.
- One Application and Holding model.
- Category fields stay clean in their own records.
- Adding a product line needs one detail record, not a new portfolio model.
- The core Product and Plan stay small and stable.
- Reporting joins the core to category detail only when needed.
- The team must keep common fields in the core and place only category fields in the detail.
- Employees must pick the right Plan, and each Plan needs its detail record.

## Alternatives considered

| Option | Why not |
|---|---|
| One generic Product only | Category fields become sparse. Validation is weak. The form becomes hard for employees. |
| Separate DocType per category | Client reporting needs unions. Commission, application, and holding logic is duplicated. Each new line needs a new portfolio model. |
| Hybrid | Recommended. See the consequences above. |

## The five confirmation checks

| Check | Question | Recommendation |
|---|---|---|
| 1 | Do you accept Provider, Product, Plan, Category Detail, and Holding? | Yes |
| 2 | Is the Plan the unit of sale? | Yes |
| 3 | Is one category detail record per Plan enough? | Yes |
| 4 | Do we add rate and NAV rows instead of editing history? | Yes |
| 5 | Is the website limited to Product and Plan data? | Yes |

All five are yes in the recommendation. The business has not confirmed them yet.

## Working papers

- [`02-domain/product-model/01-product-model.md`](../02-domain/product-model/01-product-model.md): the plain explanation and the five checks.
- [`02-domain/product-model/02-category-catalog.md`](../02-domain/product-model/02-category-catalog.md): one example per family.
- [`02-domain/product-model/03-money-dates-and-values.md`](../02-domain/product-model/03-money-dates-and-values.md): amounts, dates, and valuation.
- [`02-domain/product-model/04-question-bank.md`](../02-domain/product-model/04-question-bank.md): P-001 to P-126.
- [`02-domain/product-model/05-data-model-draft.md`](../02-domain/product-model/05-data-model-draft.md): records, flow, ERD, build order.
- [`03-data-model/field-dictionary/distribution.md`](../03-data-model/field-dictionary/distribution.md): field lists.

## Open questions

- OQ-017: Is the hybrid model accepted?
- OQ-018: Which category details are phase 1?
- OQ-019: Legal entity structure.
- OQ-020: Commission calculation or reconciliation.
- P-001 to P-126: the product question bank.
