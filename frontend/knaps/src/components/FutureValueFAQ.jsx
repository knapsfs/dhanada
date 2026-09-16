import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'

const faqs = [
  {
    q: 'How does the Goal Based Monthly Investment Calculator work?',
    a: 'You enter your target financial goal (such as ₹1 Crore), your expected investment duration, and assumed rate of return. The calculator works backwards using compounding mathematics to determine the exact monthly investment required to reach your target.',
  },
  {
    q: 'How does combining a lumpsum with monthly SIP accelerate wealth creation?',
    a: 'Starting with an initial lumpsum provides an immediate capital base that compounds from day one, while monthly SIPs take advantage of rupee cost averaging and continuous compounding. Together, they achieve targets far faster than relying on SIP alone.',
  },
  {
    q: 'Why should I consider inflation when planning financial goals?',
    a: 'Inflation reduces the purchasing power of money over time. A goal of ₹1 Crore in 15 years will buy significantly less than ₹1 Crore today. Enabling the inflation adjustment feature calculates the real future value in today’s purchasing power.',
  },
  {
    q: 'What rate of return should I assume in the calculator?',
    a: 'For long-term equity mutual funds (10+ years), Indian historical averages typically range between 12% and 15% p.a. For conservative hybrid or debt funds, a realistic range is 7% to 9% p.a.',
  },
  {
    q: 'Can I increase my investment as my income grows?',
    a: 'Yes! While this calculator assumes a consistent contribution, you can also use our Step Up SIP Calculator to model annual percentage or fixed-amount increments to reach your goals even quicker.',
  },
]

function FAQItem({ item, index, isOpen, onToggle }) {
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-[#032e92]/30 shadow-md shadow-blue-900/5' : 'border-[#e8edf7]'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f7f9fc] transition-colors"
      >
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold transition-colors ${isOpen ? 'bg-[#032e92] text-white' : 'bg-[#eef4ff] text-[#032e92]'}`}>
            {index + 1}
          </div>
          <span className={`text-sm font-semibold transition-colors ${isOpen ? 'text-[#032e92]' : 'text-gray-800'}`}>{item.q}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FontAwesomeIcon icon={faChevronDown} className={`text-xs flex-shrink-0 ml-3 ${isOpen ? 'text-[#032e92]' : 'text-gray-400'}`} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-4 pt-1">
              <div className="ml-9 bg-[#f7f9fc] rounded-xl px-4 py-3">
                <p className="text-sm text-gray-600 font-medium leading-relaxed">{item.a}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FutureValueFAQ() {
  const [openIndex, setOpenIndex] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })

  return (
    <section ref={ref} className="bg-[#f7f9fc] pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-[#eef4ff] flex items-center justify-center">
              <FontAwesomeIcon icon={faCircleQuestion} className="text-[#032e92] text-sm" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <FAQItem item={item} index={i} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
