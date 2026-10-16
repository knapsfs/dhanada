import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faUsers,
  faPersonWalkingWithCane,
  faHeartCircleBolt,
  faShieldHalved,
  faBaby,
  faCheckCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const plans = [
  {
    id: 'family-floater',
    title: 'Family Floater Health Cover',
    tagline: 'Comprehensive single policy safeguarding your entire immediate family.',
    icon: faUsers,
    badge: 'Most Popular Choice',
    badgeColor: 'bg-blue-50 text-[#032e92] border-blue-200',
    idealFor: 'Self, spouse, and up to 4 dependent children',
    sumInsured: '₹10 Lakh to ₹1 Crore+',
    highlights: [
      'Single shared sum insured accessible by any hospitalized family member',
      'Unlimited automatic restoration of sum insured for unrelated illnesses',
      '100% cashless hospitalization across 14,000+ network hospitals',
      'Annual complimentary health check-ups for all covered adults',
      'Pre & post hospitalization expenses covered up to 60 & 180 days'
    ]
  },
  {
    id: 'individual',
    title: 'Individual Health Insurance',
    tagline: 'Dedicated sum insured tailored exclusively to your personal health profile.',
    icon: faUser,
    badge: 'Personal Safety Net',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    idealFor: 'Young working professionals, singles & entrepreneurs',
    sumInsured: '₹5 Lakh to ₹50 Lakh',
    highlights: [
      'Independent coverage not shared with anyone else',
      'No claim bonus accumulates up to 100% of base sum insured',
      'Zero room rent capping and no disease-wise restrictions',
      'Lock-in lower premium rates by starting at an early age',
      'Tax savings up to ₹25,000 annually under Section 80D'
    ]
  },
  {
    id: 'senior-citizen',
    title: 'Senior Citizen Health Plan',
    tagline: 'Dedicated medical protection designed for parents aged 60 and above.',
    icon: faPersonWalkingWithCane,
    badge: 'Specialized for Parents',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    idealFor: 'Elderly parents (60+) with or without pre-existing conditions',
    sumInsured: '₹5 Lakh to ₹25 Lakh',
    highlights: [
      'Reduced waiting periods for diabetes, hypertension & cardiac issues',
      'Covers advanced cataract, joint replacement & dialysis procedures',
      'Includes AYUSH treatments (Ayurveda, Yoga, Unani, Homeopathy)',
      'Home healthcare & domiciliary hospitalization support',
      'Tax deduction up to ₹50,000 annually for senior parents u/s 80D'
    ]
  },
  {
    id: 'critical-illness',
    title: 'Critical Illness Protection',
    tagline: 'Guaranteed lump-sum payout upon diagnosis of 30+ life-threatening illnesses.',
    icon: faHeartCircleBolt,
    badge: 'Income Protection',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    idealFor: 'Primary earning members with active financial dependents',
    sumInsured: '₹10 Lakh to ₹1 Crore (Lump Sum)',
    highlights: [
      '100% lump sum payout upon first diagnosis, regardless of hospital bills',
      'Covers cancer, heart attack, stroke, kidney failure & major surgeries',
      'Payout can be used freely for living expenses, EMIs, or foreign medical care',
      'Does not require original hospital discharge bills to settle the claim',
      'Acts as a vital income-replacement cushion during recuperation'
    ]
  },
  {
    id: 'super-topup',
    title: 'Super Top-Up Health Shield',
    tagline: 'High-value umbrella cover at just a fraction of base policy premiums.',
    icon: faShieldHalved,
    badge: 'High Value, Low Cost',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    idealFor: 'Those with existing corporate or small ₹3L–₹5L base policies',
    sumInsured: '₹25 Lakh to ₹1 Crore (Affordable)',
    highlights: [
      'Adds ₹50 Lakh+ cushion at 75% lower cost than buying fresh base cover',
      'Deductible activates cumulatively across all claims in a policy year',
      'Seamlessly kicks in once your corporate or base insurance exhausts',
      'Zero room rent sub-limits and full cashless hospital network benefits',
      'Independent of your employer; stays valid even if you switch jobs'
    ]
  },
  {
    id: 'maternity',
    title: 'Maternity & Newborn Care',
    tagline: 'Comprehensive pregnancy, delivery, and infant protection package.',
    icon: faBaby,
    badge: 'Family Planning',
    badgeColor: 'bg-pink-50 text-pink-800 border-pink-200',
    idealFor: 'Couples planning to start or expand their family within 2–3 years',
    sumInsured: '₹50,000 to ₹2 Lakh Delivery Cover',
    highlights: [
      'Normal and cesarean (C-section) delivery hospitalization covered',
      'Pre-natal and post-natal medical consultations and diagnostic tests',
      'Newborn baby covered from Day 1 including congenital conditions',
      'First-year vaccination expenses covered as per pediatric guidelines',
      'Seamless addition of newborn to the family floater policy'
    ]
  }
];

export default function HealthInsurancePlans() {
  const { openLeadModal } = useLeadModal();

  return (
    <section id="health-plans" className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faShieldHalved} className="text-[#032e92]" />
            <span>Comprehensive Plan Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Tailored Health Insurance Plans for{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Every Life Stage
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            From single young professionals to growing families and senior parents, explore curated insurance plans structured to protect against every medical contingency.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan) => {
            return (
              <div
                key={plan.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-blue-200/90 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200/60 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white transition-all duration-300 shadow-xs">
                      <FontAwesomeIcon icon={plan.icon} className="text-lg" />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-[#0a192f] mb-2 group-hover:text-[#032e92] transition-colors">
                    {plan.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    {plan.tagline}
                  </p>

                  {/* Ideal For & Sum Insured Badges */}
                  <div className="space-y-2 py-3 border-y border-gray-100 mb-5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Ideal For:</span>
                      <span className="font-semibold text-gray-800 text-right max-w-[65%]">{plan.idealFor}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Cover Range:</span>
                      <span className="font-bold text-[#032e92]">{plan.sumInsured}</span>
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  <ul className="space-y-2.5 mb-6">
                    {plan.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-xs flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action */}
                <div className="pt-2">
                  <button
                    onClick={() => openLeadModal({ title: `Get Quote: ${plan.title}`, defaultService: 'Health Insurance' })}
                    className="w-full btn-ripple py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.01] cursor-pointer"
                  >
                    <span>Get Customized {plan.title.split(' ')[0]} Quote</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Advisory Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-[#0a192f]">
              Confused between Family Floater vs Super Top-Up combinations?
            </h4>
            <p className="text-xs sm:text-sm text-gray-600">
              Our IRDAI certified health insurance advisors help you design the most cost-effective 1-Crore cover structure with zero broker bias.
            </p>
          </div>
          <button
            onClick={() => openLeadModal({ title: 'Request Health Plan Recommendation', defaultService: 'Health Insurance' })}
            className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <span>Request Free Plan Comparison</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
