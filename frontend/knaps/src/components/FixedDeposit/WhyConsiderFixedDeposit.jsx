import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faLandmark,
  faShieldHalved,
  faSliders,
  faCoins,
  faHandHoldingDollar,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { useLeadModal } from "../../context/LeadModalContext";

const reasons = [
  {
    icon: faShieldHalved,
    title: "100% Sovereign & DICGC Safety",
    description: "Government of India (GoI) Bonds carry an absolute sovereign guarantee with zero credit or default risk. Scheduled Bank FDs are protected by DICGC insurance up to ₹5 Lakh per depositor per bank.",
    highlight: "Zero Default Risk"
  },
  {
    icon: faChartLine,
    title: "Predictable & Guaranteed Yields",
    description: "Fixed Deposits lock in contracted interest rates throughout their tenure, while RBI Floating Rate Savings Bonds offer 8.05% p.a. guaranteed floating yields pegged at 35 bps above the NSC rate.",
    highlight: "Market-Insulated"
  },
  {
    icon: faHandHoldingDollar,
    title: "Dependable Regular Cashflows",
    description: "Opt for periodic income payouts — monthly or quarterly from bank and corporate FDs, or guaranteed semi-annual interest credits on Jan 1st and Jul 1st from RBI Floating Rate Bonds.",
    highlight: "Regular Cashflow"
  },
  {
    icon: faSliders,
    title: "Flexible Tenure & Goal Alignment",
    description: "Match your investment horizon with precision. Choose ultra-short to medium-term bank FDs (7 days to 10 years) or structured 5-to-7 year sovereign GoI bond tenures.",
    highlight: "Precision Planning"
  },
  {
    icon: faCoins,
    title: "Exclusive Tax-Exemption Avenues",
    description: "Leverage Section 54EC Bonds to save 100% Long Term Capital Gains tax on property sales up to ₹50 Lakhs, and enjoy completely tax-free capital gains on Sovereign Gold Bonds at maturity.",
    highlight: "54EC & SGB Tax Perks"
  },
  {
    icon: faLandmark,
    title: "Essential Portfolio Ballast",
    description: "Shield your wealth from turbulent stock market drawdowns. Fixed income products anchor your asset allocation by preserving principal value when equity markets fluctuate.",
    highlight: "Non-Correlated Wealth"
  }
];

export default function WhyConsiderFixedDeposit() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faShieldHalved} className="text-[#032e92]" />
            <span>Strategic Wealth Preservation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Why Invest in{" "}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Fixed Income Products?
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Whether your priority is zero-risk sovereign backing, high quarterly compounding, or tax-free capital gains, fixed income products provide the bedrock of financial security.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white transition-all shadow-xs">
                    <FontAwesomeIcon icon={item.icon} className="text-lg" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#032e92] bg-blue-50/70 border border-blue-100 px-2.5 py-1 rounded-full">
                    {item.highlight}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center">
          <button
            onClick={() => openLeadModal({ title: "Build a Fixed Income Strategy", defaultService: "Fixed Income Products" })}
            className="btn-ripple inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-[#032e92] text-white hover:bg-[#021d63] shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Plan Your Fixed Income Allocation</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
