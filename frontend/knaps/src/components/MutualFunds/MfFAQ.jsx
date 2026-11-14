import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMinus,
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

  const mid = Math.ceil(MF_FAQS.length / 2);
  const leftFaqs = MF_FAQS.slice(0, mid);
  const rightFaqs = MF_FAQS.slice(mid);

  const renderFaqItem = (faq, index) => {
    const isOpen = openIndex === index;

    return (
      <div
        key={index}
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
          isOpen
            ? 'border-[#032e92] bg-white shadow-lg shadow-blue-900/5'
            : 'border-slate-100 bg-[#f8fafc] hover:bg-white hover:border-slate-200'
        }`}
      >
        <button
          type="button"
          onClick={() => toggleIndex(index)}
          className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
          aria-expanded={isOpen}
        >
          <span
            className={`text-[15px] md:text-[16px] font-bold transition-colors duration-300 ${
              isOpen ? 'text-[#032e92]' : 'text-slate-900'
            }`}
          >
            {faq.q}
          </span>
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isOpen
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
              <div className="px-6 pb-6 pt-2 text-[14px] md:text-[15px] text-slate-600 leading-relaxed border-t border-slate-100/70 mt-1 whitespace-pre-line">
                {faq.a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section id="mf-faq" className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Frequently Asked <span className="text-[#032e92]">Questions</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5">
            Everything you need to know about starting, managing, and optimizing your mutual fund investments.
          </p>
        </div>

        {/* 2-Column Split FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 items-start">
          {/* Left Column */}
          <div className="space-y-4">
            {leftFaqs.map((faq, idx) => renderFaqItem(faq, idx))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {rightFaqs.map((faq, idx) => renderFaqItem(faq, idx + mid))}
          </div>
        </div>

        {/* Bottom Help Card */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#f8fbff] border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faHeadset} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Still have questions about mutual funds?</div>
              <p className="text-xs text-slate-600 mt-0.5">Connect with our AMFI-registered mutual fund distributors for personalized portfolio guidance.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openLeadModal('Mutual Funds: FAQ Consultation')}
            className="px-5 py-2.5 rounded-xl bg-[#032e92] text-white text-xs sm:text-sm font-bold hover:bg-[#021d63] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <span>Ask a Specialist</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
