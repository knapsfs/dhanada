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

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Start Your Mutual Fund Journey Today
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal max-w-2xl sm:max-w-3xl mx-auto mt-3.5">
              Whether you are taking your very first step with a ₹500 SIP or structuring an established high-net-worth portfolio, KNAPS provides the research, technology, and dedicated guidance to grow your wealth.
            </p>


            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => openLeadModal('Mutual Funds: Final CTA Start Journey')}
                className="btn-ripple w-full sm:w-auto px-6 py-3 rounded-xl text-[15px] font-semibold bg-white text-[#032e92] hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
              >
                <span>Start Your Investment Journey</span>
              </button>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
