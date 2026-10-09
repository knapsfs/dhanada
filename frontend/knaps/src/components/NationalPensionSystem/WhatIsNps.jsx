import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie,
  faChild,
  faBuilding,
  faLandmark,
  faArrowRight,
  faCalculator,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function WhatIsNps() {
  const { openLeadModal } = useLeadModal();

  const scrollToCalculator = () => {
    const el = document.getElementById('nps-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const npsVariants = [
    {
      icon: faUserTie,
      title: 'Regular NPS',
      subtitle: 'For Your Retirement',
      badge: 'Individual Tier I & II',
      description:
        'Designed for all Indian citizens (18-70 years) to systematically build a retirement corpus with flexible asset allocation (up to 75% equity) and exclusive tax benefits.',
      highlights: ['Extra ₹50,000 u/s 80CCD(1B)', 'Lowest expense ratios globally', '60% tax-free lump sum exit']
    },
    {
      icon: faChild,
      title: 'NPS Vatsalya',
      subtitle: "For Your Child's Future",
      badge: 'Minors (< 18 Years)',
      description:
        'A dedicated long-term wealth initiative started by parents or guardians for minor children, compounding wealth from childhood and seamlessly transitioning into adulthood.',
      highlights: ['Early compounding advantage', 'Seamless conversion at age 18', 'PFRDA regulated architecture']
    },
    {
      icon: faBuilding,
      title: 'Corporate NPS',
      subtitle: 'For Companies & Employees',
      badge: 'Employer - Employee Benefit',
      description:
        'A structured retirement benefit program adopted by corporations, allowing employees to claim additional tax deductions on employer contributions under Section 80CCD(2).',
      highlights: ['Tax deduction u/s 80CCD(2)', 'Zero cost setup for employers', 'Enhanced employee retention']
    },
    {
      icon: faLandmark,
      title: 'Govt. Sector NPS',
      subtitle: 'For Central & State Govt Employees',
      badge: 'Govt Employees',
      description:
        'Applicable to employees of Central, State Governments, and autonomous bodies, featuring an enhanced 14% government contribution and defined investment choices.',
      highlights: ['14% Govt. contribution matching', 'Sec 80CCD(2) tax exemption', 'Structured sovereign safety']
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header: Left (Titles) & Right (Tax-Free Investment) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-b border-gray-100 pb-8 sm:pb-10"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#032e92] tracking-tight">
                National Pension System (NPS)
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl font-medium text-[#032e92] mt-1">
                Pension for All
              </p>
            </div>

            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight shrink-0 md:text-right">
              Tax- Free Investment
            </div>
          </div>

          {/* Description Paragraph directly from reference design */}
          <p className="text-sm sm:text-base md:text-[17px] text-gray-700 font-normal leading-relaxed mt-6 max-w-6xl">
            NPS is a market-linked retirement investment that helps build a corpus over the years - Regular NPS for your retirement, NPS Vatsalya for your child’s future, and Corporate NPS for companies looking to provide a structured retirement benefit to their employees. You invest over time, let the corpus compound, and at eligible exit, withdraw your corpus as a combination of lumpsum/ annuity.
          </p>
        </motion.div>

        {/* 4 NPS Streams (Regular, Vatsalya, Corporate, Government) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 mt-10 sm:mt-12">
          {npsVariants.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="rounded-2xl p-6 sm:p-7 bg-[#f8fafc] border border-gray-100 hover:border-[#032e92]/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#eef5ff] text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white transition-all duration-300 flex items-center justify-center text-lg shadow-sm">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <span className="text-[11px] font-semibold text-[#032e92] bg-[#eef5ff] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-black mb-0.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-[#032e92] mb-3">
                  {item.subtitle}
                </p>

                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal mb-5">
                  {item.description}
                </p>

                <ul className="space-y-2 pt-2 border-t border-gray-200/60">
                  {item.highlights.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 text-[11px] shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/60">
                <button
                  type="button"
                  onClick={() =>
                    openLeadModal({
                      title: `Explore ${item.title}`,
                      defaultService: 'National Pension System (NPS)'
                    })
                  }
                  className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#032e92] bg-white hover:bg-[#032e92] hover:text-white border border-blue-100 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Inquire for {item.title}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons Strip */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() =>
              openLeadModal({
                title: 'Start National Pension System (NPS)',
                defaultService: 'National Pension System (NPS)'
              })
            }
            className="btn-ripple w-full sm:w-auto px-8 py-3.5 rounded-xl text-[15px] font-semibold bg-[#032e92] hover:bg-[#022169] text-white shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Start Your NPS Investment</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>

          <button
            type="button"
            onClick={scrollToCalculator}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-[15px] font-semibold bg-white hover:bg-blue-50 text-[#032e92] border border-[#032e92]/20 shadow-sm hover:shadow-md transition-all duration-300 inline-flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faCalculator} className="text-xs" />
            <span>Calculate Retirement Corpus</span>
          </button>
        </div>

      </div>
    </section>
  );
}
