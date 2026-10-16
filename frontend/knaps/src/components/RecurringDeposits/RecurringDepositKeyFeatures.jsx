import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faListCheck,
  faCoins,
  faChartLine,
  faClock,
  faCalendarCheck,
  faHandHoldingDollar,
  faUserShield,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const features = [
  {
    icon: faCoins,
    title: 'Fixed Monthly Contributions',
    detail: 'Predictable Outflow',
    description:
      'The deposit installment selected at account opening remains constant throughout the tenure, simplifying monthly budgeting without surprise variations.'
  },
  {
    icon: faChartLine,
    title: 'Predetermined Interest Rate',
    detail: 'Contracted Certainty',
    description:
      'Your interest rate is locked on the day the account is opened and remains untouched by subsequent macro-economic rate fluctuations or central bank cuts.'
  },
  {
    icon: faClock,
    title: 'Flexible Tenure Options',
    detail: '6 Months to 10 Years',
    description:
      'Choose short-term tenures (6, 9, 12 months) for immediate annual goals or medium-to-long tenures (3, 5, or 10 years) for larger capital milestones.'
  },
  {
    icon: faCalendarCheck,
    title: 'Defined Maturity Period',
    detail: 'Known Milestone Date',
    description:
      'You know your exact maturity date from Day 1. This enables synchronized cash planning for upcoming financial events without guesswork.'
  },
  {
    icon: faHandHoldingDollar,
    title: 'Loan Against RD (Up to 90%)',
    detail: 'Emergency Liquidity',
    description:
      'Most scheduled banks permit depositors to borrow or overdraft against their accumulated RD balance at just 1% to 2% over the deposit rate, avoiding premature closure.'
  },
  {
    icon: faUserShield,
    title: 'Nomination & Guardian Facility',
    detail: 'Estate Protection',
    description:
      'Seamless nomination registration ensures smooth settlement for loved ones. Natural or legal guardians can also open RD accounts for minor children.'
  }
];

export default function RecurringDepositKeyFeatures() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faListCheck} />
            <span>Specifications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Key Features of Recurring Deposits (RD)
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Examine the structural building blocks that make Recurring Deposits one of India's most trusted savings instruments.
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

        {/* Action strip */}
        <div className="text-center pt-4">
          <button
            onClick={() =>
              openLeadModal({
                title: 'Inquire About RD Features & Bank Options',
                defaultService: 'Recurring Deposits'
              })
            }
            className="btn-ripple px-8 py-3.5 rounded-xl text-[14px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Compare Features Across Issuers</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
