import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faCircleQuestion,
  faShieldHalved,
  faAddressCard,
  faLayerGroup,
  faChartPie,
  faSliders,
  faCoins,
  faCalculator,
  faReceipt,
  faLock,
  faHandHoldingDollar,
  faScaleBalanced,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

const faqs = [
  {
    id: 1,
    icon: faShieldHalved,
    category: 'Fundamentals',
    question: 'What is the National Pension System (NPS)?',
    answer:
      'The National Pension System (NPS) is a government-sponsored, voluntary, defined-contribution retirement savings scheme regulated by the Pension Fund Regulatory and Development Authority (PFRDA). It allows Indian citizens to systematically accumulate retirement capital across equity and debt asset classes at ultra-low fund management fees.'
  },
  {
    id: 2,
    icon: faAddressCard,
    category: 'Eligibility',
    question: 'Who can open an NPS account?',
    answer:
      'Any Indian citizen—whether resident in India or Non-Resident Indian (NRI) / Overseas Citizen of India (OCI)—between the ages of 18 and 70 years as of the application date can open an individual NPS account. The account remains fully portable across employers, cities, and states throughout your lifetime.'
  },
  {
    id: 3,
    icon: faLayerGroup,
    category: 'Account Types',
    question: 'What is the difference between Tier I and Tier II accounts?',
    answer:
      'A Tier I account is the mandatory pension account that comes with statutory lock-in until age 60 and exclusive tax deduction benefits under Sections 80CCD(1), 80CCD(1B), and 80CCD(2). A Tier II account is an optional, companion liquid investment account that has zero lock-in and allows unrestricted anytime withdrawals, but does not carry tax deductions.'
  },
  {
    id: 4,
    icon: faChartPie,
    category: 'Mechanics',
    question: 'How does NPS investment work?',
    answer:
      'When you contribute to your PRAN, the funds are handed over to your chosen PFRDA-registered Pension Fund Manager (PFM). The PFM invests your money according to your selected asset allocation across equities, corporate bonds, and government debt. You are allocated units at the prevailing Net Asset Value (NAV), which compounds over your working horizon.'
  },
  {
    id: 5,
    icon: faSliders,
    category: 'Investment Strategy',
    question: 'What are Active Choice and Auto Choice?',
    answer:
      'Under Active Choice, you decide your own asset allocation percentages across Equity (E), Corporate Debt (C), Government Securities (G), and Alternatives (A), with equity capped at 75% up to age 50. Under Auto Choice, the system automatically allocates your money into a pre-defined Lifecycle Fund (LC75, LC50, or LC25), automatically reducing equity exposure as you grow older.'
  },
  {
    id: 6,
    icon: faCoins,
    category: 'Asset Classes',
    question: 'What are E, C, G, and A asset classes in NPS?',
    answer:
      'Asset Class E (Equity) invests in high-liquidity large-cap index stocks for long-term capital growth; Asset Class C (Corporate Debt) invests in rated corporate bonds and debentures; Asset Class G (Government Securities) invests in Central and State government dated securities and treasury bills; Asset Class A (Alternative Assets) permits up to 5% allocation in REITs, InvITs, and AIFs.'
  },
  {
    id: 7,
    icon: faCalculator,
    category: 'Tools',
    question: 'How does the NPS calculator work?',
    answer:
      'The NPS calculator utilizes the compound interest formula on monthly contribution streams over the tenure between your current age and planned retirement age. Based on your assumed rate of return and annuity allocation percentage, it projects your total contributions, compound wealth growth, final accumulated corpus, 60% tax-free lump-sum exit, and lifelong monthly pension.'
  },
  {
    id: 8,
    icon: faReceipt,
    category: 'Taxation',
    question: 'Are NPS contributions eligible for tax benefits?',
    answer:
      'Yes! NPS Tier I contributions qualify for deductions under Section 80CCD(1) (up to ₹1.5 Lakh within the 80C limit), an exclusive additional deduction of up to ₹50,000 under Section 80CCD(1B) (available over and above Section 80C), and employer contributions under Section 80CCD(2) up to 10% of salary (14% for government employees).'
  },
  {
    id: 9,
    icon: faLock,
    category: 'Withdrawals',
    question: 'Can NPS money be withdrawn before retirement?',
    answer:
      'Partial withdrawals of up to 25% of your own contributions are permitted after completing 3 years of membership for specific emergencies (higher education, child marriage, purchase of first home, or critical illness) up to 3 times during the tenure. Voluntary complete premature exit before 60 is allowed after 10 years, requiring at least 80% of the corpus to be converted into an annuity.'
  },
  {
    id: 10,
    icon: faHandHoldingDollar,
    category: 'Exit & Maturity',
    question: 'What happens to the NPS corpus at retirement (Age 60)?',
    answer:
      'Upon reaching age 60, you can withdraw up to 60% of your total accumulated corpus as a 100% tax-free lump sum under Section 10(12A). A minimum of 40% must be utilized to purchase an annuity plan from a PFRDA-empanelled Annuity Service Provider. If the total corpus is ₹5 Lakh or less, you can withdraw 100% as a lump sum.'
  },
  {
    id: 11,
    icon: faScaleBalanced,
    category: 'Annuity',
    question: 'What is an annuity in NPS?',
    answer:
      'An annuity is a contractual financial product issued by a licensed life insurance company (Annuity Service Provider) that converts your lump-sum capital into a guaranteed, regular monthly, quarterly, or annual pension payout for the rest of your lifetime, with options for spouse coverage and return of purchase price.'
  },
  {
    id: 12,
    icon: faTriangleExclamation,
    category: 'Returns & Risk',
    question: 'Are NPS returns guaranteed?',
    answer:
      'No. NPS returns are market-linked and not guaranteed by the Government of India or PFRDA. Returns depend entirely on the performance of underlying securities in the equity, corporate bond, and government security markets managed by your chosen Pension Fund Manager.'
  }
];

export default function NpsFAQ() {
  const [openId, setOpenId] = useState(1);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faCircleQuestion} />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Frequently Asked Questions on NPS
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Authoritative, transparent answers to help you navigate National Pension System rules, asset choices, tax deductions, and retirement withdrawals.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#032e92]/30 bg-gradient-to-r from-blue-50/40 via-white to-indigo-50/30 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-[#032e92] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <FontAwesomeIcon icon={faq.icon} className="text-sm" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600 block mb-0.5">
                        {faq.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'rotate-180 bg-[#032e92]/10 text-[#032e92]'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="mt-12 p-6 rounded-2xl bg-[#f7f9fc] border border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            Have questions regarding PRAN generation, Corporate NPS employer onboarding, or choosing between Pension Fund Managers?{' '}
            <span className="font-semibold text-[#032e92]">
              Our certified retirement desk is available to assist you.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
