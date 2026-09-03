import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SipHero from '../components/SipHero'
import SipCalculatorForm from '../components/SipCalculatorForm'
import SipSummaryCards from '../components/SipSummaryCards'
import SipGrowthChart from '../components/SipGrowthChart'
import SipProjectionTable from '../components/SipProjectionTable'
import InvestmentInsights from '../components/InvestmentInsights'
import SipFAQ from '../components/SipFAQ'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

// Standard Monthly SIP Calculation
// i = annual_rate / 12 / 100
// FV = P * [ (1 + i)^n - 1 ] / i
function calculateSIP(sipAmount, annualReturn, duration, isInflationAdjusted = false, inflationRate = 5) {
  const i = (annualReturn / 12) / 100
  const n = duration * 12
  const totalInvested = sipAmount * n

  let nominalFutureValue = 0
  if (i === 0) {
    nominalFutureValue = totalInvested
  } else {
    nominalFutureValue = sipAmount * ((Math.pow(1 + i, n) - 1) / i)
  }

  const infRate = Number(inflationRate) / 100
  let inflationAdjustedValue = nominalFutureValue
  if (duration > 0) {
    inflationAdjustedValue = nominalFutureValue / Math.pow(1 + infRate, duration)
  }

  const futureValue = isInflationAdjusted ? inflationAdjustedValue : nominalFutureValue
  const wealthGained = Math.max(0, futureValue - totalInvested)
  const absoluteReturn = totalInvested > 0 ? (wealthGained / totalInvested) * 100 : 0
  const expectedReturn = isInflationAdjusted
    ? ((1 + annualReturn / 100) / (1 + infRate) - 1) * 100
    : annualReturn

  return {
    futureValue: Math.round(futureValue),
    nominalFutureValue: Math.round(nominalFutureValue),
    inflationAdjustedValue: Math.round(inflationAdjustedValue),
    totalInvested: Math.round(totalInvested),
    wealthGained: Math.round(wealthGained),
    absoluteReturn,
    expectedReturn,
    cagr: expectedReturn
  }
}

function calculateYearlyData(sipAmount, annualReturn, duration, isInflationAdjusted = false, inflationRate = 5) {
  const i = (annualReturn / 12) / 100
  const infRate = Number(inflationRate) / 100
  return Array.from({ length: duration }, (_, idx) => {
    const year = idx + 1
    const n = year * 12
    const invested = sipAmount * n
    let fv = 0
    if (i === 0) {
      fv = invested
    } else {
      fv = sipAmount * ((Math.pow(1 + i, n) - 1) / i)
    }
    if (isInflationAdjusted) {
      fv = fv / Math.pow(1 + infRate, year)
    }
    const gain = Math.max(0, fv - invested)
    const returnPct = invested > 0 ? (gain / invested) * 100 : 0
    return {
      year,
      invested: Math.round(invested),
      value: Math.round(fv),
      gain: Math.round(gain),
      returnPct
    }
  })
}

const DEFAULT_INPUTS = {
  sipAmount: 25000,
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
export default function SipCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)
  const [isInflationAdjusted, setIsInflationAdjusted] = useState(false)
  const [inflationRate, setInflationRate] = useState(5)

  const numSip = inputs.sipAmount === '' ? 0 : Number(inputs.sipAmount)
  const numReturn = inputs.annualReturn === '' ? 0 : Number(inputs.annualReturn)
  const numDuration = inputs.duration === '' ? 0 : Number(inputs.duration)
  const numInflation = inflationRate === '' ? 0 : Number(inflationRate)

  const results = useMemo(
    () => calculateSIP(numSip, numReturn, numDuration, isInflationAdjusted, numInflation),
    [numSip, numReturn, numDuration, isInflationAdjusted, numInflation]
  )

  const yearlyData = useMemo(
    () => calculateYearlyData(numSip, numReturn, numDuration, isInflationAdjusted, numInflation),
    [numSip, numReturn, numDuration, isInflationAdjusted, numInflation]
  )

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main className="pt-10">
        {/* Hero */}
        <SipHero />

        {/* Calculator Form */}
        <SipCalculatorForm
          inputs={inputs}
          setInputs={setInputs}
        />

        {/* Summary Cards with Inflation Control in Estimated Value card */}
        <SipSummaryCards
          results={results}
          isInflationAdjusted={isInflationAdjusted}
          setIsInflationAdjusted={setIsInflationAdjusted}
          inflationRate={inflationRate}
          setInflationRate={setInflationRate}
        />

        {/* Growth Chart */}
        <SipGrowthChart yearlyData={yearlyData} inputs={inputs} results={results} />

        {/* Projection Table - full width */}
        <SipProjectionTable yearlyData={yearlyData} />

        {/* Insights */}
        <div className="pt-6">
          <InvestmentInsights inputs={inputs} results={results} yearlyData={yearlyData} />
        </div>

        {/* Disclaimer */}
        <Disclaimer />

        {/* FAQ */}
        <SipFAQ />
      </main>

      <Footer />
    </div>
  )
}