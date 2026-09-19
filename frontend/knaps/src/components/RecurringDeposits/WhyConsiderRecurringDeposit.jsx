import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faCalendarCheck,
  faLock,
  faBullseye,
  faWallet,
  faHandHoldingDollar,
  faShieldHalved,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const reasons = [
  {
    icon: faCalendarCheck,
    title: 'Disciplined Monthly Saving',
    description:
      'Automated monthly standing instructions turn saving into a consistent routine before discretionary spending takes over. It instills systematic financial discipline without feeling burdensome.'
  },
  {
    icon: faLock,
    title: 'Predictable Interest Structure',
    description:
      'The interest rate agreed upon at account inception remains completely fixed throughout your chosen tenure, ensuring total immunity against prevailing market fluctuations or central bank rate cuts.'
  },
  {
    icon: faBullseye,
    title: 'Precision Goal-Based Savings',
    description:
      'Ideal for predetermined short-to-medium-term expenditures such as annual school tuition fees, festival expenses, vacation packages, luxury gadget purchases, or vehicle down payments.'
  },
  {
    icon: faWallet,
    title: 'Accessible Entry Thresholds',
    description:
      'Unlike high-ticket investment products, you do not need large lump sums. Most commercial and public banks allow opening an RD with as little as ₹500 to ₹1,000 per month.'
  },
  {
    icon: faHandHoldingDollar,
    title: 'Quarterly Compounded Growth',
    description:
      'Interest on bank recurring deposits is typically compounded every quarter in accordance with Indian banking norms, accelerating your accumulated corpus compared to simple interest instruments.'
  },
  {
    icon: faShieldHalved,
    title: 'Capital Security & Loan Facility',
    description:
      'Bank RDs are insured up to ₹5 Lakh under DICGC regulations. Additionally, depositors can avail of an overdraft or personal loan against their RD balance up to 85%–90% in urgent emergencies.'
  }
];

export default function WhyConsiderRecurringDeposit() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faStar} />
            <span>Core Advantages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Why Consider Recurring Deposits (RD)?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Discover why millions of Indian savers leverage Recurring Deposits as their preferred monthly vehicle for risk-insulated capital accumulation.
          </p>
        </div>

        {/* 6 Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center text-lg mb-6 transition-colors shadow-sm">
                  <FontAwesomeIcon icon={reason.icon} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-[#032e92] transition-colors">
                  {reason.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-slate-900">
              Ready to automate your monthly savings discipline?
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              Compare institutional bank rates and select the most rewarding tenure for your financial targets.
            </p>
          </div>
          <button
            onClick={() =>
              openLeadModal({
                title: 'Explore Recurring Deposit Options',
                defaultService: 'Recurring Deposits'
              })
            }
            className="btn-ripple px-6 py-3 rounded-xl text-[14px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Explore RD Rates</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
