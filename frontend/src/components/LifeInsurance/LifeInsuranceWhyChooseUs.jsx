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
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className=" gap-12 lg:gap-16 items-center">

          {/* Left Column: Heading & Feature Grid (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Why Partner with <span className="text-[#032e92]">KNAPS</span> for Life Insurance?
            </h2>

            <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed mb-8 mt-3.5">
              Insurance isn't just a document; it’s an emotional promise made to your family. We ensure that promise is fulfilled without friction, hidden clauses, or hassle.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              {REASONS.map((r, idx) => (
                <div
                  key={idx}
                  className="bg-[#f8fafc] p-6 rounded-2xl border border-[#e8edf7] hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 group"
                >

                  <h4 className="font-bold text-[#0a192f] text-base mb-2">{r.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">{r.desc}</p>
                </div>
              ))}
            </div>


          </motion.div>



        </div>
      </div>
    </section>
  );
}
