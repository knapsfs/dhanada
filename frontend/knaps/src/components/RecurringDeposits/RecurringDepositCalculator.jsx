import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faCoins,
  faChartPie,
  faCalendarDays,
  faPercent,
  faArrowRight,
  faRotateRight,
  faPersonWalkingWithCane,
  faCircleCheck,
  faSliders
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function RecurringDepositCalculator() {
  const { openLeadModal } = useLeadModal();

  // Inputs
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
  const [interestRate, setInterestRate] = useState(7.0);
  const [tenureMonths, setTenureMonths] = useState(36); // 36 months = 3 years
  const [compoundingFreq, setCompoundingFreq] = useState('quarterly'); // quarterly, monthly, half-yearly, yearly
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);

  // Quick Presets
  const popularTenures = [
    { label: '6 Months', months: 6 },
    { label: '1 Year', months: 12 },
    { label: '2 Years', months: 24 },
    { label: '3 Years', months: 36 },
    { label: '5 Years', months: 60 },
    { label: '10 Years', months: 120 }
  ];

  // Effective interest rate (with senior citizen edge)
  const effectiveRate = useMemo(() => {
    const base = parseFloat(interestRate) || 0;
    return isSeniorCitizen ? Number((base + 0.50).toFixed(2)) : base;
  }, [interestRate, isSeniorCitizen]);

  // Exact Indian Banking RD Compounding Formula Calculation
  const calculation = useMemo(() => {
    const P = parseFloat(monthlyDeposit) || 0;
    const r = effectiveRate / 100;
    const n = parseInt(tenureMonths, 10) || 1;

    let f = 4; // default quarterly
    if (compoundingFreq === 'monthly') f = 12;
    else if (compoundingFreq === 'half-yearly') f = 2;
    else if (compoundingFreq === 'yearly') f = 1;

    let maturity = 0;
    for (let k = 1; k <= n; k++) {
      const remainingYears = (n - k + 1) / 12;
      const installmentMaturity = P * Math.pow(1 + r / f, f * remainingYears);
      maturity += installmentMaturity;
    }

    const totalDeposited = P * n;
    const totalInterest = Math.max(0, maturity - totalDeposited);

    const principalPct = totalDeposited > 0 ? (totalDeposited / maturity) * 100 : 0;
    const interestPct = totalDeposited > 0 ? (totalInterest / maturity) * 100 : 0;

    return {
      totalDeposited: Math.round(totalDeposited),
      totalInterest: Math.round(totalInterest),
      maturityAmount: Math.round(maturity),
      principalPct: Math.round(principalPct),
      interestPct: Math.round(interestPct)
    };
  }, [monthlyDeposit, effectiveRate, tenureMonths, compoundingFreq]);

  // Formatter for Indian Rupees
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const tenureYearsDisplay = (months) => {
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    if (years === 0) return `${remMonths} Months`;
    if (remMonths === 0) return `${years} Year${years > 1 ? 's' : ''}`;
    return `${years}y ${remMonths}m`;
  };

  return (
    <section id="rd-calculator" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faCalculator} />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Recurring Deposit (RD) Calculator
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Simulate your monthly savings accumulation with standard Indian banking quarterly compounding. Test custom deposit tiers and tenure periods.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="bg-[#f7f9fc] rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left Column: Sliders & Controls */}
            <div className="lg:col-span-7 space-y-8">
              {/* Senior Citizen Toggle */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                    <FontAwesomeIcon icon={faPersonWalkingWithCane} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Senior Citizen Benefit</div>
                    <div className="text-xs text-slate-500">Apply preferential +0.50% p.a. interest rate</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSeniorCitizen}
                    onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#032e92]" />
                </label>
              </div>

              {/* Monthly Deposit Slider */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCoins} className="text-[#032e92]" />
                    <span>Monthly Deposit Amount</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="500"
                      max="100000"
                      step="500"
                      value={monthlyDeposit}
                      onChange={(e) => setMonthlyDeposit(Math.max(0, Number(e.target.value)))}
                      className="w-36 pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-right font-bold text-[#032e92] text-base focus:ring-2 focus:ring-[#032e92] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>₹500</span>
                  <span>₹25,000</span>
                  <span>₹50,000</span>
                  <span>₹1,00,000</span>
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <FontAwesomeIcon icon={faPercent} className="text-[#032e92]" />
                      <span>Interest Rate (p.a.)</span>
                    </label>
                    {isSeniorCitizen && (
                      <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                        Includes +0.50% Senior Citizen boost
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="4.0"
                      max="10.0"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-28 pr-7 pl-3 py-2 rounded-xl border border-slate-300 text-right font-bold text-[#032e92] text-base focus:ring-2 focus:ring-[#032e92] focus:border-transparent outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      %
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="10.0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>4.0%</span>
                  <span>6.5%</span>
                  <span>8.0%</span>
                  <span>10.0%</span>
                </div>
              </div>

              {/* Tenure Selection Slider & Quick Pills */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-[#032e92]" />
                    <span>Tenure Duration</span>
                  </label>
                  <span className="text-base font-extrabold text-[#032e92] bg-blue-50 px-3 py-1 rounded-xl">
                    {tenureYearsDisplay(tenureMonths)} ({tenureMonths} Months)
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="120"
                  step="3"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>6m</span>
                  <span>1 yr</span>
                  <span>3 yrs</span>
                  <span>5 yrs</span>
                  <span>10 yrs</span>
                </div>

                {/* Quick Selection Buttons */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {popularTenures.map((item) => (
                    <button
                      key={item.months}
                      onClick={() => setTenureMonths(item.months)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        tenureMonths === item.months
                          ? 'bg-[#032e92] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Compounding Frequency Picker */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <FontAwesomeIcon icon={faRotateRight} className="text-[#032e92]" />
                    <span>Compounding Frequency</span>
                  </span>
                  <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                    Quarterly is Indian Bank Standard
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'quarterly', label: 'Quarterly' },
                    { id: 'monthly', label: 'Monthly' },
                    { id: 'half-yearly', label: 'Half-Yearly' },
                    { id: 'yearly', label: 'Yearly' }
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      onClick={() => setCompoundingFreq(freq.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        compoundingFreq === freq.id
                          ? 'bg-[#032e92] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Results Card */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="bg-gradient-to-br from-[#032e92] via-[#021d63] to-[#0a192f] text-white rounded-3xl p-7 sm:p-9 shadow-2xl border border-blue-900/50 space-y-6">
                <div>
                  <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold mb-1">
                    Accumulation Summary
                  </div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    ₹{formatINR(calculation.maturityAmount)}
                  </div>
                  <div className="text-xs text-blue-200/80 mt-1">
                    Estimated Maturity Amount at {effectiveRate}% p.a.
                  </div>
                </div>

                {/* Progress Visualizer */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-blue-200">
                      Deposited Principal: {calculation.principalPct}%
                    </span>
                    <span className="text-emerald-300">
                      Interest Earned: {calculation.interestPct}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden flex">
                    <div
                      style={{ width: `${calculation.principalPct}%` }}
                      className="bg-blue-400 h-full transition-all duration-500"
                    />
                    <div
                      style={{ width: `${calculation.interestPct}%` }}
                      className="bg-emerald-400 h-full transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Figures List */}
                <div className="space-y-3.5 pt-2 border-t border-white/15">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">Monthly Contribution:</span>
                    <span className="font-bold text-white">₹{formatINR(monthlyDeposit)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">Total Installments:</span>
                    <span className="font-bold text-white">{tenureMonths} Months</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">Total Amount Deposited:</span>
                    <span className="font-bold text-white">₹{formatINR(calculation.totalDeposited)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">Estimated Interest Earned:</span>
                    <span className="font-bold text-emerald-300">+₹{formatINR(calculation.totalInterest)}</span>
                  </div>
                </div>

                {/* CTA inside Card */}
                <div className="pt-2">
                  <button
                    onClick={() =>
                      openLeadModal({
                        title: `Inquire for RD (₹${formatINR(monthlyDeposit)}/mo for ${tenureMonths}m)`,
                        defaultService: 'Recurring Deposits'
                      })
                    }
                    className="w-full py-4 rounded-xl text-[15px] font-semibold bg-white text-[#032e92] hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer shadow-md"
                  >
                    <span>Explore RD Options for This Plan</span>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-xs transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>

                {/* Disclaimer */}
                <p className="text-[11px] text-blue-200/70 text-center leading-relaxed">
                  * Calculations are illustrative only, based on {compoundingFreq} compounding conventions. Exact maturity amounts, TDS deductions, and premature penalty terms depend on the chosen issuing bank or post office.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
