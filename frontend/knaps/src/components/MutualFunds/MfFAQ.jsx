import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faCircleQuestion,
  faHeadset,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { MF_FAQS } from '../../data/mutualFundsData';
import { useLeadModal } from '../../context/LeadModalContext';

export default function MfFAQ() {
  const [openIndex, setOpenIndex] = useState(0); // first item open by default
  const { openLeadModal } = useLeadModal();

  const toggleIndex = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqs = MF_FAQS.slice(0, 6);
  const leftFaqs = faqs.slice(0, 3);
  const rightFaqs = faqs.slice(3, 6);

  const renderFaqCard = (faq, index) => {
    const isOpen = openIndex === index;
    return (
      <div
        key={index}
        className={`rounded-2xl border transition-all duration-200 bg-white ${isOpen ? 'border-[#032e92]/30 shadow-md shadow-blue-900/5' : 'border-slate-200 hover:border-slate-300'
          }`}
      >
        <button
          type="button"
          onClick={() => toggleIndex(index)}
          className="w-full py-5 px-6 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <span className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {faq.q}
          </span>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 mt-0.5 ${isOpen ? 'bg-[#032e92] text-white rotate-180' : 'bg-slate-100 text-slate-600'
              }`}
          >
            <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 whitespace-pre-line font-normal">
                {faq.a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section id="mf-faq" className="py-20 lg:py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Frequently Asked <span className="text-[#032e92]">Questions</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5">
            Everything you need to know about starting, managing, and optimizing your mutual fund investments.
          </p>
        </div>

        {/* 2-Column Accordion Grid: 3 on left, 3 on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column (3 FAQs) */}
          <div className="space-y-4">
            {leftFaqs.map((faq, idx) => renderFaqCard(faq, idx))}
          </div>

          {/* Right Column (3 FAQs) */}
          <div className="space-y-4">
            {rightFaqs.map((faq, idx) => renderFaqCard(faq, idx + 3))}
          </div>
        </div>

        {/* Bottom Help Card */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#f8fbff] border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faHeadset} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Still have questions about mutual funds?</div>
              <div className="text-xs text-slate-500">Our financial experts are ready to assist you anytime.</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openLeadModal('Mutual Funds: FAQ Consultation')}
            className="px-5 py-2.5 rounded-xl bg-[#032e92] text-white text-xs sm:text-sm font-bold hover:bg-[#021d63] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs flex-shrink-0"
          >
            <span>Ask a Specialist</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
