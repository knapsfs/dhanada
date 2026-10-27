// Mutual Funds comprehensive data repository for KNAPS

export const MF_CATEGORIES = [
  {
    id: 'equity',
    name: 'Equity Funds',
    shortDesc: 'Invest in stocks of publicly listed companies for long-term wealth creation.',
    riskLevel: 'Very High',
    riskColor: 'rose',
    idealHorizon: '5+ Years',
    taxTreatment: 'LTCG: 12.5% (>₹1.25L), STCG: 20%',
    icon: 'faChartLine',
    subcategories: [
      { name: 'Large Cap Funds', desc: 'Top 100 established market leaders with proven stability and steady growth.' },
      { name: 'Flexi Cap Funds', desc: 'Dynamic allocation across large, mid, and small cap companies based on market opportunities.' },
      { name: 'Mid Cap Funds', desc: 'Next 150 emerging leaders offering higher growth potential with moderate volatility.' },
      { name: 'Small Cap Funds', desc: 'High-growth potential companies with agile business models, suitable for aggressive investors.' },
      { name: 'Sectoral / Thematic', desc: 'Focused exposure to specific high-growth sectors like Banking, Tech, Pharma, or Infrastructure.' }
    ]
  },
  {
    id: 'debt',
    name: 'Debt Funds',
    shortDesc: 'Invest in fixed-income securities like Government Bonds, Corporate Debentures, and Treasury Bills.',
    riskLevel: 'Low to Moderate',
    riskColor: 'emerald',
    idealHorizon: '1 Month - 3 Years',
    taxTreatment: 'Taxed at marginal income slab rate',
    icon: 'faShieldHalved',
    subcategories: [
      { name: 'Liquid & Overnight', desc: 'Highest liquidity, zero exit load after 7 days, ideal for emergency funds.' },
      { name: 'Short Duration Funds', desc: 'Invest in debt papers with 1 to 3 year maturity for steady returns with low interest rate risk.' },
      { name: 'Corporate Bond Funds', desc: 'At least 80% invested in top-rated AA+ corporate bonds for reliable regular yield.' },
      { name: 'Gilt Funds', desc: 'Invested exclusively in Central and State Government securities with zero credit risk.' }
    ]
  },
  {
    id: 'hybrid',
    name: 'Hybrid Funds',
    shortDesc: 'Balanced combination of equity for capital growth and debt for safety & stability.',
    riskLevel: 'Moderate to High',
    riskColor: 'amber',
    idealHorizon: '3 - 5 Years',
    taxTreatment: 'Depends on equity allocation (>=65% gets equity taxation)',
    icon: 'faScaleBalanced',
    subcategories: [
      { name: 'Balanced Advantage (BAF)', desc: 'Dynamically rebalances equity and debt depending on PE ratios and market valuation.' },
      { name: 'Aggressive Hybrid', desc: '65% to 80% in equity, remainder in debt. Ideal for first-time equity investors.' },
      { name: 'Multi-Asset Allocation', desc: 'Invests across at least 3 asset classes including Equity, Debt, and Gold/Commodities.' },
      { name: 'Arbitrage Funds', desc: 'Captures price differences in cash and derivatives markets with debt-like low risk.' }
    ]
  },
  {
    id: 'index',
    name: 'Index Funds & ETFs',
    shortDesc: 'Low-cost passive funds that mirror benchmark indices like Nifty 50 or Sensex.',
    riskLevel: 'Same as Benchmark',
    riskColor: 'blue',
    idealHorizon: '5+ Years',
    taxTreatment: 'Equity taxation (LTCG: 12.5%, STCG: 20%)',
    icon: 'faArrowTrendUp',
    subcategories: [
      { name: 'Nifty 50 / Sensex Index', desc: 'Replicates India’s bellwether indices with ultra-low expense ratios.' },
      { name: 'Nifty Next 50', desc: 'Tracks emerging potential large-cap powerhouses ranked 51 to 100.' },
      { name: 'Target Maturity Index Debt', desc: 'Passively holds government/PSU bonds until maturity with predictable yield.' }
    ]
  },
  {
    id: 'elss',
    name: 'ELSS (Tax Saver)',
    shortDesc: 'Equity-linked tax saving mutual funds eligible for Section 80C deduction.',
    riskLevel: 'High',
    riskColor: 'violet',
    idealHorizon: '3+ Years (3-Year Lock-in)',
    taxTreatment: 'Sec 80C deduction up to ₹1.5L; LTCG 12.5% > ₹1.25L',
    icon: 'faFileInvoiceDollar',
    subcategories: [
      { name: 'Tax Saver Funds', desc: 'Shortest lock-in (3 years) among all 80C options like PPF (15Y) and Tax Saver FD (5Y).' },
      { name: 'Wealth & Tax Combo', desc: 'Delivers inflation-beating equity growth while saving up to ₹46,800 in taxes annually.' }
    ]
  },
  {
    id: 'liquid',
    name: 'Liquid & Money Market',
    shortDesc: 'Park surplus funds with high safety, capital preservation, and instant liquidity.',
    riskLevel: 'Low',
    riskColor: 'teal',
    idealHorizon: '1 Day to 6 Months',
    taxTreatment: 'Taxed at investor income slab rate',
    icon: 'faCoins',
    subcategories: [
      { name: 'Overnight Funds', desc: 'Matures in 1 day with virtually zero interest rate or default risk.' },
      { name: 'Liquid Funds', desc: 'Matures in up to 91 days. Better alternatives to traditional savings bank accounts.' },
      { name: 'Money Market Funds', desc: 'Invests in commercial papers and CDs with maturities up to 1 year.' }
    ]
  }
];

export const EXPLORE_FUNDS_DATA = [
  {
    id: 'large-cap',
    name: 'Large Cap Equity Strategy',
    category: 'Equity',
    badge: 'Core Portfolio',
    risk: 'Very High',
    horizon: 'Wealth Creation (5Y+)',
    minSip: 500,
    minLumpsum: 1000,
    assetMix: '80%-100% Top 100 Stocks',
    idealFor: 'Investors seeking disciplined long-term wealth compounding with established market leaders.',
    features: ['Low volatility among equity funds', 'Invested in blue-chip blue ribbon companies', 'High corporate governance standards'],
    suitability: 'First-time equity investors, retirement planning, children higher education corpus.'
  },
  {
    id: 'flexi-cap',
    name: 'Flexi Cap Equity Strategy',
    category: 'Equity',
    badge: 'All-Weather Growth',
    risk: 'Very High',
    horizon: 'Wealth Creation (5Y+)',
    minSip: 500,
    minLumpsum: 1000,
    assetMix: 'Unconstrained Large, Mid & Small Cap',
    idealFor: 'Investors seeking flexibility where the fund manager freely allocates to wherever best value lies.',
    features: ['Agile sector and market cap rotation', 'Diversified across 40-70 companies', 'Balances stability with momentum'],
    suitability: 'Investors with 5+ year horizons wanting one single go-to equity fund.'
  },
  {
    id: 'mid-cap',
    name: 'Mid Cap Growth Strategy',
    category: 'Equity',
    badge: 'High Growth',
    risk: 'Very High',
    horizon: 'Wealth Creation (5Y+)',
    minSip: 1000,
    minLumpsum: 5000,
    assetMix: '65%-100% in 101st-250th Companies',
    idealFor: 'Investors who can stomach short-term market swings for substantially higher long-term compounding.',
    features: ['Future large-cap champions', 'Higher operating leverage and EPS growth', 'Strong performance in economic expansions'],
    suitability: 'Experienced equity investors seeking aggressive wealth generation.'
  },
  {
    id: 'small-cap',
    name: 'Small Cap Alpha Strategy',
    category: 'Equity',
    badge: 'Aggressive Alpha',
    risk: 'Very High',
    horizon: 'Wealth Creation (5Y+)',
    minSip: 1000,
    minLumpsum: 5000,
    assetMix: '65%-100% in 251st+ Companies',
    idealFor: 'Long-term risk-tolerant investors looking to participate in India’s niche manufacturing & emerging trends.',
    features: ['Multi-bagger return potential', 'Under-researched market opportunities', 'Best suited for 7-10+ year SIPs'],
    suitability: 'High-risk appetites with long holding horizons.'
  },
  {
    id: 'elss-tax-saver',
    name: 'ELSS Tax Saver (80C)',
    category: 'ELSS',
    badge: 'Tax Saving 80C',
    risk: 'Very High',
    horizon: 'Long Term (3-5Y)',
    minSip: 500,
    minLumpsum: 500,
    assetMix: 'Diversified Multi-Cap Equity',
    idealFor: 'Salaried and self-employed taxpayers under the Old Tax Regime seeking Section 80C deductions.',
    features: ['Lowest 3-year lock-in in Sec 80C', 'Save up to ₹46,800 tax annually', 'Long-term equity wealth generation'],
    suitability: 'Taxpayers wanting tax deduction without locking funds for 5-15 years.'
  },
  {
    id: 'balanced-advantage',
    name: 'Balanced Advantage (BAF)',
    category: 'Hybrid',
    badge: 'Smart Asset Allocation',
    risk: 'Moderate',
    horizon: 'Long Term (3-5Y)',
    minSip: 1000,
    minLumpsum: 5000,
    assetMix: 'Dynamic Equity (30-80%) & Debt',
    idealFor: 'Investors who want equity upside while shielding capital during sharp market corrections.',
    features: ['Automatic profit booking at market peaks', 'Buys equity aggressively during crashes', 'Equity taxation efficiency'],
    suitability: 'Conservative equity investors, retirees seeking moderated volatility.'
  },
  {
    id: 'aggressive-hybrid',
    name: 'Aggressive Hybrid Strategy',
    category: 'Hybrid',
    badge: 'Balanced Growth',
    risk: 'Moderately High',
    horizon: 'Long Term (3-5Y)',
    minSip: 500,
    minLumpsum: 1000,
    assetMix: '65-80% Equity + 20-35% Debt',
    idealFor: 'Investors seeking high equity growth with a debt cushion to smooth volatility.',
    features: ['Built-in portfolio rebalancing', 'Eligible for equity capital gains tax', 'Lower drawdowns in bear markets'],
    suitability: 'Moderate risk investors planning for goals 3 to 5 years out.'
  },
  {
    id: 'nifty-index',
    name: 'Nifty 50 Index Fund',
    category: 'Index',
    badge: 'Passive Low-Cost',
    risk: 'Very High',
    horizon: 'Wealth Creation (5Y+)',
    minSip: 500,
    minLumpsum: 1000,
    assetMix: 'Top 50 Nifty Constituents',
    idealFor: 'Investors seeking market-mirroring returns without active manager risk at ultra-low expense ratios.',
    features: ['TER typically under 0.20%', 'No fund manager bias or style drift', 'Rides India’s long-term GDP growth'],
    suitability: 'Passive long-term investors, retirement corpus builders.'
  },
  {
    id: 'short-duration-debt',
    name: 'Corporate Bond & Short Duration',
    category: 'Debt',
    badge: 'Steady Income',
    risk: 'Low',
    horizon: 'Medium Term (1-3Y)',
    minSip: 1000,
    minLumpsum: 5000,
    assetMix: 'High-Rated Corporate & Govt Bonds',
    idealFor: 'Investors needing predictable returns, capital safety, and low interest rate risk.',
    features: ['High credit quality (AAA / Sovereign)', 'Lower volatility than equity', 'Regular dividend/growth options'],
    suitability: 'Conservative wealth preservation, short-term commitments.'
  },
  {
    id: 'liquid-fund',
    name: 'Liquid & Overnight Parking',
    category: 'Liquid',
    badge: 'Cash Management',
    risk: 'Low',
    horizon: 'Ultra Short (<1Y)',
    minSip: 500,
    minLumpsum: 1000,
    assetMix: 'Treasury Bills, CPs & CDs (<=91 Days)',
    idealFor: 'Parking emergency funds, temporary surplus, or routing systematic transfers (STP) into equity.',
    features: ['Instant redemption up to ₹50,000/day', 'Negligible volatility', 'Zero lock-in after 7 days'],
    suitability: 'Emergency reserves, corporate cash, business contingency funds.'
  }
];

export const WHY_INVEST_POINTS = [
  {
    title: 'Instant Portfolio Diversification',
    desc: 'With a single mutual fund scheme, your money is distributed across 40 to 100+ vetted companies and instruments, significantly reducing the impact of any single company’s underperformance.',
    icon: 'faShapes',
    badge: 'Risk Mitigation'
  },
  {
    title: 'Professional Fund Management',
    desc: 'Full-time experienced fund managers, chartered financial analysts, and quant research teams analyze macroeconomic data, company financials, and balance sheets so you don’t have to.',
    icon: 'faUserTie',
    badge: 'Research Backed'
  },
  {
    title: 'Flexible SIP Starting at ₹500',
    desc: 'You don’t need large capital. Start a Systematic Investment Plan with as little as ₹500 per month. Increase, pause, modify, or stop your SIP anytime with zero penalty.',
    icon: 'faRotateRight',
    badge: 'Pocket Friendly'
  },
  {
    title: 'Rupee Cost Averaging Advantage',
    desc: 'SIP eliminates the guesswork of timing the market. When markets drop, your fixed monthly contribution purchases more mutual fund units; when markets rise, you purchase fewer units.',
    icon: 'faArrowTrendUp',
    badge: 'Disciplined Investing'
  },
  {
    title: 'High Liquidity & Seamless Exit',
    desc: 'Open-ended mutual funds offer complete liquidity. Redeem all or part of your funds with a single click, and proceeds are credited directly to your bank account within T+1 or T+2 working days.',
    icon: 'faHandHoldingDollar',
    badge: 'Anytime Access'
  },
  {
    title: 'Strict SEBI Regulatory Safety',
    desc: 'All mutual funds in India operate under stringent guidelines mandated by the Securities and Exchange Board of India (SEBI) and AMFI, with daily NAV disclosure and custodian-managed assets.',
    icon: 'faShieldHalved',
    badge: 'Sovereign Compliance'
  }
];

export const MF_FAQS = [
  {
    q: 'What is the fundamental difference between SIP and Lumpsum investment?',
    a: 'A Systematic Investment Plan (SIP) involves investing a fixed sum periodically (monthly, quarterly, or weekly) into a mutual fund scheme, benefiting from Rupee Cost Averaging and compounding. A Lumpsum investment means investing a single lump sum amount at once, which is generally suitable when you have surplus funds and a long investment horizon.'
  },
  {
    q: 'What is the difference between Direct and Regular Mutual Fund plans?',
    a: 'In a Direct Plan, you invest directly with the Asset Management Company (AMC) without intermediary commissions, leading to a slightly lower Expense Ratio. In a Regular Plan, you invest through an AMFI-registered distributor (like KNAPS) who provides personalized advisory, portfolio rebalancing, tax guidance, and dedicated relationship management. Both plans hold the exact same portfolio of stocks and bonds.'
  },
  {
    q: 'What is the minimum amount required to start investing in Mutual Funds?',
    a: 'You can begin investing with as little as ₹500 per month through SIP in most equity, hybrid, and index mutual funds. For lumpsum investments, the typical minimum threshold is ₹1,000 to ₹5,000 depending on the scheme.'
  },
  {
    q: 'Can I stop, pause, or change my SIP amount whenever I want?',
    a: 'Yes, absolutely. Mutual fund SIPs are 100% flexible. There is no lock-in or financial penalty for stopping or pausing an SIP. You can also modify your monthly SIP amount or use Step-Up SIP to automatically increase contributions annually as your salary increases.'
  },
  {
    q: 'How does taxation work on Mutual Funds following Budget 2024?',
    a: 'For Equity Mutual Funds (>65% equity):\n• Long-Term Capital Gains (LTCG held >12 months): Taxed at 12.5% on gains exceeding ₹1.25 Lakh per financial year (gains up to ₹1.25L are completely tax-exempt).\n• Short-Term Capital Gains (STCG held <=12 months): Taxed at 20% flat.\n\nFor Debt Mutual Funds:\n• All gains are classified as Short-Term and taxed at your applicable individual income tax slab rate.'
  },
  {
    q: 'How are Mutual Funds regulated in India? Can a fund house run away with my money?',
    a: 'Mutual funds in India are among the most strictly regulated financial instruments globally, governed by SEBI (Mutual Funds) Regulations, 1996. Crucially, your money is NOT held by the Asset Management Company (AMC); it is held in trust by an independent SEBI-registered Custodian (like Deutsche Bank, HDFC Bank, SBI). Even in the extreme event an AMC shuts down, investor assets remain safely protected with the Custodian and are returned to unit holders.'
  },
  {
    q: 'What is an Expense Ratio (TER) and Exit Load?',
    a: 'The Total Expense Ratio (TER) is the annual percentage fee deducted by the AMC to manage the fund, cover research, administration, and compliance costs. It is capped by SEBI regulations and automatically reflected in the daily published NAV. An Exit Load is a nominal percentage fee (typically 0.5% - 1%) charged only if you redeem units before a specified timeframe (e.g., within 365 days in equity funds); after this duration, exit is 100% free.'
  },
  {
    q: 'How does ELSS save taxes under Section 80C?',
    a: 'Equity Linked Savings Schemes (ELSS) qualify for tax deductions of up to ₹1,50,000 under Section 80C of the Income Tax Act (Old Tax Regime), potentially saving up to ₹46,800 in taxes annually. ELSS has the shortest mandatory lock-in period of just 3 years, compared to 5 years for Tax-Saving Fixed Deposits and 15 years for PPF.'
  }
];
