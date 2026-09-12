import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartSimple,
  faSeedling,
  faLayerGroup,
  faUsers,
  faShieldHalved,
  faShield,
  faHeartPulse,
  faPercent,
  faCoins,
  faPiggyBank,
  faUser,
  faFileLines,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../context/LeadModalContext';

const products = [
  {
    title: 'Mutual Funds',
    description: 'Invest in a wide range of funds to grow your wealth over time.',
    icon: faChartSimple,
    iconBg: 'bg-purple-50 text-purple-600',
    route: '/funds',
  },
  {
    title: 'SIF (Specialised Investment Funds)',
    description: 'Goal-based, flexible investing for your unique needs.',
    icon: faSeedling,
    iconBg: 'bg-emerald-50 text-emerald-600',
    route: '/sif',
  },
  {
    title: 'PMS (Portfolio Management Services)',
    description: 'Personalised portfolio management for high-net-worth investors.',
    icon: faLayerGroup,
    iconBg: 'bg-sky-50 text-sky-600',
  },
  {
    title: 'AIF (Alternative Investment Funds)',
    description: 'Access unique opportunities beyond traditional markets.',
    icon: faUsers,
    iconBg: 'bg-amber-50 text-amber-600',
  },
  {
    title: 'Life Insurance',
    description: "Comprehensive life cover to ensure your family's financial security.",
    icon: faShieldHalved,
    iconBg: 'bg-rose-50 text-rose-600',
  },
  {
    title: 'General Insurance',
    description: 'Protect your valuable assets including home, vehicle and more.',
    icon: faShield,
    iconBg: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Health Insurance',
    description: "Stay prepared for life's uncertainties with adequate health cover.",
    icon: faHeartPulse,
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'ELSS',
    description: 'Save tax while investing in equity for long-term growth.',
    icon: faPercent,
    iconBg: 'bg-violet-50 text-violet-600',
  },
  {
    title: 'Fixed Deposits (FD)',
    description: 'A safe and steady investment option with assured returns.',
    icon: faCoins,
    iconBg: 'bg-amber-50 text-amber-600',
  },
  {
    title: 'Recurring Deposits (RD)',
    description: 'Build your savings consistently, one step at a time.',
    icon: faPiggyBank,
    iconBg: 'bg-rose-50 text-rose-500',
  },
  {
    title: 'National Pension System (NPS)',
    description: 'Plan for a secure, tax-efficient retirement.',
    icon: faUser,
    iconBg: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Small Savings Schemes',
    description: 'Government-backed schemes with guaranteed returns.',
    icon: faFileLines,
    iconBg: 'bg-green-50 text-green-600',
  },
];

export default function OurProducts() {
  const { openLeadModal } = useLeadModal();
  const navigate = useNavigate();

  const handleCardClick = (product) => {
    if (product.route) {
      navigate(product.route);
    } else {
      openLeadModal(product.title);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Tag */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-xs sm:text-[13px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-3 text-center"
        >
          OUR PRODUCTS
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#0f172a] tracking-tight leading-tight text-center max-w-3xl mx-auto"
        >
          A Complete Range of{' '}
          <span className="text-[#2563eb] block sm:inline">Financial Solutions</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl mx-auto leading-relaxed mt-3.5 text-center"
        >
          From growing your wealth to protecting what matters, we offer a wide range of trusted financial products to support every stage of your life.
        </motion.p>

        {/* 4x3 Grid of 12 Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-12 sm:mt-14">
          {products.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 * (idx % 4) }}
              whileHover={{ y: -3, scale: 1.01 }}
              onClick={() => handleCardClick(item)}
              className="bg-white rounded-2xl border border-gray-100 shadow-md shadow-blue-900/4 p-4 sm:p-5 flex items-center justify-between gap-3 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group cursor-pointer"
            >
              {/* Left Content */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Icon Box */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-base flex-shrink-0 transition-transform group-hover:scale-110 ${item.iconBg}`}>
                  <FontAwesomeIcon icon={item.icon} />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-snug group-hover:text-[#032e92] transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-normal leading-relaxed mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Arrow Pill */}
              <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#032e92] text-gray-400 group-hover:text-white flex items-center justify-center text-[11px] transition-all flex-shrink-0 ml-1 shadow-2xs">
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-12 text-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openLeadModal('Explore All Products')}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Explore All Products</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </motion.button>
        </div>

      </div>
    </section>
  );
}
