import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

import ModeToggle from './ModeToggle';
import CalculatorInputs from './CalculatorInputs';
import CalculatorResults from './CalculatorResults';
import GrowthChart from './GrowthChart';
import CalculatorDisclaimer from './CalculatorDisclaimer';
import { calculateFutureValue, calculateRequiredInvestment, generateChartData } from './calculatorUtils';

export default function FutureValueCalculator() {
  const [calcMode, setCalcMode] = useState('fv'); // 'fv' or 'pmt'
  const location = useLocation();
  
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

  const calculators = [
    { name: 'SIP Calculator', path: '/calculators/sip' },
    { name: 'Step Up SIP', path: '/calculators/step-up-sip' },
    { name: 'SWP Calculator', path: '/calculators/swp' },
    { name: 'Lumpsum Calculator', path: '/calculators/lumpsum' },
    { name: 'Retirement Calculator', path: '/calculators/retirement' }
  ];

  return (
    <section className="bg-[#f7f9fc] py-20" id="future-value-calculator">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4 uppercase tracking-wider">
            Investment Calculator
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Future Value Calculator
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto mb-8">
            Calculate your potential future wealth, or discover exactly how much you need to invest every month to reach a specific financial goal.
          </p>
        </div>

        {/* Explore Calculators Banner */}
        <div className="flex flex-col items-center max-w-5xl mx-auto mb-12">
          <span className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-5">
            Explore Other Calculators
          </span>
          
          <div className="flex flex-row overflow-x-auto no-scrollbar w-full gap-3 justify-center pb-2">
            {calculators.map(calc => (
              <Link 
                key={calc.name} 
                to={calc.path} 
                className="flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold bg-white text-[#1e293b] hover:bg-[#eef4ff] hover:text-[#032e92] border border-[#e8edf7] transition-all shadow-sm"
              >
                {calc.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Calculator Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-[#e8edf7] p-6 lg:p-10"
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
  );
}
