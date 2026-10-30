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
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs sm:text-sm font-semibold shadow-inner">
              <FontAwesomeIcon icon={faShieldHeart} className="text-blue-300 text-xs" />
              <span>Lifelong Medical & Financial Peace of Mind</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Don’t Wait for a Medical Emergency to <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                Realize the Value of Health Cover
              </span>
            </h2>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
              Lock in lower lifelong premiums while you and your family are healthy. Compare tailored health policies across 15+ top IRDAI insurers with dedicated cashless claims support.
            </p>

            {/* Trust Checklist */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 text-xs sm:text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 flex-shrink-0 text-sm" />
                <span>14,000+ Cashless Hospitals</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 flex-shrink-0 text-sm" />
                <span>1-Hour Cashless Pre-Auth</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 flex-shrink-0 text-sm" />
                <span>Save up to ₹1 Lakh Tax u/s 80D</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLock} className="text-amber-300 flex-shrink-0 text-xs" />
                <span>100% Privacy & Zero Spam</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => openLeadModal({ title: 'Protect Family Health Now', defaultService: 'Health Insurance' })}
                className="w-full sm:w-auto btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-white text-[#032e92] hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
              >
                <span>Compare Health Plans Free</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[#032e92] group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="tel:+918080808080"
                className="w-full sm:w-auto btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold text-white/95 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2.5 backdrop-blur-sm cursor-pointer"
              >
                <FontAwesomeIcon icon={faPhone} className="text-blue-200" />
                <span>Call +91 8080808080</span>
              </a>
            </div>

            {/* Footer Disclaimer */}
            <p className="text-xs text-blue-200/70 pt-2">
              KNAPS Wealth & Insurance Solutions is an IRDAI compliant advisory platform. All policies underwritten directly by registered insurers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
