import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faFileInvoiceDollar,
  faClock,
  faChartLine,
  faCheckCircle,
  faArrowRight,
  faCalculator,
  faPercent,
  faShieldHalved,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function ELSSHero() {
  const { openLeadModal } = useLeadModal();

  const scrollToCalculator = () => {
    const el = document.getElementById('elss-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToComparison = () => {
    const el = document.getElementById('elss-comparison');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#f0f4fc] via-[#f7f9fc] to-white">
      {/* Background Lighting Orbs */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-32" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-gray-400" />
          <Link to="/services" className="hover:text-[#032e92] transition-colors">Services</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-gray-400" />
          <span className="text-[#032e92] font-semibold">ELSS Mutual Funds</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Required Positioning Headline & CTAs (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#032e92] text-xs sm:text-sm font-semibold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#032e92] animate-pulse" />
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-[#032e92] text-xs" />
              <span>Section 80C Tax-Saving Mutual Funds</span>
            </div>

            {/* Main Required Hero Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-[#0a192f] tracking-tight leading-[1.15]">
              ELSS Mutual Funds
            </h1>

            {/* Required Supporting Text */}
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">
              Invest in equity-oriented mutual funds while exploring applicable tax benefits under Section 80C, subject to prevailing tax laws. ELSS combines a 3-year statutory lock-in with the long-term growth potential of equity markets.
            </p>

            {/* Additional Supporting Context */}
            <p className="text-sm text-gray-500 leading-relaxed">
              With the shortest lock-in period among Section 80C instruments and a diversified portfolio predominantly invested in equities, ELSS offers a disciplined avenue for long-term wealth creation.
            </p>

            {/* Key Value Proposition Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-sm" />
                <span className="text-xs sm:text-sm font-medium text-gray-800">3-Year Statutory Lock-In (Shortest in 80C)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-sm" />
                <span className="text-xs sm:text-sm font-medium text-gray-800">Minimum 80% Equity Exposure</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-sm" />
                <span className="text-xs sm:text-sm font-medium text-gray-800">Invest via Monthly SIP from ₹500</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-sm" />
                <span className="text-xs sm:text-sm font-medium text-gray-800">Deduction up to ₹1.5L u/s 80C (Old Regime)</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={() => openLeadModal({ title: 'Explore ELSS Mutual Funds', defaultService: 'ELSS' })}
                className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore ELSS Funds</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToCalculator}
                className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-white hover:bg-blue-50 text-[#032e92] border border-[#032e92]/20 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FontAwesomeIcon icon={faCalculator} className="text-xs text-[#032e92]" />
                <span>Calculate Tax & Growth</span>
              </button>
            </div>

            {/* Trust & Regulatory Note */}
            <div className="pt-4 border-t border-gray-200/70 text-xs text-gray-500">
              <span>AMFI-Registered Mutual Fund Advisory. Tax benefits subject to prevailing income tax provisions. Mutual fund investments are subject to market risks.</span>
            </div>
          </motion.div>

          {/* Right Column: Premium Financial Snapshot Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xl relative overflow-hidden">
              {/* Subtle top gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#032e92] via-[#0066cc] to-[#021d63]" />

              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/80 border border-blue-200/60 flex items-center justify-center text-[#032e92] shadow-xs">
                    <FontAwesomeIcon icon={faChartLine} className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0a192f]">ELSS Key Indicators</h3>
                    <p className="text-xs text-gray-500">SEBI-categorized equity scheme</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#032e92] text-xs font-semibold border border-blue-200/60">
                  <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                  Section 80C
                </span>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 gap-3.5 my-6">
                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/60">
                  <div className="flex items-center gap-2 text-[#032e92] mb-1">
                    <FontAwesomeIcon icon={faClock} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Lock-In</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">3 Years</div>
                  <p className="text-[11px] text-gray-600 leading-tight">Shortest among 80C options</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/60">
                  <div className="flex items-center gap-2 text-emerald-700 mb-1">
                    <FontAwesomeIcon icon={faPercent} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Equity Asset</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">≥ 80%</div>
                  <p className="text-[11px] text-gray-600 leading-tight">Minimum equity mandate</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/60">
                  <div className="flex items-center gap-2 text-indigo-700 mb-1">
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Deduction</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">Up to ₹1.5L</div>
                  <p className="text-[11px] text-gray-600 leading-tight">Under Old Tax Regime</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100/60">
                  <div className="flex items-center gap-2 text-amber-700 mb-1">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Management</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">Active</div>
                  <p className="text-[11px] text-gray-600 leading-tight">Professional fund managers</p>
                </div>
              </div>

              {/* Informative Comparison Teaser Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0a192f] to-[#021d63] text-white shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Lock-In Comparison</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-400/30">
                    3 Yrs vs 5–15 Yrs
                  </span>
                </div>
                <p className="text-xs text-blue-100 leading-relaxed">
                  While PPF locks your capital for 15 years and Tax-Saver FDs for 5 years, ELSS has a statutory lock-in of only 3 years, offering a compelling blend of liquidity and growth.
                </p>
                <div className="pt-1 flex items-center justify-between text-xs font-semibold text-blue-200">
                  <span>Explore comparative analysis</span>
                  <button
                    onClick={scrollToComparison}
                    className="text-white hover:text-blue-200 underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Table</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                  </button>
                </div>
              </div>

              {/* Advisory note */}
              <div className="mt-5 text-center">
                <p className="text-xs text-gray-500">
                  Have questions on Old vs New Tax Regime? Call{' '}
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
