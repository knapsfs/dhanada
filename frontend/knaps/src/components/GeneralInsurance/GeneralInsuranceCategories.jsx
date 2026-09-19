import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar,
  faHeartPulse,
  faHouseChimney,
  faPlaneDeparture,
  faPersonFallingBurst,
  faBuildingColumns,
  faArrowRight,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const CATEGORIES = [
  {
    id: "motor",
    title: "Motor Insurance",
    subtitle: "Car & Two-Wheeler Shield",
    badge: "Cashless at 14,000+ Garages",
    desc: "Comprehensive vehicle protection covering accidental damages, theft, natural calamities, third-party liability, and 24x7 roadside assistance.",
    icon: faCar,
    idealFor: "Car, bike, scooter, and commercial vehicle owners",
    benefits: [
      "Zero Depreciation (Bumper-to-Bumper) add-on",
      "Engine & Gearbox water-damage protection",
      "Return to Invoice (RTI) full refund cover",
      "Mandatory Third-Party liability coverage"
    ],
    accent: "border-blue-200 text-[#032e92] bg-blue-50"
  },
  {
    id: "health",
    title: "Health Insurance",
    subtitle: "Comprehensive Medical Care",
    badge: "10,000+ Network Hospitals",
    desc: "Defend against soaring medical inflation with extensive hospitalization cover, critical illness aid, day-care procedures, and annual wellness checks.",
    icon: faHeartPulse,
    idealFor: "Individuals, nuclear families, and senior citizen parents",
    benefits: [
      "100% Cashless hospitalization claims",
      "Pre & post-hospitalization medical bills",
      "No room-rent capping on select plans",
      "Tax deductions up to ₹75,000 u/s 80D"
    ],
    accent: "border-teal-200 text-teal-700 bg-teal-50"
  },
  {
    id: "home",
    title: "Home & Property Insurance",
    subtitle: "Structure & Valuables Cover",
    badge: "Fire & Natural Peril Shield",
    desc: "Guard your most precious real estate against fire, floods, earthquakes, pipe bursts, and burglary. Covers both structure and precious household contents.",
    icon: faHouseChimney,
    idealFor: "Homeowners, apartment dwellers, and tenants",
    benefits: [
      "Structure reconstruction cost reimbursement",
      "Electronic gadgets & appliance breakdown",
      "Jewelry and precious contents theft cover",
      "Alternative accommodation living allowance"
    ],
    accent: "border-emerald-200 text-emerald-700 bg-emerald-50"
  },
  {
    id: "travel",
    title: "Travel Insurance",
    subtitle: "Worldwide Journey Protection",
    badge: "Medical Abroad & Flight Delays",
    desc: "Travel internationally and domestically with absolute confidence. Protects against emergency overseas hospitalization, lost baggage, and trip cancellations.",
    icon: faPlaneDeparture,
    idealFor: "Leisure vacationers, business travelers, and students abroad",
    benefits: [
      "Cashless overseas emergency medical expenses",
      "Passport loss and document replacement aid",
      "Trip cancellation & flight delay compensation",
      "Schengen & US/UK visa-compliant policies"
    ],
    accent: "border-sky-200 text-sky-700 bg-sky-50"
  },
  {
    id: "accident",
    title: "Personal Accident Cover",
    subtitle: "24x7 Global Accident Shield",
    badge: "Permanent Disability Protection",
    desc: "Provides a guaranteed financial safety net in the event of unforeseen accidents, covering temporary or permanent disability, income loss, and accidental demise.",
    icon: faPersonFallingBurst,
    idealFor: "Working professionals, frequent commuters, and field operators",
    benefits: [
      "100% Sum assured on accidental demise",
      "Permanent total & partial disability payout",
      "Weekly income replacement during recovery",
      "Child education support grant rider"
    ],
    accent: "border-amber-200 text-amber-800 bg-amber-50"
  },
  {
    id: "commercial",
    title: "Commercial & Business Insurance",
    subtitle: "Enterprise Risk Shield",
    badge: "Corporate & Shopkeepers",
    desc: "Comprehensive liability and asset protection for SMEs, factories, retailers, startups, and enterprises against fire, transit damages, and cyber crimes.",
    icon: faBuildingColumns,
    idealFor: "Shops, offices, manufacturing units, and corporate directors",
    benefits: [
      "Standard Fire & Special Perils (SFSP)",
      "Marine cargo & goods-in-transit shield",
      "Directors & Officers (D&O) liability",
      "Cyber risk & professional indemnity cover"
    ],
    accent: "border-purple-200 text-purple-700 bg-purple-50"
  }
];

export default function GeneralInsuranceCategories() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 lg:py-24 bg-[#f7f9fc] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e8edf7] text-[#032e92] text-[11px] font-extrabold tracking-widest uppercase mb-4 shadow-sm">
            Core Verticals
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0a192f] tracking-tight leading-tight mb-5">
            Explore General <span className="text-[#032e92]">Insurance Categories</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-normal leading-relaxed">
            Protect your automobiles, residential property, health, global travel, and business enterprise with India’s highest-rated insurance plans.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {CATEGORIES.map((item, idx) => (
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
                    Recommended For:
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
                <span>Get {item.title.split(' ')[0]} Quote</span>
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
