import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function BlogCTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-[#032e92] to-[#021d63] rounded-[40px] overflow-hidden p-10 md:p-16 lg:p-20 shadow-[0_30px_60px_-15px_rgba(3,46,146,0.3)]"
        >
          {/* Background Decorative SVG */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 400 400" className="absolute right-0 top-0 h-full w-auto translate-x-1/3 -translate-y-1/4">
              <circle cx="200" cy="200" r="180" fill="none" stroke="white" strokeWidth="40" />
              <circle cx="200" cy="200" r="100" fill="none" stroke="white" strokeWidth="20" />
            </svg>
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <h2 className="text-3xl md:text-[40px] font-bold text-white leading-tight mb-6">
                Ready to Start Your Financial Journey?
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-10 max-w-lg">
                Our experienced advisors can help you choose the right investment strategy based on your financial goals. Let's build a secure future together.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/#contact" className="inline-flex justify-center items-center gap-3 bg-white text-[#032e92] px-8 py-4 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-xl shadow-black/10">
                  Schedule Consultation
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
                <Link to="tel:+918800000000" className="inline-flex justify-center items-center gap-3 bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-300">
                  <FontAwesomeIcon icon={faPhoneVolume} />
                  Contact Our Advisor
                </Link>
              </div>
            </div>

            {/* Minimal Illustration inside CTA */}
            <div className="hidden lg:flex justify-end items-center">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-[280px] h-[280px] rounded-full bg-gradient-to-tr from-white/5 to-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center p-8 shadow-2xl relative"
              >
                <div className="absolute inset-x-8 bottom-16 h-1/2 flex items-end justify-between gap-3">
                  <motion.div initial={{ height: 0 }} whileInView={{ height: '40%' }} transition={{ duration: 1 }} className="w-full bg-white/40 rounded-t-lg"></motion.div>
                  <motion.div initial={{ height: 0 }} whileInView={{ height: '70%' }} transition={{ duration: 1, delay: 0.2 }} className="w-full bg-white/70 rounded-t-lg"></motion.div>
                  <motion.div initial={{ height: 0 }} whileInView={{ height: '100%' }} transition={{ duration: 1, delay: 0.4 }} className="w-full bg-white rounded-t-lg"></motion.div>
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
