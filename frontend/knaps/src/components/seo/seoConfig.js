/**
 * Centralized SEO Configuration for KNAPS
 * Domain: https://knaps.in/
 * Target Market: India (en-IN)
 */

export const SITE_DOMAIN = "https://knaps.in";

export const COMPANY_INFO = {
  name: "KNAPS Private Limited",
  legalName: "KNAPS PRIVATE LIMITED",
  shortName: "KNAPS",
  tagline: "AMFI Registered Mutual Funds Distributor",
  defaultOgImage: `${SITE_DOMAIN}/og-image.png`,
  defaultOgImageAlt: "KNAPS Private Limited",
  telephone: "+91-9990243143",
  email: "connect@knaps.in",
  address: {
    streetAddress: "DG-206A, DLF Galleria, Plot No 1B, Mayur Vihar Phase - 1",
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    postalCode: "110091",
    addressCountry: "IN"
  },
  geo: {
    latitude: 28.6015,
    longitude: 77.2941
  },
  social: {
    linkedin: "https://www.linkedin.com/company/knaps",
    twitter: "https://x.com/knapsfs"
  },
  amfiArn: "ARN-Registered Mutual Fund Distributor",
  regulatoryDisclaimers: "Mutual fund investments are subject to market risks, read all scheme related documents carefully."
};

/**
 * Builds an absolute canonical URL strictly on https://knaps.in
 * Removes redundant trailing slashes (except root) and query strings.
 */
export function getCanonicalUrl(path = "/") {
  if (!path || path === "/") return `${SITE_DOMAIN}/`;

  // Strip query params and hashes
  let cleanPath = path.split("?")[0].split("#")[0];

  // Ensure leading slash
  if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }

  // Remove trailing slash if longer than 1 char
  if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
    cleanPath = cleanPath.slice(0, -1);
  }

  return `${SITE_DOMAIN}${cleanPath}`;
}

/**
 * Registry of Page-Level SEO Metadata across all public routes
 */
export const PAGE_SEO = {
  // 1. Homepage
  home: {
    title: "Mutual Funds, SIF, NPS & Wide Range of Financial Products",
    description: "Grow your wealth with KNAPS. Explore Mutual Funds, Specialised Investment Funds (SIF), NPS, Fixed Income, and Insurance with expert financial planning.",
    canonicalPath: "/",
    keywords: ["mutual funds India", "SIF investment", "financial planning New Delhi", "SIP investment"],
    primaryKeyword: "mutual funds distributor",
    secondaryKeywords: ["mutual funds", "SIF", "NPS", "financial planning New Delhi", "SIP investment"],
    h1: "Wealth Creation Through Disciplined Financial Planning",
    ogType: "website",
    schemaType: "FinancialService"
  },

  // 2. About Us
  about: {
    title: "About KNAPS Private Limited | Trusted Mutual Funds Distributor in Delhi",
    description: "Discover KNAPS's three-decade legacy in wealth management. Learn about our leadership, investment philosophy, AMFI registration, and client-first financial planning.",
    canonicalPath: "/about",
    keywords: ["about KNAPS", "KNAPS financial services", "wealth advisory team Delhi", "AMFI registered distributor", "financial planning company"],
    primaryKeyword: "about KNAPS",
    secondaryKeywords: ["KNAPS financial services", "wealth advisory team Delhi", "AMFI registered distributor", "financial planning company"],
    h1: "Three Decades of Financial Clarity & Trust",
    ogType: "website",
    schemaType: "AboutPage"
  },

  // 3. Products Hub
  products: {
    title: "Investment & Wealth Products | Mutual Funds, SIF, NPS & Insurance | KNAPS",
    description: "Explore KNAPS's comprehensive portfolio of investment products: Mutual Funds, SIF, NPS, Post Office Schemes, Fixed Income, and Life, Health & General Insurance.",
    canonicalPath: "/products",
    keywords: ["investment products India", "financial products", "wealth investment options", "mutual funds NPS insurance", "SIP fixed deposits"],
    primaryKeyword: "investment products India",
    secondaryKeywords: ["financial products", "wealth investment options", "mutual funds NPS insurance", "SIP fixed deposits"],
    h1: "Comprehensive Wealth Solutions Built for Every Life Goal",
    ogType: "website",
    schemaType: "CollectionPage"
  },

  // 4. Mutual Funds
  mutualFunds: {
    title: "Mutual Funds Investment in India | Systematic Investment (SIP) & Wealth | KNAPS",
    description: "Invest in top-rated mutual funds in India. Build disciplined wealth through SIPs and lumpsum investments across equity, debt, and hybrid funds with KNAPS guidance.",
    canonicalPath: "/mutual-funds",
    keywords: ["mutual funds in India", "mutual fund investment", "best SIP plans", "equity mutual funds", "debt mutual funds", "tax saving ELSS"],
    primaryKeyword: "mutual funds in India",
    secondaryKeywords: ["mutual fund investment", "best SIP plans", "equity mutual funds", "debt mutual funds", "tax saving ELSS"],
    h1: "Invest Smarter with Mutual Funds",
    ogType: "website",
    schemaType: "FinancialProduct"
  },

  // 5. Specialised Investment Funds (SIF)
  sif: {
    title: "Specialised Investment Funds (SIF) in India | Strategies & NAV | KNAPS",
    description: "Discover SEBI-regulated Specialised Investment Funds (SIF) with ₹10 Lakh minimum investment. Compare curated SIF schemes, track NAV performance, and optimize returns.",
    canonicalPath: "/sif",
    keywords: ["specialised investment funds", "SIF in India", "SIF vs mutual funds", "AIF investment India", "high net worth investment strategies"],
    primaryKeyword: "specialised investment funds",
    secondaryKeywords: ["SIF in India", "SIF vs mutual funds", "AIF investment India", "high net worth investment strategies"],
    h1: "Specialised Investment Funds (SIF): High-Conviction Wealth Building",
    ogType: "website",
    schemaType: "FinancialProduct"
  },

  // 6. National Pension System (NPS)
  nps: {
    title: "National Pension System (NPS) India | Tier I & Tier II Retirement Tax Saving | KNAPS",
    description: "Plan a secure retirement with the National Pension System (NPS). Enjoy triple tax benefits under Section 80CCD, active/auto choice asset allocation, and compounding growth.",
    canonicalPath: "/products/nps",
    keywords: ["national pension system", "NPS investment India", "NPS tax benefits 80CCD", "Tier 1 Tier 2 NPS", "retirement pension planning"],
    primaryKeyword: "national pension system",
    secondaryKeywords: ["NPS investment India", "NPS tax benefits 80CCD", "Tier 1 Tier 2 NPS", "retirement pension planning"],
    h1: "National Pension System (NPS): Structured Retirement Independence",
    ogType: "website",
    schemaType: "FinancialProduct"
  },

  // 7. Post Office Small Savings Schemes
  smallSavings: {
    title: "Post Office Small Savings Schemes | POTD, NSC, KVP, SCSS & PPF | KNAPS",
    description: "Sovereign-guaranteed government savings schemes. Compare Post Office Time Deposits (POTD), National Savings Certificates (NSC), KVP, and Senior Citizens Savings Scheme.",
    canonicalPath: "/products/post-office-small-savings-schemes",
    keywords: ["post office small savings schemes", "post office time deposit POTD", "national savings certificate NSC", "KVP interest rates", "SCSS senior citizen savings"],
    primaryKeyword: "post office small savings schemes",
    secondaryKeywords: ["post office time deposit POTD", "national savings certificate NSC", "KVP interest rates", "SCSS senior citizen savings"],
    h1: "Post Office Small Savings Schemes: Sovereign-Backed Security",
    ogType: "website",
    schemaType: "FinancialProduct"
  },

  // 8. Fixed Income Products
  fixedIncome: {
    title: "Fixed Income Products | High-Yield Corporate FDs & GoI Sovereign Bonds | KNAPS",
    description: "Invest in AAA-rated corporate fixed deposits and 100% sovereign Government of India (GoI) bonds. Stable, predictable capital preservation and regular income streams.",
    canonicalPath: "/products/fixed-income-products",
    keywords: ["fixed income products India", "corporate fixed deposits", "GoI sovereign bonds", "high yield FD", "capital protection investment"],
    primaryKeyword: "fixed income products India",
    secondaryKeywords: ["corporate fixed deposits", "GoI sovereign bonds", "high yield FD", "capital protection investment"],
    h1: "Fixed Income Products: High-Yield FDs & Sovereign GoI Bonds",
    ogType: "website",
    schemaType: "FinancialProduct"
  },

  // 9. Life Insurance
  lifeInsurance: {
    title: "Life Insurance Plans | Term Life Cover, Savings & Family Protection | KNAPS",
    description: "Secure your family's future with tailored life insurance and term insurance plans. Compare top IRDAI-approved insurers, high claim settlement ratios, and affordable premiums.",
    canonicalPath: "/products/life-insurance",
    keywords: ["life insurance plans India", "term insurance cover", "best life insurance policy", "family financial security", "IRDAI life insurance"],
    primaryKeyword: "life insurance plans India",
    secondaryKeywords: ["term insurance cover", "best life insurance policy", "family financial security", "IRDAI life insurance"],
    h1: "Life Insurance: Financial Independence for Your Loved Ones",
    ogType: "website",
    schemaType: "FinancialProduct"
  },

  // 10. Health Insurance
  healthInsurance: {
    title: "Health & Medical Insurance Plans | Cashless Hospitalization Cover | KNAPS",
    description: "Comprehensive mediclaim and health insurance policies in India. Protect your family from rising medical inflation with zero-deductible cashless hospital network covers.",
    canonicalPath: "/products/health-insurance",
    keywords: ["health insurance India", "mediclaim policy", "cashless hospitalization cover", "family floater health plan", "critical illness insurance"],
    primaryKeyword: "health insurance India",
    secondaryKeywords: ["mediclaim policy", "cashless hospitalization cover", "family floater health plan", "critical illness insurance"],
    h1: "Health Insurance: Bulletproof Protection Against Medical Inflation",
    ogType: "website",
    schemaType: "FinancialProduct"
  },

  // 11. General Insurance
  generalInsurance: {
    title: "General Insurance Policies | Motor, Commercial, Property & Travel | KNAPS",
    description: "Safeguard your valuable assets with KNAPS general insurance. Comprehensive motor, property, travel, and business risk liability coverage with expedited claims.",
    canonicalPath: "/products/general-insurance",
    keywords: ["general insurance policies", "motor vehicle insurance", "commercial property insurance", "travel insurance policy", "asset risk protection"],
    primaryKeyword: "general insurance policies",
    secondaryKeywords: ["motor vehicle insurance", "commercial property insurance", "travel insurance policy", "asset risk protection"],
    h1: "General Insurance: Comprehensive Asset & Liability Protection",
    ogType: "website",
    schemaType: "FinancialProduct"
  },

  // 12. SIP Calculator
  sipCalculator: {
    title: "SIP Calculator | Calculate Systematic Investment Plan Returns & Maturity | KNAPS",
    description: "Free online SIP calculator. Calculate the future value of your monthly mutual fund investments, estimate compounding returns, and factor in inflation adjustments.",
    canonicalPath: "/calculators/sip",
    keywords: ["SIP calculator", "systematic investment plan calculator", "mutual fund SIP returns", "monthly investment growth", "SIP compounding calculator"],
    primaryKeyword: "SIP calculator",
    secondaryKeywords: ["systematic investment plan calculator", "mutual fund SIP returns", "monthly investment growth", "SIP compounding calculator"],
    h1: "SIP Calculator: Project Your Mutual Fund Wealth Accumulation",
    ogType: "website",
    schemaType: "WebApplication"
  },

  // 13. Step-Up SIP Calculator
  stepUpSipCalculator: {
    title: "Step-Up SIP Calculator | Annual SIP Increment & Corpus Growth | KNAPS",
    description: "Calculate how annual SIP top-ups accelerate your wealth compounding. Estimate the dramatic impact of incrementing your monthly SIP by 5% to 15% each year.",
    canonicalPath: "/calculators/step-up-sip",
    keywords: ["step up SIP calculator", "top up SIP calculator", "annual SIP increment", "accelerated compounding calculator", "step-up investment return"],
    primaryKeyword: "step up SIP calculator",
    secondaryKeywords: ["top up SIP calculator", "annual SIP increment", "accelerated compounding calculator", "step-up investment return"],
    h1: "Step-Up SIP Calculator: Maximize Compounding with Annual Top-Ups",
    ogType: "website",
    schemaType: "WebApplication"
  },

  // 14. SWP Calculator
  swpCalculator: {
    title: "SWP Calculator | Systematic Withdrawal Plan & Monthly Income | KNAPS",
    description: "Plan regular monthly pension or retirement cash flow with our SWP calculator. Evaluate remaining portfolio balance and sustainable withdrawal rates over time.",
    canonicalPath: "/calculators/swp",
    keywords: ["SWP calculator", "systematic withdrawal plan calculator", "mutual fund monthly income", "retirement cashflow calculator", "SWP taxation returns"],
    primaryKeyword: "SWP calculator",
    secondaryKeywords: ["systematic withdrawal plan calculator", "mutual fund monthly income", "retirement cashflow calculator", "SWP taxation returns"],
    h1: "SWP Calculator: Sustainable Monthly Cash Flow Planning",
    ogType: "website",
    schemaType: "WebApplication"
  },

  // 15. Lumpsum Calculator
  lumpsumCalculator: {
    title: "Lumpsum Mutual Fund Calculator | One-Time Investment Return Calculator | KNAPS",
    description: "Calculate future returns on one-time lumpsum mutual fund investments. Forecast wealth accumulation across equity and debt funds with real-time growth charts.",
    canonicalPath: "/calculators/lumpsum",
    keywords: ["lumpsum calculator", "one-time investment calculator", "mutual fund lumpsum returns", "lumpsum vs SIP calculator", "future wealth estimator"],
    primaryKeyword: "lumpsum calculator",
    secondaryKeywords: ["one-time investment calculator", "mutual fund lumpsum returns", "lumpsum vs SIP calculator", "future wealth estimator"],
    h1: "Lumpsum Calculator: Forecast One-Time Investment Compounding",
    ogType: "website",
    schemaType: "WebApplication"
  },

  // 16. Retirement Calculator
  retirementCalculator: {
    title: "Retirement Planning Calculator | Estimate Retirement Corpus & Monthly Pension | KNAPS",
    description: "Plan for financial freedom after retirement. Calculate your required retirement nest egg considering inflation, life expectancy, current expenses, and post-retirement yield.",
    canonicalPath: "/calculators/retirement",
    keywords: ["retirement planning calculator", "retirement corpus calculator", "pension calculator India", "financial freedom calculator", "post retirement monthly expense"],
    primaryKeyword: "retirement planning calculator",
    secondaryKeywords: ["retirement corpus calculator", "pension calculator India", "financial freedom calculator", "post retirement monthly expense"],
    h1: "Retirement Calculator: Ensure Lifelong Financial Independence",
    ogType: "website",
    schemaType: "WebApplication"
  },

  // 17. Future Value Calculator
  futureValueCalculator: {
    title: "Future Value & Goal Calculator | Child Education, Marriage & House | KNAPS",
    description: "Calculate the inflation-adjusted cost of future life milestones—higher education, child marriage, dream home, or vacation—and the monthly savings needed to reach them.",
    canonicalPath: "/calculators/future-value",
    keywords: ["future value calculator", "goal based financial calculator", "child education cost calculator", "inflation adjusted future cost", "goal planning calculator"],
    primaryKeyword: "future value calculator",
    secondaryKeywords: ["goal based financial calculator", "child education cost calculator", "inflation adjusted future cost", "goal planning calculator"],
    h1: "Future Value & Goal Calculator: Plan Milestones with Confidence",
    ogType: "website",
    schemaType: "WebApplication"
  },

  // 18. SIP + Lumpsum Calculator
  sipLumpsumCalculator: {
    title: "SIP + Lumpsum Calculator | Combined Investment Return Estimator | KNAPS",
    description: "Calculate combined returns from an initial lumpsum deposit plus ongoing monthly SIP contributions. Visualize portfolio compounding over 5 to 30 years.",
    canonicalPath: "/calculators/sip-lumpsum",
    keywords: ["SIP plus lumpsum calculator", "combined SIP lumpsum return", "dual investment strategy", "hybrid mutual fund calculator", "total corpus projection"],
    primaryKeyword: "SIP plus lumpsum calculator",
    secondaryKeywords: ["combined SIP lumpsum return", "dual investment strategy", "hybrid mutual fund calculator", "total corpus projection"],
    h1: "SIP + Lumpsum Calculator: Combined Investment Compounding",
    ogType: "website",
    schemaType: "WebApplication"
  },

  // 19. Blogs Listing
  blogs: {
    title: "Financial Insights & Investment Articles | Market Analysis & Guides | KNAPS",
    description: "Read expert financial articles, market analysis, mutual fund guides, SIF investment strategies, and personal finance tips written by certified KNAPS advisors.",
    canonicalPath: "/blogs",
    keywords: ["investment articles India", "mutual fund guides", "personal finance blog", "financial planning tips", "SIF market insights"],
    primaryKeyword: "investment articles India",
    secondaryKeywords: ["mutual fund guides", "personal finance blog", "financial planning tips", "SIF market insights"],
    h1: "Knowledge Center: Actionable Financial Insights & Analysis",
    ogType: "blog",
    schemaType: "Blog"
  },

  // 20. Author Hub
  author: {
    title: "Author Profile & Editorial Team | Financial Experts & Researchers | KNAPS",
    description: "Meet the certified wealth advisors, financial researchers, and market analysts behind KNAPS investment research, financial articles, and portfolio guides.",
    canonicalPath: "/author",
    keywords: ["KNAPS authors and experts", "financial research team", "certified wealth advisor", "market analyst profile", "KNAPS editorial team"],
    primaryKeyword: "KNAPS authors and experts",
    secondaryKeywords: ["financial research team", "certified wealth advisor", "market analyst profile", "KNAPS editorial team"],
    h1: "Expert Editorial & Investment Advisory Team",
    ogType: "profile",
    schemaType: "ProfilePage"
  },

  // 21. Contact Us
  contact: {
    title: "Contact KNAPS | Wealth Advisory & Office Location Mayur Vihar Delhi",
    description: "Get in touch with KNAPS financial advisors. Visit our New Delhi headquarters at DLF Galleria Mayur Vihar, call +91-9990243143, or schedule a 1-on-1 portfolio consultation.",
    canonicalPath: "/contact",
    keywords: ["contact KNAPS", "financial advisor Mayur Vihar", "wealth management Delhi office", "investment consultation contact", "KNAPS phone number"],
    primaryKeyword: "contact KNAPS",
    secondaryKeywords: ["financial advisor Mayur Vihar", "wealth management Delhi office", "investment consultation contact", "KNAPS phone number"],
    h1: "Talk To Our Financial Experts",
    ogType: "website",
    schemaType: "ContactPage"
  },

  // 22. Regulatory Disclosures
  regulatory: {
    title: "Regulatory Disclosures & AMFI Registration | Compliance & Standards | KNAPS",
    description: "View official regulatory disclosures, AMFI registration credentials, ARN details, code of conduct, and statutory investor protection policies for KNAPS Private Limited.",
    canonicalPath: "/regulatory-disclosures",
    keywords: ["regulatory disclosures KNAPS", "AMFI code of conduct", "ARN registration details", "mutual fund statutory disclosure", "SEBI investor protection"],
    primaryKeyword: "regulatory disclosures KNAPS",
    secondaryKeywords: ["AMFI code of conduct", "ARN registration details", "mutual fund statutory disclosure", "SEBI investor protection"],
    h1: "Regulatory Disclosures & Statutory Compliance",
    ogType: "website",
    schemaType: "WebPage"
  },

  // 23. Privacy Policy
  privacy: {
    title: "Privacy Policy | Data Protection & Security Practices | KNAPS",
    description: "Understand how KNAPS Private Limited collects, stores, and protects your personal and financial information in strict compliance with Indian privacy regulations.",
    canonicalPath: "/privacy-policy",
    keywords: ["privacy policy KNAPS", "data protection policy", "investor privacy security", "personal data compliance", "financial data confidentiality"],
    primaryKeyword: "privacy policy KNAPS",
    secondaryKeywords: ["data protection policy", "investor privacy security", "personal data compliance", "financial data confidentiality"],
    h1: "Privacy Policy & Data Security",
    ogType: "website",
    schemaType: "WebPage"
  },

  // 24. Terms & Conditions
  terms: {
    title: "Terms and Conditions | Website Usage & Advisory Terms | KNAPS",
    description: "Read the terms and conditions governing the use of the KNAPS website, financial tools, content, and mutual fund distribution advisory services.",
    canonicalPath: "/terms-and-conditions",
    keywords: ["terms and conditions KNAPS", "website terms of use", "financial advisory terms", "disclaimer and limitation of liability", "distribution terms"],
    primaryKeyword: "terms and conditions KNAPS",
    secondaryKeywords: ["website terms of use", "financial advisory terms", "disclaimer and limitation of liability", "distribution terms"],
    h1: "Terms & Conditions of Service",
    ogType: "website",
    schemaType: "WebPage"
  }
};
