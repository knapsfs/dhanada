import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faCoins,
  faClock,
  faPercent,
  faChartPie,
  faArrowRight,
  faCircleInfo,
  faPersonWalkingWithCane
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

export default function FixedDepositCalculator() {
  const { openLeadModal } = useLeadModal();

  // Input states
  const [principal, setPrincipal] = useState(100000);
  const [baseRate, setBaseRate] = useState(7.25);
  const [tenureYears, setTenureYears] = useState(3);
  const [compoundingFreq, setCompoundingFreq] = useState(4); // 4 = Quarterly (standard), 12 = Monthly, 2 = Half-Yearly, 1 = Annually
  const [isSenior, setIsSenior] = useState(false);

  // Effective interest rate calculation
  const effectiveRate = useMemo(() => {
    return Number((baseRate + (isSenior ? 0.5 : 0)).toFixed(2));
  }, [baseRate, isSenior]);

  // Real-time compound interest calculations
  const results = useMemo(() => {
    const P = principal;
    const r = effectiveRate / 100;
    const t = tenureYears;
    const n = compoundingFreq;

    // Compound Interest Formula: A = P * (1 + r/n)^(n*t)
    const maturityValue = P * Math.pow(1 + r / n, n * t);
    const totalInterest = Math.max(0, maturityValue - P);

    // Non-cumulative estimated periodic payouts
    const annualInterestSimple = P * r;
    const quarterlyInterest = annualInterestSimple / 4;
    const monthlyInterest = annualInterestSimple / 12;

    // Percentages for visual bar
    const principalPercent = Math.min(100, Math.max(5, (P / maturityValue) * 100));
    const interestPercent = 100 - principalPercent;

    return {
      P,
      maturityValue,
      totalInterest,
      annualInterestSimple,
      quarterlyInterest,
      monthlyInterest,
      principalPercent,
      interestPercent
    };
  }, [principal, effectiveRate, tenureYears, compoundingFreq]);

  return (
    <section id="fd-calculator" className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faCalculator} className="text-[#032e92]" />
            <span>Interactive Financial Tool</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Fixed Deposit{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Maturity & Interest Calculator
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Estimate your guaranteed maturity proceeds, total interest earned, or regular monthly/quarterly cash-flow based on your chosen tenure and compounding frequency.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Inputs (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200/90 shadow-lg space-y-6">
            {/* Input 1: Principal Amount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Total Deposit Amount
                </label>
                <span className="text-base font-bold text-[#032e92] bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-100">
                  ₹ {principal.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={2500000}
                step={10000}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>₹ 10,000</span>
                <span>₹ 10,00,000</span>
                <span>₹ 25,00,000</span>
              </div>
            </div>

            {/* Input 2: Base Interest Rate & Senior Citizen Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Annual Interest Rate (% p.a.)
                </label>
                <span className="text-base font-bold text-[#032e92] bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-100">
                  {effectiveRate}% p.a. {isSenior && '(+0.5% Senior)'}
                </span>
              </div>
              <input
                type="range"
                min={5.0}
                max={9.5}
                step={0.1}
                value={baseRate}
                onChange={(e) => setBaseRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>5.0%</span>
                <span>7.25% (Typical Bank Rate)</span>
                <span>9.5%</span>
              </div>
            </div>

            {/* Senior Citizen Toggle Card */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <FontAwesomeIcon icon={faPersonWalkingWithCane} className="text-sm" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Are you a Senior Citizen (Age 60+)?</div>
                  <div className="text-[11px] text-gray-600">Adds an illustrative +0.50% preferential interest rate</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSenior(!isSenior)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                  isSenior ? 'bg-[#032e92]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    isSenior ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Input 3: Tenure (Years) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Deposit Tenure
                </label>
                <span className="text-base font-bold text-[#032e92] bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-100">
                  {tenureYears} {tenureYears === 1 ? 'Year' : 'Years'} ({tenureYears * 12} Months)
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>1 Year</span>
                <span>5 Years (Tax-Saver Tenure)</span>
                <span>10 Years</span>
              </div>
            </div>

            {/* Input 4: Compounding Frequency */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Compounding Frequency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { n: 4, label: 'Quarterly', sub: 'Standard Bank FD' },
                  { n: 12, label: 'Monthly', sub: 'High Compounding' },
                  { n: 2, label: 'Half-Yearly', sub: 'Semi-Annual' },
                  { n: 1, label: 'Annually', sub: 'Yearly' }
                ].map((item) => (
                  <button
                    key={item.n}
                    type="button"
                    onClick={() => setCompoundingFreq(item.n)}
                    className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                      compoundingFreq === item.n
                        ? 'bg-[#032e92] text-white border-[#032e92] shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className={`text-[10px] ${compoundingFreq === item.n ? 'text-blue-200' : 'text-gray-400'}`}>
                      {item.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Output Summary & Financial Breakdown (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0a192f] via-[#021d63] to-[#032e92] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-4 border border-white/15">
                <FontAwesomeIcon icon={faCoins} className="text-emerald-300 text-xs" />
                <span>Illustrative Maturity Projection</span>
              </div>

              {/* Headline Maturity Value */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Total Maturity Value at {tenureYears} Years
                </span>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  {formatCroreLakh(results.maturityValue)}
                </div>
              </div>

              {/* Visual Breakdown Bar */}
              <div className="mt-6 space-y-1.5">
                <div className="flex justify-between text-[11px] text-blue-200">
                  <span>Principal: {formatCroreLakh(results.P)}</span>
                  <span>Interest: {formatCroreLakh(results.totalInterest)}</span>
                </div>
                <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${results.principalPercent}%` }}
                    className="bg-blue-400 transition-all duration-300"
                    title="Principal Deposit"
                  />
                  <div
                    style={{ width: `${results.interestPercent}%` }}
                    className="bg-emerald-400 transition-all duration-300"
                    title="Total Interest Earned"
                  />
                </div>
              </div>

              {/* Data Breakdown Cards */}
              <div className="mt-6 pt-5 border-t border-white/15 space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10">
                  <span className="text-blue-100">Principal Deposit:</span>
                  <strong className="text-white text-sm">{formatCroreLakh(results.P)}</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10">
                  <span className="text-blue-100">Total Interest Earned:</span>
                  <strong className="text-emerald-300 text-sm">+{formatCroreLakh(results.totalInterest)}</strong>
                </div>

                {/* Non-cumulative Periodic Income Box */}
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-1.5">
                  <span className="text-blue-200 font-medium block">If Non-Cumulative Regular Payout Selected:</span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-100">Monthly Payout:</span>
                    <strong className="text-white">~₹{Math.round(results.monthlyInterest).toLocaleString('en-IN')} / mo</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-100">Quarterly Payout:</span>
                    <strong className="text-white">~₹{Math.round(results.quarterlyInterest).toLocaleString('en-IN')} / qtr</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-2">
              <button
                onClick={() =>
                  openLeadModal({
                    title: `Explore FD Rates for ₹${principal.toLocaleString('en-IN')} (${tenureYears} Years)`,
                    defaultService: 'Fixed Deposits'
                  })
                }
                className="w-full btn-ripple py-4 px-6 rounded-xl text-sm sm:text-base font-bold bg-white text-[#032e92] hover:bg-blue-50 shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore Best FD Options</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[11px] text-blue-200/70 text-center">
                Compare institutional yields across scheduled banks and CRISIL/ICRA AAA corporate deposits.
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="mt-8 text-center max-w-4xl mx-auto">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            <strong>Illustrative Calculation Notice:</strong> The figures displayed above are purely illustrative and based on standard mathematical compound interest formulas. Actual returns, compounding frequency, premature withdrawal rules, and applicable TDS deductions are determined by the respective bank or corporate issuer’s terms and conditions and prevailing tax regulations.
          </p>
        </div>
      </div>
    </section>
  );
}
