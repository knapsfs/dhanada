import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleInfo, faCheckCircle, faCircle
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

function InputField({ id, label, value, min, max, step = 1, onChange, hint, prefix, suffix, placeholder = '' }) {
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

function RadioGroup({ label, options, selected, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-1">
        {label}
      </label>
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const isSelected = selected === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex items-start gap-3.5 w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#032e92] bg-[#eef4ff] shadow-sm'
                  : 'border-[#e8edf7] hover:border-[#032e92]/30 bg-white'
              }`}
            >
              <FontAwesomeIcon
                icon={isSelected ? faCheckCircle : faCircle}
                className={`mt-0.5 flex-shrink-0 ${isSelected ? 'text-[#032e92]' : 'text-gray-300'}`}
                style={{ fontSize: '18px' }}
              />
              <div className="flex flex-col">
                <span className={`font-bold text-sm tracking-wide ${isSelected ? 'text-[#032e92]' : 'text-gray-800'}`}>
                  {opt.title}
                </span>
                {opt.desc && (
                  <span className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {opt.desc}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function RetirementCalculatorForm({ inputs, setInputs }) {
  const handleChange = (key, val) => {
    setInputs(prev => {
      const next = { ...prev, [key]: val }
      // Ensure retirementAge is always strictly greater than current age
      if (key === 'age' && Number(val) >= Number(next.retirementAge)) {
        next.retirementAge = Math.min(80, Number(val) + 5)
      }
      return next
    })
  }

  const minRetireAge = Math.max(30, (Number(inputs.age) || 18) + 1)

  return (
    <section className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl shadow-blue-900/8 border border-[#e8edf7] p-6 lg:p-8"
        >
          {/* Top Row: 3 Numeric Sliders across the full width */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* How old are you? */}
            <InputField
              id="age"
              label="How old are you?"
              value={inputs.age}
              min={18}
              max={60}
              step={1}
              suffix=" Yrs"
              onChange={v => handleChange('age', v)}
            />

            {/* When do you wish to retire? */}
            <InputField
              id="retirement-age"
              label="When do you wish to retire?"
              value={inputs.retirementAge}
              min={minRetireAge}
              max={80}
              step={1}
              suffix=" Yrs"
              onChange={v => handleChange('retirementAge', v)}
            />

            {/* What are your current monthly household expenses? */}
            <InputField
              id="monthly-spend"
              label="What are your current monthly household expenses?"
              prefix="₹"
              value={inputs.monthlySpend}
              min={10000}
              max={1000000}
              step={5000}
              onChange={v => handleChange('monthlySpend', v)}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-[#e8edf7] pt-8">
            {/* Bottom Row: Selection Question Groups Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* How do you want to live after retirement? */}
              <RadioGroup
                label="How do you want to live after retirement?"
                options={[
                  {
                    title: 'Simple',
                    desc: 'I just want to cover my essential living expenses and enjoy a simple, peaceful lifestyle.',
                    value: 'simple',
                  },
                  {
                    title: 'Comfortable',
                    desc: 'I want to maintain a comfortable lifestyle with regular travel, hobbies and leisure.',
                    value: 'comfortable',
                  },
                  {
                    title: 'Luxury',
                    desc: 'I want a high-end lifestyle with frequent travel, premium experiences and greater spending freedom.',
                    value: 'luxury',
                  },
                ]}
                selected={inputs.lifestyle}
                onChange={v => handleChange('lifestyle', v)}
              />

              {/* WHERE DO YOU PREFER TO INVEST FOR RETIREMENT? */}
              <RadioGroup
                label="WHERE DO YOU PREFER TO INVEST FOR RETIREMENT?"
                options={[
                  {
                    title: 'SAFE',
                    desc: 'PPF, FD, EPF, NPS, Government Bonds etc.',
                    value: 'safe',
                  },
                  {
                    title: 'GROWTH',
                    desc: 'Mutual Funds, SIF, AIF, Stocks etc.',
                    value: 'growth',
                  },
                  {
                    title: 'INVEST IN BOTH',
                    desc: 'I would invest in a mix of safe and growth options.',
                    value: 'both',
                  },
                ]}
                selected={inputs.investmentPreference}
                onChange={v => handleChange('investmentPreference', v)}
              />
            </div>
          </div>

          <p className="text-[10px] text-gray-400 italic mt-6 mb-0 leading-tight">
            * Illustrative assumption only. Actual investment returns and expenses may vary and are not guaranteed.
          </p>
        </motion.div>
      </div>
    </section>
  )
}