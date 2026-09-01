import React from 'react';
import { formatIndianCurrency } from './calculatorUtils';

export default function CalculatorResults({ calcMode, results, isInflationAdjusted, setIsInflationAdjusted }) {
  const { futureValue, totalInvested, potentialGrowth, requiredPmt } = results;

  const isReverse = calcMode === 'pmt';
  const mainTitle = isReverse ? 'Required Monthly Investment' : 'You Could Have';
  const mainValue = isReverse ? requiredPmt : futureValue;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-br from-[#032e92] to-[#0a4fd4] rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        {/* Top Header with Title, Value, and Inflation Adjusted Toggle */}
        <div className="flex items-start justify-between gap-4 mb-8 relative z-10">
          <div>
            <p className="text-blue-200 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
              {mainTitle}
            </p>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {formatIndianCurrency(mainValue)}
            </div>
          </div>

          {/* Inflation Adjusted Toggle */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0 pt-0.5">
            <span className="text-white text-xs sm:text-sm font-medium">Inflation-Adjusted @5% p.a.</span>
            <button
              type="button"
              role="switch"
              aria-checked={isInflationAdjusted}
              onClick={() => setIsInflationAdjusted(!isInflationAdjusted)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
                isInflationAdjusted ? 'bg-[#ff5722]' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-md ${
                  isInflationAdjusted ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Stats 2-column Grid */}
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
            <p className="text-blue-200 text-xs font-semibold mb-1">Your Money Put In</p>
            <p className="text-lg lg:text-xl font-bold">
              {formatIndianCurrency(totalInvested)}
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
            <p className="text-blue-200 text-xs font-semibold mb-1">Money You Could Earn</p>
            <p className="text-lg lg:text-xl font-bold">
              {formatIndianCurrency(potentialGrowth)}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Legend Indicator */}
      <div className="flex items-center justify-center gap-6 text-xs font-semibold text-gray-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#94a3b8]"></span>
          Your Money
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#032e92]"></span>
          Potential Future Value
        </div>
      </div>
    </div>
  );
}
