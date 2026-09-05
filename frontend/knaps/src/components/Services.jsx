import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuildingColumns, faHandHoldingDollar, faHeartPulse, 
  faPiggyBank, faShieldHeart, faUsers, faArrowTrendUp,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const services = [
  { id: 1, title: 'NPS', icon: faBuildingColumns, description: 'National Pension System investments for a secure, tax-efficient retirement.' },
  { id: 2, title: 'Small Savings Scheme', icon: faPiggyBank, description: 'Safe and secure government-backed savings schemes with guaranteed returns.' },
  { id: 3, title: 'Life Insurance', icon: faHandHoldingDollar, description: 'Comprehensive life cover to ensure your family’s financial security in any eventuality.' },
  { id: 4, title: 'Health Insurance', icon: faHeartPulse, description: 'Premium health insurance plans covering major medical expenses and emergencies.' },
  { id: 5, title: 'General Insurance', icon: faShieldHeart, description: 'Protect your valuable assets including home, vehicle, and business with our robust plans.' },
  { id: 6, title: 'Child Marriage Planning', icon: faUsers, description: 'Dedicated financial planning to secure your child’s future milestones and marriage.' },
  { id: 7, title: 'Retirement Planning', icon: faArrowTrendUp, description: 'Strategic planning to build a corpus that ensures a comfortable and stress-free retirement.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Services() {
  return (
    <section id="services" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-white to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-[#eef5ff] text-[#032e92] font-semibold text-sm mb-4 uppercase tracking-wider"
          >
            Our Services
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-6"
          >
            Comprehensive Wealth <span className="text-[#032e92]">Solutions</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#6b7280]"
          >
            Explore our wide range of premium financial services designed to protect and grow your wealth across generations.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8"
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={itemVariants}>
              <div className="group h-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-[#032e92]/10 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col">
                
                {/* Gradient Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#032e92] to-[#c10000] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-[#eef5ff] group-hover:bg-white/20 flex items-center justify-center mb-6 transition-colors duration-300">
                    <FontAwesomeIcon icon={service.icon} className="text-[#032e92] group-hover:text-white text-2xl transition-colors duration-300" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-3 transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-500 group-hover:text-gray-100 text-sm leading-relaxed mb-6 flex-1 transition-colors duration-300">
                    {service.description}
                  </p>
                  
                  <Link to="#" className="inline-flex items-center gap-2 text-sm font-bold text-[#c10000] group-hover:text-white transition-colors duration-300 mt-auto">
                    Explore Service
                    <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
