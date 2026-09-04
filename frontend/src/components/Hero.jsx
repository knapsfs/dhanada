import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleArrowRight, faChartLine
} from '@fortawesome/free-solid-svg-icons'
import { useLeadModal } from '../context/LeadModalContext'
import heroImg from '../assets/knaps-hero.png'

const heroHighlights = [
  'Advanced investment strategies',
  'SEBI-regulated framework',
  'Start with just Rs. 10lakh',
]

export default function Hero() {
  const { openLeadModal } = useLeadModal()

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#021d63] via-[#032e92] to-[#0a4fd4]" />

      {/* Animated circles */}
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-[#c10000]/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#032e92]/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* Left Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-blue-100 font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              AMFI Registered SIF Distributor
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl lg:text-5xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Specialized Investment Funds (SIF) for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-300"> Smarter Investments.</span>
            </motion.h1>

            {/* Feature Checkpoints List */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-3.5 mb-8 text-white font-medium text-lg sm:text-xl"
            >
              {heroHighlights.map((text, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-cyan-300 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{text}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={openLeadModal}
                className="btn-ripple flex items-center gap-2 px-8 py-4 rounded-full bg-[#c10000] hover:bg-[#9d0000] text-white font-semibold shadow-xl shadow-red-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
              >
                <FontAwesomeIcon icon={faCircleArrowRight} />
                Invest Now
              </button>
              <a
                href="#top-funds"
                className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold transition-all duration-300 hover:-translate-y-1"
              >
                <FontAwesomeIcon icon={faChartLine} />
                Explore Funds
              </a>
            </motion.div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-lg xl:max-w-xl mx-auto flex items-center justify-center"
            >
              <img
                src={heroImg}
                alt="KNAPS Specialized Investment Funds"
                className="w-full h-auto object-contain max-h-[620px] drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          </div>

        </div>
      </div>

      {/* Smooth Organic Wave bottom */}
      <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative block w-full h-[45px] sm:h-[65px] lg:h-[85px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,45 C280,85 480,15 760,50 C1040,85 1240,15 1440,40 V92 H0 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  )
}