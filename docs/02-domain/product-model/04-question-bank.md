# Product question bank

Status: Open. Last updated: 2026-11-16.

## How to use this page

The product model has more detail than the rest of the design. These questions turn the detail into decisions.

Answer in batches by group. Use the ID, like this:

```
P-001: yes
P-023: two fields, variant and option
P-025: rate card
```

You do not need to answer all 126 at once. The top 12 unblock the most work.

## Top 12

| ID | Question | Why it is first |
|---|---|---|
| P-001 | Do you accept the five-record model? | It decides the whole design. |
| P-002 | Is the Plan the unit of sale? | It fixes what a Holding points to. |
| P-023 | Are Direct and Growth two fields or four Plans? | It sets the size of the catalog. |
| P-025 | Is the FD rate on the Plan or a Rate Card? | It decides how rate history works. |
| P-027 | Is an insurance rider a separate Plan? | It affects cover and commission. |
| P-028 | Is NPS one Holding with three schemes or three Holdings? | It affects units, NAV, and reports. |
| P-035 | Which MF identifiers do you need? | It decides import and matching. |
| P-047 | Which FD types do you sell? | It sets the FD catalog. |
| P-059 | Which insurance lines do you handle? | It sets the insurance detail fields. |
| P-073 | Is PRAN enough for NPS? | It sets the NPS key. |
| P-103 | Can a Holding be entered without an Application? | It affects migration and backfill. |
| P-118 | Can a Holding exist without a Plan? | It protects reporting quality. |

## A. Catalog structure (P-001 to P-012)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-001 | Do you accept the five-record model: Provider, Product, Plan, Category Detail, Holding? | It decides the whole product design. See OQ-017. | Yes. |
| P-002 | Is the Plan the unit of sale, so a Client always buys a Plan and never a bare Product? | Keeps terms and history clean. | Yes. |
| P-003 | Does every Product need at least one active Plan before it can be shown or sold? | Prevents an unsellable catalog entry. | Yes. |
| P-004 | When a provider adds an option, such as a new tenure or payout, do we add a Plan or a new Product? | Avoids product sprawl. | Add a Plan. |
| P-005 | Should a discontinued Product or Plan stay visible but not sellable? | Existing Holdings still need the record. | Yes. |
| P-006 | Do you need one internal code per Product and one per Plan? What format? | Staff quote them and imports match them. | Yes. Use `PRD-MF-0001` and `PLN-000001`. |
| P-007 | Should the product name be the provider's name or a plain-language name? | Search and website clarity. | Keep the provider name, plus a short display name. |
| P-008 | Do you need website visibility as a separate flag on Product and Plan? | Not every internal plan should appear online. | Yes. |
| P-009 | Do you need product tags such as tax saving, retirement, child, or liquidity? | Website filters and client segments. | Yes, a simple tag table. |
| P-010 | Do you need a brochure and a one-page summary per Product? | Website and RM use. | Yes. Public summary, private file. |
| P-011 | Who can create or edit a Product and Plan? | A catalog error affects every sale. | Operations creates, Compliance approves. |
| P-012 | Do rate and NAV changes need maker-checker? | A wrong rate misprices every sale. | Maker-checker for Rate Card. Audit only for NAV. |

## B. Providers (P-013 to P-022)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-013 | Which providers do you work with today? Please list AMCs, insurers, banks, NBFCs, and others. | Seed data and migration. | Send the list. |
| P-014 | Is one Provider record per legal entity, or per brand? | Commission and registration follow the legal entity. | One per legal entity, brand as display name. |
| P-015 | Do you need AMFI, IRDAI, SEBI, or CIN numbers per Provider? | Compliance and statements. | Yes. |
| P-016 | Do you need provider contacts, service levels, and escalation notes? | Daily operations. | Yes, in a child table or notes. |
| P-017 | Do you need provider bank details for commission receipt? | Reconciliation. | Yes, restricted. |
| P-018 | Do you need a provider portal link and a credential note? | Daily operations. | Link only. Never store a password. |
| P-019 | Is a national distributor both a Provider and a Distribution Partner? | Commission payer and product access. | Yes. Two roles, one organization. |
| P-020 | Do you need Provider status: Active, Suspended, Exited? | Stops new business without deleting history. | Yes. |
| P-021 | Do you need empanelment and exit dates per Provider? | Audit and commission trail. | Yes. |
| P-022 | Do you need default commission terms per Provider? | Reduces entry work. | Yes, overridable at Plan level. |

## C. Plans and variants (P-023 to P-034)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-023 | For MF, are Direct/Regular and Growth/IDCW two Plan fields or four separate Plans? | Sets the size of the catalog. | Two fields: `variant` and `option`. |
| P-024 | Do you need IDCW payout and reinvestment as separate options? | They change units and cash. | Yes. |
| P-025 | For FD, is the rate on the Plan or on a Rate Card? | Rates change by date. | Rate Card, with a snapshot on the Holding. |
| P-026 | Should the Holding keep the rate at opening even after the card changes? | Statements must match. | Yes. |
| P-027 | For insurance, is a rider a separate Plan or a row under the base policy? | Cover and commission differ. | A separate Plan, linked to the base. |
| P-028 | For NPS, is a Plan one scheme plus one fund manager, or one Holding with three schemes? | Affects units, NAV, and reports. | Decide. Recommend one Holding with scheme sub-rows. |
| P-029 | Can a Client change the NPS fund manager or allocation? | It is a switch, not an edit. | Record a transaction. |
| P-030 | For AIF and PMS, is a Plan one strategy plus one fee option? | Terms and commission. | Yes. |
| P-031 | Do you need minimum and maximum investment per Plan? | Entry validation and website display. | Yes. |
| P-032 | Do you need a lock-in period per Plan? | Reminders and redemption checks. | Yes. |
| P-033 | Do you need a Plan status separate from Product status? | A product stays open while one plan closes. | Yes. |
| P-034 | How many decimal places for units? | Valuation accuracy. | Three, unless a provider needs four. |

## D. Mutual funds and SIF (P-035 to P-046)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-035 | Which identifiers do you need: ISIN, AMFI code, RTA code? | Imports and matching. | ISIN and AMFI. |
| P-036 | Do you need both the scheme ISIN and the plan ISIN? | Direct and Regular have different ISINs. | Store the ISIN on the Plan. |
| P-037 | Do you need the scheme category, such as large cap or flexi cap? | Website filters and risk. | Yes. |
| P-038 | Do you need the benchmark? | Performance context. | Yes. |
| P-039 | Do you need expense ratio and exit load? | Client questions and comparisons. | Yes, with effective dates. |
| P-040 | Do you need fund manager names? | Website and reviews. | Yes. |
| P-041 | Do you need scheme AUM and the riskometer? | Website trust signals. | Optional. |
| P-042 | Do you need dividend history? | Client statements. | Use IDCW transactions. No separate table. |
| P-043 | Do you hold at folio level or scheme level? | One Client can have two folios in one scheme. | One Holding per folio. |
| P-044 | Do you need to merge folios? | Cleanup and service. | A Service Request. No automatic merge. |
| P-045 | Do you need SIP, STP, and SWP? | Recurring transactions. | Yes, as transaction types. |
| P-046 | Do you need a SIP schedule and failed instalment tracking? | Servicing and reminders. | Yes. |

## E. Fixed deposits and bonds (P-047 to P-058)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-047 | Which FD types do you sell: bank, NBFC, corporate? | Product fields and risk. | All three. |
| P-048 | Are cumulative and non-cumulative separate Plans? | Payout and value differ. | Yes. |
| P-049 | Is the senior citizen rate a Plan or a flag on the holder? | Eligibility follows the holder. | Rate Card column, plus a holder check. |
| P-050 | Does the first holder's age decide the senior rate? | Provider rules. | Yes, usually rank 1. |
| P-051 | Do you need TDS and Form 15G or 15H tracking? | Tax and cash flow. | Yes, basic fields. |
| P-052 | Do you need auto-renewal instructions? | Maturity servicing. | Yes. |
| P-053 | Do you need premature withdrawal penalty rules? | Advisor answers. | Yes, on FD Detail. |
| P-054 | Do you need loan against FD? | Client liquidity. | Yes, as a service note. |
| P-055 | For GoI bonds, do you need ISIN, coupon, and accrued interest? | Valuation. | Yes. |
| P-056 | Do you need bond price history? | Accurate valuation. | Recommended if the book is large. |
| P-057 | Do you need coupon schedules and reminders? | Cash flow. | Yes. |
| P-058 | Do you need SGB grams and gold price separately? | SGB is not a rupee bond. | Yes. |

## F. Insurance (P-059 to P-072)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-059 | Which lines do you handle: term, endowment, money-back, ULIP, health, motor, home, travel? | Sets the detail fields. | Send the list. |
| P-060 | Is the life assured always the owner? | A parent can own a child's policy. | No. Store both roles. |
| P-061 | Do you need riders as separate Plans? | Cover and commission. | Yes. |
| P-062 | Do you need nominee shares? | Multiple nominees. | Yes. |
| P-063 | Do you need medical tests and underwriting status? | Proposal tracking. | Only if KNAPS handles proposals. |
| P-064 | Do you need policy status: proposal, issued, lapse, paid-up, surrendered, matured, claimed? | Servicing and reports. | Yes. |
| P-065 | Do you need next premium date and grace period? | Reminders. | Yes. |
| P-066 | Do you need bonus and fund value? | Valuation. | Yes, from the insurer statement. |
| P-067 | For health, do you need members covered and sum insured per member? | Family floater versus individual. | Yes. |
| P-068 | Do you need room rent limits, waiting periods, and network hospitals? | Client questions. | Basic fields. |
| P-069 | For general insurance, do you need the insured asset? | Renewal and claims. | Yes. Car number or property address. |
| P-070 | Do you need claim history? | Renewal and service. | Yes, as a Service Request history. |
| P-071 | Do you need first-year and renewal commission separately? | Reconciliation. | Yes. |
| P-072 | Is ULIP a separate category or life insurance with units? | It behaves like both. | Life insurance with unit and NAV fields. |

## G. NPS (P-073 to P-082)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-073 | Is PRAN the only identifier, or do you also need an NPS account number? | Matching and imports. | PRAN. |
| P-074 | Do you handle Tier I and Tier II? | They are separate Holdings. | Yes, if sold. |
| P-075 | Do you handle corporate NPS with employer contribution? | Contribution split. | If yes, add employer fields. |
| P-076 | Is one Plan one scheme plus one fund manager? | Unit and NAV tracking. | Yes. |
| P-077 | Do you need asset allocation per scheme? | Client review. | Yes. |
| P-078 | Do you need NAV per scheme? | Valuation. | Yes. |
| P-079 | Do you need unit balance per scheme? | Valuation. | Yes. |
| P-080 | Do you need partial withdrawal and annuity tracking? | Servicing. | Yes. |
| P-081 | Do you need 80CCD tax proof? | Client service. | Optional. |
| P-082 | Do you need a switch between schemes or fund managers? | Transaction type. | Yes. |

## H. PMS and AIF (P-083 to P-092)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-083 | Do you need PMS strategy and benchmark? | Client reporting. | Yes. |
| P-084 | Do you need minimum investment and lock-in? | Eligibility. | Yes. |
| P-085 | Do you need fixed and performance fees? | Cost reporting. | Yes. |
| P-086 | Do you need capital account statements? | Reconciliation. | Yes, as attachments. |
| P-087 | Do you handle AIF Category I, II, and III? | Different rules and risk. | Yes, if sold. |
| P-088 | Do you need commitment and drawdown tracking? | AIF cash flow. | Yes. |
| P-089 | Do you need distribution commission from AIF? | Revenue. | Yes. |
| P-090 | Do you need quarterly valuations? | AUM. | Yes. |
| P-091 | Do you need side letters or special terms? | Client-specific deals. | Store an attachment. |
| P-092 | Do you need investor-level holdings inside the fund? | Fund accounting. | No in phase 1. |

## I. Post office and small savings (P-093 to P-102)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-093 | Which schemes do you sell: RD, TD, MIS, SCSS, NSC, KVP, PPF, SSY? | Catalog scope. | Send the list. |
| P-094 | Do you need the account number format per scheme? | Matching and validation. | Yes. |
| P-095 | Do you need the agent code? | Commission. | Yes, if agents are paid. |
| P-096 | Do you need passbook and nomination details? | Service. | Yes. |
| P-097 | Do you need default and penalty rules? | RD and PPF. | Basic notes. |
| P-098 | Do you need maturity proceeds instructions? | Servicing. | Yes. |
| P-099 | Do you need the SCSS five-year block and extension? | Maturity. | Yes. |
| P-100 | Do you need the PPF annual limit and deposit dates? | Compliance and reminders. | Yes. |
| P-101 | Do you need SSY guardian and girl-child rules? | Eligibility. | Yes. |
| P-102 | Do you need the rate at opening and the current rate? | Statements. | Yes, both. |

## J. Holdings and transactions (P-103 to P-114)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-103 | Does a Holding start only from an Application, or can it be entered directly? | Migration and backfill. | Allow direct entry with a reason. |
| P-104 | Is a Holding one per folio, one per scheme, or one per policy? | Duplicates and reporting. | One per provider reference. |
| P-105 | Do you need to merge Holdings? | Service and cleanup. | Only with an audited event. |
| P-106 | Which transaction types are phase 1? | Entry scope. | Purchase, redemption, switch, premium, contribution, interest, maturity, renewal, claim. |
| P-107 | Does a transaction update the Holding value automatically? | Accuracy. | It proposes a value. The employee confirms. |
| P-108 | Do you need unit balance and value, or only value? | MF and NPS need both. | Both. |
| P-109 | Do you need a source on every value? | Audit. | Yes. |
| P-110 | Do you need a value as-of date? | Audit. | Yes. |
| P-111 | Do you need realised and unrealised gain? | Client reporting. | Phase 2 unless easy. |
| P-112 | Do you need to link a switch out and a switch in? | Audit. | Yes. |
| P-113 | Does a renewal create a new Holding? | History. | Yes, or a new term row. |
| P-114 | Does a closed Holding stay in reports? | History. | Yes, with zero current value. |

## K. Data entry, website, and reports (P-115 to P-126)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-115 | Where does data entry start: Provider, Product, or Application? | Workflow and adoption. | Application, with inline create. |
| P-116 | How many clicks should it take to add an FD? | Adoption. | Target five. |
| P-117 | Which fields are mandatory at entry and which can wait? | Speed versus completeness. | Only the deal terms at entry. |
| P-118 | Can an employee create a Holding with no Plan? | Data quality. | No. |
| P-119 | Should the website show Products or Plans? | Public clarity. | A Product page with Plan options. |
| P-120 | Should the website show live rates and NAV? | Trust and search. | Yes, with the as-of date. |
| P-121 | Should the website capture interest per Plan? | Lead quality. | Yes. |
| P-122 | Which reports need product data in phase 1? | Scope. | AUM by category, maturity calendar, commission by product, holdings by plan. |
| P-123 | Do you need product-wise AUM? | Business review. | Yes. |
| P-124 | Do you need a maturity calendar by category? | Servicing. | Yes. |
| P-125 | Do you need commission by product and provider? | Revenue. | Yes. |
| P-126 | Do you need an audit of catalog changes? | Compliance. | Yes. |

## What happens after you answer

1. Close OQ-017 when P-001 to P-005 are clear.
2. Update OQ-018 with the depth per category.
3. Write the category detail fields into the field dictionary.
4. Update the website content model.
5. Build the catalog import template.
6. Add the phase 1 reports.

## Related

- [The product model](01-product-model.md)
- [Category catalog](02-category-catalog.md)
- [Money, dates, and values](03-money-dates-and-values.md)
- [Data model draft](05-data-model-draft.md)
