import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers, faAward, faChartLine, faCircleCheck
} from '@fortawesome/free-solid-svg-icons'

function AnimatedNumber({ value, inView }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    const end = value
    const step = Math.ceil(end / (2000 / 16))
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, end)
      setCount(current)
      if (current >= end) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])
  return <span>{count}</span>
}

const trustCards = [
  {
    icon: faUsers,
    title: 'Specialized Approach',
    value: 5000,
    suffix: '+',
    prefix: '',
    subtitle: 'Focused Strategies',
    description: 'Access investment approaches designed for investors seeking more specialized portfolio solutions.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'from-blue-50 to-indigo-50',
  },
  {
    icon: faAward,
    title: 'Investment Threshold',
    value: 25,
    suffix: '+',
    prefix: '',
    subtitle: '₹10 Lakh',
    description: 'The aggregate minimum investment threshold for non-accredited investors across SIF strategies at the PAN level.',
    color: 'from-amber-500 to-orange-600',
    bg: 'from-amber-50 to-orange-50',
  },
  {
    icon: faChartLine,
    title: 'SEBI-Regulated',
    value: 50,
    suffix: '+',
    prefix: '',
    subtitle: 'Regulated Framework',
    description: 'SIFs operate within the SEBI-regulated mutual fund framework, with defined investment and disclosure requirements.',
    color: 'from-green-500 to-emerald-600',
    bg: 'from-green-50 to-emerald-50',
  },
  {
    icon: faCircleCheck,
    title: 'Portfolio Flexibility',
    value: 99,
    suffix: '%',
    prefix: '',
    subtitle: 'Advanced Strategies',
    description: 'Depending on the SIF investment strategy, permitted derivatives and long-short approaches can be used within the regulatory framework.',
    color: 'from-purple-500 to-violet-600',
    bg: 'from-purple-50 to-violet-50',
  },
]

export default function TrustSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="trust" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
            🛡️ Understanding SIF
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Consider a <span className="gradient-text">Specialized Investment Fund?</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            SIFs are designed for investors seeking specialized investment approaches, greater portfolio flexibility, and access to strategies beyond traditional mutual funds.
          </p>
        </motion.div>

        {/* Trust Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`bg-gradient-to-br ${card.bg} rounded-3xl p-7 border border-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden`}>

              {/* Background circle */}
              <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                <FontAwesomeIcon icon={card.icon} className="text-white text-xl" />
              </div>

              <h3 className="font-bold text-gray-900 mb-1 text-base">{card.title}</h3>

              {/* Counter */}
              {/* <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-[#032e92]">
                  {card.prefix}
                  <AnimatedNumber value={card.value} inView={inView} />
                  {card.suffix}
                </span>
              </div> */}
              <p className={`text-xs font-semibold mb-3 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                {card.subtitle}
              </p>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Certification Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6">
          {['SEBI Registered', 'AMFI Compliant', 'ISO 27001', 'PCI DSS Level 1'].map((cert) => (
            <div key={cert} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f7f9fc] border border-[#e8edf7] text-sm font-semibold text-gray-600">
              <FontAwesomeIcon icon={faCircleCheck} className="text-green-500" />
              {cert}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
