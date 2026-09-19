import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleArrowRight, faChartLine
} from '@fortawesome/free-solid-svg-icons'
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
    <section id="home" className="relative min-h-screen overflow-hidden sif-hero-gradient">
      {/* Dynamic Animated Ambient Light Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle Dark Vignette Overlay for Rich Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 pointer-events-none z-1" />

        {/* Top-Right Glowing Cyan & Vivid Blue Orb (High Contrast Light Stream) */}
        <div className="hero-orb-1 absolute -top-24 -right-24 w-[620px] h-[620px] rounded-full bg-gradient-to-br from-cyan-400/35 via-blue-500/40 to-transparent blur-[90px]" />

        {/* Bottom-Left Radiant Royal Blue & Indigo Orb (Luminous Movement) */}
        <div className="hero-orb-2 absolute -bottom-32 -left-28 w-[680px] h-[680px] rounded-full bg-gradient-to-tr from-blue-600/45 via-indigo-500/35 to-transparent blur-[100px]" />

        {/* Center Pulsating Electric Sapphire Shimmer */}
        <div className="hero-orb-3 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/30 via-cyan-500/25 to-indigo-700/30 blur-[110px]" />

        {/* Subtle Brand Accent Warm Glow */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-[#c10000]/10 blur-[100px]" />

        {/* Subtle Luxury Mesh Grid Overlay for Texture */}
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-42 pb-24 lg:pb-28 z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[80vh]">

          {/* Left Column */}
          <div className="lg:col-span-7 xl:col-span-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl lg:text-5xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Specialized Investment Funds with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-cyan-200 to-blue-200"> Advanced Derivative Strategies.</span>
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
          <div className="lg:col-span-5 xl:col-span-6 relative hidden lg:flex items-center justify-center lg:-mr-6 xl:-mr-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto flex items-center justify-center lg:scale-100 xl:scale-105 2xl:scale-110 origin-center lg:origin-right transition-transform duration-500"
            >
              <img
                src={heroImg}
                alt="KNAPS Specialized Investment Funds"
                className="w-full h-auto object-contain max-h-[550px] xl:max-h-[600px] drop-shadow-[0_25px_45px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-500"
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
