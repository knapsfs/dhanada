import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { useLeadModal } from '../../context/LeadModalContext'

export default function Newsletter() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const { openLeadModal } = useLeadModal()

  const stats = [
    { value: '50,000+', label: 'Investors' },
    { value: '23,000Cr+', label: 'SIF Industry AUM' },
    { value: '30', label: 'Active SIFs' },
  ]

  return (
    <section id="newsletter" className="py-12 sm:py-16 bg-[#f7f9fc] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-br from-[#032e92] via-[#021d63] to-[#011347] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl shadow-blue-950/20"
        >
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Start Investing in SIF
            </h2>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal max-w-2xl sm:max-w-3xl mx-auto mt-3.5">
              Discuss your investment objectives and learn more about Specialised Investment Fund (SIF) strategies.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto py-2">
              {stats.map((item, idx) => (
                <div
                  key={item.label}
                  className="py-4 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center shadow-sm"
                >
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-0.5">
                    {item.value}
                  </div>
                  <p className="text-blue-100/80 text-xs font-medium">{item.label}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => openLeadModal()}
                className="btn-ripple w-full sm:w-auto px-6 py-3 rounded-xl text-md font-semibold bg-white text-[#032e92] hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
              >
                <span>Invest Now</span>
              </button>

              <a
                href="tel:+919990243143"
                className="btn-ripple w-full sm:w-auto px-6 py-3 rounded-xl text-md font-semibold text-white/95 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 transition-all duration-300 inline-flex items-center justify-center gap-2 backdrop-blur-sm cursor-pointer"
              >
                <span>Call us (+91) 9990243143</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
