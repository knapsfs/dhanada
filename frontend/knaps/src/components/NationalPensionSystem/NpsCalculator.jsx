import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faCoins,
  faCalendarDays,
  faPercent,
  faArrowRight,
  faHandHoldingDollar,
  faChartPie,
  faUserClock,
  faBuildingColumns
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function NpsCalculator() {
  const { openLeadModal } = useLeadModal();

  // Inputs
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(10.0);
  const [annuityPercentage, setAnnuityPercentage] = useState(40); // 40% to 100%
  const [expectedAnnuityRate, setExpectedAnnuityRate] = useState(6.0); // 5% to 8%

  // Investment years & months
  const investmentYears = Math.max(1, retirementAge - currentAge);
  const totalMonths = investmentYears * 12;

  // Compounding calculation (Future Value of Monthly SIP)
  const results = useMemo(() => {
    const P = parseFloat(monthlyContribution) || 0;
    const annualR = parseFloat(expectedReturn) || 0;
    const r = annualR / 100 / 12;
    const n = totalMonths;

    let totalCorpus = 0;
    if (r > 0) {
      totalCorpus = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    } else {
      totalCorpus = P * n;
    }

    const totalInvested = P * n;
    const totalGrowth = Math.max(0, totalCorpus - totalInvested);

    const annuityShare = parseFloat(annuityPercentage) / 100;
    const annuityAmount = totalCorpus * annuityShare;
    const lumpSumAmount = totalCorpus * (1 - annuityShare);

    const monthlyPension = (annuityAmount * (expectedAnnuityRate / 100)) / 12;

    const investedPct = totalCorpus > 0 ? (totalInvested / totalCorpus) * 100 : 0;
    const growthPct = totalCorpus > 0 ? (totalGrowth / totalCorpus) * 100 : 0;

    return {
      totalInvested: Math.round(totalInvested),
      totalGrowth: Math.round(totalGrowth),
      totalCorpus: Math.round(totalCorpus),
      lumpSumAmount: Math.round(lumpSumAmount),
      annuityAmount: Math.round(annuityAmount),
      monthlyPension: Math.round(monthlyPension),
      investedPct: Math.round(investedPct),
      growthPct: Math.round(growthPct)
    };
  }, [monthlyContribution, expectedReturn, totalMonths, annuityPercentage, expectedAnnuityRate]);

  // Formatter for Indian Rupees
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <section id="nps-calculator" className="py-20 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faCalculator} />
            <span>Retirement Forecaster</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Interactive NPS Retirement Calculator
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Project your multi-decade retirement corpus, 60% tax-free lump-sum exit, and lifelong monthly pension based on customizable contribution and return assumptions.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left Column: Sliders & Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Age Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Current Age */}
                <div className="bg-[#f7f9fc] p-5 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faUserClock} className="text-[#032e92]" />
                      <span>Current Age</span>
                    </label>
                    <span className="text-base font-extrabold text-[#032e92] bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {currentAge} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="65"
                    value={currentAge}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCurrentAge(val);
                      if (val >= retirementAge) setRetirementAge(val + 5);
                    }}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>18 Yrs</span>
                    <span>40 Yrs</span>
                    <span>65 Yrs</span>
                  </div>
                </div>

                {/* Retirement Age */}
                <div className="bg-[#f7f9fc] p-5 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faCalendarDays} className="text-[#032e92]" />
                      <span>Retirement Age</span>
                    </label>
                    <span className="text-base font-extrabold text-[#032e92] bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {retirementAge} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min={Math.max(currentAge + 1, 55)}
                    max="75"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>55 Yrs</span>
                    <span>60 Yrs</span>
                    <span>75 Yrs</span>
                  </div>
                </div>
              </div>

              {/* Monthly Contribution */}
              <div className="bg-[#f7f9fc] p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCoins} className="text-[#032e92]" />
                    <span>Monthly NPS Contribution</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1000"
                      max="150000"
                      step="500"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                      className="w-36 pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-right font-bold text-[#032e92] text-sm focus:ring-2 focus:ring-[#032e92] outline-none bg-white"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="150000"
                  step="500"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>₹1,000</span>
                  <span>₹25,000</span>
                  <span>₹75,000</span>
                  <span>₹1,50,000</span>
                </div>
              </div>

              {/* Expected Return Rate */}
              <div className="bg-[#f7f9fc] p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <FontAwesomeIcon icon={faPercent} className="text-[#032e92]" />
                    <span>Expected Annual Return Rate (CAGR)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="6.0"
                      max="15.0"
                      step="0.5"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(Number(e.target.value))}
                      className="w-24 pr-7 pl-3 py-1.5 rounded-xl border border-slate-300 text-right font-bold text-[#032e92] text-sm focus:ring-2 focus:ring-[#032e92] outline-none bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      %
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="15.0"
                  step="0.5"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>6.0% (Conservative)</span>
                  <span>10.0% (Moderate)</span>
                  <span>15.0% (Aggressive)</span>
                </div>
              </div>

              {/* Annuity % & Annuity Rate in 2 Cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Annuity Allocation */}
                <div className="bg-[#f7f9fc] p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Annuity Allocation</span>
                    <span className="text-xs font-bold text-[#032e92] bg-white px-2 py-0.5 rounded border">
                      {annuityPercentage}% (Min 40%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="5"
                    value={annuityPercentage}
                    onChange={(e) => setAnnuityPercentage(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>40% (Min)</span>
                    <span>60%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Annuity Yield */}
                <div className="bg-[#f7f9fc] p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Expected Annuity Rate</span>
                    <span className="text-xs font-bold text-[#032e92] bg-white px-2 py-0.5 rounded border">
                      {expectedAnnuityRate}% p.a.
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="8.0"
                    step="0.25"
                    value={expectedAnnuityRate}
                    onChange={(e) => setExpectedAnnuityRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>5.0%</span>
                    <span>6.0% (Average)</span>
                    <span>8.0%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Calculated Results */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="bg-gradient-to-br from-[#032e92] via-[#021d63] to-[#0a192f] text-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-blue-900/50 space-y-6">
                <div>
                  <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold mb-1">
                    Total Estimated Corpus at Age {retirementAge}
                  </div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    ₹{formatINR(results.totalCorpus)}
                  </div>
                  <div className="text-xs text-blue-200/80 mt-1">
                    Over {investmentYears} years of compounding ({totalMonths} monthly contributions)
                  </div>
                </div>

                {/* Dual Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-blue-200">Invested: {results.investedPct}%</span>
                    <span className="text-emerald-300">Growth: {results.growthPct}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden flex">
                    <div
                      style={{ width: `${results.investedPct}%` }}
                      className="bg-blue-400 h-full transition-all duration-500"
                    />
                    <div
                      style={{ width: `${results.growthPct}%` }}
                      className="bg-emerald-400 h-full transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Corpus Breakdown */}
                <div className="space-y-3 pt-2 border-t border-white/15 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Total Contributions:</span>
                    <span className="font-bold text-white">₹{formatINR(results.totalInvested)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Estimated Investment Growth:</span>
                    <span className="font-bold text-emerald-300">+₹{formatINR(results.totalGrowth)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-white/10">
                    <span className="text-blue-100">
                      Tax-Free Lump Sum ({100 - annuityPercentage}%):
                    </span>
                    <span className="font-bold text-white">₹{formatINR(results.lumpSumAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">
                      Annuity Value ({annuityPercentage}%):
                    </span>
                    <span className="font-bold text-white">₹{formatINR(results.annuityAmount)}</span>
                  </div>
                </div>

                {/* Monthly Pension Highlight Box */}
                <div className="p-4 rounded-2xl bg-blue-950/70 border border-emerald-500/30 text-center">
                  <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block mb-0.5">
                    Estimated Monthly Pension for Life
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                    ₹{formatINR(results.monthlyPension)} / month*
                  </div>
                  <span className="text-[11px] text-blue-200/70 block mt-1">
                    Based on {expectedAnnuityRate}% indicative annuity purchase yield
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={() =>
                    openLeadModal({
                      title: `NPS Retirement Plan (₹${formatINR(monthlyContribution)}/mo for ${investmentYears}y)`,
                      defaultService: 'National Pension System (NPS)'
                    })
                  }
                  className="w-full py-3.5 rounded-xl text-sm font-semibold bg-white text-[#032e92] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Explore NPS Strategy for This Plan</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </button>

                <p className="text-[10px] text-blue-200/70 text-center leading-relaxed">
                  * Disclaimer: Projections are illustrative calculations based on user-provided return and annuity assumptions. Market-linked returns are not guaranteed. Actual retirement corpus and pension depend on PFM performance, prevailing ASP annuity rates, and regulatory guidelines at exit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
