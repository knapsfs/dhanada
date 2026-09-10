import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const faqs = [
  {
    question: 'What is SIF?',
    answer: 'SIF (Smart Investment Fund) is our proprietary wealth management framework designed to optimize asset allocation across different market cycles, ensuring consistent returns with minimized risk.'
  },
  {
    question: 'Why invest in Mutual Funds?',
    answer: 'Mutual funds offer professional management, diversification, and liquidity. They are an excellent way to participate in equity and debt markets without needing the expertise to pick individual securities.'
  },
  {
    question: 'What is PMS?',
    answer: 'Portfolio Management Services (PMS) is a customized investment solution where expert fund managers create and manage a bespoke portfolio of stocks, fixed income, and other securities tailored to your specific financial goals.'
  },
  {
    question: 'Difference between PMS & AIF?',
    answer: 'While both cater to high-net-worth individuals, PMS provides a customized portfolio of direct equities or standard securities. AIF (Alternative Investment Fund) pools capital to invest in complex, alternative assets like private equity, real estate, or hedge funds.'
  },
  {
    question: 'Why choose our company?',
    answer: 'We bring decades of market experience, a client-first transparent approach, and cutting-edge technology. Our dedicated relationship managers ensure you get personalized advice, not generic products.'
  },
  {
    question: 'How do I start investing?',
    answer: 'Simply click on "Schedule Consultation" to book an initial assessment. Our advisors will understand your goals, assess your risk profile, and guide you through the seamless onboarding and investment process.'
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'Transparency is our core value. We have a clear fee structure which is explained upfront before any investment is made. There are absolutely no hidden charges.'
  },
  {
    question: 'Can I track my portfolio online?',
    answer: 'Yes, all our clients receive access to a premium digital dashboard. You can track your portfolio performance, view reports, and analyze asset allocation in real-time.'
  },
  {
    question: 'What is the minimum investment amount?',
    answer: 'The minimum investment varies by product. Regular mutual fund SIPs can start from ₹1,000, while specialized products like PMS require a minimum of ₹50 Lakhs as per regulatory guidelines.'
  },
  {
    question: 'Is my data and investment secure?',
    answer: 'Absolutely. We use bank-level 256-bit encryption to protect your data. All investments are held securely in your name through regulated depositories like NSDL/CDSL.'
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
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
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
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a]"
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
          {/* Left Column (0 to 4) */}
          {renderFaqColumn(faqs.slice(0, 5), 0)}
          
          {/* Right Column (5 to 9) */}
          {renderFaqColumn(faqs.slice(5, 10), 5)}
        </motion.div>
      </div>
    </section>
  );
}
