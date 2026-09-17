import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faShieldHeart,
  faCheckCircle,
  faArrowRight,
  faCalculator,
  faFileContract,
  faPercent,
  faHeartPulse
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function LifeInsuranceHero() {
  const { openLeadModal } = useLeadModal();

  const scrollToCalculator = () => {
    const el = document.getElementById('insurance-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-[120px] pb-16 lg:pt-[150px] lg:pb-24 overflow-hidden bg-gradient-to-b from-[#eef4ff] via-[#f7f9fc] to-white">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-blue-200/50 via-emerald-100/30 to-transparent blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-sky-200/40 via-blue-100/20 to-transparent blur-3xl pointer-events-none translate-y-1/4 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 text-xs font-semibold text-gray-400 mb-6 uppercase tracking-wider"
        >
          <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-gray-300" />
          <Link to="/services" className="hover:text-[#032e92] transition-colors">Services</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[9px] text-gray-300" />
          <span className="text-[#032e92] font-bold">Life Insurance</span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[#032e92] text-[11px] font-extrabold tracking-widest uppercase">
                KNAPS Life & Family Protection
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-[#0a192f] leading-[1.16] tracking-tight mb-5">
              Protect What Truly Matters:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#032e92] via-[#0b5cff] to-[#021d63]">
                Your Family’s Financial Tomorrow
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal mb-8">
              A robust life insurance shield guarantees that your loved ones maintain their lifestyle, clear liabilities, and fulfill cherished dreams, even in your absence. Pure protection with zero compromise.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                type="button"
                onClick={scrollToCalculator}
                className="btn-ripple bg-gradient-to-r from-[#032e92] to-[#021d63] text-white px-7 py-4 rounded-xl font-semibold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-[#032e92]/30 transition-all duration-300 text-sm flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <FontAwesomeIcon icon={faCalculator} className="text-xs" />
                <span>Estimate My Ideal Cover</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={openLeadModal}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-[#f7f9fc] text-[#032e92] font-semibold text-sm border-2 border-[#e8edf7] hover:border-[#032e92]/30 transition-all duration-200 cursor-pointer shadow-sm"
              >
                <span>Speak with an Advisor</span>
              </button>
            </div>

            {/* Trust Highlights Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#e8edf7]">
              <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-sm flex-shrink-0" />
                <span>₹1 Cr Cover from ₹490/mo*</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                <FontAwesomeIcon icon={faFileContract} className="text-[#032e92] text-sm flex-shrink-0" />
                <span>100% Digital & Paperless</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                <FontAwesomeIcon icon={faShieldHeart} className="text-rose-600 text-sm flex-shrink-0" />
                <span>98.5%+ Claim Ratio</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                <FontAwesomeIcon icon={faPercent} className="text-amber-600 text-sm flex-shrink-0" />
                <span>Tax Free u/s 10(10D)</span>
              </div>
            </div>
          </motion.div>

          {/* Right Floating Term Illustration Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-8 border border-[#e8edf7] shadow-2xl shadow-blue-900/10 relative overflow-hidden">
              {/* Corner Badge */}
              <div className="flex items-center justify-between gap-3 mb-6 pb-5 border-b border-[#e8edf7]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-sm">
                    <FontAwesomeIcon icon={faShieldHeart} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0a192f] text-base leading-tight">Sample Protection Plan</h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Pure Term Shield</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Active Cover
                </span>
              </div>

              {/* Cover Amount Highlight */}
              <div className="bg-gradient-to-br from-[#032e92] to-[#021d63] text-white rounded-2xl p-5 mb-6 relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
                  Life Cover (Sum Assured)
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">₹ 1,00,00,000</span>
                  <span className="text-xs font-semibold text-blue-200">(1 Crore)</span>
                </div>
                <p className="text-[11px] text-blue-100/90 mt-2">
                  100% Tax-Free death benefit payout to your designated nominee
                </p>
              </div>

              {/* Key Plan Metrics */}
              <div className="space-y-3.5 mb-6">
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Starting Premium</span>
                  <span className="font-extrabold text-gray-900 text-sm text-emerald-600">₹ 540 / month*</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Coverage Age</span>
                  <span className="font-bold text-gray-800">Up to 75 - 85 Years</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Critical Illness Rider</span>
                  <span className="font-bold text-[#032e92] flex items-center gap-1">
                    <FontAwesomeIcon icon={faHeartPulse} className="text-[10px]" />
                    34+ Illnesses Covered
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5">
                  <span className="text-gray-500 font-medium">Tax Deductions</span>
                  <span className="font-bold text-gray-800">Up to ₹46,800/yr u/s 80C</span>
                </div>
              </div>

              {/* Interactive Button */}
              <button
                type="button"
                onClick={openLeadModal}
                className="w-full py-3.5 rounded-xl bg-[#eef4ff] hover:bg-[#032e92] text-[#032e92] hover:text-white font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Check Your Customized Premium</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[10px] text-gray-400 text-center italic mt-3">
                *Premium illustrative for a 28-year-old healthy non-smoker male, 30-year policy tenure.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
