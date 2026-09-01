import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LumpsumHero from '../components/LumpsumHero'
import LumpsumCalculatorForm from '../components/LumpsumCalculatorForm'
import LumpsumSummaryCards from '../components/LumpsumSummaryCards'
import LumpsumGrowthChart from '../components/LumpsumGrowthChart'
import LumpsumProjectionTable from '../components/LumpsumProjectionTable'
import RecommendedFunds from '../components/RecommendedFunds'
import LumpsumFAQ from '../components/LumpsumFAQ'
import Newsletter from '../components/Newsletter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

// Lumpsum Calculation
function calculateLumpsum(totalInvestment, annualReturn, duration, isInflationAdjusted = false) {
  const r = annualReturn / 100
  const n = duration

  let futureValue = totalInvestment * Math.pow(1 + r, n)

  if (isInflationAdjusted && duration > 0) {
    futureValue = futureValue / Math.pow(1 + 0.05, duration)
  }

  const wealthGained = Math.max(0, futureValue - totalInvestment)

  return {
    totalInvested: Math.round(totalInvestment),
    wealthGained: Math.round(wealthGained),
    futureValue: Math.round(futureValue)
  }
}

function calculateYearlyData(totalInvestment, annualReturn, duration, isInflationAdjusted = false) {
  const r = annualReturn / 100

  return Array.from({ length: duration }, (_, i) => {
    const year = i + 1
    let value = totalInvestment * Math.pow(1 + r, year)

    if (isInflationAdjusted) {
      value = value / Math.pow(1 + 0.05, year)
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
              The fund options shown for Lumpsum investment on sMuse are illustrative and based on public information from AMCs and other third-party sources. We have not independently verified this information and it does not constitute investment, tax, legal, or financial advice or an offer to invest in any financial product. We are not advisors, distributors, or brokers. Before investing, review the official AMC documents and consult a qualified advisor. sMuse disclaims all liability for any loss arising from reliance on this information. Investment in Mutual Funds and Specialised Investment Funds (SIFs) are subject to market risks. Please read all scheme-related information before investing.
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

  const numInvestment = inputs.totalInvestment === '' ? 0 : Number(inputs.totalInvestment)
  const numReturn = inputs.annualReturn === '' ? 0 : Number(inputs.annualReturn)
  const numDuration = inputs.duration === '' ? 0 : Number(inputs.duration)

  const results = useMemo(
    () => calculateLumpsum(numInvestment, numReturn, numDuration, isInflationAdjusted),
    [numInvestment, numReturn, numDuration, isInflationAdjusted]
  )

  const yearlyData = useMemo(
    () => calculateYearlyData(numInvestment, numReturn, numDuration, isInflationAdjusted),
    [numInvestment, numReturn, numDuration, isInflationAdjusted]
  )

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main>
        {/* Hero */}
        <LumpsumHero />

        {/* Calculator Form */}
        <LumpsumCalculatorForm
          inputs={inputs}
          setInputs={setInputs}
          isInflationAdjusted={isInflationAdjusted}
          setIsInflationAdjusted={setIsInflationAdjusted}
        />

        {/* Summary Cards */}
        <LumpsumSummaryCards results={results} />

        {/* Growth Chart */}
        <LumpsumGrowthChart yearlyData={yearlyData} results={results} />

        {/* Projection Table - full width */}
        <LumpsumProjectionTable yearlyData={yearlyData} />

        {/* Recommended Funds */}
        <div className="pt-6">
          <RecommendedFunds inputs={inputs} />
        </div>

        {/* Disclaimer */}
        <Disclaimer />

        {/* FAQ */}
        <LumpsumFAQ />

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}