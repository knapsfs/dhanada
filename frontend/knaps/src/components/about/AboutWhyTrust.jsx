import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faBullseye,
  faChartLine,
  faAward
} from '@fortawesome/free-solid-svg-icons';

export default function AboutWhyTrust() {
  const trustPillars = [
    {
      icon: faShieldHalved,
      title: "Confidentiality",
      description: "Your financial information stays completely private and secure.",
      tag: "Data Privacy"
    },
    {
      icon: faBullseye,
      title: "Right Recommendation",
      description: "We recommend schemes based strictly on your life goals and risk appetite.",
      tag: "Goal Aligned"
    },
    {
      icon: faChartLine,
      title: "Guidance Through Market Cycles",
      description: "We stay with you through financial ups & downs across every cycle.",
      tag: "Continuous Support"
    },
    {
      icon: faAward,
      title: "30+ Years of Experience",
      description: "Decades of deep advisory experience across market cycles and investments.",
      tag: "Since 1996"
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm mb-4"
          >
            <span className="text-[#032e92] text-xs font-bold tracking-widest uppercase">
              Why Investors Trust Us
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-black tracking-tight leading-tight max-w-4xl mx-auto mb-3"
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
            Our advisory practice is anchored on integrity, fiduciary duty, and a long-term partnership with you.
          </motion.p>
        </div>

        {/* 4 Pillars Non-Boxy Architectural Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-0 lg:divide-x lg:divide-gray-200">
          {trustPillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="lg:px-8 first:lg:pl-0 last:lg:pr-0 flex flex-col justify-between group"
            >
              <div>
                {/* Pillar Index & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#eef5ff] text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white transition-all duration-300 flex items-center justify-center text-lg shadow-sm">
                    <FontAwesomeIcon icon={pillar.icon} />
                  </div>
                  <span className="text-xs font-bold text-gray-300 group-hover:text-[#032e92] font-mono tracking-widest transition-colors">
                    0{idx + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-black tracking-tight leading-snug mb-2 group-hover:text-[#032e92] transition-colors">
                  {pillar.title}
                </h3>

                {/* Description (clean one-liner, detail removed) */}
                <p className="text-sm text-gray-600 font-normal leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Subtle interactive accent bar */}
              <div className="h-0.5 w-8 bg-gray-200 group-hover:w-16 group-hover:bg-[#032e92] transition-all duration-300 mt-6 rounded-full" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
