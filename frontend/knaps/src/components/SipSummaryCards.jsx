import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faWallet, faChartLine, faArrowTrendUp
} from '@fortawesome/free-solid-svg-icons'

function CountUpNumber({ target, prefix = '', suffix = '', inView, decimals = 0 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 300
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

export default function SipSummaryCards({
  results,
  isInflationAdjusted,
  setIsInflationAdjusted,
  inflationRate,
  setInflationRate
}) {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 })

  const handleStepUp = (e) => {
    e.stopPropagation()
    if (setInflationRate) {
      setInflationRate((prev) => {
        const current = prev === '' ? 0 : Number(prev)
        return Math.min(30, +(current + 0.5).toFixed(1))
      })
    }
  }

  const handleStepDown = (e) => {
    e.stopPropagation()
    if (setInflationRate) {
      setInflationRate((prev) => {
        const current = prev === '' ? 0 : Number(prev)
        return Math.max(0, +(current - 0.5).toFixed(1))
      })
    }
  }

  const nominalValue = results.nominalFutureValue || results.futureValue || 0
  const inflationValue = results.inflationAdjustedValue || results.futureValue || 0

  return (
    <section ref={ref} className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 items-stretch">

          {/* 1. Invested Amount (Compact Left Card - 3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="md:col-span-3 bg-white rounded-2xl lg:rounded-3xl border border-[#e8edf7] shadow-md shadow-blue-900/5 p-5 lg:p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#eef4ff] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FontAwesomeIcon icon={faWallet} className="text-[#032e92] text-base" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Invested Amount</p>
              <p className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-[#032e92] leading-tight">
                <CountUpNumber
                  target={results.totalInvested || 0}
                  prefix="₹"
                  inView={inView}
                />
              </p>
            </div>
          </motion.div>

          {/* 2. Estimated Gain (Compact Middle Card - 3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="md:col-span-3 bg-white rounded-2xl lg:rounded-3xl border border-green-100 shadow-md shadow-blue-900/5 p-5 lg:p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FontAwesomeIcon icon={faArrowTrendUp} className="text-green-600 text-base" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Estimated Gain</p>
              <p className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-green-600 leading-tight">
                <CountUpNumber
                  target={results.wealthGained || 0}
                  prefix="₹"
                  inView={inView}
                />
              </p>
            </div>
          </motion.div>

          {/* 3. Estimated Value (Expanded Wide Card - 6 cols with Adjacent Values) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="md:col-span-6 bg-gradient-to-br from-[#032e92] via-[#0948cd] to-[#021d63] text-white rounded-2xl lg:rounded-3xl p-5 lg:p-6 shadow-xl shadow-blue-900/20 border border-blue-400/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
          >
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>

            {/* Card Header: Icon + Inflation Switch */}
            <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                <FontAwesomeIcon icon={faChartLine} className="text-white text-sm" />
              </div>

              {/* Inline Inflation Toggle & Rate Editor */}
              {setIsInflationAdjusted && (
                <div className="flex items-center gap-2 text-white text-xs font-medium">
                  <span className="font-semibold">Inflation</span>

                  {isInflationAdjusted && (
                    <div className="flex items-center gap-1 animate-fadeIn">
                      <span>@</span>
                      <div className="inline-flex items-center bg-white/20 hover:bg-white/25 focus-within:bg-white/30 border border-white/30 rounded-md px-1.5 py-0.5 transition-all">
                        <input
                          type="number"
                          value={inflationRate === '' ? '' : inflationRate}
                          min={0}
                          max={30}
                          step={0.5}
                          onChange={(e) => {
                            const val = e.target.value
                            if (val === '') {
                              setInflationRate('')
                            } else {
                              setInflationRate(Math.max(0, Math.min(30, Number(val))))
                            }
                          }}
                          className="w-6 bg-transparent text-white font-bold text-center text-xs focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0"
                          title="Click to type custom inflation rate"
                        />
                        <span className="text-blue-100 text-[10px] font-bold mr-1">%</span>
                        <div className="flex flex-col justify-center -space-y-1 text-[7px] text-blue-200">
                          <button
                            type="button"
                            onClick={handleStepUp}
                            className="hover:text-white transition-colors leading-none p-0.5 cursor-pointer active:scale-125"
                            title="Increase inflation rate by 0.5%"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={handleStepDown}
                            className="hover:text-white transition-colors leading-none p-0.5 cursor-pointer active:scale-125"
                            title="Decrease inflation rate by 0.5%"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                      <span>p.a.</span>
                    </div>
                  )}

                  {/* Switch button */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isInflationAdjusted}
                    onClick={() => setIsInflationAdjusted(!isInflationAdjusted)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer flex-shrink-0 ${isInflationAdjusted ? 'bg-[#ff5722]' : 'bg-white/20 hover:bg-white/30'
                      }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 shadow-md ${isInflationAdjusted ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Values Area */}
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {isInflationAdjusted ? (
                  <motion.div
                    key="inflation-on"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1"
                  >
                    {/* Left: Without Inflation */}
                    <div className="bg-white/10 rounded-2xl p-3 border border-white/15 backdrop-blur-sm flex flex-col justify-between">
                      <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
                        Estimated Value
                      </p>
                      <p className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
                        <CountUpNumber
                          target={nominalValue}
                          prefix="₹"
                          inView={inView}
                        />
                      </p>
                    </div>

                    {/* Right: With Inflation */}
                    <div className="bg-white/20 rounded-2xl p-3 border border-white/25 backdrop-blur-md flex flex-col justify-between shadow-inner">
                      <p className="text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">
                        Inflation Adjusted Value ({inflationRate}%)
                      </p>
                      <p className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
                        <CountUpNumber
                          target={inflationValue}
                          prefix="₹"
                          inView={inView}
                        />
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="inflation-off"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Estimated Value</p>
                    <p className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      <CountUpNumber
                        target={nominalValue}
                        prefix="₹"
                        inView={inView}
                      />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}