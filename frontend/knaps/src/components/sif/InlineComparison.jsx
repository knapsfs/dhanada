import { forwardRef, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchFundDetails } from '../../api/funds';
import { cleanNavHistory, getAvailableGraphPeriods, getTargetDateForPeriod } from '../../utils/performance';
import { getRiskLevelConfig } from '../../utils/risk';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Deterministic slot colors: Slot 0 (Fund 1), Slot 1 (Fund 2), Slot 2 (Fund 3)
const SLOT_COLORS = [
  { border: '#032e92', bg: 'rgba(3, 46, 146, 0.08)', text: 'text-[#032e92]', badge: 'bg-blue-50 text-[#032e92] border-blue-200' },
  { border: '#c10000', bg: 'rgba(193, 0, 0, 0.08)', text: 'text-[#c10000]', badge: 'bg-red-50 text-[#c10000] border-red-200' },
  { border: '#059669', bg: 'rgba(5, 150, 105, 0.08)', text: 'text-[#059669]', badge: 'bg-emerald-50 text-[#059669] border-emerald-200' },
];

const InlineComparison = forwardRef(function InlineComparison(
  { selectedFunds = [null, null, null], isVisible = false },
  ref
) {
  const [detailsCache, setDetailsCache] = useState({});
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [activeMode, setActiveMode] = useState('performance');
  const [selectedTimeframe, setSelectedTimeframe] = useState('');

  // Extract non-null fund slots
  const activeFundSlots = useMemo(() => {
    return selectedFunds
      .map((fund, slotIndex) => ({ fund, slotIndex }))
      .filter(({ fund }) => fund !== null);
  }, [selectedFunds]);

  // Reset active mode to 'performance' when comparison is closed/hidden
  useEffect(() => {
    if (!isVisible || activeFundSlots.length < 2) {
      setActiveMode('performance');
    }
  }, [isVisible, activeFundSlots.length]);

  // Fetch full details for any selected fund that is not in the cache yet
  useEffect(() => {
    const idsToFetch = activeFundSlots
      .map(({ fund }) => fund.id || fund.sebi_code)
      .filter(id => id && !detailsCache[id] && !loadingIds.has(id));

    if (idsToFetch.length === 0) return;

    setLoadingIds(prev => {
      const next = new Set(prev);
      idsToFetch.forEach(id => next.add(id));
      return next;
    });

    idsToFetch.forEach(async (id) => {
      try {
        const detail = await fetchFundDetails(id);
        if (detail) {
          setDetailsCache(prev => ({ ...prev, [id]: detail }));
        }
      } catch (err) {
        console.error('Failed to fetch details for fund:', id, err);
      } finally {
        setLoadingIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    });
  }, [activeFundSlots, detailsCache, loadingIds]);

  // Enriched fund data list combining base item with loaded details
  const enrichedActiveFunds = useMemo(() => {
    return activeFundSlots.map(({ fund, slotIndex }) => {
      const fundId = fund.id || fund.sebi_code;
      const details = detailsCache[fundId] || null;
      const plans = details?.plans || [];
      const defaultPlan = details?.defaultPlan || (plans.length > 0 ? plans[0] : null);

      const historicalNavRaw = defaultPlan?.historical_nav || details?.historical_nav || fund.historicalNav || [];
      const cleanHistory = cleanNavHistory(historicalNavRaw);
      const perfData = defaultPlan?.performance_data || details?.performance_data || fund.performanceData || {};

      // AUM formatting
      const rawAum = defaultPlan?.aum != null ? defaultPlan.aum : (details?.aum != null ? details.aum : fund.aum);
      let formattedAum = 'N/A';
      if (rawAum != null && rawAum !== '' && rawAum !== 'N/A') {
        if (typeof rawAum === 'number' || !isNaN(Number(rawAum))) {
          const num = Number(rawAum);
          formattedAum = `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
        } else if (typeof rawAum === 'string') {
          formattedAum = rawAum.includes('Cr') ? rawAum : `₹${rawAum} Cr`;
        }
      }

      // NAV formatting
      const rawNav = defaultPlan?.nav != null ? defaultPlan.nav : (details?.nav != null ? details.nav : fund.nav);
      let formattedNav = 'N/A';
      if (rawNav != null && rawNav !== '' && rawNav !== 'N/A') {
        const navNum = typeof rawNav === 'number' ? rawNav : parseFloat(String(rawNav).replace(/[₹,\s]/g, ''));
        formattedNav = !isNaN(navNum) ? `₹${navNum.toFixed(2)}` : String(rawNav);
      }

      // Risk level
      const rawRisk = details?.riskLevel !== 'N/A' && details?.riskLevel != null
        ? details.riskLevel
        : (fund.riskLevel !== 'N/A' && fund.riskLevel != null ? fund.riskLevel : (fund.risk || details?.risk || 5));
      const riskConfig = getRiskLevelConfig(rawRisk);
      const riskLevel = riskConfig.level !== 'N/A' ? riskConfig.level : 5;

      // Expense ratio
      const rawExpense = details?.expenseRatio != null ? details.expenseRatio : fund.expenseRatio;
      const expenseRatio = rawExpense != null && rawExpense !== 'N/A' && rawExpense !== '' ? `${rawExpense}%` : 'N/A';

      // Benchmark
      const benchmark = details?.benchmarkTier1 || details?.benchmark || fund.benchmarkTier1 || fund.benchmark || 'N/A';

      // Category
      const category = details?.category || fund.category || fund.subCategory || fund.investmentStrategy || 'Equity Long-Short';

      return {
        fund,
        slotIndex,
        details,
        name: details?.name || fund.name,
        category,
        nav: formattedNav,
        aum: formattedAum,
        riskLevel,
        riskConfig,
        expenseRatio,
        benchmark,
        cleanHistory,
        perfData,
      };
    });
  }, [activeFundSlots, detailsCache]);

  // Determine available graph periods across all enriched active funds
  const availablePeriods = useMemo(() => {
    const periodOrder = ['1W', '1M', '3M', '6M', '1Y', 'Since Inception'];
    const validPeriods = new Set();

    enrichedActiveFunds.forEach(f => {
      const fundPeriods = getAvailableGraphPeriods(f.cleanHistory, f.perfData);
      fundPeriods.forEach(p => validPeriods.add(p));
    });

    const result = periodOrder.filter(p => validPeriods.has(p));
    return result.length > 0 ? result : ['1M', '3M', '6M', '1Y', 'Since Inception'];
  }, [enrichedActiveFunds]);

  // Maintain active timeframe selection
  useEffect(() => {
    if (availablePeriods.length > 0) {
      if (!selectedTimeframe || !availablePeriods.includes(selectedTimeframe)) {
        if (availablePeriods.includes('1Y')) {
          setSelectedTimeframe('1Y');
        } else {
          setSelectedTimeframe(availablePeriods[availablePeriods.length - 1]);
        }
      }
    }
  }, [availablePeriods, selectedTimeframe]);

  // Multi-series Chart Data calculation
  const chartData = useMemo(() => {
    if (enrichedActiveFunds.length < 2 || !selectedTimeframe) return null;

    // Filter points for each fund based on the selected timeframe
    const fundSeries = enrichedActiveFunds.map(fundItem => {
      const { cleanHistory } = fundItem;
      if (!cleanHistory || cleanHistory.length === 0) {
        return { fundItem, points: [] };
      }

      const maxDate = cleanHistory[cleanHistory.length - 1].date;
      const cutoffDate = (selectedTimeframe === 'Since Inception' || selectedTimeframe === 'Since Launch')
        ? cleanHistory[0].date
        : (getTargetDateForPeriod(selectedTimeframe, maxDate) || cleanHistory[0].date);

      const points = cleanHistory.filter(p => p.date >= cutoffDate);
      return { fundItem, points };
    });

    const hasAnyPoints = fundSeries.some(s => s.points.length > 0);
    if (!hasAnyPoints) return null;

    // Collect all unique date timestamps across all series and sort ascending
    const timestampMap = new Map();
    fundSeries.forEach(s => {
      s.points.forEach(p => {
        const ts = p.date.getTime();
        if (!timestampMap.has(ts)) {
          timestampMap.set(ts, p.date);
        }
      });
    });

    const sortedTimestamps = Array.from(timestampMap.keys()).sort((a, b) => a - b);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const labels = sortedTimestamps.map(ts => {
      const d = timestampMap.get(ts);
      const day = d.getUTCDate();
      const m = months[d.getUTCMonth()];
      const y = d.getUTCFullYear();
      if (selectedTimeframe === '1W' || selectedTimeframe === '1M') {
        return `${day} ${m}`;
      }
      return `${day} ${m} ${y}`;
    });

    // Datasets with deterministic colors by slot
    const datasets = fundSeries.map(({ fundItem, points }) => {
      const pointMap = new Map();
      points.forEach(p => {
        pointMap.set(p.date.getTime(), p.nav);
      });

      const seriesNavs = sortedTimestamps.map(ts => pointMap.get(ts) ?? null);
      const color = SLOT_COLORS[fundItem.slotIndex % 3];

      return {
        label: fundItem.name,
        data: seriesNavs,
        borderColor: color.border,
        backgroundColor: color.bg,
        borderWidth: 2.5,
        tension: 0.3,
        fill: false,
        spanGaps: true,
        pointRadius: selectedTimeframe === '1W' ? 3 : 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color.border,
      };
    });

    return { labels, datasets };
  }, [enrichedActiveFunds, selectedTimeframe]);

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
          font: { family: 'Inter, system-ui, sans-serif', size: 12, weight: '600' },
          padding: 20,
          color: '#1e293b',
        },
      },
      tooltip: {
        backgroundColor: '#fff',
        borderColor: '#e8edf7',
        borderWidth: 1,
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        bodyFont: { family: 'Inter, system-ui, sans-serif', size: 12 },
        titleFont: { family: 'Inter, system-ui, sans-serif', size: 12, weight: '700' },
        padding: 12,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ₹${typeof ctx.raw === 'number' ? ctx.raw.toFixed(4) : (ctx.raw || 'N/A')}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Inter, system-ui, sans-serif', size: 11 },
          color: '#94a3b8',
          maxTicksLimit: 8,
        },
        border: { display: false },
      },
      y: {
        grid: { color: '#f1f5f9', drawBorder: false },
        ticks: {
          font: { family: 'Inter, system-ui, sans-serif', size: 11 },
          color: '#94a3b8',
          callback: val => `₹${typeof val === 'number' ? val.toFixed(2) : val}`,
        },
        border: { display: false, dash: [4, 4] },
      },
    },
  };

  // Only render when isVisible is true AND at least TWO funds are selected
  if (!isVisible || activeFundSlots.length < 2) {
    return null;
  }

  const parameters = [
    { label: 'Category', key: 'category' },
    { label: 'Current NAV', key: 'nav' },
    { label: 'AUM (Cr)', key: 'aum' },
    { label: 'Risk Band', key: 'riskLevel', isRiskBand: true },
    { label: 'Expense Ratio', key: 'expenseRatio' },
    { label: 'Benchmark', key: 'benchmark' },
  ];

  return (
    <motion.div
      ref={ref}
      id="inline-comparison"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-28 bg-white rounded-3xl border border-[#e8edf7] shadow-xl shadow-blue-900/5 mb-12 overflow-hidden animate-in fade-in duration-500"
    >
      {/* 1. Unified Container Header with Dynamic Count & Mode Toggle */}
      <div className="p-6 lg:p-8 border-b border-[#e8edf7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl lg:text-2xl font-bold text-[#1e293b] font-serif mb-1">
            Fund Comparison ({enrichedActiveFunds.length} funds)
          </h3>
          <p className="text-[#64748b] text-xs font-medium">
            Side-by-side {activeMode === 'performance' ? 'historical NAV performance curves' : 'key parameter screening'} for selected SIF schemes.
          </p>
        </div>

        {/* Two-option Toggle: [ Performance ] [ Parameters ] */}
        <div className="flex items-center gap-1 bg-[#f7f9fc] p-1.5 rounded-2xl border border-[#e8edf7] self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setActiveMode('performance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeMode === 'performance'
                ? 'bg-[#032e92] text-white shadow-md shadow-blue-900/20'
                : 'text-gray-600 hover:text-[#032e92]'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveMode('parameters')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeMode === 'parameters'
                ? 'bg-[#032e92] text-white shadow-md shadow-blue-900/20'
                : 'text-gray-600 hover:text-[#032e92]'
            }`}
          >
            Parameters
          </button>
        </div>
      </div>

      {/* 2. Container Content: Performance or Parameters */}
      {activeMode === 'performance' ? (
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h4 className="text-base font-bold text-[#1e293b]">
              NAV Performance Trajectory
            </h4>

            {/* Timeframe selector tabs */}
            {availablePeriods.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap bg-[#f7f9fc] p-1.5 rounded-2xl border border-[#e8edf7]">
                {availablePeriods.map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedTimeframe(p)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      selectedTimeframe === p
                        ? 'bg-[#032e92] text-white shadow-md shadow-blue-900/20'
                        : 'text-gray-600 hover:text-[#032e92]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chart View */}
          {chartData ? (
            <div className="h-72 md:h-80 w-full mb-2">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-64 md:h-72 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 p-6 text-center">
              <p className="text-gray-400 font-semibold text-sm">
                Historical NAV chart data is currently loading or unavailable for the selected range.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-[#f7f9fc]">
                <th className="p-4 lg:p-5 text-xs font-bold text-[#64748b] uppercase tracking-wider w-1/4">
                  Parameter
                </th>
                {enrichedActiveFunds.map((item, idx) => {
                  const color = SLOT_COLORS[item.slotIndex % 3];
                  return (
                    <th key={idx} className="p-4 lg:p-5 text-xs font-bold text-[#1e293b] uppercase tracking-wider border-l border-[#e8edf7]">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md border w-fit ${color.badge}`}>
                          Fund {item.slotIndex + 1}
                        </span>
                        <span className="text-sm font-bold text-[#1e293b] normal-case truncate max-w-[240px]">
                          {item.name}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8edf7]">
              {parameters.map((param, pIdx) => (
                <tr key={pIdx} className="hover:bg-[#f7f9fc]/60 transition-colors">
                  <td className="p-4 lg:p-5 text-xs lg:text-sm font-semibold text-[#64748b]">
                    {param.label}
                  </td>
                  {enrichedActiveFunds.map((item, fIdx) => (
                    <td key={fIdx} className="p-4 lg:p-5 border-l border-[#e8edf7] text-xs lg:text-sm font-medium text-[#1e293b]">
                      {param.isRiskBand ? (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border shadow-sm ${item.riskConfig.bg} ${item.riskConfig.text} ${item.riskConfig.border}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          Risk Band: {item.riskLevel}
                        </span>
                      ) : (
                        <span className="font-semibold text-gray-800">
                          {item[param.key] || 'N/A'}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
});

export default InlineComparison;
