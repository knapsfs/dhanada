import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const faqs = [
  {
    id: 1,
    question: 'What is the difference between Third-Party and Comprehensive motor insurance?',
    answer:
      'Third-Party insurance is legally mandatory under the Motor Vehicles Act in India. It covers financial liabilities for injuries, loss of life, or property damage caused to third parties by your vehicle, but offers zero coverage for damage to your own vehicle. Comprehensive insurance covers both third-party liabilities AND own damage (accidents, fire, theft, floods, cyclones, vandalism). For complete peace of mind, a Comprehensive policy with Zero Depreciation add-on is strongly recommended.'
  },
  {
    id: 2,
    question: 'Why is a Zero Depreciation (Bumper-to-Bumper) add-on essential for cars and bikes?',
    answer:
      'Under standard motor insurance policies, the insurer deducts up to 50% for plastic, rubber, and nylon parts, 30% for fiberglass, and tiered deductions for metal parts due to age-related depreciation. A Zero Depreciation add-on eliminates this deduction, ensuring you receive 100% reimbursement on replacement parts (excluding mandatory compulsory deductibles).'
  },
  {
    id: 3,
    question: 'How does No Claim Bonus (NCB) transfer work when I buy a new car or switch insurers?',
    answer:
      'No Claim Bonus (NCB) belongs to the policyholder, not the vehicle! If you sell your old car or switch your insurance provider, you can retain and transfer your accumulated NCB discount (which can range from 20% to 50% on Own Damage premium) to your new vehicle by obtaining an NCB Retention Letter from your previous insurer. KNAPS handles this transfer paperwork for you seamlessly.'
  },
  {
    id: 4,
    question: 'Can tenants purchase Home Insurance for rented apartments?',
    answer:
      'Yes, absolutely! While landlords typically insure the physical structure of the building, the policy does not protect the tenant’s personal belongings. Tenants can purchase a Tenants Content Insurance policy that covers electrical appliances, furniture, laptops, electronics, modular fittings, and clothing against fire, electrical short-circuits, burglary, and natural calamities at a very low annual premium.'
  },
  {
    id: 5,
    question: 'How does the Cashless Claim settlement process work at network garages or hospitals?',
    answer:
      'In a cashless claim, you take your vehicle to an authorized network garage or get admitted to a network hospital. Upon intimating the insurer and submitting KYC/policy documents, the insurer issues a pre-authorization or conducts an initial survey. Once repairs or treatments are completed, the insurer settles the approved bill directly with the facility, meaning you only pay non-medical consumables or mandatory policy deductibles.'
  },
  {
    id: 6,
    question: 'Is International Travel Insurance mandatory for Schengen or overseas visas?',
    answer:
      'Yes. For all 27 Schengen European countries, travel insurance with a minimum emergency medical cover of €30,000 including medical evacuation and repatriation of remains is legally mandatory for visa approval. Furthermore, countries like the USA and Canada have extraordinarily high healthcare costs, where an emergency room visit can exceed $5,000–$25,000, making travel insurance a critical financial safeguard.'
  }
];

export default function GeneralInsuranceFAQ() {
  const [openId, setOpenId] = useState(1);

  const toggleFAQ = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const mid = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, mid);
  const rightFaqs = faqs.slice(mid);

  const renderFaqItem = (faq) => {
    const isOpen = openId === faq.id;

    return (
      <div
        key={faq.id}
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
            ? 'border-[#032e92] bg-white shadow-lg shadow-blue-900/5'
            : 'border-slate-100 bg-[#f8fafc] hover:bg-white hover:border-slate-200'
          }`}
      >
        <button
          type="button"
          onClick={() => toggleFAQ(faq.id)}
          className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
          aria-expanded={isOpen}
        >
          <span
            className={`text-[15px] md:text-[16px] font-bold transition-colors duration-300 ${isOpen ? 'text-[#032e92]' : 'text-slate-900'
              }`}
          >
            {faq.question}
          </span>
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen
                ? 'bg-[#032e92] text-white'
                : 'border border-slate-200 bg-white text-slate-400'
              }`}
          >
            <FontAwesomeIcon icon={isOpen ? faMinus : faPlus} className="text-xs" />
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 text-[14px] md:text-[15px] text-slate-600 leading-relaxed border-t border-slate-100/70 mt-1">
                {faq.answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Frequently Asked <span className="text-[#032e92]">Questions</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5">
            Everything you need to know about motor, health, travel, home, and commercial general insurance policies.
          </p>
        </div>

        {/* 2-Column Split FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 items-start">
          {/* Left Column */}
          <div className="space-y-4">
            {leftFaqs.map(renderFaqItem)}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {rightFaqs.map(renderFaqItem)}
          </div>
        </div>
      </div>
    </section>
  );
}
