# Products and providers

Status: Draft. Last updated: 2026-11-16.

## In plain words

KNAPS sells more than one kind of product. A mutual fund, a life policy, a bank fixed deposit, and a post office scheme behave differently. Employees still need one list of what a Client owns.

Dhanada uses one **Product** catalog and one **Holding** record for every line. The details that belong to one category sit in a separate detail record. The employee sees the common parts: Client, Product, Plan, amount, dates, and status.

This page is the short summary. The full working papers are in [`product-model/`](product-model/README.md), starting with [the product model](product-model/01-product-model.md).

Worked examples: [company and HUF](../05-examples/company-and-huf.md) and [joint holders and nominee](../05-examples/joint-holders-and-nominee.md).

## 1. Purpose

KNAPS distributes many product types. This page defines the catalog model and how a product becomes an Application and a Holding.

## 2. The five records

Status: Proposed. See [`../04-decisions/adr-0003-product-model.md`](../04-decisions/adr-0003-product-model.md) and OQ-017.

| Record | Answers the question | Example |
|---|---|---|
| Provider | Who makes or manages it? | HDFC Asset Management Company |
| Product | Which product family is it? | HDFC Flexi Cap Fund |
| Plan | Which exact version can the Client buy? | Direct, Growth |
| Category Detail | What else does this family need? | ISIN, benchmark, expense ratio |
| Holding | What does the Client own now? | Folio 1234567, 4,000 units |

A Client buys a Plan, never a bare Product. The Holding points to the Plan. The Plan has one category detail record.

`Rate Card` and `NAV History` hold time-based values. They are history rows, not edits.

This keeps one client portfolio while allowing clean category fields.

## 3. Provider

A Provider can be:

- AMC
- Insurer
- Bank
- NBFC
- India Post
- NPS
- PMS manager
- AIF manager
- National distributor

Fields: name, provider type, code, status, contact details, registrations, commission payer flag, notes.

A national distributor can also be a Distribution Partner. The same organization can appear in both roles. Keep the roles separate.

## 4. Product

Common fields:

- Provider
- Category
- Name
- Code
- Status
- Risk level
- Minimum and maximum amount
- Tax treatment
- Description and public summary
- Website visibility
- Tags

Do not put category-specific fields in Product. Put them in the category detail.

## 5. Plan

A Plan is the sellable variant of a Product. A Client always buys a Plan.

Examples:

- Mutual fund: Direct or Regular, Growth or IDCW.
- Insurance: plan option, rider, premium mode.
- FD: tenure and rate slab, payout option, senior citizen.
- NPS: scheme E, C, or G, fund manager.
- PMS or AIF: strategy and fee option.

Common fields: Product, name, code, status, variant, option, minimum amount, tenure, lock-in, payout frequency, rate type, effective dates, commission rule.

A Plan used by a Holding is not edited in a way that changes the deal terms. Create a new Plan instead.

## 6. Category detail

Each category detail record links one-to-one to a Plan. It holds only the facts for that family.

| Category | Provider | Category detail | Phase 1 |
|---|---|---|---|
| Mutual fund | AMC | ISIN, scheme category, benchmark, expense ratio, exit load, fund managers, riskometer | Full |
| SIF | AMC | Same as MF, plus strategy | Full |
| NPS | NPS | Tier, scheme option, fund manager, allocation, annuity option | Full |
| Life insurance | Insurer | Sum assured, premium, policy term, waiting period, riders, bonus, fund value | Full policy record |
| Health insurance | Insurer | Sum insured, premium, members covered, waiting period, room rent limit, network | Full policy record |
| General insurance | Insurer | Cover type, sum insured or IDV, premium, policy term, insured asset | Full policy record |
| Bank or NBFC FD | Bank, NBFC | Deposit type, compounding, premature penalty, loan against deposit, TDS | Full |
| Government bond | RBI, bank | Bond type, ISIN, face value, coupon, coupon dates, accrued interest | Holding and coupon |
| Post office | India Post | Scheme type, account format, default and penalty rules, extension | Full |
| PMS | PMS manager | Strategy, benchmark, minimum, lock-in, fees, capital account | Holding and statement |
| AIF | AIF manager | AIF category, strategy, commitment, drawdowns, lock-in, fees | Holding and statement |

The depth is a proposal. See OQ-018 and the [category catalog](product-model/02-category-catalog.md).

## 7. Rate cards and NAV

- `Rate Card` holds effective dates, tenure range, rate, senior citizen rate, and payout frequency. Use it for FD and post office.
- `NAV History` holds date, NAV, and source. Use it for MF, SIF, NPS, PMS, and AIF.
- A valuation uses the latest NAV or the accrued value at the valuation date.
- Manual entry is allowed in phase 1.
- A new rate or NAV is a new row. Do not edit an old row.

## 8. Application and Holding

### Application

An Application is a request to buy a product or onboard into it.

Fields: Client, Plan, application type, business source, Distribution Partner, RM, amount, payment details, status, parties, documents, commission rule.

### Holding

A Holding is the Client's position in a Plan.

Fields: Plan, provider reference, holding type, mode of holding, status, start date, maturity date, invested amount, current value and value date, units and NAV where relevant, source Application.

The Holding keeps a snapshot of the terms the deal fixed: provider name, product name, plan name, rate, tenure, sum assured, and amount. A later catalog change does not rewrite the deal.

Examples of a provider reference:

- Folio number
- Policy number
- PRAN
- FD receipt number
- Post office account number
- PMS account number
- AIF account number

The UI label is Investment. Show the type beside it: Policy, Folio, FD, PRAN.

### Owners

Owners are Holding Party rows on the Holding. A Holding has one to three Owners, ordered by `holder_rank`. Rank 1 is the **Primary Holder**. Rank 2 and 3 are **Joint Holders**. Do not store an ownership share. See [related parties](related-parties.md).

## 9. Commission

The commission model has four parts:

- `Commission Rule`: provider, product or plan, transaction type, basis, rate, frequency, effective dates, GST and TDS, clawback.
- `Commission Earning`: holding or transaction, rule, period, gross, GST, TDS, net, status, payer.
- `Commission Statement`: payer, period, file, total, status.
- `Commission Reconciliation`: statement line against earning, difference, status.

Track the Business Source and the Distribution Partner on the Application and Holding. The national distributor can be the commission payer.

Calculation versus reconciliation is open. See OQ-020.

## 10. Phase 1 scope

- All product categories in the catalog and in Holdings.
- Full product detail per category. The depth per category is in the question bank.
- Manual transaction entry for every category.
- Rate cards for FD and post office.
- NAV for MF, SIF, and NPS when available.
- PMS and AIF: Holdings and statements only.
- Insurance: chosen plan and policy record only. No quotes, illustrations, or comparison.
- Website product pages read Product and Plan only.
- No order placement.

## 11. Open questions

- OQ-017: Is the hybrid model accepted?
- OQ-018: Which category details are phase 1?
- OQ-019: Which products sit in which legal entity?
- OQ-020: Commission calculation or reconciliation.
- P-001 to P-126: the [question bank](product-model/04-question-bank.md).

## Related

- [Product model](product-model/README.md)
- [Category catalog](product-model/02-category-catalog.md)
- [Money, dates, and values](product-model/03-money-dates-and-values.md)
- [Question bank](product-model/04-question-bank.md)
- [Data model draft](product-model/05-data-model-draft.md)
- [Distribution field dictionary](../03-data-model/field-dictionary/distribution.md)
- [ADR-0003](../04-decisions/adr-0003-product-model.md)
