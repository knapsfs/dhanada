import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faChartLine,
  faAward,
  faUsers,
  faBriefcase,
  faArrowTrendUp
} from '@fortawesome/free-solid-svg-icons';

export default function AboutTimeline() {
  const milestones = [
    {
      year: "1996",
      title: "Established KNAPS Financial Services",
      icon: faBuilding,
    },
    {
      year: "2016",
      title: "Winner Noble White Upper Crust Awards HDFC",
      icon: faAward,
    },
    {
      year: "2020",
      title: "1000+ investors",
      icon: faUsers,
    },
    {
      year: "2022",
      title: "100 cr+ AUM",
      icon: faChartLine,
    },
    {
      year: "2025",
      title: "200 cr+ AUM",
      icon: faArrowTrendUp,
    },
    {
      year: "2026",
      title: "KNAPS Private Limited",
      icon: faBriefcase,
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#f8fafc] relative overflow-hidden border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-black tracking-tight leading-tight max-w-4xl mx-auto mb-3"
          >
            Milestones of <span className="text-[#032e92]">Trust &amp; Progress</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
          >
            Three decades of financial experience & family trust.
          </motion.p>
        </div>

        {/* Vertical Alternating Timeline Container */}
        <div className="relative max-w-5xl mx-auto">

          {/* Central Vertical Timeline Line */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 -translate-x-1/2 w-[3px] bg-gray-200 rounded-full" />

          {/* Milestones Items */}
          <div className="space-y-8 sm:space-y-12">
            {milestones.map((item, idx) => {
              const isEven = idx % 2 === 0; // Even items on left on desktop, odd on right

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Card Container (Takes half width on md+, full width on mobile) */}
                  <div
                    className={`w-full md:w-1/2 ${isEven
                      ? 'pl-14 md:pl-0 md:pr-10 lg:pr-12'
                      : 'pl-14 md:pl-10 lg:pl-12 md:pr-0'
                      }`}
                  >
                    {/* The Milestone Card */}
                    <div className="relative bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-[#032e92]/30 transition-all duration-300 p-5 sm:p-6 overflow-hidden group">

                      {/* Desktop pointer for Left card (points right toward center line) */}
                      {isEven ? (
                        <div
                          className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-l-[8px] border-l-white drop-shadow-[1px_0_1px_rgba(0,0,0,0.06)] z-20"
                        />
                      ) : (
                        /* Desktop pointer for Right card (points left toward center line) */
                        <div
                          className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-r-[8px] border-r-white drop-shadow-[-1px_0_1px_rgba(0,0,0,0.06)] z-20"
                        />
                      )}

                      {/* Mobile pointer (always on left side pointing towards mobile vertical line) */}
                      <div
                        className="md:hidden absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-r-[8px] border-r-white drop-shadow-[-1px_0_1px_rgba(0,0,0,0.06)] z-20"
                      />

                      {/* Year & Icon Row above Title */}
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <span className="text-xl sm:text-2xl font-bold text-[#032e92] tracking-tight">
                          {item.year}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-[#eef4ff] text-[#032e92] flex items-center justify-center text-xs shrink-0 group-hover:bg-[#032e92] group-hover:text-white transition-colors duration-200">
                          <FontAwesomeIcon icon={item.icon} />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight leading-snug group-hover:text-[#032e92] transition-colors">
                        {item.title}
                      </h3>

                    </div>
                  </div>

                  {/* Central Node Dot on Timeline */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#032e92] border-[3px] border-white shadow-md ring-2 ring-[#032e92]/20" />
                  </div>

                  {/* Empty Spacer for desktop alternating alignment */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
