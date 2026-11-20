import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const faqs = [
  {
    question: 'Do people lose money in mutual funds?',
    answer: 'Mutual funds are market-linked, so returns can move up and down. However, in our 30 years of experience, we have seen people make money when they stay invested for the long term, typically for more than 5 years.'
  },
  {
    question: 'Which is better: Mutual Funds or SIF?',
    answer: 'SIFs (Specialized Investment Funds) are an advanced version of mutual funds where SEBI allows the use of derivatives to some extent, enabling fund managers to potentially benefit even during falling markets. SIFs can offer better risk-adjusted returns, but they also have a minimum investment of ₹10 lakh. Mutual Funds are preferred by investors who prefer traditional investment options and want to invest smaller amounts in the market.'
  },
  {
    question: 'Should I invest with KNAPS or Direct?',
    answer: ' KNAPS helps investors select a suitable investment product according to their goals and needs, and stay invested in a disciplined way. If investors choose to manage everything by themselves, they can opt for Direct Plans.'
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'There are no hidden fees. Applicable costs such as expense ratios and exit loads are disclosed clearly before investing'
  },
  {
    question: 'Can I track my portfolio?',
    answer: 'Yes. You can easily track your investments, current value, transactions and portfolio performance.'
  },
  {
    question: 'What is the minimum investment?',
    answer: 'Mutual Funds: ₹500 | SIF: ₹10 lakh | PMS: ₹50 lakh | AIF: ₹1 crore'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const renderFaqColumn = (faqsList, startIndex) => (
    <div className="flex flex-col space-y-4">
      {faqsList.map((faq, localIndex) => {
        const index = startIndex + localIndex;
        return (
          <div
            key={index}
            className={`rounded-2xl border transition-all duration-300 ${openIndex === index ? 'border-[#032e92] bg-white shadow-lg shadow-blue-900/5' : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200'}`}
          >
            <button
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
              onClick={() => toggleAccordion(index)}
            >
              <span className={`text-[15px] md:text-[16px] font-bold transition-colors duration-300 ${openIndex === index ? 'text-[#032e92]' : 'text-gray-800'}`}>
                {faq.question}
              </span>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${openIndex === index ? 'bg-[#032e92] text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                <FontAwesomeIcon icon={openIndex === index ? faMinus : faPlus} className="text-sm" />
              </div>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2 text-[14px] md:text-[15px] text-gray-600 leading-relaxed border-t border-gray-100/50 mt-2">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="py-12 sm:py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="text-center mb-10 sm:mb-12 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-[#eef5ff] text-[#032e92] font-semibold text-sm mb-4 uppercase tracking-wider"
          >
            FAQ
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-black tracking-tight leading-tight max-w-4xl mx-auto"
          >
            Frequently Asked <span className="text-[#032e92]">Questions</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-6 lg:gap-8 items-start"
        >
          {/* Left Column (0 to 3) */}
          {renderFaqColumn(faqs.slice(0, 3), 0)}

          {/* Right Column (4 to 6) */}
          {renderFaqColumn(faqs.slice(3, 6), 3)}
        </motion.div>
      </div>
    </section>
  );
}
