
/**
 * Centralized SEO Configuration for KNAPS
 * Website: https://knaps.in/
 * Target Market: India
 * Language: en-IN
 *
 * SEO focus:
 * Mutual Funds | SIF | NPS | SIP | Investment Products
 * Financial Planning | Investment Calculators
 */

export const SITE_DOMAIN = "https://knaps.in";

export const COMPANY_INFO = {
  name: "KNAPS Private Limited",
  legalName: "KNAPS PRIVATE LIMITED",
  shortName: "KNAPS",

  tagline: "AMFI-Registered Mutual Fund Distributor",

  defaultOgImage: `${SITE_DOMAIN}/og-image.png`,
  defaultOgImageAlt: "KNAPS Private Limited - Financial Products and Investment Solutions",

  telephone: "+91-9990243143",
  email: "connect@knaps.in",

  address: {
    streetAddress: "DG-206A, DLF Galleria, Plot No. 1B",
    addressLocality: "Mayur Vihar Phase 1",
    addressRegion: "Delhi",
    postalCode: "110091",
    addressCountry: "IN"
  },

  social: {
    linkedin: "https://www.linkedin.com/company/knaps",
    twitter: "https://x.com/knapsfs"
  },

  regulatoryDisclaimers:
    "Mutual fund investments are subject to market risks, read all scheme related documents carefully."
};


/**
 * Builds an absolute canonical URL.
 * Removes query parameters, hashes and trailing slashes.
 */
export function getCanonicalUrl(path = "/") {
  if (!path || path === "/") {
    return `${SITE_DOMAIN}/`;
  }

  let cleanPath = path.split("?")[0].split("#")[0];

  if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }

  if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
    cleanPath = cleanPath.slice(0, -1);
  }

  return `${SITE_DOMAIN}${cleanPath}`;
}


/**
 * Page-Level SEO Metadata
 */
export const PAGE_SEO = {

  // 1. Homepage
  home: {
    title: "KNAPS | Mutual Funds, SIF, NPS & Investment Solutions",
    description:
      "Explore mutual funds, Specialised Investment Funds (SIF), NPS and other investment options with KNAPS Private Limited, an AMFI-registered Mutual Fund Distributor in India.",
    canonicalPath: "/",
    keywords: [
      "mutual funds India",
      "mutual fund distributor",
      "SIP investment",
      "SIF India",
      "NPS investment",
      "investment options India",
      "financial planning"
    ],
    primaryKeyword: "mutual fund distributor in India",
    secondaryKeywords: [
      "mutual funds India",
      "SIP investment",
      "Specialised Investment Funds",
      "NPS investment",
      "investment options India"
    ],
    h1: "Wealth Creation Through Disciplined Financial Planning",
    ogType: "website",
    schemaType: "FinancialService"
  },


  // 2. About Us
  about: {
    title: "About KNAPS | AMFI-Registered Mutual Fund Distributor",
    description:
      "Learn about KNAPS Private Limited, our approach to mutual fund distribution, investment solutions, financial products and commitment to investor awareness.",
    canonicalPath: "/about",
    keywords: [
      "about KNAPS",
      "KNAPS Private Limited",
      "AMFI registered mutual fund distributor",
      "mutual fund distributor India",
      "financial services company"
    ],
    primaryKeyword: "about KNAPS",
    secondaryKeywords: [
      "KNAPS Private Limited",
      "AMFI registered mutual fund distributor",
      "mutual fund distribution services",
      "financial services India"
    ],
    h1: "About KNAPS Private Limited",
    ogType: "website",
    schemaType: "AboutPage"
  },


  // 3. Products Hub
  products: {
    title: "Investment Products in India | Mutual Funds, SIF & NPS",
    description:
      "Explore investment products offered through KNAPS, including Mutual Funds, SIF, NPS, Fixed Deposits, Small Savings Schemes, Bonds and Insurance.",
    canonicalPath: "/products",
    keywords: [
      "investment products India",
      "investment options India",
      "financial products",
      "mutual funds",
      "SIF investment",
      "NPS",
      "fixed deposits",
      "small savings schemes",
      "insurance products"
    ],
    primaryKeyword: "investment products in India",
    secondaryKeywords: [
      "investment options India",
      "mutual funds",
      "SIF investment",
      "NPS",
      "fixed deposits",
      "small savings schemes"
    ],
    h1: "Explore Investment Products and Financial Solutions",
    ogType: "website",
    schemaType: "CollectionPage"
  },


  // 4. Mutual Funds
  mutualFunds: {
    title: "Mutual Funds in India | SIP & Lumpsum Investments - KNAPS",
    description:
      "Explore mutual fund investment options in India, including equity, debt, hybrid and other mutual fund schemes. Learn about SIP and lumpsum investments with KNAPS.",
    canonicalPath: "/mutual-funds",
    keywords: [
      "mutual funds India",
      "mutual fund investment",
      "mutual fund schemes",
      "SIP investment",
      "SIP plans",
      "equity mutual funds",
      "debt mutual funds",
      "hybrid mutual funds",
      "lumpsum investment",
      "ELSS mutual funds"
    ],
    primaryKeyword: "mutual fund investment in India",
    secondaryKeywords: [
      "mutual funds India",
      "SIP investment",
      "equity mutual funds",
      "debt mutual funds",
      "hybrid mutual funds",
      "lumpsum investment",
      "ELSS mutual funds"
    ],
    h1: "Explore Mutual Fund Investment Options",
    ogType: "website",
    schemaType: "WebPage"
  },


  // 5. Specialised Investment Funds (SIF)
  sif: {
    title: "Specialised Investment Funds (SIF) in India | KNAPS",
    description:
      "Explore Specialised Investment Funds (SIF) in India. Understand SIF schemes, investment strategies, eligibility, minimum investment requirements and how SIF differs from mutual funds.",
    canonicalPath: "/sif",
    keywords: [
      "Specialised Investment Funds",
      "Specialized Investment Funds",
      "SIF India",
      "SIF investment",
      "SIF schemes",
      "SIF minimum investment",
      "SIF vs mutual funds",
      "SEBI SIF regulations",
      "SIF fund categories",
      "SIF NAV"
    ],
    primaryKeyword: "Specialised Investment Funds in India",
    secondaryKeywords: [
      "SIF India",
      "SIF investment",
      "SIF schemes",
      "SIF minimum investment",
      "SIF vs mutual funds",
      "SEBI SIF regulations"
    ],
    h1: "Explore Specialised Investment Funds (SIF)",
    ogType: "website",
    schemaType: "WebPage"
  },


  // 6. National Pension System (NPS)
  nps: {
    title: "National Pension System (NPS) in India | KNAPS",
    description:
      "Learn about the National Pension System (NPS), including Tier I and Tier II accounts, investment options, contributions, retirement planning and applicable tax benefits.",
    canonicalPath: "/products/nps",
    keywords: [
      "National Pension System",
      "NPS India",
      "NPS investment",
      "NPS account",
      "NPS Tier 1",
      "NPS Tier 2",
      "NPS tax benefits",
      "NPS contribution",
      "NPS retirement planning",
      "pension scheme India"
    ],
    primaryKeyword: "National Pension System in India",
    secondaryKeywords: [
      "NPS investment",
      "NPS Tier 1",
      "NPS Tier 2",
      "NPS tax benefits",
      "NPS contribution",
      "retirement planning"
    ],
    h1: "National Pension System (NPS)",
    ogType: "website",
    schemaType: "WebPage"
  },


  // 7. Post Office Small Savings Schemes
  smallSavings: {
    title: "Post Office Small Savings Schemes in India | PPF, NSC & SCSS",
    description:
      "Explore Post Office Small Savings Schemes in India, including PPF, NSC, KVP, Senior Citizens Savings Scheme and Post Office Time Deposits.",
    canonicalPath: "/products/post-office-small-savings-schemes",
    keywords: [
      "post office savings schemes",
      "small savings schemes India",
      "PPF investment",
      "Public Provident Fund",
      "National Savings Certificate",
      "NSC investment",
      "Kisan Vikas Patra",
      "KVP scheme",
      "Senior Citizens Savings Scheme",
      "SCSS",
      "Post Office Time Deposit"
    ],
    primaryKeyword: "post office small savings schemes",
    secondaryKeywords: [
      "PPF investment",
      "NSC scheme",
      "KVP scheme",
      "SCSS",
      "Post Office Time Deposit",
      "small savings schemes India"
    ],
    h1: "Post Office Small Savings Schemes",
    ogType: "website",
    schemaType: "WebPage"
  },


  // 8. Fixed Income Products
  fixedIncome: {
    title: "Fixed Income Investments | Fixed Deposits & Bonds - KNAPS",
    description:
      "Explore fixed income investment options in India, including corporate fixed deposits, Government of India bonds and other fixed income products.",
    canonicalPath: "/products/fixed-income-products",
    keywords: [
      "fixed income investments",
      "fixed income products India",
      "corporate fixed deposits",
      "corporate FD",
      "fixed deposit investment",
      "Government of India bonds",
      "government bonds India",
      "bond investment",
      "fixed income securities"
    ],
    primaryKeyword: "fixed income investments in India",
    secondaryKeywords: [
      "corporate fixed deposits",
      "fixed income products India",
      "government bonds India",
      "bond investment",
      "fixed deposit investment"
    ],
    h1: "Explore Fixed Income Investment Options",
    ogType: "website",
    schemaType: "WebPage"
  },


  // 9. Life Insurance
  lifeInsurance: {
    title: "Life Insurance Plans in India | Term Insurance - KNAPS",
    description:
      "Explore life insurance and term insurance options in India. Understand life cover, policy features, premiums and financial protection for your family.",
    canonicalPath: "/products/life-insurance",
    keywords: [
      "life insurance India",
      "life insurance plans",
      "term insurance",
      "term life insurance",
      "life cover",
      "family life insurance",
      "life insurance policy",
      "life insurance premiums"
    ],
    primaryKeyword: "life insurance plans in India",
    secondaryKeywords: [
      "term insurance",
      "term life insurance",
      "life insurance policy",
      "life cover",
      "family financial protection"
    ],
    h1: "Explore Life Insurance Options",
    ogType: "website",
    schemaType: "WebPage"
  },


  // 10. Health Insurance
  healthInsurance: {
    title: "Health Insurance Plans in India | Medical Insurance - KNAPS",
    description:
      "Explore health insurance plans in India and understand medical coverage, family floater policies, hospitalisation benefits and health insurance features.",
    canonicalPath: "/products/health-insurance",
    keywords: [
      "health insurance India",
      "health insurance plans",
      "medical insurance",
      "mediclaim policy",
      "family floater health insurance",
      "health insurance policy",
      "individual health insurance",
      "hospitalisation coverage",
      "critical illness insurance"
    ],
    primaryKeyword: "health insurance in India",
    secondaryKeywords: [
      "health insurance plans",
      "medical insurance",
      "mediclaim policy",
      "family floater health insurance",
      "individual health insurance"
    ],
    h1: "Explore Health Insurance Options",
    ogType: "website",
    schemaType: "WebPage"
  },


  // 11. General Insurance
  generalInsurance: {
    title: "General Insurance in India | Motor, Travel & Property - KNAPS",
    description:
      "Explore general insurance options, including motor, travel, property and other insurance products to understand coverage and policy features.",
    canonicalPath: "/products/general-insurance",
    keywords: [
      "general insurance India",
      "general insurance policies",
      "motor insurance",
      "car insurance",
      "two wheeler insurance",
      "travel insurance",
      "property insurance",
      "commercial insurance"
    ],
    primaryKeyword: "general insurance in India",
    secondaryKeywords: [
      "motor insurance",
      "car insurance",
      "two wheeler insurance",
      "travel insurance",
      "property insurance"
    ],
    h1: "Explore General Insurance Options",
    ogType: "website",
    schemaType: "WebPage"
  },


  // 12. SIP Calculator
  sipCalculator: {
    title: "SIP Calculator | Calculate Mutual Fund SIP Returns - KNAPS",
    description:
      "Use our SIP calculator to estimate the future value of monthly mutual fund investments. Calculate your potential SIP returns based on investment amount, duration and expected returns.",
    canonicalPath: "/calculators/sip",
    keywords: [
      "SIP calculator",
      "SIP return calculator",
      "mutual fund SIP calculator",
      "systematic investment plan calculator",
      "monthly SIP calculator",
      "SIP maturity calculator",
      "SIP investment calculator"
    ],
    primaryKeyword: "SIP calculator",
    secondaryKeywords: [
      "SIP return calculator",
      "mutual fund SIP calculator",
      "monthly SIP calculator",
      "SIP maturity calculator"
    ],
    h1: "SIP Calculator",
    ogType: "website",
    schemaType: "WebApplication"
  },


  // 13. Step-Up SIP Calculator
  stepUpSipCalculator: {
    title: "Step Up SIP Calculator | Calculate Step Up SIP Returns - KNAPS",
    description:
      "Calculate the potential growth of your mutual fund investments with a step-up SIP calculator. Estimate returns by increasing your monthly SIP contribution annually.",
    canonicalPath: "/calculators/step-up-sip",
    keywords: [
      "step up SIP calculator",
      "step up SIP",
      "SIP top up calculator",
      "top up SIP calculator",
      "annual SIP increase calculator",
      "step up SIP returns",
      "SIP calculator with yearly increase"
    ],
    primaryKeyword: "step up SIP calculator",
    secondaryKeywords: [
      "SIP top up calculator",
      "top up SIP calculator",
      "step up SIP returns",
      "annual SIP increase calculator"
    ],
    h1: "Step Up SIP Calculator",
    ogType: "website",
    schemaType: "WebApplication"
  },


  // 14. SWP Calculator
  swpCalculator: {
    title: "SWP Calculator | Systematic Withdrawal Plan Calculator - KNAPS",
    description:
      "Use our SWP calculator to estimate regular withdrawals from mutual fund investments. Calculate monthly withdrawals and the potential remaining investment value.",
    canonicalPath: "/calculators/swp",
    keywords: [
      "SWP calculator",
      "systematic withdrawal plan calculator",
      "mutual fund SWP calculator",
      "monthly withdrawal calculator",
      "SWP returns calculator",
      "retirement income calculator",
      "SWP investment"
    ],
    primaryKeyword: "SWP calculator",
    secondaryKeywords: [
      "systematic withdrawal plan calculator",
      "mutual fund SWP calculator",
      "monthly withdrawal calculator",
      "SWP returns calculator"
    ],
    h1: "SWP Calculator",
    ogType: "website",
    schemaType: "WebApplication"
  },


  // 15. Lumpsum Calculator
  lumpsumCalculator: {
    title: "Lumpsum Calculator | Mutual Fund Investment Returns - KNAPS",
    description:
      "Calculate the estimated future value of a one-time mutual fund investment with our lumpsum calculator. Enter your investment amount, duration and expected return.",
    canonicalPath: "/calculators/lumpsum",
    keywords: [
      "lumpsum calculator",
      "mutual fund lumpsum calculator",
      "lumpsum investment calculator",
      "one time investment calculator",
      "lumpsum return calculator",
      "mutual fund returns calculator",
      "lumpsum investment returns"
    ],
    primaryKeyword: "lumpsum calculator",
    secondaryKeywords: [
      "mutual fund lumpsum calculator",
      "one time investment calculator",
      "lumpsum return calculator",
      "mutual fund returns calculator"
    ],
    h1: "Lumpsum Calculator",
    ogType: "website",
    schemaType: "WebApplication"
  },


  // 16. Retirement Calculator
  retirementCalculator: {
    title: "Retirement Calculator | Retirement Corpus Calculator - KNAPS",
    description:
      "Plan your retirement with our retirement calculator. Estimate the corpus you may need based on your current expenses, expected inflation, investment period and retirement goals.",
    canonicalPath: "/calculators/retirement",
    keywords: [
      "retirement calculator",
      "retirement planning calculator",
      "retirement corpus calculator",
      "retirement planning India",
      "pension calculator",
      "retirement savings calculator",
      "retirement investment calculator"
    ],
    primaryKeyword: "retirement planning calculator",
    secondaryKeywords: [
      "retirement corpus calculator",
      "retirement calculator India",
      "pension calculator",
      "retirement savings calculator"
    ],
    h1: "Retirement Planning Calculator",
    ogType: "website",
    schemaType: "WebApplication"
  },


  // 17. Future Value Calculator
  futureValueCalculator: {
    title: "Future Value Calculator | Financial Goal Planning - KNAPS",
    description:
      "Estimate the future cost of your financial goals with our future value calculator. Calculate how inflation may affect expenses such as education, marriage and buying a home.",
    canonicalPath: "/calculators/future-value",
    keywords: [
      "future value calculator",
      "future cost calculator",
      "financial goal calculator",
      "goal planning calculator",
      "inflation calculator",
      "child education cost calculator",
      "marriage cost calculator",
      "financial planning calculator"
    ],
    primaryKeyword: "future value calculator",
    secondaryKeywords: [
      "financial goal calculator",
      "future cost calculator",
      "inflation calculator",
      "goal planning calculator"
    ],
    h1: "Future Value Calculator",
    ogType: "website",
    schemaType: "WebApplication"
  },


  // 18. SIP + Lumpsum Calculator
  sipLumpsumCalculator: {
    title: "SIP + Lumpsum Calculator | Combined Investment Calculator",
    description:
      "Calculate the estimated returns from a combination of monthly SIP contributions and a one-time lumpsum investment using our SIP and lumpsum calculator.",
    canonicalPath: "/calculators/sip-lumpsum",
    keywords: [
      "SIP lumpsum calculator",
      "SIP and lumpsum calculator",
      "combined investment calculator",
      "mutual fund investment calculator",
      "SIP plus lumpsum returns",
      "monthly SIP and lumpsum investment"
    ],
    primaryKeyword: "SIP and lumpsum calculator",
    secondaryKeywords: [
      "SIP lumpsum calculator",
      "combined investment calculator",
      "mutual fund investment calculator",
      "SIP plus lumpsum returns"
    ],
    h1: "SIP + Lumpsum Calculator",
    ogType: "website",
    schemaType: "WebApplication"
  },


  // 19. Blogs Listing
  blogs: {
    title: "Personal Finance & Investment Articles | KNAPS",
    description:
      "Read articles on mutual funds, SIP, SIF, NPS, investment planning, retirement and personal finance. Explore financial topics and investment guides from KNAPS.",
    canonicalPath: "/blogs",
    keywords: [
      "personal finance India",
      "investment articles",
      "mutual fund articles",
      "SIP investment guide",
      "SIF investment",
      "NPS articles",
      "financial planning tips",
      "investment knowledge",
      "finance blog India"
    ],
    primaryKeyword: "investment articles India",
    secondaryKeywords: [
      "personal finance India",
      "mutual fund articles",
      "SIP investment guide",
      "SIF investment",
      "financial planning tips"
    ],
    h1: "Financial Insights and Investment Guides",
    ogType: "website",
    schemaType: "Blog"
  },


  // 20. Author Hub
  author: {
    title: "KNAPS Authors | Financial Articles & Investment Insights",
    description:
      "Meet the contributors behind KNAPS articles covering mutual funds, SIF, NPS, investment products, personal finance and financial planning.",
    canonicalPath: "/author",
    keywords: [
      "KNAPS authors",
      "KNAPS editorial team",
      "financial content authors",
      "investment articles authors",
      "finance contributors"
    ],
    primaryKeyword: "KNAPS authors",
    secondaryKeywords: [
      "KNAPS editorial team",
      "financial content authors",
      "investment articles authors"
    ],
    h1: "KNAPS Authors and Contributors",
    ogType: "website",
    schemaType: "ProfilePage"
  },


  // 21. Contact Us
  contact: {
    title: "Contact KNAPS | Mutual Fund Distributor in Delhi",
    description:
      "Contact KNAPS Private Limited for information about mutual funds, SIF, NPS and other investment products. Visit our office in Mayur Vihar, New Delhi.",
    canonicalPath: "/contact",
    keywords: [
      "contact KNAPS",
      "KNAPS contact number",
      "mutual fund distributor Delhi",
      "AMFI registered mutual fund distributor Delhi",
      "KNAPS office address",
      "KNAPS Private Limited contact"
    ],
    primaryKeyword: "contact KNAPS",
    secondaryKeywords: [
      "mutual fund distributor Delhi",
      "AMFI registered mutual fund distributor Delhi",
      "KNAPS office address"
    ],
    h1: "Contact KNAPS Private Limited",
    ogType: "website",
    schemaType: "ContactPage"
  },


  // 22. Regulatory Disclosures
  regulatory: {
    title: "Regulatory Disclosures & AMFI Registration | KNAPS",
    description:
      "View KNAPS Private Limited's regulatory disclosures, AMFI registration information, mutual fund distribution details and important investor-related disclosures.",
    canonicalPath: "/regulatory-disclosures",
    keywords: [
      "KNAPS regulatory disclosures",
      "AMFI registration",
      "AMFI registered mutual fund distributor",
      "ARN details",
      "mutual fund distributor disclosure",
      "investor disclosures",
      "mutual fund risk disclaimer"
    ],
    primaryKeyword: "KNAPS regulatory disclosures",
    secondaryKeywords: [
      "AMFI registration",
      "mutual fund distributor disclosure",
      "ARN details",
      "investor disclosures"
    ],
    h1: "Regulatory Disclosures",
    ogType: "website",
    schemaType: "WebPage"
  },


  // 23. Privacy Policy
  privacy: {
    title: "Privacy Policy | KNAPS Private Limited",
    description:
      "Read the KNAPS Privacy Policy to understand how personal information is collected, used, stored and protected when you use our website and services.",
    canonicalPath: "/privacy-policy",
    keywords: [
      "KNAPS privacy policy",
      "KNAPS data privacy",
      "personal information policy",
      "data protection policy",
      "website privacy policy"
    ],
    primaryKeyword: "KNAPS privacy policy",
    secondaryKeywords: [
      "data protection policy",
      "personal information policy",
      "website privacy policy"
    ],
    h1: "Privacy Policy",
    ogType: "website",
    schemaType: "WebPage"
  },


  // 24. Terms & Conditions
  terms: {
    title: "Terms & Conditions | KNAPS Private Limited",
    description:
      "Read the terms and conditions for using the KNAPS website, including website content, investment information, financial calculators and applicable disclaimers.",
    canonicalPath: "/terms-and-conditions",
    keywords: [
      "KNAPS terms and conditions",
      "website terms of use",
      "KNAPS website disclaimer",
      "financial information disclaimer",
      "website usage policy"
    ],
    primaryKeyword: "KNAPS terms and conditions",
    secondaryKeywords: [
      "website terms of use",
      "KNAPS website disclaimer",
      "financial information disclaimer"
    ],
    h1: "Terms and Conditions",
    ogType: "website",
    schemaType: "WebPage"
  }

};
