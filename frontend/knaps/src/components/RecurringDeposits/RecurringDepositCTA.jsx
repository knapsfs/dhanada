import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faPhone,
  faCheckCircle,
  faRotate,
  faShieldHalved,
  faCoins,
  faAward
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function RecurringDepositCTA() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a192f] via-[#032e92] to-[#021d63] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-blue-900/40">
          {/* Decorative Glow Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-10 sm:mb-12" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs sm:text-sm font-semibold shadow-inner">
              <FontAwesomeIcon icon={faRotate} className="text-blue-300 text-xs animate-spin-slow" />
              <span>Disciplined Monthly Wealth Accumulation</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Start Small, Build Significant Reserves <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                with Structured Recurring Deposits
              </span>
            </h2>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
              Automate your monthly savings habit with guaranteed quarterly compounding and complete peace of mind. Compare top institutional banks and lock in your predetermined yield today.
            </p>

            {/* Trust Checklist */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 text-xs sm:text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 flex-shrink-0 text-sm" />
                <span>Starts at ₹500/Month</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-400 flex-shrink-0 text-sm" />
                <span>DICGC Insured Banks up to ₹5L</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faAward} className="text-emerald-400 flex-shrink-0 text-sm" />
                <span>Senior Citizen +0.50% Edge</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCoins} className="text-amber-300 flex-shrink-0 text-xs" />
                <span>Zero Brokerage or Hidden Fees</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() =>
                  openLeadModal({
                    title: 'Explore Recurring Deposit Options',
                    defaultService: 'Recurring Deposits'
                  })
                }
                className="w-full sm:w-auto btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-white text-[#032e92] hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
              >
                <span>Explore RD Options</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-sm transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <a
                href="tel:+918080808080"
                className="w-full sm:w-auto btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm cursor-pointer"
              >
                <FontAwesomeIcon icon={faPhone} className="text-sm text-blue-200" />
                <span>Talk to a Financial Professional</span>
              </a>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-blue-200/70 pt-4 max-w-2xl mx-auto leading-relaxed">
              * Recurring Deposit interest rates, tenure offerings, premature withdrawal rules, delayed payment charges, and TDS provisions are subject to the specific terms and conditions of the respective issuing bank or postal authority and prevailing tax regulations. DICGC insurance applies to eligible commercial and cooperative banks up to ₹5 Lakh.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
