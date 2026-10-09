import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimeline,
  faChartLine,
  faCoins,
  faArrowTrendUp,
  faCheckCircle,
  faShieldHalved,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const journeyTiers = {
  12: {
    tenureLabel: '1 Year (12 Months)',
    monthly: 5000,
    rate: 6.75,
    deposited: 60000,
    interest: 2225,
    maturity: 62225,
    milestones: [
      { month: 'Month 3', deposited: '₹15,000', interest: '₹170', balance: '₹15,170', note: 'Habit established; 1st quarterly compounding credited.' },
      { month: 'Month 6', deposited: '₹30,000', interest: '₹680', balance: '₹30,680', note: 'Halfway mark reached; compounding acceleration begins.' },
      { month: 'Month 9', deposited: '₹45,000', interest: '₹1,530', balance: '₹46,530', note: '3rd quarter compounding applied on growing cumulative balance.' },
      { month: 'Month 12', deposited: '₹60,000', interest: '₹2,225', balance: '₹62,225', note: 'Full maturity reached; principal + accumulated interest paid out.' }
    ]
  },
  36: {
    tenureLabel: '3 Years (36 Months)',
    monthly: 5000,
    rate: 7.0,
    deposited: 180000,
    interest: 21150,
    maturity: 201150,
    milestones: [
      { month: 'Month 6', deposited: '₹30,000', interest: '₹700', balance: '₹30,700', note: 'First 6 installments disciplined; regular auto-debit routine.' },
      { month: 'Month 12', deposited: '₹60,000', interest: '₹2,310', balance: '₹62,310', note: 'Year 1 completed; quarterly compounding momentum rises.' },
      { month: 'Month 24', deposited: '₹1,20,000', interest: '₹9,380', balance: '₹1,29,380', note: 'Year 2 completed; interest wedge grows significantly.' },
      { month: 'Month 36', deposited: '₹1,80,000', interest: '₹21,150', balance: '₹2,01,150', note: 'Full 3-year tenure achieved with over ₹21,000 in interest gains.' }
    ]
  },
  60: {
    tenureLabel: '5 Years (60 Months)',
    monthly: 5000,
    rate: 7.0,
    deposited: 300000,
    interest: 61850,
    maturity: 361850,
    milestones: [
      { month: 'Month 12', deposited: '₹60,000', interest: '₹2,310', balance: '₹62,310', note: 'Foundational year: principal contributions dominate.' },
      { month: 'Month 24', deposited: '₹1,20,000', interest: '₹9,380', balance: '₹1,29,380', note: 'Cumulative interest exceeds 7% of total balance.' },
      { month: 'Month 48', deposited: '₹2,40,000', interest: '₹38,200', balance: '₹2,78,200', note: 'Compounding accelerates as early installments mature.' },
      { month: 'Month 60', deposited: '₹3,00,000', interest: '₹61,850', balance: '₹3,61,850', note: 'Maturity reaches over ₹3.61 Lakh with over ₹61,800 interest earned.' }
    ]
  }
};

export default function MonthlySavingsJourney() {
  const [selectedTenure, setSelectedTenure] = useState(36);
  const { openLeadModal } = useLeadModal();

  const current = journeyTiers[selectedTenure];

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faTimeline} />
            <span>Compounding Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            The Monthly Savings Journey
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            See how modest ₹5,000 monthly contributions systematically snowball into a sizable lump-sum maturity corpus over time.
          </p>
        </div>

        {/* Tenure Switcher Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            {[12, 36, 60].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTenure(t)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedTenure === t
                    ? 'bg-[#032e92] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {journeyTiers[t].tenureLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Journey Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-10 mb-12">
          {/* Summary Metric Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-8 border-b border-slate-200">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-500 font-semibold mb-1">Total Monthly Deposit</div>
              <div className="text-2xl font-black text-slate-900">
                ₹{current.deposited.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">₹5,000 / month ongoing</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="text-xs text-emerald-700 font-semibold mb-1">Estimated Interest Earned</div>
              <div className="text-2xl font-black text-emerald-700">
                +₹{current.interest.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-600 mt-0.5">Quarterly compounded @ {current.rate}%</div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="text-xs text-[#032e92] font-semibold mb-1">Total Maturity Corpus</div>
              <div className="text-2xl font-black text-[#032e92]">
                ₹{current.maturity.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-blue-600 mt-0.5">100% automated credit</div>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="pt-8">
            <h4 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faArrowTrendUp} className="text-[#032e92]" />
              <span>Milestone Progress Along the Timeline</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {current.milestones.map((ms, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#f7f9fc] border border-slate-200/80 space-y-3 relative hover:border-[#032e92]/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#032e92] bg-blue-100/70 px-2.5 py-1 rounded-lg">
                      {ms.month}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">Stage {idx + 1}</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Deposited:</span>
                      <span className="font-bold text-slate-800">{ms.deposited}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Interest Accrued:</span>
                      <span className="font-bold text-emerald-600">{ms.interest}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-slate-200/60 pt-1 font-extrabold">
                      <span className="text-slate-700">Balance:</span>
                      <span className="text-[#032e92]">{ms.balance}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200/60 pt-2">
                    {ms.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Note */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            * Milestone figures are illustrative representations calculated with quarterly compounding interest. Actual interest calculation reflects exact calendar day counts and prevailing issuer terms.
          </p>
        </div>
      </div>
    </section>
  );
}
