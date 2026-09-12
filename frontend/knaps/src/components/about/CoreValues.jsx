import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faHandshake, 
  faLightbulb, 
  faPeopleGroup, 
  faScaleBalanced, 
  faArrowTrendUp 
} from '@fortawesome/free-solid-svg-icons';

const values = [
  { icon: faShieldAlt, title: 'Integrity', desc: 'We act with unyielding honesty and uphold the highest ethical standards.' },
  { icon: faHandshake, title: 'Trust', desc: 'Building long-term relationships through transparent and reliable advice.' },
  { icon: faScaleBalanced, title: 'Transparency', desc: 'Clear communication, upfront fees, and no hidden agendas.' },
  { icon: faPeopleGroup, title: 'Customer First', desc: 'Your financial well-being is the driving force behind every decision.' },
  { icon: faLightbulb, title: 'Innovation', desc: 'Leveraging modern strategies and technologies to optimize your portfolio.' },
  { icon: faArrowTrendUp, title: 'Long-Term Growth', desc: 'Focusing on sustainable wealth creation rather than short-term gains.' }
];

export default function CoreValues() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      
      {/* Abstract background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#032e92]/[0.02] z-0"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-sm mb-6 tracking-wide"
          >
            Our Philosophy
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6"
          >
            Core <span className="text-[#032e92]">Values</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            The foundational principles that guide our every interaction, strategy, and investment decision.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-transparent relative overflow-hidden transition-all duration-300"
            >
              {/* Gradient border effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#032e92] to-[#c10000] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 rounded-3xl"></div>
              
              {/* Inner card content (needs bg-white to hide the gradient behind it, except for a 2px border) */}
              <div className="absolute inset-[2px] bg-white rounded-[22px] -z-10"></div>
              
              <div className="w-14 h-14 rounded-2xl bg-[#f7f9fc] flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-[#032e92] group-hover:to-[#c10000] transition-colors duration-300">
                <FontAwesomeIcon icon={value.icon} className="text-[#032e92] group-hover:text-white text-2xl transition-colors duration-300" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
