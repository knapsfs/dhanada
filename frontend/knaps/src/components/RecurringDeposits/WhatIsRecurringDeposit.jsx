import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleInfo,
  faCoins,
  faCalendarDays,
  faBuildingColumns,
  faArrowRight,
  faHandHoldingDollar,
  faChartPie,
  faVault
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const pillars = [
  {
    icon: faCoins,
    title: '1. Fixed Monthly Installment',
    description:
      'You commit to depositing a fixed, manageable sum of money every month (starting as low as ₹500 or ₹1,000) on a pre-selected date via automated debit from your savings account.'
  },
  {
    icon: faCalendarDays,
    title: '2. Predetermined Tenure & Rate',
    description:
      'The interest rate is locked in on Day 1 for the entire duration (from 6 months up to 10 years). Your rate remains completely insulated against subsequent market or RBI rate cuts.'
  },
  {
    icon: faHandHoldingDollar,
    title: '3. Lump-Sum Maturity Payout',
    description:
      'Each monthly deposit compounds individually based on its tenure in the account. Upon maturity, the total deposited principal along with accumulated compound interest is credited to you.'
  }
];

export default function WhatIsRecurringDeposit() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faCircleInfo} />
            <span>Foundational Concept</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            What is a Recurring Deposit (RD)?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A Recurring Deposit is a specialized term deposit offered by banks and postal departments that allows individuals to build substantial savings by depositing a fixed sum each month over a predetermined period, earning interest at guaranteed, locked-in rates.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 sm:mb-12">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#f7f9fc] border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#032e92] to-[#021d63] text-white flex items-center justify-center text-xl mb-6 shadow-md shadow-[#032e92]/20 group-hover:scale-105 transition-transform">
                  <FontAwesomeIcon icon={pillar.icon} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mechanics & Comparison Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-[#032e92] tracking-wider uppercase">
                The Accumulation Mechanism
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                How Your Monthly Money Multiplies
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Unlike a Fixed Deposit (FD) where you must commit a large lump sum all at once, an RD is designed for steady cash flows. For instance, if you establish a 12-month RD:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#032e92] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span><strong>Month 1 Installment:</strong> Remains in the account and earns compound interest for the full 12 months.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#032e92] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span><strong>Month 6 Installment:</strong> Earns compound interest for the remaining 7 months.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#032e92] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span><strong>Month 12 Installment:</strong> Earns interest for 1 month, and the whole consolidated corpus matures simultaneously.</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() =>
                    openLeadModal({
                      title: 'Start a Recurring Deposit Consultation',
                      defaultService: 'Recurring Deposits'
                    })
                  }
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#032e92] hover:text-blue-700 cursor-pointer"
                >
                  <span>Request an RD Setup Consultation</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">Savings Mode</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">Interest Yield</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faCoins} className="text-slate-400 text-lg" />
                    <div>
                      <div className="text-sm font-bold text-slate-800">Idle Savings Account</div>
                      <div className="text-[11px] text-slate-500">Unrestricted daily balance</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-600">2.70% – 3.50%</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/80 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faVault} className="text-[#032e92] text-lg" />
                    <div>
                      <div className="text-sm font-bold text-[#032e92]">Recurring Deposit (RD)</div>
                      <div className="text-[11px] text-blue-700">Contracted monthly term</div>
                    </div>
                  </div>
                  <span className="text-base font-extrabold text-[#032e92]">6.50% – 7.50%*</span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  * Representative indicative rates. Actual yields depend on the bank/postal scheme chosen, tenure, and prevailing RBI repo cycles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
