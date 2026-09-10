import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faBuildingColumns, 
  faBriefcase, 
  faShieldAlt, 
  faStethoscope, 
  faCar, 
  faPiggyBank, 
  faUmbrellaBeach, 
  faGraduationCap, 
  faFileInvoiceDollar,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const services = [
  { icon: faChartLine, title: 'Mutual Funds', desc: 'Diversified portfolios tailored to your risk appetite.', link: '/funds' },
  { icon: faBuildingColumns, title: 'AIF', desc: 'Sophisticated alternative investments for HNIs.', link: '/#aif' },
  { icon: faBriefcase, title: 'PMS', desc: 'Expertly managed customized equity portfolios.', link: '/#pms' },
  { icon: faShieldAlt, title: 'Life Insurance', desc: 'Protecting your family\'s financial future.', link: '/#life-insurance' },
  { icon: faStethoscope, title: 'Health Insurance', desc: 'Comprehensive medical coverage for peace of mind.', link: '/#health-insurance' },
  { icon: faCar, title: 'General Insurance', desc: 'Securing your valuable physical assets.', link: '/#general-insurance' },
  { icon: faPiggyBank, title: 'Small Savings', desc: 'Government-backed secure saving schemes.', link: '/#sss' },
  { icon: faUmbrellaBeach, title: 'Retirement', desc: 'Planning for a comfortable and stress-free retirement.', link: '/calculators/retirement' },
  { icon: faGraduationCap, title: 'Child Planning', desc: 'Securing funds for education and marriage.', link: '/#child-planning' },
  { icon: faFileInvoiceDollar, title: 'Tax Planning', desc: 'Optimizing investments to legally minimize tax liabilities.', link: '/#contact' },
];

export default function ServicesSnapshot() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 rounded-full border border-gray-200 text-gray-600 font-semibold text-sm mb-4 tracking-wider uppercase"
            >
              What We Do
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900"
            >
              Comprehensive <span className="text-[#032e92]">Financial Solutions</span>
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <Link 
                to={service.link}
                className="group block h-full bg-[#f8f9fc] hover:bg-white rounded-[24px] p-6 border border-gray-100 hover:border-white hover:shadow-2xl hover:shadow-[#032e92]/10 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Hover gradient background hint */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#032e92]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#032e92] shadow-sm mb-5 group-hover:bg-[#032e92] group-hover:text-white transition-colors duration-300">
                  <FontAwesomeIcon icon={service.icon} className="text-xl" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#032e92] transition-colors">{service.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed mb-6">
                  {service.desc}
                </p>
                
                <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#c10000] group-hover:text-white transition-all duration-300">
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
