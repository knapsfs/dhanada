import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faReceipt,
  faCoins,
  faChartLine,
  faHourglassHalf,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

const benefits = [
  {
    icon: faShieldHalved,
    badge: 'Tax Exemption',
    title: 'Tax-Free Corpus',
    highlight: '60% Lump Sum Tax-Exempt',
    description:
      'Withdraw up to 60% of your accumulated corpus as a 100% tax-free lump sum amount when you reach 60 years of age.',
    takeaway: 'Zero tax on eligible 60% withdrawals',
    theme: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badgeBg: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
      highlightColor: 'text-emerald-700 bg-emerald-50/60 border-emerald-100',
      accentHover: 'hover:border-emerald-300/80 hover:shadow-emerald-900/5',
      checkColor: 'text-emerald-500',
    },
  },
  {
    icon: faReceipt,
    badge: 'Extra Deductions',
    title: 'Substantial Tax Deductions',
    highlight: 'Up to ₹2,00,000 / Year',
    description:
      'Claim deductions up to ₹1.5L under Sec 80CCD(1) plus an exclusive additional ₹50,000 under Sec 80CCD(1B).',
    takeaway: 'Exclusive ₹50,000 deduction over & above 80C',
    theme: {
      iconBg: 'bg-blue-50 text-[#032e92] border-blue-100',
      badgeBg: 'bg-blue-50/80 text-[#032e92] border-blue-200/60',
      highlightColor: 'text-[#032e92] bg-blue-50/60 border-blue-100',
      accentHover: 'hover:border-blue-300/80 hover:shadow-blue-900/5',
      checkColor: 'text-[#032e92]',
    },
  },
  {
    icon: faCoins,
    badge: 'Dual Benefit',
    title: 'Lump Sum + Regular Pension',
    highlight: '60% Wealth + 40% Annuity',
    description:
      'Withdraw 60% of your corpus at retirement for immediate goals, and utilize 40% in an annuity for guaranteed lifelong monthly income.',
    takeaway: 'Lifelong regular pension stream after retirement',
    theme: {
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      badgeBg: 'bg-amber-50/80 text-amber-700 border-amber-200/60',
      highlightColor: 'text-amber-700 bg-amber-50/60 border-amber-100',
      accentHover: 'hover:border-amber-300/80 hover:shadow-amber-900/5',
      checkColor: 'text-amber-500',
    },
  },
  {
    icon: faChartLine,
    badge: 'Growth Multiplier',
    title: 'Market-Linked Returns',
    highlight: 'Asset Classes E, C, G & A',
    description:
      'Choose your asset allocation across Equity, Corporate Debt, and Government Securities to generate inflation-beating long-term returns.',
    takeaway: 'Flexible Active & Auto Lifecycle choice',
    theme: {
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badgeBg: 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60',
      highlightColor: 'text-indigo-700 bg-indigo-50/60 border-indigo-100',
      accentHover: 'hover:border-indigo-300/80 hover:shadow-indigo-900/5',
      checkColor: 'text-indigo-500',
    },
  },
  {
    icon: faHourglassHalf,
    badge: 'Discipline',
    title: 'Disciplined Compounding',
    highlight: 'Long-Term Wealth Shield',
    description:
      'Structured retirement lock-in prevents impulsive withdrawals, letting compound interest multiply your principal year after year.',
    takeaway: 'Power of compounding uninterrupted over decades',
    theme: {
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      badgeBg: 'bg-purple-50/80 text-purple-700 border-purple-200/60',
      highlightColor: 'text-purple-700 bg-purple-50/60 border-purple-100',
      accentHover: 'hover:border-purple-300/80 hover:shadow-purple-900/5',
      checkColor: 'text-purple-500',
    },
  },
];

export default function WhyConsiderNps() {
  const topRow = benefits.slice(0, 3);
  const bottomRow = benefits.slice(3, 5);

  const renderCard = (item, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.08 }}
      whileHover={{ y: -5 }}
      className={`relative group p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(3,46,146,0.06)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${item.theme.accentHover}`}
    >
      <div>
        {/* Top Bar: Icon + Badge */}
        <div className="flex items-center justify-between mb-5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg sm:text-xl border transition-all duration-300 group-hover:scale-110 shadow-xs ${item.theme.iconBg}`}
          >
            <FontAwesomeIcon icon={item.icon} />
          </div>
          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${item.theme.badgeBg}`}
          >
            {item.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#032e92] transition-colors leading-snug">
          {item.title}
        </h3>

        {/* Highlight Pill */}
        <div className="inline-block mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${item.theme.highlightColor}`}
          >
            {item.highlight}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-[13.5px] text-slate-600 leading-relaxed font-normal mb-5">
          {item.description}
        </p>
      </div>

      {/* Bottom Takeaway Pill */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center gap-2">
        <FontAwesomeIcon icon={faCircleCheck} className={`text-xs shrink-0 ${item.theme.checkColor}`} />
        <span className="text-[11.5px] sm:text-xs font-medium text-slate-700 leading-snug">
          {item.takeaway}
        </span>
      </div>
    </motion.div>
  );

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f8fafc]/80 via-white to-[#f8fafc]/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-sm mb-4 uppercase tracking-wider"
          >
            Why Choose NPS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900"
          >
            Why Invest in <span className="text-[#032e92]">National Pension System</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5"
          >
            Discover how the National Pension System combines tax efficiency, market-linked growth, and structured retirement income into a disciplined long-term wealth plan.
          </motion.p>
        </div>

        {/* Top Row: 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 mb-6 lg:mb-7">
          {topRow.map((item, idx) => renderCard(item, idx))}
        </div>

        {/* Bottom Row: 2 Cards Centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7 max-w-4xl mx-auto">
          {bottomRow.map((item, idx) => renderCard(item, idx + 3))}
        </div>
      </div>
    </section>
  );
}
