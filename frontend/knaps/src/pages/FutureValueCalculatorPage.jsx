import { useMemo, useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FutureValueHero from '../components/FutureValueHero'
import FutureValueCalculatorForm from '../components/FutureValueCalculatorForm'
import FutureValueSummaryCards from '../components/FutureValueSummaryCards'
import FutureValueGrowthChart from '../components/FutureValueGrowthChart'
import FutureValueProjectionTable from '../components/FutureValueProjectionTable'
import InvestmentInsights from '../components/InvestmentInsights'
import FutureValueFAQ from '../components/FutureValueFAQ'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import {
  calculateRequiredInvestment,
  generateChartData
} from '../components/FutureValueCalculator/calculatorUtils'

const DEFAULT_INPUTS = {
  targetFutureValue: 10000000,
  annualReturn: 12,
  years: 15,
}

// Disclaimer matching SipCalculator and StepUpSipCalculator
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

export default function FutureValueCalculatorPage() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)
  const [isInflationAdjusted, setIsInflationAdjusted] = useState(false)
  const [inflationRate, setInflationRate] = useState(5)
  const frequency = 'monthly'
  const paymentTiming = 'end'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const resetDefaults = () => {
    setInputs(DEFAULT_INPUTS)
    setIsInflationAdjusted(false)
    setInflationRate(5)
  }

  const numTarget = inputs.targetFutureValue === '' ? 0 : Number(inputs.targetFutureValue)
  const numAnnual = inputs.annualReturn === '' ? 0 : Number(inputs.annualReturn)
  const numYears = inputs.years === '' ? 0 : Number(inputs.years)
  const numInflation = inflationRate === '' ? 0 : Number(inflationRate)

  // 100% exact calculation function for required monthly investment
  const results = useMemo(() => {
    return calculateRequiredInvestment({
      targetFv: numTarget,
      pv: 0,
      annualRate: numAnnual,
      years: numYears,
      frequency,
      timing: paymentTiming,
      isInflationAdjusted,
      inflationRate: numInflation
    })
  }, [numTarget, numAnnual, numYears, isInflationAdjusted, numInflation])

  // 100% exact chart data generator for required monthly investment
  const chartData = useMemo(() => {
    return generateChartData({
      calcMode: 'pmt',
      targetFv: numTarget,
      pv: 0,
      pmt: 0,
      annualRate: numAnnual,
      years: numYears,
      frequency,
      timing: paymentTiming,
      isInflationAdjusted,
      inflationRate: numInflation
    })
  }, [numTarget, numAnnual, numYears, isInflationAdjusted, numInflation])

  // Derive yearly data directly from chartData for projection table
  const yearlyData = useMemo(() => {
    const labels = chartData.labels || []
    return labels.slice(1).map((lbl, idx) => {
      const year = idx + 1
      const invested = chartData.investedData ? chartData.investedData[idx + 1] : 0
      const value = chartData.growthData ? chartData.growthData[idx + 1] : 0
      const gain = Math.max(0, value - invested)
      const returnPct = invested > 0 ? (gain / invested) * 100 : 0
      return {
        year,
        invested: Math.round(invested),
        value: Math.round(value),
        gain: Math.round(gain),
        returnPct
      }
    })
  }, [chartData])

  const insightsInputs = useMemo(() => ({
    sipAmount: results.requiredPmt || 0,
    annualReturn: numAnnual,
    duration: numYears
  }), [results.requiredPmt, numAnnual, numYears])

  const insightsResults = useMemo(() => ({
    totalInvested: results.totalInvested || 0,
    wealthGained: results.potentialGrowth || 0,
    futureValue: results.futureValue || 0,
    absoluteReturn: results.totalInvested > 0 ? ((results.potentialGrowth || 0) / results.totalInvested) * 100 : 0
  }), [results])

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main className="pt-2">
        {/* Hero */}
        <FutureValueHero />

        {/* Calculator Form */}
        <FutureValueCalculatorForm
          inputs={inputs}
          setInputs={setInputs}
          resetDefaults={resetDefaults}
        />

        {/* Summary Cards */}
        <FutureValueSummaryCards
          calcMode="pmt"
          results={results}
          isInflationAdjusted={isInflationAdjusted}
          setIsInflationAdjusted={setIsInflationAdjusted}
          inflationRate={inflationRate}
          setInflationRate={setInflationRate}
        />

        {/* Growth Chart */}
        <FutureValueGrowthChart chartData={chartData} />

        {/* Projection Table */}
        <FutureValueProjectionTable yearlyData={yearlyData} />

        {/* Insights */}
        <div className="pt-6">
          <InvestmentInsights inputs={insightsInputs} results={insightsResults} yearlyData={yearlyData} />
        </div>

        {/* Disclaimer */}
        <Disclaimer />

        {/* FAQ */}
        <FutureValueFAQ />
      </main>

      <Footer />
    </div>
  )
}
