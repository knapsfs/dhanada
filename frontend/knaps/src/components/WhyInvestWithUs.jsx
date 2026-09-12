import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChartColumn, faCube } from '@fortawesome/free-solid-svg-icons';

const metrics = [
  {
    icon: faUsers,
    label: 'Investors',
    value: '1000+',
  },
  {
    icon: faChartColumn,
    label: 'AUM',
    value: '200CR +',
  },
  {
    icon: faCube,
    label: 'Products',
    value: '49',
  },
];

export default function WhyInvestWithUs() {
  return (
    <section className="py-14 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Header Tag */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-xs sm:text-[13px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-3"
        >
          WHY INVEST WITH US
        </motion.p>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#032e92] tracking-tight leading-tight max-w-4xl mx-auto"
        >
          Build, protect, and grow your wealth with confidence
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5"
        >
          We guide you to stay invested with patience and discipline, allowing the power of compounding to grow your wealth exponentially.
        </motion.p>

        {/* Metrics Row + Doodle */}
        <div className="mt-10 sm:mt-12 flex items-center justify-center relative max-w-4xl mx-auto">
          
          {/* Subtle playful annotation on the left */}
          <div className="hidden lg:flex flex-col items-end absolute -left-20 top-2 opacity-50 select-none pointer-events-none -rotate-6">
            <span className="text-[11px] font-bold text-gray-400 italic tracking-wide leading-tight text-right">
              More<br />Milestones<br />Ahead
            </span>
            <svg
              className="w-10 h-7 text-gray-400 mt-1 transform translate-x-2 translate-y-1"
              viewBox="0 0 40 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 5 6 Q 22 2 30 18" />
              <path d="M 23 18 L 30 19 L 28 12" />
            </svg>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl">
            {metrics.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5 px-6 py-4 sm:py-5 flex items-center gap-4 hover:shadow-2xl hover:border-blue-100 transition-all duration-300"
              >
                {/* Circular Icon Pill */}
                <div className="w-12 h-12 rounded-full bg-[#f0f6ff] text-[#032e92] flex items-center justify-center text-lg flex-shrink-0 shadow-xs">
                  <FontAwesomeIcon icon={item.icon} />
                </div>

                {/* Text Labels */}
                <div className="text-left">
                  <p className="text-xs font-semibold text-gray-500">
                    {item.label}
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight mt-0.5">
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
