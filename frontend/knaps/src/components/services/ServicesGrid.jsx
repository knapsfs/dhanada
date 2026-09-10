import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPiggyBank, faCoins, faShieldHeart, faHeartPulse,
  faBuildingShield, faPeopleRoof, faPersonWalkingLuggage, faArrowRight, faCheck
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const services = [
  {
    id: "nps",
    title: "National Pension System (NPS)",
    icon: faPiggyBank,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
    desc: "Build a disciplined retirement corpus with government-backed pension planning.",
    features: ["Tax Benefits", "Long-Term Growth", "Retirement Income", "Flexible Contributions"]
  },
  {
    id: "sss",
    title: "Small Savings Scheme",
    icon: faCoins,
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop",
    desc: "Secure government-backed savings options for steady and reliable returns.",
    features: ["Low Risk", "Guaranteed Returns", "Capital Protection", "Flexible Investment"]
  },
  {
    id: "life-insurance",
    title: "Life Insurance",
    icon: faShieldHeart,
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop",
    desc: "Protect your family's financial future with comprehensive life insurance solutions.",
    features: ["Financial Security", "Tax Benefits", "Life Cover", "Long-Term Protection"]
  },
  {
    id: "health-insurance",
    title: "Health Insurance",
    icon: faHeartPulse,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
    desc: "Protect yourself and your loved ones from unexpected medical expenses.",
    features: ["Cashless Treatment", "Hospital Cover", "Critical Illness", "Family Plans"]
  },
  {
    id: "general-insurance",
    title: "General Insurance",
    icon: faBuildingShield,
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=800&auto=format&fit=crop",
    desc: "Protect your valuable assets with comprehensive insurance coverage.",
    features: ["Motor Insurance", "Home Insurance", "Business Insurance", "Travel Insurance"]
  },
  {
    id: "child-planning",
    title: "Child Marriage Planning",
    icon: faPeopleRoof,
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop",
    desc: "Create a financial roadmap for your child's future education and marriage expenses.",
    features: ["Goal Planning", "Regular Investments", "Long-Term Wealth", "Financial Security"]
  },
  {
    id: "retirement",
    title: "Retirement Planning",
    icon: faPersonWalkingLuggage,
    image: "https://images.unsplash.com/photo-1507206130118-b5907f817163?q=80&w=800&auto=format&fit=crop",
    desc: "Plan today for a financially independent and stress-free retirement.",
    features: ["Retirement Corpus", "Passive Income", "Wealth Preservation", "Tax Efficient Planning"]
  }
];

function ServiceCard({ service, index }) {
  // Alternate image and content placement slightly for visual interest on desktop
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(3,46,146,0.15)] transition-all duration-500 group flex flex-col"
    >
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/60 via-[#0a192f]/10 to-transparent"></div>

        {/* Floating Icon */}
        <div className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#032e92] shadow-lg border border-white z-10 transition-transform group-hover:scale-110">
          <FontAwesomeIcon icon={service.icon} className="text-xl" />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors line-clamp-1">
          {service.title}
        </h3>

        <p className="text-gray-500 text-[14px] leading-relaxed mb-6 flex-1 line-clamp-3">
          {service.desc}
        </p>

        {/* Features List */}
        <div className="space-y-2 mb-8">
          {service.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3 text-[13px] text-gray-700 font-medium">
              <FontAwesomeIcon icon={faCheck} className="text-[#c10000] text-[10px]" />
              {feature}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Link
          to={`/#${service.id}`}
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-[#f8f9fa] text-[#032e92] font-semibold text-sm group-hover:bg-[#032e92] group-hover:text-white transition-colors duration-300"
        >
          <span>Learn More</span>
          <FontAwesomeIcon icon={faArrowRight} className="transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function ServicesGrid() {
  return (
    <section className="py-12 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
