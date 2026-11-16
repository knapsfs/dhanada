# Distribution field dictionary

Status: Draft. Last updated: 2026-11-16.

This file covers the product spine and the Holding records. The category fields are a proposal. OQ-017 and OQ-018 are open.

## 1. Provider

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| provider_code | Data | Yes | Unique. Example `PRV-HDFC-AMC`. |
| provider_name | Data | Yes | Legal name. |
| display_name | Data | No | Brand shown in the UI. |
| provider_type | Select | Yes | AMC, Insurer, Bank, NBFC, Post Office, NPS, PMS Manager, AIF Manager, National Distributor, Other. |
| amfi_code | Data | No | AMC only. |
| irdai_registration | Data | No | Insurer only. |
| sebi_registration | Data | No | PMS, AIF, or distributor. |
| cin | Data | No | Company identity. |
| gstin | Data | No | Tax identity. |
| status | Select | Yes | Active, Suspended, Exited. |
| empanelled_on | Date | No | Start of the relationship. |
| exited_on | Date | No | End of the relationship. |
| commission_payer | Check | No | Provider pays commission directly. |
| website | Data (URL) | No | Public site. |
| portal_url | Data (URL) | No | Employee portal. Never store a password. |
| notes | Small Text | No | Internal notes. |

Rules:

- One Provider per legal entity. Use `display_name` for a brand.
- A national distributor can also be a Distribution Partner. Keep the roles separate.
- A Provider with existing Holdings is not deleted. Use status.

## 2. Product

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| product_code | Data | Yes | Unique. Example `PRD-MF-0001`. |
| product_name | Data | Yes | Provider name plus the product family. |
| display_name | Data | No | Short name for the UI. |
| provider | Link (Provider) | Yes | Who offers it. |
| category | Select | Yes | Mutual Fund, SIF, NPS, Life Insurance, Health Insurance, General Insurance, Bank FD, NBFC FD, Government Bond, Post Office, PMS, AIF, Other. |
| status | Select | Yes | Active, Discontinued. |
| risk_level | Select | No | Low, Moderate, High, Very High. |
| minimum_amount | Currency | No | Default for the product. A Plan can override. |
| maximum_amount | Currency | No | Default for the product. A Plan can override. |
| tax_treatment | Select | No | EEE, EET, Taxable, Partly Taxable, Not Applicable. |
| description | Text | No | Website and internal use. |
| public_summary | Small Text | No | Short text for the website. |
| website_visible | Check | No | Show on the public site. |
| brochure | Attach | No | Private file. Public link is separate. |
| tags | Table (Product Tag) | No | Tax saving, retirement, child, liquidity. |
| notes | Small Text | No | Internal notes. |

Rules:

- Do not put category-specific fields in Product.
- A Product needs at least one active Plan before it can be sold.
- A Product with Holdings is never deleted. Use status.

## 3. Plan

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| plan_code | Data | Yes | Unique. Example `PLN-000001`. |
| product | Link (Product) | Yes | Parent product. |
| plan_name | Data | Yes | Shown to employees. |
| variant | Data | No | Direct, Regular, Tier I, Cumulative, Base, Rider. |
| option | Data | No | Growth, IDCW Payout, IDCW Reinvestment, 3 Years, Annual Premium. |
| status | Select | Yes | Active, Closed to New Business, Matured. |
| minimum_amount | Currency | No | Overrides the Product value. |
| maximum_amount | Currency | No | Overrides the Product value. |
| tenure_months | Int | No | Fixed term. Blank for open-ended. |
| lock_in_months | Int | No | Minimum holding period. |
| payout_frequency | Select | No | None, Monthly, Quarterly, Half-Yearly, Yearly, At Maturity. |
| rate_type | Select | No | Fixed, Floating, Market Linked, Not Applicable. |
| website_visible | Check | No | Show on the public site. |
| effective_from | Date | No | Start of these terms. |
| effective_to | Date | No | End of these terms. |
| notes | Small Text | No | Internal notes. |

Rules:

- A Plan belongs to one Product.
- A Plan has exactly one category detail record.
- A Plan used by a Holding is never edited in a way that changes the deal terms. Create a new Plan instead.
- A closed Plan stays readable.

## 4. Category detail

Each detail record is linked one-to-one to a Plan. The detail holds only the facts for that family.

### 4.1 Mutual fund and SIF detail

| Field | Type | Required | Notes |
|---|---|---|---|
| plan | Link (Plan) | Yes | Unique. |
| isin | Data | Yes | Plan-level ISIN. |
| amfi_code | Data | No | Scheme code. |
| rta_code | Data | No | Registrar code. |
| scheme_category | Select | Yes | Large Cap, Flexi Cap, Mid Cap, Small Cap, Debt, Hybrid, Index, Long-Short, Sectoral, Thematic, Other. |
| strategy | Small Text | No | SIF only. |
| benchmark | Data | No | Index name. |
| expense_ratio | Percent | No | Current total expense ratio. |
| exit_load | Small Text | No | Rule and period. |
| fund_manager | Data | No | One or more names. |
| riskometer | Select | No | Low, Moderate, High, Very High. |
| scheme_aum | Currency | No | Size of the scheme. |
| idcw_frequency | Select | No | None, Monthly, Quarterly, Yearly. |

### 4.2 Fixed deposit detail

| Field | Type | Required | Notes |
|---|---|---|---|
| plan | Link (Plan) | Yes | Unique. |
| deposit_type | Select | Yes | Bank, NBFC, Corporate. |
| compounding | Select | No | Simple, Monthly, Quarterly, Half-Yearly, Yearly. |
| premature_penalty | Percent | No | Penalty on early withdrawal. |
| loan_allowed | Check | No | Loan against the deposit. |
| tds_applicable | Check | No | Tax deducted at source. |
| senior_citizen_rate | Percent | No | Default, if not on the Rate Card. |
| auto_renewal_allowed | Check | No | Renewal at maturity. |

### 4.3 Insurance detail

| Field | Type | Required | Notes |
|---|---|---|---|
| plan | Link (Plan) | Yes | Unique. |
| insurance_type | Select | Yes | Term, Endowment, Money Back, ULIP, Health, Motor, Home, Travel, Other. |
| sum_assured | Currency | Conditional | Life and health. |
| premium_amount | Currency | Conditional | One period. |
| premium_frequency | Select | No | Monthly, Quarterly, Half-Yearly, Yearly, Single. |
| policy_term_months | Int | No | Term of cover. |
| waiting_period_months | Int | No | Health. |
| room_rent_limit | Data | No | Health. |
| network_hospitals | Small Text | No | Health. |
| riders_allowed | Check | No | A rider is a separate Plan. |
| claim_ratio | Percent | No | Provider claim ratio. |
| surrender_value | Currency | No | Current surrender value. |
| maturity_value | Currency | No | Expected maturity value. |
| insured_asset_type | Data | No | Car, home, shop, travel. |

### 4.4 NPS detail

| Field | Type | Required | Notes |
|---|---|---|---|
| plan | Link (Plan) | Yes | Unique. |
| tier | Select | Yes | Tier I, Tier II. |
| scheme_option | Select | Yes | E, C, G, E+C+G, Active Choice, Auto Choice. |
| fund_manager | Data | No | Manager for the scheme. |
| asset_allocation | Small Text | No | Equity, corporate bond, government bond split. |
| annuity_option | Select | No | Not Applicable, Spouse, Child, Both. |
| employer_allowed | Check | No | Corporate NPS. |

### 4.5 PMS and AIF detail

| Field | Type | Required | Notes |
|---|---|---|---|
| plan | Link (Plan) | Yes | Unique. |
| strategy | Data | Yes | Strategy name. |
| benchmark | Data | No | Index or custom benchmark. |
| minimum_investment | Currency | Yes | Eligibility. |
| lock_in_months | Int | No | Lock-in. |
| management_fee | Percent | No | Fixed fee. |
| performance_fee | Percent | No | Profit share. |
| aif_category | Select | No | Category I, Category II, Category III, Not Applicable. |
| commitment_amount | Currency | No | AIF commitment. |
| drawdown_terms | Small Text | No | How the manager calls capital. |

### 4.6 Post office detail

| Field | Type | Required | Notes |
|---|---|---|---|
| plan | Link (Plan) | Yes | Unique. |
| scheme_type | Select | Yes | RD, TD, MIS, SCSS, NSC, KVP, PPF, SSY. |
| default_rule | Small Text | No | Missed instalment. |
| penalty_rule | Small Text | No | Premature closure. |
| agent_required | Check | No | Agent code at entry. |
| nomination_required | Check | No | Nomination at opening. |
| extension_allowed | Check | No | Maturity extension. |

### 4.7 Government bond detail

| Field | Type | Required | Notes |
|---|---|---|---|
| plan | Link (Plan) | Yes | Unique. |
| bond_type | Select | Yes | GoI Dated, Treasury Bill, Sovereign Gold Bond, State Development Loan, Other. |
| isin | Data | Yes | Market identifier. |
| face_value | Currency | Yes | Per unit or per bond. |
| coupon_rate | Percent | Conditional | Blank for a T-Bill. |
| coupon_frequency | Select | No | Half-Yearly, Yearly, At Maturity. |
| maturity_date | Date | Yes | Redemption date. |
| taxable | Check | No | Interest is taxable. |
| issue_price | Currency | No | Price at issue. |
| grams_per_unit | Decimal | No | SGB only. |

## 5. Rate Card

A Rate Card holds a rate for a period and a tenure band. Use it for FD and post office.

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| plan | Link (Plan) | Yes | Parent plan. |
| effective_from | Date | Yes | Start date. |
| effective_to | Date | No | End date. Blank means current. |
| tenure_from_months | Int | No | Lower bound. |
| tenure_to_months | Int | No | Upper bound. |
| general_rate | Percent | Yes | Standard rate. |
| senior_citizen_rate | Percent | No | Rate for eligible holders. |
| payout_frequency | Select | No | Cumulative or periodic. |
| source | Data | No | Circular or provider page. |
| notes | Small Text | No | Internal notes. |

Rules:

- Two rows for the same Plan must not overlap on date and tenure band.
- A row is never edited after it is used by a Holding. Add a new row.
- The Holding stores the rate it was opened at.

## 6. NAV History

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. |
| plan | Link (Plan) | Yes | Parent plan. |
| nav_date | Date | Yes | Value date. |
| nav | Currency | Yes | Unit price. |
| source | Data | No | AMFI, AMC, NPS Trust, manual. |

Rules:

- Unique on `plan` and `nav_date`.
- A row is never edited. Add a new row.
- The Holding stores the NAV used for its current value, plus the date.

## 7. Application

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data | Yes | Naming series `APP-2026-00001`. |
| client | Link (Client) | Yes | Main applicant. |
| plan | Link (Plan) | Yes | What is being bought. |
| provider_name_snapshot | Data | Yes | Copied at submission. |
| product_name_snapshot | Data | Yes | Copied at submission. |
| plan_name_snapshot | Data | Yes | Copied at submission. |
| application_type | Select | Yes | New, Additional, Switch, Renewal, Transfer. |
| business_source | Select | Yes | Direct, National Distributor, Website, Referral, Campaign. |
| distribution_partner | Link (Provider) | No | If a national distributor is involved. |
| amount | Currency | Yes | Application amount. |
| payment_mode | Select | No | Cheque, NEFT, UPI, Auto Debit, Cash, Other. |
| application_date | Date | Yes | Date of submission. |
| status | Select | Yes | Draft, Submitted, In Process, Approved, Rejected, Issued, Cancelled. |
| notes | Small Text | No | Internal notes. |

## 8. Holding

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data (UUID) | Yes | Internal key. A short code `HLD-2026-00001` is shown. |
| plan | Link (Plan) | Yes | What the Client holds. |
| provider_name_snapshot | Data | Yes | Copied at start. |
| product_name_snapshot | Data | Yes | Copied at start. |
| plan_name_snapshot | Data | Yes | Copied at start. |
| provider_reference | Data | Yes | Folio, policy, PRAN, receipt, account. |
| holding_type | Select | Yes | Folio, Policy, PRAN, FD, Bond, Post Office, PMS, AIF. |
| mode_of_holding | Select | Conditional | Single, Joint, Anyone or Survivor, Former or Survivor. Required when there are two or more owners. |
| status | Select | Yes | Active, Matured, Closed, Lapsed, Surrendered, Claimed. |
| start_date | Date | Yes | Start of the Holding. |
| maturity_date | Date | No | End date, if any. |
| invested_amount | Currency | Yes | Money paid in. |
| current_value | Currency | No | Value on `value_on`. |
| value_on | Date | No | As-of date. |
| value_source | Select | No | Manual, Provider Statement, NAV, Data Feed. |
| units | Decimal | No | MF, SIF, NPS, ULIP. |
| nav | Currency | No | NAV used for the value. |
| nav_date | Date | No | Date of that NAV. |
| interest_rate | Percent | No | FD or post office rate at start. |
| premium_amount | Currency | No | Insurance. |
| sum_assured | Currency | No | Insurance. |
| maturity_value | Currency | No | Expected or actual. |
| source_application | Link (Application) | No | The Application that created it. |
| notes | Small Text | No | Internal notes. |

Rules:

- A Holding points to one Plan.
- A Holding keeps its start terms.
- A Holding is never hard deleted. Use status.
- A provider reference is unique per provider and type. Confirm in OQ-032.

## 9. Transaction

| Field | Type | Required | Notes |
|---|---|---|---|
| name | Data | Yes | Naming series. |
| holding | Link (Holding) | Yes | Parent Holding. |
| transaction_type | Select | Yes | Purchase, SIP, Additional Purchase, Redemption, Switch Out, Switch In, IDCW Payout, IDCW Reinvestment, Premium, Contribution, Interest, Coupon, Maturity, Renewal, Claim, Reversal. |
| transaction_date | Date | Yes | Date of the event. |
| amount | Currency | No | Cash amount. |
| units | Decimal | No | Units added or removed. |
| nav | Currency | No | NAV used. |
| reference | Data | No | Provider reference. |
| source | Select | No | Manual, Statement, Feed. |
| status | Select | Yes | Posted, Pending, Failed, Reversed. |
| linked_transaction | Link (Transaction) | No | The other side of a switch. |
| notes | Small Text | No | Internal notes. |

## 10. Rules and constraints

1. Unique: `provider_code`, `product_code`, `plan_code`.
2. One category detail per Plan.
3. A Plan needs an active Product.
4. A Holding needs a Plan.
5. A Holding has one to three Owners, ranked 1 to 3.
6. `mode_of_holding` is required when there are two or more Owners.
7. A Holding stores the rate, NAV, and terms it started with.
8. A Rate Card or NAV row is not edited after use.
9. A Transaction is not deleted. Use a reversal.
10. A closed Holding stays readable.

## 11. Open questions

- OQ-017: Hybrid model.
- OQ-018: Category depth.
- OQ-019: Legal entity.
- OQ-020: Commission scope.
- P-001 to P-126: see [`../../02-domain/product-model/04-question-bank.md`](../../02-domain/product-model/04-question-bank.md).
