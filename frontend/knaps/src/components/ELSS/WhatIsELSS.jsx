import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faChartPie,
  faClock,
  faFileInvoiceDollar,
  faBuildingColumns,
  faArrowRight,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function WhatIsELSS() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faBookOpen} className="text-[#032e92]" />
            <span>Understanding the Basics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            What is an{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              ELSS Mutual Fund?
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            An Equity Linked Savings Scheme (ELSS) is an open-ended equity mutual fund specifically recognized under Section 80C of the Income Tax Act. It is engineered to bridge tax optimization with long-term capital appreciation.
          </p>
        </div>

        {/* 3 Core Structural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
          <div className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/70 flex items-center justify-center text-[#032e92] mb-6 group-hover:bg-[#032e92] group-hover:text-white transition-all shadow-xs">
              <FontAwesomeIcon icon={faChartPie} className="text-lg" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors">
              80%+ Equity Allocation
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              As mandated by SEBI, an ELSS fund must invest a minimum of 80% of its total portfolio in equity and equity-related instruments across high-potential Indian businesses.
            </p>
          </div>

          <div className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/70 flex items-center justify-center text-indigo-700 mb-6 group-hover:bg-[#032e92] group-hover:text-white transition-all shadow-xs">
              <FontAwesomeIcon icon={faClock} className="text-lg" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors">
              3-Year Statutory Lock-In
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Every unit purchased remains locked for exactly 3 years from its allotment date. This is the shortest mandatory lock-in period among all Section 80C investment instruments.
            </p>
          </div>

          <div className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-700 mb-6 group-hover:bg-[#032e92] group-hover:text-white transition-all shadow-xs">
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-lg" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors">
              Section 80C Tax Deduction
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Eligible investors choosing the Old Tax Regime can deduct up to ₹1,50,000 invested per financial year from their taxable income, reducing their annual tax outgo.
            </p>
          </div>
        </div>

        {/* How ELSS Differs from Regular Mutual Funds Box */}
        <div className="bg-gradient-to-br from-[#0a192f] to-[#021d63] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Core Distinction
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                How Does ELSS Differ from a Standard Flexi-Cap Mutual Fund?
              </h3>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                Fundamentally, an ELSS fund operates just like an open-ended diversified equity mutual fund — investing across large, mid, and small-cap stocks. The two defining differences are:
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-blue-100">
                <li className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 mt-0.5" />
                  <span><strong>Tax Deduction:</strong> ELSS investments qualify for deductions under Section 80C, whereas standard flexi-cap funds do not offer tax deduction at investment.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 mt-0.5" />
                  <span><strong>Statutory Lock-in:</strong> ELSS units are locked for 3 years, which protects investors from knee-jerk panic selling during short-term market dips.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4 text-center sm:text-left">
              <h4 className="text-base font-bold text-white">Looking for Tailored ELSS Portfolio Guidance?</h4>
              <p className="text-xs text-blue-200">
                Our AMFI registered mutual fund advisors evaluate fund performance across rolling return cycles, risk-adjusted metrics, and portfolio downside capture.
              </p>
              <button
                onClick={() => openLeadModal({ title: 'Request ELSS Fund Analysis', defaultService: 'ELSS' })}
                className="w-full btn-ripple py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#032e92] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Consult a Financial Professional</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
