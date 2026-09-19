import { useMemo, useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CTA from '../components/CTA'
import SipLumpsumHero from '../components/SipLumpsumHero'
import SipLumpsumCalculatorForm from '../components/SipLumpsumCalculatorForm'
import SipLumpsumSummaryCards from '../components/SipLumpsumSummaryCards'
import SipLumpsumGrowthChart from '../components/SipLumpsumGrowthChart'
import SipLumpsumProjectionTable from '../components/SipLumpsumProjectionTable'
import InvestmentInsights from '../components/InvestmentInsights'
import SipLumpsumFAQ from '../components/SipLumpsumFAQ'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

function calculateSipLumpsum(initialInvestment, sipAmount, duration, annualReturn, isInflationAdjusted = false, inflationRate = 5) {
  const pv = Number(initialInvestment) || 0
  const pmt = Number(sipAmount) || 0
  const years = Number(duration) || 0
  const r = (Number(annualReturn) || 0) / 100
  const n = years * 12
  const i = r / 12

  const totalInvested = pv + (pmt * n)

  // Nominal Future Value
  const fvLump = pv * Math.pow(1 + i, n)
  let fvSip = 0
  if (i === 0) {
    fvSip = pmt * n
  } else {
    fvSip = pmt * ((Math.pow(1 + i, n) - 1) / i)
  }
  const nominalFutureValue = fvLump + fvSip

  // Fisher Real Rate of Return for Inflation Adjustment
  const infRate = (Number(inflationRate) || 0) / 100
  const rReal = (1 + r) / (1 + infRate) - 1
  const iReal = Math.pow(1 + rReal, 1 / 12) - 1

  let inflationAdjustedValue = nominalFutureValue
  if (years > 0) {
    const fvLumpReal = pv * Math.pow(1 + iReal, n)
    let fvSipReal = 0
    if (iReal === 0) {
      fvSipReal = pmt * n
    } else {
      fvSipReal = pmt * ((Math.pow(1 + iReal, n) - 1) / iReal)
    }
    inflationAdjustedValue = fvLumpReal + fvSipReal
  }

  // Gains do NOT change as per inflation
  const wealthGained = Math.max(0, nominalFutureValue - totalInvested)
  const absoluteReturn = totalInvested > 0 ? (wealthGained / totalInvested) * 100 : 0

  return {
    totalInvested: Math.round(totalInvested),
    futureValue: Math.round(nominalFutureValue),
    nominalFutureValue: Math.round(nominalFutureValue),
    inflationAdjustedValue: Math.round(inflationAdjustedValue),
    wealthGained: Math.round(wealthGained),
    absoluteReturn
  }
}

// Gains and graph do not change as per inflation
function calculateYearlyData(initialInvestment, sipAmount, duration, annualReturn) {
  const pv = Number(initialInvestment) || 0
  const pmt = Number(sipAmount) || 0
  const years = Number(duration) || 0
  const r = (Number(annualReturn) || 0) / 100
  const i = r / 12

  return Array.from({ length: years }, (_, idx) => {
    const year = idx + 1
    const n = year * 12
    const invested = pv + (pmt * n)

    const fvLump = pv * Math.pow(1 + i, n)
    let fvSip = 0
    if (i === 0) {
      fvSip = pmt * n
    } else {
      fvSip = pmt * ((Math.pow(1 + i, n) - 1) / i)
    }
    const fv = fvLump + fvSip
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
  initialInvestment: 100000,
  sipAmount: 25000,
  duration: 15,
  annualReturn: 12,
}

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

export default function SipLumpsumCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)
  const [isInflationAdjusted, setIsInflationAdjusted] = useState(false)
  const [inflationRate, setInflationRate] = useState(5)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const results = useMemo(
    () => calculateSipLumpsum(
      inputs.initialInvestment,
      inputs.sipAmount,
      inputs.duration,
      inputs.annualReturn,
      isInflationAdjusted,
      inflationRate
    ),
    [inputs.initialInvestment, inputs.sipAmount, inputs.duration, inputs.annualReturn, isInflationAdjusted, inflationRate]
  )

  const yearlyData = useMemo(
    () => calculateYearlyData(
      inputs.initialInvestment,
      inputs.sipAmount,
      inputs.duration,
      inputs.annualReturn
    ),
    [inputs.initialInvestment, inputs.sipAmount, inputs.duration, inputs.annualReturn]
  )

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main>
        <SipLumpsumHero />

        <SipLumpsumCalculatorForm
          inputs={inputs}
          setInputs={setInputs}
        />

        <SipLumpsumSummaryCards
          results={results}
          isInflationAdjusted={isInflationAdjusted}
          setIsInflationAdjusted={setIsInflationAdjusted}
          inflationRate={inflationRate}
          setInflationRate={setInflationRate}
        />

        <SipLumpsumGrowthChart
          yearlyData={yearlyData}
        />

        <SipLumpsumProjectionTable
          yearlyData={yearlyData}
        />

        <div className="pt-6">
          <InvestmentInsights
            inputs={inputs}
            results={results}
            yearlyData={yearlyData}
          />
        </div>

        <SipLumpsumFAQ />

        <Disclaimer />

        <CTA />
      </main>

      <Footer />
    </div>
  )
}
