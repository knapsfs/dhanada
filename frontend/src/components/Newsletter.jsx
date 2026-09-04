import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faPhone } from '@fortawesome/free-solid-svg-icons'
import { useLeadModal } from '../context/LeadModalContext'

export default function Newsletter() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const { openLeadModal } = useLeadModal()

  const stats = [
    { value: '50,000+', label: 'Investors' },
    { value: '23,000Cr+', label: 'AUM' },
    { value: '30', label: 'Active SIFs' },
  ]

  return (
    <section id="newsletter" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl">

          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#032e92] via-[#0a4fd4] to-[#021d63]" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c10000]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 blur-3xl" />

          {/* Decorative dots */}
          <div className="absolute top-8 left-8 grid grid-cols-4 gap-3 opacity-20">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
            ))}
          </div>
          <div className="absolute bottom-8 right-8 grid grid-cols-4 gap-3 opacity-20">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
            ))}
          </div>

          <div className="relative py-16 px-8 lg:px-16 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Start Investing in SIF
            </h2>
            <p className="text-blue-200 font-medium mb-10 max-w-xl mx-auto text-base leading-relaxed">
              Discuss your investment objectives and learn more about Specialised Investment Fund (SIF) strategies.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
              {stats.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
                  className="py-6 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center hover:bg-white/15 transition-all duration-300 shadow-lg shadow-black/5"
                >
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                    {item.value}
                  </div>
                  <p className="text-blue-200 text-sm font-medium">{item.label}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => openLeadModal()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#032e92] text-sm font-semibold shadow-xl shadow-black/10 hover:bg-blue-50 hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Invest Now</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>

              <a
                href="tel:+919990243143"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/30 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5"
              >
                <FontAwesomeIcon icon={faPhone} className="text-xs text-green-400" />
                <span>Call us - +91-9990243143</span>
              </a>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
