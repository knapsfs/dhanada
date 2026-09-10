import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTableCellsLarge, faList, faFilter, faCircleExclamation
} from '@fortawesome/free-solid-svg-icons'

// Layout
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

// API
import { fetchFundsList } from '../../api/funds'

// SIF Landing Components
import Hero from '../../components/sif/Hero'
import WhyChoose from '../../components/sif/WhyChoose'
import FundMarketplace from '../../components/sif/FundMarketplace'
import TopFunds from '../../components/sif/TopFunds'
import HeatmapSection from '../../components/sif/HeatmapSection'
import InvestmentPhilosophy from '../../components/sif/InvestmentPhilosophy'
import Comparison from '../../components/sif/Comparison'
import TrustSection from '../../components/sif/TrustSection'
import Testimonials from '../../components/sif/Testimonials'
import FAQ from '../../components/sif/FAQ'
import Newsletter from '../../components/sif/Newsletter'

// SIF Fund Directory Components
import FundsHero from '../../components/sif/FundsHero'
import FundFilters from '../../components/sif/FundFilters'
import ActiveFilters from '../../components/sif/ActiveFilters'
import FundGrid from '../../components/sif/FundGrid'
import Pagination from '../../components/sif/Pagination'

const ITEMS_PER_PAGE = 9

const defaultFilters = {
  assetClass: '',
  category: '',
  risk: '',
  amc: '',
  minInvestment: '',
  search: '',
  sort: 'returns',
}

const minInvestmentOrder = { '₹500': 500, '₹1,000': 1000, '₹5,000': 5000, '₹10,000': 10000, '₹50,000': 50000 }

function parseReturns(val) {
  if (val == null || val === '—') return -999 // fallback for missing returns in sorting
  if (typeof val === 'number') return val
  return parseFloat(val.replace('%', '')) || -999
}

function parseAUM(val) {
  if (val == null) return -999
  if (typeof val === 'number') return val
  const num = val.replace(/[₹,\s]/g, '').replace('Cr', '')
  return parseFloat(num) || -999
}

export default function SifHome() {
  const [fundsData, setFundsData] = useState([])
  const [filters, setFilters] = useState(defaultFilters)
  const [isGrid, setIsGrid] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // FundSelector state (3 fund comparator slots)
  const [selectedFunds, setSelectedFunds] = useState([null, null, null])

  useEffect(() => {
    async function loadFunds() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchFundsList()
        setFundsData(data || [])
      } catch (err) {
        setError(err.message || 'Failed to load funds. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    loadFunds()
  }, [])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  // Handle slot selection in FundSelector
  const handleFundSelect = (index, fundId) => {
    const chosenFund = fundId ? fundsData.find(f => f.id === fundId) || null : null
    setSelectedFunds(prev => {
      const updated = [...prev]
      updated[index] = chosenFund
      return updated
    })
  }

  // Handle reset in FundSelector
  const handleResetSelector = () => {
    setSelectedFunds([null, null, null])
  }

  // Filter and sort logic for Fund Directory
  const filteredFunds = useMemo(() => {
    let result = [...fundsData]

    if (filters.assetClass) result = result.filter(f => f.investmentStrategy === filters.assetClass)
    if (filters.category) result = result.filter(f => f.category === filters.category)
    if (filters.risk && filters.risk !== 'All') {
      const targetRisk = parseInt(filters.risk.replace('Risk Level ', ''), 10)
      result = result.filter(f => f.riskLevel === targetRisk)
    }
    if (filters.amc) result = result.filter(f => f.amc === filters.amc)
    if (filters.minInvestment) {
      result = result.filter(f => {
        const min = minInvestmentOrder[filters.minInvestment]
        const fundMin = typeof f.minInvestment === 'number' ? f.minInvestment : minInvestmentOrder[f.minInvestment]
        return fundMin != null && fundMin <= min
      })
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(f =>
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.amc && f.amc.toLowerCase().includes(q)) ||
        (f.category && f.category.toLowerCase().includes(q))
      )
    }

    // Sort
    switch (filters.sort) {
      case 'aum':
        result.sort((a, b) => parseAUM(b.aum) - parseAUM(a.aum))
        break
      case 'returns':
        result.sort((a, b) => parseReturns(b.returns1Y) - parseReturns(a.returns1Y))
        break
      case 'risk':
        result.sort((a, b) => (b.riskLevel !== 'N/A' ? b.riskLevel : 0) - (a.riskLevel !== 'N/A' ? a.riskLevel : 0))
        break
      case 'alpha':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
      case 'newest':
        result.sort((a, b) => new Date(b.launchDate) - new Date(a.launchDate))
        break
      default:
        break
    }
    return result
  }, [filters, fundsData])

  const totalPages = Math.ceil(filteredFunds.length / ITEMS_PER_PAGE)
  const paginatedFunds = filteredFunds.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const clearFilters = () => setFilters(defaultFilters)

  // Compute dynamic AMC list
  const amcList = useMemo(() => {
    const amcs = new Set()
    fundsData.forEach(f => {
      if (f.amc) amcs.add(f.amc)
    })
    return Array.from(amcs).sort()
  }, [fundsData])

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-sans text-gray-900">
        <Navbar />

        <main>
          {/* 1. SIF Hero */}
          <Hero />

          {/* 2. Why Choose SIF */}
          <WhyChoose />

          {/* 3. Fund Marketplace */}
          {!loading && fundsData.length > 0 && <FundMarketplace fundsData={fundsData} />}

          {/* 4. Compare Top SIF Schemes (with integrated FundSelector directly below tabs) */}
          {!loading && fundsData.length > 0 && (
            <TopFunds
              fundsData={fundsData}
              selectedFunds={selectedFunds}
              onFundSelect={handleFundSelect}
              onReset={handleResetSelector}
            />
          )}

          {/* 5. Performance Heatmap */}
          {!loading && fundsData.length > 0 && <HeatmapSection fundsData={fundsData} />}

          {/* 7. Complete SIF Fund Directory */}
          <section id="funds-directory">
            <FundsHero />
            <FundFilters
              filters={filters}
              setFilters={setFilters}
              onClear={clearFilters}
              amcList={amcList}
              fundsData={fundsData}
            />
            <ActiveFilters filters={filters} setFilters={setFilters} />

            <div className="py-6 bg-[#f7f9fc]">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {error ? (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <FontAwesomeIcon icon={faCircleExclamation} className="text-4xl mb-4 text-red-400" />
                    <h3 className="text-lg font-bold mb-2">Error Loading Funds</h3>
                    <p className="text-sm font-medium">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-bold transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Result header bar */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center justify-between mb-6 bg-white rounded-2xl border border-[#e8edf7] px-5 py-3.5 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faFilter} className="text-[#032e92] text-sm" />
                        <span className="text-sm font-semibold text-gray-700">
                          Showing{' '}
                          <span className="text-[#032e92] font-bold">{filteredFunds.length}</span>
                          {' '}Fund{filteredFunds.length !== 1 ? 's' : ''}
                          {filteredFunds.length !== fundsData.length && (
                            <span className="text-gray-400 font-medium"> of {fundsData.length} total</span>
                          )}
                        </span>
                      </div>

                      {/* View Toggle */}
                      <div className="flex items-center gap-1 bg-[#f7f9fc] border border-[#e8edf7] rounded-xl p-1">
                        <button
                          onClick={() => setIsGrid(false)}
                          title="List View"
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            !isGrid
                              ? 'bg-[#032e92] text-white shadow-md shadow-blue-900/20'
                              : 'text-gray-500 hover:text-[#032e92]'
                          }`}
                        >
                          <FontAwesomeIcon icon={faList} />
                          <span className="hidden sm:inline">List</span>
                        </button>
                        <button
                          onClick={() => setIsGrid(true)}
                          title="Grid View"
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            isGrid
                              ? 'bg-[#032e92] text-white shadow-md shadow-blue-900/20'
                              : 'text-gray-500 hover:text-[#032e92]'
                          }`}
                        >
                          <FontAwesomeIcon icon={faTableCellsLarge} />
                          <span className="hidden sm:inline">Grid</span>
                        </button>
                      </div>
                    </motion.div>

                    {/* Fund Cards */}
                    <FundGrid
                      funds={loading ? [] : paginatedFunds}
                      isGrid={isGrid}
                      loading={loading}
                    />

                    {/* Pagination */}
                    {!loading && filteredFunds.length > 0 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                          setCurrentPage(page)
                          window.scrollTo({ top: 400, behavior: 'smooth' })
                        }}
                      />
                    )}

                    {!loading && filteredFunds.length === 0 && (
                      <div className="text-center py-12 text-gray-500 font-medium">
                        No funds match your current filters.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>

          {/* 8. Investment Philosophy */}
          <InvestmentPhilosophy />

          {/* 9. SIF vs Traditional Instruments Comparison */}
          <Comparison />

          {/* 10. Trust & Security */}
          <TrustSection />

          {/* 11. Testimonials */}
          <Testimonials />

          {/* 12. Frequently Asked Questions */}
          <FAQ />

          {/* 13. Newsletter */}
          <Newsletter />
        </main>

        <Footer />
      </div>
  )
}
