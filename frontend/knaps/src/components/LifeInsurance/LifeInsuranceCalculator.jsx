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
  faUsers
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
  const [currentSavings, setCurrentSavings] = useState(1000000);

  // Calculation Logic using Human Life Value (HLV) Model
  const calculation = useMemo(() => {
    // Income replacement multiplier based on working years left to age 60
    const workingYearsLeft = Math.max(5, 60 - age);
    // Typical income multiplier formula: 12x to 18x depending on dependents and age
    const multiplier = Math.min(20, Math.max(10, Math.round(workingYearsLeft * 0.5) + dependents));
    const incomeReplacement = annualIncome * multiplier;

    // Additional buffer for child/family milestones
    const milestoneBuffer = dependents * 1500000;

    // Total required cover = (Income replacement + Liabilities + Milestones) - Existing liquid savings
    const grossNeeded = incomeReplacement + liabilities + milestoneBuffer;
    const netCover = Math.max(2500000, grossNeeded - currentSavings);

    // Round to nearest 5 lakhs
    const roundedSumAssured = Math.round(netCover / 500000) * 500000;

    // Term Insurance Premium Estimate (approximate market actuarial curve for healthy non-smoker per crore)
    // Base rate per crore per year: ~₹6,000 at age 25, ~₹8,500 at age 30, ~₹14,000 at age 40, ~₹28,000 at age 50
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
      milestoneBuffer,
      currentSavings
    };
  }, [age, annualIncome, liabilities, dependents, currentSavings]);

  return (
    <section id="insurance-calculator" className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-[11px] font-extrabold tracking-widest uppercase mb-4">
            Interactive Tool
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0a192f] tracking-tight leading-tight mb-4">
            How Much Life Cover <span className="text-[#032e92]">Do You Need?</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-normal leading-relaxed">
            Use our Human Life Value (HLV) estimator to calculate your ideal life cover and see an estimated monthly premium instantly.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="bg-[#f8fafc] rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#e8edf7] shadow-xl shadow-blue-900/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left Inputs Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-7">
              {/* Input 1: Age */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Your Current Age
                  </label>
                  <span className="text-sm font-black text-[#032e92] bg-white px-3 py-1 rounded-lg border border-[#e8edf7]">
                    {age} Years
                  </span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={60}
                  step={1}
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full accent-[#032e92] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-1">
                  <span>18 Yrs</span>
                  <span>60 Yrs</span>
                </div>
              </div>

              {/* Input 2: Annual Income */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Annual Take-Home Income
                  </label>
                  <span className="text-sm font-black text-[#032e92] bg-white px-3 py-1 rounded-lg border border-[#e8edf7]">
                    ₹ {formatIndianNumber(annualIncome)}
                  </span>
                </div>
                <input
                  type="range"
                  min={300000}
                  max={10000000}
                  step={50000}
                  value={annualIncome}
                  onChange={e => setAnnualIncome(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full accent-[#032e92] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-1">
                  <span>₹ 3 Lakh</span>
                  <span>₹ 1 Crore</span>
                </div>
              </div>

              {/* Input 3: Outstanding Liabilities */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Total Loans & Liabilities (Home, Car, EMIs)
                  </label>
                  <span className="text-sm font-black text-[#032e92] bg-white px-3 py-1 rounded-lg border border-[#e8edf7]">
                    ₹ {formatIndianNumber(liabilities)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20000000}
                  step={100000}
                  value={liabilities}
                  onChange={e => setLiabilities(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full accent-[#032e92] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-1">
                  <span>₹ 0</span>
                  <span>₹ 2 Crore</span>
                </div>
              </div>

              {/* Input 4: Number of Dependents */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2.5">
                  Number of Financial Dependents
                </label>
                <div className="grid grid-cols-5 gap-2.5">
                  {[1, 2, 3, 4, 5].map((d) => {
                    const isSelected = dependents === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDependents(d)}
                        className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#032e92] bg-[#eef4ff] text-[#032e92] shadow-sm'
                            : 'border-[#e8edf7] bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {d === 5 ? '5+' : d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input 5: Current Savings / Assets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Existing Liquid Savings (FD, Mutual Funds, PF)
                  </label>
                  <span className="text-sm font-black text-[#032e92] bg-white px-3 py-1 rounded-lg border border-[#e8edf7]">
                    ₹ {formatIndianNumber(currentSavings)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10000000}
                  step={100000}
                  value={currentSavings}
                  onChange={e => setCurrentSavings(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full accent-[#032e92] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-1">
                  <span>₹ 0</span>
                  <span>₹ 1 Crore</span>
                </div>
              </div>
            </div>

            {/* Right Output Display (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#e8edf7] shadow-xl shadow-blue-900/5 flex flex-col justify-between h-full">
              <div>
                {/* Result Card Header */}
                <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-lg">
                      <FontAwesomeIcon icon={faShieldHeart} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#0a192f] text-sm leading-tight">Your Coverage Assessment</h4>
                      <p className="text-[11px] text-gray-400">Scientific HLV Formulation</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Optimal
                  </span>
                </div>

                {/* Big Recommended Sum Assured Box */}
                <div className="bg-gradient-to-br from-[#032e92] via-[#0948cd] to-[#021d63] text-white rounded-2xl p-5 mb-5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
                    Recommended Life Cover
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {formatCroreLakh(calculation.sumAssured)}
                  </p>
                  <p className="text-[11px] text-blue-100/90 mt-2 font-medium">
                    Ensures complete financial independence for your family in your absence.
                  </p>
                </div>

                {/* Estimated Monthly Premium Box */}
                <div className="bg-[#f7f9fc] rounded-2xl p-4 border border-[#e8edf7] mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Est. Monthly Starting Premium
                    </p>
                    <p className="text-2xl font-black text-emerald-600">
                      ₹ {calculation.monthlyPremium.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-gray-500"> / mo*</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-[#032e92] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                      Sec 80C Tax Saver
                    </span>
                  </div>
                </div>

                {/* Breakdown Details */}
                <div className="space-y-2.5 text-xs mb-6">
                  <div className="flex justify-between text-gray-600 py-1 border-b border-gray-100">
                    <span>Income Replacement Component:</span>
                    <span className="font-bold text-gray-900">{formatCroreLakh(calculation.incomeReplacement)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 py-1 border-b border-gray-100">
                    <span>Liability Clearance Buffer:</span>
                    <span className="font-bold text-gray-900">{formatCroreLakh(calculation.liabilities)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 py-1 border-b border-gray-100">
                    <span>Child / Milestone Protection:</span>
                    <span className="font-bold text-gray-900">{formatCroreLakh(calculation.milestoneBuffer)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 py-1">
                    <span>Less Existing Savings:</span>
                    <span className="font-semibold text-rose-600">- {formatCroreLakh(calculation.currentSavings)}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  type="button"
                  onClick={openLeadModal}
                  className="btn-ripple w-full py-3.5 px-5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-md hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Get Official Quotes For This Cover</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-[10px] text-gray-400 text-center italic mt-2.5 leading-tight">
                  *Illustrative estimation for healthy non-smokers. Final premiums subject to insurer underwriting.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
