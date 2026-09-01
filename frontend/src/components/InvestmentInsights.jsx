import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLightbulb, faArrowTrendUp, faCoins, faCircleCheck,
  faPiggyBank, faBullseye, faPercent
} from '@fortawesome/free-solid-svg-icons'

const fmt = (n) => {
  if (n == null || isNaN(n)) return '₹0'
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

// How many months to reach 1 Crore
function monthsToTarget(monthly, monthlyRate, target) {
  if (!monthly || monthly <= 0) return null
  if (monthlyRate === 0) return target / monthly
  let months = 1
  while (months < 1200) {
    const fv = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
    if (fv >= target) return months
    months++
  }
  return null
}

// Rule of 72 - approximate doubling years
function doublingYears(rate) {
  if (!rate || rate <= 0) return 'N/A'
  return (72 / rate).toFixed(1)
}

export default function InvestmentInsights({ inputs, results }) {
  const { ref, inView } = useInView({ triggerOnce: true })

  const sipAmount = inputs.sipAmount === '' ? 0 : Number(inputs.sipAmount)
  const annualReturn = inputs.annualReturn === '' ? 0 : Number(inputs.annualReturn)
  const duration = inputs.duration === '' ? 0 : Number(inputs.duration)

  const totalInvested = results.totalInvested || 0
  const wealthGained = results.wealthGained || 0
  const futureValue = results.futureValue || 0
  const absoluteReturn = results.absoluteReturn != null ? results.absoluteReturn : (totalInvested > 0 ? (wealthGained / totalInvested) * 100 : 0)

  const monthlyRate = annualReturn / 12 / 100
  const doubling = doublingYears(annualReturn)
  const monthsFor1Cr = monthsToTarget(sipAmount, monthlyRate, 10000000)
  const for1Cr = monthsFor1Cr ? `${(monthsFor1Cr / 12).toFixed(1)} years (₹${Math.round(sipAmount * monthsFor1Cr).toLocaleString('en-IN')} invested)` : 'More than 100 years'
  const avgAnnualGrowth = duration > 0 && totalInvested > 0 ? (Math.pow(futureValue / totalInvested, 1 / duration) - 1) : 0

  const insights = [
    {
      icon: faPiggyBank,
      color: 'text-[#032e92]',
      bg: 'bg-[#eef4ff]',
      title: 'Doubling Rule',
      text: annualReturn > 0
        ? `At ${annualReturn}% annual return, your investment doubles approximately every ${doubling} years (Rule of 72).`
        : `Enter expected annual return to see doubling timeline.`,
    },
    {
      icon: faArrowTrendUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      title: 'Wealth Created',
      text: `You earn ${fmt(wealthGained)} as net profit on total investment of ${fmt(totalInvested)} - that's a ${absoluteReturn.toFixed(1)}% absolute gain.`,
    },
    {
      icon: faPercent,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      title: 'Annual Wealth Growth',
      text: `Your average annual portfolio growth rate over ${duration} years is ${(avgAnnualGrowth * 100).toFixed(1)}% CAGR.`,
    },
    {
      icon: faBullseye,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      title: 'Path to ₹1 Crore',
      text: monthsFor1Cr && monthsFor1Cr / 12 <= 100
        ? `With ₹${sipAmount.toLocaleString('en-IN')}/mo at ${annualReturn}%, you reach ₹1 Crore in ${for1Cr}.`
        : `Increase your SIP or return rate to reach ₹1 Crore within a reasonable timeframe.`,
    },
    {
      icon: faCircleCheck,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      title: 'Compounding Power',
      text: `${duration > 10 && totalInvested > 0 ? `Over ${duration} years, compounding generates ${(wealthGained / totalInvested * 100).toFixed(0)}% extra returns above your invested capital.` : `Extend your investment horizon beyond 10 years to harness the full power of compounding.`}`,
    },
    {
      icon: faCoins,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      title: 'Monthly Equivalent',
      text: `Your current corpus of ${fmt(futureValue)} is equivalent to ${fmt(futureValue / 12)}/month of passive income at 1% monthly withdrawal rate.`,
    },
  ]

  return (
    <section className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8">

          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <FontAwesomeIcon icon={faLightbulb} className="text-amber-600 text-sm" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Investment Insights</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="flex items-start gap-3 bg-[#f7f9fc] rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <FontAwesomeIcon icon={item.icon} className={`${item.color} text-sm`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700 mb-0.5">{item.title}</p>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
