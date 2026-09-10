import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalculator, faComments, faChevronUp,
  faArrowRight, faScaleBalanced, faCircleExclamation, faSpinner
} from '@fortawesome/free-solid-svg-icons'

// Layout
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

// SIF Components
import FundTabs from '../../components/sif/FundTabs'
import OverviewSection from '../../components/sif/OverviewSection'
import ObjectiveSection from '../../components/sif/ObjectiveSection'
import FundInformation from '../../components/sif/FundInformation'
import PerformanceSection from '../../components/sif/PerformanceSection'
import Riskometer from '../../components/sif/Riskometer'
import { AllocationChart, SectorChart } from '../../components/sif/AllocationChart'
import HoldingsTable from '../../components/sif/HoldingsTable'
import FundManager from '../../components/sif/FundManager'
import DocumentsSection from '../../components/sif/DocumentsSection'
import RelatedFunds from '../../components/sif/RelatedFunds'
import FundFAQ from '../../components/sif/FundFAQ'
import Newsletter from '../../components/sif/Newsletter'

// API & Utils
import { fetchFundDetails } from '../../api/funds'
import { generatePerformanceTable } from '../../utils/performance'

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
          className={`w-12 h-12 ${a.color} text-white rounded-2xl shadow-xl shadow-black/20 flex items-center justify-center`}>
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

  // Plan Selection State
  const [selectedType, setSelectedType] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedSubOption, setSelectedSubOption] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('')

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
  const availablePlans = apiFund?.plans || []
  const availableTypes = [...new Set(availablePlans.map(p => p.type).filter(Boolean))]

  const filteredByType = availablePlans.filter(p => !selectedType || p.type === selectedType)
  const availableOptions = [...new Set(filteredByType.map(p => p.option).filter(Boolean))]

  const filteredByOption = filteredByType.filter(p => !selectedOption || p.option === selectedOption)
  const availableSubOptions = [...new Set(filteredByOption.map(p => p.sub_option).filter(Boolean))]

  const filteredBySubOption = filteredByOption.filter(p => (!selectedSubOption && !p.sub_option) || p.sub_option === selectedSubOption)
  const availablePeriods = [...new Set(filteredBySubOption.map(p => p.period).filter(Boolean))]

  // Find exact plan match
  const selectedPlan = filteredBySubOption.find(p => (!selectedPeriod && !p.period) || p.period === selectedPeriod) || filteredBySubOption[0] || availablePlans[0] || {}

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
        formattedAum = `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
      } else if (typeof rawAum === 'string') {
        formattedAum = rawAum.includes('Cr') ? rawAum : `₹${rawAum} Cr`;
      }
    }

    const rawNavDate = selectedPlan.nav_date || apiFund.navDate || apiFund.nav_date;
    const formattedNavDate = rawNavDate || 'N/A';

    return {
      id: apiFund.id,
      name: apiFund.name || 'Unknown Fund',
      logo: apiFund.name ? apiFund.name.substring(0, 1) : 'F',
      logoColor: 'from-blue-600 to-indigo-700',
      amc: apiFund.amc || 'Unknown AMC',
      category: apiFund.category || 'N/A',
      
      schemeType: apiFund.schemeType || 'N/A',
      benchmark: apiFund.benchmarkTier1 || 'N/A',
      launchDate: apiFund.launchDate || 'N/A',
      aum: rawAum != null && rawAum !== '' ? rawAum : 'N/A',
      fundSize: formattedAum,

      // Selected Plan specific data
      nav: selectedPlan.nav != null ? `₹${selectedPlan.nav}` : (apiFund.nav != null ? `₹${apiFund.nav}` : 'N/A'),
      navDate: formattedNavDate,
      isin: selectedPlan.isin || 'N/A',
      sifCode: selectedPlan.sif_code || 'N/A',
      rtaCode: selectedPlan.rta_code || 'N/A',
      historicalNav: historicalNav,
      historical_nav: historicalNav,

      faceValue: apiFund.faceValue || 'N/A',
      registrar: apiFund.registrar || 'N/A',
      custodian: apiFund.custodian || 'N/A',
      auditor: apiFund.auditor || 'N/A',

      navChange: 'N/A',
      navChangePct: 'N/A',
      returns: {
        '1Y': perfData['1_year'] != null ? perfData['1_year'] : 'N/A',
        '3Y': perfData['3_years'] != null ? perfData['3_years'] : 'N/A',
        '5Y': perfData['5_years'] != null ? perfData['5_years'] : 'N/A',
      },
      expenseRatio: apiFund.expenseRatio != null ? apiFund.expenseRatio : 'N/A',
      exitLoad: apiFund.exitLoad || 'N/A',
      minimumSIP: apiFund.minInvestmentText || (apiFund.minInvestment != null ? `₹${apiFund.minInvestment.toLocaleString('en-IN')}` : 'N/A'),
      minimumLumpsum: apiFund.minInvestmentText || (apiFund.minInvestment != null ? `₹${apiFund.minInvestment.toLocaleString('en-IN')}` : 'N/A'),
      riskLevel: apiFund.riskLevel,
      lockIn: 'None',
      dividendOption: selectedPlan.option || 'N/A',
      settlement: 'N/A',
      taxation: 'N/A',
      investmentType: selectedPlan.type || 'N/A',

      objective: apiFund.schemeObjective || 'Objective data unavailable.',
      strategy: [],
      suitableFor: [],
      keyFeatures: [],

      managers: (apiFund.managers || []).map(m => ({
        name: m.name,
        initials: m.name.substring(0, 2).toUpperCase(),
        designation: 'Fund Manager',
        experience: 'N/A',
        education: 'N/A',
        specialization: 'N/A',
        bio: 'Manager bio unavailable.',
        email: '',
        linkedin: '#',
        fundsManaged: []
      })),

      allocations: (apiFund.allocations || []).map(a => ({
        name: a.type || 'Unknown',
        min: a.min != null ? a.min : 0,
        max: a.max != null ? a.max : 0,
        value: a.max != null ? a.max : 0,
        color: '#032e92'
      })),

      // Fallbacks for child charts that crash if these are missing
      sectors: [],
      holdings: [],

      performanceData: perfData,
      performanceTable: returnsTable,
      relatedFunds: [],
      faqs: [],
      documents: apiFund.documents || {}
    };
  }, [apiFund, selectedPlan]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-sans text-gray-900">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-20">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-[#032e92] animate-spin" />
          <p className="text-gray-500 font-semibold">Loading scheme details...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !fund) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-sans text-gray-900">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 pt-20">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
            <FontAwesomeIcon icon={faCircleExclamation} className="text-5xl mb-4 text-red-400" />
            <h3 className="text-xl font-bold mb-2">Error</h3>
            <p className="text-sm font-medium">{error || 'Scheme details not available.'}</p>
            <Link to="/sif" className="mt-6 inline-block px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-sm font-bold transition-colors">
              Back to Funds
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-sans text-gray-900">
      <Navbar />

        {/* Hero strip */}
        <div className="pt-20 bg-gradient-to-br from-[#032e92] via-[#0a4fd4] to-[#021d63]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              <Link to="/sif" className="hover:text-white transition-colors">SIF</Link>
              <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              <span className="text-white font-semibold">{fund.category}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${fund.logoColor} flex items-center justify-center text-3xl shadow-xl border-2 border-white/20`}>
                {fund.logo}
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white leading-tight">{fund.name}</h1>
                <p className="text-blue-200 text-sm font-medium mt-1">{fund.amc} • {fund.category} • {fund.schemeType}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sticky Tabs */}
        <FundTabs />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="w-full space-y-6">
            <OverviewSection fund={fund} />
            <ObjectiveSection fund={fund} />
            <FundInformation fund={fund} />
            <PerformanceSection
              fund={fund}
              planSelectorProps={{
                availableTypes, availableOptions, availableSubOptions, availablePeriods,
                selectedType, selectedOption, selectedSubOption, selectedPeriod,
                setSelectedType, setSelectedOption, setSelectedSubOption, setSelectedPeriod
              }}
            />

            <Riskometer fund={fund} />

            {/* Holdings section */}
            <section id="holdings" className="scroll-mt-32 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <AllocationChart fund={fund} />
                <SectorChart fund={fund} />
              </div>
              <HoldingsTable fund={fund} />
            </section>

            <FundManager fund={fund} />
            <DocumentsSection fund={fund} />
          </div>
        </main>

        {/* Below-the-fold sections */}
        <RelatedFunds funds={fund.relatedFunds} />
        <FundFAQ fund={fund} />
        <Newsletter />
        <Footer />

        {/* Floating Action Buttons */}
        <FloatingActions />
      </div>
  )
}
