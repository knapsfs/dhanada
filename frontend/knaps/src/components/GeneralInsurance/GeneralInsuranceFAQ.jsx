import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faCircleQuestion, 
  faPhone 
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const faqs = [
  {
    question: 'What is the difference between Third-Party and Comprehensive motor insurance?',
    answer: 'Third-Party insurance is legally mandatory under the Motor Vehicles Act in India. It covers financial liabilities for injuries, loss of life, or property damage caused to third parties by your vehicle, but offers zero coverage for damage to your own vehicle. Comprehensive insurance covers both third-party liabilities AND own damage (accidents, fire, theft, floods, cyclones, vandalism). For complete peace of mind, a Comprehensive policy with Zero Depreciation add-on is strongly recommended.'
  },
  {
    question: 'Why is a Zero Depreciation (Bumper-to-Bumper) add-on essential for cars and bikes?',
    answer: 'Under standard motor insurance policies, the insurer deducts up to 50% for plastic, rubber, and nylon parts, 30% for fiberglass, and tiered deductions for metal parts due to age-related depreciation. A Zero Depreciation add-on eliminates this deduction, ensuring you receive 100% reimbursement on replacement parts (excluding mandatory compulsory deductibles).'
  },
  {
    question: 'How does No Claim Bonus (NCB) transfer work when I buy a new car or switch insurers?',
    answer: 'No Claim Bonus (NCB) belongs to the policyholder, not the vehicle! If you sell your old car or switch your insurance provider, you can retain and transfer your accumulated NCB discount (which can range from 20% to 50% on Own Damage premium) to your new vehicle by obtaining an NCB Retention Letter from your previous insurer. KNAPS handles this transfer paperwork for you seamlessly.'
  },
  {
    question: 'Can tenants purchase Home Insurance for rented apartments?',
    answer: 'Yes, absolutely! While landlords typically insure the physical structure of the building, the policy does not protect the tenant’s personal belongings. Tenants can purchase a Tenants Content Insurance policy that covers electrical appliances, furniture, laptops, electronics, modular fittings, and clothing against fire, electrical short-circuits, burglary, and natural calamities at a very low annual premium.'
  },
  {
    question: 'How does the Cashless Claim settlement process work at network garages or hospitals?',
    answer: 'In a cashless claim, you take your vehicle to an authorized network garage or get admitted to a network hospital. Upon intimating the insurer and submitting KYC/policy documents, the insurer issues a pre-authorization or conducts an initial survey. Once repairs or treatments are completed, the insurer settles the approved bill directly with the facility, meaning you only pay non-medical consumables or mandatory policy deductibles.'
  },
  {
    question: 'Is International Travel Insurance mandatory for Schengen or overseas visas?',
    answer: 'Yes. For all 27 Schengen European countries, travel insurance with a minimum emergency medical cover of €30,000 including medical evacuation and repatriation of remains is legally mandatory for visa approval. Furthermore, countries like the USA and Canada have extraordinarily high healthcare costs, where an emergency room visit can exceed $5,000–$25,000, making travel insurance a critical financial safeguard.'
  },
  {
    question: 'How does KNAPS assist during claims compared to buying directly on impersonal aggregators?',
    answer: 'When you purchase through generic aggregators, you are often left dealing with automated chatbots or long IVR queues during an accident or hospitalization. At KNAPS, our dedicated Claims Concierge assists you with immediate claim intimation, surveyor coordination, documentation validation, and escalation management with the insurer to ensure your claim is processed swiftly without unfair deductions.'
  }
];

const GeneralInsuranceFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const { openLeadModal } = useLeadModal();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-sm">
            <FontAwesomeIcon icon={faCircleQuestion} className="w-3.5 h-3.5 text-[#032e92]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Got Questions? <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">We Have Answers</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Everything you need to know about motor, health, travel, home, and commercial general insurance policies.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:border-blue-200 transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-[#0a192f] pr-2">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#032e92] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#032e92] text-white' : ''}`}>
                    <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-gray-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-blue-100 shadow-md text-center flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-bold text-[#0a192f]">Have a question about a specific policy or claim clause?</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Our certified insurance advisors are available for free policy audits.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => openLeadModal({ title: 'Ask Insurance Question', defaultService: 'General Insurance' })}
              className="btn-ripple px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Ask an Expert
            </button>
            <a
              href="tel:+918080808080"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#032e92] bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <FontAwesomeIcon icon={faPhone} className="text-xs" />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralInsuranceFAQ;
