# Products and providers

Status: Draft.

## In plain words

KNAPS sells more than one kind of product. A mutual fund, a life policy, a bank fixed deposit, and a post office scheme behave differently. Employees still need one list of what a Client owns.

Dhanada uses one **Product** catalog and one **Holding** record for every line. The details that belong to one category sit in a separate detail record. The employee sees the common parts: Client, Product, Plan, amount, dates, and status.

Worked examples: [company and HUF](../05-examples/company-and-huf.md) and [joint holders and nominee](../05-examples/joint-holders-and-nominee.md).

## 1. Purpose

KNAPS distributes many product types. This page defines the catalog model and how a product becomes an Application and a Holding.

## 2. Design decision

Status: Proposed. See [`../04-decisions/adr-0003-product-model.md`](../04-decisions/adr-0003-product-model.md).

Use a hybrid model:

- `Provider` is the organization that issues or manages the product.
- `Product` is the sellable product family.
- `Plan` is the sellable variant.
- Category detail is a one-to-one record with Product or Plan.
- `Rate Card` and `NAV History` hold time-based values.
- The employee sees Product and Plan. The UI label changes by category.

This keeps one client portfolio while allowing clean category fields.

## 3. Provider

A Provider can be:

- AMC
- Insurer
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
- Tenure
- Liquidity or lock-in
- Tax treatment
- Default commission rule
- Description

Do not put category-specific fields in Product. Put them in the category detail.

## 5. Plan

A Plan is the sellable variant of a Product.

Examples:

- Mutual fund: Direct or Regular, Growth or IDCW.
- Insurance: plan option, rider, premium mode.
- FD: tenure and rate slab, payout option, senior citizen.
- NPS: scheme E, C, or G, fund manager.
- PMS or AIF: strategy and fee option.

Common fields: Product, name, code, status, option, minimum amount, tenure, rate, payout frequency, commission rule.

## 6. Category detail

| Category | Provider | Plan examples | Category detail | Phase 1 |
|---|---|---|---|---|
| SIF | AMC | Direct or Regular, Growth or IDCW | ISIN, scheme category, benchmark, NAV, expense ratio, exit load, fund managers | Basic |
| MF | AMC | Direct or Regular, Growth or IDCW | ISIN, scheme category, benchmark, NAV, expense ratio, exit load, fund managers | Basic |
| NPS | NPS | Scheme E, C, or G | Fund manager, NAV, asset allocation | Basic |
| Life insurance | Insurer | Plan and riders | Sum assured, premium, policy term, waiting period, claim ratio | Basic |
| General insurance | Insurer | Plan | Cover, premium, term | Basic |
| Health insurance | Insurer | Plan | Sum insured, premium, waiting period, network | Basic |
| NBFC FD | NBFC | Tenure and rate slab | Interest rate, senior citizen rate, payout, premature withdrawal | Rate card |
| Post office | India Post | RD, TD, SCSS, NSC, KVP | Tenure, rate, limits | Rate card |
| PMS | PMS manager | Strategy | Minimum investment, lock-in, fee, benchmark | Basic |
| AIF | AIF manager | Category and strategy | Minimum investment, lock-in, fee, benchmark | Basic |

## 7. Rate cards and NAV

- `Rate Card` holds effective dates, tenure range, rate, senior citizen rate, and payout frequency. Use it for FD and post office.
- `NAV History` holds date, NAV, and source. Use it for MF, SIF, NPS, PMS, and AIF.
- A valuation uses the latest NAV or the accrued value at the valuation date.
- Manual entry is allowed in phase 1.

## 8. Application and Holding

### Application

An Application is a request to buy a product or onboard into it.

Fields: Client, Plan, application type, business source, Distribution Partner, RM, amount, payment details, status, parties, documents, commission rule.

### Holding

A Holding is the Client's position in a Plan.

Fields: Plan, provider reference, holding type, status, start date, maturity date, invested value, current value, parties, source Application.

Examples of a provider reference:

- Folio number
- Policy number
- PRAN
- FD receipt number
- Post office account number
- PMS account number
- AIF account number

The UI label is Investment. Show the type beside it: Policy, Folio, FD, PRAN.

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
- Basic product details first. Category detail grows in stages.
- Manual transaction entry for every category.
- Rate cards for FD and post office.
- NAV for MF, SIF, and NPS when available.
- PMS and AIF: Holdings and statements only.
- Insurance: chosen plan and policy record only. No quotes, illustrations, or comparison.
- No order placement.

## 11. Open questions

- OQ-017: Is the hybrid model accepted?
- OQ-018: Which category details are phase 1?
- OQ-019: Which products sit in which legal entity?
- OQ-020: Commission calculation or reconciliation.
