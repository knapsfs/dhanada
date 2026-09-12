import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How do I initiate a consultation with your advisors?",
    answer: "You can begin by scheduling a consultation through the form above. A dedicated wealth manager will contact you within 24 hours to arrange an initial discovery meeting, either at our headquarters or via a secure virtual link."
  },
  {
    question: "What is your approach to personalized wealth management?",
    answer: "Our approach is highly bespoke. We do not use templated portfolios. Every strategy is meticulously crafted after deeply understanding your financial aspirations, risk tolerance, and current asset allocation."
  },
  {
    question: "Do you offer institutional-grade investment opportunities?",
    answer: "Yes, our Alternative Investment Funds (AIF) and Portfolio Management Services (PMS) provide high-net-worth individuals access to exclusive, institutional-grade opportunities previously unavailable to retail investors."
  },
  {
    question: "How is my financial data protected and secured?",
    answer: "We employ bank-grade encryption and stringent privacy protocols. Your personal and financial data is handled with the utmost confidentiality and is never shared with unauthorized third parties."
  },
  {
    question: "Is there a minimum investment required for Portfolio Management Services?",
    answer: "Yes, in compliance with SEBI regulations, our Portfolio Management Services require a minimum investment of ₹50 Lakhs. For other services like Mutual Funds or Insurance, there are no strict minimums."
  }
];

export default function PremiumFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-32 bg-[#F6F9FF] relative border-t border-gray-100">
      
      {/* Decorative Top Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-24 bg-gradient-to-b from-[#c10000] to-transparent opacity-30"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#032e92] border border-gray-200 font-semibold text-xs tracking-widest uppercase mb-6 shadow-sm"
          >
            Knowledge Base
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-[48px] font-bold text-[#0a192f] mb-6 leading-tight"
          >
            Frequently Asked <span className="text-[#032e92]">Questions</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto"
          >
            Clear, transparent answers regarding our wealth advisory process and services.
          </motion.p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-[24px] overflow-hidden transition-all duration-500 border ${openIndex === index ? 'border-[#032e92]/30 shadow-[0_20px_50px_-15px_rgba(3,46,146,0.15)]' : 'border-gray-100 shadow-sm hover:border-[#032e92]/10 hover:shadow-md'}`}
            >
              <button
                className="w-full text-left px-8 py-8 flex items-center justify-between focus:outline-none group"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className={`text-xl font-bold transition-colors duration-300 pr-8 ${openIndex === index ? 'text-[#032e92]' : 'text-[#0a192f] group-hover:text-[#032e92]'}`}>
                  {faq.question}
                </span>
                <span className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 ${openIndex === index ? 'border-[#032e92] bg-[#032e92] text-white rotate-180' : 'border-gray-200 text-gray-400 group-hover:border-[#032e92]/30 group-hover:bg-[#f0f4fd] group-hover:text-[#032e92]'}`}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-8 pb-8 pt-0 text-lg text-gray-600 leading-relaxed border-t border-gray-50 mx-8 mt-2 pt-6">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      </div>
    </section>
  );
}
