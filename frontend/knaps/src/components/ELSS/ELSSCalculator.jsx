import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faCoins,
  faFileInvoiceDollar,
  faChartLine,
  faArrowRight,
  faCircleInfo,
  faShieldHalved,
  faPercent
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const formatCroreLakh = (val) => {
  if (val >= 10000000) {
    return `₹ ${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹ ${(val / 100000).toFixed(2)} Lakh`;
  }
  return `₹ ${Math.round(val).toLocaleString('en-IN')}`;
};

export default function ELSSCalculator() {
  const { openLeadModal } = useLeadModal();

  // Calculator Mode: 'sip' or 'lumpsum'
  const [mode, setMode] = useState('sip');

  // Input states
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [lumpSumAmount, setLumpSumAmount] = useState(150000);
  const [returnRate, setReturnRate] = useState(12);
  const [tenureYears, setTenureYears] = useState(5);
  const [taxSlab, setTaxSlab] = useState(30); // 5, 20, 30

  // Calculation logic
  const calculation = useMemo(() => {
    let totalInvested = 0;
    let maturityValue = 0;
    let annualInvestment = 0;

    if (mode === 'sip') {
      const monthlyRate = returnRate / 100 / 12;
      const totalMonths = tenureYears * 12;
      totalInvested = monthlyAmount * totalMonths;
      annualInvestment = monthlyAmount * 12;

      // SIP Future Value formula
      maturityValue =
        monthlyAmount *
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
        (1 + monthlyRate);
    } else {
      totalInvested = lumpSumAmount;
      annualInvestment = lumpSumAmount;

      // Compound Interest formula
      maturityValue = lumpSumAmount * Math.pow(1 + returnRate / 100, tenureYears);
    }

    const totalGain = Math.max(0, maturityValue - totalInvested);

    // Section 80C Tax Deduction Calculation (Capped at ₹1.5L per financial year)
    const eligible80cAmount = Math.min(150000, annualInvestment);
    // Tax saved with 4% Health & Education Cess
    const annualTaxSaved = Math.round(eligible80cAmount * (taxSlab / 100) * 1.04);
    const cumulativeTaxSaved = mode === 'sip' ? annualTaxSaved * tenureYears : annualTaxSaved;

    // Percentages for visual bar
    const investedPercent = Math.min(100, Math.max(5, (totalInvested / maturityValue) * 100));
    const gainPercent = 100 - investedPercent;

    return {
      totalInvested,
      maturityValue,
      totalGain,
      eligible80cAmount,
      annualTaxSaved,
      cumulativeTaxSaved,
      investedPercent,
      gainPercent
    };
  }, [mode, monthlyAmount, lumpSumAmount, returnRate, tenureYears, taxSlab]);

  return (
    <section id="elss-calculator" className="py-20 lg:py-28 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faCalculator} className="text-[#032e92]" />
            <span>Interactive Investment & Tax Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            ELSS Wealth &{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Tax-Saving Calculator
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Estimate your wealth compounding over time alongside potential Section 80C tax deductions under the Old Tax Regime.
          </p>
        </div>

        {/* Calculator Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200/90 shadow-lg space-y-6">
            {/* Mode Switcher (SIP vs Lump Sum) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                Select Investment Mode
              </label>
              <div className="grid grid-cols-2 p-1.5 bg-gray-100/90 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setMode('sip')}
                  className={`py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    mode === 'sip'
                      ? 'bg-[#032e92] text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly SIP
                </button>
                <button
                  type="button"
                  onClick={() => setMode('lumpsum')}
                  className={`py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    mode === 'lumpsum'
                      ? 'bg-[#032e92] text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  One-Time Lump Sum
                </button>
              </div>
            </div>

            {/* Slider 1: Investment Amount */}
            {mode === 'sip' ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Monthly SIP Amount
                  </label>
                  <span className="text-base font-bold text-[#032e92] bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-100">
                    ₹ {monthlyAmount.toLocaleString('en-IN')} / month
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={50000}
                  step={500}
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>₹ 500</span>
                  <span>₹ 12,500 (₹1.5L/yr max 80C)</span>
                  <span>₹ 50,000</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    One-Time Lump Sum Investment
                  </label>
                  <span className="text-base font-bold text-[#032e92] bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-100">
                    ₹ {lumpSumAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={500000}
                  step={5000}
                  value={lumpSumAmount}
                  onChange={(e) => setLumpSumAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>₹ 5,000</span>
                  <span>₹ 1,50,000 (80C Limit)</span>
                  <span>₹ 5,00,000</span>
                </div>
              </div>
            )}

            {/* Slider 2: Expected Rate of Return */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Expected Return Rate (p.a.)
                </label>
                <span className="text-base font-bold text-[#032e92] bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-100">
                  {returnRate}% p.a.
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={16}
                step={0.5}
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>8% (Conservative)</span>
                <span>12% (Historical Long-term)</span>
                <span>16% (Aggressive)</span>
              </div>
            </div>

            {/* Slider 3: Investment Tenure */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Investment Horizon (Years)
                </label>
                <span className="text-base font-bold text-[#032e92] bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-100">
                  {tenureYears} Years {tenureYears === 3 && '(Statutory Lock-in)'}
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={15}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>3 Years (Minimum)</span>
                <span>7 Years</span>
                <span>15 Years</span>
              </div>
            </div>

            {/* Slider 4: Applicable Tax Slab */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Your Income Tax Slab (Old Tax Regime)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { slab: 5, label: '5% Slab' },
                  { slab: 20, label: '20% Slab' },
                  { slab: 30, label: '30% Slab' }
                ].map((item) => (
                  <button
                    key={item.slab}
                    type="button"
                    onClick={() => setTaxSlab(item.slab)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      taxSlab === item.slab
                        ? 'bg-[#032e92] text-white border-[#032e92] shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5">
                Used to estimate your annual tax deduction benefit under Section 80C (+ 4% cess).
              </p>
            </div>
          </div>

          {/* Right Column: Output Summary & Visual Breakdown (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0a192f] via-[#021d63] to-[#032e92] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-4 border border-white/15">
                <FontAwesomeIcon icon={faChartLine} className="text-emerald-300 text-xs" />
                <span>Illustrative Growth Projection</span>
              </div>

              {/* Headline Maturity Value */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Estimated Total Value at {tenureYears} Years
                </span>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  {formatCroreLakh(calculation.maturityValue)}
                </div>
              </div>

              {/* Visual Breakdown Bar */}
              <div className="mt-6 space-y-1.5">
                <div className="flex justify-between text-[11px] text-blue-200">
                  <span>Invested: {formatCroreLakh(calculation.totalInvested)}</span>
                  <span>Gains: {formatCroreLakh(calculation.totalGain)}</span>
                </div>
                <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${calculation.investedPercent}%` }}
                    className="bg-blue-400 transition-all duration-300"
                    title="Invested Capital"
                  />
                  <div
                    style={{ width: `${calculation.gainPercent}%` }}
                    className="bg-emerald-400 transition-all duration-300"
                    title="Wealth Gain"
                  />
                </div>
              </div>

              {/* Data Breakdown Cards */}
              <div className="mt-6 pt-5 border-t border-white/15 space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10">
                  <span className="text-blue-100">Total Amount Invested:</span>
                  <strong className="text-white text-sm">{formatCroreLakh(calculation.totalInvested)}</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10">
                  <span className="text-blue-100">Estimated Capital Growth:</span>
                  <strong className="text-emerald-300 text-sm">{formatCroreLakh(calculation.totalGain)}</strong>
                </div>

                {/* Section 80C Tax Savings Callout Box */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-200 font-medium">Eligible 80C Deduction / Year:</span>
                    <strong className="text-white font-bold">₹{calculation.eligible80cAmount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-200 font-medium">Potential Tax Saved / Year:</span>
                    <strong className="text-emerald-300 font-extrabold text-sm">
                      ₹{calculation.annualTaxSaved.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <p className="text-[10px] text-blue-200/80 pt-1">
                    *Applicable under the Old Tax Regime. In the 30% slab, you save ₹46,800 annually on a ₹1.5L investment.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-2">
              <button
                onClick={() =>
                  openLeadModal({
                    title: `Explore ELSS: ${mode === 'sip' ? `₹${monthlyAmount}/mo SIP` : `₹${lumpSumAmount} Lump sum`}`,
                    defaultService: 'ELSS'
                  })
                }
                className="w-full btn-ripple py-4 px-6 rounded-xl text-sm sm:text-base font-bold bg-white text-[#032e92] hover:bg-blue-50 shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Get Free ELSS Portfolio Consultation</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[11px] text-blue-200/70 text-center">
                AMFI-Registered Advisory. Unbiased multi-fund analysis with zero spam.
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="mt-8 text-center max-w-4xl mx-auto">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            <strong>Mandatory Regulatory Notice:</strong> The figures displayed in this calculator are purely illustrative and for informational purposes only. They do not constitute financial advice or guarantee future returns. Mutual fund investments are subject to market risks, read all scheme related documents carefully. Tax benefits and eligibility are subject to prevailing provisions of the Income Tax Act, 1961 (Old Tax Regime) and individual tax circumstances.
          </p>
        </div>
      </div>
    </section>
  );
}
