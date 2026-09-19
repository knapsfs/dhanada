import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SifSuitabilityQuiz from './SifSuitabilityQuiz'

export default function WhyChoose() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="why-choose" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
            🧠 Know Before You Invest
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Is SIF the <span className="gradient-text">right investment for you?</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            Thinking about SIF? Before making a decision, see if SIF matches your investment goals.
          </p>
        </motion.div>

        {/* Reusable SIF Suitability Quiz */}
        <SifSuitabilityQuiz />
      </div>
    </section>
  )
}
