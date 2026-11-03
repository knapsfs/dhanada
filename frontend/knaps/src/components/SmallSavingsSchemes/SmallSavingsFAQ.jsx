import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

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
  },
  {
    id: 7,
    question: "What is the minimum deposit required to open a Post Office Recurring Deposit (PORD)?",
    answer: "You can start a Post Office Recurring Deposit (PORD) with as little as ₹100 per month (in multiples of ₹10), with no upper limit. It runs for 5 years (60 installments) and compounds quarterly at 6.7% p.a., with up to 50% loan facility after 1 year."
  },
  {
    id: 8,
    question: "Is TDS (Tax Deducted at Source) deducted on Post Office scheme maturity?",
    answer: "The Department of Posts generally does NOT deduct TDS on interest paid or accumulated on POTD, KVP, NSC, or PORD. However, the interest earned is taxable under 'Income from Other Sources' at your applicable slab rate, and depositors are responsible for reporting it in their annual Income Tax Returns."
  },
  {
    id: 9,
    question: "Can I transfer my Post Office deposit if I relocate to another city?",
    answer: "Yes. All Post Office accounts and certificates can be transferred smoothly from one post office to any other post office across India by submitting a transfer application at either the originating or destination post office branch."
  },
  {
    id: 10,
    question: "Can NRIs invest in Post Office Small Savings Schemes?",
    answer: "No. Non-Resident Indians (NRIs) are not eligible to open new POTD, KVP, NSC, or PORD accounts. If a resident opens an account and subsequently acquires NRI status, the account can continue until maturity on a non-repatriable basis but cannot be renewed or extended."
  }
];

const SmallSavingsFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="small-savings-faq" className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Frequently Asked <span className="text-[#032e92]">Questions</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5">
            Clear, transparent answers about our 4 core Post Office small savings schemes: POTD, KVP, NSC, and PORD.
          </p>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-base font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'bg-[#032e92] text-white rotate-180' : 'bg-slate-100 text-slate-600'
                      }`}
                  >
                    <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SmallSavingsFAQ;
