import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

import ModeToggle from './ModeToggle';
import CalculatorInputs from './CalculatorInputs';
import CalculatorResults from './CalculatorResults';
import GrowthChart from './GrowthChart';
import CalculatorDisclaimer from './CalculatorDisclaimer';
import { calculateFutureValue, calculateRequiredInvestment, generateChartData } from './calculatorUtils';
import CalculatorNav from '../CalculatorNav'; // assuming CalculatorNav is in components

export default function FutureValueCalculator() {
  const [calcMode, setCalcMode] = useState('fv'); // 'fv' or 'pmt'
  
  // Hardcode frequency to monthly for simplicity in this reverse calculator mode
  const frequency = 'monthly';
  
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [recurringInvestment, setRecurringInvestment] = useState(25000); // For FV mode
  const [targetFutureValue, setTargetFutureValue] = useState(10000000); // For PMT mode (1 Cr)
  
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(15);
  // Default to end of month internally without showing it to user
  const paymentTiming = 'end';

  const resetDefaults = () => {
    setInitialInvestment(100000);
    setRecurringInvestment(25000);
    setTargetFutureValue(10000000);
    setAnnualReturn(12);
    setYears(15);
  };

  const results = useMemo(() => {
    // Determine the actual initial investment based on mode
    const activeInitialInvestment = calcMode === 'fv' ? initialInvestment : 0;
    
    if (calcMode === 'fv') {
      return calculateFutureValue({
        pv: activeInitialInvestment,
        pmt: recurringInvestment,
        annualRate: annualReturn,
        years: years,
        frequency: frequency,
        timing: paymentTiming
      });
    } else {
      return calculateRequiredInvestment({
        targetFv: targetFutureValue,
        pv: activeInitialInvestment,
        annualRate: annualReturn,
        years: years,
        frequency: frequency,
        timing: paymentTiming
      });
    }
  }, [calcMode, initialInvestment, recurringInvestment, targetFutureValue, annualReturn, years, paymentTiming]);

  const chartData = useMemo(() => {
    const activeInitialInvestment = calcMode === 'fv' ? initialInvestment : 0;
    return generateChartData({
      calcMode,
      targetFv: targetFutureValue,
      pv: activeInitialInvestment,
      pmt: recurringInvestment,
      annualRate: annualReturn,
      years: years,
      frequency: frequency,
      timing: paymentTiming
    });
  }, [calcMode, initialInvestment, recurringInvestment, targetFutureValue, annualReturn, years, paymentTiming]);

  return (
    <div className="bg-[#f7f9fc] w-full" id="future-value-calculator">
      
      {/* Hero Section similar to SipHero */}
      <section className="pt-24 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#eef4ff] to-[#dbeafe] blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#032e92] via-[#0a4fd4] to-[#021d63] p-8 lg:p-10 shadow-xl shadow-blue-900/10">

            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-[#c10000]/10 pointer-events-none" />

            <div className="relative">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
                Future Value{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                  Calculator
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-blue-100 font-medium leading-relaxed max-w-2xl text-sm mb-6">
                Calculate your potential future wealth, or discover exactly how much you need to invest every month to reach a specific financial goal.
              </motion.p>

              <CalculatorNav />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Calculator Area */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-[#e8edf7] p-6 lg:p-10 mt-6"
          >
            <ModeToggle 
              calcMode={calcMode} 
              setCalcMode={setCalcMode} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              
              {/* Left Column: Inputs */}
              <div className="lg:col-span-5 flex flex-col">
                <CalculatorInputs 
                  calcMode={calcMode}
                  initialInvestment={initialInvestment}
                  setInitialInvestment={setInitialInvestment}
                  recurringInvestment={recurringInvestment}
                  setRecurringInvestment={setRecurringInvestment}
                  targetFutureValue={targetFutureValue}
                  setTargetFutureValue={setTargetFutureValue}
                  annualReturn={annualReturn}
                  setAnnualReturn={setAnnualReturn}
                  years={years}
                  setYears={setYears}
                  resetDefaults={resetDefaults}
                />
              </div>

              {/* Right Column: Results & Chart */}
              <div className="lg:col-span-7 flex flex-col">
                <CalculatorResults calcMode={calcMode} results={results} />
                
                <GrowthChart chartData={chartData} />
              </div>

            </div>
            
            {/* Footer Area: Half on left, half on right */}
            <div className="mt-12 pt-8 border-t border-[#e8edf7]">
              <CalculatorDisclaimer 
                initialInvestment={calcMode === 'fv' ? initialInvestment : 0}
                recurringInvestment={calcMode === 'fv' ? recurringInvestment : results.requiredPmt}
                annualReturn={annualReturn}
                years={years}
                frequency="monthly"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
