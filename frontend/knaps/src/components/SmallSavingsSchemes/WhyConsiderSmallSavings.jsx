import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faShieldHalved,
  faCalendarCheck,
  faHandHoldingDollar,
  faReceipt,
  faBullseye,
  faBuildingColumns,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const advantages = [
  {
    icon: faShieldHalved,
    title: 'Absolute Sovereign Security',
    description:
      'Unlike bank fixed deposits that rely on DICGC insurance up to ₹5 Lakh, small savings schemes are direct liabilities of the Government of India, offering unmatched capital protection.'
  },
  {
    icon: faCalendarCheck,
    title: 'Competitive Notified Yields',
    description:
      'The Ministry of Finance reviews and notifies rates quarterly. Yields on schemes like SCSS and SSY (8.2%) frequently outpace comparable scheduled commercial bank deposit rates.'
  },
  {
    icon: faReceipt,
    title: 'Exemplary Tax Advantages (EEE)',
    description:
      'Schemes like PPF and Sukanya Samriddhi Yojana (SSY) enjoy the rare Exempt-Exempt-Exempt (EEE) status—providing tax deductions at deposit, zero tax on interest, and tax-free maturity.'
  },
  {
    icon: faHandHoldingDollar,
    title: 'Tailored Income Payout Modes',
    description:
      'Whether you need monthly cash flow (POMIS), quarterly post-retirement pension (SCSS), annual compounding (NSC), or capital doubling (KVP), there is a pre-designed structure for your cash flow needs.'
  },
  {
    icon: faBullseye,
    title: 'Lifecycle Goal Alignment',
    description:
      'Each product is customized to a distinct social or financial milestone: girl child education (SSY), retirement accumulation (PPF), women capital building (MSSC), or rural capital protection (KVP).'
  },
  {
    icon: faBuildingColumns,
    title: 'Immunity to Market Fluctuations',
    description:
      'Completely detached from equity or secondary debt market fluctuations. You are never exposed to negative NAV returns, mark-to-market bond drawdowns, or stock market volatility.'
  }
];

export default function WhyConsiderSmallSavings() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faStar} />
            <span>Strategic Value</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Why Consider Small Savings Schemes?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Discover why millions of Indian households anchor their foundational wealth in government-notified small savings schemes.
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

        {/* Bottom CTA Banner */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-slate-900">
              Need assistance mapping the right small savings scheme to your tax bracket?
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              Our fixed-income advisors analyze your income stream and help you optimize between EEE options and regular payout avenues.
            </p>
          </div>
          <button
            onClick={() =>
              openLeadModal({
                title: 'Small Savings Schemes Guidance',
                defaultService: 'Small Savings Schemes'
              })
            }
            className="btn-ripple px-6 py-3 rounded-xl text-[14px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Talk to a Small Savings Advisor</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
