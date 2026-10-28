import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faShieldHalved,
  faPhone,
  faEnvelope,
  faCompass,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function MfCTA() {
  const { openLeadModal } = useLeadModal();

  const scrollToExplore = () => {
    const el = document.getElementById('explore-funds');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 lg:py-24 bg-[#f7f9fc] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#032e92] via-[#021d63] to-[#011347] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl shadow-blue-950/20">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-semibold text-blue-200">
              <FontAwesomeIcon icon={faShieldHalved} className="text-cyan-400" />
              <span>AMFI Registered Mutual Fund Distributor • ARN-367144</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Start Your Mutual Fund Journey Today
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal max-w-2xl mx-auto">
              Whether you are taking your very first step with a ₹500 SIP or structuring an established high-net-worth portfolio, KNAPS provides the research, technology, and unbiased advisory to grow your wealth.
            </p>

            {/* Trust Checklist */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-blue-100 font-medium">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-cyan-400" />
                100% Paperless KYC
              </span>
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-cyan-400" />
                40+ Vetted AMCs
              </span>
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-cyan-400" />
                No Hidden Fees
              </span>
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCheckCircle} className="text-cyan-400" />
                SEBI & AMFI Compliant
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => openLeadModal('Mutual Funds: Final CTA Start Journey')}
                className="px-8 py-4 rounded-2xl bg-white text-[#032e92] font-extrabold text-sm sm:text-base shadow-xl shadow-black/20 hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <span>Start Your Investment Journey</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>

              <button
                type="button"
                onClick={scrollToExplore}
                className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <FontAwesomeIcon icon={faCompass} className="text-cyan-400" />
                <span>Explore Mutual Funds</span>
              </button>
            </div>

            {/* Contact Micro-Strip */}
            <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-200">
              <a href="tel:+919990243143" className="flex items-center gap-2 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faPhone} />
                <span>(+91) 9990243143</span>
              </a>
              <span className="text-white/20">•</span>
              <a href="mailto:connect@knaps.in" className="flex items-center gap-2 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faEnvelope} />
                <span>connect@knaps.in</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
