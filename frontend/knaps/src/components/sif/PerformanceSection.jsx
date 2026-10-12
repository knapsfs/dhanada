import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import PlanSelector from './PlanSelector'
import { cleanNavHistory, getAvailableGraphPeriods, getTargetDateForPeriod } from '../../utils/performance'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function PerformanceSection({ fund, planSelectorProps }) {
  const [activePeriod, setActivePeriod] = useState('')
  const { ref, inView } = useInView({ triggerOnce: true })

  // Clean, parse, and chronologically sort historical NAV records
  const cleanHistory = useMemo(() => {
    const rawList = Array.isArray(fund?.historicalNav)
      ? fund.historicalNav
      : Array.isArray(fund?.historical_nav)
        ? fund.historical_nav
        : []
    return cleanNavHistory(rawList)
  }, [fund?.historicalNav, fund?.historical_nav])

  // Calculate dynamic period availability from the actual historical dataset span and valid performance data
  const availablePeriods = useMemo(() => {
    return getAvailableGraphPeriods(cleanHistory, fund?.performanceData)
  }, [cleanHistory, fund?.performanceData])

  // Automatically update active period selection based on availability
  useEffect(() => {
    if (availablePeriods.length > 0) {
      if (!activePeriod || !availablePeriods.includes(activePeriod)) {
        // Select the longest sensible/default period currently available
        setActivePeriod(availablePeriods[availablePeriods.length - 1])
      }
    } else {
      setActivePeriod('')
    }
  }, [availablePeriods, activePeriod])

  // Top-Right return display corresponding to the currently active period
  const activeReturnInfo = useMemo(() => {
    if (!activePeriod || !fund?.performanceData) {
      return { periodLabel: activePeriod ? `${activePeriod} Return` : 'Return', formatted: 'N/A', isPositive: true, hasValue: false }
    }

    const perf = fund.performanceData
    let rawVal = null
    let periodLabel = `${activePeriod} Return`

    switch (activePeriod) {
      case '1W':
        rawVal = perf['1_week']
        periodLabel = '1W Return'
        break
      case '1M':
        rawVal = perf['1_month']
        periodLabel = '1M Return'
        break
      case '3M':
        rawVal = perf['3_months'] ?? perf['3_month']
        periodLabel = '3M Return'
        break
      case '6M':
        rawVal = perf['6_months'] ?? perf['6_month']
        periodLabel = '6M Return'
        break
      case '1Y':
        rawVal = perf['1_year']
        periodLabel = '1Y Return'
        break
      case '3Y':
        rawVal = perf['3_years'] ?? perf['3_year']
        periodLabel = '3Y Return'
        break
      case '5Y':
        rawVal = perf['5_years'] ?? perf['5_year']
        periodLabel = '5Y Return'
        break
      case 'Since Inception':
      case 'Since Launch':
        rawVal = perf['since_inception'] ?? perf['since_launch']
        if ((rawVal == null || rawVal === 'N/A' || isNaN(Number(rawVal))) && cleanHistory && cleanHistory.length >= 2) {
          const firstNav = cleanHistory[0].nav
          const latestNav = cleanHistory[cleanHistory.length - 1].nav
          if (firstNav > 0 && latestNav > 0) {
            rawVal = ((latestNav - firstNav) / firstNav) * 100
          }
        }
        periodLabel = 'Since Inception'
        break
      default:
        rawVal = null
    }

    // Match exact format with performance table if available
    if (Array.isArray(fund?.performanceTable)) {
      const tablePeriodMap = {
        '1W': '1 Week',
        '1M': '1 Month',
        '3M': '3 Months',
        '6M': '6 Months',
        '1Y': '1 Year',
        '3Y': '3 Years',
        '5Y': '5 Years',
        'Since Inception': 'Since Inception',
        'Since Launch': 'Since Inception',
      }
      const targetTableLabel = tablePeriodMap[activePeriod]
      const tableRow = fund.performanceTable.find(r => r.period === targetTableLabel)
      if (tableRow && tableRow.fund && tableRow.fund !== 'N/A') {
        const parsedNum = parseFloat(String(tableRow.fund).replace('%', ''))
        if (!isNaN(parsedNum)) {
          rawVal = parsedNum
        }
      }
    }

    if (rawVal == null || rawVal === 'N/A' || isNaN(Number(rawVal))) {
      return {
        periodLabel,
        formatted: 'N/A',
        isPositive: true,
        hasValue: false,
      }
    }

    const num = Number(rawVal)
    const formatted = `${num > 0 ? '+' : ''}${num.toFixed(2)}%`
    return {
      periodLabel,
      formatted,
      isPositive: num >= 0,
      hasValue: true,
    }
  }, [activePeriod, fund?.performanceData, fund?.performanceTable, cleanHistory])

  // Filter time-series data for the currently active period
  const currentChartPoints = useMemo(() => {
    if (!cleanHistory || cleanHistory.length === 0 || !activePeriod) {
      return []
    }

    const maxDate = cleanHistory[cleanHistory.length - 1].date
    const cutoffDate = (activePeriod === 'Since Inception' || activePeriod === 'Since Launch')
      ? cleanHistory[0].date
      : (getTargetDateForPeriod(activePeriod, maxDate) || cleanHistory[0].date)

    return cleanHistory.filter(p => p.date >= cutoffDate)
  }, [cleanHistory, activePeriod])

  const hasChartData = currentChartPoints && currentChartPoints.length > 0

  const chartData = useMemo(() => {
    if (!hasChartData) return null

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const labels = currentChartPoints.map(p => {
      const day = p.date.getUTCDate()
      const m = months[p.date.getUTCMonth()]
      const y = p.date.getUTCFullYear()
      if (activePeriod === '1W' || activePeriod === '1M') {
        return `${day} ${m}`
      }
      return `${day} ${m} ${y}`
    })

    const navs = currentChartPoints.map(p => p.nav)

    return {
      labels,
      datasets: [
        {
          label: fund?.name || 'NAV',
          data: navs,
          borderColor: '#032e92',
          backgroundColor: 'rgba(3, 46, 146, 0.08)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.3,
          pointRadius: activePeriod === '1W' ? 3 : 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#032e92',
        },
      ],
    }
  }, [hasChartData, currentChartPoints, activePeriod, fund?.name])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          font: { family: 'Poppins', size: 12, weight: '600' },
          padding: 20,
          color: '#64748b',
        },
      },
      tooltip: {
        backgroundColor: '#fff',
        borderColor: '#e8edf7',
        borderWidth: 1,
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        bodyFont: { family: 'Poppins', size: 12 },
        titleFont: { family: 'Poppins', size: 12, weight: '700' },
        padding: 12,
        callbacks: {
          label: ctx => ` NAV: ₹${typeof ctx.raw === 'number' ? ctx.raw.toFixed(4) : ctx.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Poppins', size: 11 },
          color: '#94a3b8',
          maxTicksLimit: 8,
        },
        border: { display: false },
      },
      y: {
        grid: { color: '#f1f5f9', drawBorder: false },
        ticks: {
          font: { family: 'Poppins', size: 11 },
          color: '#94a3b8',
          callback: val => `₹${typeof val === 'number' ? val.toFixed(2) : val}`,
        },
        border: { display: false, dash: [4, 4] },
      },
    },
  }

  return (
    <section id="performance" className="scroll-mt-32">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8">

        {/* Section Header with Title & Top-Right Return Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="text-green-600 text-sm" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Performance</h2>
          </div>

          {activeReturnInfo && activeReturnInfo.hasValue && (
            <div className="flex items-center gap-2.5 bg-[#f7f9fc] border border-[#e8edf7] px-4 py-2 rounded-2xl self-start sm:self-auto shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {activeReturnInfo.periodLabel}
              </span>
              <span className={`text-base font-bold font-mono ${
                activeReturnInfo.isPositive ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {activeReturnInfo.formatted}
              </span>
            </div>
          )}
        </div>

        {planSelectorProps && (
          <PlanSelector {...planSelectorProps} fund={fund} className="mb-6 bg-gray-50" />
        )}

        {/* Dynamic Period Tabs */}
        {availablePeriods.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-6">
            {availablePeriods.map(p => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activePeriod === p
                    ? 'bg-[#032e92] text-white shadow-md shadow-blue-900/20'
                    : 'bg-[#f7f9fc] text-gray-500 border border-[#e8edf7] hover:border-[#032e92]/40 hover:text-[#032e92]'
                }`}>
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Chart */}
        {hasChartData ? (
          <div className="h-64 md:h-80 mb-8">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="h-64 md:h-80 mb-8 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-gray-400 font-medium text-sm">Time-series chart data is currently unavailable.</p>
          </div>
        )}

        {/* Performance Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#e8edf7] mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f7f9fc]">
                {['Period', 'Fund Return', 'Benchmark', 'Category Avg.', 'Difference'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8edf7]">
              {(fund?.performanceTable || []).map((row, i) => (
                <tr key={i} className="hover:bg-[#f7f9fc] transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{row.period}</td>
                  <td className="px-4 py-3 font-bold text-green-600 whitespace-nowrap">{row.fund}</td>
                  <td className="px-4 py-3 font-medium text-gray-600 whitespace-nowrap">{row.benchmark}</td>
                  <td className="px-4 py-3 font-medium text-gray-600 whitespace-nowrap">{row.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      row.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{row.diff}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  )
}
