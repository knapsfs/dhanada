import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHeart,
  faReceipt,
  faHeartPulse,
  faMoneyBillTrendUp,
  faClockRotateLeft,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

const BENEFITS = [
  {
    icon: faShieldHeart,
    title: "Financial Independence",
    subtitle: "Dignity for Dependents",
    desc: "Provides a guaranteed financial cushion so your spouse, children, or aging parents never have to compromise their dignity or aspirations.",
    tag: "Family First"
  },
  {
    icon: faReceipt,
    title: "Triple Tax Shield",
    subtitle: "Sec 80C, 80D & 10(10D)",
    desc: "Deduct premiums up to ₹1.5 Lakh under 80C, health riders under 80D, and receive 100% tax-free claim payouts under Section 10(10D).",
    tag: "Max Tax Saving"
  },
  {
    icon: faHeartPulse,
    title: "Comprehensive Living Riders",
    subtitle: "Accident & Critical Illness",
    desc: "Fortify your base cover with accelerated payouts for heart, cancer, stroke, and permanent disability without cancelling life cover.",
    tag: "360° Safety"
  },
  {
    icon: faMoneyBillTrendUp,
    title: "Customized Payout Options",
    subtitle: "Lump Sum or Monthly Income",
    desc: "Structure payouts as a 100% immediate lump sum, fixed monthly income stream, or a blend to replicate your monthly paycheck.",
    tag: "Flexible Claims"
  },
  {
    icon: faClockRotateLeft,
    title: "Lock-in Rock-Bottom Rates",
    subtitle: "Lifetime Premium Freeze",
    desc: "Lock in an unchanging premium for 30 to 40 years. Securing cover in your 20s or early 30s saves up to 60% compared to buying later.",
    tag: "Start Early Edge"
  },
  {
    icon: faChartLine,
    title: "Inflation-Proof Cover",
    subtitle: "Increasing Sum Assured",
    desc: "Optionally increase your life cover by 5% to 10% annually automatically to protect against escalating living costs over decades.",
    tag: "Future Ready"
  }
];

export default function LifeInsuranceBenefits() {
  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-[11px] font-extrabold tracking-widest uppercase mb-4">
            Key Advantages
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0a192f] tracking-tight leading-tight mb-4">
            The Multi-Dimensional Benefits of <span className="text-[#032e92]">Life Cover</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-normal leading-relaxed">
            Beyond pure death benefit protection, modern life insurance provides robust tax efficiency, living health benefits, and flexible wealth continuity.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {BENEFITS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-[#f8fafc] rounded-3xl p-7 border border-[#e8edf7] hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white transition-all duration-300 border border-[#e8edf7]">
                    <FontAwesomeIcon icon={item.icon} className="text-lg" />
                  </div>
                  <span className="text-[10px] font-bold text-[#032e92] bg-[#eef4ff] px-3 py-1 rounded-full border border-blue-100">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0a192f] group-hover:text-[#032e92] transition-colors mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
                  {item.subtitle}
                </p>

                <p className="text-gray-600 text-sm leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/70 flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>Feature {idx + 1}</span>
                <span className="text-[#032e92] font-bold">100% Tax Efficient</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
