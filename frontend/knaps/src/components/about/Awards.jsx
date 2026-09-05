import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuildingColumns, 
  faAward, 
  faMedal, 
  faCertificate, 
  faTrophy 
} from '@fortawesome/free-solid-svg-icons';

const awards = [
  { icon: faBuildingColumns, title: 'SEBI Registered', desc: 'Officially recognized by the Securities and Exchange Board of India.' },
  { icon: faAward, title: 'ISO Certified', desc: 'ISO 9001:2015 certified for quality wealth management processes.' },
  { icon: faCertificate, title: 'Certified Financial Advisors', desc: 'Our core team holds prestigious global financial certifications.' },
  { icon: faTrophy, title: 'Industry Recognition', desc: 'Awarded "Best Wealth Manager" by leading financial publications.' },
  { icon: faMedal, title: 'Professional Memberships', desc: 'Active members of elite global financial planning associations.' }
];

export default function Awards() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full border border-gray-200 text-gray-600 font-semibold text-sm mb-4 tracking-wider uppercase"
          >
            Trust & Credibility
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Awards & <span className="text-[#032e92]">Certifications</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Our commitment to excellence is validated by industry-leading institutions.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {awards.map((award, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] hover:shadow-2xl hover:shadow-[#032e92]/10 hover:border-[#032e92]/30 transition-all duration-300 group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#f8f9fc] flex items-center justify-center text-[#c10000] mb-6 group-hover:bg-[#c10000] group-hover:text-white transition-colors duration-300">
                <FontAwesomeIcon icon={award.icon} className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{award.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {award.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
