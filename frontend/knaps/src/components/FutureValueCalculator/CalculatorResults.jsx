import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faChartLine, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { formatIndianCurrency } from './calculatorUtils';

export default function CalculatorResults({
  calcMode,
  results,
  isInflationAdjusted,
  setIsInflationAdjusted,
  inflationRate,
  setInflationRate
}) {
  const { futureValue, nominalFutureValue, inflationAdjustedValue, totalInvested, potentialGrowth, requiredPmt } = results;

  const isReverse = calcMode === 'pmt';
  const nominalVal = nominalFutureValue || futureValue || 0;
  const inflationVal = inflationAdjustedValue || futureValue || 0;

  const handleStepUp = (e) => {
    e.stopPropagation();
    setInflationRate((prev) => {
      const current = prev === '' ? 0 : Number(prev);
      return Math.min(30, +(current + 0.5).toFixed(1));
    });
  };

  const handleStepDown = (e) => {
    e.stopPropagation();
    setInflationRate((prev) => {
      const current = prev === '' ? 0 : Number(prev);
      return Math.max(0, +(current - 0.5).toFixed(1));
    });
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      {/* 1. Main Hero Result Card */}
      <div className="bg-gradient-to-br from-[#032e92] via-[#0948cd] to-[#021d63] rounded-2xl lg:rounded-3xl p-5 lg:p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        {/* Top Header with Icon, Title and Inline Inflation Adjusted Toggle */}
        <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faChartLine} className="text-white text-sm" />
            </div>
            <div>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">
                {isReverse ? 'Required Monthly Investment' : 'Estimated Value'}
              </p>
            </div>
          </div>

          {/* Inline Inflation Adjusted Control */}
          <div className="flex items-center flex-wrap gap-2 justify-end">
            <div className="flex items-center gap-1.5 text-white text-xs font-medium">
              <span className="font-semibold">Inflation</span>

              {/* Only shown when Toggle is ON */}
              {isInflationAdjusted && (
                <div className="flex items-center gap-1 animate-fadeIn">
                  <span>@</span>
                  <div className="inline-flex items-center bg-white/20 hover:bg-white/25 focus-within:bg-white/30 border border-white/30 rounded-md px-1.5 py-0.5 transition-all">
                    <input
                      type="number"
                      value={inflationRate === '' ? '' : inflationRate}
                      min={0}
                      max={30}
                      step={0.5}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setInflationRate('');
                        } else {
                          const num = Number(val);
                          setInflationRate(Math.max(0, Math.min(30, num)));
                        }
                      }}
                      className="w-7 bg-transparent text-white font-bold text-center text-xs focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0"
                      title="Click to type custom inflation rate"
                    />
                    <span className="text-blue-100 text-[10px] font-bold mr-1">%</span>

                    {/* Micro Up/Down Arrows */}
                    <div className="flex flex-col justify-center -space-y-1 text-[7px] text-blue-200">
                      <button
                        type="button"
                        onClick={handleStepUp}
                        className="hover:text-white transition-colors leading-none p-0.5 cursor-pointer active:scale-125"
                        title="Increase inflation rate by 0.5%"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={handleStepDown}
                        className="hover:text-white transition-colors leading-none p-0.5 cursor-pointer active:scale-125"
                        title="Decrease inflation rate by 0.5%"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  <span>p.a.</span>
                </div>
              )}
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isInflationAdjusted}
              onClick={() => setIsInflationAdjusted(!isInflationAdjusted)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer flex-shrink-0 ${
                isInflationAdjusted ? 'bg-[#ff5722]' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 shadow-md ${
                  isInflationAdjusted ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Values Section */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {isReverse ? (
              <motion.div
                key="reverse-mode"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight">
                  {formatIndianCurrency(requiredPmt)}
                  <span className="text-sm font-semibold text-blue-200 ml-2">/ month</span>
                </div>
              </motion.div>
            ) : isInflationAdjusted ? (
              <motion.div
                key="inflation-on"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1"
              >
                {/* Left: Without Inflation */}
                <div className="bg-white/10 rounded-2xl p-3 border border-white/15 backdrop-blur-sm flex flex-col justify-between">
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
                    Estimated Value
                  </p>
                  <p className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {formatIndianCurrency(nominalVal)}
                  </p>
                </div>

                {/* Right: With Inflation */}
                <div className="bg-white/20 rounded-2xl p-3 border border-white/25 backdrop-blur-md flex flex-col justify-between shadow-inner">
                  <p className="text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">
                    Inflation Adjusted Value ({inflationRate}%)
                  </p>
                  <p className="text-2xl lg:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {formatIndianCurrency(inflationVal)}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="inflation-off"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight">
                  {formatIndianCurrency(nominalVal)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. Separate Stats Cards Below (Your Money Put In & Money You Could Earn) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        {/* Card 1: Your Money Put In */}
        <div className="bg-white rounded-2xl lg:rounded-3xl border border-[#e8edf7] shadow-md shadow-blue-900/5 p-5 hover:shadow-lg transition-all group flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#eef4ff] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FontAwesomeIcon icon={faWallet} className="text-[#032e92] text-base" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Your Money Put In</p>
            <p className="text-2xl lg:text-3xl font-extrabold text-[#032e92] leading-tight">
              {formatIndianCurrency(totalInvested)}
            </p>
          </div>
        </div>

        {/* Card 2: Money You Could Earn */}
        <div className="bg-white rounded-2xl lg:rounded-3xl border border-green-100 shadow-md shadow-blue-900/5 p-5 hover:shadow-lg transition-all group flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FontAwesomeIcon icon={faArrowTrendUp} className="text-green-600 text-base" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Money You Could Earn</p>
            <p className="text-2xl lg:text-3xl font-extrabold text-green-600 leading-tight">
              {formatIndianCurrency(potentialGrowth)}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Legend Indicator */}
      <div className="flex items-center justify-center gap-6 text-xs font-semibold text-gray-500 pt-1">
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