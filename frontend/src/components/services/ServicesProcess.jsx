import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass, faSliders, faBolt, faChartLine } from '@fortawesome/free-solid-svg-icons';

const STEPS = [
  {
    step: "01",
    title: "Discovery & Goal Mapping",
    desc: "We analyze your financial situation, target milestones, liquidity requirements, and risk tolerance.",
    icon: faCompass,
  },
  {
    step: "02",
    title: "Tailored Asset Allocation",
    desc: "Structuring a diversified portfolio across equities, debt, protection, and specialized funds.",
    icon: faSliders,
  },
  {
    step: "03",
    title: "Frictionless Execution",
    desc: "Completely paperless setup, seamless transaction processing, and automated tracking.",
    icon: faBolt,
  },
  {
    step: "04",
    title: "Continuous Monitoring",
    desc: "Regular portfolio health audits, performance reviews, and proactive rebalancing when needed.",
    icon: faChartLine,
  }
];

export default function ServicesProcess() {
  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden border-t border-[#e8edf7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-[11px] font-extrabold tracking-widest uppercase mb-4">
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight leading-tight mb-4">
            Our 4-Step Advisory Framework
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-normal">
            A disciplined, goal-oriented process designed to turn your financial dreams into predictable reality.
          </p>
        </div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#f8fafc] rounded-3xl p-6 sm:p-7 border border-[#e8edf7] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-2xl font-black text-gray-300 group-hover:text-[#032e92] transition-colors">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white transition-colors duration-200">
                    <FontAwesomeIcon icon={item.icon} className="text-sm" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#0a192f] mb-2 leading-snug group-hover:text-[#032e92] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center gap-1.5 text-[11px] font-bold text-[#032e92]">
                <span>Stage {idx + 1}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 font-semibold">Structured Advisory</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
