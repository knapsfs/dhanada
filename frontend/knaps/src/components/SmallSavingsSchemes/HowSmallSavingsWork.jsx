import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRoute,
  faBullseye,
  faCoins,
  faPercent,
  faHandHoldingDollar,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const steps = [
  {
    number: '01',
    icon: faBullseye,
    title: 'Choose Scheme Based on Goal',
    subtitle: 'Milestone Alignment',
    description:
      'Identify your primary financial target: capital doubling (KVP), 5-year tax-saving with compounded growth (NSC), fixed-term guaranteed return (POTD), or disciplined monthly habit (PORD).'
  },
  {
    number: '02',
    icon: faCoins,
    title: 'Deposit per Applicable Rules',
    subtitle: 'Contribution Mode',
    description:
      'Invest through India Post. Deposit lump-sum amounts for POTD, KVP, and NSC, or set up affordable monthly deposits from ₹100/mo for Post Office Recurring Deposit.'
  },
  {
    number: '03',
    icon: faPercent,
    title: 'Earn Government-Notified Interest',
    subtitle: 'Sovereign Compounding',
    description:
      'Your deposit locks in sovereign interest notified by the Ministry of Finance, compounding annually (NSC) or quarterly (POTD, KVP, PORD) over your chosen tenure.'
  },
  {
    number: '04',
    icon: faHandHoldingDollar,
    title: 'Receive Maturity or Periodic Income',
    subtitle: 'Payout Realization',
    description:
      'Receive guaranteed maturity proceeds credited directly to your post office savings account or linked bank account, along with tax benefits under Section 80C where applicable (NSC & 5Y POTD).'
  }
];

export default function HowSmallSavingsWork() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900">
            How Post Office Small Savings Schemes Work — <span className="text-[#032e92]">A 4-Step Journey</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5">
            A simple, transparent pathway from scheme selection and deposit to compounding interest and final maturity realization across POTD, KVP, NSC, and PORD.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative mb-14">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-7 rounded-2xl bg-[#f7f9fc] border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-[#032e92]/20 group-hover:text-[#032e92]/40 transition-colors">
                    {step.number}
                  </span>

                </div>


                <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>


            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
