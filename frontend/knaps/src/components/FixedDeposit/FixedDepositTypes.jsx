import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faLandmark,
  faCoins,
  faShieldHalved,
  faPersonWalkingWithCane,
  faFileInvoiceDollar,
  faBuilding,
  faCheckCircle,
  faArrowRight,
  faScaleBalanced
} from "@fortawesome/free-solid-svg-icons";
import { useLeadModal } from "../../context/LeadModalContext";

const products = [
  // ─── Fixed Deposits ──────────────────────────────────────────────────────────
  {
    id: "regular-bank-fd",
    category: "fd",
    categoryLabel: "Fixed Deposit",
    title: "Regular Bank Fixed Deposit",
    tagline: "Standard term deposit offered by scheduled public and private commercial banks.",
    icon: faBuildingColumns,
    badge: "Most Popular",
    badgeColor: "bg-blue-50 text-[#032e92] border-blue-200",
    idealFor: "Capital safety, liquidity, and goal-dated planning",
    tenures: "7 Days to 10 Years",
    indicativeYield: "6.50% - 7.50% p.a.",
    highlights: [
      "DICGC insured up to ₹5 Lakh per depositor per bank",
      "Flexible tenures aligned with precise financial goals",
      "Option to choose quarterly compounding or periodic monthly/quarterly payouts",
      "Overdraft & loan against FD available up to 90% of deposit value"
    ]
  },
  {
    id: "senior-citizen-fd",
    category: "fd",
    categoryLabel: "Fixed Deposit",
    title: "Senior Citizen Fixed Deposit",
    tagline: "Special preferential term deposit rates designed for investors aged 60 and above.",
    icon: faPersonWalkingWithCane,
    badge: "Senior Special",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    idealFor: "Retirees seeking dependable monthly or quarterly pension-like cashflow",
    tenures: "7 Days to 10 Years",
    indicativeYield: "7.00% - 8.25% p.a.",
    highlights: [
      "Additional interest spread of 0.50% to 0.75% above standard rack rates",
      "Regular monthly or quarterly interest credit directly to bank savings account",
      "Higher TDS exemption limit of ₹50,000 per financial year under Section 80TTB",
      "Exemption from TDS available by submitting Form 15H"
    ]
  },
  {
    id: "corporate-fd",
    category: "fd",
    categoryLabel: "Fixed Deposit",
    title: "Corporate & NBFC Fixed Deposit",
    tagline: "Higher-yielding term deposits offered by top credit-rated manufacturing & financial NBFCs.",
    icon: faBuilding,
    badge: "High Yield",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    idealFor: "Investors seeking superior fixed returns above traditional bank deposits",
    tenures: "1 Year to 5 Years",
    indicativeYield: "7.75% - 8.60%+ p.a.",
    highlights: [
      "Premium interest rates generally 0.50% to 1.50% higher than bank FDs",
      "Vigorously monitored by rating agencies (CRISIL / ICRA AAA & AA ratings)",
      "Curated issuers with robust balance sheets and low default track records",
      "Choice of monthly, quarterly, annual, or cumulative compounding growth"
    ]
  },
  {
    id: "tax-saving-fd",
    category: "fd",
    categoryLabel: "Fixed Deposit",
    title: "Tax-Saving 5-Year Bank FD",
    tagline: "Statutory term deposit eligible for income tax deduction under Section 80C.",
    icon: faFileInvoiceDollar,
    badge: "Tax Benefit",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    idealFor: "Taxpayers looking for guaranteed returns combined with Section 80C deductions",
    tenures: "Mandatory 5-Year Lock-in",
    indicativeYield: "6.80% - 7.50% p.a.",
    highlights: [
      "Tax deduction up to ₹1,50,000 per financial year under Section 80C",
      "5-year lock-in with zero premature withdrawal or loan facility",
      "Compounded quarterly for steady maturity value growth",
      "Ideal tax-saving instrument with zero equity or capital loss exposure"
    ]
  },

  // ─── Government of India (GoI) Bonds ──────────────────────────────────────────
  {
    id: "rbi-frsb",
    category: "bonds",
    categoryLabel: "GoI Bond",
    title: "RBI Floating Rate Savings Bonds (FRSB 2020)",
    tagline: "100% sovereign-guaranteed bonds issued by RBI with floating rates pegged above NSC.",
    icon: faLandmark,
    badge: "100% Sovereign",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    idealFor: "Investors desiring zero-default sovereign security with inflation-beating yields",
    tenures: "7 Years (Senior relief available)",
    indicativeYield: "8.05% p.a. (Current Coupon)",
    highlights: [
      "Zero credit risk: Issued directly on behalf of the Government of India",
      "Floating rate pegged at 35 bps above NSC rate, reset semi-annually",
      "Guaranteed semi-annual interest payouts on January 1st and July 1st",
      "No upper limit on investment amount starting from just ₹1,000"
    ]
  },
  {
    id: "54ec-bonds",
    category: "bonds",
    categoryLabel: "GoI Bond",
    title: "Section 54EC Capital Gain Bonds",
    tagline: "Government-backed bonds specifically structured to exempt long-term capital gains tax on property sales.",
    icon: faShieldHalved,
    badge: "LTCG Exemption",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    idealFor: "Individuals who have sold real estate/land and wish to legally save 20% LTCG tax",
    tenures: "5 Years (Non-transferable)",
    indicativeYield: "5.25% p.a. (Annual Coupon)",
    highlights: [
      "100% exemption from Long Term Capital Gains tax up to ₹50 Lakhs under Section 54EC",
      "Issued by top public-sector undertakings: REC, PFC, IRFC, and NHAI",
      "AAA-rated sovereign-equivalent balance sheets with assured annual interest",
      "Investment must be completed within 6 months of the real estate sale date"
    ]
  },
  {
    id: "sovereign-gold-bonds",
    category: "bonds",
    categoryLabel: "GoI Bond",
    title: "Sovereign Gold Bonds (SGB)",
    tagline: "Government of India securities denominated in grams of 24K gold with periodic cash interest.",
    icon: faCoins,
    badge: "Tax-Free Capital Gain",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    idealFor: "Investors seeking physical gold appreciation plus annual cash income without storage costs",
    tenures: "8 Years (Exit window after Year 5)",
    indicativeYield: "2.50% p.a. + Gold Price Growth",
    highlights: [
      "Issued by RBI on behalf of GoI, linked directly to the price of 999 purity gold",
      "Fixed 2.50% per annum cash interest credited semi-annually to your bank account",
      "100% tax exemption on capital gains when held until the 8-year maturity",
      "Zero making charges, purity risk, or locker fees compared to physical gold"
    ]
  },
  {
    id: "g-secs-tbills",
    category: "bonds",
    categoryLabel: "GoI Bond",
    title: "GoI Dated Securities & Treasury Bills (T-Bills)",
    tagline: "Direct central government sovereign securities and short-term treasury bills issued by RBI.",
    icon: faScaleBalanced,
    badge: "Direct Sovereign",
    badgeColor: "bg-blue-50 text-[#032e92] border-blue-200",
    idealFor: "Institutions and individuals wanting direct exposure to the sovereign yield curve",
    tenures: "91 Days to 40 Years",
    indicativeYield: "Market Yield Curve (~6.8% - 7.3%)",
    highlights: [
      "Direct sovereign debt with zero risk of default on principal and interest",
      "Tradable in secondary markets through RBI Retail Direct and stock exchanges",
      "Treasury bills (91D, 182D, 364D) issued at a discount and redeemed at par",
      "Dated G-Secs pay semi-annual coupons with precise maturities up to 40 years"
    ]
  }
];

export default function FixedDepositTypes() {
  const [selectedCategory, setSelectedCategory] = useState("all"); // "all", "fd", "bonds"
  const { openLeadModal } = useLeadModal();

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <section id="fixed-income-products" className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faLandmark} className="text-[#032e92]" />
            <span>Comprehensive Product Catalogue</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Explore{" "}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Fixed Deposits & GoI Bonds
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Select between high-yield Fixed Deposits and default-free Government of India (GoI) Bonds to match your liquidity needs, tax bracket, and investment horizon.
          </p>

          {/* Interactive Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#032e92] text-white shadow-md shadow-[#032e92]/20"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All Products ({products.length})
            </button>
            <button
              onClick={() => setSelectedCategory("fd")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === "fd"
                  ? "bg-[#032e92] text-white shadow-md shadow-[#032e92]/20"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <FontAwesomeIcon icon={faBuildingColumns} className="text-xs" />
              <span>Fixed Deposits (FD)</span>
            </button>
            <button
              onClick={() => setSelectedCategory("bonds")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === "bonds"
                  ? "bg-[#032e92] text-white shadow-md shadow-[#032e92]/20"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <FontAwesomeIcon icon={faLandmark} className="text-xs" />
              <span>Government of India (GoI) Bonds</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header Badge & Category */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${prod.badgeColor}`}>
                    {prod.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    {prod.categoryLabel}
                  </span>
                </div>

                {/* Icon & Title */}
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#032e92] mb-4 group-hover:bg-[#032e92] group-hover:text-white transition-all shadow-xs">
                  <FontAwesomeIcon icon={prod.icon} className="text-xl" />
                </div>

                <h3 className="text-lg font-bold text-[#0a192f] mb-2 group-hover:text-[#032e92] transition-colors leading-snug">
                  {prod.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {prod.tagline}
                </p>

                {/* Yield & Tenure Badges */}
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 mb-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Indicative Yield:</span>
                    <span className="font-extrabold text-[#032e92]">{prod.indicativeYield}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Tenure:</span>
                    <span className="font-bold text-gray-800">{prod.tenures}</span>
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="space-y-2 mb-6">
                  {prod.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-[11px] mt-0.5 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => openLeadModal({ title: `Invest in ${prod.title}`, defaultService: prod.title })}
                className="w-full btn-ripple py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#f7f9fc] text-[#032e92] hover:bg-[#032e92] hover:text-white border border-blue-200/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
              >
                <span>Invest in {prod.category === "bonds" ? "Bond" : "FD"}</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
