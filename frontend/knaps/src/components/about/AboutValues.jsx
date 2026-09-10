import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faCheckDouble, faHandshake, faUserCheck } from '@fortawesome/free-solid-svg-icons';

export default function AboutValues() {
  const values = [
    { icon: faShieldAlt, title: "Integrity", desc: "We uphold the highest ethical standards in all our financial dealings." },
    { icon: faCheckDouble, title: "Transparency", desc: "Clear, honest communication about strategies, risks, and fees." },
    { icon: faHandshake, title: "Trust", desc: "Building enduring relationships grounded in reliability and confidence." },
    { icon: faUserCheck, title: "Client First", desc: "Your financial success is the sole driver of our decision-making." }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-[#032e92]/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#f0f4fd] flex items-center justify-center text-[#032e92] mb-6 group-hover:bg-[#032e92] group-hover:text-white transition-colors duration-300">
                <FontAwesomeIcon icon={item.icon} className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
