import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faVault,
  faClock,
  faBuildingColumns,
  faCheckCircle,
  faArrowRight,
  faCalculator,
  faPercent,
  faShieldHalved,
  faStar,
  faHandHoldingDollar
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function FixedDepositHero() {
  const { openLeadModal } = useLeadModal();

  const scrollToCalculator = () => {
    const el = document.getElementById('fd-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToComparison = () => {
    const el = document.getElementById('fd-comparison');
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
          <span className="text-[#032e92] font-semibold">Fixed Deposits (FD)</span>
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
              <FontAwesomeIcon icon={faVault} className="text-[#032e92] text-xs" />
              <span>Structured Fixed-Income Savings</span>
            </div>

            {/* Main Required Hero Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-[#0a192f] tracking-tight leading-[1.15]">
              Fixed Deposits (FD)
            </h1>

            {/* Required Supporting Text */}
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">
              Invest your savings for a predefined tenure and earn interest at a predetermined rate. Fixed Deposits offer a structured way to plan your savings with defined maturity terms and predictable interest income, subject to the terms and conditions of the respective issuer.
            </p>

            {/* Additional Supporting Context */}
            <p className="text-sm text-gray-500 leading-relaxed">
              Whether you are planning short-term liquidity, preserving family capital, or seeking predictable periodic income payouts, Fixed Deposits provide disciplined tenure options backed by scheduled banks and top-rated corporate issuers.
            </p>

            {/* Key Value Proposition Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-sm" />
                <span className="text-xs sm:text-sm font-medium text-gray-800">Tenures from 7 Days to 10 Years</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-sm" />
                <span className="text-xs sm:text-sm font-medium text-gray-800">Additional Yield for Senior Citizens</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-sm" />
                <span className="text-xs sm:text-sm font-medium text-gray-800">DICGC Cover up to ₹5 Lakh in Banks</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-sm" />
                <span className="text-xs sm:text-sm font-medium text-gray-800">Cumulative & Regular Payout Options</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={() => openLeadModal({ title: 'Explore Fixed Deposit Options', defaultService: 'Fixed Deposits' })}
                className="btn-ripple px-7 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-lg shadow-[#032e92]/25 hover:shadow-xl hover:shadow-[#032e92]/35 transition-all duration-300 flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <span>Explore FD Options</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToCalculator}
                className="px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-[#032e92] bg-white border border-blue-200/80 hover:bg-blue-50 hover:border-blue-300 shadow-xs transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <FontAwesomeIcon icon={faCalculator} className="text-xs text-[#032e92]" />
                <span>Calculate FD Returns</span>
              </button>
            </div>

            {/* Trust & Regulatory Note */}
            <div className="pt-4 border-t border-gray-200/70 text-xs text-gray-500">
              <span>Deposits placed with scheduled commercial banks are insured under DICGC guidelines up to ₹5 Lakh per depositor per bank. Corporate deposits are subject to respective issuer credit ratings.</span>
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
                    <FontAwesomeIcon icon={faBuildingColumns} className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0a192f]">FD Snapshot</h3>
                    <p className="text-xs text-gray-500">Structured savings benchmarks</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
                  <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                  Predictable Yield
                </span>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 gap-3.5 my-6">
                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/60">
                  <div className="flex items-center gap-2 text-[#032e92] mb-1">
                    <FontAwesomeIcon icon={faClock} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Tenure</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">7D – 10Y</div>
                  <p className="text-[11px] text-gray-600 leading-tight">Tailored to exact goals</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/60">
                  <div className="flex items-center gap-2 text-emerald-700 mb-1">
                    <FontAwesomeIcon icon={faPercent} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Senior Perk</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">+0.50%</div>
                  <p className="text-[11px] text-gray-600 leading-tight">Typical additional rate</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/60">
                  <div className="flex items-center gap-2 text-indigo-700 mb-1">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">DICGC Cover</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">₹5,00,000</div>
                  <p className="text-[11px] text-gray-600 leading-tight">Per bank per depositor</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100/60">
                  <div className="flex items-center gap-2 text-amber-700 mb-1">
                    <FontAwesomeIcon icon={faHandHoldingDollar} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Payouts</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">Flexible</div>
                  <p className="text-[11px] text-gray-600 leading-tight">Monthly / Compounded</p>
                </div>
              </div>

              {/* Informative Compounding Teaser Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0a192f] to-[#021d63] text-white shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Predictable Compounding</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-400/30">
                    Quarterly Compounding
                  </span>
                </div>
                <p className="text-xs text-blue-100 leading-relaxed">
                  In cumulative FDs, interest compounds quarterly, allowing you to earn interest upon interest. The locked-in rate remains unaffected by interim interest rate revisions.
                </p>
                <div className="pt-1 flex items-center justify-between text-xs font-semibold text-blue-200">
                  <span>Explore bank vs corporate FDs</span>
                  <button
                    onClick={scrollToComparison}
                    className="text-white hover:text-blue-200 underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Comparison</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                  </button>
                </div>
              </div>

              {/* Advisory note */}
              <div className="mt-5 text-center">
                <p className="text-xs text-gray-500">
                  Need guidance on issuer selection or laddering? Call{' '}
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
