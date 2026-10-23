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
      dateTop: "Est.",
      dateMiddle: "1996",
      dateBottom: "Foundation",
      title: "Established KNAPS Financial Services",
      desc: "Founded by Ms. Neelam Sawhney with a mission to bring structured financial planning and clarity to family life goals.",
      icon: faBuilding,
      badge: "Foundation"
    },
    {
      year: "2012",
      dateTop: "Scale",
      dateMiddle: "2012",
      dateBottom: "₹100 Cr+ AUM",
      title: "100 cr+ AUM",
      desc: "Crossed ₹100 Crore in Assets Under Management, established through consistent compounding and long-term investor trust.",
      icon: faChartLine,
      badge: "Scale & Growth"
    },
    {
      year: "2016",
      dateTop: "Award",
      dateMiddle: "2016",
      dateBottom: "HDFC Winner",
      title: "Winner Noble White Upper Crust Awards HDFC",
      desc: "Conferred with the prestigious Noble White Upper Crust Award by HDFC, recognizing excellence in client wealth advisory.",
      icon: faAward,
      badge: "Industry Award"
    },
    {
      year: "2020",
      dateTop: "Trust",
      dateMiddle: "2020",
      dateBottom: "1,000+ Clients",
      title: "1,000+ Investors",
      desc: "Expanded our trusted family of investors to more than 1,000 satisfied clients navigating life-stage financial independence.",
      icon: faUsers,
      badge: "Community Trust"
    },
    {
      year: "2026",
      dateTop: "Corp.",
      dateMiddle: "2026",
      dateBottom: "Pvt. Ltd.",
      title: "KNAPS Private Limited",
      desc: "Incorporated into KNAPS Private Limited, stepping into the next era with enhanced institutional capabilities and governance.",
      icon: faBriefcase,
      badge: "Corporate Milestone"
    },
    {
      year: "Going Forward",
      dateTop: "Future",
      dateMiddle: "2026+",
      dateBottom: "New Bouquet",
      title: "Added New Products for Investors",
      desc: "Enriched our investment bouquet with advanced and structured strategies - NPS, SIF, PMS, & AIF for high-conviction wealth creation.",
      icon: faBoxesStacked,
      badge: "NPS • SIF • PMS • AIF"
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#f8fafc] relative overflow-hidden border-t border-b border-gray-100">
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
              Our Journey &amp; Milestones
            </span>
          </motion.div>

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
            className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-gray-400"
          >
            Three decades of disciplined wealth advisory &amp; family trust
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
                  className={`relative flex items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Card Container (Takes half width on md+, full width on mobile) */}
                  <div
                    className={`w-full md:w-1/2 ${
                      isEven
                        ? 'pl-14 md:pl-0 md:pr-10 lg:pr-12'
                        : 'pl-14 md:pl-10 lg:pl-12 md:pr-0'
                    }`}
                  >
                    {/* The Milestone Card */}
                    <div className="relative bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex items-stretch overflow-hidden group">

                      {/* Desktop pointer for Left card (points right toward center line) */}
                      {isEven ? (
                        <div
                          className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-l-[8px] border-l-gray-50 drop-shadow-[1px_0_1px_rgba(0,0,0,0.06)] z-20"
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

                      {/* Main Narrative Content Area */}
                      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-6 h-6 rounded-md bg-[#eef5ff] text-[#032e92] flex items-center justify-center text-xs shrink-0">
                            <FontAwesomeIcon icon={item.icon} />
                          </span>
                          <span className="text-[11px] font-bold text-[#032e92] uppercase tracking-wider">
                            {item.badge}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed mt-1">
                          {item.desc}
                        </p>
                      </div>

                      {/* Date Compartment on Right */}
                      <div className="w-20 sm:w-24 shrink-0 flex flex-col items-center justify-center text-center p-3 sm:p-4 bg-gray-50 border-l border-gray-100 select-none">
                        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          {item.dateTop}
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight my-0.5 group-hover:text-[#032e92] transition-colors">
                          {item.dateMiddle}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                          {item.dateBottom}
                        </span>
                      </div>

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
