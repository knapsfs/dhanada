import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faBullseye,
  faChartLine,
  faAward,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

export default function AboutWhyTrust() {
  const trustPillars = [
    {
      icon: faShieldHalved,
      title: "Confidentiality",
      description: "Your financial information stays private.",
      detail: "We follow rigorous data privacy and confidentiality standards so you can plan your wealth with complete peace of mind.",
      tag: "Data Privacy"
    },
    {
      icon: faBullseye,
      title: "Right Recommendation",
      description: "We recommend schemes based on your goals and needs.",
      detail: "Zero product bias. We align every scheme and instrument precisely with your target timeline, liquidity requirements, and risk appetite.",
      tag: "Goal Aligned"
    },
    {
      icon: faChartLine,
      title: "Guidance Through Financial Ups & Downs",
      description: "We stay with you through every market cycle.",
      detail: "Bull runs or market corrections, our team provides calm perspective, disciplined rebalancing, and steady guidance.",
      tag: "Every Market Cycle"
    },
    {
      icon: faAward,
      title: "30+ Years of Experience",
      description: "Decades of experience across market cycles and investments.",
      detail: "Three decades of deep industry domain expertise, serving multiple generations of satisfied families across India.",
      tag: "Since 1996"
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#f8fafc] relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-xs sm:text-sm mb-4 uppercase tracking-wider"
          >
            Why Thousands of Investors Trust Us
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-black tracking-tight leading-tight max-w-4xl mx-auto mb-4"
          >
            Principles That Guide <span className="text-[#032e92]">Every Recommendation</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
          >
            Our advisory practice is anchored on integrity, fiduciary duty, and long-term partnership with you.
          </motion.p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {trustPillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-[#032e92]/30 border border-gray-100 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[#eef5ff] text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white transition-colors flex items-center justify-center text-base shadow-sm">
                    <FontAwesomeIcon icon={pillar.icon} />
                  </div>
                  <span className="text-xs font-semibold text-[#032e92] bg-[#eef5ff] px-3 py-1 rounded-full uppercase tracking-wider">
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-black mb-1.5 leading-snug">
                  {pillar.title}
                </h3>

                <p className="text-sm font-semibold text-[#032e92] mb-2 leading-relaxed">
                  {pillar.description}
                </p>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {pillar.detail}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-gray-50 flex items-center gap-2 text-xs font-semibold text-gray-500">
                <FontAwesomeIcon icon={faCheck} className="text-[#032e92] text-xs" />
                <span>Client-First Standard</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
