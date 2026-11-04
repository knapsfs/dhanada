import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const faqs = [
  {
    id: 1,
    question: 'How safe are Fixed Deposits and Government of India (GoI) Bonds?',
    answer:
      'Government of India (GoI) Bonds carry an absolute 100% sovereign guarantee backed by the Reserve Bank of India, meaning there is zero default or credit risk on both principal and interest. Bank Fixed Deposits are insured by the DICGC (a subsidiary of RBI) up to ₹5,00,000 per depositor per bank. Corporate/NBFC FDs are uninsurable under DICGC and rely on issuer balance sheet strength, which is why KNAPS curates only AAA/AA rated corporate issuers.'
  },
  {
    id: 2,
    question: 'What are RBI Floating Rate Savings Bonds (FRSB 2020) and how is the yield calculated?',
    answer:
      'RBI Floating Rate Savings Bonds are 7-year sovereign debt instruments issued by RBI. The coupon rate is floating and linked to the prevailing National Savings Certificate (NSC) rate with an additional spread of 35 bps. The coupon resets semi-annually (currently 8.05% p.a.). Interest is paid every 6 months directly into your bank account on January 1st and July 1st.'
  },
  {
    id: 3,
    question: 'How do Corporate / NBFC Fixed Deposits differ from Bank Fixed Deposits?',
    answer:
      'Corporate FDs are term deposits placed with financial institutions and manufacturing companies (such as Bajaj Finance, Mahindra Finance, HDFC). They typically offer 0.50% to 1.50% higher interest rates than traditional banks to reward investors for taking moderate credit risk. We strictly recommend only top-rated AAA/AA options with a proven track record of timely interest payments.'
  },
  {
    id: 4,
    question: 'How do Section 54EC Bonds help save tax on real estate and property sales?',
    answer:
      'Under Section 54EC of the Income Tax Act, individuals who have realized Long Term Capital Gains (LTCG) from the sale of land or building can invest up to ₹50 Lakhs into eligible bonds (issued by REC, PFC, IRFC, and NHAI) within 6 months of the sale date. The invested amount is 100% exempt from capital gains tax, and the bonds pay an assured 5.25% annual interest over a 5-year lock-in period.'
  },
  {
    id: 5,
    question: 'What are Sovereign Gold Bonds (SGB) and what makes them unique?',
    answer:
      'Sovereign Gold Bonds are government securities denominated in grams of 24K gold issued by the RBI. They provide dual benefits: a fixed cash interest of 2.50% per annum paid semi-annually, plus complete capital appreciation matching physical gold prices. Most importantly, redemption at the end of the 8-year maturity is 100% tax-free under Section 47.'
  },
  {
    id: 6,
    question: 'Can I withdraw my Fixed Deposit or GoI Bond before maturity?',
    answer:
      'For Bank FDs, premature withdrawal is permitted subject to a minor penal interest reduction of 0.5% to 1.0% (except 5-year Tax Saving FDs which have a strict statutory lock-in). For RBI Floating Rate Savings Bonds, premature exit is not allowed for general investors, but is permitted for senior citizens: 4 years lock-in for ages 80+, 5 years for ages 70–80, and 6 years for ages 60–70. 54EC bonds have a non-negotiable 5-year lock-in.'
  }
];

export default function FixedDepositFAQ() {
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
            Get clear, factual answers to help you navigate Fixed Deposits and Government of India Bonds with complete confidence.
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
