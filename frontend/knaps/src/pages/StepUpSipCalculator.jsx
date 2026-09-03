import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StepUpSipHero from '../components/StepUpSipHero'
import StepUpSipCalculatorForm from '../components/StepUpSipCalculatorForm'
import StepUpSipSummaryCards from '../components/StepUpSipSummaryCards'
import StepUpSipGrowthChart from '../components/StepUpSipGrowthChart'
import StepUpSipProjectionTable from '../components/StepUpSipProjectionTable'
import StepUpSipFAQ from '../components/StepUpSipFAQ'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

// Step Up SIP Calculation
function calculateStepUpSip(monthlyInvestment, stepUp, stepUpType = 'percentage', annualReturn, duration, isInflationAdjusted = false, inflationRate = 5) {
  const i = (annualReturn / 12) / 100
  const infRate = Number(inflationRate) / 100
  let totalInvested = 0
  let nominalFutureValue = 0

  for (let y = 1; y <= duration; y++) {
    // Calculate monthly investment for year y
    let py = monthlyInvestment
    if (stepUpType === 'amount') {
      py = monthlyInvestment + (y - 1) * stepUp
    } else {
      py = monthlyInvestment * Math.pow(1 + Math.min(stepUp, 100) / 100, y - 1)
    }

    totalInvested += py * 12

    // Future value of year y's contributions compounded to duration
    const months_left = 12 * (duration - y)
    let fvy = 0
    if (i === 0) {
      fvy = py * 12
    } else {
      fvy = py * ((Math.pow(1 + i, 12) - 1) / i) * Math.pow(1 + i, months_left)
    }

    nominalFutureValue += fvy
  }

  let inflationAdjustedValue = nominalFutureValue
  if (duration > 0) {
    inflationAdjustedValue = nominalFutureValue / Math.pow(1 + infRate, duration)
  }

  const futureValue = isInflationAdjusted ? inflationAdjustedValue : nominalFutureValue
  const wealthGained = Math.max(0, futureValue - totalInvested)

  return {
    totalInvested: Math.round(totalInvested),
    wealthGained: Math.round(wealthGained),
    futureValue: Math.round(futureValue),
    nominalFutureValue: Math.round(nominalFutureValue),
    inflationAdjustedValue: Math.round(inflationAdjustedValue)
  }
}

function calculateYearlyData(monthlyInvestment, stepUp, stepUpType = 'percentage', annualReturn, duration, isInflationAdjusted = false, inflationRate = 5) {
  const i = (annualReturn / 12) / 100
  const infRate = Number(inflationRate) / 100
  const yearlyData = []

  let cumulativeInvested = 0

  for (let k = 1; k <= duration; k++) {
    // Current year monthly SIP
    let currentYearSip = monthlyInvestment
    if (stepUpType === 'amount') {
      currentYearSip = monthlyInvestment + (k - 1) * stepUp
    } else {
      currentYearSip = monthlyInvestment * Math.pow(1 + Math.min(stepUp, 100) / 100, k - 1)
    }
    const currentYearTotal = currentYearSip * 12
    cumulativeInvested += currentYearTotal

    // Calculate FV up to year k
    let fv_k = 0
    for (let y = 1; y <= k; y++) {
      let py = monthlyInvestment
      if (stepUpType === 'amount') {
        py = monthlyInvestment + (y - 1) * stepUp
      } else {
        py = monthlyInvestment * Math.pow(1 + Math.min(stepUp, 100) / 100, y - 1)
      }
      const months_left = 12 * (k - y)
      let fvy = 0
      if (i === 0) {
        fvy = py * 12
      } else {
        fvy = py * ((Math.pow(1 + i, 12) - 1) / i) * Math.pow(1 + i, months_left)
      }
      fv_k += fvy
    }

    if (isInflationAdjusted) {
      fv_k = fv_k / Math.pow(1 + infRate, k)
    }

    const gain = Math.max(0, fv_k - cumulativeInvested)
    const returnPct = cumulativeInvested > 0 ? (gain / cumulativeInvested) * 100 : 0

    yearlyData.push({
      year: k,
      monthlyInvestment: Math.round(currentYearSip),
      invested: Math.round(cumulativeInvested),
      value: Math.round(fv_k),
      gain: Math.round(gain),
      returnPct
    })
  }

  return yearlyData
}

const DEFAULT_INPUTS = {
  monthlyInvestment: 25000,
  stepUp: 10,
  stepUpPct: 10,
  stepUpAmt: 2000,
  stepUpType: 'percentage',
  annualReturn: 12,
  duration: 10,
}

// Disclaimer
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

// Main Page
export default function StepUpSipCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)
  const [isInflationAdjusted, setIsInflationAdjusted] = useState(false)
  const [inflationRate, setInflationRate] = useState(5)

  const numInvestment = inputs.monthlyInvestment === '' ? 0 : Number(inputs.monthlyInvestment)
  const isPct = inputs.stepUpType !== 'amount'
  const numStepUp = isPct
    ? (inputs.stepUpPct === '' ? 0 : Number(inputs.stepUpPct ?? inputs.stepUp ?? 10))
    : (inputs.stepUpAmt === '' ? 0 : Number(inputs.stepUpAmt ?? inputs.stepUp ?? 2000))
  const numReturn = inputs.annualReturn === '' ? 0 : Number(inputs.annualReturn)
  const numDuration = inputs.duration === '' ? 0 : Number(inputs.duration)
  const numInflation = inflationRate === '' ? 0 : Number(inflationRate)

  const results = useMemo(
    () => calculateStepUpSip(numInvestment, numStepUp, inputs.stepUpType, numReturn, numDuration, isInflationAdjusted, numInflation),
    [numInvestment, numStepUp, inputs.stepUpType, numReturn, numDuration, isInflationAdjusted, numInflation]
  )

  const yearlyData = useMemo(
    () => calculateYearlyData(numInvestment, numStepUp, inputs.stepUpType, numReturn, numDuration, isInflationAdjusted, numInflation),
    [numInvestment, numStepUp, inputs.stepUpType, numReturn, numDuration, isInflationAdjusted, numInflation]
  )

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main className="pt-10">
        {/* Hero */}
        <StepUpSipHero />

        {/* Calculator Form */}
        <StepUpSipCalculatorForm
          inputs={inputs}
          setInputs={setInputs}
        />

        {/* Summary Cards with Inflation Control in Estimated Value card */}
        <StepUpSipSummaryCards
          results={results}
          isInflationAdjusted={isInflationAdjusted}
          setIsInflationAdjusted={setIsInflationAdjusted}
          inflationRate={inflationRate}
          setInflationRate={setInflationRate}
        />

        {/* Growth Chart */}
        <StepUpSipGrowthChart yearlyData={yearlyData} results={results} />

        {/* Projection Table */}
        <StepUpSipProjectionTable yearlyData={yearlyData} />

        {/* Disclaimer */}
        <Disclaimer />

        {/* FAQ */}
        <StepUpSipFAQ />
      </main>

      <Footer />
    </div>
  )
}