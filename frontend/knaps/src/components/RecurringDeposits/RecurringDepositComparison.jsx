import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableList,
  faCheckCircle,
  faXmarkCircle,
  faMinusCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const comparisonRows = [
  {
    feature: 'Contribution Frequency',
    rd: 'Monthly fixed installments',
    fd: 'One-time lump sum deposit',
    savings: 'Anytime ad-hoc deposit'
  },
  {
    feature: 'Minimum Commitment',
    rd: 'Low (Starts ₹500/month)',
    fd: 'Medium (Typically ₹1,000 to ₹10,000 lump sum)',
    savings: 'Minimal / Zero balance requirements'
  },
  {
    feature: 'Return Predictability',
    rd: '100% Fixed & Contracted on Day 1',
    fd: '100% Fixed & Contracted on Day 1',
    savings: 'Floating & Variable (Subject to bank revision)'
  },
  {
    feature: 'Interest Compounding',
    rd: 'Quarterly compounding on monthly stream',
    fd: 'Quarterly compounding on entire lump sum',
    savings: 'Calculated daily, credited quarterly'
  },
  {
    feature: 'Tenure Horizon',
    rd: '6 Months to 10 Years',
    fd: '7 Days to 10 Years',
    savings: 'Indefinite / Perpetual'
  },
  {
    feature: 'Liquidity & Withdrawals',
    rd: 'Premature closure allowed (with 0.5%–1% penalty)',
    fd: 'Premature closure allowed (with 0.5%–1% penalty)',
    savings: 'Immediate 24/7 ATM/UPI liquidity'
  },
  {
    feature: 'Loan / Overdraft Facility',
    rd: 'Up to 85%–90% of deposit balance',
    fd: 'Up to 90%–95% of deposit value',
    savings: 'Personal overdraft upon bank approval'
  },
  {
    feature: 'DICGC Insurance Cover',
    rd: 'Yes (Up to ₹5 Lakh per depositor per bank)',
    fd: 'Yes (Up to ₹5 Lakh per depositor per bank)',
    savings: 'Yes (Combined under same ₹5 Lakh limit)'
  },
  {
    feature: 'Ideal For',
    rd: 'Salaried earners building regular disciplined savings',
    fd: 'Investors with idle surplus capital looking for safety',
    savings: 'Everyday transaction management & operating expenses'
  }
];

export default function RecurringDepositComparison() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faTableList} />
            <span>Comparative Assessment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            RD vs Fixed Deposit vs Savings Account
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Compare contribution structures, interest predictability, and liquidity profiles across standard bank deposit vehicles.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4">
                    Feature / Attribute
                  </th>
                  <th className="py-5 px-6 text-xs font-extrabold text-[#032e92] uppercase tracking-wider bg-blue-50/60 border-x border-blue-100 w-1/4">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#032e92]" />
                      Recurring Deposit (RD)
                    </span>
                  </th>
                  <th className="py-5 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider w-1/4">
                    Fixed Deposit (FD)
                  </th>
                  <th className="py-5 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider w-1/4">
                    Savings Bank Account
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-slate-900">{row.feature}</td>
                    <td className="py-4 px-6 font-semibold text-[#032e92] bg-blue-50/30 border-x border-blue-100/60">
                      {row.rd}
                    </td>
                    <td className="py-4 px-6 text-slate-700">{row.fd}</td>
                    <td className="py-4 px-6 text-slate-600">{row.savings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom takeaway note */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-600">
            <strong className="text-slate-900">Strategic Alignment:</strong> An RD is unmatched when you have regular monthly income and want to build towards a target without risking principal capital.
          </p>
          <button
            onClick={() =>
              openLeadModal({
                title: 'Compare Bank Deposit Options',
                defaultService: 'Recurring Deposits'
              })
            }
            className="btn-ripple px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <span>Speak with Advisor</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
          </button>
        </div>
      </div>
    </section>
  );
}
