import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faPiggyBank,
  faChartLine,
  faCoins,
  faReceipt,
  faSliders,
  faHandHoldingHeart,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const advantages = [
  {
    icon: faPiggyBank,
    title: 'Enforced Retirement Discipline',
    description:
      'A structured lock-in until age 60 shields your retirement corpus from impulsive withdrawals, lifestyle inflation, or premature liquidation during intermediate financial temptations.'
  },
  {
    icon: faChartLine,
    title: 'Market-Linked Growth Engine',
    description:
      'Unlike pure fixed-rate debt instruments, NPS permits up to 75% allocation to equities (Asset Class E), allowing your capital to capture long-term corporate earnings growth and outpace inflation.'
  },
  {
    icon: faReceipt,
    title: 'Exclusive Triple Tax Deductions',
    description:
      'Enjoy deductions under Section 80CCD(1) (up to ₹1.5L within 80C), exclusive extra ₹50,000 under Section 80CCD(1B), and employer contribution deductions under Section 80CCD(2).'
  },
  {
    icon: faCoins,
    title: 'World’s Lowest Expense Ratio',
    description:
      'Pension Fund Managers charge approximately 0.09% p.a. in fund management costs—dramatically lower than traditional mutual funds (1.5%–2.0%), compounding substantial extra wealth over 30 years.'
  },
  {
    icon: faSliders,
    title: 'Tailored Asset Allocation Control',
    description:
      'Decide your own asset mix across Equity, Corporate Debt, and G-Secs via Active Choice, or rely on Auto Choice lifecycle algorithms that automatically de-risk your portfolio as you age.'
  },
  {
    icon: faHandHoldingHeart,
    title: 'Guaranteed Post-Retirement Cash Flow',
    description:
      'Mandatory allocation of at least 40% of the terminal corpus to an annuity ensures a predictable, regular monthly pension stream for you and your spouse for life.'
  }
];

export default function WhyConsiderNps() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faStar} />
            <span>Strategic Advantages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Why Consider the National Pension System (NPS)?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Discover the six core institutional advantages that make NPS an indispensable cornerstone for modern retirement and tax planning.
          </p>
        </div>

        {/* 6 Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {advantages.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center text-lg mb-6 transition-colors shadow-sm">
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-[#032e92] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action Strip */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-slate-900">
              Ready to construct a resilient, tax-optimized retirement plan?
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              Our PFRDA-certified retirement planners will guide you through PFM selection, asset allocation, and PRAN activation.
            </p>
          </div>
          <button
            onClick={() =>
              openLeadModal({
                title: 'Request NPS Portfolio Advisory',
                defaultService: 'National Pension System (NPS)'
              })
            }
            className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Talk to an NPS Advisor</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
