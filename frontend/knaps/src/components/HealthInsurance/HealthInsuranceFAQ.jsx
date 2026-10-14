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
    question: 'Why is corporate health insurance from my employer not sufficient?',
    answer: 'Corporate health insurance is typically limited to ₹3 Lakh–₹5 Lakh, which can be wiped out in a single intensive care hospital stay. More importantly, corporate insurance ceases immediately if you switch employers, take a career break, face layoffs, or retire — precisely the life stages when buying personal health insurance becomes significantly more expensive or difficult due to age and newly acquired medical conditions.'
  },
  {
    question: 'What is a pre-existing disease (PED) and how do waiting periods work?',
    answer: 'A Pre-Existing Disease (PED) is any medical condition, injury, or ailment (e.g., diabetes, hypertension, asthma, thyroid) diagnosed or treated prior to buying the policy. Under IRDAI regulations, health insurers enforce a waiting period ranging from 1 to 3 years before claims related to that specific condition are covered. Several modern plans recommended by KNAPS offer riders to reduce this waiting period to as little as 1 year or Day 1.'
  },
  {
    question: 'What is the Room Rent Capping clause and how does it reduce claim payouts?',
    answer: 'Many standard policies cap room rent at 1% of the sum insured (e.g., ₹5,000/day on a ₹5 Lakh policy). If you choose a room costing ₹10,000/day, the insurer applies a "proportionate deduction" across the entire hospital bill — cutting surgeon fees, OT charges, and nursing costs by 50%! KNAPS strictly advises choosing plans with "No Room Rent Capping" so you can select private AC rooms without proportionate financial penalties.'
  },
  {
    question: 'What is the difference between Cashless Hospitalization and Reimbursement claims?',
    answer: 'In a Cashless claim, you present your health e-card at any of the insurer’s 14,000+ network hospitals. The hospital desk sends pre-authorization documents to the insurer/TPA, and upon approval, the insurer settles eligible expenses directly with the hospital. In a Reimbursement claim (used if you choose a non-network hospital), you pay the hospital upfront, collect all original discharge summaries, bills, and prescriptions, and submit them for reimbursement.'
  },
  {
    question: 'How does the Automatic Restoration of Sum Insured benefit work?',
    answer: 'Automatic Restoration (or Recharge) refills 100% of your sum insured if it is partially or completely exhausted by claims in a single policy year. For example, if you have a ₹10 Lakh policy and claim ₹10 Lakh in May, your cover is automatically restored back to ₹10 Lakh for any subsequent hospitalization (for unrelated illnesses or for other family members on a floater policy) during the same policy year.'
  },
  {
    question: 'How much tax can I save under Section 80D of the Income Tax Act?',
    answer: 'Under Section 80D, you can claim a deduction of up to ₹25,000 for premiums paid for yourself, spouse, and dependent children (up to ₹50,000 if you are a senior citizen). Additionally, you can claim up to ₹50,000 for premiums paid for senior citizen parents. This allows an aggregate deduction of up to ₹75,000 to ₹1,00,000 per financial year, resulting in tax savings of up to ₹31,200 in the 30% tax bracket.'
  },
  {
    question: 'What happens if I make a claim? Does my premium increase next year?',
    answer: 'No. In retail health insurance in India, IRDAI prohibits insurers from loading or penalizing individual policyholders with premium increases solely because they filed a claim. Your renewal premium will only reflect standard age-band adjustments or board-approved product revisions across the entire insured pool.'
  }
];

export default function HealthInsuranceFAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const { openLeadModal } = useLeadModal();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
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
              Health Insurance
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Everything you need to know about waiting periods, cashless admissions, room-rent clauses, and Section 80D tax deductions.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:border-blue-200 transition-all duration-300 overflow-hidden"
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
                    className={`w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#032e92] flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#032e92] text-white' : ''
                    }`}
                  >
                    <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-gray-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Prompt */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-blue-100 shadow-md text-center flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-bold text-[#0a192f]">Have a question about an existing medical condition or specific policy clause?</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Our certified health insurance advisors provide free, confidential policy audits.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => openLeadModal({ title: 'Ask Health Insurance Question', defaultService: 'Health Insurance' })}
              className="btn-ripple px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Ask an Advisor
            </button>
            <a
              href="tel:+918080808080"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#032e92] bg-blue-50 hover:bg-blue-100 transition-colors"
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
