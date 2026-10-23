import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faCircleQuestion,
  faCalendarXmark,
  faMoneyBillTransfer,
  faCalculator,
  faShieldHalved,
  faSliders,
  faScaleBalanced,
  faPersonWalkingWithCane
} from '@fortawesome/free-solid-svg-icons';

const faqs = [
  {
    id: 1,
    icon: faCalendarXmark,
    category: 'Installments & Default',
    question: 'What happens if I miss a monthly RD installment? Is there a penalty?',
    answer:
      'Yes. If your savings bank account lacks sufficient funds on the scheduled auto-debit date, banks provide a grace window (usually until the month-end), after which a small delayed payment penalty is charged (typically ₹1.50 to ₹2.00 per ₹100 of installment per month). If installments remain unpaid for 4 to 6 consecutive months, banks reserve the right to prematurely terminate the RD account and credit the net proceeds to your savings account.'
  },
  {
    id: 2,
    icon: faMoneyBillTransfer,
    category: 'Liquidity & Premature Exit',
    question: 'Can I withdraw or break my Recurring Deposit before the maturity date?',
    answer:
      'Yes, premature closure of an RD is permissible at any point, subject to a premature penalty. The bank calculates interest only for the actual tenure the deposit was held, and typically deducts an interest penalty of 0.5% to 1.0% from that applicable rate. Most banks also mandate a minimum initial holding period (often 14 to 30 days) before any interest is payable.'
  },
  {
    id: 3,
    icon: faCalculator,
    category: 'Interest Computation',
    question: 'How is interest calculated on a Recurring Deposit in Indian banks?',
    answer:
      'As per Indian Banks’ Association (IBA) regulations, interest on recurring deposits is compounded on a quarterly basis. Each monthly installment earns interest for the exact remaining duration it resides in the account until maturity. For example, in a 12-month RD, the 1st installment earns interest for 12 months, the 2nd for 11 months, and so on, with compounding applied at the end of each calendar quarter.'
  },
  {
    id: 4,
    icon: faShieldHalved,
    category: 'Safety & Insurance',
    question: 'Is my money in a Recurring Deposit protected by DICGC insurance?',
    answer:
      'Yes. Recurring Deposits held with scheduled commercial banks, small finance banks, and eligible cooperative banks are fully covered by the Deposit Insurance and Credit Guarantee Corporation (DICGC), an RBI subsidiary. The insurance protects cumulative deposits (combining savings, FDs, and RDs) up to ₹5,00,000 per depositor per bank in the same capacity.'
  },
  {
    id: 5,
    icon: faSliders,
    category: 'Flexibility & Changes',
    question: 'Can I increase or decrease the monthly deposit amount after opening an RD?',
    answer:
      'For standard regular RDs, the monthly installment amount is fixed at inception and cannot be modified mid-tenure. If you wish to deposit more, you can open an additional separate RD. Alternatively, you can opt for a ‘Flexi RD’ or ‘Smart RD’ at the outset, which allows you to deposit a baseline core installment plus flexible surplus top-ups in bonus months.'
  },
  {
    id: 6,
    icon: faScaleBalanced,
    category: 'Product Comparison',
    question: 'How does an RD differ from a Mutual Fund SIP?',
    answer:
      'An RD is a fixed-income banking contract that offers absolute capital stability and a guaranteed, predetermined interest rate regardless of economic market conditions. A Mutual Fund SIP invests your monthly contribution into equity or debt market instruments, carrying market risk and NAV volatility in exchange for the potential of higher, inflation-beating capital compounding over long horizons.'
  },
  {
    id: 7,
    icon: faPersonWalkingWithCane,
    category: 'Senior Citizens',
    question: 'Are senior citizens entitled to higher interest rates on Recurring Deposits?',
    answer:
      'Yes! Most scheduled banks in India offer senior citizens (individuals aged 60 years and above) an additional interest spread of 0.50% to 0.75% per annum over and above the standard card rates for all RD tenures, accelerating quarterly compound wealth accumulation.'
  }
];

export default function RecurringDepositFAQ() {
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
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Clear, authoritative answers to help you navigate Recurring Deposit rules, missed installment policies, DICGC coverage, and compounding mechanisms.
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
            Have questions about a specific bank's RD tenures or setting up an automated monthly standing instruction?{' '}
            <span className="font-semibold text-[#032e92]">
              Our savings advisory team is available to assist you with unbiased guidance.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
