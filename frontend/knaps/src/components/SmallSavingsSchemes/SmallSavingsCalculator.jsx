import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faCoins,
  faArrowRight,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { SMALL_SAVINGS_SCHEMES } from '../../data/smallSavingsData';
import { useLeadModal } from '../../context/LeadModalContext';

export default function SmallSavingsCalculator() {
  const [selectedSchemeId, setSelectedSchemeId] = useState('potd');
  const [depositAmount, setDepositAmount] = useState(500000);
  const [potdTenure, setPotdTenure] = useState(5); // 1, 2, 3, 5 years
  const { openLeadModal } = useLeadModal();

  const currentScheme = useMemo(() => {
    return SMALL_SAVINGS_SCHEMES.find((s) => s.id === selectedSchemeId) || SMALL_SAVINGS_SCHEMES[0];
  }, [selectedSchemeId]);

  // Handle scheme change
  const handleSchemeChange = (id) => {
    setSelectedSchemeId(id);
    if (id === 'pord') {
      setDepositAmount(5000); // 5k monthly
    } else {
      setDepositAmount(500000); // 5L lump sum
    }
  };

  // Scheme-specific dynamic calculation
  const results = useMemo(() => {
    const P = parseFloat(depositAmount) || 0;
    const type = currentScheme.calculatorType;

    let totalInvested = 0;
    let totalInterest = 0;
    let maturityValue = 0;
    let tenureLabel = currentScheme.tenure;

    if (type === 'time_deposit') {
      // POTD: 1, 2, 3, or 5 years
      const rate = currentScheme.ratesByTenure[potdTenure] || 7.5;
      const r = rate / 100;
      totalInvested = P;
      // Quarterly compounded, paid annually or cumulative
      maturityValue = P * Math.pow(1 + r / 4, 4 * potdTenure);
      totalInterest = Math.max(0, maturityValue - totalInvested);
      tenureLabel = `${potdTenure} Year${potdTenure > 1 ? 's' : ''} (${rate}% p.a.)`;
    } else if (type === 'doubling_lump_sum') {
      // KVP: 115 months to double
      totalInvested = P;
      maturityValue = P * 2;
      totalInterest = P;
      tenureLabel = '115 Months (9Y 7M)';
    } else if (type === 'lump_sum_cumulative') {
      // NSC: 5 years, 7.7% annual compounding
      const r = 0.077;
      totalInvested = P;
      maturityValue = P * Math.pow(1 + r, 5);
      totalInterest = Math.max(0, maturityValue - totalInvested);
      tenureLabel = '5 Years (7.7% p.a.)';
    } else if (type === 'monthly_rd') {
      // PORD: 5 years (60 months) quarterly compounded RD
      const r = 0.067;
      const n = 60;
      totalInvested = P * n;
      let mat = 0;
      for (let k = 1; k <= n; k++) {
        const remainingYears = (n - k + 1) / 12;
        mat += P * Math.pow(1 + r / 4, 4 * remainingYears);
      }
      maturityValue = mat;
      totalInterest = Math.max(0, maturityValue - totalInvested);
      tenureLabel = '5 Years (60 Installments)';
    }

    const investedPct = (totalInvested + totalInterest) > 0 ? (totalInvested / (totalInvested + totalInterest)) * 100 : 0;
    const interestPct = (totalInvested + totalInterest) > 0 ? (totalInterest / (totalInvested + totalInterest)) * 100 : 0;

    return {
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(totalInterest),
      maturityValue: Math.round(maturityValue),
      tenureLabel,
      investedPct: Math.round(investedPct),
      interestPct: Math.round(interestPct)
    };
  }, [depositAmount, currentScheme, potdTenure]);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <section id="small-savings-calculator" className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faCalculator} />
            <span>Multi-Scheme Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Post Office Savings Calculator
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Simulate your guaranteed returns, maturity value, and interest growth across our 4 Post Office savings instruments.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-6 sm:p-10">
          {/* Scheme Quick Switcher Chips */}
          <div className="mb-8 pb-6 border-b border-slate-200">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
              Select Post Office Scheme to Simulate:
            </label>
            <div className="flex flex-wrap gap-2.5">
              {SMALL_SAVINGS_SCHEMES.map((scheme) => (
                <button
                  type="button"
                  key={scheme.id}
                  onClick={() => handleSchemeChange(scheme.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedSchemeId === scheme.id
                      ? 'bg-[#032e92] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {scheme.shortName}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left Column: Scheme-Specific Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Selected Scheme Badge & Info */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-[#032e92]">
                    {currentScheme.name}
                  </h4>
                  <span className="text-xs text-slate-500">
                    Notified Rate: <strong className="text-[#032e92]">{currentScheme.interestRate}% p.a.</strong> • {currentScheme.compounding}
                  </span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${currentScheme.badgeColor}`}>
                  {currentScheme.taxSection}
                </span>
              </div>

              {/* POTD Tenure Selector */}
              {currentScheme.id === 'potd' && (
                <div className="bg-[#f7f9fc] p-4 rounded-2xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Choose Time Deposit Tenure:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 5].map((yr) => (
                      <button
                        type="button"
                        key={yr}
                        onClick={() => setPotdTenure(yr)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                          potdTenure === yr
                            ? 'bg-[#032e92] text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div>{yr} Year{yr > 1 ? 's' : ''}</div>
                        <div className={`text-[10px] ${potdTenure === yr ? 'text-blue-200' : 'text-slate-500'}`}>
                          {currentScheme.ratesByTenure[yr]}%
                        </div>
                      </button>
                    ))}
                  </div>
                  {potdTenure === 5 && (
                    <p className="text-[11px] text-emerald-700 font-medium pt-1">
                      ✓ 5-Year Time Deposit qualifies for Section 80C tax deduction up to ₹1.5 Lakh.
                    </p>
                  )}
                </div>
              )}

              {/* Deposit Amount Slider */}
              <div className="bg-[#f7f9fc] p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCoins} className="text-[#032e92]" />
                    <span>
                      {currentScheme.id === 'pord'
                        ? 'Monthly RD Installment Amount'
                        : 'Lump-Sum Investment Deposit'}
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Math.max(0, Number(e.target.value)))}
                      className="w-40 pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-right font-bold text-[#032e92] text-sm focus:ring-2 focus:ring-[#032e92] outline-none bg-white"
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min={currentScheme.id === 'pord' ? 100 : 1000}
                  max={currentScheme.id === 'pord' ? 100000 : 2500000}
                  step={currentScheme.id === 'pord' ? 100 : 5000}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />

                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>₹{currentScheme.id === 'pord' ? '100' : '1,000'}</span>
                  <span>₹{currentScheme.id === 'pord' ? '50,000' : '10 Lakh'}</span>
                  <span>₹{currentScheme.id === 'pord' ? '1 Lakh' : '25 Lakh'}</span>
                </div>
              </div>

              {/* Key Scheme Rules Bullet Strip */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="font-bold text-slate-800 mb-1">Key Operational Highlights:</div>
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Backing:</strong> Direct sovereign guarantee from Government of India.</span>
                </div>
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Liquidity:</strong> {currentScheme.liquidity}</span>
                </div>
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Tax Section:</strong> {currentScheme.taxStatus}</span>
                </div>
              </div>

              {/* Apply CTA Button */}
              <button
                type="button"
                onClick={() =>
                  openLeadModal({
                    title: `Apply for ${currentScheme.name}`,
                    defaultService: currentScheme.name
                  })
                }
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#032e92] to-[#021d63] text-white font-bold text-sm shadow-md hover:shadow-lg hover:shadow-[#032e92]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply for {currentScheme.shortName}</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>

            {/* Right Column: Output Summary Cards */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Principal Invested Card */}
                <div className="p-5 rounded-2xl bg-[#f7f9fc] border border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">
                    {currentScheme.id === 'pord' ? 'Total Deposits Over 5 Years (60 Mo)' : 'Total Principal Invested'}
                  </span>
                  <div className="text-2xl font-extrabold text-slate-800">
                    ₹{formatINR(results.totalInvested)}
                  </div>
                </div>

                {/* Total Interest Earned Card */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-xs text-emerald-800 font-semibold block mb-1">
                    Total Guaranteed Interest Earned
                  </span>
                  <div className="text-2xl font-extrabold text-emerald-700">
                    ₹{formatINR(results.totalInterest)}
                  </div>
                </div>

                {/* Final Maturity Value Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#032e92] to-[#021d63] text-white shadow-lg space-y-2">
                  <span className="text-xs text-blue-200 font-semibold block">
                    Estimated Maturity Corpus
                  </span>
                  <div className="text-3xl font-black text-white">
                    ₹{formatINR(results.maturityValue)}
                  </div>
                  <div className="text-xs text-blue-200 pt-1 border-t border-white/10 flex justify-between">
                    <span>Tenure: {results.tenureLabel}</span>
                    <span className="text-emerald-300 font-semibold">100% Guaranteed</span>
                  </div>
                </div>

                {/* Visual Ratio Bar */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Deposit: {results.investedPct}%</span>
                    <span>Interest: {results.interestPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-[#032e92] h-full"
                      style={{ width: `${results.investedPct}%` }}
                      title="Principal"
                    />
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${results.interestPct}%` }}
                      title="Interest"
                    />
                  </div>
                </div>
              </div>

              {/* Statutory Note */}
              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                Calculations are based on currently notified Ministry of Finance interest rates. Post office rules, compounding conventions, and tax laws apply as notified by the Government of India.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
