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
import healthInsuranceImg from '../../assets/health-insurance.webp';

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
    <section className="relative pt-32 pb-12 lg:pt-36 lg:pb-16 overflow-hidden bg-gradient-to-b from-[#f0f4fc] via-[#f7f9fc] to-white">
      {/* Background Glows & Patterns */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-32" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center pb-4 sm:pb-5 gap-3 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-600" />
          <Link to="/products" className="hover:text-[#032e92] transition-colors">Products</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-600" />
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



            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={() => openLeadModal({ title: 'Explore Health Insurance Plans', defaultService: 'Health Insurance' })}
                className="btn-ripple px-6 py-3 rounded-xl text-md font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Consult an Expert</span>
              </button>


            </div>


          </motion.div>

          {/* Right Column: Life Insurance Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-[#e8edf7] bg-white">
              <img
                src={healthInsuranceImg}
                alt="KNAPS General Insurance Protection"
                className="w-full h-auto object-cover rounded-3xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
