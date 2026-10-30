import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faArrowRight,
  faShieldHalved,
  faLandmark,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function SmallSavingsHero() {
  const { openLeadModal } = useLeadModal();

  const scrollToCalculator = () => {
    const el = document.getElementById('small-savings-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/60 via-[#f7f9fc] to-white">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-blue-400/10 via-teal-400/10 to-indigo-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8">
          <a href="/" className="hover:text-[#032e92] transition-colors">
            Home
          </a>
          <span>/</span>
          <a href="/products" className="hover:text-[#032e92] transition-colors">
            Products
          </a>
          <span>/</span>
          <span className="text-[#032e92] font-semibold">Post Office Small Savings Schemes</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Positioning & Headlines */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-[#032e92] text-xs sm:text-sm font-semibold shadow-xs">
              <FontAwesomeIcon icon={faLandmark} className="text-blue-600" />
              <span>Government-Backed Sovereign Savings • India Post</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#032e92] tracking-tight leading-tight">
              Post Office Small Savings Schemes
            </h1>

            {/* Hero Copy */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-700 font-medium leading-relaxed">
              Explore sovereign-backed Post Office savings schemes designed to encourage disciplined saving, capital safety, and assured long-term wealth growth.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Administered through India Post and backed directly by the Government of India, our core offerings include <strong>Post Office Time Deposit (POTD)</strong>, <strong>Kisan Vikas Patra (KVP)</strong>, <strong>National Savings Certificate (NSC)</strong>, and <strong>Post Office Recurring Deposit (PORD)</strong>—combining absolute sovereign security with high notified yields and tax-deductible compounding.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() =>
                  openLeadModal({
                    title: 'Explore Post Office Small Savings Schemes',
                    defaultService: 'Post Office Small Savings Schemes'
                  })
                }
                className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore Post Office Schemes</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-xs transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                type="button"
                onClick={scrollToCalculator}
                className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-white hover:bg-blue-50 text-[#032e92] border border-[#032e92]/20 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FontAwesomeIcon icon={faCalculator} className="text-[#032e92]" />
                <span>Calculate Scheme Returns</span>
              </button>
            </div>

            {/* Trust Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200/80">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 shrink-0" />
                <span>100% Sovereign Safety</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 shrink-0" />
                <span>Quarterly Notified Rates</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 shrink-0" />
                <span>Section 80C Tax Savings</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Summary Glassmorphic Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#032e92] via-[#021d63] to-[#0a192f] p-7 sm:p-9 text-white shadow-2xl border border-blue-900/50 overflow-hidden">
              {/* Glow accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-teal-300 border border-white/15">
                      <FontAwesomeIcon icon={faShieldHalved} className="text-lg" />
                    </div>
                    <div>
                      <div className="text-xs text-blue-200 font-medium uppercase tracking-wider">
                        India Post Sovereign Framework
                      </div>
                      <div className="text-lg font-bold text-white">4 Flagship Schemes</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                    Govt. Backed
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                    <div className="text-xs text-blue-200 mb-1">Peak Yield (NSC)</div>
                    <div className="text-lg sm:text-xl font-extrabold text-emerald-300">7.7% p.a.</div>
                    <div className="text-[11px] text-blue-300/80 mt-0.5">5-Year compounding</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                    <div className="text-xs text-blue-200 mb-1">Tax Saving (80C)</div>
                    <div className="text-lg sm:text-xl font-extrabold text-white">NSC & 5Y POTD</div>
                    <div className="text-[11px] text-blue-300/80 mt-0.5">Up to ₹1.5L deduction</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                    <div className="text-xs text-blue-200 mb-1">Capital Doubling</div>
                    <div className="text-lg sm:text-xl font-extrabold text-white">115 Months</div>
                    <div className="text-[11px] text-blue-300/80 mt-0.5">KVP (7.5% p.a.)</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                    <div className="text-xs text-blue-200 mb-1">Monthly Habit</div>
                    <div className="text-lg sm:text-xl font-extrabold text-teal-300">₹100 / mo</div>
                    <div className="text-[11px] text-blue-300/80 mt-0.5">PORD 5-Year RD</div>
                  </div>
                </div>

                {/* Micro Preview Box: 5-Year NSC Compounding */}
                <div className="p-4 rounded-2xl bg-blue-950/50 border border-white/10">
                  <div className="flex items-center justify-between text-xs text-blue-200 mb-2">
                    <span className="font-semibold text-white">Illustrative NSC 5-Year Growth</span>
                    <span className="text-emerald-400 font-bold">₹5 Lakh @ 7.7% p.a.</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden flex">
                    <div className="bg-blue-400 h-full w-[69%]" title="Principal Deposited (₹5,00,000)" />
                    <div className="bg-emerald-400 h-full w-[31%]" title="Compounded Interest (₹2,24,517)" />
                  </div>
                  <div className="flex justify-between text-[11px] text-blue-300/80 mt-2">
                    <span>Invested: ₹5,00,000</span>
                    <span className="text-white font-semibold">Maturity Value: ₹7,24,517*</span>
                  </div>
                </div>

                <p className="text-[11px] text-blue-200/70 text-center leading-relaxed">
                  * Interest rates, tenures, and tax treatments are notified quarterly by the Ministry of Finance, Government of India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
