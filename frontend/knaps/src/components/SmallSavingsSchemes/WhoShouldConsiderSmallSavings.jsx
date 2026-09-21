import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsersViewfinder,
  faShieldHalved,
  faChildReaching,
  faPersonWalkingWithCane,
  faBriefcase,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const profiles = [
  {
    icon: faShieldHalved,
    title: 'Conservative Savers Prioritizing Absolute Safety',
    badge: 'Sovereign Guarantee',
    description:
      'Individuals who want 100% peace of mind backed by the Government of India, free from the volatility of equities or credit risks associated with private corporate deposits.'
  },
  {
    icon: faChildReaching,
    title: 'Parents of Daughters Below 10 Years',
    badge: 'Girl Child Welfare',
    description:
      'Families planning systematically for a daughter’s higher education and marriage, capitalizing on Sukanya Samriddhi Account’s market-leading 8.2% yield and complete EEE tax exemption.'
  },
  {
    icon: faPersonWalkingWithCane,
    title: 'Senior Citizens Seeking Predictable Income',
    badge: 'Quarterly Cash Flow',
    description:
      'Retirees aged 60 and above who can deploy up to ₹30 Lakh in SCSS to earn a generous 8.2% per annum, credited directly to their bank accounts every quarter for living expenses.'
  },
  {
    icon: faBriefcase,
    title: 'Salaried Taxpayers Building 15-Year Reserves',
    badge: 'Section 80C & EEE',
    description:
      'Professionals seeking to exhaust their ₹1.5 Lakh Section 80C deduction with PPF, creating an untouchable, compounding corpus that matures completely tax-free after 15 years.'
  }
];

export default function WhoShouldConsiderSmallSavings() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faUsersViewfinder} />
            <span>Profile Alignment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Who May Consider Small Savings Schemes?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Small savings schemes offer structured, non-volatile financial foundations across various lifecycle stages and investment horizons.
          </p>
        </div>

        {/* 4 Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {profiles.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center text-lg transition-all duration-300 shadow-sm">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
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
        <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center max-w-4xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-800">Suitability Guidance:</strong> The profiles above illustrate broad general scenarios and do not constitute personalized financial advice. Because small savings schemes carry strict tenure lock-ins and upper deposit ceilings, balance them with liquid assets and diversified mutual funds to preserve purchasing power against long-term inflation.
          </p>
        </div>
      </div>
    </section>
  );
}
