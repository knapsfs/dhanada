import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faShieldHalved,
  faCalendarCheck,
  faReceipt,
  faArrowTrendUp,
  faRotate
} from '@fortawesome/free-solid-svg-icons';
const advantages = [
  {
    icon: faShieldHalved,
    title: 'Absolute Sovereign Security',
    description:
      'Unlike private deposits that rely on insurance limits, Post Office Small Savings Schemes are direct liabilities of the Government of India, offering 100% capital protection.'
  },
  {
    icon: faCalendarCheck,
    title: 'Locked-In Notified Yields',
    description:
      'In schemes like NSC (7.7%), KVP (7.5%), and POTD (up to 7.5%), your interest rate locks in on your deposit date and remains guaranteed for your entire tenure regardless of future rate cuts.'
  },
  {
    icon: faReceipt,
    title: 'Section 80C Tax Savings',
    description:
      'National Savings Certificate (NSC) and 5-Year Post Office Time Deposit (POTD) qualify for up to ₹1.5 Lakh deductions under Section 80C. In NSC, annually accrued interest also qualifies for 80C re-investment.'
  },
  {
    icon: faArrowTrendUp,
    title: 'Guaranteed Capital Doubling',
    description:
      'Kisan Vikas Patra (KVP) guarantees your initial lump-sum deposit will double over the notified tenure (115 months at 7.5% p.a.), with safe exit liquidity available after 30 months.'
  },
  {
    icon: faRotate,
    title: 'Low Entry Monthly Savings',
    description:
      'Post Office Recurring Deposit (PORD) lets you cultivate disciplined savings starting with just ₹100 per month, with quarterly compounding and loan facilities up to 50% after 1 year.'
  }
];

export default function WhyConsiderSmallSavings() {

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Why Consider <span className="text-[#032e92]">Post Office Small Savings Schemes?</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5">
            Discover why millions of Indian savers trust Post Office savings certificates and term deposits for safe compounding, capital doubling, and tax efficiency.
          </p>
        </div>

        {/* 5 Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {advantages.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center text-lg transition-all duration-300 shadow-sm mb-6">
                  <FontAwesomeIcon icon={item.icon} />
                </div> */}
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-[#032e92] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
