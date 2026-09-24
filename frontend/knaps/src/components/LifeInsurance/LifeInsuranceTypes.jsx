import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faChartLine,
  faPiggyBank,
  faInfinity,
  faGraduationCap,
  faPersonWalkingLuggage,
  faArrowRight,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const TYPES = [
  {
    id: "term",
    title: "Term Insurance",
    subtitle: "Pure Protection",
    badge: "Highest Cover, Lowest Cost",
    desc: "The gold standard of family protection. Provides an extensive financial cover (e.g. ₹1 Cr+) for a specific tenure at affordable premiums.",
    icon: faShieldHalved,
    idealFor: "Primary income earners, young professionals, and families with loans",
    benefits: [
      "Maximum life cover at nominal cost",
      "Critical illness & disability riders",
      "Lump sum or monthly income payouts",
      "Optional Return of Premium (TROP)"
    ],
    accent: "border-blue-200 text-[#032e92] bg-blue-50"
  },
  {
    id: "ulip",
    title: "ULIP (Unit Linked Plans)",
    subtitle: "Investment + Life Cover",
    badge: "Dual Benefit",
    desc: "Combines life insurance protection with equity and debt market wealth creation. Offers flexibility to switch funds as markets evolve.",
    icon: faChartLine,
    idealFor: "Investors seeking market returns alongside a life protection shield",
    benefits: [
      "Dual benefit of investment & cover",
      "Free switches between equity & debt",
      "Tax-exempt returns under Sec 10(10D)",
      "Systematic fund allocation options"
    ],
    accent: "border-purple-200 text-purple-700 bg-purple-50"
  },
  {
    id: "endowment",
    title: "Endowment & Savings Plans",
    subtitle: "Guaranteed Payouts",
    badge: "Assured Wealth",
    desc: "A traditional insurance cum savings vehicle that offers guaranteed maturity benefits plus bonuses, shielding capital from market fluctuations.",
    icon: faPiggyBank,
    idealFor: "Risk-averse individuals looking for guaranteed returns and savings",
    benefits: [
      "Guaranteed maturity sum assured",
      "Life cover throughout policy tenure",
      "Bonuses and loyalty additions",
      "Loan facility against policy value"
    ],
    accent: "border-emerald-200 text-emerald-700 bg-emerald-50"
  },
  {
    id: "whole-life",
    title: "Whole Life Insurance",
    subtitle: "Lifetime Umbrella",
    badge: "Up to Age 99/100",
    desc: "Provides lifelong protection rather than a limited term. Perfect for leaving behind a substantial, tax-free legacy for the next generation.",
    icon: faInfinity,
    idealFor: "Estate planning, inter-generational legacy, and lifetime dependents",
    benefits: [
      "Protection up to 99 or 100 years",
      "Generational wealth transfer",
      "Tax-free inheritance for nominees",
      "Consistent lifelong security"
    ],
    accent: "border-amber-200 text-amber-800 bg-amber-50"
  },
  {
    id: "child-plan",
    title: "Child Education Plans",
    subtitle: "Future Milestone Shield",
    badge: "Guaranteed Career Corpus",
    desc: "Specifically structured to fund university degrees and career milestones. Features waiver of premium to ensure funding continues even upon parent's demise.",
    icon: faGraduationCap,
    idealFor: "Parents wanting to secure their child’s overseas or higher education",
    benefits: [
      "Scheduled milestone-based payouts",
      "Waiver of Premium (WOP) rider",
      "Inflation-adjusted corpus target",
      "Disciplined long-term growth"
    ],
    accent: "border-rose-200 text-rose-700 bg-rose-50"
  },
  {
    id: "annuity",
    title: "Retirement & Annuity Plans",
    subtitle: "Lifelong Regular Income",
    badge: "Guaranteed Pension",
    desc: "Transforms your accumulated retirement nest egg into a regular, reliable lifelong monthly pension to ensure uninterrupted financial independence.",
    icon: faPersonWalkingLuggage,
    idealFor: "Individuals approaching retirement desiring steady lifelong cashflow",
    benefits: [
      "Guaranteed monthly or annual payouts",
      "Single or joint-life pension options",
      "Return of purchase price to heirs",
      "Zero market volatility post retirement"
    ],
    accent: "border-teal-200 text-teal-700 bg-teal-50"
  }
];

export default function LifeInsuranceTypes() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e8edf7] text-[#032e92] text-[11px] font-extrabold tracking-widest uppercase mb-4 shadow-sm">
            Categories & Options
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0a192f] tracking-tight leading-tight mb-5">
            Explore Types of <span className="text-[#032e92]">Life Insurance</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-normal leading-relaxed">
            Every financial journey is distinct. Compare the major life insurance categories to find the ideal policy matching your family's protection and wealth goals.
          </p>
        </div>

        {/* Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {TYPES.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-white rounded-3xl p-7 border border-[#e8edf7] hover:border-[#032e92]/30 shadow-sm hover:shadow-xl hover:shadow-blue-900/8 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top Row: Icon & Badge */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${item.accent} flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200/80">
                    {item.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-xl font-bold text-[#0a192f] group-hover:text-[#032e92] transition-colors mb-1 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-[#032e92] mb-3 uppercase tracking-wider">
                  {item.subtitle}
                </p>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed font-medium mb-5">
                  {item.desc}
                </p>

                {/* Ideal For Pill */}
                <div className="bg-[#f8fafc] rounded-xl p-3 border border-[#e8edf7] mb-6">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Ideal For:
                  </p>
                  <p className="text-xs text-gray-700 font-semibold leading-relaxed">
                    {item.idealFor}
                  </p>
                </div>

                {/* Key Benefits Checklist */}
                <div className="space-y-2.5 mb-7">
                  {item.benefits.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                      <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[9px] flex-shrink-0">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={openLeadModal}
                className="btn-ripple w-full py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-md hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group/btn"
              >
                <span>Compare {item.title.split(' ')[0]} Plans</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-xs group-hover/btn:translate-x-1 transition-transform"
                />
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
