import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalculator, faCircleInfo
} from '@fortawesome/free-solid-svg-icons'

function InputField({ id, label, prefix, suffix, value, min, max, step = 1, onChange, hint, placeholder = '' }) {
  return (
    <div className="flex flex-col gap-1.5">
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
          value={value === '' || value === null || value === undefined ? '' : value}
          min={min}
          max={max}
          step={step}
          onChange={e => {
            const val = e.target.value;
            onChange(val === '' ? '' : Number(val));
          }}
          className={`w-full py-3.5 rounded-xl border-2 border-[#e8edf7] bg-[#f7f9fc] text-gray-800 font-bold text-base focus:outline-none focus:border-[#032e92] focus:ring-4 focus:ring-[#032e92]/8 transition-all placeholder-gray-400 ${prefix ? 'pl-8 pr-4' : suffix ? 'pl-4 pr-12' : 'px-4'}`}
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
        <span>{prefix}{min?.toLocaleString()}{suffix}</span>
        <span>{prefix}{max?.toLocaleString()}{suffix}</span>
      </div>
    </div>
  )
}

export default function StepUpSipCalculatorForm({ inputs, setInputs, isInflationAdjusted, setIsInflationAdjusted }) {
  const handleChange = (key, val) => setInputs(prev => ({ ...prev, [key]: val }))

  return (
    <section className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl shadow-blue-900/8 border border-[#e8edf7] p-6 lg:p-8">

          {/* Header with Title and Inflation Adjusted Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#e8edf7]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#eef4ff] flex items-center justify-center">
                <FontAwesomeIcon icon={faCalculator} className="text-[#032e92] text-sm" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Step Up SIP Calculator</h2>
                <p className="text-xs text-gray-400 font-medium">Results update instantly as you type</p>
              </div>
            </div>

            {/* Inflation Adjusted Toggle */}
            <div className="flex items-center gap-2.5 bg-[#f7f9fc] px-4 py-2 rounded-2xl border border-[#e8edf7] self-start sm:self-auto">
              <span className="text-xs font-semibold text-gray-600">Inflation-Adjusted @5% p.a.</span>
              <button
                type="button"
                role="switch"
                aria-checked={isInflationAdjusted}
                onClick={() => setIsInflationAdjusted(!isInflationAdjusted)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${
                  isInflationAdjusted ? 'bg-[#ff5722]' : 'bg-gray-200 hover:bg-gray-300'
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

          {/* Main Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InputField
              id="monthly-investment"
              label="Monthly Investment"
              prefix="₹"
              value={inputs.monthlyInvestment}
              min={500}
              max={500000}
              step={500}
              onChange={v => handleChange('monthlyInvestment', v)}
              hint="Initial monthly SIP amount"
            />

            {/* Annual Step Up Field with % vs ₹ Toggle */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="step-up" className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  Annual Step Up
                  <span title="Increase your SIP every year by a fixed percentage or amount" className="cursor-help">
                    <FontAwesomeIcon icon={faCircleInfo} className="text-gray-300 text-xs" />
                  </span>
                </label>

                {/* Step Up Mode Toggle Buttons */}
                <div className="inline-flex rounded-lg p-0.5 bg-[#eef4ff] border border-blue-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (inputs.stepUpType !== 'percentage') {
                        setInputs(prev => ({ ...prev, stepUpType: 'percentage', stepUp: 10 }))
                      }
                    }}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                      inputs.stepUpType !== 'amount'
                        ? 'bg-[#032e92] text-white shadow-sm'
                        : 'text-gray-500 hover:text-[#032e92]'
                    }`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (inputs.stepUpType !== 'amount') {
                        setInputs(prev => ({ ...prev, stepUpType: 'amount', stepUp: 2000 }))
                      }
                    }}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                      inputs.stepUpType === 'amount'
                        ? 'bg-[#032e92] text-white shadow-sm'
                        : 'text-gray-500 hover:text-[#032e92]'
                    }`}
                  >
                    ₹
                  </button>
                </div>
              </div>

              <div className="relative flex items-center">
                {inputs.stepUpType === 'amount' && (
                  <span className="absolute left-3.5 text-sm font-bold text-gray-500 pointer-events-none z-10">₹</span>
                )}
                <input
                  id="step-up"
                  type="number"
                  value={inputs.stepUp === '' || inputs.stepUp === null || inputs.stepUp === undefined ? '' : inputs.stepUp}
                  min={inputs.stepUpType === 'amount' ? 500 : 1}
                  max={inputs.stepUpType === 'amount' ? 100000 : 50}
                  step={inputs.stepUpType === 'amount' ? 500 : 1}
                  onChange={e => {
                    const val = e.target.value
                    handleChange('stepUp', val === '' ? '' : Number(val))
                  }}
                  className={`w-full py-3.5 rounded-xl border-2 border-[#e8edf7] bg-[#f7f9fc] text-gray-800 font-bold text-base focus:outline-none focus:border-[#032e92] focus:ring-4 focus:ring-[#032e92]/8 transition-all placeholder-gray-400 ${
                    inputs.stepUpType === 'amount' ? 'pl-8 pr-4' : 'pl-4 pr-12'
                  }`}
                  placeholder=""
                />
                {inputs.stepUpType !== 'amount' && (
                  <span className="absolute right-3.5 text-sm font-bold text-gray-500 pointer-events-none">%</span>
                )}
              </div>
              <input
                type="range"
                min={inputs.stepUpType === 'amount' ? 500 : 1}
                max={inputs.stepUpType === 'amount' ? 100000 : 50}
                step={inputs.stepUpType === 'amount' ? 500 : 1}
                value={inputs.stepUp === '' ? (inputs.stepUpType === 'amount' ? 500 : 1) : inputs.stepUp}
                onChange={e => handleChange('stepUp', Number(e.target.value))}
                className="w-full h-1.5 rounded-full accent-[#032e92] cursor-pointer mt-1"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                <span>{inputs.stepUpType === 'amount' ? '₹500' : '1%'}</span>
                <span>{inputs.stepUpType === 'amount' ? '₹1,00,000' : '50%'}</span>
              </div>
            </div>

            <InputField
              id="annual-return"
              label="Expected Return Rate (p.a)"
              suffix="%"
              value={inputs.annualReturn}
              min={1}
              max={30}
              step={0.5}
              onChange={v => handleChange('annualReturn', v)}
              hint="Historical large cap average: 12-15% p.a."
            />

            <InputField
              id="duration"
              label="Time Period"
              suffix=" Yr"
              value={inputs.duration}
              min={1}
              max={40}
              step={1}
              onChange={v => handleChange('duration', v)}
              hint="Investment duration in years"
            />
          </div>

        </motion.div>
      </div>
    </section>
  )
}