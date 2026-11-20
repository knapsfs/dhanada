import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const faqs = [
  {
    id: 1,
    question: "How much life insurance cover do I realistically need?",
    answer:
      "As a thumb rule, your life cover should be at least 15 to 20 times your current annual take-home income, plus any outstanding debts (such as home or vehicle loans), plus a dedicated fund for future child milestones, minus existing liquid investments. You can use our interactive Life Insurance Calculator above to get your personalized Human Life Value (HLV)."
  },
  {
    id: 2,
    question: "What is the key difference between Term Insurance and traditional Endowment/ULIP plans?",
    answer:
      "Term Insurance is pure risk protection: you pay a very low premium for a very large sum assured (e.g. ₹1 Cr for ~₹500/mo), with zero maturity benefit unless a death occurs. Endowment and ULIP plans combine savings or investment with life cover, but charge significantly higher premiums for a smaller life cover. We generally recommend buying a pure term plan for high cover and investing the remaining surplus in mutual funds or SIF for superior wealth creation."
  },
  {
    id: 3,
    question: "What happens if I outlive my term insurance policy period?",
    answer:
      "In a standard pure term insurance plan, no payout is made if you survive the policy tenure, as the policy served its purpose of shielding your family during your peak financial vulnerability years. However, you can opt for a 'Term Plan with Return of Premium' (TROP), where the insurer refunds 100% of all premiums paid (excluding taxes) upon surviving the tenure."
  },
  {
    id: 4,
    question: "Can smokers or individuals with hypertension / diabetes get life cover?",
    answer:
      "Yes. Smokers and individuals with pre-existing conditions like diabetes, thyroid, or hypertension can readily obtain life insurance. The insurer may charge a modest premium loading or request standard medical tests. It is critically important to declare all medical history transparently at the time of proposal to ensure 100% claim settlement guarantee later."
  },
  {
    id: 5,
    question: "What is the Married Women's Property (MWP) Act endorsement?",
    answer:
      "The MWP Act (Section 6) allows a married man to ring-fence his life insurance policy exclusively for his wife and children. Once endorsed, no creditors, business lenders, court attachments, or relatives can claim the policy death benefit, ensuring your family receives every rupee even if you face business insolvency."
  },
  {
    id: 6,
    question: "What tax benefits apply to life insurance in India?",
    answer:
      "Under Section 80C of the Income Tax Act, premiums paid up to ₹1.5 Lakh per financial year are tax-deductible. If you add critical illness riders, the rider premium qualifies for deduction under Section 80D up to ₹25,000. Furthermore, under Section 10(10D), any death benefit or qualifying maturity payout is 100% completely tax-free in the hands of the nominee."
  }
];

export default function LifeInsuranceFAQ() {
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
            Everything you need to know about life cover, policy structures, claims, and tax rules.
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
