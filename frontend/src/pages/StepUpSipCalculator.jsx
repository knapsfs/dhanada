import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StepUpSipHero from '../components/StepUpSipHero'
import StepUpSipCalculatorForm from '../components/StepUpSipCalculatorForm'
import StepUpSipSummaryCards from '../components/StepUpSipSummaryCards'
import StepUpSipGrowthChart from '../components/StepUpSipGrowthChart'
import StepUpSipProjectionTable from '../components/StepUpSipProjectionTable'
import RecommendedFunds from '../components/RecommendedFunds'
import StepUpSipFAQ from '../components/StepUpSipFAQ'
import Newsletter from '../components/Newsletter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

// Step Up SIP Calculation
function calculateStepUpSip(monthlyInvestment, stepUp, stepUpType = 'percentage', annualReturn, duration, isInflationAdjusted = false) {
  const i = (annualReturn / 12) / 100
  let totalInvested = 0
  let futureValue = 0

  for (let y = 1; y <= duration; y++) {
    // Calculate monthly investment for year y
    let py = monthlyInvestment
    if (stepUpType === 'amount') {
      py = monthlyInvestment + (y - 1) * stepUp
    } else {
      py = monthlyInvestment * Math.pow(1 + stepUp / 100, y - 1)
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

    futureValue += fvy
  }

  if (isInflationAdjusted && duration > 0) {
    futureValue = futureValue / Math.pow(1 + 0.05, duration)
  }

  const wealthGained = Math.max(0, futureValue - totalInvested)

  return {
    totalInvested: Math.round(totalInvested),
    wealthGained: Math.round(wealthGained),
    futureValue: Math.round(futureValue)
  }
}

function calculateYearlyData(monthlyInvestment, stepUp, stepUpType = 'percentage', annualReturn, duration, isInflationAdjusted = false) {
  const i = (annualReturn / 12) / 100
  const yearlyData = []

  let cumulativeInvested = 0

  for (let k = 1; k <= duration; k++) {
    // Current year monthly SIP
    let currentYearSip = monthlyInvestment
    if (stepUpType === 'amount') {
      currentYearSip = monthlyInvestment + (k - 1) * stepUp
    } else {
      currentYearSip = monthlyInvestment * Math.pow(1 + stepUp / 100, k - 1)
    }

    cumulativeInvested += currentYearSip * 12

    // Calculate value at end of year k
    let endOfYearValue = 0
    for (let y = 1; y <= k; y++) {
      let py = monthlyInvestment
      if (stepUpType === 'amount') {
        py = monthlyInvestment + (y - 1) * stepUp
      } else {
        py = monthlyInvestment * Math.pow(1 + stepUp / 100, y - 1)
      }

      const months_left = 12 * (k - y)
      let fvy = 0
      if (i === 0) {
        fvy = py * 12
      } else {
        fvy = py * ((Math.pow(1 + i, 12) - 1) / i) * Math.pow(1 + i, months_left)
      }
      endOfYearValue += fvy
    }

    if (isInflationAdjusted) {
      endOfYearValue = endOfYearValue / Math.pow(1 + 0.05, k)
    }

    const gain = Math.max(0, endOfYearValue - cumulativeInvested)

    yearlyData.push({
      year: k,
      monthlySip: Math.round(currentYearSip),
      invested: Math.round(cumulativeInvested),
      value: Math.round(endOfYearValue),
      gain: Math.round(gain)
    })
  }

  return yearlyData
}

const DEFAULT_INPUTS = {
  monthlyInvestment: 25000,
  stepUpType: 'percentage',
  stepUp: 10,
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
              The fund options shown for Step Up SIP on sMuse are illustrative and based on public information from AMCs and other third-party sources. We have not independently verified this information and it does not constitute investment, tax, legal, or financial advice or an offer to invest in any financial product. We are not advisors, distributors, or brokers. Before investing, review the official AMC documents and consult a qualified advisor. sMuse disclaims all liability for any loss arising from reliance on this information. Investment in Mutual Funds and Specialised Investment Funds (SIFs) are subject to market risks. Please read all scheme-related information before investing.
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

  const numMonthly = inputs.monthlyInvestment === '' ? 0 : Number(inputs.monthlyInvestment)
  const numStepUp = inputs.stepUp === '' ? 0 : Number(inputs.stepUp)
  const numReturn = inputs.annualReturn === '' ? 0 : Number(inputs.annualReturn)
  const numDuration = inputs.duration === '' ? 0 : Number(inputs.duration)

  const results = useMemo(
    () => calculateStepUpSip(numMonthly, numStepUp, inputs.stepUpType, numReturn, numDuration, isInflationAdjusted),
    [numMonthly, numStepUp, inputs.stepUpType, numReturn, numDuration, isInflationAdjusted]
  )

  const yearlyData = useMemo(
    () => calculateYearlyData(numMonthly, numStepUp, inputs.stepUpType, numReturn, numDuration, isInflationAdjusted),
    [numMonthly, numStepUp, inputs.stepUpType, numReturn, numDuration, isInflationAdjusted]
  )

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main>
        {/* Hero */}
        <StepUpSipHero />

        {/* Calculator Form */}
        <StepUpSipCalculatorForm
          inputs={inputs}
          setInputs={setInputs}
          isInflationAdjusted={isInflationAdjusted}
          setIsInflationAdjusted={setIsInflationAdjusted}
        />

        {/* Summary Cards */}
        <StepUpSipSummaryCards results={results} />

        {/* Growth Chart */}
        <StepUpSipGrowthChart yearlyData={yearlyData} results={results} />

        {/* Projection Table - full width */}
        <StepUpSipProjectionTable yearlyData={yearlyData} />

        {/* Recommended Funds */}
        <div className="pt-6">
          <RecommendedFunds inputs={inputs} />
        </div>

        {/* Disclaimer */}
        <Disclaimer />

        {/* FAQ */}
        <StepUpSipFAQ />

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}