import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faListCheck,
  faLandmark,
  faCalendarDays,
  faCoins,
  faReceipt,
  faUserGroup,
  faHandHoldingDollar,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const features = [
  {
    icon: faLandmark,
    title: 'Sovereign-Guaranteed Safety',
    badge: 'Direct Govt. Backing',
    description:
      'Unlike private or commercial deposits that rely on insurance thresholds, Small Savings Schemes are directly backed by the Consolidated Fund of India.'
  },
  {
    icon: faCalendarDays,
    title: 'Diverse Tenure Spectrum',
    badge: '1 Year to 21 Years',
    description:
      'Choose short horizons like 1-to-3-year Time Deposits, medium 5-year options (NSC, SCSS, MIS), or multi-decade compounding milestones (PPF 15y, SSY 21y).'
  },
  {
    icon: faCoins,
    title: 'Lump-Sum & Periodic Flexibility',
    badge: 'Contribution Choice',
    description:
      'Invest either as a one-time lump-sum deposit (SCSS, MIS, TD, KVP) or as disciplined monthly/annual installments (PPF, SSY, Post Office RD).'
  },
  {
    icon: faReceipt,
    title: 'Comprehensive Tax Advantages',
    badge: 'Section 80C & EEE',
    description:
      'Multiple schemes qualify for up to ₹1.5 Lakh tax deductions under Section 80C, while flagship schemes like PPF and SSY provide 100% tax-free maturity under EEE.'
  },
  {
    icon: faUserGroup,
    title: 'Targeted Demographics',
    badge: 'Social Protection',
    description:
      'Specialized features and premium rates designed for dedicated societal segments: girl children (SSY), senior citizens (SCSS), and women investors (MSSC).'
  },
  {
    icon: faHandHoldingDollar,
    title: 'Sovereign Cash Flow Reliability',
    badge: 'Direct Credit',
    description:
      'Monthly and quarterly interest distributions are directly credited electronically to your linked savings bank or post office account on predefined dates.'
  }
];

export default function SmallSavingsKeyFeatures() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faListCheck} />
            <span>Structural Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Key Features of Small Savings Schemes
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Examine the institutional building blocks that govern sovereign small savings schemes across tenures, tax avenues, and payout structures.
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center text-lg transition-all duration-300 shadow-sm">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.badge}
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
                title: 'Inquire on Small Savings Features',
                defaultService: 'Small Savings Schemes'
              })
            }
            className="btn-ripple px-8 py-3.5 rounded-xl text-[14px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Speak with a Fixed Income Specialist</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
