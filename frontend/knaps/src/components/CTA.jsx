import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#032e92] via-[#021d63] to-[#c10000] z-0"></div>

      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full border-[40px] border-white/5 opacity-50 blur-sm"></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[300px] h-[300px] rounded-full bg-white/10 opacity-30 blur-2xl"></div>
        <div className="absolute top-[40%] right-[20%] w-32 h-32 rounded-full bg-[#c10000]/40 blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Grow Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Wealth?</span>
          </h2>

          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Take the first step towards financial freedom. Schedule a one-on-one session with our expert advisors to discuss your customized wealth strategy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to="#contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white text-[#032e92] shadow-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors btn-ripple"
              >
                Schedule Consultation
              </motion.button>
            </Link>


          </div>
        </motion.div>
      </div>
    </section>
  );
}
