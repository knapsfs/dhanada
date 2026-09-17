import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserDoctor,
  faScaleBalanced,
  faFileShield,
  faHandHoldingHand,
  faCheckCircle,
  faArrowRight,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const steps = [
  {
    stepNumber: '01',
    title: 'Assess Family Health Needs',
    desc: 'Specify family members to cover, ages, existing corporate cover, and medical history to calculate optimal sum insured without paying for redundant riders.',
    icon: faUserDoctor,
    highlights: [
      'Tailored family risk assessment',
      'Realistic sum insured calculation',
      'Corporate coverage gap analysis'
    ]
  },
  {
    stepNumber: '02',
    title: 'Compare 15+ Top Insurers',
    desc: 'Review side-by-side comparisons of IRDAI registered insurers focusing on Claim Settlement Ratio (CSR), network hospitals in your city, and waiting periods.',
    icon: faScaleBalanced,
    highlights: [
      '100% unbiased recommendation',
      'Zero room-rent capping filter',
      'No disease-wise sub-limit plans'
    ]
  },
  {
    stepNumber: '03',
    title: 'Instant Paperless Issuance',
    desc: 'Complete digital onboarding in minutes. Tele-underwriting if needed, secure online payment, and instant policy document delivery directly to WhatsApp and email.',
    icon: faFileShield,
    highlights: [
      '100% digital setup in minutes',
      'No physical paperwork hassle',
      'Instant policy e-card issued'
    ]
  },
  {
    stepNumber: '04',
    title: 'Dedicated Cashless Concierge',
    desc: 'During hospitalization, simply present your health e-card at any of the 14,000+ network hospitals. Our claims desk coordinates with the TPA for 45-min pre-authorization.',
    icon: faHandHoldingHand,
    highlights: [
      '24/7 hospital admission help',
      'Seamless TPA cashless coordination',
      'End-to-end discharge assistance'
    ]
  }
];

export default function HealthInsuranceHowItWorks() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 lg:py-28 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            How It Works —{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              From Plan Selection to Cashless Care
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Navigating health insurance should bring peace of mind, not confusion. We streamline everything from finding your ideal coverage to hospital admission support.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-blue-200/90 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200/60 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
                    <FontAwesomeIcon icon={step.icon} className="text-lg" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-gray-200 group-hover:text-[#032e92]/30 transition-colors">
                    {step.stepNumber}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                {step.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2 text-xs text-gray-700">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-xs" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Assurance Banner */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-[#0a192f] to-[#021d63] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold tracking-tight">
              Facing an emergency or need cashless admission support right now?
            </h4>
            <p className="text-xs sm:text-sm text-blue-200">
              Our 24x7 Claims Assistance Concierge is on standby to coordinate directly with network hospitals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openLeadModal({ title: 'Request Immediate Health Consultation', defaultService: 'Health Insurance' })}
              className="btn-ripple px-6 py-3 rounded-xl text-sm font-semibold bg-white text-[#032e92] hover:bg-blue-50 shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>Speak with Claims Desk</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </button>
            <a
              href="tel:+918080808080"
              className="px-5 py-3 rounded-xl text-sm font-semibold text-white/90 hover:text-white border border-white/20 hover:border-white/40 transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPhone} className="text-xs" />
              <span>+91 8080808080</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
