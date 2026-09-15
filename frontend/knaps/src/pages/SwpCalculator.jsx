import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SwpHero from '../components/SwpHero'
import SwpCalculatorForm from '../components/SwpCalculatorForm'
import SwpSummaryCards from '../components/SwpSummaryCards'
import SwpGrowthChart from '../components/SwpGrowthChart'
import SwpProjectionTable from '../components/SwpProjectionTable'
import SwpFAQ from '../components/SwpFAQ'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

// SWP Calculation
// Uses effective monthly rate: (1 + annual_rate)^(1/12) - 1
function getEffectiveMonthlyRate(annualReturn) {
  return annualReturn > 0 ? Math.pow(1 + annualReturn / 100, 1 / 12) - 1 : 0
}

function simulateSWP(totalInvestment, withdrawalPerMonth, annualReturn, duration) {
  const inv = Math.max(0, Number(totalInvestment) || 0)
  const w = Math.max(0, Number(withdrawalPerMonth) || 0)
  const ret = Math.max(0, Number(annualReturn) || 0)
  const dur = Math.max(0, Number(duration) || 0)

  if (dur <= 0 || inv <= 0) {
    return {
      results: {
        totalInvestment: Math.round(inv),
        totalWithdrawal: 0,
        finalValue: Math.round(inv),
      },
      yearlyData: [],
    }
  }

  const r = getEffectiveMonthlyRate(ret)
  const totalMonths = Math.round(dur * 12)

  let balance = inv
  let totalWithdrawn = 0
  const yearlyData = []

  let yearOpeningBalance = balance
  let currentYearWithdrawals = 0
  let currentYearInterest = 0

  for (let m = 1; m <= totalMonths; m++) {
    if ((m - 1) % 12 === 0) {
      yearOpeningBalance = balance
      currentYearWithdrawals = 0
      currentYearInterest = 0
    }

    const interest = balance > 0 && r > 0 ? balance * r : 0
    currentYearInterest += interest
    balance += interest

    // If balance is exhausted, no further withdrawals can occur
    const actualWithdrawal = balance > 0 ? Math.min(balance, w) : 0
    balance -= actualWithdrawal
    currentYearWithdrawals += actualWithdrawal
    totalWithdrawn += actualWithdrawal

    if (balance < 0.000001) {
      balance = 0
    }

    if (m % 12 === 0 || (m === totalMonths && m % 12 !== 0)) {
      const year = m % 12 === 0 ? m / 12 : Number((m / 12).toFixed(1))
      yearlyData.push({
        year,
        openingBalance: Math.round(yearOpeningBalance),
        totalWithdrawals: Math.round(currentYearWithdrawals),
        cumulativeWithdrawals: Math.round(totalWithdrawn),
        interestEarned: Math.round(currentYearInterest),
        closingBalance: Math.round(balance),
      })
    }
  }

  return {
    results: {
      totalInvestment: Math.round(inv),
      totalWithdrawal: Math.round(totalWithdrawn),
      finalValue: Math.round(balance),
    },
    yearlyData,
  }
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

  const { results, yearlyData } = useMemo(
    () => simulateSWP(numInvestment, numWithdrawal, numReturn, numDuration),
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
      </main>

      <Footer />
    </div>
  )
}
