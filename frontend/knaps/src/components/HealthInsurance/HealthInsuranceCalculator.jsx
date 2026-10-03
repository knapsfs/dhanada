import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faShieldHeart,
  faArrowRight,
  faUsers,
  faPiggyBank,
  faCity,
  faBuildingUser,
  faCircleInfo,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const formatLakhCrore = (val) => {
  if (val >= 10000000) {
    return `₹ ${(val / 10000000).toFixed(2)} Crore`;
  }
  if (val >= 100000) {
    return `₹ ${(val / 100000).toFixed(0)} Lakh`;
  }
  return `₹ ${val.toLocaleString('en-IN')}`;
};

export default function HealthInsuranceCalculator() {
  const { openLeadModal } = useLeadModal();

  // Inputs state
  const [familyType, setFamilyType] = useState('family_2'); // individual, couple, family_1, family_2, with_parents
  const [age, setAge] = useState(35);
  const [cityTier, setCityTier] = useState('metro'); // metro, tier2
  const [corporateCover, setCorporateCover] = useState(500000); // 0, 300000, 500000, 1000000
  const [hasSeniorParents, setHasSeniorParents] = useState(false);

  // Calculation Logic
  const results = useMemo(() => {
    // Determine Base Cover Need based on Family + City
    let baseCover = 1500000; // 15L
    if (familyType === 'individual') {
      baseCover = cityTier === 'metro' ? 1500000 : 1000000;
    } else if (familyType === 'couple') {
      baseCover = cityTier === 'metro' ? 2500000 : 1500000;
    } else if (familyType === 'family_1') {
      baseCover = cityTier === 'metro' ? 2500000 : 2000000;
    } else if (familyType === 'family_2') {
      baseCover = cityTier === 'metro' ? 5000000 : 2500000;
    } else if (familyType === 'with_parents' || hasSeniorParents) {
      baseCover = cityTier === 'metro' ? 5000000 : 3500000;
    }

    // Determine Super Top-Up cushion to achieve 50L–1Cr safety buffer
    let topUpCover = 5000000; // 50 Lakh
    if (baseCover >= 5000000) {
      topUpCover = 5000000; // Total 1 Crore
    } else {
      topUpCover = 5000000; // Total 65L - 75L
    }

    const totalShield = baseCover + topUpCover;

    // Calculate Section 80D Tax Deduction
    // Self/Family: max 25,000 (or 50,000 if self age >= 60)
    // Parents: max 50,000 if senior
    let max80dDeduction = 25000;
    if (age >= 60) {
      max80dDeduction = 50000;
    }
    if (hasSeniorParents || familyType === 'with_parents') {
      max80dDeduction += 50000;
    }
    const estimatedTaxSaved = Math.round(max80dDeduction * 0.312); // Assumed 30% slab + 4% cess

    // Indicative Monthly & Annual Premium Estimates
    // Rough estimation based on age, family and sum insured
    let annualPremiumEstimate = 12000;
    if (familyType === 'individual') {
      annualPremiumEstimate = age < 30 ? 7500 : age < 45 ? 11000 : 18000;
    } else if (familyType === 'couple') {
      annualPremiumEstimate = age < 35 ? 16000 : age < 45 ? 22000 : 32000;
    } else {
      annualPremiumEstimate = age < 40 ? 24000 : age < 50 ? 34000 : 48000;
    }
    if (hasSeniorParents || familyType === 'with_parents') {
      annualPremiumEstimate += 28000;
    }

    const monthlyPremiumEstimate = Math.round(annualPremiumEstimate / 12);

    return {
      baseCover,
      topUpCover,
      totalShield,
      max80dDeduction,
      estimatedTaxSaved,
      annualPremiumEstimate,
      monthlyPremiumEstimate
    };
  }, [familyType, age, cityTier, corporateCover, hasSeniorParents]);

  return (
    <section id="health-calculator" className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faCalculator} className="text-[#032e92]" />
            <span>Interactive Health Coverage Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            How Much Health Cover{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Does Your Family Really Need?
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Enter your family composition, age, and location to calculate the ideal baseline cover, super top-up shield, and potential tax savings under Section 80D.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Input Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200/90 shadow-lg space-y-6">
            {/* Input 1: Family Composition */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center justify-between">
                <span>Who Do You Want to Cover?</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'individual', label: 'Self Only' },
                  { id: 'couple', label: 'Self + Spouse' },
                  { id: 'family_1', label: 'Couple + 1 Child' },
                  { id: 'family_2', label: 'Couple + 2 Children' },
                  { id: 'with_parents', label: 'Self + Parents' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFamilyType(item.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                      familyType === item.id
                        ? 'bg-[#032e92] text-white border-[#032e92] shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Age of Eldest Member */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Age of Eldest Covered Member
                </label>
                <span className="text-base font-bold text-[#032e92] bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-100">
                  {age} Years Old
                </span>
              </div>
              <input
                type="range"
                min={18}
                max={75}
                step={1}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>18 Years</span>
                <span>45 Years</span>
                <span>75 Years</span>
              </div>
            </div>

            {/* Input 3: City Tier */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                City of Residence (Hospital Cost Tier)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCityTier('metro')}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    cityTier === 'metro'
                      ? 'bg-blue-50 text-[#032e92] border-blue-300 shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-white'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm">Tier 1 / Metro City</div>
                  <div className="text-[11px] text-gray-500">Mumbai, Delhi NCR, Bengaluru, Hyderabad, etc.</div>
                </button>

                <button
                  onClick={() => setCityTier('tier2')}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    cityTier === 'tier2'
                      ? 'bg-blue-50 text-[#032e92] border-blue-300 shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-white'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm">Tier 2 / Tier 3 City</div>
                  <div className="text-[11px] text-gray-500">Jaipur, Lucknow, Indore, Coimbatore, etc.</div>
                </button>
              </div>
            </div>

            {/* Input 4: Existing Employer / Corporate Cover */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                Existing Employer / Corporate Health Cover
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: 0, label: 'No Cover' },
                  { val: 300000, label: '₹3 Lakh' },
                  { val: 500000, label: '₹5 Lakh' },
                  { val: 1000000, label: '₹10 Lakh' }
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setCorporateCover(item.val)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      corporateCover === item.val
                        ? 'bg-[#032e92] text-white border-[#032e92]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5">
                {corporateCover > 0
                  ? `With ₹${corporateCover / 100000}L employer cover, a Super Top-Up is the most affordable way to boost your protection to ₹1 Crore.`
                  : 'Without corporate cover, a full comprehensive base floater of ₹25L–₹50L is strongly recommended.'}
              </p>
            </div>

            {/* Input 5: Senior Parents Toggle */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#0a192f]">Including Senior Citizen Parents (60+)?</div>
                <div className="text-[11px] text-gray-600">Unlocks an additional ₹50,000 tax deduction under Section 80D</div>
              </div>
              <button
                type="button"
                onClick={() => setHasSeniorParents(!hasSeniorParents)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                  hasSeniorParents || familyType === 'with_parents' ? 'bg-[#032e92]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    hasSeniorParents || familyType === 'with_parents' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right: Real-time Recommended Output Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0a192f] via-[#021d63] to-[#032e92] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-4 border border-white/15">
                <FontAwesomeIcon icon={faStar} className="text-amber-300 text-xs" />
                <span>Recommended Coverage Architecture</span>
              </div>

              {/* Headline Sum Insured */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">Total Recommended Safety Net</span>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  {formatLakhCrore(results.totalShield)}
                </div>
              </div>

              {/* Breakdown Stack */}
              <div className="mt-6 pt-5 border-t border-white/15 space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10">
                  <span className="text-blue-100">Recommended Base Floater:</span>
                  <strong className="text-white text-sm">{formatLakhCrore(results.baseCover)}</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10">
                  <span className="text-blue-100">Super Top-Up Cushion:</span>
                  <strong className="text-white text-sm">{formatLakhCrore(results.topUpCover)}</strong>
                </div>

                {corporateCover > 0 && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/20 text-emerald-200 border border-emerald-500/30">
                    <span>Existing Employer Deductible:</span>
                    <strong>{formatLakhCrore(corporateCover)}</strong>
                  </div>
                )}
              </div>

              {/* Tax Savings Highlights Box */}
              <div className="mt-5 p-4 rounded-2xl bg-white/10 border border-white/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">Section 80D Deduction Limit:</span>
                  <strong className="text-amber-300 font-bold text-sm">₹{results.max80dDeduction.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">Estimated Annual Tax Saved:</span>
                  <strong className="text-emerald-300 font-bold text-sm">₹{results.estimatedTaxSaved.toLocaleString('en-IN')}</strong>
                </div>
                <p className="text-[11px] text-blue-200/80 pt-1">
                  *Calculated at 30% tax bracket + 4% cess. Health insurance premiums effectively pay for themselves in tax refunds!
                </p>
              </div>

              {/* Indicative Premium Range */}
              <div className="mt-5 text-center">
                <span className="text-xs text-blue-200">Indicative Premium Estimate:</span>
                <div className="text-xl font-bold text-white mt-0.5">
                  ~₹{results.monthlyPremiumEstimate.toLocaleString('en-IN')} <span className="text-xs font-normal text-blue-200">/ month</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 space-y-2">
              <button
                onClick={() =>
                  openLeadModal({
                    title: `Quote for ${formatLakhCrore(results.totalShield)} Health Cover`,
                    defaultService: 'Health Insurance'
                  })
                }
                className="w-full btn-ripple py-4 px-6 rounded-xl text-sm sm:text-base font-bold bg-white text-[#032e92] hover:bg-blue-50 shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Get Exact Quotes for this Cover</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[11px] text-blue-200/70 text-center">
                Free comparison across 15+ top IRDAI insurers. No spam guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
