import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faCalculator,
  faArrowRight,
  faBuildingColumns,
  faPiggyBank,
  faCheckCircle,
  faChartLine,
  faHandHoldingDollar,
  faPercent
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function NpsHero() {
  const { openLeadModal } = useLeadModal();

  const scrollToCalculator = () => {
    const el = document.getElementById('nps-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/60 via-[#f7f9fc] to-white">
      {/* Background Lighting Orbs */}
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
          <span className="text-[#032e92] font-semibold">National Pension System (NPS)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Positioning & Headlines */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-[#032e92] text-xs sm:text-sm font-semibold shadow-sm">
              <FontAwesomeIcon icon={faShieldHalved} className="text-blue-600" />
              <span>PFRDA Regulated Retirement Framework</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#032e92] tracking-tight leading-tight">
              National Pension System (NPS)
            </h1>

            {/* Prompt Required Hero Copy */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-700 font-medium leading-relaxed">
              Build a retirement corpus through a regulated, market-linked pension system designed for long-term retirement planning. NPS allows eligible subscribers to invest toward retirement through a structured contribution-based approach, with investment choices across different asset classes, subject to applicable rules and regulations.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Administered by the Pension Fund Regulatory and Development Authority (PFRDA), NPS pairs ultra-low institutional fund management costs with flexible equity and debt choices, alongside exclusive tax deduction benefits under Section 80CCD(1B).
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() =>
                  openLeadModal({
                    title: 'Explore National Pension System (NPS)',
                    defaultService: 'National Pension System (NPS)'
                  })
                }
                className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore NPS</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-xs transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={scrollToCalculator}
                className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-white hover:bg-blue-50 text-[#032e92] border border-[#032e92]/20 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FontAwesomeIcon icon={faCalculator} className="text-[#032e92]" />
                <span>Calculate Retirement Corpus</span>
              </button>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200/80">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 shrink-0" />
                <span>Extra ₹50,000 Sec 80CCD(1B)</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 shrink-0" />
                <span>Up to 75% Equity Choice</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 shrink-0" />
                <span>60% Tax-Free Lump Sum</span>
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
                        Pension Blueprint
                      </div>
                      <div className="text-lg font-bold text-white">NPS Tier I Overview</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                    PFRDA Regulated
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                    <div className="text-xs text-blue-200 mb-1">Asset Classes</div>
                    <div className="text-lg sm:text-xl font-extrabold text-white">E, C, G & A</div>
                    <div className="text-[11px] text-blue-300/80 mt-0.5">Equity, Corp & G-Sec</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                    <div className="text-xs text-blue-200 mb-1">Fund Management Cost</div>
                    <div className="text-lg sm:text-xl font-extrabold text-emerald-300">~0.09%</div>
                    <div className="text-[11px] text-blue-300/80 mt-0.5">Lowest in India</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                    <div className="text-xs text-blue-200 mb-1">Tax Deduction</div>
                    <div className="text-lg sm:text-xl font-extrabold text-white">Up to ₹2L+</div>
                    <div className="text-[11px] text-blue-300/80 mt-0.5">Sec 80CCD(1) + 80CCD(1B)</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                    <div className="text-xs text-blue-200 mb-1">Exit at Age 60</div>
                    <div className="text-lg sm:text-xl font-extrabold text-white">60% Lump Sum</div>
                    <div className="text-[11px] text-blue-300/80 mt-0.5">100% Tax-Exempt</div>
                  </div>
                </div>

                {/* Retirement Snowball Preview */}
                <div className="p-4 rounded-2xl bg-blue-950/50 border border-white/10">
                  <div className="flex items-center justify-between text-xs text-blue-200 mb-2">
                    <span className="font-semibold text-white">Sample 25-Year Accumulation</span>
                    <span className="text-emerald-400 font-bold">₹10,000 / mo @ 10.0%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden flex">
                    <div className="bg-blue-400 h-full w-[23%]" title="Principal Deposited (₹30L)" />
                    <div className="bg-emerald-400 h-full w-[77%]" title="Compound Growth (~₹1.03 Cr)" />
                  </div>
                  <div className="flex justify-between text-[11px] text-blue-300/80 mt-2">
                    <span>Invested: ₹30,00,000</span>
                    <span className="text-white font-semibold">Corpus: ~₹1.33 Crore*</span>
                  </div>
                </div>

                <p className="text-[11px] text-blue-200/70 text-center leading-relaxed">
                  * Market-linked returns are illustrative and not guaranteed. Actual corpus depends on underlying market performance across E, C, and G asset classes and prevailing PFRDA rules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
