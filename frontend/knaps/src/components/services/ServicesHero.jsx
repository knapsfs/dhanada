import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faShieldHalved, faChartPie, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';

export default function ServicesHero({
  label = "KNAPS WEALTH & FINANCIAL SERVICES",
  title = "Intelligent Financial Solutions Designed For ",
  titleHighlight = "Your Life Goals",
  description = "Explore 12+ tailored investment, wealth management, insurance, and savings solutions engineered to grow and protect your wealth with complete transparency.",
  breadcrumbText = "Services",
  breadcrumbLink = "/services"
}) {
  return (
    <section className="relative pt-[120px] pb-16 lg:pt-[150px] lg:pb-20 overflow-hidden bg-gradient-to-b from-[#eef4ff] via-[#f7f9fc] to-white">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-blue-200/50 via-indigo-100/30 to-transparent blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-sky-200/40 via-blue-100/20 to-transparent blur-3xl pointer-events-none translate-y-1/4 -translate-x-1/4" />

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
          <span className="text-[#032e92] font-bold">{breadcrumbText}</span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-100/80 shadow-sm mb-5">
              <span className="w-2 h-2 rounded-full bg-[#032e92] animate-pulse" />
              <span className="text-[#032e92] text-[11px] font-extrabold tracking-widest uppercase">{label}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#0a192f] leading-[1.18] tracking-tight mb-5">
              {title}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#032e92] via-[#0b5cff] to-[#021d63]">
                {titleHighlight}
              </span>
            </h1>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal mb-8">
              {description}
            </p>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-700">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#e8edf7] shadow-sm">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[#032e92]" />
                <span>100% Unbiased & Regulated</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#e8edf7] shadow-sm">
                <FontAwesomeIcon icon={faChartPie} className="text-emerald-600" />
                <span>12+ Comprehensive Products</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#e8edf7] shadow-sm">
                <FontAwesomeIcon icon={faArrowTrendUp} className="text-amber-600" />
                <span>Goal-Centric Allocation</span>
              </div>
            </div>
          </motion.div>

          {/* Right Floating Stats Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-[#e8edf7] shadow-xl shadow-blue-900/5 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl pointer-events-none" />
              
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                The KNAPS Advantage
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f7f9fc] border border-[#e8edf7]/80">
                  <div>
                    <p className="text-2xl font-black text-[#032e92]">12+</p>
                    <p className="text-xs font-semibold text-gray-500">Service Verticals</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                    Full Spectrum
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f7f9fc] border border-[#e8edf7]/80">
                  <div>
                    <p className="text-2xl font-black text-[#0a192f]">₹500 Cr+</p>
                    <p className="text-xs font-semibold text-gray-500">Wealth Advised</p>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                    Trusted
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f7f9fc] border border-[#e8edf7]/80">
                  <div>
                    <p className="text-2xl font-black text-[#032e92]">15,000+</p>
                    <p className="text-xs font-semibold text-gray-500">Families Empowered</p>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                    Pan-India
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
