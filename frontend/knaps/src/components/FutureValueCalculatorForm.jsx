import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

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
  return rawStr.replace(/,/g, '').replace(/[^0-9.]/g, '')
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
  )
}

export default function FutureValueCalculatorForm({
  inputs,
  setInputs,
  _resetDefaults
}) {
  const handleChange = (key, val) => setInputs(prev => ({ ...prev, [key]: val }))

  return (
    <section className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl shadow-blue-900/8 border border-[#e8edf7] p-6 lg:p-8"
        >
          {/* Main Inputs: Find Your Monthly Investment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              id="target-future-value"
              label="How Much Money Do You Need?"
              prefix="₹"
              value={inputs.targetFutureValue}
              min={100000}
              max={100000000}
              step={100000}
              onChange={v => handleChange('targetFutureValue', v)}
            />
            <InputField
              id="investment-period"
              label="When Will You Need the Money?"
              suffix=" Years"
              value={inputs.years}
              min={1}
              max={40}
              step={1}
              onChange={v => handleChange('years', v)}
            />
            <InputField
              id="annual-return"
              label="Potential Annual Growth"
              suffix="%"
              value={inputs.annualReturn}
              min={0}
              max={30}
              step={0.5}
              onChange={v => handleChange('annualReturn', v)}
            />
          </div>

          <p className="text-[10px] text-gray-400 italic mt-6 mb-0 leading-tight">
            * Illustrative assumption only. Actual investment returns may vary and are not guaranteed.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
