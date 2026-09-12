import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalculator, faComments, faChevronUp,
  faArrowRight, faScaleBalanced, faCircleExclamation, faSpinner,
  faExpand, faCompress, faChartSimple, faFileLines,
  faCoins, faPlus, faWallet, faChartPie, faPercent, faUsers,
  faDoorOpen, faCircleCheck, faChevronDown
} from '@fortawesome/free-solid-svg-icons'

// Layout
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Newsletter from '../../components/sif/Newsletter'

// Context & Utils
import { useLeadModal } from '../../context/LeadModalContext'
import { fetchFundDetails } from '../../api/funds'
import { cleanNavHistory, getTargetDateForPeriod, generatePerformanceTable } from '../../utils/performance'

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

// Risk Bands Configuration (SEBI SIF Standard: 1 - 5)
const riskBandConfig = {
  1: { label: 'Low risk', color: '#15803d', bg: 'bg-green-700', text: 'text-green-800' },
  2: { label: 'Low to Moderate risk', color: '#65a30d', bg: 'bg-lime-600', text: 'text-lime-800' },
  3: { label: 'Moderate risk', color: '#eab308', bg: 'bg-yellow-500', text: 'text-yellow-800' },
  4: { label: 'Moderately High risk', color: '#f97316', bg: 'bg-orange-500', text: 'text-orange-800' },
  5: { label: 'High risk', color: '#7f1d1d', bg: 'bg-red-950', text: 'text-red-950' },
}

// Floating Action Button
function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const actions = [
    { icon: faScaleBalanced, label: 'Compare', color: 'bg-[#032e92]' },
    { icon: faCalculator, label: 'Calculator', color: 'bg-purple-600' },
    { icon: faComments, label: 'Support', color: 'bg-green-600' },
  ]

  return (
    <div className="fixed right-5 bottom-6 z-50 flex flex-col items-center gap-3">
      {actions.map((a) => (
        <motion.button
          key={a.label}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={a.label}
          className={`w-12 h-12 ${a.color} text-white rounded-2xl shadow-xl shadow-black/20 flex items-center justify-center cursor-pointer`}>
          <FontAwesomeIcon icon={a.icon} className="text-sm" />
        </motion.button>
      ))}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-white border-2 border-[#032e92] text-[#032e92] rounded-2xl shadow-xl flex items-center justify-center cursor-pointer">
            <FontAwesomeIcon icon={faChevronUp} className="text-sm" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SifFundDetails() {
  const { fundCode, id } = useParams()
  const rawId = fundCode || id
  const [apiFund, setApiFund] = useState(null)
  const { openLeadModal } = useLeadModal()

  // Tab State: 'overview' | 'details' | 'documents'
  const [activeTab, setActiveTab] = useState('overview')

  // Plan Selection State
  const [selectedType, setSelectedType] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedSubOption, setSelectedSubOption] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false)

  // Chart Timeframe Selection
  const [activeTimeframe, setActiveTimeframe] = useState('1M')
  const [isChartExpanded, setIsChartExpanded] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadFund() {
      try {
        setLoading(true)
        setError(null)
        const decodedId = decodeURIComponent(rawId)
        const data = await fetchFundDetails(decodedId)
        if (data) {
          setApiFund(data)

          // Initialize selector with default plan
          if (data.defaultPlan) {
            setSelectedType(data.defaultPlan.type || '')
            setSelectedOption(data.defaultPlan.option || '')
            setSelectedSubOption(data.defaultPlan.sub_option || '')
            setSelectedPeriod(data.defaultPlan.period || '')
          }
        } else {
          setError('Scheme not found.')
        }
      } catch (err) {
        setError(err.message || 'Failed to load fund details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    if (rawId) {
      loadFund()
    }
  }, [rawId])

  // Derive available options based on current selections
  const availablePlans = useMemo(() => apiFund?.plans || [], [apiFund?.plans])
  const availableTypes = useMemo(() => [...new Set(availablePlans.map(p => p.type).filter(Boolean))], [availablePlans])

  const filteredByType = useMemo(() => availablePlans.filter(p => !selectedType || p.type === selectedType), [availablePlans, selectedType])
  const availableOptions = useMemo(() => [...new Set(filteredByType.map(p => p.option).filter(Boolean))], [filteredByType])

  const filteredByOption = useMemo(() => filteredByType.filter(p => !selectedOption || p.option === selectedOption), [filteredByType, selectedOption])
  const availableSubOptions = useMemo(() => [...new Set(filteredByOption.map(p => p.sub_option).filter(Boolean))], [filteredByOption])

  const filteredBySubOption = useMemo(() => filteredByOption.filter(p => (!selectedSubOption && !p.sub_option) || p.sub_option === selectedSubOption), [filteredByOption, selectedSubOption])
  const availablePeriods = useMemo(() => [...new Set(filteredBySubOption.map(p => p.period).filter(Boolean))], [filteredBySubOption])

  // Find exact plan match
  const selectedPlan = useMemo(() => {
    return filteredBySubOption.find(p => (!selectedPeriod && !p.period) || p.period === selectedPeriod) || filteredBySubOption[0] || availablePlans[0] || {}
  }, [filteredBySubOption, selectedPeriod, availablePlans])

  // Automatically adjust cascading selections if invalid
  useEffect(() => {
    if (apiFund && availablePlans.length > 0) {
      if (selectedType && !availableTypes.includes(selectedType)) setSelectedType(availableTypes[0] || '')
      if (selectedOption && !availableOptions.includes(selectedOption)) setSelectedOption(availableOptions[0] || '')
      if (selectedSubOption && !availableSubOptions.includes(selectedSubOption)) setSelectedSubOption(availableSubOptions[0] || '')
      if (selectedPeriod && !availablePeriods.includes(selectedPeriod)) setSelectedPeriod(availablePeriods[0] || '')
    }
  }, [selectedType, selectedOption, selectedSubOption, selectedPeriod, availableTypes, availableOptions, availableSubOptions, availablePeriods, apiFund, availablePlans])

  // Construct UI Fund Object based on selected plan
  const fund = useMemo(() => {
    if (!apiFund) return null;

    const perfData = selectedPlan.performance_data || {};
    const historicalNav = selectedPlan.historical_nav || [];
    const returnsTable = generatePerformanceTable(perfData, historicalNav);

    // Selected plan AUM or fallback to top-level fund AUM
    const rawAum = selectedPlan.aum != null ? selectedPlan.aum : (apiFund.aum != null ? apiFund.aum : apiFund.fundSize);
    let formattedAum = 'N/A';
    if (rawAum != null && rawAum !== '' && rawAum !== 'N/A') {
      if (typeof rawAum === 'number' || !isNaN(Number(rawAum))) {
        const num = Number(rawAum);
        formattedAum = `Rs. ${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })} cr`;
      } else if (typeof rawAum === 'string') {
        formattedAum = rawAum.includes('cr') || rawAum.includes('Cr') ? rawAum : `Rs. ${rawAum} cr`;
      }
    }

    const rawNavDate = selectedPlan.nav_date || apiFund.navDate || apiFund.nav_date;
    const formattedNavDate = rawNavDate || 'N/A';

    // Min Investment formatted
    let formattedMinInv = 'Rs. 10,00,000/-';
    if (apiFund.minInvestmentText) {
      formattedMinInv = apiFund.minInvestmentText;
    } else if (apiFund.minInvestment != null) {
      formattedMinInv = `Rs. ${Number(apiFund.minInvestment).toLocaleString('en-IN')}/-`;
    }

    // Risk band parsing (1-5)
    let parsedRisk = parseInt(apiFund.risk, 10);
    if (isNaN(parsedRisk) || parsedRisk < 1 || parsedRisk > 5) {
      parsedRisk = 5; // Default fallback to high risk for SIF
    }

    // Inception Date
    const rawLaunchDate = apiFund.launchDate || apiFund.nfo_allotment_date || apiFund.nfo_start_date;
    let formattedLaunch = 'N/A';
    if (rawLaunchDate) {
      try {
        const d = new Date(rawLaunchDate);
        if (!isNaN(d.getTime())) {
          formattedLaunch = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
        } else {
          formattedLaunch = rawLaunchDate;
        }
      } catch {
        formattedLaunch = rawLaunchDate;
      }
    }

    // Nav formatting
    const rawNav = selectedPlan.nav != null ? selectedPlan.nav : (apiFund.nav != null ? apiFund.nav : null);
    const displayNav = rawNav != null ? `Rs. ${Number(rawNav).toFixed(2)}/-` : 'Rs. 10.00/-';

    return {
      id: apiFund.id,
      name: apiFund.name || 'Fund Name',
      amc: apiFund.amc || 'AMC name',
      category: apiFund.category || 'Hybrid',
      strategy: apiFund.investmentStrategy || apiFund.category || 'Hybrid Long short',
      schemeType: apiFund.schemeType || 'Open-ended',
      benchmark: apiFund.benchmarkTier1 || 'Nifty 500 TRI',
      launchDate: formattedLaunch,
      aum: formattedAum,
      fundSize: formattedAum,
      nav: displayNav,
      rawNav: rawNav,
      navDate: formattedNavDate,
      isin: selectedPlan.isin || 'N/A',
      sifCode: selectedPlan.sif_code || 'N/A',
      historicalNav: historicalNav,
      historical_nav: historicalNav,
      performanceData: perfData,
      performanceTable: returnsTable,
      expenseRatio: apiFund.expenseRatio != null && apiFund.expenseRatio !== '' ? `${apiFund.expenseRatio}%` : '3%',
      exitLoad: apiFund.exitLoad || 'If the units are redeemed / switched out on or before 90 days from the date of allotment - 0.50% of applicable NAV. If the units are redeemed / switched out after 90 days from the date of allotment – Nil. AMC reserves the right to revise the load structure from time to time.',
      minimumLumpsum: formattedMinInv,
      minAdditionalAmount: 'Rs. 1000/- (thereafter, in multiples of Rs. 1/-)',
      minRedemptionAmount: 'Rs. 1/-',
      optionsAvailable: selectedPlan.option || 'Growth',
      riskBand: parsedRisk,
      objective: apiFund.schemeObjective || 'An open-ended equity investment strategy investing in equity and equity related instruments including limited short exposure in equity through derivative instruments of Ex – top 100 stocks.',
      managers: apiFund.managers && apiFund.managers.length > 0
        ? apiFund.managers.map(m => m.name).join(', ')
        : 'Mr. Nikhil Gada, Mr. Trideep Bhattacharya, Mr. Ashish Sood, Mr. Amit Vora (Overseas portion)',
      allocations: (apiFund.allocations && apiFund.allocations.length > 0) ? apiFund.allocations : [
        { type: 'Equity & Equity Related Instruments', min: 65, max: 100 },
        { type: 'Debt & Money Market Instruments', min: 0, max: 35 },
        { type: 'Derivatives & Hedging Instruments', min: 0, max: 35 },
        { type: 'Units issued by InvITs', min: 0, max: 20 },
      ],
      documents: {
        sid: apiFund.documents?.isid || apiFund.documents?.sid || '#',
        kim: apiFund.documents?.kim || '#',
        factsheet: apiFund.documents?.factsheet || '#',
        sai: apiFund.documents?.sai || '#',
      }
    };
  }, [apiFund, selectedPlan]);

  // Clean and parse NAV History for Chart
  const cleanHistory = useMemo(() => {
    const rawList = Array.isArray(fund?.historicalNav)
      ? fund.historicalNav
      : Array.isArray(fund?.historical_nav)
        ? fund.historical_nav
        : []
    return cleanNavHistory(rawList)
  }, [fund?.historicalNav, fund?.historical_nav])

  // Filter time-series data based on active timeframe
  const currentChartPoints = useMemo(() => {
    if (!cleanHistory || cleanHistory.length === 0) {
      // Create a smooth realistic fallback trendline if history is currently empty
      const baseNav = fund?.rawNav ? Number(fund.rawNav) : 11.20;
      const points = [];
      const steps = 30;
      const today = new Date();
      for (let i = steps; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const wave = Math.sin((steps - i) / 4) * 0.18 + ((steps - i) / steps) * 0.35;
        points.push({ date: d, nav: Number((baseNav - 0.35 + wave).toFixed(4)) });
      }
      return points;
    }

    const maxDate = cleanHistory[cleanHistory.length - 1].date;
    const periodKey = activeTimeframe === '12M' ? '1Y' : activeTimeframe;
    const cutoffDate = (activeTimeframe === 'Since Inception' || activeTimeframe === 'Since Launch')
      ? cleanHistory[0].date
      : (getTargetDateForPeriod(periodKey, maxDate) || cleanHistory[0].date);

    const filtered = cleanHistory.filter(p => p.date >= cutoffDate);
    return filtered.length > 0 ? filtered : cleanHistory;
  }, [cleanHistory, activeTimeframe, fund?.rawNav]);

  // Build Chart Data
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const labels = currentChartPoints.map(p => {
      const day = p.date.getUTCDate()
      const m = months[p.date.getUTCMonth()]
      const y = p.date.getUTCFullYear()
      if (activeTimeframe === '1M') {
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
          borderColor: '#1d4ed8', // Vibrant blue line like reference
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(29, 78, 216, 0.12)';
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(29, 78, 216, 0.22)');
            gradient.addColorStop(0.7, 'rgba(29, 78, 216, 0.05)');
            gradient.addColorStop(1, 'rgba(29, 78, 216, 0.0)');
            return gradient;
          },
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#1d4ed8',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2,
        },
      ],
    }
  }, [currentChartPoints, activeTimeframe, fund?.name])

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        titleColor: '#0f172a',
        bodyColor: '#1d4ed8',
        bodyFont: { family: 'inherit', size: 13, weight: '700' },
        titleFont: { family: 'inherit', size: 11, weight: '500' },
        padding: 10,
        boxPadding: 4,
        displayColors: false,
        callbacks: {
          label: (ctx) => `NAV: ₹${typeof ctx.raw === 'number' ? ctx.raw.toFixed(4) : ctx.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          color: '#94a3b8',
          maxTicksLimit: 7,
          maxRotation: 0,
        },
      },
      y: {
        position: 'left',
        grid: { color: '#f1f5f9' },
        ticks: {
          font: { size: 10 },
          color: '#94a3b8',
          maxTicksLimit: 6,
          callback: (val) => `₹${Number(val).toFixed(2)}`,
        },
      },
    },
  }), [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-28">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-[#032e92] animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Loading scheme details...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !fund) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 pt-28">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
            <FontAwesomeIcon icon={faCircleExclamation} className="text-5xl mb-4 text-red-400" />
            <h3 className="text-xl font-bold mb-2">Scheme Not Found</h3>
            <p className="text-sm font-medium">{error || 'Scheme details could not be retrieved.'}</p>
            <Link to="/sif" className="mt-6 inline-block px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-bold transition-colors shadow-sm">
              Back to Funds
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const currentRisk = riskBandConfig[fund.riskBand] || riskBandConfig[5];
  // Calculate percentage along the 5-band gauge for the needle
  const needlePercent = Math.min(Math.max(((fund.riskBand - 0.5) / 5) * 100, 10), 90);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-6">
          <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <FontAwesomeIcon icon={faArrowRight} className="text-[9px]" />
          <Link to="/sif" className="hover:text-gray-700 transition-colors">SIF</Link>
          <FontAwesomeIcon icon={faArrowRight} className="text-[9px]" />
          <span className="text-gray-700 font-semibold">{fund.name}</span>
        </div>

        {/* Top Header Row (Logo + Fund Name + AMC + Plan Selector) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Custom rounded abstract watercolor logo box */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#fbf8f0] via-[#f7f2e4] to-[#ede4cc] border-2 border-[#e6dbc0] shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full opacity-70">
                <circle cx="35" cy="40" r="30" fill="#d4af37" filter="blur(6px)" />
                <circle cx="65" cy="55" r="28" fill="#c2a649" filter="blur(7px)" />
                <path d="M 20 50 Q 50 15 80 50 T 20 50" fill="#eed994" filter="blur(4px)" />
              </svg>
              <span className="absolute font-black text-amber-900/60 text-lg tracking-wider select-none">
                {fund.name.charAt(0)}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
                {fund.name}
              </h1>
              <p className="text-sm sm:text-base font-medium text-gray-500 mt-0.5">
                {fund.amc}
              </p>
            </div>
          </div>

          {/* Plan Selector Dropdown Pill */}
          {availablePlans.length > 1 && (
            <div className="relative self-start md:self-center">
              <button
                type="button"
                onClick={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-all shadow-2xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{selectedType || 'Regular'} • {selectedOption || 'Growth'}</span>
                <FontAwesomeIcon icon={faChevronDown} className="text-[10px] text-gray-400" />
              </button>

              <AnimatePresence>
                {isPlanDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-30 space-y-1"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1">Select Plan</p>
                    {availablePlans.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedType(p.type || '');
                          setSelectedOption(p.option || '');
                          setSelectedSubOption(p.sub_option || '');
                          setSelectedPeriod(p.period || '');
                          setIsPlanDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          selectedPlan.name === p.name ? 'bg-blue-50 text-[#032e92] font-bold' : 'text-gray-700 hover:bg-gray-50 font-medium'
                        }`}
                      >
                        <span>{p.type || 'Plan'} - {p.option || 'Growth'}</span>
                        {selectedPlan.name === p.name && <FontAwesomeIcon icon={faCircleCheck} className="text-xs text-[#032e92]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Navigation Tabs (Overview & Performance | Fund Details | Documents) */}
        <div className="flex flex-wrap items-center gap-3 pt-2 pb-8 border-b border-gray-100">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#6b8acc] text-white shadow-sm'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Overview & Performance
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'bg-[#6b8acc] text-white shadow-sm'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Fund Details
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-[#6b8acc] text-white shadow-sm'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Documents
          </button>
        </div>

        {/* Tab 1: Overview & Performance */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (Performance Chart + Investment Objective + Invest Now) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                {/* Performance Header with Range Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight">
                    Performance
                  </h2>

                  <div className="inline-flex items-center gap-1 bg-[#f4f7fc] border border-gray-200/80 rounded-full p-1 self-start sm:self-auto">
                    {['1M', '3M', '6M', '12M', 'Since Inception'].map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => setActiveTimeframe(tf)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          activeTimeframe === tf
                            ? 'bg-[#0b1b4f] text-white shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart Box */}
                <div className="relative w-full h-[320px] sm:h-[360px] bg-white rounded-2xl border border-gray-100 p-2 sm:p-4 shadow-2xs">
                  {/* Expand icon */}
                  <button
                    type="button"
                    onClick={() => setIsChartExpanded(true)}
                    title="Expand Chart"
                    className="absolute top-3 right-3 text-gray-400 hover:text-[#032e92] p-1.5 rounded-lg hover:bg-gray-50 transition-colors z-10 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faExpand} className="text-sm" />
                  </button>

                  <div className="w-full h-full pt-4">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>

                {/* Investment Objective */}
                <div className="pt-2">
                  <h3 className="text-xl font-extrabold text-[#0f172a] tracking-tight mb-2">
                    Investment Objective
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                    {fund.objective}
                  </p>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => openLeadModal(fund.name)}
                      className="px-8 py-2.5 rounded-full bg-[#032e92] hover:bg-[#021d63] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      Invest Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column (6 Quick Stat Cards + Risk Band) */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-4">
                {/* 2x3 Grid of Stat Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Card 1: NAV */}
                  <div className="bg-[#f0f4f9] rounded-2xl p-4 border border-[#e2e8f0]/60">
                    <p className="text-xs font-bold text-gray-900">NAV</p>
                    <p className="text-sm font-semibold text-gray-700 mt-1">{fund.nav}</p>
                  </div>

                  {/* Card 2: Min Investment */}
                  <div className="bg-[#f0f4f9] rounded-2xl p-4 border border-[#e2e8f0]/60">
                    <p className="text-xs font-bold text-gray-900">Min Investment</p>
                    <p className="text-sm font-semibold text-gray-700 mt-1">{fund.minimumLumpsum}</p>
                  </div>

                  {/* Card 3: AUM */}
                  <div className="bg-[#f0f4f9] rounded-2xl p-4 border border-[#e2e8f0]/60">
                    <p className="text-xs font-bold text-gray-900">AUM</p>
                    <p className="text-sm font-semibold text-gray-700 mt-1">{fund.fundSize}</p>
                  </div>

                  {/* Card 4: Inception Date */}
                  <div className="bg-[#f0f4f9] rounded-2xl p-4 border border-[#e2e8f0]/60">
                    <p className="text-xs font-bold text-gray-900">Inception Date</p>
                    <p className="text-sm font-semibold text-gray-700 mt-1">{fund.launchDate}</p>
                  </div>

                  {/* Card 5: Category */}
                  <div className="bg-[#f0f4f9] rounded-2xl p-4 border border-[#e2e8f0]/60">
                    <p className="text-xs font-bold text-gray-900">Category</p>
                    <p className="text-sm font-semibold text-gray-700 mt-1">{fund.category}</p>
                  </div>

                  {/* Card 6: Strategy */}
                  <div className="bg-[#f0f4f9] rounded-2xl p-4 border border-[#e2e8f0]/60">
                    <p className="text-xs font-bold text-gray-900">Strategy</p>
                    <p className="text-sm font-semibold text-gray-700 mt-1 truncate" title={fund.strategy}>
                      {fund.strategy}
                    </p>
                  </div>
                </div>

                {/* Risk Band Card */}
                <div className="bg-[#f0f4f9] rounded-2xl p-4 border border-[#e2e8f0]/60">
                  <p className="text-xs font-bold text-gray-900 mb-3">Risk Band</p>

                  {/* 5-segment continuous color band with needle */}
                  <div className="relative pt-2 pb-1">
                    {/* Color bar */}
                    <div className="h-6 w-full rounded-md overflow-hidden flex shadow-inner">
                      <div className="flex-1 bg-[#15803d]" title="Band 1: Low" />
                      <div className="flex-1 bg-[#84cc16]" title="Band 2: Low to Moderate" />
                      <div className="flex-1 bg-[#eab308]" title="Band 3: Moderate" />
                      <div className="flex-1 bg-[#f97316]" title="Band 4: Moderately High" />
                      <div className="flex-1 bg-[#7f1d1d]" title="Band 5: High" />
                    </div>

                    {/* Needle Indicator Marker */}
                    <div
                      className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                      style={{ left: `${needlePercent}%` }}
                    >
                      <div className="w-1.5 h-10 bg-black rounded-full shadow-md" />
                    </div>
                  </div>

                  <p className="text-xs font-bold text-gray-900 mt-3 text-right">
                    Risk Band {fund.riskBand}: {currentRisk.label}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Fund Details */}
        {activeTab === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Specifications Card */}
              <div className="lg:col-span-7 bg-[#f8faff] border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 shadow-xs">
                <div className="divide-y divide-gray-100">
                  {/* Benchmark */}
                  <div className="py-3.5 flex items-center gap-4 first:pt-0">
                    <div className="w-9 h-9 rounded-full bg-[#e3ecfc] text-[#032e92] flex items-center justify-center text-sm flex-shrink-0">
                      <FontAwesomeIcon icon={faChartSimple} />
                    </div>
                    <div className="w-5/12 text-sm font-semibold text-gray-800">
                      Benchmark (Tier 1)
                    </div>
                    <div className="w-7/12 text-sm text-gray-700 font-medium">
                      {fund.benchmark}
                    </div>
                  </div>

                  {/* Fund Type */}
                  <div className="py-3.5 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#e3ecfc] text-[#032e92] flex items-center justify-center text-sm flex-shrink-0">
                      <FontAwesomeIcon icon={faFileLines} />
                    </div>
                    <div className="w-5/12 text-sm font-semibold text-gray-800">
                      Fund Type
                    </div>
                    <div className="w-7/12 text-sm text-gray-700 font-medium">
                      {fund.schemeType}
                    </div>
                  </div>

                  {/* Minimum Application Amount */}
                  <div className="py-3.5 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#e3ecfc] text-[#032e92] flex items-center justify-center text-sm flex-shrink-0">
                      <FontAwesomeIcon icon={faCoins} />
                    </div>
                    <div className="w-5/12 text-sm font-semibold text-gray-800">
                      Minimum Application Amount
                    </div>
                    <div className="w-7/12 text-sm text-gray-700 font-medium">
                      {fund.minimumLumpsum} (thereafter, in multiples of Rs. 1/-)
                    </div>
                  </div>

                  {/* Minimum Additional Amount */}
                  <div className="py-3.5 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#e3ecfc] text-[#032e92] flex items-center justify-center text-sm flex-shrink-0">
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                    <div className="w-5/12 text-sm font-semibold text-gray-800">
                      Minimum Additional Amount
                    </div>
                    <div className="w-7/12 text-sm text-gray-700 font-medium">
                      {fund.minAdditionalAmount}
                    </div>
                  </div>

                  {/* Minimum Redemption Amount */}
                  <div className="py-3.5 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#e3ecfc] text-[#032e92] flex items-center justify-center text-sm flex-shrink-0">
                      <FontAwesomeIcon icon={faWallet} />
                    </div>
                    <div className="w-5/12 text-sm font-semibold text-gray-800">
                      Minimum Redemption Amount
                    </div>
                    <div className="w-7/12 text-sm text-gray-700 font-medium">
                      {fund.minRedemptionAmount}
                    </div>
                  </div>

                  {/* Options Available */}
                  <div className="py-3.5 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#e3ecfc] text-[#032e92] flex items-center justify-center text-sm flex-shrink-0">
                      <FontAwesomeIcon icon={faChartPie} />
                    </div>
                    <div className="w-5/12 text-sm font-semibold text-gray-800">
                      Options available
                    </div>
                    <div className="w-7/12 text-sm text-gray-700 font-medium">
                      {fund.optionsAvailable}
                    </div>
                  </div>

                  {/* TER */}
                  <div className="py-3.5 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#e3ecfc] text-[#032e92] flex items-center justify-center text-sm flex-shrink-0">
                      <FontAwesomeIcon icon={faPercent} />
                    </div>
                    <div className="w-5/12 text-sm font-semibold text-gray-800">
                      Total Expense Ratio (TER)
                    </div>
                    <div className="w-7/12 text-sm text-gray-700 font-medium">
                      {fund.expenseRatio}
                    </div>
                  </div>

                  {/* Fund Managers */}
                  <div className="py-3.5 flex items-start gap-4 last:pb-0">
                    <div className="w-9 h-9 rounded-full bg-[#e3ecfc] text-[#032e92] flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div className="w-5/12 text-sm font-semibold text-gray-800 pt-1">
                      Fund managers
                    </div>
                    <div className="w-7/12 text-sm text-gray-700 font-medium leading-relaxed">
                      {fund.managers}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Stack (Stated Asset Allocation + Exit Load) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Stated Asset Allocation */}
                <div className="bg-[#f8faff] border border-[#e2e8f0] rounded-3xl p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#e3ecfc] text-[#032e92] flex items-center justify-center text-sm">
                      <FontAwesomeIcon icon={faChartPie} />
                    </div>
                    <h3 className="text-base font-extrabold text-[#0f172a]">
                      Stated Asset Allocation
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {fund.allocations.map((item, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-800 truncate pr-2">
                            {item.type || 'Asset Allocation Type'}
                          </span>
                          <span className="text-gray-500 font-semibold flex-shrink-0">
                            Min {item.min != null ? `${item.min}%` : '0%'} – Max {item.max != null ? `${item.max}%` : '100%'}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-200/70 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#032e92] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(Math.max(item.max != null ? item.max : 50, 15), 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exit Load Card (Warm tinted as in reference) */}
                <div className="bg-[#fffbf0] border border-[#f5ebd7] rounded-3xl p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#fdeed6] text-[#c27803] flex items-center justify-center text-sm">
                      <FontAwesomeIcon icon={faDoorOpen} />
                    </div>
                    <h3 className="text-base font-extrabold text-gray-900">
                      Exit Load (if applicable)
                    </h3>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed font-normal">
                    {fund.exitLoad}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Documents */}
        {activeTab === 'documents' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-8"
          >
            <h2 className="text-xl font-extrabold text-[#032e92] mb-6">
              All Scheme Related Documents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Document 1: SID */}
              <div className="bg-white border border-gray-200/90 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-700 uppercase flex-shrink-0">
                        SID
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-snug">
                          Scheme Information Document
                        </h3>
                      </div>
                    </div>
                    <a
                      href={fund.documents.sid}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-full bg-[#032e92] hover:bg-[#021d63] text-white text-xs font-semibold shadow-2xs transition-colors flex-shrink-0"
                    >
                      View
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                    Mandate, portfolio bands, risk factors, and application terms
                  </p>
                </div>
              </div>

              {/* Document 2: KIM */}
              <div className="bg-white border border-gray-200/90 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-700 uppercase flex-shrink-0">
                        KIM
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-snug">
                          Key Information Memorandum
                        </h3>
                      </div>
                    </div>
                    <a
                      href={fund.documents.kim}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-full bg-[#032e92] hover:bg-[#021d63] text-white text-xs font-semibold shadow-2xs transition-colors flex-shrink-0"
                    >
                      View
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                    Quick-reference investor disclosure
                  </p>
                </div>
              </div>

              {/* Document 3: Factsheet */}
              <div className="bg-white border border-gray-200/90 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-700 uppercase flex-shrink-0">
                        FS
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-snug">
                          Monthly Factsheet
                        </h3>
                      </div>
                    </div>
                    <a
                      href={fund.documents.factsheet}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-full bg-[#032e92] hover:bg-[#021d63] text-white text-xs font-semibold shadow-2xs transition-colors flex-shrink-0"
                    >
                      View
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                    NAV, TER, allocation, and portfolio updates
                  </p>
                </div>
              </div>

              {/* Document 4: SAI */}
              <div className="bg-white border border-gray-200/90 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-700 uppercase flex-shrink-0">
                        SAI
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-snug">
                          Statement of Additional Information (SAI)
                        </h3>
                      </div>
                    </div>
                    <a
                      href={fund.documents.sai}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-full bg-[#032e92] hover:bg-[#021d63] text-white text-xs font-semibold shadow-2xs transition-colors flex-shrink-0"
                    >
                      View
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                    Legal terms, tax and risk factors
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Expanded Chart Modal */}
      <AnimatePresence>
        {isChartExpanded && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-5xl w-full shadow-2xl border border-gray-100 flex flex-col h-[80vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{fund.name} — Historical Performance</h3>
                  <p className="text-xs text-gray-500">Range: {activeTimeframe}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChartExpanded(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faCompress} className="text-sm" />
                </button>
              </div>

              <div className="flex-1 w-full pt-4">
                <Line data={chartData} options={chartOptions} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Newsletter />
      <Footer />
      <FloatingActions />
    </div>
  )
}
