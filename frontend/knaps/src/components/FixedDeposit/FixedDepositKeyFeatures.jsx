import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faClock,
  faSliders,
  faCoins,
  faPersonWalkingWithCane,
  faLandmark,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { useLeadModal } from "../../context/LeadModalContext";

const features = [
  {
    icon: faLandmark,
    title: "100% Sovereign & DICGC Security",
    description: "Government of India (GoI) Bonds carry an absolute sovereign guarantee with zero credit risk. Scheduled Bank FDs are protected by DICGC insurance up to ₹5 Lakh per depositor per bank.",
    badge: "Maximum Safety"
  },
  {
    icon: faLock,
    title: "Assured & Floating Yield Models",
    description: "Fixed Deposits lock in contracted interest rates across tenures, while RBI Floating Rate Savings Bonds (FRSB) provide attractive sovereign yields reset at 35 bps above NSC.",
    badge: "Guaranteed Returns"
  },
  {
    icon: faSliders,
    title: "Cashflow Choice & Compounding",
    description: "Tailor income to your lifestyle: receive regular monthly, quarterly, or semi-annual payouts directly in your bank account, or choose cumulative compounding for maximum maturity wealth.",
    badge: "Flexible Payouts"
  },
  {
    icon: faClock,
    title: "Tenures from 7 Days to 10 Years",
    description: "Pick an exact maturity timeframe tailored to your liquidity horizon. Whether parking funds for a few months in bank FDs or committing 5 to 7 years in GoI bonds, tenures adapt to you.",
    badge: "High Flexibility"
  },
  {
    icon: faPersonWalkingWithCane,
    title: "Senior Citizen Rate Advantage",
    description: "Investors aged 60 and above enjoy an extra 0.50% to 0.75% interest spread on bank and corporate FDs, along with premature exit options under RBI Floating Rate Savings Bonds.",
    badge: "+0.50% for Seniors"
  },
  {
    icon: faCoins,
    title: "Specialized Tax Benefits",
    description: "Save up to ₹50 Lakhs in Long Term Capital Gains tax on property sales with Section 54EC Bonds, and enjoy 100% tax-free capital appreciation at maturity with Sovereign Gold Bonds.",
    badge: "54EC & SGB Exemptions"
  }
];

export default function FixedDepositKeyFeatures() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <span>Essential Characteristics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Key Features of{" "}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Fixed Income Products
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Examine the core structural features that make Fixed Deposits and Government of India Bonds the most dependable wealth preservation avenues.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200/60 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <FontAwesomeIcon icon={feature.icon} className="text-lg" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#032e92] border border-blue-100">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors leading-snug">
                  {feature.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-[#032e92] group-hover:translate-x-1 transition-transform">
                <span>Explore options</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px] ml-1.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 text-center">
          <button
            onClick={() => openLeadModal({ title: "Explore Fixed Income Strategies", defaultService: "Fixed Income Products" })}
            className="btn-ripple px-8 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-lg shadow-[#032e92]/25 hover:shadow-xl hover:shadow-[#032e92]/35 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Speak with a Fixed Income Advisor</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
