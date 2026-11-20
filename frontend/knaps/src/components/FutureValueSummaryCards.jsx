import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faCoins,
  faBullseye
} from '@fortawesome/free-solid-svg-icons'

function CountUpNumber({ target, prefix = '', suffix = '', inView, decimals = 0 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 120
    const steps = 40
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

const fmtCurrency = (n) => {
  if (n === null || n === undefined || isNaN(n)) return '₹0'
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} Lakh`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export default function FutureValueSummaryCards({
  results,
  requiredLumpsum = 0,
  targetFutureValue = 0,
  selectedGoal = 'Goal',
  years = 15,
  annualReturn = 12
}) {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.15 })

  const requiredPmt = results?.requiredPmt || 0

  return (
    <section ref={ref} className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Goal Indicator Badge */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#032e92] border border-blue-200/60 text-xs font-bold">
            <FontAwesomeIcon icon={faBullseye} />
            <span>Target Goal: {selectedGoal} ({fmtCurrency(targetFutureValue)}) in {years} Years @ {annualReturn}% p.a.</span>
          </div>
          <span className="text-xs text-gray-400 font-medium hidden sm:inline">
            Choose either investment approach below
          </span>
        </div>

        {/* Two-Card Output Container matching uploaded sketch with brand calculator colors */}
        <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-2 lg:gap-2">

          {/* Card 1: Monthly Investment Needed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="bg-gradient-to-br from-[#032e92] via-[#0948cd] to-[#021d63] text-white rounded-3xl p-6 lg:p-8 shadow-xl shadow-blue-900/20 border border-blue-400/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
          >
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />

            <div className="relative z-10">
              {/* Header Badge & Icon */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-white text-base" />
                </div>
                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">SIP Option</span>
              </div>

              <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">
                MONTHLY INVESTMENT NEEDED
              </p>

              {/* Amount Display */}
              <div className="my-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-none">
                    <CountUpNumber
                      target={requiredPmt}
                      prefix="₹"
                      inView={inView}
                    />
                  </span>
                  <span className="text-base sm:text-lg font-bold text-blue-200">
                    /month
                  </span>
                </div>
              </div>

              {/* Exact Description text requested */}
              <p className="text-sm sm:text-[15px] font-medium text-blue-100 leading-relaxed mt-3 mb-0">
                This is what you could invest starting today each month to reach your goal.
              </p>
            </div>
          </motion.div>

          {/* OR Divider Component (Desktop Vertical line, Mobile Horizontal line) */}
          <div className="flex md:flex-col items-center justify-center py-2 md:py-0 md:px-2 relative">
            <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-gray-300 to-transparent flex-1" />
            <div className="block md:hidden h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1" />

            <div className="mx-3 md:my-3 px-4 py-2 rounded-full bg-white text-[#032e92] font-black text-xs tracking-widest shadow-lg shadow-blue-900/10 uppercase ring-4 ring-[#f7f9fc] border border-blue-200 select-none">
              OR
            </div>

            <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-gray-300 to-transparent flex-1" />
            <div className="block md:hidden h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1" />
          </div>

          {/* Card 2: Lump Sum Investment Needed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="bg-gradient-to-br from-[#032e92] via-[#0948cd] to-[#021d63] text-white rounded-3xl p-6 lg:p-8 shadow-xl shadow-blue-900/20 border border-blue-400/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
          >
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />

            <div className="relative z-10">
              {/* Header Badge & Icon */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                  <FontAwesomeIcon icon={faCoins} className="text-white text-base" />
                </div>
                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">One-Time Option</span>
              </div>

              <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">
                LUMP SUM INVESTMENT NEEDED
              </p>

              {/* Amount Display */}
              <div className="my-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-none">
                    <CountUpNumber
                      target={requiredLumpsum}
                      prefix="₹"
                      inView={inView}
                    />
                  </span>
                </div>
              </div>

              {/* Exact Description text requested */}
              <p className="text-sm sm:text-[15px] font-medium text-blue-100 leading-relaxed mt-3 mb-0">
                This is the lump sum amount you could invest today to reach your goal.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
