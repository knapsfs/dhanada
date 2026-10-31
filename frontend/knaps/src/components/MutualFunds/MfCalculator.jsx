import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faArrowRight,
  faChartLine,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useLeadModal } from '../../context/LeadModalContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const formatINR = (val) => {
  return `₹${Math.round(val || 0).toLocaleString('en-IN')}`;
};

const formatCompactINR = (val) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
  return `₹${Math.round(val || 0).toLocaleString('en-IN')}`;
};

export default function MfCalculator() {
  const [calcMode, setCalcMode] = useState('sip'); // 'sip' or 'lumpsum'
  const [amount, setAmount] = useState(10000); // 10k monthly or lumpsum
  const [years, setYears] = useState(10);
  const [returnRate, setReturnRate] = useState(12);
  const { openLeadModal } = useLeadModal();

  // Handle mode toggle and adjust default amount
  const handleModeSwitch = (mode) => {
    setCalcMode(mode);
    if (mode === 'sip') {
      setAmount(10000);
    } else {
      setAmount(200000);
    }
  };

  // Calculation results & yearly trajectory
  const { totalInvested, estimatedReturns, totalValue, yearlyData } = useMemo(() => {
    const P = Number(amount) || 0;
    const y = Number(years) || 1;
    const r = (Number(returnRate) || 0) / 100;
    const n = y * 12;
    const i = r > 0 ? Math.pow(1 + r, 1 / 12) - 1 : 0;

    let invested = 0;
    let finalVal = 0;
    const dataPoints = [];

    if (calcMode === 'sip') {
      invested = P * n;
      if (i > 0) {
        finalVal = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      } else {
        finalVal = invested;
      }

      // Generate yearly data
      for (let yr = 1; yr <= y; yr++) {
        const months = yr * 12;
        const curInvested = P * months;
        let curVal = curInvested;
        if (i > 0) {
          curVal = P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
        }
        dataPoints.push({
          year: yr,
          invested: Math.round(curInvested),
          value: Math.round(curVal)
        });
      }
    } else {
      // Lumpsum mode
      invested = P;
      finalVal = P * Math.pow(1 + r, y);

      for (let yr = 1; yr <= y; yr++) {
        const curVal = P * Math.pow(1 + r, yr);
        dataPoints.push({
          year: yr,
          invested: Math.round(invested),
          value: Math.round(curVal)
        });
      }
    }

    const returns = Math.max(0, finalVal - invested);

    return {
      totalInvested: Math.round(invested),
      estimatedReturns: Math.round(returns),
      totalValue: Math.round(finalVal),
      yearlyData: dataPoints
    };
  }, [calcMode, amount, years, returnRate]);

  // ChartJS data preparation
  const chartLabels = yearlyData.map((d) => `Year ${d.year}`);
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Invested Amount',
        data: yearlyData.map((d) => d.invested),
        borderColor: '#94a3b8',
        backgroundColor: 'rgba(148, 163, 184, 0.08)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: true,
        tension: 0.35,
        pointRadius: () => (years > 15 ? 0 : 3),
        pointBackgroundColor: '#94a3b8'
      },
      {
        label: 'Estimated Wealth Value',
        data: yearlyData.map((d) => d.value),
        borderColor: '#032e92',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(3, 46, 146, 0.1)';
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(3, 46, 146, 0.25)');
          gradient.addColorStop(1, 'rgba(3, 46, 146, 0.01)');
          return gradient;
        },
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointRadius: () => (years > 15 ? 0 : 3),
        pointBackgroundColor: '#032e92'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (item) => ` ${item.dataset.label}: ${formatCompactINR(item.raw)}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: '#94a3b8', maxTicksLimit: 8 }
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: {
          callback: (v) => formatCompactINR(v),
          font: { size: 11 },
          color: '#94a3b8',
          maxTicksLimit: 6
        }
      }
    }
  };

  return (
    <section id="mf-calculator" className="py-20 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faCalculator} className="text-[#2490ef]" />
            <span>Interactive Financial Planning</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#032e92] tracking-tight">
            Mutual Fund SIP & Lumpsum Calculator
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            Simulate the long-term compounding growth of your systematic investments or one-time lump sum corpus with realistic returns.
          </p>
        </div>

        {/* Dual Mode Switcher */}
        <div className="flex justify-center mb-10">
          <div className="p-1.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => handleModeSwitch('sip')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                calcMode === 'sip'
                  ? 'bg-[#032e92] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Systematic Investment Plan (SIP)
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('lumpsum')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                calcMode === 'lumpsum'
                  ? 'bg-[#032e92] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              One-Time Lumpsum
            </button>
          </div>
        </div>

        {/* Calculator Main Box */}
        <div className="bg-[#f8fbff] rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Sliders and Inputs */}
            <div className="lg:col-span-5 space-y-7">
              {/* Input 1: Amount */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">
                    {calcMode === 'sip' ? 'Monthly SIP Amount' : 'Lumpsum Investment Amount'}
                  </label>
                  <div className="flex items-center px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-[#032e92] shadow-xs">
                    <span className="text-slate-400 mr-1">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value) || 0)}
                      step={calcMode === 'sip' ? 500 : 5000}
                      className="w-24 text-right font-extrabold focus:outline-none"
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min={calcMode === 'sip' ? 500 : 5000}
                  max={calcMode === 'sip' ? 150000 : 3000000}
                  step={calcMode === 'sip' ? 500 : 5000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />

                <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                  <span>{calcMode === 'sip' ? '₹500' : '₹5,000'}</span>
                  <span>{calcMode === 'sip' ? '₹75,000' : '₹15 Lakhs'}</span>
                  <span>{calcMode === 'sip' ? '₹1.5 Lakhs' : '₹30 Lakhs'}</span>
                </div>
              </div>

              {/* Input 2: Investment Duration */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">
                    Investment Duration
                  </label>
                  <div className="flex items-center px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-[#032e92] shadow-xs">
                    <input
                      type="number"
                      value={years}
                      min={1}
                      max={30}
                      onChange={(e) => setYears(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
                      className="w-12 text-right font-extrabold focus:outline-none"
                    />
                    <span className="text-slate-500 ml-1 text-xs">Years</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />

                <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                  <span>1 Year</span>
                  <span>10 Years</span>
                  <span>20 Years</span>
                  <span>30 Years</span>
                </div>
              </div>

              {/* Input 3: Expected Annual Return Rate */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">
                    Expected Return Rate (p.a.)
                  </label>
                  <div className="flex items-center px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-[#032e92] shadow-xs">
                    <input
                      type="number"
                      value={returnRate}
                      min={4}
                      max={25}
                      step={0.5}
                      onChange={(e) => setReturnRate(Number(e.target.value) || 0)}
                      className="w-12 text-right font-extrabold focus:outline-none"
                    />
                    <span className="text-slate-500 ml-1 text-xs">%</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={5}
                  max={20}
                  step={0.5}
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#032e92]"
                />

                {/* Return Rate Presets */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-500 font-medium">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setReturnRate(8)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      returnRate === 8 ? 'bg-[#032e92] text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    Debt / Conservative (8%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReturnRate(12)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      returnRate === 12 ? 'bg-[#032e92] text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    Hybrid / Moderate (12%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReturnRate(15)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      returnRate === 15 ? 'bg-[#032e92] text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    Equity Alpha (15%)
                  </button>
                </div>
              </div>

              {/* Start Plan CTA */}
              <button
                type="button"
                onClick={() => openLeadModal(`Mutual Funds: Plan ${calcMode.toUpperCase()} ₹${amount.toLocaleString('en-IN')} for ${years}Y`)}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#032e92] to-[#021d63] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#032e92]/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start This Investment Plan</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>

            {/* Right Column: Output Summary Cards & Growth Chart */}
            <div className="lg:col-span-7 space-y-6">
              {/* 3 Summary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold mb-1">Total Amount Invested</div>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-800">
                    {formatINR(totalInvested)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {calcMode === 'sip' ? `${years * 12} monthly installments` : 'One-time investment'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold mb-1">Estimated Wealth Gained</div>
                  <div className="text-lg sm:text-xl font-extrabold text-emerald-600">
                    {formatINR(estimatedReturns)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Compounded earnings</div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-white border-2 border-[#032e92]/20 shadow-xs">
                  <div className="text-xs text-[#032e92] font-semibold mb-1">Total Estimated Value</div>
                  <div className="text-lg sm:text-xl font-extrabold text-[#032e92]">
                    {formatINR(totalValue)}
                  </div>
                  <div className="text-[11px] text-blue-500 mt-0.5 font-medium">At end of {years} Years</div>
                </div>
              </div>

              {/* Chart Container */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faChartLine} className="text-[#032e92]" />
                    <span className="text-sm font-bold text-slate-800">Year-on-Year Wealth Trajectory</span>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                      Invested
                    </span>
                    <span className="flex items-center gap-1.5 text-[#032e92]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#032e92] inline-block"></span>
                      Projected Value
                    </span>
                  </div>
                </div>

                <div className="h-64 sm:h-72 w-full">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Explicit Mandatory Statutory Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5">
                <FontAwesomeIcon icon={faCircleInfo} className="text-amber-700 text-sm mt-0.5 flex-shrink-0" />
                <p className="text-[11px] sm:text-xs text-amber-900 leading-relaxed font-medium">
                  <strong>Statutory Notice:</strong> Output figures generated above are purely educational estimates based on assumed compound annual growth rates. Mutual fund returns are market-linked and are NOT guaranteed. Past performance is not indicative of future results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
