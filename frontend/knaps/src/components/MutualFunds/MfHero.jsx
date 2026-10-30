import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faShieldHalved,
  faArrowRight,
  faCalculator,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function MfHero() {
  const { openLeadModal } = useLeadModal();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/70 via-[#f7f9fc] to-white">
      {/* Decorative Blur Background Orbs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-blue-400/10 via-cyan-400/10 to-indigo-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-8">
          <a href="/" className="hover:text-[#032e92] transition-colors">
            Home
          </a>
          <span>/</span>
          <a href="/products" className="hover:text-[#032e92] transition-colors">
            Services
          </a>
          <span>/</span>
          <span className="text-[#032e92] font-semibold">Mutual Funds</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Positioning & Headlines */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-[#032e92] text-xs sm:text-sm font-semibold shadow-xs">
              <FontAwesomeIcon icon={faShieldHalved} className="text-[#2490ef]" />
              <span>SEBI-Regulated Wealth Creation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#032e92] tracking-tight leading-tight">
              Invest Smarter with Mutual Funds
            </h1>

            {/* Hero Copy */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-700 font-medium leading-relaxed">
              Harness the power of professional fund management, instant asset diversification, and compounding wealth creation. Whether you are building an emergency cushion or planning for generational wealth, mutual funds help you achieve your goals with discipline.
            </p>

            {/* Trust Points Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base flex-shrink-0" />
                <span>SIP starts from just ₹500 / month</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base flex-shrink-0" />
                <span>40+ Leading AMCs & Fund Houses</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base flex-shrink-0" />
                <span>Rupee-cost averaging advantage</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base flex-shrink-0" />
                <span>100% Paperless KYC & Setup</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => openLeadModal('Mutual Funds: Hero Start SIP')}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#032e92] to-[#021d63] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#032e92]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <span>Start Your Investment Journey</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('mf-calculator')}
                className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 text-[#032e92] font-bold text-sm sm:text-base hover:bg-blue-50/60 hover:border-blue-300 transition-all duration-300 flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <FontAwesomeIcon icon={faCalculator} className="text-blue-600" />
                <span>Calculate SIP Returns</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Infographic Feature Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-xl shadow-blue-950/5">
              {/* Floating Top Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-5">
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">KNAPS Smart Wealth</div>
                  <div className="text-lg font-bold text-[#032e92]">Disciplined Compounding</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#032e92]">
                  <FontAwesomeIcon icon={faChartLine} className="text-xl" />
                </div>
              </div>

              {/* Mini Compounding Simulation Graphic */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#f8fbff] to-blue-50/50 border border-blue-100/80">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
                    <span>Monthly SIP of ₹10,000 for 15 Years</span>
                    <span className="text-[#032e92] font-bold">@ 12% p.a.*</span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Invested Amount</div>
                      <div className="text-base font-bold text-slate-800">₹18,00,000</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500 font-medium">Est. Wealth Value</div>
                      <div className="text-xl font-extrabold text-[#032e92]">₹50,45,760</div>
                    </div>
                  </div>
                  {/* Progress Bar Visual */}
                  <div className="mt-3 w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-slate-400 h-full w-[36%]" title="Invested" />
                    <div className="bg-gradient-to-r from-[#2490ef] to-[#032e92] h-full w-[64%]" title="Potential Gains" />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>
                      Invested (36%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#032e92] inline-block"></span>
                      Estimated Gain (64%)
                    </span>
                  </div>
                </div>

                {/* 3 Quick Pill Metrics */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <div className="text-[11px] font-semibold text-slate-500">Min. SIP</div>
                    <div className="text-sm font-extrabold text-[#032e92]">₹500 / mo</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <div className="text-[11px] font-semibold text-slate-500">Liquidity</div>
                    <div className="text-sm font-extrabold text-emerald-700">T+1 to T+2</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <div className="text-[11px] font-semibold text-slate-500">Regulator</div>
                    <div className="text-sm font-extrabold text-[#032e92]">SEBI / AMFI</div>
                  </div>
                </div>

                {/* Statutory Micro Disclaimer */}
                <p className="text-[11px] text-slate-400 leading-tight italic pt-1 text-center">
                  *Returns shown are for educational illustration. Mutual funds are subject to market risks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
