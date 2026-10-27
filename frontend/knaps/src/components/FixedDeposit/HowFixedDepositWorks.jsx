import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faSliders,
  faLock,
  faHandHoldingDollar,
  faCheckCircle,
  faArrowRight,
  faLandmark
} from "@fortawesome/free-solid-svg-icons";
import { useLeadModal } from "../../context/LeadModalContext";

const steps = [
  {
    stepNumber: "01",
    title: "Select Product & Issuer",
    desc: "Decide between scheduled Bank FDs (DICGC-backed), AAA-rated Corporate FDs (high yield), or Government of India (GoI) Bonds (100% sovereign) according to your risk and timeline.",
    icon: faLandmark,
    highlights: [
      "Bank FD, Corporate FD, or GoI Bonds",
      "Tenures from 7 days up to 10 years",
      "Sovereign guarantee vs DICGC insurance"
    ]
  },
  {
    stepNumber: "02",
    title: "Choose Payout Preference",
    desc: "Opt for cumulative growth (interest compounded and paid at maturity) or non-cumulative periodic payouts (monthly, quarterly, or semi-annual bank credits).",
    icon: faSliders,
    highlights: [
      "Quarterly compounding for FDs",
      "Semi-annual payouts for GoI FRSB bonds",
      "Direct bank account NEFT/RTGS credit"
    ]
  },
  {
    stepNumber: "03",
    title: "Hassle-Free Digital Allocation",
    desc: "Complete your paperless allocation through KNAPS. Submit basic KYC documents, select nominee details, and fund your deposit or bond holding securely.",
    icon: faLock,
    highlights: [
      "100% digital, paperless onboarding",
      "Secure banking gateway integration",
      "Instant bond receipt or FD certificate"
    ]
  },
  {
    stepNumber: "04",
    title: "Earn Income & Maturity Return",
    desc: "Enjoy unhindered regular cashflow or watch your capital compound. At the end of tenure, principal is automatically credited back or rolled over as per your instruction.",
    icon: faHandHoldingDollar,
    highlights: [
      "Timely interest disbursements",
      "Seamless maturity bank credit",
      "Optional auto-renewal / laddering"
    ]
  }
];

export default function HowFixedDepositWorks() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faBuildingColumns} className="text-[#032e92]" />
            <span>Step-by-Step Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            How Fixed Income{" "}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Investing Works
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            From instrument selection to regular coupon payouts and maturity redemption, investing in FDs and GoI Bonds is simple, safe, and transparent.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.stepNumber}
              className="bg-[#f7f9fc] rounded-3xl p-6 sm:p-7 border border-gray-200/80 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-black text-[#032e92]/30 group-hover:text-[#032e92] transition-colors">
                    {st.stepNumber}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white transition-all shadow-xs">
                    <FontAwesomeIcon icon={st.icon} className="text-sm" />
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#0a192f] mb-2 group-hover:text-[#032e92] transition-colors">
                  {st.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {st.desc}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-gray-200/60">
                  {st.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-[10px]" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Action */}
        <div className="mt-12 text-center">
          <button
            onClick={() => openLeadModal({ title: "Start Fixed Income Allocation", defaultService: "Fixed Income Products" })}
            className="btn-ripple inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-[#032e92] text-white hover:bg-[#021d63] shadow-md transition-all cursor-pointer"
          >
            <span>Start Your Fixed Income Investment</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
