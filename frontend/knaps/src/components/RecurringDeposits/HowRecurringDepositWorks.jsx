import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRoute,
  faSliders,
  faHourglassHalf,
  faCreditCard,
  faCoins,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const steps = [
  {
    number: '01',
    icon: faSliders,
    title: 'Choose Your Monthly Deposit',
    subtitle: 'Budget Alignment',
    description:
      'Decide on an amount you can comfortably allocate every month from your monthly income without straining day-to-day liquidity (e.g., ₹1,000, ₹5,000, ₹10,000, or more).'
  },
  {
    number: '02',
    icon: faHourglassHalf,
    title: 'Select the Tenure',
    subtitle: 'Lock in Your Rate',
    description:
      'Pick a predefined duration that matches your savings goal horizon—from short tenures of 6 or 12 months up to long-term plans of 5 or 10 years. Your interest rate is locked on this day.'
  },
  {
    number: '03',
    icon: faCreditCard,
    title: 'Make Regular Monthly Deposits',
    subtitle: 'Automated Standing Order',
    description:
      'Set up an automated monthly standing instruction (SI) or auto-debit from your savings account. The contracted installment is effortlessly deducted on your chosen date each month.'
  },
  {
    number: '04',
    icon: faCoins,
    title: 'Receive Principal + Interest at Maturity',
    subtitle: 'Lump-Sum Credit',
    description:
      'Upon reaching the maturity date, your total accumulated principal contributions plus all accrued quarterly compound interest are automatically credited to your linked bank account.'
  }
];

export default function HowRecurringDepositWorks() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faRoute} />
            <span>Process Flow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            How Recurring Deposits Work — A 4-Step Journey
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            From your very first monthly installment to the final maturity payout, see how an RD creates a frictionless path to capital accumulation.
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
                {/* Step Indicator Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-[#032e92]/20 group-hover:text-[#032e92]/40 transition-colors">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#032e92] flex items-center justify-center text-lg shadow-sm group-hover:bg-[#032e92] group-hover:text-white transition-all duration-300">
                    <FontAwesomeIcon icon={step.icon} />
                  </div>
                </div>

                <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                  {step.subtitle}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>

              {/* Progress Line Accent */}
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>Step {idx + 1} of 4</span>
                <span className="w-2 h-2 rounded-full bg-[#032e92]/30 group-hover:bg-[#032e92] transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Informative Callout */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Need assistance in mapping an RD to your specific annual expenses?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Our financial planners help you match monthly installment amounts with your tax and liquidity calendar.
            </p>
          </div>
          <button
            onClick={() =>
              openLeadModal({
                title: 'Plan Your Recurring Deposit Journey',
                defaultService: 'Recurring Deposits'
              })
            }
            className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Plan My RD Journey</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
