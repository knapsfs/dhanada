import React from 'react';
import { formatIndianCurrency } from './calculatorUtils';

export default function AdvancedTVM({ calcMode, advancedMode, setAdvancedMode, initialInvestment, recurringInvestment, targetFutureValue, results, paymentTiming }) {
  if (!advancedMode) {
    return (
      <div className="flex justify-center mt-8">
        <button 
          onClick={() => setAdvancedMode(true)}
          className="text-sm font-bold text-[#032e92] hover:underline"
        >
          Show Advanced TVM Variables
        </button>
      </div>
    );
  }

  const pmtValue = calcMode === 'pmt' ? results.requiredPmt : recurringInvestment;
  const fvValue = calcMode === 'pmt' ? targetFutureValue : results.futureValue;

  return (
    <div className="mt-8 border-t border-[#e8edf7] pt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800 text-lg">Advanced TVM</h3>
        <button 
          onClick={() => setAdvancedMode(false)}
          className="text-xs font-semibold text-gray-500 hover:text-gray-700"
        >
          Hide
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8edf7] shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <tbody className="divide-y divide-[#e8edf7]">
            <tr className="hover:bg-gray-50 transition-colors">
              <th className="px-6 py-4 font-semibold text-gray-600 bg-gray-50/50 w-1/2">Present Value (PV)</th>
              <td className="px-6 py-4 font-bold text-gray-900">{formatIndianCurrency(initialInvestment)}</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <th className="px-6 py-4 font-semibold text-gray-600 bg-gray-50/50">Payment (PMT)</th>
              <td className={`px-6 py-4 font-bold ${calcMode === 'pmt' ? 'text-[#032e92]' : 'text-gray-900'}`}>{formatIndianCurrency(pmtValue)}</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <th className="px-6 py-4 font-semibold text-gray-600 bg-gray-50/50">Future Value (FV)</th>
              <td className={`px-6 py-4 font-bold ${calcMode === 'fv' ? 'text-[#032e92]' : 'text-gray-900'}`}>{formatIndianCurrency(fvValue)}</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <th className="px-6 py-4 font-semibold text-gray-600 bg-gray-50/50">Periodic Rate (r)</th>
              <td className="px-6 py-4 font-bold text-gray-900">{(results.periodicRate * 100).toFixed(4)}%</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <th className="px-6 py-4 font-semibold text-gray-600 bg-gray-50/50">Periods (n)</th>
              <td className="px-6 py-4 font-bold text-gray-900">{results.periods}</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <th className="px-6 py-4 font-semibold text-gray-600 bg-gray-50/50">Compounding</th>
              <td className="px-6 py-4 font-bold text-gray-900 capitalize">{results.frequency}</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <th className="px-6 py-4 font-semibold text-gray-600 bg-gray-50/50">Payment Timing</th>
              <td className="px-6 py-4 font-bold text-gray-900 capitalize">{paymentTiming} of Period</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
