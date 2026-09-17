import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faArrowTrendUp,
  faBuildingColumns,
  faLandmark,
  faCity,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const assetClasses = [
  {
    letter: 'E',
    title: 'Asset Class E — Equity',
    badge: 'Up to 75% Allocation',
    badgeColor: 'bg-blue-100 text-[#032e92]',
    riskLevel: 'High Risk • High Growth',
    icon: faArrowTrendUp,
    description:
      'Invests predominantly in high-liquidity large-cap index stocks and diversified equity instruments. Generates long-term wealth compounding to help beat inflation over multi-decade retirement horizons.',
    composition: 'Nifty 50 / Sensex constituent equities and mutual fund index schemes'
  },
  {
    letter: 'C',
    title: 'Asset Class C — Corporate Debt',
    badge: 'Up to 100% Allocation',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    riskLevel: 'Moderate Risk • Stable Yield',
    icon: faBuildingColumns,
    description:
      'Invests in rated corporate bonds, debentures, and debt papers issued by public financial institutions, infrastructure firms, and leading corporations, offering predictable yield spreads over G-Secs.',
    composition: 'CRISIL/ICRA AAA & AA rated corporate bonds and infrastructure debentures'
  },
  {
    letter: 'G',
    title: 'Asset Class G — Government Securities',
    badge: 'Up to 100% Allocation',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    riskLevel: 'Low Risk • Sovereign Safety',
    icon: faLandmark,
    description:
      'Allocates into sovereign debt instruments issued by the Central and State Governments of India. Completely immune to credit default risk, delivering foundational safety for capital preservation.',
    composition: 'Central Government Dated Securities, Treasury Bills, and State Development Loans'
  },
  {
    letter: 'A',
    title: 'Asset Class A — Alternative Assets',
    badge: 'Capped at 5% Allocation',
    badgeColor: 'bg-purple-100 text-purple-800',
    riskLevel: 'High Risk • Uncorrelated',
    icon: faCity,
    description:
      'Permits up to a maximum of 5% investment in specialized alternative financial instruments including Real Estate Investment Trusts (REITs), Infrastructure Investment Trusts (InvITs), and SEBI-registered AIFs.',
    composition: 'SEBI-registered Category I & II AIFs, REITs, InvITs, and commercial mortgage papers'
  }
];

export default function NpsInvestmentChoices() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faChartPie} />
            <span>Asset Universe</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            NPS Investment Choices — The 4 Asset Classes
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            NPS allows subscribers to construct a balanced, multi-asset portfolio across four regulated asset classes, balancing growth with capital safety.
          </p>
        </div>

        {/* 4 Asset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {assetClasses.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#032e92] to-[#021d63] text-white flex items-center justify-center font-black text-xl shadow-sm">
                      {item.letter}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#032e92] transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-xs font-semibold text-slate-500">{item.riskLevel}</span>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 block">Underlying Securities:</span>
                  <span>{item.composition}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Regulatory Governance Note */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center max-w-4xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            * <strong>Asset Allocation Limits:</strong> Under Active Choice, allocation to Asset Class E (Equity) is capped at 75% up to age 50, reducing by 2.5% every year until it stabilizes at 50% at age 60. Asset Class A is strictly capped at 5%. Government Securities (G) and Corporate Bonds (C) can be allocated up to 100%.
          </p>
        </div>
      </div>
    </section>
  );
}
