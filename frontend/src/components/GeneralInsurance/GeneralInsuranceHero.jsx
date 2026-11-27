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
import generalInsuranceImg from '../../assets/general-insurance.webp';

export default function GeneralInsuranceHero() {
  const { openLeadModal } = useLeadModal();

  const scrollToFinder = () => {
    const el = document.getElementById('insurance-finder');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-[120px] pb-12 lg:pt-[150px] lg:pb-16 overflow-hidden bg-gradient-to-b from-[#eef4ff] via-[#f7f9fc] to-white">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-sky-200/50 via-blue-100/30 to-transparent blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-indigo-200/40 via-blue-100/20 to-transparent blur-3xl pointer-events-none translate-y-1/4 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center pb-4 sm:pb-5 gap-3 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-600" />
          <Link to="/products" className="hover:text-[#032e92] transition-colors">Products</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-600" />
          <span className="text-[#032e92]">General Insurance</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >


            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-[1.2] mb-4">
              Protect Every Valuable Asset:{' '}
              <span className="text-[#032e92]">
                Comprehensive General Insurance
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed max-w-2xl mb-8 mt-3.5">
              From your car and home to international travel and commercial business, safeguard your lifetime investments against unexpected damages, liabilities, and natural calamities with zero paperwork hassle.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                type="button"
                onClick={openLeadModal}
                className="btn-ripple bg-gradient-to-r from-[#032e92] to-[#021d63] text-white px-6 py-3 rounded-xl text-md font-semibold hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                {/* <FontAwesomeIcon icon={faShieldHalved} className="text-xs" /> */}
                <span>Find the Right Cover</span>
                {/* <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" /> */}
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
                src={generalInsuranceImg}
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
