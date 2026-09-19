import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHalved, 
  faWrench, 
  faScaleBalanced, 
  faPiggyBank, 
  faLifeRing, 
  faAward,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const benefits = [
  {
    icon: faShieldHalved,
    title: 'Complete Risk Transfer & Asset Protection',
    description: 'Shield personal savings and wealth from being wiped out by high-cost accidents, devastating floods, factory fires, or major illnesses.',
    highlight: '100% Peace of Mind'
  },
  {
    icon: faWrench,
    title: 'Cashless Network at 24,000+ Facilities',
    description: 'Drive in or get admitted without paying out-of-pocket expenses. Seamless cashless approvals at certified brand workshops and premier hospitals.',
    highlight: 'Zero Upfront Stress'
  },
  {
    icon: faAward,
    title: 'Zero Depreciation & Total Invoice Protection',
    description: 'Receive full reimbursement without deductions on plastic, rubber, fiber glass and metal replacements during accidental car and bike repairs.',
    highlight: 'Full Value Recovery'
  },
  {
    icon: faScaleBalanced,
    title: 'Mandatory Regulatory Compliance',
    description: 'Avoid severe traffic penalties and legal liabilities under the Motor Vehicles Act 2019 and statutory workmen’s compensation guidelines.',
    highlight: 'Legal Protection'
  },
  {
    icon: faPiggyBank,
    title: 'Significant Tax Savings Under 80D',
    description: 'Claim tax deductions up to ₹75,000 to ₹1,00,000 annually under Section 80D for health insurance premiums paid for self, family, and senior parents.',
    highlight: 'Save up to ₹31,200/yr'
  },
  {
    icon: faLifeRing,
    title: '24/7 Roadside & Emergency Care Assistance',
    description: 'Immediate on-road support for vehicle breakdowns, puncture repair, fuel delivery, towing, and worldwide medical emergency repatriation.',
    highlight: 'Round-the-clock Support'
  }
];

const GeneralInsuranceBenefits = () => {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 lg:py-28 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-sm">
            <span>High-Impact Advantages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Key Benefits of <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">General Insurance</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            General insurance isn’t merely an expense — it’s your primary financial shock absorber protecting the investments and lifestyle you have worked hard to build.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, idx) => {
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl sm:rounded-3xl p-7 sm:p-8 border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200/60 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white group-hover:scale-105 transition-all duration-300">
                      <FontAwesomeIcon icon={benefit.icon} className="text-lg" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#032e92] border border-blue-100">
                      {benefit.highlight}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors leading-snug">
                    {benefit.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-[#032e92] group-hover:translate-x-1 transition-transform">
                  <span>Learn more about coverage details</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs ml-1.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA trigger */}
        <div className="mt-14 text-center">
          <button
            onClick={() => openLeadModal({ title: 'Explore Insurance Benefits', defaultService: 'General Insurance' })}
            className="btn-ripple px-8 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-lg shadow-[#032e92]/25 hover:shadow-xl hover:shadow-[#032e92]/35 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Protect Your Assets Today</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default GeneralInsuranceBenefits;
