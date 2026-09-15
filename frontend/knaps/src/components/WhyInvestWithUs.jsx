import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChartColumn, faCube } from '@fortawesome/free-solid-svg-icons';
import Stats from './Stats';

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
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

        {/* Header Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-2 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-sm mb-4 uppercase tracking-wider"
        >
          Why Invest With Us
        </motion.div>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-black tracking-tight leading-tight max-w-4xl mx-auto"
        >
          Build, protect, and grow your <span className="text-[#032e92] block sm:inline">wealth with confidence</span>
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

        <Stats className="pt-8 sm:pt-10" />
      </div>
    </section>
  );
}
