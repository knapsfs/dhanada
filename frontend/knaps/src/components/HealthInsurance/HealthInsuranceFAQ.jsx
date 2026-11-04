import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const faqs = [
  {
    id: 1,
    question: 'Why is corporate health insurance from my employer not sufficient?',
    answer:
      'Corporate health insurance is typically limited to ₹3 Lakh–₹5 Lakh, which can be wiped out in a single intensive care hospital stay. More importantly, corporate insurance ceases immediately if you switch employers, take a career break, face layoffs, or retire — precisely the life stages when buying personal health insurance becomes significantly more expensive or difficult due to age and newly acquired medical conditions.'
  },
  {
    id: 2,
    question: 'What is a pre-existing disease (PED) and how do waiting periods work?',
    answer:
      'A Pre-Existing Disease (PED) is any medical condition, injury, or ailment (e.g., diabetes, hypertension, asthma, thyroid) diagnosed or treated prior to buying the policy. Under IRDAI regulations, health insurers enforce a waiting period ranging from 1 to 3 years before claims related to that specific condition are covered. Several modern plans recommended by KNAPS offer riders to reduce this waiting period to as little as 1 year or Day 1.'
  },
  {
    id: 3,
    question: 'What is the Room Rent Capping clause and how does it reduce claim payouts?',
    answer:
      'Many standard policies cap room rent at 1% of the sum insured (e.g., ₹5,000/day on a ₹5 Lakh policy). If you choose a room costing ₹10,000/day, the insurer applies a "proportionate deduction" across the entire hospital bill — cutting surgeon fees, OT charges, and nursing costs by 50%! KNAPS strictly recommends choosing plans with "No Room Rent Capping" so you can select private AC rooms without proportionate financial penalties.'
  },
  {
    id: 4,
    question: 'What is the difference between Cashless Hospitalization and Reimbursement claims?',
    answer:
      'In a Cashless claim, you present your health e-card at any of the insurer’s 14,000+ network hospitals. The hospital desk sends pre-authorization documents to the insurer/TPA, and upon approval, the insurer settles eligible expenses directly with the hospital. In a Reimbursement claim (used if you choose a non-network hospital), you pay the hospital upfront, collect all original discharge summaries, bills, and prescriptions, and submit them for reimbursement.'
  },
  {
    id: 5,
    question: 'How does the Automatic Restoration of Sum Insured benefit work?',
    answer:
      'Automatic Restoration (or Recharge) refills 100% of your sum insured if it is partially or completely exhausted by claims in a single policy year. For example, if you have a ₹10 Lakh policy and claim ₹10 Lakh in May, your cover is automatically restored back to ₹10 Lakh for any subsequent hospitalization (for unrelated illnesses or for other family members on a floater policy) during the same policy year.'
  },
  {
    id: 6,
    question: 'How much tax can I save under Section 80D of the Income Tax Act?',
    answer:
      'Under Section 80D, you can claim a deduction of up to ₹25,000 for premiums paid for yourself, spouse, and dependent children (up to ₹50,000 if you are a senior citizen). Additionally, you can claim up to ₹50,000 for premiums paid for senior citizen parents. This allows an aggregate deduction of up to ₹75,000 to ₹1,00,000 per financial year, resulting in tax savings of up to ₹31,200 in the 30% tax bracket.'
  }
];

export default function HealthInsuranceFAQ() {
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
            Everything you need to know about waiting periods, cashless admissions, room-rent clauses, and Section 80D tax deductions.
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
