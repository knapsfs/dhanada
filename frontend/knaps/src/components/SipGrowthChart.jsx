import { useRef } from 'react'
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

export default function SipGrowthChart({ yearlyData, inputs, results }) {
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
        boxPadding: 4,
        cornerRadius: 12,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${fmt(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11, weight: '600' } },
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: {
          color: '#94a3b8',
          font: { size: 11, weight: '600' },
          callback: (v) => fmt(v),
        },
      },
    },
  }

  return (
    <section ref={ref} className="bg-[#f7f9fc] pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl border border-[#e8edf7] shadow-xl shadow-blue-900/5 p-6 lg:p-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#eef4ff] flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="text-[#032e92] text-sm" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Wealth Growth Projection</h3>
                <p className="text-xs text-gray-400 font-medium">Year-by-year breakdown of your investment vs estimated returns</p>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#94a3b8] inline-block border-dashed"></span>
                Invested Amount
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#032e92] inline-block"></span>
                Projected Value
              </div>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-72 lg:h-88">
            <Line data={data} options={options} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
