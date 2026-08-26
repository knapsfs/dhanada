import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

import ModeToggle from './ModeToggle';
import CalculatorInputs from './CalculatorInputs';
import CalculatorResults from './CalculatorResults';
import GrowthChart from './GrowthChart';
import AdvancedTVM from './AdvancedTVM';
import CalculatorDisclaimer from './CalculatorDisclaimer';
import { calculateFutureValue, calculateRequiredInvestment, generateChartData } from './calculatorUtils';

export default function FutureValueCalculator() {
  const [calcMode, setCalcMode] = useState('fv'); // 'fv' or 'pmt'
  
  // Hardcode frequency to monthly for simplicity in this reverse calculator mode
  const frequency = 'monthly';
  
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [recurringInvestment, setRecurringInvestment] = useState(25000); // For FV mode
  const [targetFutureValue, setTargetFutureValue] = useState(10000000); // For PMT mode (1 Cr)
  
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(15);
  const [paymentTiming, setPaymentTiming] = useState('end');
  const [advancedMode, setAdvancedMode] = useState(false);

  const resetDefaults = () => {
    setInitialInvestment(100000);
    setRecurringInvestment(25000);
    setTargetFutureValue(10000000);
    setAnnualReturn(12);
    setYears(15);
    setPaymentTiming('end');
    setAdvancedMode(false);
  };

  const results = useMemo(() => {
    if (calcMode === 'fv') {
      return calculateFutureValue({
        pv: initialInvestment,
        pmt: recurringInvestment,
        annualRate: annualReturn,
        years: years,
        frequency: frequency,
        timing: paymentTiming
      });
    } else {
      return calculateRequiredInvestment({
        targetFv: targetFutureValue,
        pv: initialInvestment,
        annualRate: annualReturn,
        years: years,
        frequency: frequency,
        timing: paymentTiming
      });
    }
  }, [calcMode, initialInvestment, recurringInvestment, targetFutureValue, annualReturn, years, paymentTiming]);

  const chartData = useMemo(() => generateChartData({
    calcMode,
    targetFv: targetFutureValue,
    pv: initialInvestment,
    pmt: recurringInvestment,
    annualRate: annualReturn,
    years: years,
    frequency: frequency,
    timing: paymentTiming
  }), [calcMode, initialInvestment, recurringInvestment, targetFutureValue, annualReturn, years, paymentTiming]);

  return (
    <section className="bg-[#f7f9fc] py-20" id="future-value-calculator">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4 uppercase tracking-wider">
            Investment Calculator
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Future Value Calculator
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            Calculate your potential future wealth, or discover exactly how much you need to invest every month to reach a specific financial goal.
          </p>
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
            <div className="lg:col-span-5">
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
                paymentTiming={paymentTiming}
                setPaymentTiming={setPaymentTiming}
                resetDefaults={resetDefaults}
              />
            </div>

            {/* Right Column: Results & Chart */}
            <div className="lg:col-span-7 flex flex-col">
              <CalculatorResults calcMode={calcMode} results={results} />
              
              <GrowthChart chartData={chartData} />
              
              <AdvancedTVM 
                calcMode={calcMode}
                advancedMode={advancedMode}
                setAdvancedMode={setAdvancedMode}
                initialInvestment={initialInvestment}
                recurringInvestment={recurringInvestment}
                targetFutureValue={targetFutureValue}
                results={results}
                paymentTiming={paymentTiming}
              />

              <CalculatorDisclaimer 
                initialInvestment={initialInvestment}
                recurringInvestment={calcMode === 'fv' ? recurringInvestment : results.requiredPmt}
                annualReturn={annualReturn}
                years={years}
                frequency="monthly"
              />
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
