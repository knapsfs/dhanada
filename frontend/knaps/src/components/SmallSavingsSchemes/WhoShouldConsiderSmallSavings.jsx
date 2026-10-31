import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsersViewfinder,
  faShieldHalved,
  faBriefcase,
  faArrowTrendUp,
  faRotate,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const profiles = [
  {
    icon: faShieldHalved,
    title: 'Conservative Savers Seeking Absolute Capital Safety',
    badge: '100% Sovereign Guarantee',
    description:
      'Individuals who want complete peace of mind backed by the Government of India, free from stock market volatility or credit default risks associated with corporate deposits.'
  },
  {
    icon: faBriefcase,
    title: 'Salaried Taxpayers Seeking Section 80C Deductions',
    badge: 'Section 80C Tax Relief',
    description:
      'Professionals seeking to exhaust their ₹1.5 Lakh Section 80C limit with National Savings Certificate (NSC) or 5-Year Time Deposit (POTD), enjoying guaranteed annual compounding.'
  },
  {
    icon: faArrowTrendUp,
    title: 'Patient Savers Targeting Guaranteed Capital Doubling',
    badge: 'Kisan Vikas Patra (KVP)',
    description:
      'Investors looking for a set-and-forget sovereign certificate that doubles their lump-sum capital over 115 months with clear surrender liquidity after 30 months.'
  },
  {
    icon: faRotate,
    title: 'Monthly Savers Cultivating Saving Discipline',
    badge: 'Post Office RD (From ₹100/mo)',
    description:
      'Everyday earners, students, and families looking to build a structured nest egg through small, automated monthly contributions starting at just ₹100 per month.'
  }
];

export default function WhoShouldConsiderSmallSavings() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faUsersViewfinder} />
            <span>Target Profiles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Who Should Consider Post Office Schemes?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Post Office Small Savings Schemes are ideal for anyone prioritizing sovereign safety, guaranteed compounding yields, and tax deductions.
          </p>
        </div>

        {/* 4 Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {profiles.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-[#f7f9fc] border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center text-lg transition-all duration-300 shadow-xs mb-5">
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                  {item.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-[#032e92] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() =>
                    openLeadModal({
                      title: `Inquire about ${item.badge}`,
                      defaultService: 'Post Office Small Savings Schemes'
                    })
                  }
                  className="text-xs font-bold text-[#032e92] hover:text-[#021d63] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Check Eligibility</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
