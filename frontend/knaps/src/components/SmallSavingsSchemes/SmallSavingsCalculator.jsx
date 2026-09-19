import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faCoins,
  faCalendarDays,
  faPercent,
  faArrowRight,
  faHandHoldingDollar,
  faVault,
  faReceipt
} from '@fortawesome/free-solid-svg-icons';
import { SMALL_SAVINGS_SCHEMES } from '../../data/smallSavingsData';
import { useLeadModal } from '../../context/LeadModalContext';

export default function SmallSavingsCalculator() {
  const [selectedSchemeId, setSelectedSchemeId] = useState('ppf');
  const [depositAmount, setDepositAmount] = useState(150000); // For PPF annual
  const { openLeadModal } = useLeadModal();

  const currentScheme = useMemo(() => {
    return SMALL_SAVINGS_SCHEMES.find((s) => s.id === selectedSchemeId) || SMALL_SAVINGS_SCHEMES[0];
  }, [selectedSchemeId]);

  // Handle scheme change and set reasonable initial default amounts
  const handleSchemeChange = (id) => {
    setSelectedSchemeId(id);
    const s = SMALL_SAVINGS_SCHEMES.find((item) => item.id === id);
    if (s.id === 'ppf' || s.id === 'ssy') {
      setDepositAmount(150000); // 1.5L annual max
    } else if (s.id === 'pord') {
      setDepositAmount(5000); // 5k monthly
    } else if (s.id === 'pomis') {
      setDepositAmount(900000); // 9L single max
    } else if (s.id === 'scss') {
      setDepositAmount(1500000); // 15L
    } else if (s.id === 'mssc') {
      setDepositAmount(200000); // 2L max
    } else {
      setDepositAmount(500000); // 5L
    }
  };

  // Scheme-specific dynamic calculation
  const results = useMemo(() => {
    const P = parseFloat(depositAmount) || 0;
    const r = currentScheme.interestRate / 100;
    const type = currentScheme.calculatorType;

    let totalInvested = 0;
    let totalInterest = 0;
    let maturityValue = 0;
    let periodicIncome = null;
    let periodicLabel = '';

    if (type === 'annual_sip') {
      if (currentScheme.id === 'ppf') {
        // 15 years annual deposit compounding
        const n = 15;
        maturityValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        totalInvested = P * n;
        totalInterest = Math.max(0, maturityValue - totalInvested);
      } else if (currentScheme.id === 'ssy') {
        // SSY: 15 years deposits, compounds for 21 years
        const n = 15;
        const corpus15 = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        maturityValue = corpus15 * Math.pow(1 + r, 6);
        totalInvested = P * n;
        totalInterest = Math.max(0, maturityValue - totalInvested);
      }
    } else if (type === 'quarterly_payout') {
      // SCSS: 5 years, quarterly non-compounded payout
      totalInvested = P;
      const quarterlyIncome = (P * r) / 4;
      totalInterest = quarterlyIncome * 20; // 5 years * 4 quarters
      maturityValue = totalInvested; // principal returned
      periodicIncome = quarterlyIncome;
      periodicLabel = 'Quarterly Income Payout';
    } else if (type === 'monthly_payout') {
      // POMIS: 5 years, monthly payout
      totalInvested = P;
      const monthlyIncome = (P * r) / 12;
      totalInterest = monthlyIncome * 60; // 5 years * 12 months
      maturityValue = totalInvested;
      periodicIncome = monthlyIncome;
      periodicLabel = 'Monthly Income Payout';
    } else if (type === 'lump_sum_cumulative') {
      // NSC: 5 years annual compounding
      totalInvested = P;
      maturityValue = P * Math.pow(1 + r, 5);
      totalInterest = Math.max(0, maturityValue - totalInvested);
    } else if (type === 'doubling_lump_sum') {
      // KVP: Doubles in 115 months
      totalInvested = P;
      maturityValue = P * 2;
      totalInterest = P;
    } else if (type === 'lump_sum_quarterly') {
      // MSSC: 2 years quarterly compounding
      totalInvested = P;
      maturityValue = P * Math.pow(1 + r / 4, 4 * 2);
      totalInterest = Math.max(0, maturityValue - totalInvested);
    } else if (type === 'time_deposit') {
      // POTD: 5 years quarterly compounding
      totalInvested = P;
      maturityValue = P * Math.pow(1 + r / 4, 4 * 5);
      totalInterest = Math.max(0, maturityValue - totalInvested);
    } else if (type === 'monthly_rd') {
      // PORD: 5 years (60 months) quarterly compounded RD
      const n = 60;
      totalInvested = P * n;
      let mat = 0;
      for (let k = 1; k <= n; k++) {
        const remainingYears = (n - k + 1) / 12;
        mat += P * Math.pow(1 + r / 4, 4 * remainingYears);
      }
      maturityValue = mat;
      totalInterest = Math.max(0, maturityValue - totalInvested);
    }

    const investedPct = (totalInvested + totalInterest) > 0 ? (totalInvested / (totalInvested + totalInterest)) * 100 : 0;
    const interestPct = (totalInvested + totalInterest) > 0 ? (totalInterest / (totalInvested + totalInterest)) * 100 : 0;

    return {
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(totalInterest),
      maturityValue: Math.round(maturityValue),
      periodicIncome: periodicIncome ? Math.round(periodicIncome) : null,
      periodicLabel,
      investedPct: Math.round(investedPct),
      interestPct: Math.round(interestPct)
    };
  }, [depositAmount, currentScheme]);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <section id="small-savings-calculator" className="py-20 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faCalculator} />
            <span>Multi-Scheme Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Interactive Small Savings Calculator
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Select any government scheme below to dynamically calculate maturity corpus, periodic income payouts, or compounding growth.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-6 sm:p-10">
          {/* Scheme Quick Switcher Chips */}
          <div className="mb-8 pb-6 border-b border-slate-200">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
              Select Small Savings Scheme to Simulate:
            </label>
            <div className="flex flex-wrap gap-2">
              {SMALL_SAVINGS_SCHEMES.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => handleSchemeChange(scheme.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedSchemeId === scheme.id
                      ? 'bg-[#032e92] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {scheme.shortName} ({scheme.interestRate}%)
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
                  {currentScheme.taxStatus}
                </span>
              </div>

              {/* Deposit Amount Slider */}
              <div className="bg-[#f7f9fc] p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCoins} className="text-[#032e92]" />
                    <span>
                      {currentScheme.id === 'ppf' || currentScheme.id === 'ssy'
                        ? 'Annual Deposit Amount (Max ₹1.5L)'
                        : currentScheme.id === 'pord'
                        ? 'Monthly Deposit Installment'
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
                  min={currentScheme.minDeposit}
                  max={
                    currentScheme.maxDeposit > 0
                      ? currentScheme.maxDeposit
                      : currentScheme.id === 'pord'
                      ? 50000
                      : 2500000
                  }
                  step={currentScheme.id === 'pord' ? 100 : currentScheme.id === 'ppf' ? 500 : 1000}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />

                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>Min: ₹{currentScheme.minDeposit.toLocaleString('en-IN')}</span>
                  <span>
                    {currentScheme.maxDeposit > 0
                      ? `Max: ₹${currentScheme.maxDeposit.toLocaleString('en-IN')}`
                      : 'Flexible Ceiling'}
                  </span>
                </div>
              </div>

              {/* Tenure and Payout Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#f7f9fc] border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Statutory Tenure</span>
                  <div className="text-base font-extrabold text-slate-900">{currentScheme.tenure}</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#f7f9fc] border border-slate-200 space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Payout Structure</span>
                  <div className="text-base font-extrabold text-slate-900">{currentScheme.payoutType}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Calculated Results */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="bg-gradient-to-br from-[#032e92] via-[#021d63] to-[#0a192f] text-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-blue-900/50 space-y-6">
                <div>
                  <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold mb-1">
                    {results.periodicIncome ? 'Estimated Total Cash Benefit' : 'Total Estimated Maturity Sum'}
                  </div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                    ₹{formatINR(results.maturityValue + (results.periodicIncome ? results.totalInterest : 0))}
                  </div>
                  <div className="text-xs text-blue-200/80 mt-1">
                    Based on {currentScheme.interestRate}% p.a. sovereign notified rate
                  </div>
                </div>

                {/* Periodic Income Callout (SCSS & MIS) */}
                {results.periodicIncome && (
                  <div className="p-4 rounded-2xl bg-blue-950/70 border border-emerald-500/30 text-center">
                    <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block mb-0.5">
                      {results.periodicLabel}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                      ₹{formatINR(results.periodicIncome)}
                    </div>
                    <span className="text-[11px] text-blue-200/70 block mt-1">
                      Direct automated credit to your bank account
                    </span>
                  </div>
                )}

                {/* Visual Proportion Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-blue-200">Deposited: {results.investedPct}%</span>
                    <span className="text-emerald-300">Interest: {results.interestPct}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden flex">
                    <div
                      style={{ width: `${results.investedPct}%` }}
                      className="bg-blue-400 h-full transition-all duration-500"
                    />
                    <div
                      style={{ width: `${results.interestPct}%` }}
                      className="bg-emerald-400 h-full transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Figures Breakdown */}
                <div className="space-y-3 pt-2 border-t border-white/15 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Total Investment Deposited:</span>
                    <span className="font-bold text-white">₹{formatINR(results.totalInvested)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Total Interest Accrued / Paid:</span>
                    <span className="font-bold text-emerald-300">+₹{formatINR(results.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-white/10">
                    <span className="text-blue-100">Principal Return at Maturity:</span>
                    <span className="font-bold text-white">₹{formatINR(results.maturityValue)}</span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() =>
                    openLeadModal({
                      title: `Apply for ${currentScheme.name}`,
                      defaultService: 'Small Savings Schemes'
                    })
                  }
                  className="w-full py-3.5 rounded-xl text-sm font-semibold bg-white text-[#032e92] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Inquire About {currentScheme.shortName} Setup</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </button>

                <p className="text-[10px] text-blue-200/70 text-center leading-relaxed">
                  * Illustrative calculations based on currently notified interest rates. Maturity values, premature conditions, and tax rules are subject to official government notifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
