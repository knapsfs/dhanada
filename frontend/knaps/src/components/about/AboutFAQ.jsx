import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const faqs = [
  {
    question: 'Why choose Knaps?',
    answer: 'We offer a premium, highly personalized approach to wealth management. With over 27 years of experience, we prioritize your specific financial goals while ensuring utmost transparency, security, and consistent long-term growth.'
  },
  {
    question: 'How experienced are your advisors?',
    answer: 'Our core advisory team consists of certified financial planners and industry veterans, each possessing decades of experience in navigating global markets, taxation, and advanced investment strategies.'
  },
  {
    question: 'What financial products do you offer?',
    answer: 'We provide a comprehensive suite of solutions including Mutual Funds, Portfolio Management Services (PMS), Alternative Investment Funds (AIF), comprehensive Insurance planning, and specialized Retirement strategies.'
  },
  {
    question: 'Do you provide personalised investment advice?',
    answer: 'Absolutely. We believe there is no one-size-fits-all in finance. Every strategy we deploy is custom-tailored based on an extensive assessment of your risk appetite, current assets, and future goals.'
  },
  {
    question: 'How do I schedule a consultation?',
    answer: 'You can easily schedule a consultation by clicking the "Book Consultation" button on our website, calling our dedicated support line, or reaching out to us via email. One of our relationship managers will promptly assist you.'
  }
];

export default function AboutFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 bg-[#f8f9fc] relative">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-sm mb-4 tracking-wider uppercase"
          >
            Find Answers
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Frequently Asked <span className="text-[#032e92]">Questions</span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white rounded-2xl border transition-colors duration-300 ${openIndex === idx ? 'border-[#032e92]/30 shadow-md' : 'border-gray-200'}`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              >
                <span className={`font-semibold text-lg transition-colors duration-300 ${openIndex === idx ? 'text-[#032e92]' : 'text-gray-900'}`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 flex-shrink-0 ml-4 ${openIndex === idx ? 'bg-[#c10000] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <FontAwesomeIcon icon={openIndex === idx ? faMinus : faPlus} className="text-sm" />
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
