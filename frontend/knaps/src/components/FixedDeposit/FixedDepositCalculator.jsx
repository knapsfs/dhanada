import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalculator,
  faArrowRight,
  faPersonWalkingWithCane,
  faBuildingColumns,
  faLandmark,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import { useLeadModal } from "../../context/LeadModalContext";

const formatCroreLakh = (val) => {
  if (val >= 10000000) {
    return `₹ ${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹ ${(val / 100000).toFixed(2)} Lakh`;
  }
  return `₹ ${Math.round(val).toLocaleString("en-IN")}`;
};

export default function FixedDepositCalculator() {
  const { openLeadModal } = useLeadModal();

  // Mode: "fd" or "bond"
  const [calcMode, setCalcMode] = useState("fd");

  // FD Input states
  const [principal, setPrincipal] = useState(100000);
  const [baseRate, setBaseRate] = useState(7.25);
  const [tenureYears, setTenureYears] = useState(3);
  const [compoundingFreq, setCompoundingFreq] = useState(1); // 1 = Annually (standard annual compounding)
  const [isSenior, setIsSenior] = useState(false);

  // Bond Input states (RBI FRSB)
  const [bondPrincipal, setBondPrincipal] = useState(200000);
  const [bondRate, setBondRate] = useState(8.05); // Current RBI FRSB rate
  const bondTenureYears = 7; // Statutory tenure for RBI FRSB

  // Effective interest rate calculation for FD
  const effectiveRate = useMemo(() => {
    return Number((baseRate + (isSenior ? 0.5 : 0)).toFixed(2));
  }, [baseRate, isSenior]);

  // Real-time compound interest calculations for FD
  const fdResults = useMemo(() => {
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

  // Real-time bond calculations (Semi-annual payouts over 7 years)
  const bondResults = useMemo(() => {
    const P = bondPrincipal;
    const r = bondRate / 100;
    const totalCycles = bondTenureYears * 2; // 14 semi-annual payments
    const semiAnnualPayout = P * (r / 2);
    const totalInterest = semiAnnualPayout * totalCycles;
    const totalMaturityProceeds = P + totalInterest;

    const principalPercent = Math.min(100, Math.max(5, (P / totalMaturityProceeds) * 100));
    const interestPercent = 100 - principalPercent;

    return {
      P,
      semiAnnualPayout,
      totalInterest,
      totalMaturityProceeds,
      totalCycles,
      principalPercent,
      interestPercent
    };
  }, [bondPrincipal, bondRate]);

  return (
    <section id="fd-calculator" className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faCalculator} className="text-[#032e92]" />
            <span>Interactive Yield Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Fixed Income{" "}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Maturity & Cashflow Calculator
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Calculate your guaranteed returns across Fixed Deposits (Bank & Corporate) and 100% Sovereign-backed Government of India (GoI) Bonds.
          </p>

          {/* Calculator Mode Switcher */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setCalcMode("fd")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                calcMode === "fd"
                  ? "bg-[#032e92] text-white shadow-md shadow-[#032e92]/20"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <FontAwesomeIcon icon={faBuildingColumns} className="text-xs" />
              <span>Fixed Deposit (FD) Calculator</span>
            </button>
            <button
              onClick={() => setCalcMode("bond")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                calcMode === "bond"
                  ? "bg-[#032e92] text-white shadow-md shadow-[#032e92]/20"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <FontAwesomeIcon icon={faLandmark} className="text-xs" />
              <span>GoI Bond (RBI FRSB) Calculator</span>
            </button>
          </div>
        </div>

        {/* ─── Mode 1: FD Calculator ─── */}
        {calcMode === "fd" && (
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
                    ₹ {principal.toLocaleString("en-IN")}
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
                    {effectiveRate}% p.a. {isSenior && "(+0.5% Senior)"}
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
                    isSenior ? "bg-[#032e92]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      isSenior ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Input 3: Tenure (Years) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Deposit Tenure (Years)
                  </label>
                  <span className="text-base font-bold text-[#032e92] bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-100">
                    {tenureYears} {tenureYears === 1 ? "Year" : "Years"}
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
                  <span>5 Years (Tax Saving)</span>
                  <span>10 Years</span>
                </div>
              </div>

              {/* Input 4: Compounding Frequency */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                  Compounding Frequency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: "Annually", val: 1 },
                    { label: "Half-Yearly", val: 2 },
                    { label: "Quarterly", val: 4 },
                    { label: "Monthly", val: 12 }
                  ].map((freq) => (
                    <button
                      key={freq.val}
                      type="button"
                      onClick={() => setCompoundingFreq(freq.val)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                        compoundingFreq === freq.val
                          ? "bg-[#032e92] text-white border-[#032e92] shadow-xs"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Default set to standard Annual compounding. Commercial banks typically compound quarterly.
                </p>
              </div>
            </div>

            {/* Right Column: Output Summary Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0a192f] via-[#032e92] to-[#021d63] rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 block mb-1">
                  Maturity Value (Cumulative)
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {formatCroreLakh(fdResults.maturityValue)}
                </div>
                <div className="text-xs text-blue-200 mt-1">
                  ₹ {Math.round(fdResults.maturityValue).toLocaleString("en-IN")} at end of {tenureYears} Years
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <span className="text-[11px] text-blue-200 uppercase tracking-wider block mb-1">
                    Principal Invested
                  </span>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {formatCroreLakh(fdResults.P)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <span className="text-[11px] text-emerald-300 uppercase tracking-wider block mb-1">
                    Total Interest Earned
                  </span>
                  <div className="text-base sm:text-lg font-bold text-emerald-400">
                    +{formatCroreLakh(fdResults.totalInterest)}
                  </div>
                </div>
              </div>

              {/* Non-Cumulative Income Estimates */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider block">
                  Regular Payout Estimates (Non-Cumulative)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-300 block">Monthly Interest:</span>
                    <span className="font-bold text-white">
                      ₹ {Math.round(fdResults.monthlyInterest).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-300 block">Quarterly Interest:</span>
                    <span className="font-bold text-white">
                      ₹ {Math.round(fdResults.quarterlyInterest).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Call to action */}
              <button
                onClick={() => openLeadModal({ title: "Open a High-Yield Fixed Deposit", defaultService: "Fixed Deposits" })}
                className="w-full btn-ripple py-3.5 px-4 rounded-xl text-sm font-bold bg-white text-[#032e92] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Book This Fixed Deposit</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>
          </div>
        )}

        {/* ─── Mode 2: GoI Bond (RBI FRSB) Calculator ─── */}
        {calcMode === "bond" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Bond Inputs (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200/90 shadow-lg space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Investment Amount in GoI Bonds
                  </label>
                  <span className="text-base font-bold text-[#032e92] bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-100">
                    ₹ {bondPrincipal.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={5000000}
                  step={10000}
                  value={bondPrincipal}
                  onChange={(e) => setBondPrincipal(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>₹ 10,000</span>
                  <span>₹ 25,00,000</span>
                  <span>₹ 50,00,000</span>
                </div>
              </div>

              {/* Coupon Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    RBI FRSB Coupon Rate (% p.a.)
                  </label>
                  <span className="text-base font-bold text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-lg border border-emerald-200">
                    {bondRate}% p.a. (Floating, NSC + 35 bps)
                  </span>
                </div>
                <input
                  type="range"
                  min={6.5}
                  max={9.0}
                  step={0.05}
                  value={bondRate}
                  onChange={(e) => setBondRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>6.5%</span>
                  <span>8.05% (Current Prevailing Coupon)</span>
                  <span>9.0%</span>
                </div>
              </div>

              {/* Bond Tenure Information */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide">
                  <FontAwesomeIcon icon={faLandmark} />
                  <span>Statutory 7-Year Sovereign Tenure</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  RBI Floating Rate Savings Bonds have a fixed 7-year maturity. Interest is paid semi-annually directly to your bank account on <strong>January 1st</strong> and <strong>July 1st</strong> every year.
                </p>
                <div className="pt-1 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                  <span>Zero maximum investment limit • 100% sovereign guarantee</span>
                </div>
              </div>
            </div>

            {/* Right Column: Bond Output Summary (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0a192f] via-[#054a36] to-[#022e22] rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 block mb-1">
                  Total Interest Earnings (Across 7 Years)
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {formatCroreLakh(bondResults.totalInterest)}
                </div>
                <div className="text-xs text-emerald-200 mt-1">
                  Paid through 14 semi-annual bank credits of ₹ {Math.round(bondResults.semiAnnualPayout).toLocaleString("en-IN")} each
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <span className="text-[11px] text-emerald-200 uppercase tracking-wider block mb-1">
                    Principal Invested
                  </span>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {formatCroreLakh(bondResults.P)}
                  </div>
                  <span className="text-[10px] text-emerald-300">Returned at Maturity</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <span className="text-[11px] text-emerald-200 uppercase tracking-wider block mb-1">
                    Every 6 Months Payout
                  </span>
                  <div className="text-base sm:text-lg font-bold text-emerald-300">
                    ₹ {Math.round(bondResults.semiAnnualPayout).toLocaleString("en-IN")}
                  </div>
                  <span className="text-[10px] text-emerald-300">Jan 1 & Jul 1 Payout</span>
                </div>
              </div>

              {/* Total Payouts + Principal */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">
                  Total Cumulative Cash Realized
                </span>
                <div className="text-xl font-bold text-white">
                  {formatCroreLakh(bondResults.totalMaturityProceeds)}
                </div>
                <p className="text-[11px] text-emerald-200/90 leading-tight">
                  Principal ₹ {bondResults.P.toLocaleString("en-IN")} + Total Interest ₹ {Math.round(bondResults.totalInterest).toLocaleString("en-IN")}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => openLeadModal({ title: "Invest in GoI Floating Rate Savings Bonds", defaultService: "GoI Bonds" })}
                className="w-full btn-ripple py-3.5 px-4 rounded-xl text-sm font-bold bg-white text-emerald-800 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Invest in GoI Bonds</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
