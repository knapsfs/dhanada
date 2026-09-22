import { motion } from 'framer-motion'
import { useLeadModal } from '../../context/LeadModalContext'
import heroImg from '../../assets/sif/knaps-hero.png'

const heroHighlights = [
  '₹10 Lakh Minimum Investment',
  'Long-Short Derivative Strategies',
  'Flexible Equity & Debt Exposure',
]

export default function Hero() {
  const { openLeadModal } = useLeadModal()

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#021d63] via-[#032e92] to-[#0a4fd4]">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-36 sm:pt-40 lg:pt-44 pb-20 lg:pb-28 z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center min-h-[75vh]">

          {/* Left Column */}
          <div className="lg:col-span-7 xl:col-span-6 text-left">
            {/* Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-md text-cyan-200 text-xs sm:text-sm font-semibold mb-6 tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.15)]"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>SPECIALIZED INVESTMENT FUNDS (SIF)</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-6 font-serif tracking-tight"
            >
              Specialized Investment Funds with <span className=" text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-cyan-200 to-white">
                Advanced Derivative Strategies.
              </span>
            </motion.h1>

            {/* Feature Highlights Pills */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-3.5 mb-9 font-medium text-sm sm:text-base text-white/95"
            >
              {heroHighlights.map((text, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center flex-shrink-0 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-white/90">{text}</span>
                </li>
              ))}
            </motion.ul>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <button
                type="button"
                onClick={openLeadModal}
                className="btn-ripple px-8 py-3.5 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white border border-white/30 hover:border-white/60 hover:shadow-xl hover:shadow-[#032e92]/50 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
              >
                Invest Now
              </button>
              <a
                href="#top-funds"
                className="btn-ripple px-7 py-3.5 rounded-xl text-[15px] font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/40 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
              >
                Explore Funds
              </a>
            </motion.div>

            {/* Quick Metrics Strip */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg"
            >
              <div>
                <p className="text-2xl font-bold text-white font-serif">₹10L</p>
                <p className="text-xs font-medium text-cyan-200/80 mt-0.5">Min. Investment</p>
              </div>
              <div className="border-l border-white/10 pl-4">
                <p className="text-2xl font-bold text-white font-serif">SEBI</p>
                <p className="text-xs font-medium text-cyan-200/80 mt-0.5">Regulated Frame</p>
              </div>
              <div className="border-l border-white/10 pl-4">
                <p className="text-2xl font-bold text-white font-serif">Hedging</p>
                <p className="text-xs font-medium text-cyan-200/80 mt-0.5">Risk Controlled</p>
              </div>
            </motion.div> */}
          </div>

          {/* Right Column - Hero 3D Graphic with Grounded Pedestal & Badges */}
          <div className="lg:col-span-5 xl:col-span-6 relative hidden lg:flex items-center justify-center">
            {/* Glass Badge: Top-Left */}
            <motion.div
              initial={{ opacity: 0, y: -20, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -top-2 left-0 xl:-left-6 z-20 bg-slate-900/60 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-3.5 shadow-[0_12px_32px_rgba(2,108,245,0.3)] flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-cyan-300">Regulated Framework</p>
                <p className="text-xs font-semibold text-white">SEBI Approved Structure</p>
              </div>
            </motion.div>

            {/* Glass Badge: Bottom-Right */}
            <motion.div
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute -bottom-4 right-0 xl:-right-4 z-20 bg-slate-900/60 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-3.5 shadow-[0_12px_32px_rgba(3,46,146,0.35)] flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-blue-300">Long-Short Edge</p>
                <p className="text-xs font-semibold text-white">Dynamic Hedging</p>
              </div>
            </motion.div>

            {/* Main Graphic Container with Grounded Pedestal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto flex flex-col items-center justify-center"
            >
              {/* Image */}
              <div className="relative z-10 group">
                <img
                  src={heroImg}
                  alt="KNAPS Specialized Investment Funds"
                  className="w-full h-auto object-contain max-h-[500px] xl:max-h-[560px] filter drop-shadow-[0_20px_35px_rgba(2,108,245,0.35)] drop-shadow-[0_40px_60px_rgba(2,9,25,0.8)] group-hover:scale-[1.02] transition-transform duration-500"

                />
              </div>

              {/* Grounded Floor Ellipse */}
              <div className="w-[85%] h-8 bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent blur-md -mt-6 pointer-events-none" />
              <div className="w-[70%] h-4 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm -mt-3 pointer-events-none" />
              <div className="w-[60%] h-6 bg-black/60 blur-lg -mt-3 pointer-events-none" />
            </motion.div>
          </div>

        </div>
      </div>
    </section >
  )
}
