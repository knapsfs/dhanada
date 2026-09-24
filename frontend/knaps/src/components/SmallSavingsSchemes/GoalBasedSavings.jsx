import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullseye,
  faPiggyBank,
  faGraduationCap,
  faHandHoldingDollar,
  faReceipt,
  faArrowTrendUp,
  faPersonBreastfeeding,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const goals = [
  {
    icon: faPiggyBank,
    title: 'Retirement Planning',
    schemes: 'PPF (15 Years) & SCSS (Age 60+)',
    description:
      'Build a multi-decade, tax-free nest egg with PPF’s 15-year statutory compounding, transitioning into Senior Citizens’ Savings Scheme (SCSS) upon reaching age 60 for reliable quarterly pension payouts.'
  },
  {
    icon: faGraduationCap,
    title: "Children's Future & Education",
    schemes: 'Sukanya Samriddhi Yojana (SSY) & PPF Minor',
    description:
      'Lock in the highest sovereign yield (8.2%) with EEE tax exemption for a girl child via SSY, or open a minor PPF account to systematically accumulate funds for higher education milestones.'
  },
  {
    icon: faHandHoldingDollar,
    title: 'Regular Income Generation',
    schemes: 'Post Office MIS (Monthly) & SCSS (Quarterly)',
    description:
      'Ideal for retirees or individuals seeking steady supplemental cash flows. POMIS provides guaranteed monthly income, while SCSS delivers generous quarterly interest for seniors.'
  },
  {
    icon: faReceipt,
    title: 'Section 80C Tax-Saving',
    schemes: 'PPF, SSY, NSC, SCSS & 5-Year Time Deposit',
    description:
      'Maximize deductions up to ₹1.5 Lakh under Section 80C while preserving capital with sovereign security, choosing between EEE cumulative compounding or regular interest payouts.'
  },
  {
    icon: faArrowTrendUp,
    title: 'Capital Doubling & Medium Growth',
    schemes: 'Kisan Vikas Patra (KVP) & NSC',
    description:
      'Double your lump-sum capital over 115 months via KVP with exit liquidity after 30 months, or utilize NSC for annual compounding and deemed reinvestment tax benefits.'
  },
  {
    icon: faPersonBreastfeeding,
    title: 'Women & Girls Capital Building',
    schemes: 'Mahila Samman Savings Certificate (MSSC)',
    description:
      'A dedicated 2-year government savings certificate for women and minor girls offering an attractive 7.5% quarterly compounding rate on deposits up to ₹2 Lakh with partial liquidity.'
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
            Goal-Based Small Savings Alignment
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            See how different sovereign schemes align with your family's key financial milestones, from education to lifelong retirement security.
          </p>
        </div>

        {/* 6 Goal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {goals.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#f7f9fc] border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center text-lg transition-all duration-300 shadow-sm mb-6">
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                  {item.schemes}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-[#032e92] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Objective Guidance Note */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center max-w-4xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            * <strong>Disclaimer:</strong> Goal mappings above illustrate typical financial applications and do not constitute personalized investment advice. Individual asset allocation depends on age, horizon, risk tolerance, and existing EPF/NPS/mutual fund portfolios.
          </p>
        </div>
      </div>
    </section>
  );
}
