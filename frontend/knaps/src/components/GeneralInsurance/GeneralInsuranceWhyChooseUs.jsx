import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faShieldHalved, 
  faHandshake, 
  faClock, 
  faHeadphones, 
  faStar,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const differentiators = [
  {
    icon: faHandshake,
    title: '100% Unbiased Multi-Insurer Advisory',
    description: 'We represent you, not any single insurance company. We evaluate policies from 15+ top IRDAI-registered insurers solely based on merit, premium value, and settlement performance.'
  },
  {
    icon: faHeadphones,
    title: 'Dedicated Claims Desk Concierge',
    description: 'When an accident or emergency occurs, you don’t have to battle automated IVR call centers. Our dedicated claim managers step in to coordinate with surveyors and workshops.'
  },
  {
    icon: faShieldHalved,
    title: 'Zero Hidden Clauses & Transparent Wording',
    description: 'We clearly outline co-pays, disease waiting periods, room-rent sub-limits, and voluntary deductibles before you pay a single rupee. No unpleasant surprises during claims.'
  },
  {
    icon: faClock,
    title: 'NCB Protection & Timely Renewal Alerts',
    description: 'A lapsed policy can wipe out up to 50% accumulated No-Claim Bonus (NCB) and trigger costly physical vehicle inspections. We ensure your renewals remain seamlessly protected.'
  }
];

const stats = [
  { value: '15+', label: 'Partner Insurers' },
  { value: '98.4%', label: 'Claim Assistance Success' },
  { value: '24,000+', label: 'Cashless Network Facilities' },
  { value: '100%', label: 'Zero-Bias Advisory' }
];

const GeneralInsuranceWhyChooseUs = () => {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold shadow-sm">
              <FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5 text-[#032e92]" />
              <span>The KNAPS Advantage</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
              Why Choose KNAPS for Your <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">General Insurance</span>?
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Buying insurance online is quick, but what happens when you actually need to file a ₹5,00,000 claim? That’s where KNAPS makes the critical difference.
            </p>

            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-base" />
                <span className="text-sm font-medium text-gray-800">End-to-end claim documentation assistance</span>
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-base" />
                <span className="text-sm font-medium text-gray-800">Assistance in cashless authorization within 2 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-base" />
                <span className="text-sm font-medium text-gray-800">Certified IRDAI insurance planners with 10+ years experience</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => openLeadModal({ title: 'Schedule Expert Insurance Review', defaultService: 'General Insurance' })}
                className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Speak with an Insurance Specialist</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>
          </div>

          {/* Right Column: 4 Key Value Props */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {differentiators.map((diff, idx) => {
              return (
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
              );
            })}
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
};

export default GeneralInsuranceWhyChooseUs;
