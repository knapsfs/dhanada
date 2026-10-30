import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faListCheck,
  faLandmark,
  faCalendarDays,
  faCoins,
  faReceipt,
  faArrowTrendUp,
  faLock,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const features = [
  {
    icon: faLandmark,
    title: 'Sovereign-Guaranteed Safety',
    badge: 'Direct Govt. Backing',
    description:
      'Unlike private or commercial deposits that rely on insurance thresholds, Post Office Small Savings Schemes are directly backed by the Consolidated Fund of India.'
  },
  {
    icon: faCalendarDays,
    title: 'Flexible Tenure Spectrum',
    badge: '1 Year to 9.5 Years',
    description:
      'Choose short-to-medium horizons with 1, 2, 3, or 5-Year Time Deposits (POTD), 5-Year NSC, 5-Year PORD, or 115 months for capital doubling in KVP.'
  },
  {
    icon: faCoins,
    title: 'Lump-Sum & Monthly Flexibility',
    badge: 'Contribution Choice',
    description:
      'Invest either as a one-time lump-sum deposit (POTD, KVP, NSC) or through disciplined monthly installments starting at just ₹100 in Post Office RD.'
  },
  {
    icon: faReceipt,
    title: 'Section 80C Tax Deductions',
    badge: 'Section 80C Relief',
    description:
      'NSC and 5-Year Post Office Time Deposit qualify for up to ₹1.5 Lakh deductions under Section 80C. NSC accrued interest is also deemed reinvested.'
  },
  {
    icon: faArrowTrendUp,
    title: 'Guaranteed Capital Doubling',
    badge: 'KVP Advantage',
    description:
      'Kisan Vikas Patra (KVP) doubles your investment over 115 months with 7.5% p.a. guaranteed rate and exit liquidity permitted after 30 months.'
  },
  {
    icon: faLock,
    title: 'Locked-In Notified Yields',
    badge: 'Rate Protection',
    description:
      'The notified rate prevailing on the date of opening is locked in for your entire tenure, protecting you against future interest rate drops.'
  }
];

export default function SmallSavingsKeyFeatures() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faListCheck} />
            <span>Structural Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Key Features of Post Office Small Savings Schemes
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Examine the institutional building blocks that govern our 4 core Post Office schemes: POTD, KVP, NSC, and PORD.
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
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center text-lg transition-all duration-300 shadow-xs">
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
            type="button"
            onClick={() =>
              openLeadModal({
                title: 'Inquire on Post Office Scheme Features',
                defaultService: 'Post Office Small Savings Schemes'
              })
            }
            className="btn-ripple px-8 py-3.5 rounded-xl text-[14px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Speak with a Post Office Specialist</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
