import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faCircleQuestion,
  faShieldHalved,
  faMoneyBillTransfer,
  faBuildingColumns,
  faFileContract,
  faRotateRight,
  faHandHoldingDollar,
  faCoins
} from '@fortawesome/free-solid-svg-icons';

const faqs = [
  {
    id: 1,
    icon: faShieldHalved,
    category: 'Safety & Insurance',
    question: 'How safe is my Fixed Deposit? What is DICGC insurance coverage?',
    answer:
      'Deposits with all commercial and cooperative banks in India are insured by the Deposit Insurance and Credit Guarantee Corporation (DICGC), a wholly-owned subsidiary of the Reserve Bank of India (RBI). Each depositor is insured up to a maximum of ₹5,00,000 (including both principal and accrued interest) across all accounts held in the same bank and same capacity/right. Corporate FDs are NOT covered by DICGC and rely on credit ratings (such as CRISIL/ICRA AAA or AA).'
  },
  {
    id: 2,
    icon: faMoneyBillTransfer,
    category: 'Withdrawal & Liquidity',
    question: 'Can I break my Fixed Deposit before maturity? What is the penalty?',
    answer:
      'Yes, most regular bank and NBFC fixed deposits offer premature withdrawal facilities, subject to a penalty (typically between 0.5% and 1.0% deducted from the applicable interest rate for the period the deposit was actually held). Note that 5-Year Tax-Saving FDs under Section 80C have a statutory lock-in and cannot be withdrawn prematurely under any circumstance.'
  },
  {
    id: 3,
    icon: faBuildingColumns,
    category: 'Comparison',
    question: 'What is the difference between Bank FDs and Corporate/NBFC FDs?',
    answer:
      'Bank FDs are issued by scheduled commercial or cooperative banks, regulated by RBI, and insured up to ₹5 Lakh by DICGC. Corporate or Company FDs are issued by companies and non-banking financial companies (NBFCs). Corporate FDs often offer 1% to 2% higher interest rates to compensate for higher credit risk, carry credit ratings from agencies like CRISIL/ICRA, and are not covered under DICGC deposit insurance.'
  },
  {
    id: 4,
    icon: faFileContract,
    category: 'Taxation & TDS',
    question: 'How does TDS work on FD interest, and when should I submit Form 15G or 15H?',
    answer:
      'Under Section 194A, banks deduct Tax Deducted at Source (TDS) at 10% (20% without PAN) if total interest earned across the bank branches exceeds ₹40,000 in a financial year (₹50,000 for senior citizens). If your total estimated taxable income is below the basic exemption threshold, you can submit Form 15G (below age 60) or Form 15H (senior citizens) at the start of the financial year to request zero TDS.'
  },
  {
    id: 5,
    icon: faRotateRight,
    category: 'Tenure & Renewal',
    question: 'What happens when my Fixed Deposit matures? What is auto-renewal?',
    answer:
      'Upon maturity, if you selected auto-renewal at the time of opening, the principal (and accrued interest in cumulative deposits) automatically rolls over for the same tenure at the prevailing interest rate on the date of renewal. Alternatively, you can instruct the issuer to credit the proceeds directly to your linked savings bank account.'
  },
  {
    id: 6,
    icon: faHandHoldingDollar,
    category: 'Emergency Liquidity',
    question: 'Can I take a loan against my Fixed Deposit instead of breaking it?',
    answer:
      'Yes! Most banks permit depositors to borrow an overdraft or demand loan of up to 90% to 95% of the FD value. The loan interest rate is usually only 1% to 2% higher than the FD rate. Your FD continues to earn its contracted interest, making it an excellent alternative to breaking your deposit and forfeiting tenure benefits during short-term cash crunches.'
  },
  {
    id: 7,
    icon: faCoins,
    category: 'Interest Payout',
    question: 'Should I choose a Cumulative or Non-Cumulative Fixed Deposit?',
    answer:
      'Cumulative FDs reinvest interest quarterly, allowing you to benefit from compounding, making them ideal for long-term goal accumulation. Non-Cumulative FDs pay interest out periodically (monthly, quarterly, half-yearly, or annually), making them well-suited for retirees and individuals who require steady cash flow to meet regular living expenses.'
  }
];

const FixedDepositFAQ = () => {
  const [openId, setOpenId] = useState(1);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
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
            Clear, authoritative answers to help you navigate Fixed Deposit rules, DICGC safety, premature withdrawals, and tax declarations.
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
            Have questions regarding specific bank tenures, special senior citizen rate tranches, or corporate FD ratings?{' '}
            <span className="font-semibold text-[#032e92]">
              Our fixed income desk is here to assist you with unbiased issuer comparisons.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FixedDepositFAQ;
