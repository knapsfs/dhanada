import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserTie, faShieldHalved, faChartLine, faHandshake
} from '@fortawesome/free-solid-svg-icons'

const features = [
  {
    icon: faUserTie,
    title: 'I Want More Than Conventional Mutual Funds',
    description: ' For investors looking beyond traditional mutual fund strategies and seeking a more specialized approach.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    delay: 0,
  },
  {
    icon: faShieldHalved,
    title: ' I Have a Specific Investment View',
    description: ' When I have a strong view on a particular market, sector, theme, or investment strategy, I may want a fund built around that view.',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    delay: 0.1,
  },
  {
    icon: faChartLine,
    title: ' I Want to Diversify Beyond My Existing Portfolio',
    description: 'An SIF can add a differentiated strategy to an existing portfolio instead of relying entirely on conventional equity or debt funds.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    delay: 0.2,
  },
  {
    icon: faHandshake,
    title: 'I Want Professional Management for a More Specialized Strategy',
    description: ' I can access a focused investment strategy managed by professional fund managers rather than trying to execute a complex strategy myself.',
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    delay: 0.3,
  },
]

export default function WhyChoose() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="why-choose" className="py-20 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
            🧠 Know Before You Invest
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Is SIF the <span className="gradient-text">right investment for you?</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            SIF may be the right investment tool for you if you want specialized & focussed investment strategies, have a higher risk appetite, and are looking to diversify beyond traditional mutual funds.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: f.delay, duration: 0.6 }}
              className="bg-white rounded-3xl p-7 border border-[#e8edf7] shadow-lg shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-300 group cursor-pointer">

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <FontAwesomeIcon icon={f.icon} className="text-white text-xl" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#032e92] transition-colors">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                {f.description}
              </p>

              {/* Bottom accent */}
              {/* <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${f.color} rounded-full mt-5 transition-all duration-500`} /> */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
