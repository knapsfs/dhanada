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

  return (
    <section id="mf-faq" className="py-20 lg:py-24 bg-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faCircleQuestion} className="text-[#2490ef]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#032e92] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            Everything you need to know about starting, managing, and optimizing your mutual fund investments.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {MF_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-[#032e92] text-white rotate-180' : 'bg-slate-100 text-slate-600'
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
          })}
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
            <span>Ask an Advisor</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
