import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function NpsCTA() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#032e92] via-[#021d63] to-[#0a192f] z-0" />

      {/* Decorative Lighting Shapes */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full border-[40px] border-white/5 opacity-40 blur-sm" />
        <div className="absolute bottom-[10%] -left-[10%] w-[320px] h-[320px] rounded-full bg-blue-400/10 blur-2xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Pill Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            Secure Your Retirement
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
            Ready to Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Retirement Corpus?</span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed font-normal">
            Start your National Pension System account with structured asset allocation, tax efficiency, and long-term compounding.
          </p>

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-center">
            <button
              type="button"
              onClick={() =>
                openLeadModal({
                  title: 'Start National Pension System (NPS)',
                  defaultService: 'National Pension System (NPS)'
                })
              }
              className="btn-ripple px-8 py-3.5 rounded-xl text-[15px] font-semibold bg-white text-[#032e92] hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <span>Get Started with NPS</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-xs transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
