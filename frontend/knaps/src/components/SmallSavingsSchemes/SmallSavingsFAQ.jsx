import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMinus,
  faHeadset,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const FAQS = [
  {
    id: 1,
    question: "Which Post Office Small Savings Schemes does KNAPS assist with?",
    answer: "KNAPS specializes in 4 premier government-backed Post Office schemes: (1) Post Office Time Deposit (POTD - 1, 2, 3, and 5 Years); (2) Kisan Vikas Patra (KVP - guaranteed capital doubling); (3) National Savings Certificate (NSC - 5-Year Sec 80C tax-saving); and (4) Post Office Recurring Deposit (PORD - 5-Year monthly savings habit)."
  },
  {
    id: 2,
    question: "Are Post Office Small Savings Schemes 100% safe?",
    answer: "Yes, absolutely. All four Post Office small savings schemes carry the direct sovereign guarantee of the Government of India. The deposits are managed under the National Small Savings Fund (NSSF) by the Ministry of Finance, making them free of private commercial bank default risks and not subject to the standard ₹5 Lakh DICGC limitation."
  },
  {
    id: 3,
    question: "How does the National Savings Certificate (NSC) save income tax under Section 80C?",
    answer: "Under the Old Tax Regime, principal investments up to ₹1.5 Lakh per financial year in NSC qualify for tax deduction under Section 80C. Furthermore, the interest accrued each year for the first 4 years is deemed reinvested and also qualifies for fresh Section 80C deductions (subject to the ₹1.5L cap)."
  },
  {
    id: 4,
    question: "How does Kisan Vikas Patra (KVP) double my investment?",
    answer: "Kisan Vikas Patra is specifically structured to double your lump-sum deposit over a notified tenure. At the current government-notified interest rate of 7.5% p.a., your investment doubles in 115 months (9 years and 7 months). Premature encashment is permitted anytime after completing 30 months (2.5 years)."
  },
  {
    id: 5,
    question: "Does the 5-Year Post Office Time Deposit (POTD) qualify for Section 80C?",
    answer: "Yes. While 1-year, 2-year, and 3-year POTDs do NOT qualify for tax deductions, the 5-Year Post Office Time Deposit specifically qualifies for tax deduction up to ₹1.5 Lakh per year under Section 80C of the Income Tax Act."
  },
  {
    id: 6,
    question: "Can the interest rate on my POTD, KVP, or NSC change after I deposit?",
    answer: "No. For POTD, KVP, NSC, and PORD, the interest rate prevailing on your date of deposit is locked in for the entire duration of that deposit. Even if the Ministry of Finance reduces notified rates in subsequent quarters, your deposit continues to earn the original locked-in rate until maturity."
  }
];

export default function SmallSavingsFAQ() {
  const [openId, setOpenId] = useState(1);
  const { openLeadModal } = useLeadModal();

  const toggleFAQ = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const mid = Math.ceil(FAQS.length / 2);
  const leftFaqs = FAQS.slice(0, mid);
  const rightFaqs = FAQS.slice(mid);

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
    <section id="small-savings-faq" className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Frequently Asked <span className="text-[#032e92]">Questions</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5">
            Clear, transparent answers about our core Post Office small savings schemes: POTD, KVP, NSC, and PORD.
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

        {/* Bottom Help Card */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#f8fbff] border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faHeadset} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Still have questions about Post Office Schemes?</div>
              <p className="text-xs text-slate-600 mt-0.5">Connect with our specialists for tailored guidance on POTD, KVP, NSC, and PORD.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              openLeadModal({
                title: 'Post Office Schemes Consultation',
                defaultService: 'Post Office Small Savings Schemes'
              })
            }
            className="px-5 py-2.5 rounded-xl bg-[#032e92] text-white text-xs sm:text-sm font-bold hover:bg-[#021d63] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
          >
            <span>Ask a Specialist</span>
            {/* <FontAwesomeIcon icon={faArrowRight} className="text-xs" /> */}
          </button>
        </div>
      </div>
    </section>
  );
}
