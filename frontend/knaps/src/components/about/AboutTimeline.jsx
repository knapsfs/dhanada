import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faChartLine,
  faAward,
  faUsers,
  faBriefcase,
  faBoxesStacked
} from '@fortawesome/free-solid-svg-icons';

export default function AboutTimeline() {
  const milestones = [
    {
      year: "1996",
      title: "Established KNAPS Financial Services",
      desc: "Founded by Ms. Neelam Sawhney with a mission to bring structured financial planning and clarity to family life goals.",
      icon: faBuilding,
      badge: "Foundation"
    },
    {
      year: "2012",
      title: "100 cr+ AUM",
      desc: "Crossed ₹100 Crore in Assets Under Management, established through consistent compounding and long-term investor trust.",
      icon: faChartLine,
      badge: "Scale & Growth"
    },
    {
      year: "2016",
      title: "Winner Noble White Upper Crust Awards HDFC",
      desc: "Conferred with the prestigious Noble White Upper Crust Award by HDFC, recognizing excellence in client wealth advisory.",
      icon: faAward,
      badge: "Industry Award"
    },
    {
      year: "2020",
      title: "1000+ investors",
      desc: "Expanded our trusted family of investors to more than 1,000 satisfied clients navigating life-stage financial independence.",
      icon: faUsers,
      badge: "Community Trust"
    },
    {
      year: "2026",
      title: "KNAPS Private Limited",
      desc: "Incorporated into KNAPS Private Limited, stepping into the next era with enhanced institutional capabilities and governance.",
      icon: faBriefcase,
      badge: "Corporate Milestone"
    },
    {
      year: "Going Forward",
      title: "Added New Products for Investors",
      desc: "Enriched our investment bouquet with advanced and structured strategies - NPS, SIF, PMS, & AIF for high-conviction wealth creation.",
      icon: faBoxesStacked,
      badge: "NPS • SIF • PMS • AIF"
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-xs sm:text-sm mb-4 uppercase tracking-wider"
          >
            Timeline & Journey
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-black tracking-tight leading-tight max-w-4xl mx-auto mb-4"
          >
            Milestones of <span className="text-[#032e92]">Trust & Progress</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
          >
            Three decades of disciplined wealth advisory, industry recognition, and pioneering solutions for families.
          </motion.p>
        </div>

        {/* Timeline Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {milestones.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="relative rounded-2xl p-6 sm:p-7 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#032e92]/30 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#032e92]">
                    {item.year}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#eef5ff] text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white transition-colors flex items-center justify-center text-sm shadow-sm">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#eef5ff] text-[#032e92] text-[11px] font-semibold uppercase tracking-wider mb-2.5">
                  {item.badge}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-black mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              {/* Step indicator footer */}
              <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400">
                <span>Phase 0{idx + 1}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#032e92] transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
