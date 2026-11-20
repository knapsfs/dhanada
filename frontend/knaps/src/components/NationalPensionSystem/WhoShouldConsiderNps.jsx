import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsersViewfinder,
  faBriefcase,
  faUserTie,
  faBuilding,
  faShieldHalved,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const profiles = [
  {
    icon: faBriefcase,
    title: 'Salaried Employees Maximizing Tax Deductions',
    badge: 'Tax Optimization',
    description:
      'Individuals who have already exhausted their ₹1.5 Lakh Section 80C limit and want to save an additional ₹15,600+ in taxes annually using Section 80CCD(1B), or leverage Corporate NPS via Section 80CCD(2).'
  },
  {
    icon: faUserTie,
    title: 'Young Professionals Starting Early',
    badge: '30+ Year Horizon',
    description:
      'Early-career investors aged 22–35 who want to harness the exponential power of equity compounding (up to 75% equity) with near-zero fund management costs (~0.09%) over a multi-decade horizon.'
  },
  {
    icon: faBuilding,
    title: 'Self-Employed & Business Owners',
    badge: 'Pillar of Security',
    description:
      'Entrepreneurs and professionals who do not have mandatory employer EPF accounts. NPS provides a formal, low-cost, disciplined institutional pension accumulation vehicle with full PRAN portability.'
  },
  {
    icon: faShieldHalved,
    title: 'Conservative Savers Approaching Retirement',
    badge: 'De-Risking & Annuity',
    description:
      'Individuals aged 45–55 who want to lock in a guaranteed pension pathway, utilizing Asset Classes C (Corporate Bonds) and G (Government Securities) to de-risk their capital and secure guaranteed monthly cash flow.'
  }
];

export default function WhoShouldConsiderNps() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faUsersViewfinder} />
            <span>Subscriber Suitability</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Who May Consider the National Pension System?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            NPS offers compelling benefits for individuals seeking a structured, low-cost retirement savings vehicle with institutional oversight.
          </p>
        </div>

        {/* 4 Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {profiles.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#f7f9fc] border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center text-lg transition-all duration-300 shadow-sm">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-[#032e92] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Suitability Disclaimer */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center max-w-4xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-800">Suitability Note:</strong> The profiles above illustrate common financial circumstances and do not constitute personalized investment advice. Asset allocation, risk appetite, and liquidity needs should be evaluated with an AMFI/PFRDA registered distributor before account opening.
          </p>
        </div>
      </div>
    </section>
  );
}
