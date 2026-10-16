import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faReceipt,
  faCoins,
  faChartLine,
  faHourglassHalf
} from '@fortawesome/free-solid-svg-icons';

const benefits = [
  {
    icon: faShieldHalved,
    title: 'Tax free corpus',
    description:
      'Withdraw up to 60% of your corpus as a tax-exempt lump sum amount at age 60.'
  },
  {
    icon: faReceipt,
    title: 'Tax deductions',
    description:
      'Get tax deductions of up to ₹2 lakh under 80CCD(1) and 80CCD(1B), subject to eligibility and tax regime.'
  },
  {
    icon: faCoins,
    title: 'Lump Sum + Retirement Income',
    description:
      'Withdraw up to 60% of your corpus as a lump sum at retirement, and 40% as annuity for regular income.'
  },
  {
    icon: faChartLine,
    title: 'Market Linked returns',
    description:
      'Invest across equity (E), corporate bonds (C), government securities (G), and alternate investments (A).'
  },
  {
    icon: faHourglassHalf,
    title: 'Disciplined investing',
    description:
      'When investments stay undisturbed for a long time, you see the magic of compounding.'
  }
];

export default function WhyConsiderNps() {
  const topRow = benefits.slice(0, 3);
  const bottomRow = benefits.slice(3, 5);

  const renderCard = (item, idx) => (
    <div
      key={idx}
      className="group p-7 sm:p-8 rounded-2xl bg-[#f8fafc] border border-slate-100 hover:border-[#032e92]/30 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col items-center text-center"
    >
      <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center text-lg mb-5 transition-all duration-300 shadow-sm">
        <FontAwesomeIcon icon={item.icon} />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 group-hover:text-[#032e92] transition-colors">
        {item.title}
      </h3>
      <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed max-w-sm">
        {item.description}
      </p>
    </div>
  );

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#032e92] text-xs font-semibold tracking-wider uppercase mb-3"
          >
            Why NPS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900"
          >
            Why invest in <span className="text-[#032e92]">NPS</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3"
          >
            Discover how the National Pension System combines tax efficiency, market-linked growth, and structured retirement income into a disciplined long-term wealth plan.
          </motion.p>
        </div>

        {/* Top Row: 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
          {topRow.map((item, idx) => renderCard(item, idx))}
        </div>

        {/* Bottom Row: 2 Cards Centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {bottomRow.map((item, idx) => renderCard(item, idx + 3))}
        </div>
      </div>
    </section>
  );
}
