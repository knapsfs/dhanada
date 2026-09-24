import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faCoins,
  faClock,
  faPercent,
  faBuildingColumns,
  faArrowRight,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function WhatIsFixedDeposit() {
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
            What is a{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Fixed Deposit (FD)?
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            A Fixed Deposit is a foundational financial agreement where you deposit a lump-sum amount of money with a scheduled bank, NBFC, or financial institution for a predetermined tenure, earning interest at a fixed, contracted rate.
          </p>
        </div>

        {/* 3 Core Structural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
          <div className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/70 flex items-center justify-center text-[#032e92] mb-6 group-hover:bg-[#032e92] group-hover:text-white transition-all shadow-xs">
              <FontAwesomeIcon icon={faCoins} className="text-lg" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors">
              1. Principal Lump-Sum
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              You deposit a single lump sum starting from as little as ₹1,000 in scheduled banks. This capital remains committed with the financial institution for the chosen duration.
            </p>
          </div>

          <div className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/70 flex items-center justify-center text-indigo-700 mb-6 group-hover:bg-[#032e92] group-hover:text-white transition-all shadow-xs">
              <FontAwesomeIcon icon={faClock} className="text-lg" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors">
              2. Contracted Tenure
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              You choose a specific tenure ranging from 7 days up to 10 years based on your liquidity needs, aligning the maturity date with your financial goals.
            </p>
          </div>

          <div className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-700 mb-6 group-hover:bg-[#032e92] group-hover:text-white transition-all shadow-xs">
              <FontAwesomeIcon icon={faPercent} className="text-lg" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors">
              3. Predetermined Interest
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              The interest rate is locked in upon opening the deposit. Even if central bank repo rates or market rates drop afterwards, your contracted rate remains completely protected.
            </p>
          </div>
        </div>

        {/* How FD Compares to Savings Accounts Box */}
        <div className="bg-gradient-to-br from-[#0a192f] to-[#021d63] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Core Distinction
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                How Does an FD Differ from a Regular Savings Account?
              </h3>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                While a standard savings bank account offers immediate liquidity at modest interest rates (typically 2.7% to 4.0% p.a.), a Fixed Deposit requires committing capital for a specified tenure in exchange for substantially higher interest yields:
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-blue-100">
                <li className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 mt-0.5" />
                  <span><strong>Higher Return Rate:</strong> Fixed Deposits generally offer significantly higher interest rates than liquid savings accounts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 mt-0.5" />
                  <span><strong>Rate Protection:</strong> Unlike savings accounts where banks can adjust interest rates anytime, an FD rate is locked in for the entire contracted term.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4 text-center sm:text-left">
              <h4 className="text-base font-bold text-white">Looking for Objective FD Placement Advice?</h4>
              <p className="text-xs text-blue-200">
                Our financial professionals evaluate yields, institutional credit strength, DICGC insurance coverage, and premature withdrawal terms across scheduled banks and corporate issuers.
              </p>
              <button
                onClick={() => openLeadModal({ title: 'Request Fixed Deposit Consultation', defaultService: 'Fixed Deposits' })}
                className="w-full btn-ripple py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#032e92] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Consult an FD Specialist</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
