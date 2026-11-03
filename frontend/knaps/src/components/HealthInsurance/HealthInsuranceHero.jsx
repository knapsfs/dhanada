import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faHeartPulse,
  faShieldHeart,
  faCheckCircle,
  faArrowRight,
  faCalculator,
  faHospital,
  faClock,
  faPercent,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function HealthInsuranceHero() {
  const { openLeadModal } = useLeadModal();

  const scrollToCalculator = () => {
    const el = document.getElementById('health-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToExplorer = () => {
    const el = document.getElementById('coverage-explorer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#f0f4fc] via-[#f7f9fc] to-white">
      {/* Background Glows & Patterns */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-32" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center pb-4 sm:pb-5 gap-3 text-[15px] font-medium text-gray-500">
          <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
          <Link to="/products" className="hover:text-[#032e92] transition-colors">Products</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
          <span className="text-[#032e92]">Health Insurance</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Description & CTAs (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >


            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-[1.2] mb-4">
              Shield Your Family’s Health & Wealth Against{' '}
              <span className="text-[#032e92]">
                Soaring Medical Inflation
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed max-w-2xl mb-6 mt-3.5">
              Medical expenses in India are rising at 14% every year. Safeguard your lifetime savings with 100% cashless hospitalization across 14,000+ top network hospitals, zero room-rent sub-limits, unlimited restoration, and tax savings up to ₹1,00,000 under Section 80D.
            </p>

            {/* Key Value Proposition Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-sm" />
                <span className="text-xs sm:text-sm font-medium text-gray-800">14,000+ Cashless Network Hospitals</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-sm" />
                <span className="text-xs sm:text-sm font-medium text-gray-800">Zero Room Rent Capping on Select Plans</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-sm" />
                <span className="text-xs sm:text-sm font-medium text-gray-800">Pre & Post Hospitalization Expenses Covered</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-sm" />
                <span className="text-xs sm:text-sm font-medium text-gray-800">Tax Deductions up to ₹1 Lakh u/s 80D</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={() => openLeadModal({ title: 'Explore Health Insurance Plans', defaultService: 'Health Insurance' })}
                className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Compare Health Plans</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToCalculator}
                className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-white hover:bg-blue-50 text-[#032e92] border border-[#032e92]/20 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FontAwesomeIcon icon={faCalculator} className="text-xs text-[#032e92]" />
                <span>Calculate Needed Cover</span>
              </button>
            </div>


          </motion.div>

          {/* Right Column: Reassuring Healthcare/Financial Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Main Interactive Summary Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xl relative overflow-hidden">
              {/* Subtle top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#032e92] via-[#0066cc] to-[#021d63]" />

              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/80 border border-blue-200/60 flex items-center justify-center text-[#032e92] shadow-xs">
                    <FontAwesomeIcon icon={faShieldHeart} className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0a192f]">Health Shield Snapshot</h3>
                    <p className="text-xs text-gray-500">Essential benchmarks for Indian families</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
                  <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                  Recommended
                </span>
              </div>

              {/* Metric Highlights Grid */}
              <div className="grid grid-cols-2 gap-3.5 my-6">
                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/60">
                  <div className="flex items-center gap-2 text-[#032e92] mb-1">
                    <FontAwesomeIcon icon={faHospital} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Network</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">14,000+</div>
                  <p className="text-[11px] text-gray-600 leading-tight">Cashless hospitals nationwide</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/60">
                  <div className="flex items-center gap-2 text-emerald-700 mb-1">
                    <FontAwesomeIcon icon={faClock} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Speed</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">&lt; 45 Mins</div>
                  <p className="text-[11px] text-gray-600 leading-tight">Avg. cashless pre-authorization</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/60">
                  <div className="flex items-center gap-2 text-indigo-700 mb-1">
                    <FontAwesomeIcon icon={faPercent} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Settlement</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">99.2%</div>
                  <p className="text-[11px] text-gray-600 leading-tight">KNAPS claim assistance rate</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100/60">
                  <div className="flex items-center gap-2 text-amber-700 mb-1">
                    <FontAwesomeIcon icon={faShieldHeart} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Tax Saving</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">₹1,00,000</div>
                  <p className="text-[11px] text-gray-600 leading-tight">Max 80D deduction benefit</p>
                </div>
              </div>

              {/* Medical Inflation Alert Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0a192f] to-[#021d63] text-white shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Reality Check</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">14% Annual Rise</span>
                </div>
                <p className="text-xs text-blue-100 leading-relaxed">
                  A treatment costing ₹10 Lakh today will cost ~₹20 Lakh in just 5 years. Standard savings cannot keep up without dedicated high-sum health insurance.
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-blue-200">
                  <span>Explore recommended cover</span>
                  <button
                    onClick={scrollToExplorer}
                    className="text-white hover:text-blue-200 underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Life-Stage Matcher</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                  </button>
                </div>
              </div>

              {/* Instant Call Prompt */}
              <div className="mt-5 text-center">
                <p className="text-xs text-gray-500">
                  Need personalized guidance? Call our certified health insurance specialists at{' '}
                  <a href="tel:+918080808080" className="font-semibold text-[#032e92] hover:underline">
                    +91 8080808080
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
