import React from 'react';
import { useLeadModal } from '../../context/LeadModalContext';

export default function AboutCTA() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#032e92] via-[#021d63] to-[#011347] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl shadow-blue-950/20">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Ready to Start Investing for Your Goals?
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal max-w-2xl sm:max-w-3xl mx-auto mt-3.5">
              Take the first step towards financial freedom. Schedule a one-on-one session with us to discuss your investment goals.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => openLeadModal('About Us: Book Consultation')}
                className="btn-ripple w-full sm:w-auto px-6 py-3 rounded-xl text-md font-semibold bg-white text-[#032e92] hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
              >
                <span>Book Consultation</span>
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
