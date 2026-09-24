import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faCircleQuestion,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const faqs = [
  {
    question: 'How does the 3-year lock-in period work for SIP investments in ELSS?',
    answer: 'In an ELSS Systematic Investment Plan (SIP), each monthly installment is treated as an independent purchase with its own separate 36-month lock-in period. For example, if you start a monthly SIP in January 2025, the units purchased in January 2025 will unlock in January 2028; the units bought in February 2025 will unlock in February 2028, and so on. You cannot redeem the entire SIP portfolio at once after 3 years.'
  },
  {
    question: 'Can I claim Section 80C tax deductions under the New Tax Regime?',
    answer: 'No. The New Tax Regime (default tax regime under Section 115BAC) offers lower slab rates but does not allow most deductions, including Section 80C. To claim the tax deduction of up to ₹1,50,000 for your ELSS investments, you must actively choose the Old Tax Regime when filing your Income Tax Return.'
  },
  {
    question: 'How are capital gains from ELSS mutual funds taxed upon redemption?',
    answer: 'Since ELSS units are held for at least 3 years, all profits upon redemption are classified as Long-Term Capital Gains (LTCG). As per the Finance Act 2024, LTCG on equity mutual funds is completely tax-free up to ₹1.25 Lakh per financial year across all equity investments. Any capital gains exceeding ₹1.25 Lakh are taxed at a flat rate of 12.5% (plus applicable cess), without indexation benefits.'
  },
  {
    question: 'Is it mandatory to withdraw or redeem my ELSS units immediately after 3 years?',
    answer: 'No, not at all! The 3-year lock-in is merely a statutory minimum holding period. After 3 years, your ELSS units convert into regular open-ended equity mutual fund units with no exit load. You can continue holding them for 5, 10, or 15+ years to let long-term equity compounding continue unhindered.'
  },
  {
    question: 'Which option should I choose: Growth or IDCW (Dividend)?',
    answer: 'For most investors, the "Growth" option is strongly recommended because all returns and dividends remain reinvested inside the fund, harnessing the full power of compounding. Under the IDCW (Income Distribution cum Capital Withdrawal) option, declared dividends are added to your personal taxable income and taxed at your applicable income tax slab rate, which is often tax-inefficient.'
  },
  {
    question: 'Can I stop or pause my ELSS SIP before 3 years?',
    answer: 'Yes, you can stop or pause your future ELSS SIP installments at any time without paying any penalty. However, the installments you have already contributed will remain locked for 3 years from their respective allotment dates before they can be redeemed.'
  },
  {
    question: 'What is the minimum and maximum amount I can invest in ELSS?',
    answer: 'The minimum investment in ELSS is typically ₹500 for both SIP and lump-sum investments. There is no maximum ceiling on how much you can invest in an ELSS fund. However, the tax deduction under Section 80C is capped at a maximum of ₹1,50,000 per financial year. Any investment above ₹1.5 Lakh will still be invested in equities and locked for 3 years, but will not receive additional 80C tax deductions.'
  }
];

export default function ELSSFAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const { openLeadModal } = useLeadModal();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faCircleQuestion} className="text-[#032e92]" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Frequently Asked Questions on{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              ELSS Mutual Funds
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Essential answers on SIP lock-in tracking, 12.5% LTCG capital gains tax, Old vs New tax regime choices, and redemption rules.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#f7f9fc] rounded-2xl border border-gray-200/80 shadow-xs hover:border-blue-200 transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-[#0a192f] pr-2">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#032e92] flex-shrink-0 transition-transform duration-300 shadow-xs ${
                      isOpen ? 'rotate-180 bg-[#032e92] text-white' : ''
                    }`}
                  >
                    <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-gray-200/60 bg-white">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Prompt */}
        <div className="mt-12 bg-[#f7f9fc] rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md text-center flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-bold text-[#0a192f]">Have a question on fund selection or tax regime choices?</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Our AMFI certified mutual fund distributors provide unbiased portfolio reviews.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => openLeadModal({ title: 'Ask ELSS Question', defaultService: 'ELSS' })}
              className="btn-ripple px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Ask an Advisor
            </button>
            <a
              href="tel:+918080808080"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#032e92] bg-white border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <FontAwesomeIcon icon={faPhone} className="text-xs" />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
