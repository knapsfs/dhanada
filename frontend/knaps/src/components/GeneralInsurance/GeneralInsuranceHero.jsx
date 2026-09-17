import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faBuildingShield,
  faCheckCircle,
  faArrowRight,
  faCar,
  faHouseChimney,
  faPlaneDeparture,
  faWrench,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function GeneralInsuranceHero() {
  const { openLeadModal } = useLeadModal();

  const scrollToFinder = () => {
    const el = document.getElementById('insurance-finder');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-[120px] pb-16 lg:pt-[150px] lg:pb-24 overflow-hidden bg-gradient-to-b from-[#eef4ff] via-[#f7f9fc] to-white">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-sky-200/50 via-blue-100/30 to-transparent blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-indigo-200/40 via-blue-100/20 to-transparent blur-3xl pointer-events-none translate-y-1/4 -translate-x-1/4" />

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
          <span className="text-[#032e92] font-bold">General Insurance</span>
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
              <span className="w-2 h-2 rounded-full bg-[#032e92] animate-pulse" />
              <span className="text-[#032e92] text-[11px] font-extrabold tracking-widest uppercase">
                KNAPS Asset & Non-Life Protection
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-[#0a192f] leading-[1.16] tracking-tight mb-5">
              Protect Every Valuable Asset:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#032e92] via-[#0b5cff] to-[#021d63]">
                Comprehensive General Insurance
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal mb-8">
              From your car and home to international travel and commercial business, safeguard your lifetime investments against unexpected damages, liabilities, and natural calamities with zero paperwork hassle.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                type="button"
                onClick={scrollToFinder}
                className="btn-ripple bg-gradient-to-r from-[#032e92] to-[#021d63] text-white px-7 py-4 rounded-xl font-semibold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-[#032e92]/30 transition-all duration-300 text-sm flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <FontAwesomeIcon icon={faShieldHalved} className="text-xs" />
                <span>Find the Right Cover</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={openLeadModal}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-[#f7f9fc] text-[#032e92] font-semibold text-sm border-2 border-[#e8edf7] hover:border-[#032e92]/30 transition-all duration-200 cursor-pointer shadow-sm"
              >
                <span>Speak with an Insurance Specialist</span>
              </button>
            </div>

            {/* Trust Highlights Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#e8edf7]">
              <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-sm flex-shrink-0" />
                <span>Instant Digital Policy</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                <FontAwesomeIcon icon={faWrench} className="text-[#032e92] text-sm flex-shrink-0" />
                <span>14,000+ Cashless Garages</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                <FontAwesomeIcon icon={faBuildingShield} className="text-sky-600 text-sm flex-shrink-0" />
                <span>100% Unbiased Choice</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                <FontAwesomeIcon icon={faShieldHalved} className="text-amber-600 text-sm flex-shrink-0" />
                <span>24/7 Claim Concierge</span>
              </div>
            </div>
          </motion.div>

          {/* Right Floating Protection Illustration Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-8 border border-[#e8edf7] shadow-2xl shadow-blue-900/10 relative overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 mb-6 pb-5 border-b border-[#e8edf7]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl shadow-sm">
                    <FontAwesomeIcon icon={faBuildingShield} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0a192f] text-base leading-tight">All-in-One Asset Shield</h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Customized General Protection</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                  Active Cover
                </span>
              </div>

              {/* Cover Amount Highlight */}
              <div className="bg-gradient-to-br from-[#032e92] to-[#021d63] text-white rounded-2xl p-5 mb-6 relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
                  Cashless Claim Network
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">24,000+</span>
                  <span className="text-xs font-semibold text-blue-200">Garages & Hospitals</span>
                </div>
                <p className="text-[11px] text-blue-100/90 mt-2">
                  Zero out-of-pocket stress with direct cashless claim settlement across India
                </p>
              </div>

              {/* Key Cover Verticals */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-[#e8edf7]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white text-[#032e92] flex items-center justify-center text-xs shadow-sm">
                      <FontAwesomeIcon icon={faCar} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0a192f]">Motor (Car & Bike)</p>
                      <p className="text-[10px] text-gray-400">Zero Dep + Roadside Assistance</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">From ₹2,094/yr*</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-[#e8edf7]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white text-[#032e92] flex items-center justify-center text-xs shadow-sm">
                      <FontAwesomeIcon icon={faHouseChimney} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0a192f]">Home & Property</p>
                      <p className="text-[10px] text-gray-400">Structure + Valuables Protection</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">From ₹1,200/yr*</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-[#e8edf7]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white text-[#032e92] flex items-center justify-center text-xs shadow-sm">
                      <FontAwesomeIcon icon={faPlaneDeparture} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0a192f]">Travel Insurance</p>
                      <p className="text-[10px] text-gray-400">Medical abroad + Baggage & Delay</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">From ₹450/trip*</span>
                </div>
              </div>

              {/* Interactive Button */}
              <button
                type="button"
                onClick={openLeadModal}
                className="w-full py-3.5 rounded-xl bg-[#eef4ff] hover:bg-[#032e92] text-[#032e92] hover:text-white font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Get Instant Multi-Insurer Quote</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[10px] text-gray-400 text-center italic mt-3">
                *Illustrative indicative premiums. Final rate depends on vehicle make, asset value & insurer underwriting.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
