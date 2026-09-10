import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faArrowTrendUp, faShieldHalved } from '@fortawesome/free-solid-svg-icons'

export default function FundsHero({ totalFunds = 33 }) {
  return (
    <section className="pt-24 pb-6 bg-[#ffffff]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#eef4ff] to-[#dbeafe] rounded-[2.5rem] p-6 lg:p-10 shadow-xl shadow-blue-900/5 border border-[#e8edf7] relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-white/70 border border-blue-200 rounded-full px-3 py-1 text-[10px] lg:text-xs text-[#032e92] font-bold uppercase tracking-wide mb-4 shadow-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#032e92] animate-pulse" />
                Live SIF Schemes
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl lg:text-4xl font-bold text-[#1e293b] leading-tight mb-4 font-serif"
              >
                Explore Specialized <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#032e92] to-[#c10000]">
                  Investment Funds
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-[#64748b] text-sm lg:text-base font-medium leading-relaxed max-w-md"
              >
                Compare investment opportunities and choose the right fund for your financial goals.
              </motion.p>
            </div>

            {/* Right - 3 Stat Cards in Royal Blue matching Reference */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 grid grid-cols-3 gap-3 sm:gap-4"
            >
              {/* Min Investment */}
              <div className="bg-[#1d4ed8] rounded-2xl p-4 sm:p-5 text-center shadow-lg shadow-blue-900/15 border border-white/20 hover:scale-105 transition-transform duration-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#10b981] text-white flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md">
                  <FontAwesomeIcon icon={faChartLine} className="text-xs sm:text-sm" />
                </div>
                <p className="text-white text-base sm:text-xl font-extrabold mb-0.5 leading-tight">10 Lakh</p>
                <p className="text-blue-100 text-[10px] sm:text-xs font-semibold leading-tight">Min. Investment</p>
              </div>

              {/* Active Schemes */}
              <div className="bg-[#1d4ed8] rounded-2xl p-4 sm:p-5 text-center shadow-lg shadow-blue-900/15 border border-white/20 hover:scale-105 transition-transform duration-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f97316] text-white flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="text-xs sm:text-sm" />
                </div>
                <p className="text-white text-base sm:text-xl font-extrabold mb-0.5 leading-tight">{totalFunds || '33'}</p>
                <p className="text-blue-100 text-[10px] sm:text-xs font-semibold leading-tight">Active SIF Schemes</p>
              </div>

              {/* Total AUM */}
              <div className="bg-[#1d4ed8] rounded-2xl p-4 sm:p-5 text-center shadow-lg shadow-blue-900/15 border border-white/20 hover:scale-105 transition-transform duration-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#06b6d4] text-white flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-xs sm:text-sm" />
                </div>
                <p className="text-white text-base sm:text-xl font-extrabold mb-0.5 leading-tight">23,345 Cr</p>
                <p className="text-blue-100 text-[10px] sm:text-xs font-semibold leading-tight">Total AUM</p>
              </div>

            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
