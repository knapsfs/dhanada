import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faHandsHolding,
  faFileCircleCheck,
  faChartPie,
  faCheckCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const REASONS = [
  {
    icon: faShieldHalved,
    title: "Unbiased Insurer Comparisons",
    desc: "We analyze top IRDAI-registered insurers (LIC, HDFC Life, ICICI Prudential, Max Life, Tata AIA) based strictly on claim track record and cost."
  },
  {
    icon: faHandsHolding,
    title: "Dedicated Claim Support Guarantee",
    desc: "When it matters most, our dedicated claims desk assists your family in document submission, insurer liaison, and 100% claim settlement."
  },
  {
    icon: faFileCircleCheck,
    title: "Zero-Rejection Disclosure Aid",
    desc: "Most rejected claims arise from incomplete medical disclosures. We assist in accurate health declarations ensuring claim certainty."
  },
  {
    icon: faChartPie,
    title: "Holistic Wealth Integration",
    desc: "Your life cover is tailored in synergy with your SIPs, investments, and home loan liabilities for comprehensive financial harmony."
  }
];

export default function LifeInsuranceWhyChooseUs() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading & Feature Grid (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-[11px] font-extrabold tracking-widest uppercase mb-4">
              The KNAPS Distinction
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0a192f] tracking-tight leading-tight mb-6">
              Why Partner with <span className="text-[#032e92]">KNAPS</span> for Life Insurance?
            </h2>

            <p className="text-gray-600 text-base sm:text-lg font-normal leading-relaxed mb-10">
              Insurance isn't just a document; it’s an emotional promise made to your family. We ensure that promise is fulfilled without friction, hidden clauses, or hassle.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              {REASONS.map((r, idx) => (
                <div
                  key={idx}
                  className="bg-[#f8fafc] p-6 rounded-2xl border border-[#e8edf7] hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white transition-all duration-200 flex items-center justify-center text-base mb-4 border border-[#e8edf7]">
                    <FontAwesomeIcon icon={r.icon} />
                  </div>
                  <h4 className="font-bold text-[#0a192f] text-base mb-2">{r.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">{r.desc}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={openLeadModal}
              className="btn-ripple bg-gradient-to-r from-[#032e92] to-[#021d63] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 text-[15px] flex items-center gap-2 cursor-pointer"
            >
              <span>Schedule Free Insurance Audit</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </button>
          </motion.div>

          {/* Right Column: Trust Image & Guarantee Badge (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/4.8] shadow-2xl shadow-blue-900/10 border border-[#e8edf7]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                alt="KNAPS Insurance Advisory"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 via-[#0a192f]/20 to-transparent" />

              {/* Floating Guarantee Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/60">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xl shadow-md">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <div>
                    <p className="text-[#0a192f] font-black text-xl leading-tight">100% Claim Support</p>
                    <p className="text-gray-500 text-xs font-semibold mt-0.5">We stand by your nominee forever</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
