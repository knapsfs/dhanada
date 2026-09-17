import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandHoldingDollar,
  faHouseCircleCheck,
  faGraduationCap,
  faHeartCircleExclamation,
  faCircleCheck,
  faCircleXmark
} from '@fortawesome/free-solid-svg-icons';

const PILLARS = [
  {
    icon: faHandHoldingDollar,
    title: "Income Replacement",
    desc: "Replaces your economic value for 10–15 years, ensuring your dependents never have to compromise on day-to-day living standards or essentials.",
    highlight: "10-15x Annual Income",
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: faHouseCircleCheck,
    title: "Debt & Liability Shield",
    desc: "Prevents home loans, vehicle EMIs, business credit, and personal borrowings from transferring onto your grieving spouse or aging parents.",
    highlight: "100% Debt Clearance",
    color: "from-emerald-500 to-teal-600"
  },
  {
    icon: faGraduationCap,
    title: "Milestone Fulfillment",
    desc: "Secures dedicated funding for your children’s higher education, dream careers, and weddings, keeping their life trajectory completely intact.",
    highlight: "Guaranteed Milestones",
    color: "from-amber-500 to-orange-600"
  },
  {
    icon: faHeartCircleExclamation,
    title: "Living Critical Illness Aid",
    desc: "Optional riders deliver instant lump sum payouts upon diagnosis of 30+ critical illnesses, funding treatment without liquidating your investments.",
    highlight: "Living Health Benefits",
    color: "from-rose-500 to-red-600"
  }
];

export default function WhyLifeInsurance() {
  return (
    <section className="py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-[11px] font-extrabold tracking-widest uppercase mb-4">
            Financial Safety Net
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0a192f] tracking-tight leading-tight mb-5">
            Why Is Life Insurance <span className="text-[#032e92]">Non-Negotiable?</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-normal leading-relaxed">
            Your earnings build your family’s standard of living. Life insurance is the sole financial tool created to safeguard that future if life takes an unexpected turn.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PILLARS.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#f8fafc] rounded-3xl p-6 sm:p-7 border border-[#e8edf7] hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#032e92] mb-5 group-hover:scale-110 transition-transform duration-300 border border-[#e8edf7]">
                  <FontAwesomeIcon icon={pillar.icon} className="text-xl" />
                </div>

                <span className="inline-block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {pillar.highlight}
                </span>

                <h3 className="text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors leading-snug">
                  {pillar.title}
                </h3>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/70 flex items-center gap-1.5 text-[11px] font-bold text-[#032e92]">
                <span>Pillar 0{idx + 1}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 font-semibold">Core Protection</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparative Contrast Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#0a192f] to-[#021d63] text-white rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
            {/* Without Insurance */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 text-rose-400 font-bold text-base mb-4">
                <FontAwesomeIcon icon={faCircleXmark} className="text-xl" />
                <span>Without Adequate Life Cover</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-gray-300 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Sudden cessation of household income and rapid depletion of life savings.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Distress sale of property, gold, or shares to pay off home loans and EMIs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Compromised educational quality and postponed aspirations for children.</span>
                </li>
              </ul>
            </div>

            {/* With KNAPS Life Shield */}
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20 shadow-inner">
              <div className="flex items-center gap-3 text-emerald-300 font-bold text-base mb-4">
                <FontAwesomeIcon icon={faCircleCheck} className="text-xl" />
                <span>With a KNAPS Life Shield</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-blue-50 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-300 font-bold">✓</span>
                  <span>Guaranteed tax-free lump sum corpus + monthly replacement income.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-300 font-bold">✓</span>
                  <span>Instant liability clearance without touching family assets or long-term wealth.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-300 font-bold">✓</span>
                  <span>Complete lifestyle continuity and fulfilled dreams as planned, uninterrupted.</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
