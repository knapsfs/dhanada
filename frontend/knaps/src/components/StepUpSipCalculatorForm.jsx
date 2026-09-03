import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalculator, faCircleInfo
} from '@fortawesome/free-solid-svg-icons'

const formatIndianNumber = (val) => {
  if (val === '' || val === null || val === undefined) return ''
  const str = String(val)
  if (str.includes('.')) {
    const [intPart, decPart] = str.split('.')
    const num = Number(intPart)
    return (isNaN(num) ? intPart : num.toLocaleString('en-IN')) + '.' + decPart
  }
  const num = Number(str)
  return isNaN(num) ? str : num.toLocaleString('en-IN')
}

const parseRawNumber = (rawStr) => {
  if (!rawStr) return ''
  const cleaned = rawStr.replace(/,/g, '').replace(/[^0-9.]/g, '')
  return cleaned
}

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
          type="text"
          inputMode="decimal"
          value={formatIndianNumber(value)}
          onChange={e => {
            const raw = parseRawNumber(e.target.value)
            if (raw === '') {
              onChange('')
            } else {
              const num = Number(raw)
              onChange(isNaN(num) ? raw : num)
            }
          }}
          className={`w-full py-3.5 rounded-xl border-2 border-[#e8edf7] bg-[#f7f9fc] text-gray-800 font-bold text-base focus:outline-none focus:border-[#032e92] focus:ring-4 focus:ring-[#032e92]/8 transition-all placeholder-gray-400 ${
            prefix ? 'pl-8 pr-4' : suffix ? 'pl-4 pr-12' : 'px-4'
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
  )
}

export default function StepUpSipCalculatorForm({ inputs, setInputs }) {
  const handleChange = (key, val) => setInputs(prev => ({ ...prev, [key]: val }))

  const isPct = inputs.stepUpType !== 'amount'

  // Values display: when percentage is active, amount displays 0. When amount is active, percentage displays 0.
  const displayPct = isPct
    ? (inputs.stepUpPct === '' ? '' : (inputs.stepUpPct ?? inputs.stepUp ?? 10))
    : 0

  const displayAmt = !isPct
    ? (inputs.stepUpAmt === '' ? '' : (inputs.stepUpAmt ?? inputs.stepUp ?? 2000))
    : 0

  const handleSelectPct = () => {
    if (!isPct) {
      setInputs(prev => ({
        ...prev,
        stepUpType: 'percentage',
        stepUpPct: prev.stepUpPct === '' ? '' : (prev.stepUpPct || 10)
      }))
    }
  }

  const handleSelectAmt = () => {
    if (isPct) {
      setInputs(prev => ({
        ...prev,
        stepUpType: 'amount',
        stepUpAmt: prev.stepUpAmt === '' ? '' : (prev.stepUpAmt || 2000)
      }))
    }
  }

  return (
    <section className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl shadow-blue-900/8 border border-[#e8edf7] p-6 lg:p-8"
        >
          {/* Header with Title */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e8edf7]">
            <div className="w-10 h-10 rounded-2xl bg-[#eef4ff] flex items-center justify-center">
              <FontAwesomeIcon icon={faCalculator} className="text-[#032e92] text-sm" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">Step Up SIP Calculator</h2>
              <p className="text-xs text-gray-400 font-medium">Results update instantly as you type</p>
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

            {/* Annual Step Up - Split Two-Part Input (Percentage & Amount) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                Annual Step Up
                <span title="Increase your SIP every year by percentage or fixed amount" className="cursor-help">
                  <FontAwesomeIcon icon={faCircleInfo} className="text-gray-300 text-xs" />
                </span>
              </label>

              {/* Divided Input Container */}
              <div className="grid grid-cols-2 gap-1.5 bg-[#f7f9fc] p-1 rounded-xl border-2 border-[#e8edf7]">
                
                {/* 1. Percentage Half */}
                <div
                  onClick={handleSelectPct}
                  className={`relative flex items-center rounded-lg px-2.5 py-2 transition-all cursor-pointer ${
                    isPct
                      ? 'bg-white shadow-sm border border-[#032e92]/30 ring-2 ring-[#032e92]/10'
                      : 'bg-transparent opacity-40 hover:opacity-75'
                  }`}
                >
                  <input
                    id="step-up-pct"
                    type="text"
                    inputMode="decimal"
                    value={formatIndianNumber(displayPct)}
                    onChange={(e) => {
                      const raw = parseRawNumber(e.target.value)
                      setInputs(prev => ({
                        ...prev,
                        stepUpType: 'percentage',
                        stepUpPct: raw === '' ? '' : Number(raw)
                      }))
                    }}
                    onFocus={handleSelectPct}
                    className="w-full bg-transparent text-gray-800 font-bold text-sm sm:text-base focus:outline-none pr-4 cursor-pointer"
                    placeholder="10"
                  />
                  <span className="absolute right-2 text-xs font-bold text-gray-500 pointer-events-none">%</span>
                </div>

                {/* 2. Amount Half */}
                <div
                  onClick={handleSelectAmt}
                  className={`relative flex items-center rounded-lg px-2.5 py-2 transition-all cursor-pointer ${
                    !isPct
                      ? 'bg-white shadow-sm border border-[#032e92]/30 ring-2 ring-[#032e92]/10'
                      : 'bg-transparent opacity-40 hover:opacity-75'
                  }`}
                >
                  <span className="absolute left-2 text-xs font-bold text-gray-500 pointer-events-none">₹</span>
                  <input
                    id="step-up-amt"
                    type="text"
                    inputMode="decimal"
                    value={formatIndianNumber(displayAmt)}
                    onChange={(e) => {
                      const raw = parseRawNumber(e.target.value)
                      setInputs(prev => ({
                        ...prev,
                        stepUpType: 'amount',
                        stepUpAmt: raw === '' ? '' : Number(raw)
                      }))
                    }}
                    onFocus={handleSelectAmt}
                    className="w-full bg-transparent text-gray-800 font-bold text-sm sm:text-base focus:outline-none pl-3.5 cursor-pointer"
                    placeholder="2,000"
                  />
                </div>
              </div>

              {/* Dynamic Range Slider */}
              <input
                type="range"
                min={isPct ? 1 : 500}
                max={isPct ? 50 : 100000}
                step={isPct ? 1 : 500}
                value={
                  isPct
                    ? (inputs.stepUpPct === '' ? 1 : (inputs.stepUpPct ?? inputs.stepUp ?? 10))
                    : (inputs.stepUpAmt === '' ? 500 : (inputs.stepUpAmt ?? inputs.stepUp ?? 2000))
                }
                onChange={e => {
                  const val = Number(e.target.value)
                  if (isPct) {
                    setInputs(prev => ({ ...prev, stepUpPct: val }))
                  } else {
                    setInputs(prev => ({ ...prev, stepUpAmt: val }))
                  }
                }}
                className="w-full h-1.5 rounded-full accent-[#032e92] cursor-pointer mt-1"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                <span>{isPct ? '1%' : '₹500'}</span>
                <span>{isPct ? '50%' : '₹1,00,000'}</span>
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