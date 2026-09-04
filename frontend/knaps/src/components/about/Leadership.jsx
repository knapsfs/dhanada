import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const leaders = [
  {
    name: 'Anil Kumar',
    designation: 'Founder & CEO',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    intro: 'Visionary leader with 25+ years in wealth management and investment banking.',
  },
  {
    name: 'Priya Sharma',
    designation: 'Chief Investment Officer',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    intro: 'Expert in portfolio strategy, asset allocation, and alternative investments.',
  },
  {
    name: 'Rajiv Mehta',
    designation: 'Head of Advisory',
    image: 'https://randomuser.me/api/portraits/men/86.jpg',
    intro: 'Specializes in comprehensive financial planning and generational wealth transfer.',
  },
  {
    name: 'Sneha Patel',
    designation: 'Director of Operations',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    intro: 'Ensures seamless execution, compliance, and exceptional client experiences.',
  }
];

export default function Leadership() {
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
            Our Experts
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Meet Our <span className="text-[#032e92]">Leadership</span> Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            The visionaries driving our commitment to excellence and client success.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {leaders.map((leader, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group relative bg-[#f8f9fc] rounded-[32px] p-6 hover:bg-white border border-gray-100 hover:shadow-2xl hover:shadow-[#032e92]/5 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative w-full aspect-square rounded-[24px] overflow-hidden mb-6">
                <img 
                  src={leader.image} 
                  alt={leader.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#032e92]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <a href="#" className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#032e92] shadow-lg translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[#c10000] hover:text-white">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                <p className="text-[#c10000] font-semibold text-sm mb-4">{leader.designation}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{leader.intro}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
