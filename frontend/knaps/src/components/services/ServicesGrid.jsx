import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faCompass,
  faUserTie,
  faBuildingColumns,
  faShieldHeart,
  faBuildingShield,
  faHeartPulse,
  faFileInvoiceDollar,
  faVault,
  faRotate,
  faPiggyBank,
  faCoins,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const SERVICES_DATA = [
  {
    id: "mutual-funds",
    title: "Mutual Funds",
    desc: "Invest in a wide range of equity, debt, and hybrid funds to grow your wealth over time. Benefit from professional fund management, automated SIP compounding, and portfolio diversification suited to your risk appetite.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
    icon: faChartLine,
    link: null
  },
  {
    id: "sif",
    title: "SIF (Specialised Investment Funds)",
    desc: "Goal-based, flexible investing engineered for your unique financial milestones. Leverage curated asset allocation, dynamic market hedging, and disciplined strategies designed to navigate volatility while capturing upside.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    icon: faCompass,
    link: "/sif"
  },
  {
    id: "pms",
    title: "PMS (Portfolio Management Services)",
    desc: "Personalised portfolio management tailored exclusively for high-net-worth investors. Enjoy direct stock ownership, bespoke risk-reward mandates, dedicated fund manager attention, and institutional-grade research.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    icon: faUserTie,
    link: null
  },
  {
    id: "aif",
    title: "AIF (Alternative Investment Funds)",
    desc: "Access exclusive, high-alpha opportunities beyond traditional public markets. Participate in private equity, private debt, real estate, and venture capital designed for sophisticated investors seeking uncorrelated returns.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    icon: faBuildingColumns,
    link: null
  },
  {
    id: "life-insurance",
    title: "Life Insurance",
    desc: "Comprehensive life cover to ensure your family's financial security and lifestyle continuity. Safeguard their future with high sum assured term plans, income protection, critical illness coverage, and tax benefits under Section 80C.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop",
    icon: faShieldHeart,
    link: "/services/life-insurance"
  },
  {
    id: "general-insurance",
    title: "General Insurance",
    desc: "Protect your most valuable physical assets including your home, vehicle, business, and travel. Shield yourself from unexpected liabilities, accidents, natural damages, and financial disruptions with complete peace of mind.",
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=800&auto=format&fit=crop",
    icon: faBuildingShield,
    link: "/services/general-insurance"
  },
  {
    id: "health-insurance",
    title: "Health Insurance",
    desc: "Stay prepared for medical uncertainties with extensive health coverage. Access cashless hospitalization across premier hospital networks, comprehensive daycare treatments, pre/post medical care, and tax savings under Section 80D.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
    icon: faHeartPulse,
    link: "/services/health-insurance"
  },
  {
    id: "elss",
    title: "ELSS",
    desc: "Save tax under Section 80C while investing in high-growth equity funds. Benefit from the shortest lock-in period among all tax-saving instruments (just 3 years) combined with the long-term wealth compounding power of equities.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
    icon: faFileInvoiceDollar,
    link: "/services/elss"
  },
  {
    id: "fixed-deposits",
    title: "Fixed Deposits (FD)",
    desc: "A safe and steady investment option offering predictable interest income and capital stability. Choose flexible tenures ranging from 7 days to 10 years with assured interest payouts and preferential rates for senior citizens.",
    image: "https://images.unsplash.com/photo-1565372195458-9de0b320ef04?q=80&w=800&auto=format&fit=crop",
    icon: faVault,
    link: "/services/fixed-deposits"
  },
  {
    id: "recurring-deposits",
    title: "Recurring Deposits (RD)",
    desc: "Build your savings consistently, one step at a time. Cultivate a disciplined monthly investment habit with fixed, guaranteed compounding interest, zero exposure to market volatility, and flexible tenure choices.",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop",
    icon: faRotate,
    link: "/services/recurring-deposits"
  },
  {
    id: "nps",
    title: "National Pension System (NPS)",
    desc: "Plan for a secure, comfortable, and tax-efficient retirement. Accumulate a disciplined pension corpus with market-linked growth across equity and debt, enjoy an additional ₹50,000 tax deduction under 80CCD(1B), and secure lifelong annuity.",
    image: "https://images.unsplash.com/photo-1507206130118-b5907f817163?q=80&w=800&auto=format&fit=crop",
    icon: faPiggyBank,
    link: "/services/nps"
  },
  {
    id: "small-savings",
    title: "Small Savings Schemes",
    desc: "Government-backed savings instruments offering sovereign safety and assured returns. Invest in popular avenues like Public Provident Fund (PPF), Sukanya Samriddhi Yojana (SSY), and SCSS to enjoy tax-free compounding and capital security.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
    icon: faCoins,
    link: "/services/small-savings-schemes"
  }
];

export default function ServicesGrid() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 pb-24 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES_DATA.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-[#e8edf7] shadow-[0_10px_35px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_-15px_rgba(3,46,146,0.14)] hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Top Image Section with Gradient Overlay and Floating Icon */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/60 via-[#0a192f]/10 to-transparent" />

                {/* Floating Frosted Icon Box */}
                <div className="absolute top-4 right-4 w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#032e92] shadow-md border border-white/80 group-hover:scale-110 transition-transform duration-300 z-10">
                  <FontAwesomeIcon icon={service.icon} className="text-lg" />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed font-medium mb-6">
                    {service.desc}
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {service.link ? (
                    <Link
                      to={service.link}
                      className="btn-ripple inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-md hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 group/btn"
                    >
                      <span>Explore {service.title.split(' ')[0]}</span>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-xs group-hover/btn:translate-x-1 transition-transform"
                      />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={openLeadModal}
                      className="btn-ripple inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-md hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 group/btn cursor-pointer"
                    >
                      <span>Get Started</span>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-xs group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
