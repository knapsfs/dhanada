import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faShieldHeart,
  faArrowRight,
  faCircleInfo,
  faWallet,
  faCoins,
  faUsers,
  faUser,
  faBuildingColumns,
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const formatIndianNumber = (val) => {
  if (val === '' || val === null || val === undefined) return '0';
  const str = String(val);
  if (str.includes('.')) {
    const [intPart, decPart] = str.split('.');
    const num = Number(intPart);
    return (isNaN(num) ? intPart : num.toLocaleString('en-IN')) + '.' + decPart;
  }
  const num = Number(str);
  return isNaN(num) ? str : num.toLocaleString('en-IN');
};

const formatCroreLakh = (val) => {
  if (val >= 10000000) {
    return `₹ ${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹ ${(val / 100000).toFixed(2)} Lakh`;
  }
  return `₹ ${val.toLocaleString('en-IN')}`;
};

export default function LifeInsuranceCalculator() {
  const { openLeadModal } = useLeadModal();

  // Inputs state
  const [age, setAge] = useState(30);
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [liabilities, setLiabilities] = useState(3000000);
  const [dependents, setDependents] = useState(2);

  // Calculation Logic using Human Life Value (HLV) Model
  const calculation = useMemo(() => {
    // Income replacement multiplier based on working years left to age 60
    const workingYearsLeft = Math.max(5, 60 - age);
    // Typical income multiplier formula: 12x to 18x depending on dependents and age
    const multiplier = Math.min(20, Math.max(10, Math.round(workingYearsLeft * 0.5) + dependents));
    const incomeReplacement = annualIncome * multiplier;

    // Additional buffer for child/family milestones
    const milestoneBuffer = dependents * 1500000;

    // Total required cover = Income replacement + Liabilities + Milestones
    const grossNeeded = incomeReplacement + liabilities + milestoneBuffer;
    const netCover = Math.max(2500000, grossNeeded);

    // Round to nearest 5 lakhs
    const roundedSumAssured = Math.round(netCover / 500000) * 500000;

    // Term Insurance Premium Estimate (approximate market actuarial curve for healthy non-smoker per crore)
    let ratePerCrorePerYear = 7000;
    if (age <= 25) ratePerCrorePerYear = 6000;
    else if (age <= 30) ratePerCrorePerYear = 8000;
    else if (age <= 35) ratePerCrorePerYear = 10500;
    else if (age <= 40) ratePerCrorePerYear = 14500;
    else if (age <= 45) ratePerCrorePerYear = 20000;
    else if (age <= 50) ratePerCrorePerYear = 29000;
    else ratePerCrorePerYear = 42000;

    const crores = roundedSumAssured / 10000000;
    const annualEstPremium = Math.round(crores * ratePerCrorePerYear);
    const monthlyEstPremium = Math.round(annualEstPremium / 12);

    return {
      sumAssured: roundedSumAssured,
      monthlyPremium: monthlyEstPremium,
      annualPremium: annualEstPremium,
      incomeReplacement,
      liabilities,
      milestoneBuffer
    };
  }, [age, annualIncome, liabilities, dependents]);

  return (
    <section id="insurance-calculator" className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900">
            How Much Life Cover <span className="text-[#032e92]">Do You Need?</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5">
            Use our Human Life Value (HLV) estimator to calculate your ideal life cover and see an estimated monthly premium instantly.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

            {/* Left Inputs Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Input 1: Age */}
              <div className="bg-[#f7f9fc] p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-[#032e92]" />
                    <span>Your Current Age</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={18}
                      max={60}
                      value={age}
                      onChange={(e) => setAge(Math.min(60, Math.max(18, Number(e.target.value))))}
                      className="w-32 pl-3 pr-11 py-1.5 rounded-xl border border-slate-300 text-right font-bold text-[#032e92] text-sm focus:ring-2 focus:ring-[#032e92] outline-none bg-white"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-xs">
                      Years
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min={18}
                  max={60}
                  step={1}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />

                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>18 Yrs</span>
                  <span>60 Yrs</span>
                </div>
              </div>

              {/* Input 2: Annual Income */}
              <div className="bg-[#f7f9fc] p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCoins} className="text-[#032e92]" />
                    <span>Annual Take-Home Income</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={300000}
                      max={10000000}
                      step={50000}
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(Math.max(0, Number(e.target.value)))}
                      className="w-36 pl-7 pr-3 py-1.5 rounded-xl border border-slate-300 text-right font-bold text-[#032e92] text-sm focus:ring-2 focus:ring-[#032e92] outline-none bg-white"
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min={300000}
                  max={10000000}
                  step={50000}
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />

                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>₹3 Lakh</span>
                  <span>₹1 Crore</span>
                </div>
              </div>

              {/* Input 3: Outstanding Liabilities */}
              <div className="bg-[#f7f9fc] p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBuildingColumns} className="text-[#032e92]" />
                    <span>Total Loans & Liabilities (Home, Car, EMIs)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={20000000}
                      step={100000}
                      value={liabilities}
                      onChange={(e) => setLiabilities(Math.max(0, Number(e.target.value)))}
                      className="w-36 pl-7 pr-3 py-1.5 rounded-xl border border-slate-300 text-right font-bold text-[#032e92] text-sm focus:ring-2 focus:ring-[#032e92] outline-none bg-white"
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={20000000}
                  step={100000}
                  value={liabilities}
                  onChange={(e) => setLiabilities(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />

                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>₹0</span>
                  <span>₹2 Crore</span>
                </div>
              </div>

              {/* Input 4: Number of Dependents */}
              <div className="bg-[#f7f9fc] p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="text-[#032e92]" />
                  <span>Number of Financial Dependents</span>
                </label>
                <div className="grid grid-cols-5 gap-2.5">
                  {[1, 2, 3, 4, 5].map((d) => {
                    const isSelected = dependents === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDependents(d)}
                        className={`py-2 rounded-xl font-bold text-xs sm:text-sm border-2 transition-all cursor-pointer ${isSelected
                          ? 'border-[#032e92] bg-[#eef4ff] text-[#032e92] shadow-sm'
                          : 'border-slate-300 bg-white text-gray-900 hover:border-gray-400'
                          }`}
                      >
                        {d === 5 ? '5+' : d}
                      </button>
                    );
                  })}
                </div>
              </div>


            </div>

            {/* Right Output Display (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-lg shadow-blue-900/5 space-y-5 lg:sticky ">
              {/* Big Recommended Sum Assured Box */}
              <div className="bg-gradient-to-br from-[#032e92] via-[#0948cd] to-[#021d63] text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

                <p className="text-xs font-bold text-blue-200 uppercase mb-1">
                  Recommended Life Cover
                </p>
                <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {formatCroreLakh(calculation.sumAssured)}
                </p>
              </div>

              {/* Estimated Monthly Premium Box */}
              <div className="bg-[#f7f9fc] rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase">
                    Est. Monthly Starting Premium
                  </p>
                  <p className="text-2xl font-black text-emerald-600">
                    ₹ {calculation.monthlyPremium.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-gray-600"> / mo*</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#032e92] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                    Sec 80C Tax Saver
                  </span>
                </div>
              </div>

              {/* Breakdown Details */}
              <div className="p-4 rounded-2xl bg-[#f7f9fc] border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600 py-1 border-b border-slate-200/70">
                  <span>Income Replacement Component:</span>
                  <span className="font-bold text-gray-900">{formatCroreLakh(calculation.incomeReplacement)}</span>
                </div>
                <div className="flex justify-between text-gray-600 py-1 border-b border-slate-200/70">
                  <span>Liability Clearance Buffer:</span>
                  <span className="font-bold text-gray-900">{formatCroreLakh(calculation.liabilities)}</span>
                </div>
                <div className="flex justify-between text-gray-600 py-1">
                  <span>Child & Milestone Protection:</span>
                  <span className="font-bold text-gray-900">{formatCroreLakh(calculation.milestoneBuffer)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={openLeadModal}
                className="btn-ripple w-full py-3.5 px-5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-md hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Get Official Quotes For This Cover</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
