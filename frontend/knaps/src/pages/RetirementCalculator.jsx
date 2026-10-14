import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RetirementHero from '../components/RetirementHero'
import RetirementCalculatorForm from '../components/RetirementCalculatorForm'
import RetirementOutput from '../components/RetirementOutput'
import RetirementFAQ from '../components/RetirementFAQ'
import CTA from '../components/CTA'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

// ─── Retirement Calculation ──────────────────────────────────────────────────
function calculateRetirement(age, retirementAge, monthlySpend, lifestyle, investmentPreference) {
  const currentAge = Number(age) || 25
  const retAge = Math.max(currentAge + 1, Number(retirementAge) || 60)
  const spend = Number(monthlySpend) || 25000
  const lifeExpectancy = 85

  const yearsToRetirement = Math.max(1, retAge - currentAge)
  const yearsInRetirement = Math.max(1, lifeExpectancy - retAge)

  // Assumptions
  const inflation = 0.06 // 6% inflation
  const postRetirementReturn = 0.07 // 7% safe return post-retirement

  // Lifestyle multipliers
  let lifestyleMultiplier = 1.0
  if (lifestyle === 'luxury') {
    lifestyleMultiplier = 1.4
  } else if (lifestyle === 'simple') {
    lifestyleMultiplier = 0.7
  } else {
    // comfortable
    lifestyleMultiplier = 1.0
  }

  // Monthly expenses at retirement age adjusted for inflation
  const expensesAtRetirement = spend * Math.pow(1 + inflation, yearsToRetirement) * lifestyleMultiplier

  // Real rate of return post-retirement
  const realReturnPostRetirement = (1 + postRetirementReturn) / (1 + inflation) - 1
  const r_monthly = realReturnPostRetirement / 12
  const monthsInRetirement = yearsInRetirement * 12

  let requiredCorpus = 0
  if (r_monthly === 0) {
    requiredCorpus = expensesAtRetirement * monthsInRetirement
  } else {
    // PV of growing annuity in advance
    requiredCorpus = expensesAtRetirement * ((1 - Math.pow(1 + r_monthly, -monthsInRetirement)) / r_monthly) * (1 + r_monthly)
  }

  // Pre-retirement savings return rate:
  // safe: 7% | growth: 12% | both: 10%
  let preRetirementReturn = 0.10
  if (investmentPreference === 'safe') {
    preRetirementReturn = 0.07
  } else if (investmentPreference === 'growth') {
    preRetirementReturn = 0.12
  } else if (investmentPreference === 'both') {
    preRetirementReturn = 0.10
  }

  // Monthly compounding rate for pre-retirement SIP
  const r_pre_monthly = Math.pow(1 + preRetirementReturn, 1 / 12) - 1
  const monthsToSave = yearsToRetirement * 12

  // Calculate monthly savings needed (PMT)
  let monthlySavingsNeeded = 0
  if (r_pre_monthly === 0) {
    monthlySavingsNeeded = requiredCorpus / monthsToSave
  } else {
    monthlySavingsNeeded = requiredCorpus / (((Math.pow(1 + r_pre_monthly, monthsToSave) - 1) / r_pre_monthly) * (1 + r_pre_monthly))
  }

  return {
    requiredCorpus: Math.round(requiredCorpus),
    monthlySavingsNeeded: Math.round(monthlySavingsNeeded),
    retirementAge: retAge,
    yearsToRetirement,
    yearsInRetirement
  }
}

const DEFAULT_INPUTS = {
  age: 25,
  retirementAge: 60,
  monthlySpend: 25000,
  lifestyle: 'comfortable',
  investmentPreference: 'both'
}

// ─── Disclaimer ────────────────────────────────────────────────────────────────
function Disclaimer() {
  return (
    <section className="bg-[#f7f9fc] pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex gap-3">
          <FontAwesomeIcon icon={faCircleInfo} className="text-gray-400 text-base flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Disclaimer</p>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              The calculations provided are illustrative in nature and based on mathematical compounding and your inputs. Actual investment returns are subject to market risks and will depend on fund performance, asset allocation, and market conditions. Please consult a qualified financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function RetirementCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)

  const results = useMemo(
    () => calculateRetirement(
      inputs.age,
      inputs.retirementAge,
      inputs.monthlySpend,
      inputs.lifestyle,
      inputs.investmentPreference
    ),
    [inputs.age, inputs.retirementAge, inputs.monthlySpend, inputs.lifestyle, inputs.investmentPreference]
  )

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main className="pt-10">
        {/* Hero */}
        <RetirementHero />

        {/* Calculator Form */}
        <RetirementCalculatorForm inputs={inputs} setInputs={setInputs} />

        {/* Output Area */}
        <RetirementOutput results={results} />

        {/* Disclaimer */}
        <Disclaimer />

        {/* FAQ */}
        <RetirementFAQ />

        {/* CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
