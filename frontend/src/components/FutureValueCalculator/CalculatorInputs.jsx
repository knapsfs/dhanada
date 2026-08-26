import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faRotateRight } from '@fortawesome/free-solid-svg-icons';

function InputField({ id, label, prefix, suffix, value, min, max, step = 1, onChange, hint }) {
  return (
    <div className="flex flex-col gap-1.5 mb-6">
      <label htmlFor={id} className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
        {label}
        {hint && (
          <span title={hint} className="cursor-help">
            <FontAwesomeIcon icon={faCircleInfo} className="text-gray-300 text-xs" />
          </span>
        )}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3.5 text-sm font-bold text-gray-500 pointer-events-none z-10">{prefix}</span>
        )}
        <input
          id={id}
          type="number"
          value={value === 0 && id === 'initial-investment' ? '' : value}
          min={min}
          max={max}
          step={step}
          onChange={e => {
            const val = e.target.value === '' ? 0 : Number(e.target.value);
            onChange(val);
          }}
          className={`w-full py-3.5 rounded-xl border-2 border-[#e8edf7] bg-[#f7f9fc] text-gray-800 font-bold text-base focus:outline-none focus:border-[#032e92] focus:ring-4 focus:ring-[#032e92]/8 transition-all placeholder-gray-400 ${prefix ? 'pl-8 pr-4' : suffix ? 'pl-4 pr-12' : 'px-4'}`}
          placeholder={id === 'initial-investment' ? '0' : ''}
        />
        {suffix && (
          <span className="absolute right-3.5 text-sm font-bold text-gray-500 pointer-events-none">{suffix}</span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full accent-[#032e92] cursor-pointer mt-1"
      />
      <div className="flex justify-between text-[10px] text-gray-400 font-medium">
        <span>{prefix}{min?.toLocaleString()}{suffix}</span>
        <span>{prefix}{max?.toLocaleString()}{suffix}</span>
      </div>
    </div>
  );
}

export default function CalculatorInputs({ 
  calcMode,
  initialInvestment, setInitialInvestment,
  recurringInvestment, setRecurringInvestment,
  targetFutureValue, setTargetFutureValue,
  annualReturn, setAnnualReturn,
  years, setYears,
  paymentTiming, setPaymentTiming,
  resetDefaults
}) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800 text-lg">Input Details</h3>
        <button 
          onClick={resetDefaults}
          className="text-xs font-semibold text-[#032e92] bg-[#eef4ff] px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1.5"
        >
          <FontAwesomeIcon icon={faRotateRight} />
          Reset
        </button>
      </div>

      {calcMode === 'pmt' && (
        <InputField
          id="target-future-value"
          label="Target Future Value"
          prefix="₹"
          value={targetFutureValue}
          min={100000}
          max={100000000}
          step={100000}
          onChange={setTargetFutureValue}
          hint="The amount you want to achieve at the end of the investment period."
        />
      )}

      <InputField
        id="initial-investment"
        label="Initial Investment"
        prefix="₹"
        value={initialInvestment}
        min={0}
        max={10000000}
        step={10000}
        onChange={setInitialInvestment}
        hint="The amount you invest at the beginning."
      />

      {calcMode === 'fv' && (
        <InputField
          id="recurring-investment"
          label="Monthly Investment"
          prefix="₹"
          value={recurringInvestment}
          min={0}
          max={500000}
          step={1000}
          onChange={setRecurringInvestment}
          hint="The amount you invest every month."
        />
      )}

      <InputField
        id="annual-return"
        label="Expected Annual Return"
        suffix="%"
        value={annualReturn}
        min={0}
        max={30}
        step={0.5}
        onChange={setAnnualReturn}
        hint="Illustrative assumption only. Actual investment returns may vary."
      />
      <p className="text-[10px] text-gray-400 italic -mt-4 mb-6 leading-tight">
        * Illustrative assumption only. Actual investment returns may vary and are not guaranteed.
      </p>

      <InputField
        id="investment-period"
        label="Investment Period"
        suffix=" Years"
        value={years}
        min={1}
        max={40}
        step={1}
        onChange={setYears}
        hint="How long do you plan to stay invested?"
      />

      <div className="flex flex-col gap-2 mt-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          When is the investment made?
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
            <input 
              type="radio" 
              name="paymentTiming" 
              value="beginning" 
              checked={paymentTiming === 'beginning'}
              onChange={() => setPaymentTiming('beginning')}
              className="accent-[#032e92] w-4 h-4 cursor-pointer"
            />
            Beginning of month
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
            <input 
              type="radio" 
              name="paymentTiming" 
              value="end" 
              checked={paymentTiming === 'end'}
              onChange={() => setPaymentTiming('end')}
              className="accent-[#032e92] w-4 h-4 cursor-pointer"
            />
            End of month
          </label>
        </div>
      </div>
    </div>
  );
}
