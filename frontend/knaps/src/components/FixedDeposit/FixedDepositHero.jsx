import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faVault,
  faBuildingColumns,
  faArrowRight,
  faCalculator,
  faShieldHalved,
  faStar,
  faHandHoldingDollar,
  faLandmark
} from "@fortawesome/free-solid-svg-icons";
import { useLeadModal } from "../../context/LeadModalContext";

export default function FixedDepositHero() {
  const { openLeadModal } = useLeadModal();

  const scrollToCalculator = () => {
    const el = document.getElementById("fd-calculator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToProducts = () => {
    const el = document.getElementById("fixed-income-products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToComparison = () => {
    const el = document.getElementById("fd-comparison");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#f0f4fc] via-[#f7f9fc] to-[#f7f9fc]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 -ml-24 w-80 h-80 rounded-full bg-indigo-100/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-[#032e92] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
            </li>
            <li>
              <Link to="/products" className="hover:text-[#032e92] transition-colors">
                Products
              </Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
            </li>
            <li className="font-semibold text-[#032e92]">Fixed Income Products</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Value Props, CTAs (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/70 border border-blue-200/80 text-[#032e92] text-xs sm:text-sm font-semibold shadow-xs">
              <FontAwesomeIcon icon={faLandmark} className="text-xs text-[#032e92]" />
              <span>Fixed Deposits (FD) & GoI Sovereign Bonds</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a192f] tracking-tight leading-[1.15]">
              Fixed Income Products:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#032e92] via-[#0052cc] to-[#0a192f]">
                Capital Safety & Assured Cashflow
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed max-w-2xl">
              Preserve your wealth and generate predictable income with structured debt instruments. Choose from scheduled Bank Fixed Deposits, AAA-rated Corporate FDs, and 100% sovereign-guaranteed Government of India (GoI) Bonds.
            </p>

            {/* Key Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-gray-200/80 shadow-xs">
                <FontAwesomeIcon icon={faBuildingColumns} className="text-[#032e92] flex-shrink-0 text-sm" />
                <span className="text-xs font-semibold text-gray-800">Bank & Corporate FDs</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-gray-200/80 shadow-xs">
                <FontAwesomeIcon icon={faLandmark} className="text-emerald-600 flex-shrink-0 text-sm" />
                <span className="text-xs font-semibold text-gray-800">GoI Sovereign Bonds</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-gray-200/80 shadow-xs">
                <FontAwesomeIcon icon={faHandHoldingDollar} className="text-amber-600 flex-shrink-0 text-sm" />
                <span className="text-xs font-semibold text-gray-800">Flexible Regular Payouts</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={() => openLeadModal({ title: "Explore Fixed Income Options", defaultService: "Fixed Income Products" })}
                className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Invest in Fixed Income</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToProducts}
                className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-white hover:bg-blue-50 text-[#032e92] border border-[#032e92]/20 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FontAwesomeIcon icon={faVault} className="text-xs text-[#032e92]" />
                <span>Explore FD vs GoI Bonds</span>
              </button>

              <button
                onClick={scrollToCalculator}
                className="btn-ripple px-5 py-3 rounded-xl text-[15px] font-semibold text-gray-700 hover:text-[#032e92] hover:bg-gray-100/70 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FontAwesomeIcon icon={faCalculator} className="text-xs text-[#032e92]" />
                <span>Yield Calculator</span>
              </button>
            </div>

            {/* Trust & Regulatory Note */}
            <div className="pt-4 border-t border-gray-200/70 text-xs text-gray-500 leading-relaxed">
              <span>Scheduled Bank FDs are protected by DICGC insurance up to ₹5 Lakh per depositor per bank. Government of India (GoI) Bonds carry a 100% sovereign guarantee with zero credit risk. Corporate deposits are subject to issuer credit ratings (CRISIL/ICRA AAA/AA).</span>
            </div>
          </motion.div>

          {/* Right Column: Premium Snapshot Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#032e92] via-[#0066cc] to-[#021d63]" />

              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/80 border border-blue-200/60 flex items-center justify-center text-[#032e92] shadow-xs">
                    <FontAwesomeIcon icon={faLandmark} className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0a192f]">Fixed Income Portfolio</h3>
                    <p className="text-xs text-gray-500">FDs & Government Bonds</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
                  <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                  Zero Equity Risk
                </span>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 gap-3.5 my-6">
                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/60">
                  <div className="flex items-center gap-2 text-[#032e92] mb-1">
                    <FontAwesomeIcon icon={faBuildingColumns} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Bank & Corp FDs</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">Up to 8.60%</div>
                  <p className="text-[11px] text-gray-600 leading-tight">High liquidity & senior perks</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/60">
                  <div className="flex items-center gap-2 text-emerald-700 mb-1">
                    <FontAwesomeIcon icon={faLandmark} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">GoI FRSB Bonds</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">8.05% p.a.</div>
                  <p className="text-[11px] text-gray-600 leading-tight">100% Sovereign backing</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/60">
                  <div className="flex items-center gap-2 text-indigo-700 mb-1">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Safety Net</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">Sovereign / DICGC</div>
                  <p className="text-[11px] text-gray-600 leading-tight">Zero default credit rating</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100/60">
                  <div className="flex items-center gap-2 text-amber-700 mb-1">
                    <FontAwesomeIcon icon={faHandHoldingDollar} className="text-xs" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Payout Modes</span>
                  </div>
                  <div className="text-lg font-extrabold text-[#0a192f]">Flexible</div>
                  <p className="text-[11px] text-gray-600 leading-tight">Monthly, Semi-Annual, Cumulative</p>
                </div>
              </div>

              {/* Informative Highlights Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0a192f] to-[#021d63] text-white shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">The Power of Fixed Income</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-400/30">
                    Dual Protection
                  </span>
                </div>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Combine the flexibility of Fixed Deposits for near-term cash needs with the sovereign strength of Government of India (GoI) Bonds for long-term safe income generation.
                </p>
                <div className="pt-1 flex items-center justify-between text-xs font-semibold text-blue-200">
                  <span>Compare FD vs GoI Bonds</span>
                  <button
                    onClick={scrollToComparison}
                    className="text-white hover:text-blue-200 underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Matrix</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                  </button>
                </div>
              </div>

              {/* Advisory note */}
              <div className="mt-5 text-center">
                <p className="text-xs text-gray-500">
                  Need personalized advice on FD laddering or GoI bonds? Contact our advisors at KNAPS.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
