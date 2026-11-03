import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableList,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { SMALL_SAVINGS_SCHEMES } from '../../data/smallSavingsData';
import { useLeadModal } from '../../context/LeadModalContext';

export default function CompareSmallSavingsSchemes() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Compare <span className="text-[#032e92]">Post Office Small Savings Schemes</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5">
            Review side-by-side tenures, interest rates, contribution minimums, and tax exemptions across POTD, KVP, NSC, and PORD.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-[#f7f9fc] rounded-3xl border border-slate-200/80 shadow-md overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200">
                  <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Scheme
                  </th>
                  <th className="py-4 px-5 text-xs font-extrabold text-[#032e92] uppercase tracking-wider">
                    Interest Rate
                  </th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tenure
                  </th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Min / Max Deposit
                  </th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Payout Type
                  </th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tax Relief
                  </th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Target Eligibility
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 text-xs sm:text-sm bg-white">
                {SMALL_SAVINGS_SCHEMES.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-5">
                      <strong className="text-slate-900 block">{item.name}</strong>
                      <span className="text-[11px] text-slate-400">{item.shortName}</span>
                    </td>
                    <td className="py-4 px-5 font-black text-[#032e92]">
                      {item.interestRate}% p.a.
                    </td>
                    <td className="py-4 px-5 text-slate-700">{item.tenure}</td>
                    <td className="py-4 px-5 text-slate-700">
                      ₹{item.minDeposit.toLocaleString('en-IN')} /{' '}
                      {item.maxDeposit > 0
                        ? `₹${item.maxDeposit.toLocaleString('en-IN')}`
                        : 'No Limit'}
                    </td>
                    <td className="py-4 px-5 text-slate-700">{item.payoutType}</td>
                    <td className="py-4 px-5 font-semibold text-emerald-700">{item.taxStatus}</td>
                    <td className="py-4 px-5 text-slate-600 max-w-xs">{item.eligibility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statutory Note */}
        <div className="p-6 rounded-2xl bg-[#f7f9fc] border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            * Rates and operational conditions reflect prevailing notifications from the Ministry of Finance, Government of India. Updated quarterly based on G-Sec market movements.
          </p>
        </div>
      </div>
    </section>
  );
}
