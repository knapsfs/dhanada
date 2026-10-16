import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardCheck, 
  faScaleBalanced, 
  faFileShield, 
  faShieldHalved, 
  faArrowRight,
  faCheckCircle,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const steps = [
  {
    stepNumber: '01',
    title: 'Assess Your Asset & Risk',
    desc: 'Specify your vehicle model, family health profile, property square footage, or business operations to determine ideal coverage limits.',
    icon: faClipboardCheck,
    highlights: [
      'Tailored risk evaluation',
      'No unnecessary add-ons',
      'Optimal deductible guidance'
    ]
  },
  {
    stepNumber: '02',
    title: 'Compare 15+ Top Insurers',
    desc: 'Unbiased side-by-side comparison of IRDAI registered insurers reviewing claim settlement ratios, network garages, and premium costs.',
    icon: faScaleBalanced,
    highlights: [
      '100% transparent comparison',
      'Zero hidden exclusionary clauses',
      'Network garage & hospital check'
    ]
  },
  {
    stepNumber: '03',
    title: 'Instant Paperless Issuance',
    desc: 'Complete digital onboarding in minutes. Make secure payments and receive digitally signed policy documents directly to your WhatsApp & email.',
    icon: faFileShield,
    highlights: [
      'Instant digital policy download',
      'Zero physical paperwork',
      'No pre-policy inspection for select cars'
    ]
  },
  {
    stepNumber: '04',
    title: 'Lifetime Claim Concierge',
    desc: 'When unfortunate events strike, call our dedicated claims desk. We coordinate with surveyors, insurers, and workshops for priority settlement.',
    icon: faShieldHalved,
    highlights: [
      '24/7 emergency claims assistance',
      'Cashless garage & hospital coordination',
      'End-to-end documentation follow-up'
    ]
  }
];

const GeneralInsuranceHowItWorks = () => {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f7f9fc]/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-sm">
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            How It Works — <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">From Cover to Claim</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Securing protection for your car, home, health, or business shouldn’t be complicated. We make policy selection effortless and claims hassle-free.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => {
            return (
              <div
                key={idx}
                className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-blue-200/90 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Step Number Watermark / Pill */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200/60 flex items-center justify-center text-[#032e92] group-hover:scale-110 group-hover:bg-[#032e92] group-hover:text-white transition-all duration-300 shadow-xs">
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
            );
          })}
        </div>

        {/* Process Guarantee Banner */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-[#0a192f] to-[#021d63] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold tracking-tight">
              Ready to verify how much you can save on your next insurance policy?
            </h4>
            <p className="text-xs sm:text-sm text-blue-200">
              Get quotes compared from leading general insurance companies in under 60 seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openLeadModal({ title: 'Request Insurance Consultation', defaultService: 'General Insurance' })}
              className="btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-white text-[#032e92] hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Compare Plans Now</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </button>
            <a
              href="tel:+918080808080"
              className="btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faPhone} className="text-xs" />
              <span>+91 8080808080</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralInsuranceHowItWorks;
