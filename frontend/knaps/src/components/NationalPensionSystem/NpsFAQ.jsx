import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const faqs = [
  {
    id: 1,
    question: 'Who can open an NPS account?',
    answer:
      'Any Indian citizen, including NRIs and OCIs, between 18 and 85 years can open an NPS account, subject to KYC requirements.'
  },
  {
    id: 2,
    question: 'Can I withdraw my NPS money before retirement?',
    answer:
      'Yes. partial withdrawals are allowed up to 25% of own contributions for specified purposes. Premature exit is also allowed, subject to NPS rules, with up to 20% as lump sum and at least 80% in annuity.'
  },
  {
    id: 3,
    question: 'Can NPS Vatsalya and Sukanya Samriddhi Yojana be held together?',
    answer:
      'Yes. An NPS Vatsalya account may be opened irrespective of whether the child has a Sukanya Samriddhi Yojana account, scholarships or other benefits from the Central or State Government, subject to the respective scheme rules.'
  },
  {
    id: 4,
    question: 'What happens if the guardian dies in case of NPS Vatsalya?',
    answer:
      'A new guardian must be registered by submitting the necessary KYC documents. If both parents predecease the subscriber, a legally appointed guardian may continue the account with or without further contributions, subject to applicable provisions.'
  },
  {
    id: 5,
    question: 'Is NPS only for salaried employees?',
    answer:
      'No. Salaried employees, self-employed individuals and other eligible citizens can invest in NPS.'
  },
  {
    id: 6,
    question: 'Is NPS a government scheme?',
    answer:
      'Yes. NPS is regulated by the Pension Fund Regulatory and Development Authority (PFRDA).'
  }
];

export default function NpsFAQ() {
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
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#032e92] text-xs font-semibold tracking-wider uppercase mb-3">
            FAQ
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight">
            Frequently Asked <span className="text-[#032e92]">Questions</span>
          </h2>
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
