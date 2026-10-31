import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faArrowTrendDown,
  faBan,
  faRotateRight,
  faBuildingCircleExclamation,
  faFileInvoiceDollar
} from "@fortawesome/free-solid-svg-icons";

const risks = [
  {
    icon: faArrowTrendDown,
    title: "Inflation Risk (Purchasing Power)",
    desc: "While returns are fixed and guaranteed, real purchasing power can lag behind inflation after paying taxes. High-net-worth investors often blend fixed income with equities for inflation hedging."
  },
  {
    icon: faBan,
    title: "Lock-in & Liquidity Nuances",
    desc: "Bank FDs allow early withdrawal with a 0.5%–1% penalty. GoI Floating Rate Savings Bonds have a mandatory 7-year lock-in (early exit allowed only for seniors aged 60+), and 54EC bonds have a strict 5-year lock-in."
  },
  {
    icon: faRotateRight,
    title: "Reinvestment & Rate Cycle Shifts",
    desc: "Fixed FDs lock in current yields. When they mature during low interest rate environments, renewing funds yields lower income. Conversely, floating bonds (RBI FRSB) adjust every 6 months."
  },
  {
    icon: faBuildingCircleExclamation,
    title: "Credit Risk Distinction",
    desc: "GoI Bonds carry ZERO default risk (100% sovereign). Bank FDs are insured up to ₹5 Lakh under DICGC. Corporate NBFC deposits carry credit risk dependent on the issuer rating (AAA/AA recommended)."
  },
  {
    icon: faFileInvoiceDollar,
    title: "Marginal Slab Rate Taxation",
    desc: "Interest income from FDs and RBI FRSB bonds is added to your income and taxed at your marginal income tax slab. However, SGBs are 100% tax-free at maturity and 54EC exempts property capital gains."
  },
  {
    icon: faBan,
    title: "Non-Transferability in Specific Bonds",
    desc: "RBI Floating Rate Savings Bonds and Section 54EC bonds cannot be traded on secondary markets or pledged for loans, requiring you to hold them until the scheduled maturity date."
  }
];

export default function FixedDepositRisks() {
  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600" />
            <span>Transparency & Due Diligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Key Risks & Factors to Evaluate{" "}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              in Fixed Income
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            While Fixed Income provides stability, understanding liquidity, tenure lock-ins, and credit security ensures you pick the right instrument for your needs.
          </p>
        </div>

        {/* Risks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {risks.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 mb-5 shadow-xs">
                  <FontAwesomeIcon icon={item.icon} className="text-lg" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0a192f] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Regulatory Disclaimer Banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-200 text-center max-w-4xl mx-auto shadow-xs">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Regulatory & Investor Protection:</strong> Fixed deposits in scheduled commercial banks are insured under DICGC guidelines up to ₹5 Lakh. Government of India Bonds are sovereign obligations managed by the Reserve Bank of India. Corporate deposits are subject to respective issuer credit ratings.
          </p>
        </div>
      </div>
    </section>
  );
}
