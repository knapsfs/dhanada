import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const faqs = [
  {
    id: 1,
    question: 'What is the National Pension System (NPS)?',
    answer:
      'The National Pension System (NPS) is a government-sponsored, voluntary, defined-contribution retirement savings scheme regulated by the Pension Fund Regulatory and Development Authority (PFRDA). It allows Indian citizens to systematically accumulate retirement capital across equity and debt asset classes at ultra-low fund management fees.'
  },
  {
    id: 2,
    question: 'Who can open an NPS account?',
    answer:
      'Any Indian citizen—whether resident in India or Non-Resident Indian (NRI) / Overseas Citizen of India (OCI)—between the ages of 18 and 70 years as of the application date can open an individual NPS account. The account remains fully portable across employers, cities, and states throughout your lifetime.'
  },
  {
    id: 3,
    question: 'What is the difference between Tier I and Tier II accounts?',
    answer:
      'A Tier I account is the mandatory pension account that comes with statutory lock-in until age 60 and exclusive tax deduction benefits under Sections 80CCD(1), 80CCD(1B), and 80CCD(2). A Tier II account is an optional, companion liquid investment account that has zero lock-in and allows unrestricted anytime withdrawals, but does not carry tax deductions.'
  },
  {
    id: 4,
    question: 'How does NPS investment work?',
    answer:
      'Your monthly or periodic contributions are invested across pension funds according to your chosen asset allocation. The funds compound over time until maturity, building a dedicated corpus for your retirement.'
  },
  {
    id: 5,
    question: 'What are Active Choice and Auto Choice?',
    answer:
      'Under Active Choice, you decide your own asset allocation percentages across Equity (E), Corporate Debt (C), Government Securities (G), and Alternatives (A), with equity capped at 75% up to age 50. Under Auto Choice, the system automatically allocates your money into a pre-defined Lifecycle Fund (LC75, LC50, or LC25), automatically reducing equity exposure as you grow older.'
  },
  {
    id: 6,
    question: 'What are E, C, G, and A asset classes in NPS?',
    answer:
      'Asset Class E (Equity) invests in high-liquidity large-cap index stocks for long-term capital growth; Asset Class C (Corporate Debt) invests in rated corporate bonds and debentures; Asset Class G (Government Securities) invests in Central and State government dated securities and treasury bills; Asset Class A (Alternative Assets) permits up to 5% allocation in REITs, InvITs, and AIFs.'
  },
  {
    id: 7,
    question: 'How does the NPS calculator work?',
    answer:
      'The NPS calculator utilizes the compound interest formula on monthly contribution streams over the tenure between your current age and planned retirement age. Based on your assumed rate of return and annuity allocation percentage, it projects your total contributions, compound wealth growth, final accumulated corpus, tax-free lump-sum exit, and lifelong monthly pension.'
  },
  {
    id: 8,
    question: 'Are NPS contributions eligible for tax benefits?',
    answer:
      'Yes! NPS Tier I contributions qualify for deductions under Section 80CCD(1) (up to ₹1.5 Lakh within the 80C limit), an exclusive additional deduction of up to ₹50,000 under Section 80CCD(1B) (available over and above Section 80C), and employer contributions under Section 80CCD(2) up to 10% of salary (14% for government employees).'
  },
  {
    id: 9,
    question: 'Can NPS money be withdrawn before retirement?',
    answer:
      'Partial withdrawals of up to 25% of your own contributions are permitted after completing 3 years of membership for specific emergencies (higher education, child marriage, purchase of first home, or critical illness) up to 3 times during the tenure. Voluntary complete premature exit before 60 is allowed after 10 years, requiring at least 80% of the corpus to be converted into an annuity.'
  },
  {
    id: 10,
    question: 'What happens to the NPS corpus at retirement (Age 60)?',
    answer:
      'Upon reaching age 60, you can withdraw up to 60% of your total accumulated corpus as a 100% tax-free lump sum under Section 10(12A). A minimum of 40% must be utilized to purchase an annuity plan from a PFRDA-empanelled Annuity Service Provider. If the total corpus is ₹5 Lakh or less, you can withdraw 100% as a lump sum.'
  },
  {
    id: 11,
    question: 'What is an annuity in NPS?',
    answer:
      'An annuity is a contractual financial product issued by a licensed life insurance company (Annuity Service Provider) that converts your lump-sum capital into a guaranteed, regular monthly, quarterly, or annual pension payout for the rest of your lifetime, with options for spouse coverage and return of purchase price.'
  },
  {
    id: 12,
    question: 'Are NPS returns guaranteed?',
    answer:
      'No. NPS returns are market-linked and not guaranteed by the Government of India or PFRDA. Returns depend entirely on the performance of underlying securities in the equity, corporate bond, and government security markets managed by your chosen Pension Fund Manager.'
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
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
          isOpen
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
            className={`text-[15px] md:text-[16px] font-bold transition-colors duration-300 ${
              isOpen ? 'text-[#032e92]' : 'text-slate-900'
            }`}
          >
            {faq.question}
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
