import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faListCheck,
  faPiggyBank,
  faChartPie,
  faUserTie,
  faLayerGroup,
  faCoins,
  faReceipt,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const features = [
  {
    icon: faPiggyBank,
    title: 'Retirement-Centric Architecture',
    detail: 'Targeted Discipline',
    description:
      'Engineered specifically to generate a long-term retirement corpus, with strict statutory guardrails preventing premature corpus depletion.'
  },
  {
    icon: faChartPie,
    title: 'Dynamic Asset Allocation',
    detail: 'E, C, G & A Classes',
    description:
      'Freedom to balance your capital between high-growth Equities (E), stable Corporate Bonds (C), risk-free G-Secs (G), and Alternative Assets (A).'
  },
  {
    icon: faUserTie,
    title: 'Institutional Fund Managers',
    detail: 'PFRDA Licensed',
    description:
      'Monitored by India’s most reputable financial institutions, including SBI, LIC, HDFC, ICICI Prudential, and UTI, ensuring rigorous fiduciary standards.'
  },
  {
    icon: faLayerGroup,
    title: 'Dual Account Framework',
    detail: 'Tier I & Tier II',
    description:
      'A mandatory locked retirement account (Tier I) combined with an optional, completely liquid, zero-lock-in savings account (Tier II).'
  },
  {
    icon: faCoins,
    title: 'Systematic D-Remit Investing',
    detail: 'Same-Day NAV',
    description:
      'Automate regular monthly or periodic contributions via D-Remit virtual accounts, ensuring same-day NAV realization and rupee-cost averaging.'
  },
  {
    icon: faReceipt,
    title: 'Comprehensive Tax Advantages',
    detail: 'Triple Deductions',
    description:
      'Claim deductions under Section 80CCD(1), exclusive ₹50,000 under Section 80CCD(1B), and tax-exempt employer contributions under Section 80CCD(2).'
  }
];

export default function NpsKeyFeatures() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faListCheck} />
            <span>Core Attributes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Key Features of the National Pension System
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A comprehensive overview of the design pillars that set NPS apart from traditional retirement and pension schemes in India.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center text-lg transition-all duration-300 shadow-sm">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.detail}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#032e92] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() =>
              openLeadModal({
                title: 'Inquire About NPS Tier I & Tier II Setup',
                defaultService: 'National Pension System (NPS)'
              })
            }
            className="btn-ripple px-8 py-3.5 rounded-xl text-[14px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Compare NPS Features with EPF & PPF</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
