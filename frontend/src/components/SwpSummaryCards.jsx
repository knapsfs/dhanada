import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faWallet, faArrowRightFromBracket, faChartLine
} from '@fortawesome/free-solid-svg-icons'

function CountUpNumber({ target, prefix = '', suffix = '', inView, decimals = 0 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const steps = 60
    const increment = target / steps
    let current = 0
    let step = 0
    const timer = setInterval(() => {
      step++
      current = Math.min(increment * step, target)
      setCount(current)
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  const formatted = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString('en-IN')

  return <span>{prefix}{formatted}{suffix}</span>
}

export default function SwpSummaryCards({ results }) {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 })

  return (
    <section ref={ref} className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          
          {/* 1. Total Investment (Left) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#eef4ff] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon={faWallet} className="text-[#032e92] text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Total Investment</p>
              <p className="text-2xl lg:text-3xl font-bold text-[#032e92] leading-tight">
                <CountUpNumber
                  target={results.totalInvestment || 0}
                  prefix="₹"
                  inView={inView}
                />
              </p>
            </div>
          </motion.div>

          {/* 2. Total Withdrawal (Middle) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="bg-white rounded-3xl border border-purple-100 shadow-lg shadow-blue-900/5 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-purple-600 text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Total Withdrawal</p>
              <p className="text-2xl lg:text-3xl font-bold text-purple-600 leading-tight">
                <CountUpNumber
                  target={results.totalWithdrawal || 0}
                  prefix="₹"
                  inView={inView}
                />
              </p>
            </div>
          </motion.div>

          {/* 3. Final Value (Right - Highlighted Hero Card) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gradient-to-br from-[#032e92] via-[#0948cd] to-[#021d63] text-white rounded-3xl p-6 lg:p-7 shadow-xl shadow-blue-900/20 border border-blue-400/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-5 group-hover:scale-110 transition-transform flex-shrink-0 relative z-10">
              <FontAwesomeIcon icon={faChartLine} className="text-white text-base" />
            </div>

            <div className="relative z-10">
              <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">Final Value</p>
              <p className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                <CountUpNumber
                  target={results.finalValue || 0}
                  prefix="₹"
                  inView={inView}
                />
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}