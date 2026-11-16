# Money, dates, and values

Status: Draft. Last updated: 2026-11-16.

## Why this page

A product record answers "what can be bought". A Holding answers "what does the Client own". The numbers on a Holding must mean the same thing across every product family, or the portfolio total is wrong.

This page fixes the meaning of each amount and each date.

## 1. Four money ideas

| Idea | Plain meaning | Example |
|---|---|---|
| Invested amount | What the Client put in | ₹5,00,000 deposit |
| Current value | What it is worth today | ₹5,42,000 after accrued interest |
| Maturity value | What it will pay at the end | ₹6,36,000 on the maturity date |
| Income received | What the Client has already received | ₹30,000 interest paid last year |

Do not use one field for more than one idea. A deposit can have all four.

## 2. Amount fields

| Field | Meaning | Used by |
|---|---|---|
| `invested_amount` | Money paid in, before charges | Every Holding |
| `current_value` | Value on `value_on` | Every Holding |
| `maturity_value` | Expected or actual value at maturity | FD, bond, post office, insurance maturity |
| `income_received` | Cash already paid to the Client | FD interest, IDCW, coupon, pension |
| `premium_amount` | Insurance premium for one period | Life, health, general |
| `sum_assured` | Insurance cover | Life, health, general |
| `units` | Units held | MF, SIF, NPS, ULIP |
| `nav` | Unit price on `nav_date` | MF, SIF, NPS, ULIP |
| `price` | Bond price per ₹100 face value | Bonds |
| `accrued_interest` | Interest earned but not yet paid | FD, bond |
| `interest_rate` | Rate on the Holding at start | FD, post office, bond |
| `coupon_rate` | Fixed bond coupon | Bonds |

Use Currency fields for money. Use Percent for rates. Use Decimal for units, not Currency.

## 3. Units and NAV

For market-linked products, value is:

```
current_value = units × nav
```

- Store units to three or four decimals. Confirm in P-034.
- Store the NAV used for the value, and its date.
- A new NAV is a new row. Do not overwrite the old row.
- A purchase adds units. A redemption removes units. A switch moves units between two Holdings.
- An IDCW payout does not change the unit count. A reinvestment adds units.

Example: 4,000 units at NAV ₹300 = ₹12,00,000.

## 4. Rate and accrual

For deposits and bonds, value grows with time:

```
accrued_value = principal × (1 + rate / periods) ^ (periods × years)
```

The exact formula depends on compounding. Store the rate, the compounding method, and the start date. Store the current value from the provider when possible.

Example: ₹5,00,000 at 8.15% compounded quarterly for 3 years is about ₹6,36,000 at maturity.

Do not recompute history. Store what the provider says, with a date and a source.

## 5. Dates

| Date | Meaning | Example |
|---|---|---|
| `application_date` | Date the Client applied | 1 April 2026 |
| `allotment_date` | Date units or the policy were issued | 5 April 2026 |
| `start_date` | Date the Holding begins | 5 April 2026 |
| `maturity_date` | Date the Holding ends | 5 April 2029 |
| `next_due_date` | Next premium, contribution, or instalment | 5 April 2027 |
| `lock_in_end_date` | First date the Client can exit | 5 April 2029 |
| `value_on` | Date of the current value | 30 June 2026 |
| `closed_on` | Date the Holding was closed | 5 April 2029 |

Rules:

- Every value needs a date. A value with no date is not usable.
- A maturity date is not a guarantee. A ULIP has no maturity value. A policy can lapse.
- A date change needs a reason. Do not silently move a maturity date.

## 6. Valuation by family

| Family | How to value | Source | Frequency |
|---|---|---|---|
| Mutual fund | Units × NAV | AMFI, RTA, or manual | Daily |
| SIF | Units × NAV | AMC or manual | Daily |
| NPS | Units × NAV per scheme | NPS Trust or manual | Daily |
| Life insurance, traditional | Surrender value | Insurer statement | Monthly or quarterly |
| Life insurance, ULIP | Units × NAV | Insurer statement | Daily or monthly |
| Health and general insurance | No value. Show cover. | Policy | Not AUM |
| FD | Principal plus accrued interest | Provider or manual | Monthly |
| Government bond | Price plus accrued interest | Market price or manual | Daily or monthly |
| Post office | Deposit plus accrued interest | India Post or manual | Quarterly |
| PMS | Manager valuation | Manager statement | Monthly |
| AIF | Manager valuation | Manager statement | Quarterly |

Do not add health or general insurance cover to AUM. Cover is not money the Client can access.

## 7. The snapshot rule

At the start of a Holding, copy the terms that the deal fixed:

- Plan name and provider name.
- Rate or NAV at allotment.
- Tenure and maturity date.
- Sum assured and premium.
- Payout frequency.

The Holding keeps these values even after the catalog changes. The Plan can change for new business. The old Holding stays correct.

Example: Sita's FD keeps 8.15% after the card moves to 8.00%.

## 8. Transactions

| Transaction | Effect on the Holding |
|---|---|
| Purchase | Adds units or principal |
| SIP or RD instalment | Adds units or deposit |
| Additional purchase | Adds units or principal |
| Redemption or withdrawal | Removes units or principal |
| Switch out | Removes units from one Holding |
| Switch in | Adds units to another Holding |
| IDCW payout | Cash out, units unchanged |
| IDCW reinvestment | Adds units |
| Premium payment | Records a payment, value may rise |
| Contribution | Adds units to NPS |
| Interest or coupon payout | Cash out, principal unchanged |
| Maturity | Closes the Holding and records the payout |
| Renewal | Extends the Holding or creates a new one |
| Claim | Closes the Holding and records the settlement |

Rules:

- A transaction never edits the old value. It creates a new value with a date.
- A switch needs two linked transactions.
- A maturity closes the Holding. A renewal creates a new Holding or a new term. Do not overwrite the old terms.
- A failed or reversed transaction stays visible with a status.

## 9. Worked example

Sita's FD:

| Date | Event | Invested | Value | Maturity value |
|---|---|---|---|---|
| 1 Apr 2026 | Deposit opened | ₹5,00,000 | ₹5,00,000 | ₹6,36,000 |
| 30 Jun 2026 | Quarterly value from provider | ₹5,00,000 | ₹5,10,200 | ₹6,36,000 |
| 1 Apr 2029 | Maturity | ₹5,00,000 | ₹6,36,000 | ₹6,36,000 |

The invested amount never changes. The current value moves. The maturity value is an estimate until maturity.

## 10. Rules

1. Every amount has a meaning. Do not reuse one field for two meanings.
2. Every current value has `value_on` and a source.
3. A value is stored, not guessed, when a provider statement is available.
4. A rate or NAV change is a new row.
5. A Holding keeps its start terms.
6. Cover is not AUM.
7. A switch is two transactions.
8. A maturity closes the Holding.
9. A partial withdrawal keeps the Holding open and reduces units or principal.
10. A currency is INR in phase 1. See OQ-031.

## Related

- [The product model](01-product-model.md)
- [Category catalog](02-category-catalog.md)
- [Question bank](04-question-bank.md)
