import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faShieldHalved,
  faHandshake,
  faHeadphones,
  faFileContract,
  faStar,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const differentiators = [
  {
    icon: faHandshake,
    title: '100% Zero-Bias Multi-Insurer Advisory',
    description: 'We don’t represent a single insurance company. We scan plans across 15+ IRDAI authorized insurers to find the highest claim settlement ratios and best network hospital density in your city.'
  },
  {
    icon: faHeadphones,
    title: 'Dedicated Cashless Claims Concierge',
    description: 'During a medical emergency, you shouldn’t have to chase TPA desks or customer care numbers. Our dedicated claims managers assist with pre-authorization and discharge settlement.'
  },
  {
    icon: faFileContract,
    title: 'Zero Hidden Clauses & Fine-Print Audit',
    description: 'We demystify room rent capping, proportionate deduction clauses, copayments, and sub-limits before you sign, ensuring zero nasty surprises when the final hospital bill arrives.'
  },
  {
    icon: faShieldHalved,
    title: 'Free Existing Policy Gap Analysis',
    description: 'Already have a policy or employer cover? Our IRDAI certified planners review your existing document for free to identify coverage loopholes, waiting period status, and upgrade paths.'
  }
];

const stats = [
  { value: '15+', label: 'IRDAI Insurer Partners' },
  { value: '99.2%', label: 'Claim Assistance Success' },
  { value: '14,000+', label: 'Cashless Network Hospitals' },
  { value: '10+ Yrs', label: 'Financial Advisory Trust' }
];

export default function HealthInsuranceWhyChooseUs() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Value Prop (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold shadow-xs">
              <FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5 text-[#032e92]" />
              <span>The KNAPS Healthcare Advantage</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
              Why Trust KNAPS with Your{' '}
              <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
                Family’s Health Insurance?
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Buying health insurance online is easy, but getting a complex ₹8,00,000 hospital claim approved without deductions requires expert advocacy. That’s where KNAPS stands with your family.
            </p>

            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-base" />
                <span className="text-sm font-medium text-gray-800">45-minute average cashless pre-authorization support</span>
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-base" />
                <span className="text-sm font-medium text-gray-800">Assistance in transferring and retaining No Claim Bonus</span>
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-base" />
                <span className="text-sm font-medium text-gray-800">Certified health advisors available on call & WhatsApp</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => openLeadModal({ title: 'Schedule Expert Health Review', defaultService: 'Health Insurance' })}
                className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Speak with a Health Specialist</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>
          </div>

          {/* Right Column: 4 Key Value Props (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {differentiators.map((diff, idx) => (
              <div
                key={idx}
                className="bg-[#f7f9fc] rounded-2xl p-6 sm:p-7 border border-gray-200/80 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs mb-5">
                  <FontAwesomeIcon icon={diff.icon} className="text-lg" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0a192f] mb-2 group-hover:text-[#032e92] transition-colors">
                  {diff.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {diff.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-16 sm:mt-20 pt-12 border-t border-gray-200/80">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs sm:text-sm font-semibold text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
