import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompass,
  faUsers,
  faUser,
  faBaby,
  faPersonWalkingWithCane,
  faShieldHalved,
  faCheckCircle,
  faArrowRight,
  faStar,
  faCircleQuestion
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const lifeStages = [
  { id: 'young_single', label: 'Young Singles (18–30)', sub: 'Early career & singles' },
  { id: 'young_couple', label: 'Young Couple (25–35)', sub: 'Newly married couples' },
  { id: 'family_kids', label: 'Family with Kids (30–45)', sub: 'Growing nuclear families' },
  { id: 'mature_family', label: 'Mature Family (45–55)', sub: 'Teens & higher risks' },
  { id: 'senior_parents', label: 'Senior Parents (55+)', sub: 'Elderly healthcare focus' }
];

const familyTypes = [
  { id: 'individual', label: 'Self Only', members: '1 Adult' },
  { id: 'couple', label: 'Self + Spouse', members: '2 Adults' },
  { id: 'floater_1', label: 'Couple + 1 Kid', members: '2 Adults + 1 Child' },
  { id: 'floater_2', label: 'Couple + 2 Kids', members: '2 Adults + 2 Children' },
  { id: 'parents', label: 'Parents / In-Laws', members: '1–2 Senior Adults' }
];

const priorityNeeds = [
  { id: 'max_cover', label: 'Maximum 1-Cr Cover', badge: 'High Protection' },
  { id: 'low_waiting', label: 'Low Waiting Period (1-2 Yrs)', badge: 'Fast Coverage' },
  { id: 'maternity', label: 'Maternity & Infant Care', badge: 'Family Planning' },
  { id: 'budget_topup', label: 'Budget-Optimized Super Top-Up', badge: 'Cost Efficient' },
  { id: 'opd_wellness', label: 'OPD & Preventive Wellness', badge: 'Outpatient Care' }
];

const recommendationsMap = {
  young_single: {
    planName: 'Young Professional Individual Shield',
    recommendedSum: '₹15 Lakh to ₹25 Lakh',
    indicativePremium: 'Starts from ~₹480 / month',
    badge: 'Lock in lowest lifelong premium',
    features: [
      'Comprehensive cashless hospitalization at 14,000+ hospitals',
      'Zero room rent capping & no sub-limits on consultations or OT',
      'Accumulate up to 200% No Claim Bonus while young and healthy',
      'Pre & post hospitalization expenses covered for 60 & 180 days',
      'Instant Section 80D tax deduction up to ₹25,000'
    ],
    essentialAddons: ['Consumables Cover', 'Accidental OPD Rider']
  },
  young_couple: {
    planName: 'Comprehensive Couple Floater with Maternity Option',
    recommendedSum: '₹25 Lakh to ₹50 Lakh',
    indicativePremium: 'Starts from ~₹890 / month',
    badge: 'Most balanced for young couples',
    features: [
      'Single shared floater cover accessible by either spouse',
      'Option to activate maternity rider with 2-year waiting period',
      '100% automatic unlimited restoration of sum insured',
      'Zero co-payment across any network hospital in India',
      'Annual free health check-up package for both partners'
    ],
    essentialAddons: ['Maternity & Newborn Cover', 'Consumables Shield', 'Hospital Daily Cash']
  },
  family_kids: {
    planName: '1-Crore Smart Family Floater (Base + Super Top-Up)',
    recommendedSum: '₹50 Lakh to ₹1 Crore',
    indicativePremium: 'Starts from ~₹1,250 / month',
    badge: 'Gold Standard for Modern Families',
    features: [
      '₹15L–₹25L Base Floater + ₹50L–₹75L Super Top-Up for bulletproof safety',
      'Full coverage for daycare surgeries, pediatric treatments & emergency ICU',
      'Unlimited restoration benefit for unrelated illnesses',
      'Zero room rent restrictions — choose private AC single room or deluxe suite',
      'Free preventive health check-up for all adults'
    ],
    essentialAddons: ['Consumables Rider', 'Inflation Protector (CPI Linked)', 'Global Medical Evacuation']
  },
  mature_family: {
    planName: 'Executive High-Sum Family Protection Plan',
    recommendedSum: '₹50 Lakh to ₹1 Crore',
    indicativePremium: 'Starts from ~₹1,850 / month',
    badge: 'Vital for mid-career lifestyle protection',
    features: [
      'Extensive coverage for lifestyle diseases, cardiac care & oncology',
      'Shorter waiting period for newly detected pre-existing ailments',
      'Comprehensive in-patient care with zero disease-wise caps',
      'Preserves long-term retirement and college funding investments',
      'Maximizes 80D tax deductions'
    ],
    essentialAddons: ['Critical Illness Lump-Sum Rider', 'Consumables Cover', 'Home Nursing Care']
  },
  senior_parents: {
    planName: 'Specialized Senior Citizen Care Shield',
    recommendedSum: '₹15 Lakh to ₹25 Lakh Dedicated Cover',
    indicativePremium: 'Starts from ~₹2,200 / month',
    badge: 'Dignified Healthcare for Parents',
    features: [
      'Reduced waiting period (1–2 years) for diabetes, BP & joint conditions',
      'Covers advanced cataract, joint replacements, and dialysis procedures',
      'AYUSH treatments (Ayurveda, Homeopathy) and home healthcare included',
      'Tele-consultations and dedicated elderly customer care assistance',
      'Additional ₹50,000 tax deduction under Section 80D for senior parents'
    ],
    essentialAddons: ['Pre-Existing Disease Buyback', 'Home Care & Dialysis Rider', 'Air Ambulance Cover']
  }
};

export default function HealthInsuranceCoverageExplorer() {
  const { openLeadModal } = useLeadModal();
  const [selectedStage, setSelectedStage] = useState('family_kids');
  const [selectedFamily, setSelectedFamily] = useState('floater_2');
  const [selectedPriority, setSelectedPriority] = useState('max_cover');

  const recommendation = recommendationsMap[selectedStage] || recommendationsMap.family_kids;

  const handleGetQuote = () => {
    openLeadModal({
      title: `Get Quote: ${recommendation.planName}`,
      defaultService: 'Health Insurance'
    });
  };

  return (
    <section id="coverage-explorer" className="py-12 sm:py-16 bg-white relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f7f9fc]/60 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faCompass} className="text-[#032e92]" />
            <span>Smart Coverage Matcher</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Explore the{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Right Cover for Your Family
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Select your life stage, family size, and top health priority to reveal the optimal policy architecture, sum insured, and essential riders.
          </p>
        </div>

        {/* Step 1: Life Stage Selector */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            1. Select Your Current Life Stage
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {lifeStages.map((stage) => {
              const isActive = stage.id === selectedStage;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-300 border cursor-pointer ${
                    isActive
                      ? 'bg-[#032e92] text-white border-[#032e92] shadow-md scale-[1.02]'
                      : 'bg-[#f7f9fc] hover:bg-white text-gray-800 border-gray-200/80 hover:border-blue-200'
                  }`}
                >
                  <div className={`text-xs sm:text-sm font-bold ${isActive ? 'text-white' : 'text-[#0a192f]'}`}>
                    {stage.label}
                  </div>
                  <div className={`text-[11px] mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                    {stage.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Family Configuration */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            2. Select Family Members to Cover
          </label>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {familyTypes.map((fam) => {
              const isActive = fam.id === selectedFamily;
              return (
                <button
                  key={fam.id}
                  onClick={() => setSelectedFamily(fam.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#032e92] to-[#021d63] text-white border-transparent shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                >
                  <span>{fam.label}</span>
                  <span className={`text-[10px] ml-1.5 opacity-80 ${isActive ? 'text-blue-200' : 'text-gray-400'}`}>
                    ({fam.members})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Priority Need */}
        <div className="mb-10">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            3. Select Your Primary Health Priority
          </label>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {priorityNeeds.map((pri) => {
              const isActive = pri.id === selectedPriority;
              return (
                <button
                  key={pri.id}
                  onClick={() => setSelectedPriority(pri.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                  }`}
                >
                  <span>{pri.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Recommendation Card */}
        <div className="bg-[#f7f9fc] rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200/90 shadow-xl relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#032e92] via-[#0066cc] to-[#021d63]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: Plan details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
                  <FontAwesomeIcon icon={faStar} className="text-emerald-600 text-[10px]" />
                  <span>{recommendation.badge}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] tracking-tight">
                  {recommendation.planName}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
                  <span className="text-gray-600">
                    Recommended Cover: <strong className="text-[#032e92] text-base">{recommendation.recommendedSum}</strong>
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/60">
                    {recommendation.indicativePremium}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-[#032e92]" />
                  Core Coverage Highlights Under This Strategy
                </h4>
                <div className="space-y-2">
                  {recommendation.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-gray-200/60 shadow-xs">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-xs flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-gray-700 leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Addons & Quick Consultation (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-blue-100 shadow-md space-y-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 text-[#032e92] text-xs font-bold uppercase tracking-wider mb-2">
                  <FontAwesomeIcon icon={faStar} className="text-amber-500" />
                  <span>Essential Recommended Riders</span>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  Do not skip these riders to prevent out-of-pocket deductions during hospital billing:
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {recommendation.essentialAddons.map((addon, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-[#032e92] border border-blue-200/70"
                    >
                      + {addon}
                    </span>
                  ))}
                </div>

                <div className="space-y-2.5 pt-4 border-t border-gray-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cashless Network Garages/Hospitals:</span>
                    <strong className="text-gray-900">14,000+ Nationwide</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Claims Assistance Desk:</span>
                    <strong className="text-emerald-700">Dedicated 24/7</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Insurer Comparison:</span>
                    <strong className="text-gray-900">15+ Top IRDAI Partners</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={handleGetQuote}
                  className="w-full btn-ripple py-3.5 px-6 rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-lg shadow-[#032e92]/30 hover:shadow-xl hover:shadow-[#032e92]/40 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Get Customized Quotes for this Plan</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-[11px] text-gray-500 text-center">
                  Instant comparison across Star Health, HDFC ERGO, Care, Niva Bupa, ICICI Lombard & more.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Explanatory Footer */}
        <div className="mt-8 text-center">
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <FontAwesomeIcon icon={faCircleQuestion} className="text-gray-400" />
            <span>Have existing pre-existing conditions like diabetes or high blood pressure? Our advisors guide you to policies with Day-1 or 1-year waiting periods.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
