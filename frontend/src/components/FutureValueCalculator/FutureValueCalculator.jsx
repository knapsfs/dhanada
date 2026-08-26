import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';

import FrequencyToggle from './FrequencyToggle';
import CalculatorInputs from './CalculatorInputs';
import CalculatorResults from './CalculatorResults';
import GrowthChart from './GrowthChart';
import AdvancedTVM from './AdvancedTVM';
import CalculatorDisclaimer from './CalculatorDisclaimer';
import { calculateFutureValue, generateChartData } from './calculatorUtils';

export default function FutureValueCalculator() {
  const [frequency, setFrequency] = useState('monthly');
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [recurringInvestment, setRecurringInvestment] = useState(25000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(15);
  const [paymentTiming, setPaymentTiming] = useState('end');
  const [advancedMode, setAdvancedMode] = useState(false);

  // Convert recurring investment when frequency changes
  const handleConvertInvestment = (newFrequency) => {
    if (newFrequency === 'annual') {
      setRecurringInvestment(prev => prev * 12);
    } else {
      setRecurringInvestment(prev => Math.round(prev / 12));
    }
  };

  const resetDefaults = () => {
    setFrequency('monthly');
    setInitialInvestment(100000);
    setRecurringInvestment(25000);
    setAnnualReturn(12);
    setYears(15);
    setPaymentTiming('end');
    setAdvancedMode(false);
  };

  const results = useMemo(() => calculateFutureValue({
    pv: initialInvestment,
    pmt: recurringInvestment,
    annualRate: annualReturn,
    years: years,
    frequency: frequency,
    timing: paymentTiming
  }), [initialInvestment, recurringInvestment, annualReturn, years, frequency, paymentTiming]);

  const chartData = useMemo(() => generateChartData({
    pv: initialInvestment,
    pmt: recurringInvestment,
    annualRate: annualReturn,
    years: years,
    frequency: frequency,
    timing: paymentTiming
  }), [initialInvestment, recurringInvestment, annualReturn, years, frequency, paymentTiming]);

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
            See how your investments could potentially grow over time with the power of compounding. Adjust the amount, return and investment period to explore different scenarios.
          </p>
        </div>

        {/* Main Calculator Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-[#e8edf7] p-6 lg:p-10"
        >
          <FrequencyToggle 
            frequency={frequency} 
            setFrequency={setFrequency} 
            convertInvestment={handleConvertInvestment} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column: Inputs */}
            <div className="lg:col-span-5">
              <CalculatorInputs 
                initialInvestment={initialInvestment}
                setInitialInvestment={setInitialInvestment}
                recurringInvestment={recurringInvestment}
                setRecurringInvestment={setRecurringInvestment}
                annualReturn={annualReturn}
                setAnnualReturn={setAnnualReturn}
                years={years}
                setYears={setYears}
                paymentTiming={paymentTiming}
                setPaymentTiming={setPaymentTiming}
                frequency={frequency}
                resetDefaults={resetDefaults}
              />
            </div>

            {/* Right Column: Results & Chart */}
            <div className="lg:col-span-7 flex flex-col">
              <CalculatorResults results={results} />
              
              <GrowthChart chartData={chartData} />
              
              <AdvancedTVM 
                advancedMode={advancedMode}
                setAdvancedMode={setAdvancedMode}
                initialInvestment={initialInvestment}
                recurringInvestment={recurringInvestment}
                results={results}
                paymentTiming={paymentTiming}
              />

              <CalculatorDisclaimer 
                initialInvestment={initialInvestment}
                recurringInvestment={recurringInvestment}
                annualReturn={annualReturn}
                years={years}
                frequency={frequency}
              />
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
