import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCircleQuestion,
  faChevronDown,
  faMagnifyingGlass,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

const SmallSavingsFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqs = [
    {
      id: 1,
      category: "overview",
      question: "What are Small Savings Schemes?",
      answer: "Small Savings Schemes are government-backed savings instruments managed by the Ministry of Finance and administered through India Post (Department of Posts) and designated commercial banks. Designed to encourage disciplined personal savings and mobilize domestic capital, they offer sovereign security, structured returns, and diverse tenures ranging from 1 to 21 years."
    },
    {
      id: 2,
      category: "schemes",
      question: "Which schemes are available under this category?",
      answer: "The government offers 9 distinct small savings instruments categorized into three groups: (1) Long-Term & Retirement: Public Provident Fund (PPF) and Sukanya Samriddhi Yojana (SSY); (2) Income-Focused: Senior Citizen Savings Scheme (SCSS) and Post Office Monthly Income Scheme (POMIS); and (3) Fixed & Recurring Savings: National Savings Certificate (NSC), Kisan Vikas Patra (KVP), Mahila Samman Savings Certificate (MSSC), Post Office Time Deposit (POTD), and Post Office Recurring Deposit (PORD)."
    },
    {
      id: 3,
      category: "security",
      question: "Are Small Savings Schemes backed by the government?",
      answer: "Yes. Small Savings Schemes carry sovereign backing directly from the Government of India. The funds are deposited into the National Small Savings Fund (NSSF) managed by the Ministry of Finance. Consequently, principal capital and accrued interest carry the highest degree of safety without the standard ₹5 Lakh DICGC limit applicable to commercial bank deposits."
    },
    {
      id: 4,
      category: "interest",
      question: "How are interest rates determined for Small Savings Schemes?",
      answer: "Small savings interest rates are benchmarked against secondary market yields of government securities (G-secs) of comparable tenures, using a formula recommended by the Shyamala Gopinath Committee. The Ministry of Finance conducts a quarterly review and notifies applicable rates before the beginning of each financial quarter (April-June, July-September, October-December, January-March)."
    },
    {
      id: 5,
      category: "interest",
      question: "Can interest rates change after I invest?",
      answer: "It depends on the scheme structure: (1) Floating Rate Schemes: In PPF and SSY, any quarterly rate revision applies across all existing and new accounts for that quarter. (2) Fixed-at-Deposit Schemes: In NSC, KVP, POTD, MSSC, and SCSS, the interest rate prevailing on your date of deposit remains locked in for the entire tenure of that specific deposit, protecting you against future rate cuts during your tenure."
    },
    {
      id: 6,
      category: "tax",
      question: "Which schemes offer tax benefits under Section 80C?",
      answer: "Under the Old Tax Regime, principal investments up to ₹1.5 Lakh per financial year qualify for tax deduction under Section 80C in: PPF (Public Provident Fund), SSY (Sukanya Samriddhi Yojana), SCSS (Senior Citizen Savings Scheme), NSC (National Savings Certificate - where annual accrued interest also qualifies as re-investment under 80C except in the final year), and 5-Year Post Office Time Deposit (POTD). Note that 1-year, 2-year, 3-year POTD, POMIS, and KVP do NOT qualify for Section 80C deductions."
    },
    {
      id: 7,
      category: "income",
      question: "Which schemes provide regular income?",
      answer: "Two primary schemes offer regular cash payouts: (1) Post Office Monthly Income Scheme (POMIS) provides monthly interest payouts directly to your post office savings account at 7.40% p.a. (2) Senior Citizen Savings Scheme (SCSS) pays interest quarterly on the first working day of April, July, October, and January at 8.20% p.a. Post Office Time Deposits (POTD) also disburse interest annually."
    },
    {
      id: 8,
      category: "comparison",
      question: "What is the difference between PPF and NSC?",
      answer: "Key differences include: (1) Tenure: PPF is 15 years (extendable in 5-year blocks); NSC is fixed at 5 years. (2) Deposit Mode: PPF allows annual recurring contributions (₹500 to ₹1.5L/year); NSC is a one-time lump-sum certificate. (3) Rate Mechanism: PPF interest rate is floating (revised quarterly); NSC locks the rate at the time of deposit. (4) Tax on Interest: PPF interest is 100% tax-exempt (EEE); NSC interest is taxable at slab rates (though accrued interest is eligible for 80C re-investment)."
    },
    {
      id: 9,
      category: "comparison",
      question: "What is the difference between PPF and Sukanya Samriddhi Yojana (SSY)?",
      answer: "While both enjoy EEE tax status and floating quarterly rates: (1) Eligibility: PPF can be opened by any Indian resident of any age; SSY can only be opened for a girl child under 10 years of age (max 2 daughters). (2) Interest Rate: SSY consistently offers a higher interest rate (8.20% p.a.) compared to PPF (7.10% p.a.). (3) Tenure: PPF matures in 15 years; SSY matures 21 years from account opening (or upon marriage after age 18), with deposits required for the first 15 years."
    },
    {
      id: 10,
      category: "liquidity",
      question: "Can I withdraw money before maturity?",
      answer: "Premature withdrawal policies vary significantly by scheme: PPF permits partial withdrawals up to 50% starting from the 7th financial year and loan facilities from the 3rd to 6th year. SCSS and POMIS permit premature closure after 1 year subject to nominal penalty deductions (1%–2%). POTD allows closure after 6 months. NSC and KVP permit premature exit only in exceptional circumstances such as demise of the holder or court orders. SSY allows 50% withdrawal for higher education once the girl child turns 18 or passes 10th standard."
    },
    {
      id: 11,
      category: "tax",
      question: "Are returns from Small Savings Schemes taxable?",
      answer: "Tax treatment depends strictly on the scheme: (1) Fully Tax-Free (EEE): PPF and SSY provide 100% tax exemption on deposit, accrued interest, and maturity proceeds under Section 10(11)/(11A). (2) Taxable Interest: Interest earned from SCSS, POMIS, POTD, NSC, KVP, and MSSC is taxable at your applicable personal income tax slab. SCSS interest beyond ₹50,000 in a FY is subject to TDS under Section 194A (for senior citizens)."
    },
    {
      id: 12,
      category: "eligibility",
      question: "Can Non-Resident Indians (NRIs) invest in Small Savings Schemes?",
      answer: "No. NRIs are not permitted to open fresh accounts in any Small Savings Scheme. If an Indian resident opens an account (such as PPF or SCSS) and subsequently acquires Non-Resident Indian status, the account can generally be maintained until its original maturity tenure on a non-repatriable basis, but extensions beyond the initial term are strictly prohibited."
    },
    {
      id: 13,
      category: "planning",
      question: "How do I choose the right scheme for my financial goals?",
      answer: "Align schemes to your objective: (1) For retirement & tax saving: PPF provides disciplined, long-term tax-free compounding. (2) For a daughter's education & wedding: SSY offers the highest sovereign rate with EEE exemption. (3) For senior citizens needing steady income: SCSS offers 8.20% quarterly cash flow. (4) For non-senior monthly income: POMIS pays steady monthly returns. (5) For medium-term capital preservation: 5-year NSC or POTD provide defined lock-in and stability."
    }
  ];

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'overview', label: 'Overview' },
    { id: 'interest', label: 'Interest & Rates' },
    { id: 'tax', label: 'Taxation' },
    { id: 'income', label: 'Regular Income' },
    { id: 'comparison', label: 'Comparisons' },
    { id: 'liquidity', label: 'Liquidity & Rules' }
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesQuery = searchQuery === '' || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-50 relative overflow-hidden" id="faqs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#032e92] text-xs sm:text-sm font-semibold mb-4">
            <FontAwesomeIcon icon={faCircleQuestion} className="text-[#032e92] text-xs" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#021d63] tracking-tight">
            Small Savings Schemes Explained
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Clear, authoritative answers to statutory rules, interest rates, tax benefits, and withdrawal regulations across all 9 government savings schemes.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mb-10 space-y-4">
          <div className="relative max-w-2xl mx-auto">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm" />
            <input 
              type="text"
              placeholder="Search by topic, e.g. PPF vs NSC, 80C tax benefits, NRI rules, premature exit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#032e92] text-sm shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faXmark} className="text-xs" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#032e92] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <FontAwesomeIcon icon={faCircleQuestion} className="text-3xl text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No questions matched your search criteria.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-3 text-xs text-[#032e92] font-semibold hover:underline"
              >
                Reset search & filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={faq.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-200 hover:border-slate-300 shadow-sm"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-sm sm:text-base text-[#021d63] leading-snug">
                      {faq.question}
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-[#032e92] text-white rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Postscript Advice */}
        <div className="mt-12 text-center text-xs text-slate-500">
          Have a specific scenario or need help allocating between PPF, SCSS, or Mutual Funds? Our advisors can review your portfolio goals.
        </div>

      </div>
    </section>
  );
};

export default SmallSavingsFAQ;
