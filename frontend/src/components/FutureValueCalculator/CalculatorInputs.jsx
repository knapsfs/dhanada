import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faRotateRight } from '@fortawesome/free-solid-svg-icons';

const formatIndianNumber = (val) => {
  if (val === '' || val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes('.')) {
    const [intPart, decPart] = str.split('.');
    const num = Number(intPart);
    return (isNaN(num) ? intPart : num.toLocaleString('en-IN')) + '.' + decPart;
  }
  const num = Number(str);
  return isNaN(num) ? str : num.toLocaleString('en-IN');
};

const parseRawNumber = (rawStr) => {
  if (!rawStr) return '';
  const cleaned = rawStr.replace(/,/g, '').replace(/[^0-9.]/g, '');
  return cleaned;
};

function InputField({ id, label, prefix, suffix, value, min, max, step = 1, onChange, hint, placeholder = '' }) {
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
          type="text"
          inputMode="decimal"
          value={formatIndianNumber(value)}
          onChange={e => {
            const raw = parseRawNumber(e.target.value);
            if (raw === '') {
              onChange('');
            } else {
              const num = Number(raw);
              onChange(isNaN(num) ? raw : num);
            }
          }}
          className={`w-full py-3.5 rounded-xl border-2 border-[#e8edf7] bg-[#f7f9fc] text-gray-800 font-bold text-base focus:outline-none focus:border-[#032e92] focus:ring-4 focus:ring-[#032e92]/8 transition-all placeholder-gray-400 ${prefix ? 'pl-8 pr-4' : suffix ? 'pl-4 pr-12' : 'px-4'
            }`}
          placeholder={placeholder}
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
        value={value === '' || value === null || value === undefined ? min : value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full accent-[#032e92] cursor-pointer mt-1"
      />
      <div className="flex justify-between text-[10px] text-gray-400 font-medium">
        <span>{prefix}{min?.toLocaleString('en-IN')}{suffix}</span>
        <span>{prefix}{max?.toLocaleString('en-IN')}{suffix}</span>
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
        <h3 className="font-bold text-gray-800 text-lg">Your Investment Details</h3>
        <button
          type="button"
          onClick={resetDefaults}
          className="text-xs font-semibold text-[#032e92] bg-[#eef4ff] px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <FontAwesomeIcon icon={faRotateRight} />
          Reset
        </button>
      </div>

      {calcMode === 'pmt' && (
        <InputField
          id="target-future-value"
          label="How Much Money Do You Need?"
          prefix="₹"
          value={targetFutureValue}
          min={100000}
          max={100000000}
          step={100000}
          onChange={setTargetFutureValue}
          hint="The amount you want to achieve at the end of the investment period."
        />
      )}

      {calcMode === 'fv' && (
        <InputField
          id="initial-investment"
          label="Starting Amount"
          prefix="₹"
          value={initialInvestment}
          min={0}
          max={10000000}
          step={10000}
          onChange={setInitialInvestment}
          hint="The amount you invest at the beginning."
        />
      )}

      {calcMode === 'fv' && (
        <InputField
          id="recurring-investment"
          label="Monthly Amount"
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
        id="investment-period"
        label="When Will You Need the Money?"
        suffix=" Years"
        value={years}
        min={1}
        max={40}
        step={1}
        onChange={setYears}
        hint="How long do you plan to stay invested?"
      />

      <InputField
        id="annual-return"
        label="How Much Could Your Money Grow Each Year?"
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
    </div>
  );
}