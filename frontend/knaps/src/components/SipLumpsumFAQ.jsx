import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'

const FAQS = [
  {
    q: 'What is a SIP + Lump Sum investment strategy?',
    a: 'A SIP + Lump Sum strategy combines an upfront one-time lump sum investment with ongoing monthly Systematic Investment Plan (SIP) contributions. This allows you to immediately put your idle lump sum capital to work while taking advantage of rupee cost averaging through regular monthly installments.',
  },
  {
    q: 'Why combine a Lump Sum with a Monthly SIP?',
    a: 'Combining both approaches gives you the dual benefit of early compounding on your lump sum capital and disciplined investing through monthly cash inflows. The lump sum gets maximum time to compound in the market, while the monthly SIP cushions short-term volatility.',
  },
  {
    q: 'How is the Future Value calculated for a combined investment?',
    a: 'The future value is the sum of two compounding equations: (1) The initial lump sum compounded annually/monthly over your investment duration, plus (2) the ordinary monthly annuity compounding formula applied to your recurring monthly SIP contributions at your expected rate of return.',
  },
  {
    q: 'Can I start with any lump sum amount?',
    a: 'Yes, mutual funds in India generally allow lump sum investments starting as low as ₹1,000 to ₹5,000, alongside monthly SIPs starting from ₹500 or ₹1,000. You can tailor both amounts based on your savings and financial objectives.',
  },
  {
    q: 'How does inflation affect my total returns?',
    a: 'Inflation reduces the purchasing power of your money over time. While nominal returns indicate the numerical value of your accumulated wealth, inflation-adjusted future value shows what that corpus will actually be worth in terms of today’s purchasing power.',
  },
]

export default function SipLumpsumFAQ() {
  const [openIdx, setOpenIdx] = useState(null)

  const toggle = (i) => setOpenIdx(prev => (prev === i ? null : i))

  return (
    <section className="bg-[#f7f9fc] pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[#eef4ff] flex items-center justify-center">
              <FontAwesomeIcon icon={faCircleQuestion} className="text-[#032e92] text-sm" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
          </div>

          <div className="divide-y divide-[#e8edf7]">
            {FAQS.map((faq, i) => {
              const isOpen = openIdx === i
              return (
                <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                  >
                    <span className="text-sm font-bold text-gray-800 group-hover:text-[#032e92] transition-colors">
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-6 h-6 rounded-full bg-[#f7f9fc] flex items-center justify-center text-gray-400 group-hover:text-[#032e92] flex-shrink-0 text-xs"
                    >
                      <FontAwesomeIcon icon={faChevronDown} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-2.5 text-xs text-gray-500 leading-relaxed font-medium pr-8">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
