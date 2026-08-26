import React from 'react';
import { formatIndianCurrency } from './calculatorUtils';

export default function CalculatorResults({ calcMode, results }) {
  const { futureValue, totalInvested, potentialGrowth, requiredPmt } = results;

  const isReverse = calcMode === 'pmt';
  const mainTitle = isReverse ? 'Required Monthly Investment' : 'Potential Future Value';
  const mainValue = isReverse ? requiredPmt : futureValue;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-br from-[#032e92] to-[#0a4fd4] rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-2 relative z-10">
          {mainTitle}
        </p>
        <div className="text-4xl lg:text-5xl font-bold mb-8 relative z-10">
          {formatIndianCurrency(mainValue)}
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
            <p className="text-blue-200 text-xs font-semibold mb-1">Total Invested</p>
            <p className="text-lg lg:text-xl font-bold">
              {formatIndianCurrency(totalInvested)}
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
            <p className="text-blue-200 text-xs font-semibold mb-1">Potential Growth</p>
            <p className="text-lg lg:text-xl font-bold">
              {formatIndianCurrency(potentialGrowth)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4 text-xs font-semibold text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#e8edf7]"></div>
          Invested
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#032e92]"></div>
          Growth
        </div>
      </div>
    </div>
  );
}
