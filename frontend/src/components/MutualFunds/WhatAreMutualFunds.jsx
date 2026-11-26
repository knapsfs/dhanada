import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function WhatAreMutualFunds() {
  const comparisonRows = [
    {
      feature: 'Scheme Selection',
      direct: 'Self-selected',
      regular: 'Personalised guidance based on goals, risk profile and investment horizon'
    },
    {
      feature: 'Ongoing Support',
      direct: 'Self-managed',
      regular: 'Regular portfolio reviews and rebalancing based on market conditions and investor goals'
    },
    {
      feature: 'Investment Discipline',
      direct: 'More prone to emotional decisions',
      regular: 'Support to stay focused on the long-term plan and avoid emotional decisions during market volatility'
    },
    {
      feature: 'End-to-End Service',
      direct: 'Self-serviced',
      regular: 'Support with investments, transactions, documentation, KYC and other requirements'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Comparison: Direct Plan Vs. Regular Plan */}
        <div className="mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900">
              Direct Plan Vs. <span class="text-[#032e92]">Regular Plan</span>
            </h3>
          </div>

          {/* Comparison Table (Desktop, Tablet & Mobile) */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-xs font-bold text-slate-500 uppercase w-[22%] sm:w-[20%] border-r border-slate-200">
                    Features
                  </th>
                  <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold text-slate-700 w-[38%] sm:w-[40%] border-r border-slate-200">
                    Direct Plan
                  </th>
                  <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold text-[#032e92] bg-gradient-to-r from-blue-50/90 to-blue-100/70 w-[40%] sm:w-[40%] border-l-2 border-blue-400">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm sm:text-base text-[#032e92]">Regular Plan</span>
                      {/* <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#032e92] text-white shadow-xs whitespace-nowrap">
                        Recommended
                      </span> */}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className={`transition-colors hover:bg-slate-50/50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}
                  >
                    <td className="py-3.5 sm:py-4 px-4 sm:px-6 font-semibold text-slate-800 align-top border-r border-slate-200">
                      {row.feature}
                    </td>
                    <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-gray-600 align-top leading-relaxed border-r border-slate-200">
                      {row.direct}
                    </td>
                    <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-slate-900 font-medium bg-blue-50/70 hover:bg-blue-100/60 border-l-2 border-blue-400 align-top leading-relaxed transition-colors">
                      <div className="flex items-start gap-2.5">
                        {/* <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FontAwesomeIcon icon={faCheck} className="text-[9px] sm:text-xs" />
                        </span> */}
                        <span className="leading-relaxed">{row.regular}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
