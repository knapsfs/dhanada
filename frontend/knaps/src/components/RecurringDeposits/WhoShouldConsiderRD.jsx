import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsersViewfinder,
  faBriefcase,
  faGraduationCap,
  faPlaneDeparture,
  faPersonWalkingWithCane,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const profiles = [
  {
    icon: faBriefcase,
    title: 'Salaried Professionals & First-Time Earners',
    badge: 'Disciplined Habit',
    description:
      'Individuals starting their career who do not possess a large lump-sum investment amount yet, but want to cultivate a consistent monthly habit of setting aside surplus income before discretionary spending.'
  },
  {
    icon: faGraduationCap,
    title: 'Parents Budgeting Annual Educational Fees',
    badge: 'Expense Smoothing',
    description:
      'Families facing lumpy annual school, college, or coaching tuition installments. By running a 12-month RD, the annual fee is accumulated in 12 smooth installments, earning quarterly interest.'
  },
  {
    icon: faPlaneDeparture,
    title: 'Near-Term Milestone Planners',
    badge: 'Target Alignment',
    description:
      'Savers preparing for an upcoming lifestyle or family milestone within 1 to 3 years—such as a festival shopping budget, an annual international vacation, or a car down payment.'
  },
  {
    icon: faPersonWalkingWithCane,
    title: 'Conservative Savers & Senior Citizens',
    badge: 'Principal Safety',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description:
      'Individuals who prioritize complete capital preservation over aggressive market risk, seeking preferential senior citizen rates (+0.50%) with quarterly compounding and zero NAV volatility.'
  }
];

export default function WhoShouldConsiderRD() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faUsersViewfinder} />
            <span>Profile Suitability</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Who May Consider Recurring Deposits (RD)?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Recurring Deposits provide a structured mechanism for savers who appreciate fixed monthly cash commitments and guaranteed maturity horizons.
          </p>
        </div>

        {/* 4 Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {profiles.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
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
            <strong className="text-slate-800">Suitability Notice:</strong> The profiles above illustrate common financial circumstances and do not constitute personal financial advice. For ultra-long-term financial objectives (such as retirement 15+ years away), relying exclusively on fixed deposits may leave your purchasing power vulnerable to inflation. Speak with an advisor for comprehensive asset allocation.
          </p>
        </div>
      </div>
    </section>
  );
}
