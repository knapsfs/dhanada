import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHeart, faArrowRight, faPhone, faLock } from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function LifeInsuranceCTA() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl bg-gradient-to-br from-[#032e92] via-[#0948cd] to-[#021d63] p-8 sm:p-12 lg:p-16 text-white shadow-2xl shadow-blue-900/20 overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-white/10 blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-emerald-400/10 blur-3xl pointer-events-none -ml-10 -mb-10" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-blue-100 mb-6">
              <FontAwesomeIcon icon={faShieldHeart} className="text-emerald-300" />
              <span>Zero-Hassle Protection</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-6">
              Secure Your Family’s Tomorrow,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-emerald-300">
                Starting Today
              </span>
            </h2>

            <p className="text-blue-100 text-base sm:text-lg leading-relaxed font-normal mb-10 max-w-2xl mx-auto">
              Schedule a 15-minute consultation with our certified insurance planners. We compare all top Indian insurers to find your family maximum coverage at the lowest premium.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                type="button"
                onClick={openLeadModal}
                className="btn-ripple w-full sm:w-auto px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-white text-[#032e92] hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>Get Free Insurance Consultation</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="tel:+919990243143"
                className="btn-ripple w-full sm:w-auto px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
              >
                <FontAwesomeIcon icon={faPhone} className="text-xs text-emerald-300" />
                <span>Call Us: (+91) 9990243143</span>
              </a>
            </div>

            {/* Reassurance Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-blue-200 font-medium">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLock} className="text-emerald-300 text-[10px]" />
                <span>100% Confidential & Secure</span>
              </div>
              <span className="hidden sm:inline text-blue-400">•</span>
              <div>Zero Spam Calls Guarantee</div>
              <span className="hidden sm:inline text-blue-400">•</span>
              <div>Unbiased Fiduciary Guidance</div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
