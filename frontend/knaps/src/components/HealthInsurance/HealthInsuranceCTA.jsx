import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faPhone,
  faCheckCircle,
  faLock,
  faStar,
  faShieldHeart
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function HealthInsuranceCTA() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a192f] via-[#032e92] to-[#021d63] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-blue-900/40">
          {/* Decorative Lighting Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-10 sm:mb-12" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">


            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-white leading-tight mb-4">
              Don’t Wait for a Medical Emergency to <br className="hidden sm:inline" />
              <span className="text-blue-100">
                Realize the Value of Health Cover
              </span>
            </h2>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-blue-100/90 font-normal max-w-2xl mx-auto leading-relaxed mt-3.5 mb-8">
              Lock in lower lifelong premiums while you and your family are healthy. Compare tailored health policies across 15+ top IRDAI insurers with dedicated cashless claims support.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => openLeadModal({ title: 'Protect Family Health Now', defaultService: 'Health Insurance' })}
                className="w-full sm:w-auto btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-white text-[#032e92] hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
              >
                <span>Compare Health Plans Free</span>
              </button>

              <a
                href="tel:+919990243143"
                className="w-full sm:w-auto btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold text-white/95 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2.5 backdrop-blur-sm cursor-pointer"
              >
                <span>Call (+91) 9990243143</span>
              </a>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}
