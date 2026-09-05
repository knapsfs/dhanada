import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LumpsumHero from '../components/LumpsumHero'
import LumpsumCalculatorForm from '../components/LumpsumCalculatorForm'
import LumpsumSummaryCards from '../components/LumpsumSummaryCards'
import LumpsumGrowthChart from '../components/LumpsumGrowthChart'
import LumpsumProjectionTable from '../components/LumpsumProjectionTable'
import LumpsumFAQ from '../components/LumpsumFAQ'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

// Lumpsum Calculation
function calculateLumpsum(totalInvestment, annualReturn, duration, isInflationAdjusted = false, inflationRate = 5) {
  const r = annualReturn / 100
  const n = duration
  const infRate = Number(inflationRate) / 100

  const nominalFutureValue = totalInvestment * Math.pow(1 + r, n)
  let inflationAdjustedValue = nominalFutureValue

  if (duration > 0) {
    inflationAdjustedValue = nominalFutureValue / Math.pow(1 + infRate, duration)
  }

  const futureValue = isInflationAdjusted ? inflationAdjustedValue : nominalFutureValue
  const wealthGained = Math.max(0, futureValue - totalInvestment)

  return {
    totalInvested: Math.round(totalInvestment),
    wealthGained: Math.round(wealthGained),
    futureValue: Math.round(futureValue),
    nominalFutureValue: Math.round(nominalFutureValue),
    inflationAdjustedValue: Math.round(inflationAdjustedValue)
  }
}

function calculateYearlyData(totalInvestment, annualReturn, duration, isInflationAdjusted = false, inflationRate = 5) {
  const r = annualReturn / 100
  const infRate = Number(inflationRate) / 100

  return Array.from({ length: duration }, (_, i) => {
    const year = i + 1
    let value = totalInvestment * Math.pow(1 + r, year)

    if (isInflationAdjusted) {
      value = value / Math.pow(1 + infRate, year)
    }

    const gain = Math.max(0, value - totalInvestment)

    return {
      year,
      invested: Math.round(totalInvestment),
      value: Math.round(value),
      gain: Math.round(gain)
    }
  })
}

const DEFAULT_INPUTS = {
  totalInvestment: 25000,
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
export default function LumpsumCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)
  const [isInflationAdjusted, setIsInflationAdjusted] = useState(false)
  const [inflationRate, setInflationRate] = useState(5)

  const numInvestment = inputs.totalInvestment === '' ? 0 : Number(inputs.totalInvestment)
  const numReturn = inputs.annualReturn === '' ? 0 : Number(inputs.annualReturn)
  const numDuration = inputs.duration === '' ? 0 : Number(inputs.duration)
  const numInflation = inflationRate === '' ? 0 : Number(inflationRate)

  const results = useMemo(
    () => calculateLumpsum(numInvestment, numReturn, numDuration, isInflationAdjusted, numInflation),
    [numInvestment, numReturn, numDuration, isInflationAdjusted, numInflation]
  )

  const yearlyData = useMemo(
    () => calculateYearlyData(numInvestment, numReturn, numDuration, isInflationAdjusted, numInflation),
    [numInvestment, numReturn, numDuration, isInflationAdjusted, numInflation]
  )

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main className="pt-10">
        {/* Hero */}
        <LumpsumHero />

        {/* Calculator Form */}
        <LumpsumCalculatorForm
          inputs={inputs}
          setInputs={setInputs}
        />

        {/* Summary Cards with Inflation Control in Estimated Value card */}
        <LumpsumSummaryCards
          results={results}
          isInflationAdjusted={isInflationAdjusted}
          setIsInflationAdjusted={setIsInflationAdjusted}
          inflationRate={inflationRate}
          setInflationRate={setInflationRate}
        />

        {/* Growth Chart */}
        <LumpsumGrowthChart yearlyData={yearlyData} results={results} />

        {/* Projection Table */}
        <LumpsumProjectionTable yearlyData={yearlyData} />

        {/* Disclaimer */}
        <Disclaimer />

        {/* FAQ */}
        <LumpsumFAQ />
      </main>

      <Footer />
    </div>
  )
}