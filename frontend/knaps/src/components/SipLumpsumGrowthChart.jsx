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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const fmt = (n) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

export default function SipLumpsumGrowthChart({ yearlyData }) {
  const { ref, inView } = useInView({ triggerOnce: true })

  const labels = yearlyData.map(d => `Y${d.year}`)
  const investedArr = yearlyData.map(d => Math.round(d.invested))
  const valueArr = yearlyData.map(d => Math.round(d.value))

  const data = {
    labels,
    datasets: [
      {
        label: 'Invested Amount',
        data: investedArr,
        borderColor: '#94a3b8',
        backgroundColor: 'rgba(148,163,184,0.08)',
        borderWidth: 2,
        borderDash: [5, 4],
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#94a3b8',
        pointHoverRadius: 6,
      },
      {
        label: 'Projected Value',
        data: valueArr,
        borderColor: '#032e92',
        backgroundColor: (ctx) => {
          const chart = ctx.chart
          const { ctx: c, chartArea } = chart
          if (!chartArea) return 'rgba(3,46,146,0.1)'
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, 'rgba(3,46,146,0.22)')
          gradient.addColorStop(1, 'rgba(3,46,146,0.01)')
          return gradient
        },
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#032e92',
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#032e92',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        itemSort: (a, b) => b.datasetIndex - a.datasetIndex,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        callbacks: {
          label: (item) => ` ${item.dataset.label}: ${fmt(item.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, weight: '500' }, color: '#94a3b8' },
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: {
          callback: (v) => fmt(v),
          font: { size: 10, weight: '500' },
          color: '#94a3b8',
          maxTicksLimit: 6,
        },
      },
    },
  }

  return (
    <section className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl border border-[#e8edf7] shadow-lg shadow-blue-900/5 p-6 lg:p-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#e8edf7]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#eef4ff] flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="text-[#032e92] text-sm" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Projected Wealth Trajectory</h2>
                <p className="text-xs text-gray-400">Total invested vs compounding future value over time</p>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#032e92] inline-block"></span>
                Projected Value
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#94a3b8] inline-block"></span>
                Invested Amount
              </div>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-72 sm:h-80 lg:h-96 w-full">
            <Line data={data} options={options} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
