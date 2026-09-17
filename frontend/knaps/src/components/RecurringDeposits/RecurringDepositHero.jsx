import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRotate,
  faShieldHalved,
  faCalculator,
  faArrowRight,
  faBuildingColumns,
  faCalendarCheck,
  faPiggyBank,
  faCheckCircle,
  faCoins
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function RecurringDepositHero() {
  const { openLeadModal } = useLeadModal();

  const scrollToCalculator = () => {
    const el = document.getElementById('rd-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/60 via-[#f7f9fc] to-white">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-emerald-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8">
          <a href="/" className="hover:text-[#032e92] transition-colors">
            Home
          </a>
          <span>/</span>
          <a href="/services" className="hover:text-[#032e92] transition-colors">
            Services
          </a>
          <span>/</span>
          <span className="text-[#032e92] font-semibold">Recurring Deposits (RD)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Positioning & Headlines */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-[#032e92] text-xs sm:text-sm font-semibold shadow-sm">
              <FontAwesomeIcon icon={faRotate} className="text-blue-600 animate-spin-slow" />
              <span>Disciplined Monthly Capital Accumulation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#032e92] tracking-tight leading-tight">
              Recurring Deposits (RD)
            </h1>

            {/* Prompt Required Hero Copy */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-700 font-medium leading-relaxed">
              Build your savings gradually with a fixed monthly deposit and earn interest over a predefined tenure. Recurring Deposits provide a structured way to develop a regular savings habit while earning interest at a predetermined rate, subject to the terms and conditions of the respective issuer.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Whether you are accumulating funds for an upcoming festive expense, a child’s annual educational fee, or establishing a dependable emergency reserve, Recurring Deposits eliminate the burden of needing a lump-sum amount upfront.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() =>
                  openLeadModal({
                    title: 'Explore Recurring Deposit Options',
                    defaultService: 'Recurring Deposits'
                  })
                }
                className="btn-ripple px-8 py-4 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore RD Options</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-xs transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={scrollToCalculator}
                className="px-7 py-4 rounded-xl text-[15px] font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faCalculator} className="text-[#032e92]" />
                <span>Calculate RD Returns</span>
              </button>
            </div>

            {/* Trust Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200/80">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 shrink-0" />
                <span>Starts at ₹500/Month</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 shrink-0" />
                <span>Locked Contracted Yield</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 shrink-0" />
                <span>DICGC Bank Cover to ₹5L</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Summary Glassmorphic Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#032e92] via-[#021d63] to-[#0a192f] p-7 sm:p-9 text-white shadow-2xl border border-blue-900/50 overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-blue-200 border border-white/15">
                      <FontAwesomeIcon icon={faPiggyBank} className="text-lg" />
                    </div>
                    <div>
                      <div className="text-xs text-blue-200 font-medium uppercase tracking-wider">
                        Deposit Architecture
                      </div>
                      <div className="text-lg font-bold text-white">Monthly Savings Plan</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                    Structured
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                    <div className="text-xs text-blue-200 mb-1">Monthly Deposit</div>
                    <div className="text-lg sm:text-xl font-extrabold text-white">₹500+</div>
                    <div className="text-[11px] text-blue-300/80 mt-0.5">Flexible monthly tier</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                    <div className="text-xs text-blue-200 mb-1">Tenure Options</div>
                    <div className="text-lg sm:text-xl font-extrabold text-white">6m to 10y</div>
                    <div className="text-[11px] text-blue-300/80 mt-0.5">Milestone aligned</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                    <div className="text-xs text-blue-200 mb-1">Compounding</div>
                    <div className="text-lg sm:text-xl font-extrabold text-white">Quarterly</div>
                    <div className="text-[11px] text-blue-300/80 mt-0.5">Indian bank standard</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                    <div className="text-xs text-blue-200 mb-1">Senior Citizens</div>
                    <div className="text-lg sm:text-xl font-extrabold text-emerald-300">+0.50%</div>
                    <div className="text-[11px] text-blue-300/80 mt-0.5">Preferential rate</div>
                  </div>
                </div>

                {/* Micro Journey Preview */}
                <div className="p-4 rounded-2xl bg-blue-950/50 border border-white/10">
                  <div className="flex items-center justify-between text-xs text-blue-200 mb-2">
                    <span className="font-semibold text-white">Sample 3-Year Accumulation</span>
                    <span className="text-emerald-400 font-bold">₹5,000 / mo @ 7.0%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden flex">
                    <div className="bg-blue-400 h-full w-[88%]" title="Principal Deposited (₹1.80L)" />
                    <div className="bg-emerald-400 h-full w-[12%]" title="Interest Earned (~₹21K)" />
                  </div>
                  <div className="flex justify-between text-[11px] text-blue-300/80 mt-2">
                    <span>Deposit: ₹1,80,000</span>
                    <span className="text-white font-semibold">Maturity: ~₹2,01,150</span>
                  </div>
                </div>

                <p className="text-[11px] text-blue-200/70 text-center leading-relaxed">
                  * Maturity values, interest rates, and compounding rules are indicative and subject to the terms of the respective issuing bank or postal authority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
