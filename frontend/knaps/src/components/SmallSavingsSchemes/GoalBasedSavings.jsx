import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullseye,
  faArrowTrendUp,
  faReceipt,
  faVault,
  faRotate,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const goals = [
  {
    icon: faArrowTrendUp,
    title: 'Guaranteed Capital Doubling',
    schemes: 'Kisan Vikas Patra (KVP)',
    description:
      'Double your lump-sum deposit over 115 months (9 years & 7 months) at 7.5% p.a. guaranteed interest, with flexible premature encashment liquidity available anytime after 30 months.'
  },
  {
    icon: faReceipt,
    title: 'Section 80C Tax-Saving Growth',
    schemes: 'National Savings Certificate (NSC) & 5-Year POTD',
    description:
      'Claim deductions up to ₹1.5 Lakh under Section 80C. In NSC, 7.7% annual compounding interest is deemed reinvested and also qualifies for fresh 80C deductions for the first 4 years.'
  },
  {
    icon: faVault,
    title: 'Structured Fixed Term Returns',
    schemes: 'Post Office Time Deposit (POTD - 1, 2, 3, 5 Years)',
    description:
      'The government sovereign equivalent of a bank fixed deposit with quarterly compounding and guaranteed annual payouts, offering competitive rates from 6.9% to 7.5% p.a.'
  },
  {
    icon: faRotate,
    title: 'Disciplined Monthly Accumulation',
    schemes: 'Post Office Recurring Deposit (PORD)',
    description:
      'Build a substantial savings corpus starting with as little as ₹100 per month. Enjoy quarterly compounding at 6.7% p.a. over 5 years with 50% loan access after 1 year.'
  }
];

export default function GoalBasedSavings() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faBullseye} />
            <span>Milestone Mapping</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Goal-Based Post Office Savings Alignment
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Align your capital with the right Post Office small savings instrument based on your investment horizon, tax objective, and return requirements.
          </p>
        </div>

        {/* 4 Goal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {goals.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-[#f7f9fc] border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center text-lg transition-all duration-300 shadow-xs mb-5">
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                  {item.schemes}
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
                      title: `Inquire about ${item.schemes}`,
                      defaultService: item.schemes
                    })
                  }
                  className="text-xs font-bold text-[#032e92] hover:text-[#021d63] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Select Scheme</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Objective Guidance Note */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center max-w-3xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            * <strong>Disclaimer:</strong> Goal mappings above illustrate typical financial applications. Post Office schemes are backed by the Government of India with sovereign capital safety.
          </p>
        </div>
      </div>
    </section>
  );
}
