import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How do I schedule a consultation?",
    answer: "You can schedule a consultation by filling out the contact form on this page, calling our office directly, or sending us an email. Our team will get back to you within 24 hours to confirm your appointment time."
  },
  {
    question: "What investment services do you provide?",
    answer: "We provide a comprehensive suite of wealth management services including Mutual Funds, Portfolio Management Services (PMS), Alternative Investment Funds (AIF), Retirement Planning, and Insurance Solutions."
  },
  {
    question: "Can I meet an advisor online?",
    answer: "Yes, we offer completely secure virtual consultations via Zoom or Google Meet. You can discuss your portfolio and financial goals from the comfort of your home."
  },
  {
    question: "How soon will your team contact me?",
    answer: "During business hours (Monday to Friday, 9:00 AM – 6:00 PM), our advisors typically respond within 2-4 hours. Inquiries submitted outside these hours will be addressed on the next business day."
  },
  {
    question: "Do you provide personalized financial planning?",
    answer: "Absolutely. We do not believe in one-size-fits-all solutions. Our advisors will thoroughly analyze your current financial situation, risk appetite, and future goals to create a customized roadmap for you."
  },
  {
    question: "Can I visit your office without an appointment?",
    answer: "While we welcome visitors, we highly recommend scheduling an appointment in advance. This ensures that a dedicated financial advisor is available to give you their undivided attention without any waiting time."
  }
];

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState(0); // Only one open by default

  return (
    <section className="py-24 bg-[#f7f9fc]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-[36px] font-bold text-[#0a192f] mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index ? 'border-[#032e92] shadow-md' : 'border-gray-200 hover:border-[#032e92]/50'}`}
            >
              <button
                className="w-full text-left px-8 py-6 flex items-center justify-between focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className={`text-lg font-bold ${openIndex === index ? 'text-[#032e92]' : 'text-[#0a192f]'}`}>
                  {faq.question}
                </span>
                <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${openIndex === index ? 'border-[#032e92] bg-[#032e92] text-white' : 'border-gray-300 text-gray-500'}`}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-6 text-gray-600 leading-relaxed">
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
