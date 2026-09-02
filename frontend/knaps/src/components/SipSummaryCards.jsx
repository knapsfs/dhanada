import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faWallet, faChartLine, faArrowTrendUp
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

  return (
    <section ref={ref} className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">

          {/* 1. Invested Amount (Left) */}
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
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Invested Amount</p>
              <p className="text-2xl lg:text-3xl font-bold text-[#032e92] leading-tight">
                <CountUpNumber
                  target={results.totalInvested || 0}
                  prefix="₹"
                  inView={inView}
                />
              </p>
            </div>
          </motion.div>

          {/* 2. Estimated Gain (Middle) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="bg-white rounded-3xl border border-green-100 shadow-lg shadow-blue-900/5 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon={faArrowTrendUp} className="text-green-600 text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Estimated Gain</p>
              <p className="text-2xl lg:text-3xl font-bold text-green-600 leading-tight">
                <CountUpNumber
                  target={results.wealthGained || 0}
                  prefix="₹"
                  inView={inView}
                />
              </p>
            </div>
          </motion.div>

          {/* 3. Estimated Value (Right - Highlighted Hero Card with Inflation Control) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gradient-to-br from-[#032e92] via-[#0948cd] to-[#021d63] text-white rounded-3xl p-6 lg:p-7 shadow-xl shadow-blue-900/20 border border-blue-400/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
          >
            {/* Soft background glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <FontAwesomeIcon icon={faChartLine} className="text-white text-base" />
              </div>

              {/* Inline Inflation Toggle & Rate Editor */}
              {setIsInflationAdjusted && (
                <div className="flex items-center gap-1.5 text-white text-xs font-medium ">
                  <span>Inflation</span>

                  {isInflationAdjusted && (
                    <div className="flex items-center gap-1 animate-fadeIn">
                      <span>@</span>
                      <div className="inline-flex items-center bg-white/20 hover:bg-white/25 focus-within:bg-white/30 border border-white/30 rounded-md px-1 py-0.5 transition-all">
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

            <div className="relative z-10">
              <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">Estimated Value</p>
              <p className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                <CountUpNumber
                  target={results.futureValue || 0}
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