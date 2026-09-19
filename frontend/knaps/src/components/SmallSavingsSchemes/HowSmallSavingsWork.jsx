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
      'Identify your primary financial target: retirement planning (PPF), your daughter’s future (SSY), post-retirement income (SCSS), monthly household cash flow (POMIS), or capital doubling (KVP).'
  },
  {
    number: '02',
    icon: faCoins,
    title: 'Deposit per Applicable Rules',
    subtitle: 'Contribution Mode',
    description:
      'Invest through India Post or designated commercial banks. Deposit lump-sum amounts or automated monthly/annual installments adhering to scheme-specific deposit ceilings (e.g. ₹1.5L for PPF/SSY).'
  },
  {
    number: '03',
    icon: faPercent,
    title: 'Earn Government-Notified Interest',
    subtitle: 'Sovereign Compounding',
    description:
      'Your funds accumulate interest at the rates officially notified quarterly by the Ministry of Finance, compounding annually or quarterly depending on the scheme rules.'
  },
  {
    number: '04',
    icon: faHandHoldingDollar,
    title: 'Receive Maturity or Periodic Income',
    subtitle: 'Payout Realization',
    description:
      'Enjoy seamless maturity payouts credited directly to your bank account, or receive automated monthly/quarterly income distributions, enjoying applicable tax exemptions (such as EEE).'
  }
];

export default function HowSmallSavingsWork() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faRoute} />
            <span>Operational Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            How Small Savings Schemes Work — A 4-Step Journey
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A simple, transparent pathway from scheme selection and deposit to compounding interest and final maturity realization.
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

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>Phase {idx + 1} of 4</span>
                <span className="w-2 h-2 rounded-full bg-[#032e92]/30 group-hover:bg-[#032e92] transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Informative Callout */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Need assistance opening a small savings scheme online or through your bank?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Our specialists assist you with documentation, net banking activation, standing instructions, and nomination registration.
            </p>
          </div>
          <button
            onClick={() =>
              openLeadModal({
                title: 'Small Savings Account Assistance',
                defaultService: 'Small Savings Schemes'
              })
            }
            className="btn-ripple px-6 py-3 rounded-xl text-[14px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Get Scheme Setup Assistance</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
