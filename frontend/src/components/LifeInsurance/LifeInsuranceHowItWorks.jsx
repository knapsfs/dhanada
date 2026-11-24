import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faScaleBalanced,
  faFileCircleCheck,
  faHandsHoldingChild
} from '@fortawesome/free-solid-svg-icons';

const STEPS = [
  {
    step: "01",
    icon: faCalculator,
    title: "Calculate Ideal Cover",
    desc: "Determine your Human Life Value (HLV) considering annual income, loans, child milestones, and living costs."
  },
  {
    step: "02",
    icon: faScaleBalanced,
    title: "Compare Top Insurers",
    desc: "Review claim settlement ratios, solvency margins, rider costs, and pricing across leading IRDAI-regulated insurers."
  },
  {
    step: "03",
    icon: faFileCircleCheck,
    title: "Digital Paperless Setup",
    desc: "Complete online documentation, health declarations, and doorstep or tele-medical checkup seamlessly."
  },
  {
    step: "04",
    icon: faHandsHoldingChild,
    title: "Lifetime Claim Assurance",
    desc: "Your policy is activated, and KNAPS guarantees end-to-end claim settlement assistance for your nominee forever."
  }
];

export default function LifeInsuranceHowItWorks() {
  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900">
            How It Works: <span className="text-[#032e92]">Frictionless Protection</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5">
            From initial requirement estimation to seamless policy issuance and lifelong claim support, getting protected is straightforward.
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-[#e8edf7] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-gray-200 group-hover:text-[#032e92] transition-colors">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#f7f9fc] text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white transition-all duration-300 flex items-center justify-center text-lg shadow-sm border border-[#e8edf7]">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#0a192f] mb-2.5 group-hover:text-[#032e92] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-[#032e92]">
                <span>Stage {item.step}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-400 font-medium">Clear & Verified</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
