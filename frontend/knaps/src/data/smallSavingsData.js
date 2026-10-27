// Centralized Post Office Small Savings Schemes Data Configuration
// Focused exclusively on POTD, KVP, NSC, and PORD as offered by KNAPS.
// Rates are governed by Ministry of Finance quarterly notifications.

export const SMALL_SAVINGS_SCHEMES = [
  {
    id: 'potd',
    name: 'Post Office Time Deposit (POTD)',
    shortName: 'POTD (1, 2, 3, 5 Years)',
    category: 'Fixed Sovereign Term Deposits',
    interestRate: 7.5, // 5-year rate (1Y: 6.9%, 2Y: 7.0%, 3Y: 7.1%, 5Y: 7.5%)
    ratesByTenure: {
      1: 6.9,
      2: 7.0,
      3: 7.1,
      5: 7.5
    },
    compounding: 'Quarterly compounded, paid annually',
    tenure: '1, 2, 3, or 5 Years',
    tenureYears: 5,
    minDeposit: 1000,
    maxDeposit: 0, // No upper limit
    depositFrequency: 'Lump Sum in multiples of ₹100',
    taxStatus: '5-Year TD qualifies for Sec 80C deduction; Interest is taxable at slab',
    taxSection: 'Section 80C (5-Year only)',
    payoutType: 'Annual Interest or Cumulative',
    liquidity: 'Premature closure allowed after 6 months (PO savings rate applied between 6-12 months)',
    eligibility: 'Resident Indian individuals (Single, Joint up to 3 adults, or on behalf of Minor)',
    nriEligible: false,
    goal: 'Structured Fixed Returns & Capital Preservation',
    description:
      'The sovereign equivalent of a bank fixed deposit backed directly by the Government of India. Available in 1, 2, 3, and 5-year tenures, with the 5-year deposit qualifying for Section 80C tax deduction.',
    badge: 'Sovereign Term Deposit',
    badgeColor: 'bg-teal-100 text-teal-800',
    calculatorType: 'time_deposit'
  },
  {
    id: 'kvp',
    name: 'Kisan Vikas Patra (KVP)',
    shortName: 'KVP',
    category: 'Guaranteed Capital Doubling',
    interestRate: 7.5,
    compounding: 'Annually compounded to double investment',
    tenure: '115 Months (9 Years & 7 Months to double)',
    tenureYears: 9.58,
    doublingPeriodMonths: 115,
    minDeposit: 1000,
    maxDeposit: 0, // No upper limit
    depositFrequency: 'Lump Sum in multiples of ₹1,000',
    taxStatus: 'Taxable at individual slab rate (No TDS by Post Office)',
    taxSection: 'None',
    payoutType: 'Doubled Capital on Maturity',
    liquidity: 'Premature encashment permitted after 2 years and 6 months (30 months)',
    eligibility: 'Resident Indian adults (Single, Joint up to 3 adults, or on behalf of Minor)',
    nriEligible: false,
    goal: 'Long-Term Capital Doubling',
    description:
      'A sovereign government certificate designed to double your invested capital over the notified tenure (currently 115 months at 7.5% p.a.), offering safe exit liquidity after 30 months.',
    badge: 'Capital Doubling',
    badgeColor: 'bg-amber-100 text-amber-800',
    calculatorType: 'doubling_lump_sum'
  },
  {
    id: 'nsc',
    name: 'National Savings Certificate (NSC)',
    shortName: 'NSC VIII Issue',
    category: 'Tax Saving & Lump Sum Accumulation',
    interestRate: 7.7,
    compounding: 'Annually compounded, paid at maturity',
    tenure: '5 Years',
    tenureYears: 5,
    minDeposit: 1000,
    maxDeposit: 0, // No upper limit
    depositFrequency: 'Lump Sum in multiples of ₹100',
    taxStatus: 'Sec 80C deduction on deposit; Annual accrued interest deemed reinvested',
    taxSection: 'Section 80C',
    payoutType: 'Cumulative on Maturity',
    liquidity: 'Strictly locked for 5 years (except upon court order or demise)',
    eligibility: 'Resident Indian individuals (Single, Joint up to 3 adults, or on behalf of Minor)',
    nriEligible: false,
    goal: 'Tax-Saving & Guaranteed Capital Growth',
    description:
      'A premier 5-year savings certificate with annual compounding interest at 7.7% p.a. The interest accruing each year is deemed reinvested and qualifies for fresh Section 80C deductions for the first 4 years.',
    badge: 'Deemed Reinvested 80C',
    badgeColor: 'bg-purple-100 text-purple-800',
    calculatorType: 'lump_sum_cumulative'
  },
  {
    id: 'pord',
    name: 'Post Office Recurring Deposit (PORD)',
    shortName: '5-Year Post Office RD',
    category: 'Monthly Savings Discipline',
    interestRate: 6.7,
    compounding: 'Quarterly compounded',
    tenure: '5 Years (60 Monthly Installments)',
    tenureYears: 5,
    minDeposit: 100,
    maxDeposit: 0, // No upper limit
    depositFrequency: 'Monthly Installment (Min ₹100/mo, multiples of ₹10)',
    taxStatus: 'Taxable at slab rate (No TDS deducted by Post Office)',
    taxSection: 'None',
    payoutType: 'Cumulative on Maturity',
    liquidity: 'Up to 50% loan facility after 1 year; Premature closure after 3 years',
    eligibility: 'Resident Indian individuals (Single, Joint up to 3 adults, or on behalf of Minor)',
    nriEligible: false,
    goal: 'Disciplined Monthly Wealth Accumulation',
    description:
      'A 5-year sovereign monthly savings plan with an entry threshold of just ₹100/month, quarterly compounding, and convenient loan facilities against accumulated balance.',
    badge: 'Monthly Discipline',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    calculatorType: 'monthly_rd'
  }
];

export const GOAL_CATEGORIES = [
  { id: 'all', label: 'All Post Office Schemes' },
  { id: 'tax-saving', label: 'Tax-Saving (Sec 80C)', schemes: ['nsc', 'potd'] },
  { id: 'capital-doubling', label: 'Guaranteed Capital Doubling', schemes: ['kvp'] },
  { id: 'fixed-growth', label: 'Fixed Term Growth', schemes: ['potd', 'nsc'] },
  { id: 'monthly-habit', label: 'Monthly Recurring Savings', schemes: ['pord'] }
];
