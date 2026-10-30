import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faShieldHalved,
  faPersonWalkingWithCane,
  faLandmark,
  faBullseye,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";

const profiles = [
  {
    icon: faShieldHalved,
    title: "Capital Preservation Seekers",
    description: "Investors who prioritize 100% principal safety over market volatility, preferring sovereign GoI bonds and DICGC-insured bank FDs with zero day-to-day market fluctuations.",
    tag: "Low Risk Tolerance"
  },
  {
    icon: faPersonWalkingWithCane,
    title: "Retirees & Senior Citizens",
    description: "Individuals aged 60+ seeking predictable monthly, quarterly, or semi-annual cash flow to fund living expenses, benefiting from +0.50% senior FD perks and 8.05% RBI Floating Rate Bonds.",
    tag: "Regular Pension Needs"
  },
  {
    icon: faLandmark,
    title: "Property & Real Estate Sellers",
    description: "Individuals with long-term capital gains from real estate sales seeking to legally save up to 20% LTCG tax by allocating up to ₹50 Lakhs into Section 54EC Bonds (REC/PFC/NHAI).",
    tag: "54EC Tax Exemption"
  },
  {
    icon: faBullseye,
    title: "Defined Milestone Savers",
    description: "Individuals with specific financial commitments due in 6 months to 5 years (e.g., higher education fees, wedding expenses, home down payment) where market drawdowns cannot be risked.",
    tag: "Goal-Dated Planning"
  }
];

export default function WhoShouldConsiderFD() {

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faUsers} className="text-[#032e92]" />
            <span>Suitability & Profiles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Who Should Invest in{" "}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Fixed Income Products?
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            From senior citizens wanting regular pension credits to real estate sellers saving tax, Fixed Deposits and GoI Bonds fulfill critical financial objectives.
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {profiles.map((profile, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-gray-200/80 hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <FontAwesomeIcon icon={profile.icon} className="text-lg" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-[#032e92] border border-blue-100">
                    {profile.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors">
                  {profile.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {profile.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-[#032e92] group-hover:translate-x-1 transition-transform">
                <span>Assess your portfolio fit</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px] ml-1.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Guidance */}
        <div className="mt-12 p-6 rounded-3xl bg-white border border-gray-200 text-center max-w-4xl mx-auto shadow-xs">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            <strong>KNAPS Advisory Guidance:</strong> Fixed Income products provide non-negotiable stability. Our wealth managers assist you in laddering tenures across scheduled banks and sovereign bonds to optimize tax efficiency and liquidity.
          </p>
        </div>
      </div>
    </section>
  );
}
