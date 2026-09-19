import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';

const infoCards = [
  {
    icon: faLocationDot,
    title: 'Office Address',
    details: ['123 Financial District, Suite 500 New Delhi, India 110001']
  },
  {
    icon: faPhone,
    title: 'Phone Number',
    details: ['+91 98765 43210', '+91 11 4321 8765']
  },
  {
    icon: faEnvelope,
    title: 'Email Address',
    details: ['contact@knaps.com', 'support@knaps.com']
  },
  {
    icon: faClock,
    title: 'Working Hours',
    details: ['Monday – Friday', '9:00 AM – 6:00 PM']
  }
];

export default function ContactInfo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full content-start">
      {infoCards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="bg-white p-8 rounded-3xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] border border-blue-50/50 flex flex-col items-start transition-all hover:shadow-[0_20px_40px_-15px_rgba(3,46,146,0.15)] relative overflow-hidden group"
        >
          {/* Decorative hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#eef5ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10 w-12 h-12 bg-[#032e92] rounded-2xl flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
            <FontAwesomeIcon icon={card.icon} className="text-xl" />
          </div>
          <h4 className="relative z-10 text-lg font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors">{card.title}</h4>
          <div className="relative z-10 text-gray-500 text-[15px] space-y-1">
            {card.details.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
