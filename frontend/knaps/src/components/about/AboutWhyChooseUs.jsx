import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserTie, 
  faChartPie, 
  faShieldHalved, 
  faReceipt, 
  faBullseye, 
  faHandshakeAngle 
} from '@fortawesome/free-solid-svg-icons';

const reasons = [
  { icon: faUserTie, title: 'Certified Experts', desc: 'Our team consists of industry-leading certified financial advisors.' },
  { icon: faChartPie, title: 'Personalised Advice', desc: 'Strategies custom-tailored to your unique financial situation.' },
  { icon: faShieldHalved, title: 'Risk Management', desc: 'Advanced protocols to protect your capital against volatility.' },
  { icon: faReceipt, title: 'Transparent Fees', desc: 'Absolutely no hidden charges. What you see is what you pay.' },
  { icon: faBullseye, title: 'Goal Based Planning', desc: 'Focused on achieving your specific life milestones and dreams.' },
  { icon: faHandshakeAngle, title: 'Dedicated Manager', desc: 'A single point of contact for all your wealth management needs.' },
];

export default function AboutWhyChooseUs() {
  return (
    <section className="py-24 bg-[#032e92] relative overflow-hidden rounded-[40px] mx-4 lg:mx-8 mb-24">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#021d63] to-transparent opacity-50 z-0"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full border-[20px] border-white/5 z-0"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full border-[15px] border-[#c10000]/20 z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-white/10 text-white font-semibold text-sm mb-4 tracking-wider backdrop-blur-sm"
          >
            Why Choose Knaps
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            The Premium Advantage
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#c10000] flex items-center justify-center mb-6 shadow-lg shadow-[#c10000]/20 group-hover:-translate-y-1 transition-transform duration-300">
                <FontAwesomeIcon icon={reason.icon} className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{reason.title}</h3>
              <p className="text-blue-100/80 text-sm leading-relaxed">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
