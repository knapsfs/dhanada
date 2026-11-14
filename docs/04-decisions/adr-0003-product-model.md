# ADR-0003: Product and Plan model

- Status: Proposed
- Date: 2026-11-14

## Context

KNAPS distributes SIF, mutual funds, NPS, life insurance, general insurance, health insurance, NBFC fixed deposits, post office schemes, PMS, and AIF. The products have different attributes, but the business needs one client portfolio and one reporting model.

## Decision

Use a hybrid model.

- `Provider`: the organization that issues or manages the product.
- `Product`: the sellable product family.
- `Plan`: the sellable variant.
- Category detail: a one-to-one record for SIF and MF, insurance, FD, post office, NPS, PMS, and AIF.
- `Rate Card` for FD and post office.
- `NAV History` for MF, SIF, NPS, PMS, and AIF.
- The employee sees Product and Plan. The UI label changes by category: Scheme for MF and NPS, Plan for insurance.

## Consequences

- One client portfolio across all product lines.
- One Application and Holding model.
- Category fields stay clean in their own records.
- Adding a product line needs one detail record, not a new portfolio model.
- The core Product and Plan stay small and stable.
- Reporting joins the core to category detail only when needed.
- The team must keep common fields in the core and place only category fields in the detail.

## Alternatives considered

| Option | Why not |
|---|---|
| One generic Product only | Category fields become sparse. Validation is weak. The form becomes hard for employees. |
| Separate DocType per category | Client reporting needs unions. Commission, application, and holding logic is duplicated. Each new line needs a new portfolio model. |
| Hybrid | Recommended. See the consequences above. |

## Open questions

- OQ-017: Is the hybrid model accepted?
- OQ-018: Which category details are phase 1?
- OQ-019: Legal entity structure.
- OQ-020: Commission calculation or reconciliation.
