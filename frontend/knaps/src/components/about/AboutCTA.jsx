import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPhoneVolume, faEnvelope, faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons';

export default function AboutCTA() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main CTA Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#032e92] via-[#021d63] to-[#01123d] rounded-[40px] overflow-hidden mb-16 p-10 md:p-16 lg:p-20 text-center shadow-2xl"
        >
          {/* Abstract background graphics */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#c10000]/20 to-transparent rounded-tr-full pointer-events-none blur-xl"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Let's Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">Financial Future</span> Together
            </h2>
            <p className="text-lg text-blue-100/90 mb-10 leading-relaxed">
              Take the first step towards securing your wealth and achieving your grandest goals. Our experts are ready to craft a strategy exclusively for you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-gradient-to-r from-white to-blue-50 text-[#032e92] px-8 py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                Book Consultation
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
              <button className="w-full sm:w-auto bg-[#c10000] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-red-700 hover:shadow-red-900/50 transition-all duration-300 flex items-center justify-center gap-3">
                Call Our Experts
                <FontAwesomeIcon icon={faPhoneVolume} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Contact Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6"
        >
          {/* Location */}
          <div className="bg-[#f8f9fc] rounded-3xl p-6 flex items-start gap-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#c10000] shadow-sm shrink-0">
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Visit Us</h4>
              <p className="text-sm text-gray-500 leading-relaxed">G-6, Vardhman Plaza, LSC, Mayur Vihar Phase - 2, New Delhi - 110091</p>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-[#f8f9fc] rounded-3xl p-6 flex items-start gap-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#032e92] shadow-sm shrink-0">
              <FontAwesomeIcon icon={faPhoneVolume} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Call Us</h4>
              <p className="text-sm text-gray-500 leading-relaxed">(+91) 9990243143</p>
            </div>
          </div>

          {/* Email */}
          <div className="bg-[#f8f9fc] rounded-3xl p-6 flex items-start gap-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#032e92] shadow-sm shrink-0">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
              <p className="text-sm text-gray-500 leading-relaxed">connect@knaps.in</p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-[#f8f9fc] rounded-3xl p-6 flex items-start gap-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#c10000] shadow-sm shrink-0">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Working Hours</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Mon - Sat: 10AM - 6PM<br/>Sunday: Closed</p>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
