# Product question bank

Status: Open. Last updated: 2026-11-16.

## How to use this page

The product model has more detail than the rest of the design. These questions turn the detail into decisions.

Answer in batches by group. Use the ID, like this:

```
P-001: yes
P-026: two fields, variant and option
P-034: one child table
```

You do not need to answer all 136 at once. The top 12 unblock the most work.

The bank covers phase 1: the catalog, manual Holdings and valuations, and referrals. It does not ask about transactions or commission, which are phase 2.

## Top 12

| ID | Question | Why it is first |
|---|---|---|
| P-001 | Do you accept the five-record model? | It decides the whole design. |
| P-002 | Is the Plan the unit of sale? | It fixes what a Holding points to. |
| P-025 | Do you confirm regular plans only? | It sets the catalog filter. |
| P-026 | Are variant and option two Plan fields or four Plans? | It sets the size of the catalog. |
| P-034 | Are the purchase and redemption rules a child table? | It stops the Plan form from growing without limit. |
| P-037 | Which MF and SIF identifiers do you need? | It decides import and matching. |
| P-039 | Which sources and filters apply to the scheme master? | It decides how the catalog is seeded. |
| P-051 | Do you accept one fixed deposit family? | It sets the FD catalog. |
| P-063 | Which insurance lines do you handle? | It sets the insurance detail fields. |
| P-075 | Is PRAN enough for NPS? | It sets the NPS key. |
| P-103 | Can a Holding be entered without an Application? | It affects migration and backfill. |
| P-115 | Is a referral only a referral and a payout? | It sets the referral record. |

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

## B. Providers and firm codes (P-013 to P-024)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-013 | Which providers do you work with today? List AMCs, insurers, banks, NBFCs, corporate issuers, and partners. | Seed data and migration. | Send the list. |
| P-014 | Is one Provider record per legal entity, or per brand? | Registration follows the legal entity. | One per legal entity, brand as display name. |
| P-015 | Do you need AMFI, IRDAI, SEBI, CIN, and GSTIN per Provider? | Compliance and statements. | Yes. |
| P-016 | Do you need provider contacts, service levels, and escalation notes? | Daily operations. | Yes, in a child table or notes. |
| P-017 | Do you need provider bank details for payout receipt? | Phase 2 reconciliation. | Yes, restricted. |
| P-018 | Do you need a provider portal link and a credential note? | Daily operations. | Link only. Never store a password. |
| P-019 | Is a national distributor both a Provider and a Distribution Partner? | Payout and product access. | Yes. Two roles, one organization. |
| P-020 | Do you need Provider status: Active, Suspended, Exited? | Stops new business without deleting history. | Yes. |
| P-021 | Do you need empanelment and exit dates per Provider? | Audit and payout trail. | Yes. |
| P-022 | Do you hold one ARN for the firm? | Mutual fund and SIF distribution. | Yes, one primary ARN. |
| P-023 | Do you hold one APMI membership? | PMS distribution. | Yes, one primary APMI. |
| P-024 | Do you hold one code per AMC and one per NBFC? | Scheme master and lender reporting. | Yes. Store them in Distributor Code. |

## C. Plans and variants (P-025 to P-036)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-025 | Do you sell regular plans only? | Direct plans change the catalog, payout, and website. | Yes, regular only. |
| P-026 | For MF and SIF, are Regular and Growth two Plan fields or four separate Plans? | Sets the size of the catalog. | Two fields: `variant` and `option`. |
| P-027 | Do you need IDCW payout and reinvestment as separate options? | They change units and cash. | Yes. |
| P-028 | Will you ever need direct plans? | Future scope. | No in phase 1. Reopen only if the business changes. |
| P-029 | Do you need an NFO state, separate from Active and Closed? | A plan is open for a short window, then reopens. | Yes. Add NFO. |
| P-030 | Do you need a Plan status separate from Product status? | A product stays open while one plan closes. | Yes. |
| P-031 | Are the minimum and maximum amounts on the Plan or in a rule? | Providers set them per transaction type. | In a Plan Transaction Rule. |
| P-032 | Do you need a lock-in period per Plan? | Redemption checks and reminders. | Yes. |
| P-033 | Do you need purchase, redemption, SIP, STP, SWP, and switch flags per Plan? | The scheme master carries them. | Yes, as current state. |
| P-034 | Do you accept one `Plan Transaction Rule` child table? | It holds the amount, multiple, cutoff, mode, and settlement rules. | Yes. |
| P-035 | Does the scheme master column set fit the Plan and the rule? | It avoids a rebuild when the importer arrives. | Yes. See the mapping in Products. |
| P-036 | Is the `L1` row a plan you sell? | It decides whether ISIN stays unique. | Confirm. Exclude until confirmed. |

## D. Mutual funds and SIF (P-037 to P-050)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-037 | Which identifiers do you need: ISIN, AMFI code, AMC scheme code, RTA scheme code? | Imports and matching. | All four. |
| P-038 | Can two Plans share one ISIN? | The scheme master repeats an ISIN across transaction rows. | Yes. Do not enforce a unique ISIN. |
| P-039 | Which sources and filters apply to the scheme master? | The catalog seed and refresh. | AMFI and BSE Star. Regular only. Exclude INSURED rows. |
| P-040 | Do you need `Scheme Type` (Equity, Debt, ELSS) and a SEBI scheme category? | The feed mixes asset class and tax category. | Store both: `asset_class` and `scheme_category`. |
| P-041 | Do you need the benchmark? | Performance context. | Yes. |
| P-042 | Do you need expense ratio and exit load? | Client questions and comparisons. | Yes, with effective dates. |
| P-043 | Do you need fund manager names? | Website and reviews. | Yes. |
| P-044 | Do you need scheme AUM and the riskometer? | Website trust signals. | Optional. |
| P-045 | Do you need dividend history? | Client statements. | Use IDCW transactions in phase 2. No separate table in phase 1. |
| P-046 | Do you hold at folio level or scheme level? | One Client can have two folios in one scheme. | One Holding per folio. |
| P-047 | Do you need to merge folios? | Cleanup and service. | A Service Request. No automatic merge. |
| P-048 | Do you need SIP, STP, and SWP? | Recurring transactions. | Phase 2. Store the flags now. |
| P-049 | How often does the scheme master change? | It sets the refresh cycle. | Confirm with the RTA. |
| P-050 | What do `L1`, `AMC_IND`, and the `INSURED` rows mean? | Import filters need the answer. | Ask the RTA. See OQ-041. |

## E. Fixed deposits and bonds (P-051 to P-062)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-051 | Do you accept one fixed deposit family for bank, corporate, and NBFC deposits? | They are the same product shape. | Yes. |
| P-052 | Is the issuer type on the Provider or on the FD detail? | One source for the issuer. | Provider type. |
| P-053 | Are cumulative and non-cumulative separate Plans? | Payout and value differ. | Yes. |
| P-054 | Is the senior citizen rate a Plan or a flag on the holder? | Eligibility follows the holder. | Rate Card column, plus a holder check. |
| P-055 | Does the first holder's age decide the senior rate? | Provider rules. | Yes, usually rank 1. |
| P-056 | Do you need TDS and Form 15G or 15H tracking? | Tax and cash flow. | Yes, basic fields. |
| P-057 | Do you need auto-renewal instructions? | Maturity servicing. | Yes. |
| P-058 | Do you need premature withdrawal penalty rules? | Advisor answers. | Yes, on FD Detail. |
| P-059 | Do you need loan against FD? | Client liquidity. | Yes, as a service note. |
| P-060 | Do you need the issuer credit rating? | Corporate and NBFC deposit risk. | Yes, with the agency. |
| P-061 | Is RBI Floating Rate Savings Bond in scope? | It is non-traded and has no ISIN. | Yes. |
| P-062 | Is 54EC Capital Gains Bond in scope, with the annual cap and tax section? | It has a five-year lock-in and a cap. | Yes. No T-Bills, SDL, dated GoI, or SGB. |

## F. Insurance (P-063 to P-074)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-063 | Which lines do you handle: term, endowment, money-back, ULIP, health, personal accident, critical illness, motor, home, travel, group? | Sets the detail fields. | Send the list. |
| P-064 | Is the life assured always the owner? | A parent can own a child's policy. | No. Store both roles. |
| P-065 | Do you need riders as separate Plans? | Cover and commission differ. | Yes. |
| P-066 | Do you need nominee shares? | Multiple nominees. | Yes. |
| P-067 | Do you need medical tests and underwriting status? | Proposal tracking. | Only if KNAPS handles proposals. |
| P-068 | Do you need policy status: proposal, issued, lapse, paid-up, surrendered, matured, claimed? | Servicing and reports. | Yes. |
| P-069 | Do you need next premium date and grace period? | Reminders. | Yes. |
| P-070 | Do you need bonus and fund value? | Valuation. | Yes, from the insurer statement. |
| P-071 | For health, do you need members covered and sum insured per member? | Family floater versus individual. | Yes. |
| P-072 | Do you need room rent limits, waiting periods, and network hospitals? | Client questions. | Basic fields. |
| P-073 | For general insurance, do you need the insured asset? | Renewal and claims. | Yes. Car number or property address. |
| P-074 | Do you need claim history? | Renewal and service. | Yes, as a Service Request history. |

## G. NPS (P-075 to P-084)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-075 | Is PRAN the only identifier, or do you also need an NPS account number? | Matching and imports. | PRAN. |
| P-076 | Do you handle Tier I and Tier II? | They are separate Holdings. | Yes, if sold. |
| P-077 | Do you handle corporate NPS with employer contribution? | Contribution split. | Yes. Add employer name, contribution flag, and payroll reference. |
| P-078 | Do you handle NPS Vatsalya for minors? | Guardian operation and conversion at 18. | Yes. Use `subscriber_type = Minor`. |
| P-079 | Is one Plan one scheme plus one fund manager? | Unit and NAV tracking. | Yes. |
| P-080 | Is a Holding one NPS account with three scheme rows, or three Holdings? | Affects units, NAV, and reports. | One Holding with scheme sub-rows. |
| P-081 | Do you need NAV and unit balance per scheme? | Valuation. | Yes. |
| P-082 | Do you need partial withdrawal and annuity tracking? | Servicing. | Yes. |
| P-083 | Do you need 80CCD tax proof? | Client service. | Optional. |
| P-084 | Do you need a switch between schemes or fund managers? | Phase 2 transaction type. | Yes. |

## H. PMS and AIF (P-085 to P-092)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-085 | Do you need PMS strategy and benchmark? | Client reporting. | Yes. |
| P-086 | Do you need minimum investment and lock-in? | Eligibility. | Yes. |
| P-087 | Do you need fixed and performance fees? | Cost reporting. | Yes. |
| P-088 | Do you need capital account statements? | Reconciliation. | Yes, as attachments. |
| P-089 | Do you handle AIF Category I, II, and III? | Different rules and risk. | Yes, if sold. |
| P-090 | Do you need commitment and drawdown tracking? | AIF cash flow. | Yes. |
| P-091 | Do you need quarterly valuations? | AUM. | Yes. |
| P-092 | Do you need investor-level holdings inside the fund? | Fund accounting. | No in phase 1. |

## I. Post office and small savings (P-093 to P-102)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-093 | Which schemes do you sell: RD, TD, MIS, SCSS, NSC, KVP, PPF, SSY? | Catalog scope. | Send the list. |
| P-094 | Do you need the account number format per scheme? | Matching and validation. | Yes. |
| P-095 | Do you need the agent code? | Payout. | Yes, if agents are paid. |
| P-096 | Do you need passbook and nomination details? | Service. | Yes. |
| P-097 | Do you need default and penalty rules? | RD and PPF. | Basic notes. |
| P-098 | Do you need maturity proceeds instructions? | Servicing. | Yes. |
| P-099 | Do you need the SCSS five-year block and extension? | Maturity. | Yes. |
| P-100 | Do you need the PPF annual limit and deposit dates? | Compliance and reminders. | Yes. |
| P-101 | Do you need SSY guardian and girl-child rules? | Eligibility. | Yes. |
| P-102 | Do you need the rate at opening and the current rate? | Statements. | Yes, both. |

## J. Holdings and valuations (P-103 to P-114)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-103 | Does a Holding start only from an Application, or can it be entered directly? | Migration and backfill. | Allow direct entry with a reason. |
| P-104 | Is a Holding one per folio, one per scheme, or one per policy? | Duplicates and reporting. | One per provider reference. |
| P-105 | Do you need to merge Holdings? | Service and cleanup. | Only with an audited event. |
| P-106 | Do you need a Valuation record for every value update? | Audit and value history. | Yes. |
| P-107 | Does every value need a source and an as-on date? | Audit. | Yes. |
| P-108 | Do you need unit balance and value, or only value? | MF and NPS need both. | Both. |
| P-109 | How many decimal places for units? | Valuation accuracy. | Three, unless a provider needs four. |
| P-110 | Do you keep every Valuation row or only the latest? | History versus storage. | Keep every row. |
| P-111 | Does a value below the invested amount need a reason? | Review and audit. | Yes. |
| P-112 | Does a closed Holding stay in reports? | History. | Yes, with zero current value. |
| P-113 | Do some MF or SIF units sit in demat? | It adds a holding mode. | Assume physical in phase 1. Confirm. |
| P-114 | Does a renewal create a new Holding? | History. | Yes, or a new term row. Phase 2. |

## K. Referrals (P-115 to P-124)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-115 | Is a referral only a referral and a payout, or do you also track balances and liability? | It sets the record and the reports. | Referral only in phase 1. |
| P-116 | Which fields do you need for a demat referral? | Aditya Birla Money account opening. | DP ID, UCC, account type, status. |
| P-117 | Which fields do you need for a CASA referral? | HDFC Bank account opening. | Account number, account type, status. |
| P-118 | Which fields do you need for a loan referral? | Payout basis. | Lender, loan type, sanction amount, disbursed amount. |
| P-119 | Which loan types do you refer? | Eligibility and reporting. | Home, personal, LAP, business, vehicle. |
| P-120 | Is the disbursed amount the payout basis? | Revenue. | Yes. Store it now, track payout in phase 2. |
| P-121 | Which states does each referral type use? | Pipeline and follow-up. | Demat and CASA: open. Loan: sanction and disbursement. |
| P-122 | Do you need a note history on a referral? | Service and handover. | Yes. |
| P-123 | Can a referral become a Holding? | Prevents double counting. | No. Create a new record if the Client invests. |
| P-124 | Is the partner a Provider? | One partner directory. | Yes, with type Depository Participant, Bank, or NBFC. |

## L. Data entry, website, and reports (P-125 to P-136)

| ID | Question | Why it matters | Recommendation |
|---|---|---|---|
| P-125 | Where does data entry start: Provider, Product, or Application? | Workflow and adoption. | Application, with inline create. |
| P-126 | How many clicks should it take to add an FD? | Adoption. | Target five. |
| P-127 | Which fields are mandatory at entry and which can wait? | Speed versus completeness. | Only the deal terms at entry. |
| P-128 | Can an employee create a Holding with no Plan? | Data quality. | No. |
| P-129 | Should the website show Products or Plans? | Public clarity. | A Product page with Plan options. |
| P-130 | Should the website show live rates and NAV? | Trust and search. | Yes, with the as-of date. |
| P-131 | Should the website capture interest per Plan? | Lead quality. | Yes. |
| P-132 | Which reports need product data in phase 1? | Scope. | AUM by category, maturity calendar, holdings by plan, referral pipeline. |
| P-133 | Do you need product-wise AUM? | Business review. | Yes. |
| P-134 | Do you need a maturity calendar by category? | Servicing. | Yes. |
| P-135 | Do you need a referral pipeline report? | Follow-up and payout. | Yes. |
| P-136 | Do you need an audit of catalog changes? | Compliance. | Yes. |

## What happens after you answer

1. Close OQ-017 when P-001 to P-005 are clear.
2. Update OQ-018 with the depth per category.
3. Write the category detail fields into [Products and providers](../02-model/04-products-and-providers.md).
4. Update the website content model.
5. Build the catalog seed template for AMFI and BSE Star.
6. Add the phase 1 reports.

## Related

- [Products and providers](../02-model/04-products-and-providers.md)
- [Holdings and investments](../02-model/06-holdings-and-investments.md)
- [Referrals](../02-model/10-referrals.md)
- [Data model](data-model.md)
