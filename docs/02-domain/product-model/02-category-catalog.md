# Product category catalog

Status: Draft. Last updated: 2026-11-16.

## How to read this page

Each section follows the same shape:

- **In plain words**: what the product is.
- **Example**: a Sharma family case with real numbers.
- **Identifier**: what the provider uses to name the Holding.
- **What the employee records**: the facts that matter at entry.
- **What changes over time**: what must never be overwritten.
- **Phase 1 depth**: what to build first.
- **Decisions needed**: questions in the [question bank](04-question-bank.md).

The depth is a proposal. OQ-018 is open.

## At a glance

| Family | Provider type | Main identifier | Value driver | Changes over time | Phase 1 |
|---|---|---|---|---|---|
| Mutual fund | AMC | Folio, ISIN | Units × NAV | Daily NAV | Full |
| SIF | AMC | Folio, ISIN | Units × NAV | Daily NAV | Full |
| NPS | NPS | PRAN | Units × NAV per scheme | Daily NAV | Full |
| Life insurance | Insurer | Policy number | Surrender or fund value | Premium, bonus, fund value | Full policy record |
| Health insurance | Insurer | Policy number | Cover, not AUM | Renewal, premium | Full policy record |
| General insurance | Insurer | Policy number | Cover, not AUM | Renewal, premium | Full policy record |
| Bank or NBFC FD | Bank, NBFC | Receipt number | Principal plus accrued interest | Rate card | Full |
| Government bond | RBI, bank | ISIN | Price plus accrued interest | Price, yield | Holding and coupon |
| Post office | India Post | Account number | Deposit plus accrued interest | Rate notification | Full |
| PMS | PMS manager | Account number | Manager valuation | Monthly or quarterly | Holding and statement |
| AIF | AIF manager | Account number | Manager valuation | Quarterly | Holding and statement |

## 1. Mutual fund

**In plain words.** Many investors pool money. A professional manager buys shares or bonds with the pool. Each investor owns **units**. The unit price is the **NAV**. The value of the investment is units multiplied by NAV.

**Example.** Ram invests ₹10,00,000 in HDFC Flexi Cap Fund, Direct plan, Growth option. He gets folio 1234567. On the allotment date the NAV is ₹250. He receives 4,000 units. Later the NAV is ₹300. His value is ₹12,00,000.

**Identifier.** Folio number. The plan carries the ISIN and the AMFI scheme code.

**What the employee records.**

- Product: HDFC Flexi Cap Fund.
- Plan: Direct, Growth.
- MF Detail: ISIN, scheme category, benchmark, expense ratio, exit load, fund managers, riskometer.
- Holding: folio, units, allotment NAV, start date, current value and value date.
- Transactions: purchase, SIP instalment, redemption, switch, IDCW payout or reinvestment.

**What changes over time.** NAV changes every business day. Units change on each transaction. The expense ratio and exit load can change. Add new rows; do not edit old ones.

**Phase 1 depth.** Full. The employee enters units and NAV manually. A feed can come in phase 2.

**Decisions needed.** P-035 to P-046.

## 2. Specialised Investment Fund (SIF)

**In plain words.** A SIF is a SEBI product for strategies that a normal mutual fund cannot run, such as long-short equity or concentrated sector bets. It has a higher minimum investment, usually ₹10,00,000. It behaves like a mutual fund for units and NAV.

**Example.** Mohan invests ₹10,00,000 in an equity long-short SIF. He gets a folio and units. The manager can hold long and short positions. The NAV moves with the strategy.

**Identifier.** Folio and ISIN.

**What the employee records.** The same as a mutual fund, plus the strategy label: long-short, sectoral, thematic, or credit.

**What changes over time.** NAV, units, strategy limits, and fund manager.

**Phase 1 depth.** Full catalog and Holding. Treat it as a mutual fund with a strategy field. Confirm the current SEBI minimum and lock-in.

**Decisions needed.** P-035 to P-046.

## 3. National Pension System (NPS)

**In plain words.** NPS is a retirement account. The investor contributes money. The money is split across schemes: E for equity, C for corporate bonds, and G for government bonds. Each scheme has units and a NAV. The investor also chooses a fund manager. At retirement, part of the money buys an annuity.

**Example.** Suresh contributes ₹50,000 a year to Tier I. He chooses 75% Scheme E, 15% Scheme C, and 10% Scheme G, with one fund manager. His PRAN is 110012345678. Each contribution buys units in the three schemes.

**Identifier.** PRAN. Tier I and Tier II are separate Holdings.

**What the employee records.**

- Product: NPS.
- Plan: Tier I or Tier II, scheme E, C, or G, fund manager.
- NPS Detail: scheme option, allocation, annuity option, employer contribution flag.
- Holding: PRAN, units per scheme, NAV per scheme, contribution dates.
- Transactions: contribution, employer contribution, partial withdrawal, annuity purchase, exit.

**What changes over time.** NAV per scheme, units per contribution, fund manager, and allocation.

**Phase 1 depth.** Full. The employee enters units and NAV. One Holding can carry three scheme sub-rows or three Holdings. Decide in P-073 to P-082.

**Decisions needed.** P-073 to P-082.

## 4. Life insurance

**In plain words.** The insurer pays a sum assured when the life assured dies, or at maturity, depending on the plan. The owner pays a premium. A term plan pays only on death. An endowment or money-back plan also pays at maturity. A ULIP invests part of the premium in funds, so it has units and a NAV.

**Example.** Ram buys a 20-year term plan with a sum assured of ₹50,00,000. The annual premium is ₹20,000. Sita is the nominee. The policy number is 778812.

**Identifier.** Policy number.

**What the employee records.**

- Product: LIC Jeevan Amar.
- Plan: 20-year term, annual premium, non-smoker.
- Insurance Detail: sum assured, premium, premium frequency, policy term, waiting period, riders, surrender value, maturity value.
- Holding: policy number, start date, maturity date, next premium date, status.
- Holding Party: owner, life assured, nominee, guardian for a minor nominee.

**What changes over time.** Premium due dates, policy status, bonus, fund value, nominee, and riders.

**Phase 1 depth.** Full policy record. No quotes, illustrations, or comparison. Store the current value from the insurer statement.

**Decisions needed.** P-059 to P-072.

**Note on AUM.** A term policy has no surrender value. Do not add the sum assured to AUM. Use the surrender value or fund value.

## 5. Health insurance

**In plain words.** The insurer pays hospital bills up to a sum insured. The Client pays a premium. The policy covers named members. It is protection, not an asset.

**Example.** Ram and Sita buy a family floater of ₹10,00,000. The annual premium is ₹28,000. The policy covers both of them. It renews each year.

**Identifier.** Policy number.

**What the employee records.** Sum insured, premium, members covered, waiting period, room rent limit, network hospitals, renewal date, and claim history.

**What changes over time.** Premium, sum insured, members, and renewal status.

**Phase 1 depth.** Full policy record and renewal reminder. No claim adjudication. A claim is a Service Request.

**Decisions needed.** P-059 to P-072.

**Note on AUM.** A health policy has no surrender value. It is not AUM. Show the cover separately.

## 6. General insurance

**In plain words.** Insurance for a car, home, shop, or travel. The insurer pays for damage or loss up to the cover. It is protection, not an asset.

**Example.** Mohan insures his car. The IDV is ₹8,00,000. The annual premium is ₹18,000. The policy number is 445120.

**Identifier.** Policy number.

**What the employee records.** Cover type, sum insured or IDV, premium, policy term, renewal date, and the insured asset.

**What changes over time.** Premium, IDV, renewals, and claims.

**Phase 1 depth.** Full policy record and renewal reminder. Motor, home, and travel need a few extra fields.

**Decisions needed.** P-059 to P-072.

**Note on AUM.** A general policy is not AUM.

## 7. Bank and NBFC fixed deposit

**In plain words.** The Client lends a lump sum to a bank or NBFC for a fixed period at a fixed rate. The provider pays interest. At maturity, the Client gets the principal and the interest. A cumulative deposit pays at maturity. A non-cumulative deposit pays interest at intervals.

**Example.** Sita opens a 36-month cumulative deposit of ₹5,00,000 with Bajaj Finance at 8.15%. The receipt number is 88921. The maturity value is about ₹6,36,000. The rate is fixed for the term.

**Identifier.** Receipt or deposit number.

**What the employee records.**

- Product: Bajaj Finance Fixed Deposit.
- Plan: 36 months, cumulative, non-senior.
- FD Detail: compounding, premature penalty, loan against deposit, TDS.
- Rate Card: rate by effective date, tenure band, senior citizen rate.
- Holding: receipt, principal, rate, start date, maturity date, payout frequency, maturity value.

**What changes over time.** The rate card changes. The Holding keeps the rate it was opened at. Interest accrues.

**Phase 1 depth.** Full. Rate cards are phase 1. Store the rate on the Holding as a snapshot.

**Decisions needed.** P-047 to P-058.

## 8. Government of India bonds

**In plain words.** The Client lends money to the Government of India or buys a government security. The government pays a coupon at intervals and repays the face value at maturity. A Treasury Bill has no coupon and is bought at a discount. A Sovereign Gold Bond is priced in grams of gold and pays a small coupon.

**Example.** Ram buys ₹5,00,000 of 7.18% GoI securities maturing in 2033. The ISIN is IN0020230085. The coupon is paid twice a year. If he sells before maturity, the price may be above or below face value.

**Identifier.** ISIN.

**What the employee records.** Bond type, ISIN, face value, coupon, coupon dates, maturity date, purchase price, accrued interest, and quantity.

**What changes over time.** Market price and yield. Coupon payments are fixed.

**Phase 1 depth.** Holding and coupon dates. A price history is useful but not required. Confirm in P-047 to P-058.

**Decisions needed.** P-047 to P-058.

**Note on SGB.** For Sovereign Gold Bonds, store grams, issue price, and the gold price used for valuation. Do not treat it as a rupee bond only.

## 9. Post office and small savings

**In plain words.** India Post and the government run small savings schemes. A recurring deposit takes a fixed amount each month. A time deposit takes a lump sum. MIS pays monthly income. SCSS is for senior citizens. NSC and KVP grow a lump sum. PPF is a long-term savings account. SSY is for a girl child.

**Example.** Sita, 65, opens SCSS with ₹15,00,000 for five years. The account number is 556677. She receives quarterly interest. The deposit is repaid at maturity.

**Identifier.** Account number.

**What the employee records.**

- Scheme type: RD, TD, MIS, SCSS, NSC, KVP, PPF, or SSY.
- Account number, deposit or instalment, rate, start date, maturity date.
- Payout frequency.
- Nomination and guardian, where relevant.
- Agent code, if any.

**What changes over time.** The government notifies rates each quarter. The Holding keeps the rate at opening. RD and PPF balances grow with deposits.

**Phase 1 depth.** Full. Rate cards are phase 1. RD and PPF need a deposit schedule.

**Decisions needed.** P-093 to P-102.

## 10. Portfolio Management Service (PMS)

**In plain words.** The Client gives a manager a large sum. The manager runs a portfolio of shares or bonds in the Client's name. The Client owns the securities, but the manager makes the decisions. The minimum is usually ₹50,00,000.

**Example.** Mohan invests ₹75,00,000 in a PMS strategy. The manager sends a monthly statement with the portfolio value and holdings. The Client holds a PMS account, not a mutual fund folio.

**Identifier.** PMS account number.

**What the employee records.** Strategy, benchmark, minimum investment, fee structure, lock-in, capital account, and the latest statement value.

**What changes over time.** Portfolio value, holdings, fees, and benchmark.

**Phase 1 depth.** Holding and statement value. Do not rebuild the manager's portfolio in phase 1.

**Decisions needed.** P-083 to P-092.

## 11. Alternative Investment Fund (AIF)

**In plain words.** An AIF pools money from a small number of large investors. It invests in private companies, real estate, credit, or other strategies. The investor commits a sum and the manager draws it down over time. The minimum is usually ₹1,00,00,000. The money is locked in for years.

**Example.** Radha commits ₹1,00,00,000 to a Category II credit fund. She pays ₹25,00,000 on the first drawdown. The manager values the fund quarterly. She cannot redeem early.

**Identifier.** AIF account number or commitment reference.

**What the employee records.** AIF category, strategy, commitment, drawdowns, lock-in, fees, and the latest valuation.

**What changes over time.** Drawdowns, valuations, distributions, and fees.

**Phase 1 depth.** Holding, commitment, drawdowns, and statement value. No fund accounting.

**Decisions needed.** P-083 to P-092.

## What is common to every family

1. A Client buys a Plan.
2. A Holding records the position.
3. Holding Party records the owners, nominees, and guardian.
4. A Transaction records each change.
5. A value has an as-of date and a source.
6. Rates and NAVs are history, not edits.

## Related

- [The product model](01-product-model.md)
- [Money, dates, and values](03-money-dates-and-values.md)
- [Question bank](04-question-bank.md)
