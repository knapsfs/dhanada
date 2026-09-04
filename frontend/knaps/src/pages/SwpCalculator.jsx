import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SwpHero from '../components/SwpHero'
import SwpCalculatorForm from '../components/SwpCalculatorForm'
import SwpSummaryCards from '../components/SwpSummaryCards'
import SwpGrowthChart from '../components/SwpGrowthChart'
import SwpProjectionTable from '../components/SwpProjectionTable'
import SwpFAQ from '../components/SwpFAQ'
import Newsletter from '../components/Newsletter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

// SWP Calculation
// Uses effective monthly rate: (1 + annual_rate)^(1/12) - 1
function getEffectiveMonthlyRate(annualReturn) {
  return Math.pow(1 + annualReturn / 100, 1 / 12) - 1
}

function calculateSWP(totalInvestment, withdrawalPerMonth, annualReturn, duration) {
  const r = getEffectiveMonthlyRate(annualReturn)
  const n = duration * 12

  let finalValue
  if (r === 0) {
    finalValue = totalInvestment - (withdrawalPerMonth * n)
  } else {
    // FV = P * (1+r)^n - W * [ ((1+r)^n - 1) / r ]
    const pGrowth = totalInvestment * Math.pow(1 + r, n)
    const wDeduction = withdrawalPerMonth * ((Math.pow(1 + r, n) - 1) / r)
    finalValue = pGrowth - wDeduction
  }

  const totalWithdrawal = withdrawalPerMonth * n

  return {
    totalInvestment: Math.round(totalInvestment),
    totalWithdrawal: Math.round(totalWithdrawal),
    finalValue: Math.round(Math.max(0, finalValue)), // Don't show negative final value
  }
}

function calculateYearlyData(totalInvestment, withdrawalPerMonth, annualReturn, duration) {
  const r = getEffectiveMonthlyRate(annualReturn)

  const getFV = (months) => {
    if (r === 0) return totalInvestment - (withdrawalPerMonth * months)
    const pGrowth = totalInvestment * Math.pow(1 + r, months)
    const wDeduction = withdrawalPerMonth * ((Math.pow(1 + r, months) - 1) / r)
    return pGrowth - wDeduction
  }

  const yearlyData = []
  let cumulativeWithdrawals = 0

  for (let year = 1; year <= duration; year++) {
    const openingBalance = year === 1 ? totalInvestment : Math.max(0, getFV((year - 1) * 12))

    // If opening balance is 0, the fund is depleted
    if (openingBalance <= 0) {
      yearlyData.push({
        year,
        openingBalance: 0,
        totalWithdrawals: 0,
        cumulativeWithdrawals: Math.round(cumulativeWithdrawals),
        interestEarned: 0,
        closingBalance: 0
      })
      continue
    }

    let closingBalance = getFV(year * 12)
    let actualWithdrawal = withdrawalPerMonth * 12

    if (closingBalance < 0) {
      // Adjust last year's withdrawal if fund depletes
      actualWithdrawal = Math.max(0, openingBalance + (openingBalance * Math.pow(1 + r, 12) - openingBalance))
      closingBalance = 0
    }

    cumulativeWithdrawals += actualWithdrawal
    const interestEarned = Math.max(0, closingBalance - openingBalance + actualWithdrawal)

    yearlyData.push({
      year,
      openingBalance: Math.round(openingBalance),
      totalWithdrawals: Math.round(actualWithdrawal),
      cumulativeWithdrawals: Math.round(cumulativeWithdrawals),
      interestEarned: Math.round(interestEarned),
      closingBalance: Math.round(Math.max(0, closingBalance))
    })
  }

  return yearlyData
}

const DEFAULT_INPUTS = {
  totalInvestment: 500000,
  withdrawalPerMonth: 10000,
  annualReturn: 8,
  duration: 5,
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
            <p className="text-xs text-gray-500 font-medium leading-relaxed">The calculations provided are illustrative in nature and based on mathematical compounding and your inputs. Actual investment returns are subject to market risks and will depend on fund performance, asset allocation, and market conditions. Please consult a qualified financial advisor before making investment decisions.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Main Page
export default function SwpCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)

  const numInvestment = inputs.totalInvestment === '' ? 0 : Number(inputs.totalInvestment)
  const numWithdrawal = inputs.withdrawalPerMonth === '' ? 0 : Number(inputs.withdrawalPerMonth)
  const numReturn = inputs.annualReturn === '' ? 0 : Number(inputs.annualReturn)
  const numDuration = inputs.duration === '' ? 0 : Number(inputs.duration)

  const results = useMemo(
    () => calculateSWP(numInvestment, numWithdrawal, numReturn, numDuration),
    [numInvestment, numWithdrawal, numReturn, numDuration]
  )

  const yearlyData = useMemo(
    () => calculateYearlyData(numInvestment, numWithdrawal, numReturn, numDuration),
    [numInvestment, numWithdrawal, numReturn, numDuration]
  )

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      <main className="pt-10">
        {/* Hero */}
        <SwpHero />

        {/* Calculator Form */}
        <SwpCalculatorForm inputs={inputs} setInputs={setInputs} />

        {/* Summary Cards */}
        <SwpSummaryCards results={results} />

        {/* Growth Chart */}
        <SwpGrowthChart yearlyData={yearlyData} results={results} />

        {/* Projection Table - full width */}
        <SwpProjectionTable yearlyData={yearlyData} />

        {/* Disclaimer */}
        <Disclaimer />

        {/* FAQ */}
        <SwpFAQ />

        {/* Newsletter */}
        {/* <Newsletter /> */}
      </main>

      <Footer />
    </div>
  )
}