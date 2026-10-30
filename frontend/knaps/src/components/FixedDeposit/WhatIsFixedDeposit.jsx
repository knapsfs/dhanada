import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faLandmark,
  faBuildingColumns,
  faArrowRight,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import { useLeadModal } from "../../context/LeadModalContext";

export default function WhatIsFixedDeposit() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faBookOpen} className="text-[#032e92]" />
            <span>Understanding Fixed Income</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            What are{" "}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Fixed Income Products?
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Fixed Income products are structured financial instruments that offer pre-agreed, regular interest payments (coupons) and guarantee the full return of your invested principal upon maturity. They form the non-volatile foundation of a balanced investment portfolio.
          </p>
        </div>

        {/* The Two Bedrock Pillars: FD and GoI Bonds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Pillar 1: Fixed Deposits */}
          <div className="bg-[#f7f9fc] rounded-3xl p-8 border border-gray-200/90 hover:bg-white hover:shadow-2xl hover:border-blue-200 transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200/70 flex items-center justify-center text-[#032e92] mb-6 group-hover:bg-[#032e92] group-hover:text-white transition-all shadow-xs">
              <FontAwesomeIcon icon={faBuildingColumns} className="text-2xl" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/70 text-[#032e92] mb-3">
              Pillar 1: Term Deposits
            </div>
            <h3 className="text-2xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors">
              Fixed Deposits (FD)
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              A contract with scheduled commercial banks or credit-rated corporate NBFCs where your money earns a contracted interest rate over tenures from 7 days to 10 years.
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 mt-1 flex-shrink-0" />
                <span><strong>Bank FDs:</strong> Backed by DICGC insurance up to ₹5 Lakh per depositor per bank with flexible compounding frequencies.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 mt-1 flex-shrink-0" />
                <span><strong>Corporate FDs:</strong> CRISIL/ICRA AAA/AA rated company deposits offering premium yields of 8.00%–8.60%+.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 mt-1 flex-shrink-0" />
                <span><strong>Senior Perks:</strong> Senior citizens enjoy an additional 0.50% to 0.75% interest spread across tenures.</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: GoI Bonds */}
          <div className="bg-[#f7f9fc] rounded-3xl p-8 border border-gray-200/90 hover:bg-white hover:shadow-2xl hover:border-blue-200 transition-all duration-300 relative group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-700 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
              <FontAwesomeIcon icon={faLandmark} className="text-2xl" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 mb-3">
              Pillar 2: Sovereign Debt
            </div>
            <h3 className="text-2xl font-bold text-[#0a192f] mb-3 group-hover:text-emerald-700 transition-colors">
              Government of India (GoI) Bonds
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Sovereign debt securities issued directly by the Reserve Bank of India on behalf of the Government of India. They offer 100% sovereign guarantee with zero credit and default risk.
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 mt-1 flex-shrink-0" />
                <span><strong>RBI Floating Rate Savings Bonds (FRSB):</strong> Currently 8.05% p.a., reset semi-annually linked at 35 bps above NSC with zero default risk.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 mt-1 flex-shrink-0" />
                <span><strong>Section 54EC Capital Gain Bonds:</strong> Save up to ₹50 Lakhs LTCG tax on property sales through REC, PFC, IRFC, and NHAI bonds.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 mt-1 flex-shrink-0" />
                <span><strong>Sovereign Gold Bonds (SGB):</strong> 2.50% annual coupon plus 100% tax-free capital gain on gold appreciation at maturity.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Why Fixed Income is Essential */}
        <div className="bg-gradient-to-br from-[#0a192f] to-[#021d63] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Strategic Portfolio Ballast
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Why Combine FDs and GoI Bonds in Your Wealth Plan?
              </h3>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                Equity markets fluctuate, but fixed income products deliver non-negotiable cash flow and principal safety. While Bank FDs provide liquidity and flexible emergency access, GoI Bonds lock in sovereign security for medium-to-long term wealth preservation:
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-blue-100">
                <li className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 mt-0.5" />
                  <span><strong>Zero Market Drawdowns:</strong> Your invested principal does not drop with equity market corrections.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 mt-0.5" />
                  <span><strong>Guaranteed Income Flow:</strong> Earn regular interest paid monthly, quarterly, or semi-annually directly to your savings bank account.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4 text-center sm:text-left">
              <h4 className="text-base font-bold text-white">Need Guidance on Fixed Income Allocation?</h4>
              <p className="text-xs text-blue-200">
                Our certified advisors evaluate credit ratings, tax slabs, liquidity needs, and yield curves to build your optimal FD and GoI Bond portfolio.
              </p>
              <button
                onClick={() => openLeadModal({ title: "Request Fixed Income Consultation", defaultService: "Fixed Income Products" })}
                className="w-full btn-ripple py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#032e92] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Consult a Fixed Income Specialist</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
