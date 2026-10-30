import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCompass,
  faShieldHeart,
  faBuildingShield,
  faHeartPulse,
  faVault,
  faPiggyBank,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";
import { useLeadModal } from "../../context/LeadModalContext";

// Product Images from src/assets/products
import mutualFundsImg from "../../assets/products/mutual-funds.webp";
import sifImg from "../../assets/products/specialised-investment-funds.webp";
import npsImg from "../../assets/products/nps.webp";
import lifeInsuranceImg from "../../assets/products/life-insurance.webp";
import generalInsuranceImg from "../../assets/products/general-insurance.webp";
import healthInsuranceImg from "../../assets/products/health-insurance.webp";
import fixedIncomeImg from "../../assets/products/fixed-income-products.webp";
import smallSavingsImg from "../../assets/products/post-office-small-savings.webp";

const SERVICES_DATA = [
  {
    id: "mutual-funds",
    title: "Mutual Funds",
    desc: "Invest in a wide range of equity, debt, and hybrid funds to grow your wealth over time. Benefit from professional fund management, automated SIP compounding, and portfolio diversification suited to your risk appetite.",
    image: mutualFundsImg,
    icon: faChartLine,
    link: "/mutual-funds",
  },
  {
    id: "sif",
    title: "SIF (Specialised Investment Funds)",
    desc: "Goal-based, flexible investing engineered for your unique financial milestones. Leverage curated asset allocation, dynamic market hedging, and disciplined strategies designed to navigate volatility while capturing upside.",
    image: sifImg,
    icon: faCompass,
    link: "/sif",
  },
  {
    id: "nps",
    title: "National Pension System (NPS)",
    desc: "Plan for a secure, comfortable, and tax-efficient retirement. Accumulate a disciplined pension corpus with market-linked growth across equity and debt, enjoy an additional ₹50,000 tax deduction under 80CCD(1B), and secure lifelong annuity.",
    image: npsImg,
    icon: faPiggyBank,
    link: "/products/nps",
  },
  {
    id: "life-insurance",
    title: "Life Insurance",
    desc: "Comprehensive life cover to ensure your family's financial security and lifestyle continuity. Safeguard their future with high sum assured term plans, income protection, critical illness coverage, and tax benefits under Section 80C.",
    image: lifeInsuranceImg,
    icon: faShieldHeart,
    link: "/products/life-insurance",
  },
  {
    id: "general-insurance",
    title: "General Insurance",
    desc: "Protect your most valuable physical assets including your home, vehicle, business, and travel. Shield yourself from unexpected liabilities, accidents, natural damages, and financial disruptions with complete peace of mind.",
    image: generalInsuranceImg,
    icon: faBuildingShield,
    link: "/products/general-insurance",
  },
  {
    id: "health-insurance",
    title: "Health Insurance",
    desc: "Stay prepared for medical uncertainties with extensive health coverage. Access cashless hospitalization across premier hospital networks, comprehensive daycare treatments, pre/post medical care, and tax savings under Section 80D.",
    image: healthInsuranceImg,
    icon: faHeartPulse,
    link: "/products/health-insurance",
  },
  {
    id: "fixed-income-products",
    title: "Fixed Income Products",
    desc: "A secure and steady investment portfolio combining Bank & Corporate Fixed Deposits (FDs) and 100% sovereign-backed Government of India (GoI) Bonds. Enjoy assured returns, preferential senior citizen rates, and capital safety.",
    image: fixedIncomeImg,
    icon: faVault,
    link: "/products/fixed-income-products",
  },
  {
    id: "small-savings",
    title: "Post Office Small Savings Schemes",
    desc: "Government-backed savings instruments offering sovereign safety and assured returns. Invest in flagship avenues like Post Office Time Deposit (POTD), Kisan Vikas Patra (KVP), National Savings Certificate (NSC), and Post Office Recurring Deposit (PORD).",
    image: smallSavingsImg,
    icon: faCoins,
    link: "/products/post-office-small-savings-schemes",
  },
];

export default function ServicesGrid() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="pt-2 pb-12 sm:pt-4 sm:pb-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                {/* <div className="absolute top-4 right-4 w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#032e92] shadow-md border border-white/80 group-hover:scale-110 transition-transform duration-300 z-10">
                  <FontAwesomeIcon icon={service.icon} className="text-lg" />
                </div> */}
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
                      <span>Learn More</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={openLeadModal}
                      className="btn-ripple inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-md hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 group/btn cursor-pointer"
                    >
                      <span>Learn More</span>
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
