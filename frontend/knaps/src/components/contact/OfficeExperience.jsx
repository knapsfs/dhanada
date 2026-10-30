import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export default function OfficeExperience() {
  return (
    <section className="py-12 sm:py-16 bg-[#f8fafc] relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {/* <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-xs sm:text-sm mb-4 uppercase tracking-wider"
          >
            Visit Our Office
          </motion.div> */}

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-black tracking-tight leading-tight max-w-4xl mx-auto mb-4"
          >
            Visit Our Office for <span className="text-[#032e92]">One-on-One Discussion</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
          >
            Meet our senior wealth advisory team in person for dedicated financial planning, comprehensive portfolio reviews, and personalized goal mapping.
          </motion.p>
        </div>

        {/* Embedded Google Map with Floating Location Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-[420px] sm:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/90 shadow-sm relative group bg-white"
        >
          {/* Subtle brand tint overlay */}
          <div className="absolute inset-0 bg-[#032e92]/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10"></div>

          {/* Interactive Google Map */}
          <iframe
            src="https://maps.google.com/maps?q=DLF%20Galleria%2C%20Mayur%20Vihar%20Phase%201%2C%20Delhi%20110091&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="KNAPS Private Limited Office Location"
            className="absolute inset-0"
          ></iframe>

          {/* Floating Glassmorphism Address Card */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 z-20 max-w-md bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#032e92] border border-blue-100 flex items-center justify-center shrink-0 text-sm">
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900 truncate">KNAPS Private Limited</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-[#032e92] shrink-0">HQ</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  DG-206A, DLF Galleria, Plot No 1B, Mayur Vihar Phase - 1, East Delhi - 110091
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <a
                    href="https://maps.google.com/?q=DLF+Galleria+Mayur+Vihar+Phase+1+Delhi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#032e92] hover:text-[#022169] transition-colors"
                  >
                    <span>Get Directions</span>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                  </a>
                  <span className="text-gray-300">|</span>
                  <span className="text-[11px] text-gray-500 font-medium">Mon - Fri: 9 AM - 6 PM</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}