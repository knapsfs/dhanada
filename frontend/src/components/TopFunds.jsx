import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight, faArrowTrendUp, faStar, faSort, faSortUp, faSortDown
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { getRiskLevelConfig } from '../utils/risk'

const tabs = ['All', 'Equity', 'Debt', 'Hybrid']

export default function TopFunds({ fundsData = [] }) {
  const [activeTab, setActiveTab] = useState('All')
  const [sortConfig, setSortConfig] = useState({ key: 'returns1Y', direction: 'desc' })
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const navigate = useNavigate()

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'desc' }
    })
  }

  const getSortedFunds = (data) => {
    return [...data].sort((a, b) => {
      let aVal = -Infinity
      let bVal = -Infinity

      if (sortConfig.key === 'nav') {
        aVal = a.nav != null ? parseFloat(a.nav) : -Infinity
        bVal = b.nav != null ? parseFloat(b.nav) : -Infinity
      } else if (sortConfig.key === 'returns1Y') {
        aVal = a.returns1Y != null ? parseFloat(a.returns1Y) : -Infinity
        bVal = b.returns1Y != null ? parseFloat(b.returns1Y) : -Infinity
      } else if (sortConfig.key === 'riskLevel') {
        const aRisk = getRiskLevelConfig(a.riskLevel).level
        const bRisk = getRiskLevelConfig(b.riskLevel).level
        aVal = aRisk !== 'N/A' ? parseFloat(aRisk) : -Infinity
        bVal = bRisk !== 'N/A' ? parseFloat(bRisk) : -Infinity
      } else if (sortConfig.key === 'aum') {
        aVal = a.aum != null ? parseFloat(a.aum) : -Infinity
        bVal = b.aum != null ? parseFloat(b.aum) : -Infinity
      }

      if (sortConfig.direction === 'asc') {
        return aVal - bVal
      } else {
        return bVal - aVal
      }
    })
  }

  const filtered = activeTab === 'All'
    ? getSortedFunds(fundsData).slice(0, 5) // Show top 5
    : getSortedFunds(fundsData.filter(f => {
      const textToSearch = `${f.assetClass || ''} ${f.category || ''} ${f.investmentStrategy || ''}`.toLowerCase();
      return textToSearch.includes(activeTab.toLowerCase());
    })).slice(0, 5);

  const handleFundClick = (id) => {
    navigate(`/funds/${encodeURIComponent(id)}`);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FontAwesomeIcon icon={faSort} className="text-white/40 text-[11px] group-hover/th:text-white transition-colors ml-1" />
    }
    return sortConfig.direction === 'asc' ? (
      <FontAwesomeIcon icon={faSortUp} className="text-amber-300 text-[11px] ml-1" />
    ) : (
      <FontAwesomeIcon icon={faSortDown} className="text-amber-300 text-[11px] ml-1" />
    )
  }

  return (
    <section id="top-funds" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
            🔥 Top Performing Funds
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Compare Top <span className="gradient-text">SIF Schemes</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            Carefully curated, research-backed funds with consistent performance across market cycles.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === tab
                ? 'bg-[#032e92] text-white shadow-lg shadow-blue-900/20'
                : 'bg-[#f7f9fc] text-gray-600 hover:bg-[#eef4ff] hover:text-[#032e92] border border-[#e8edf7]'
                }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-[#e8edf7] overflow-hidden shadow-lg shadow-blue-900/5">
          {/* Blue Table Header with Sortable Columns */}
          <div className="hidden lg:grid bg-[#032e92] grid-cols-7 gap-4 px-6 py-4 text-xs font-bold text-white uppercase tracking-wider items-center select-none">
            <div className="col-span-2">Fund Name</div>

            <button
              type="button"
              onClick={() => handleSort('nav')}
              className="flex items-center gap-1 hover:text-blue-200 transition-colors cursor-pointer text-left group/th font-bold uppercase tracking-wider"
              title="Click to sort by NAV"
            >
              <span>NAV</span>
              {renderSortIcon('nav')}
            </button>

            <button
              type="button"
              onClick={() => handleSort('returns1Y')}
              className="flex items-center gap-1 hover:text-blue-200 transition-colors cursor-pointer text-left group/th font-bold uppercase tracking-wider"
              title="Click to sort by 1Y Returns"
            >
              <span>1Y Returns</span>
              {renderSortIcon('returns1Y')}
            </button>

            <button
              type="button"
              onClick={() => handleSort('riskLevel')}
              className="flex items-center gap-1 hover:text-blue-200 transition-colors cursor-pointer text-left group/th font-bold uppercase tracking-wider"
              title="Click to sort by Risk"
            >
              <span>Risk</span>
              {renderSortIcon('riskLevel')}
            </button>

            <button
              type="button"
              onClick={() => handleSort('aum')}
              className="flex items-center gap-1 hover:text-blue-200 transition-colors cursor-pointer text-left group/th font-bold uppercase tracking-wider"
              title="Click to sort by AUM"
            >
              <span>AUM</span>
              {renderSortIcon('aum')}
            </button>

            <div className="text-center">Action</div>
          </div>

          <AnimatePresence>
            {filtered.length > 0 ? filtered.map((fund, i) => {
              return (
                <motion.div
                  key={fund.id}
                  onClick={() => handleFundClick(fund.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="flex flex-col lg:grid lg:grid-cols-7 gap-4 lg:items-center px-4 py-5 lg:px-6 border-b border-[#e8edf7] hover:bg-[#f7f9fc] transition-colors group cursor-pointer relative">

                  {/* Fund Name */}
                  <div className="col-span-2 flex items-center gap-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#032e92] transition-colors line-clamp-2 lg:line-clamp-1">
                        {fund.name}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {fund.category}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid on Mobile */}
                  <div className="grid grid-cols-2 gap-4 lg:contents mt-2 lg:mt-0 bg-gray-50 lg:bg-transparent rounded-xl p-3 lg:p-0">
                    {/* NAV */}
                    <div>
                      <p className="lg:hidden text-[10px] text-gray-400 uppercase font-semibold mb-1">NAV</p>
                      <p className="text-sm font-bold text-gray-800">{fund.nav != null ? `₹${fund.nav}` : 'N/A'}</p>
                      <p className="hidden lg:block text-xs text-gray-400">NAV</p>
                    </div>

                    {/* Returns */}
                    <div>
                      <p className="lg:hidden text-[10px] text-gray-400 uppercase font-semibold mb-1">1Y Returns</p>
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faArrowTrendUp} className="text-green-500 text-xs" />
                        <span className="text-sm font-bold text-green-600">{fund.returns1Y != null ? `${fund.returns1Y}%` : 'N/A'}</span>
                      </div>
                      <p className="hidden lg:block text-xs text-gray-400">Annualized</p>
                    </div>

                    {/* Risk */}
                    <div>
                      <p className="lg:hidden text-[10px] text-gray-400 uppercase font-semibold mb-1">Risk</p>
                      <div className="flex gap-2 text-xs font-semibold">
                        <span className={`px-2.5 py-1 rounded-full border ${getRiskLevelConfig(fund.riskLevel).bg} ${getRiskLevelConfig(fund.riskLevel).text} ${getRiskLevelConfig(fund.riskLevel).border}`}>
                          {getRiskLevelConfig(fund.riskLevel).level !== 'N/A' ? `Level ${getRiskLevelConfig(fund.riskLevel).level}` : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* AUM */}
                    <div>
                      <p className="lg:hidden text-[10px] text-gray-400 uppercase font-semibold mb-1">AUM</p>
                      <p className="text-sm font-semibold text-gray-700">{fund.aum != null ? `₹${fund.aum} Cr` : 'N/A'}</p>
                      {fund.rating ? (
                        <div className="flex">
                          {Array.from({ length: fund.rating }).map((_, rIdx) => (
                            <FontAwesomeIcon key={rIdx} icon={faStar} className="text-amber-400 text-[10px]" />
                          ))}
                        </div>
                      ) : <span className="text-[10px] text-gray-400">Unrated</span>}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex justify-center mt-2 lg:mt-0 w-full lg:w-auto">
                    <button className="w-full lg:w-auto btn-ripple px-4 py-2 rounded-full bg-[#032e92] text-white text-xs font-semibold hover:bg-[#021d63] shadow-md shadow-blue-900/20 transition-all duration-200 flex items-center justify-center gap-1.5 group-hover:scale-105 cursor-pointer">
                      View Fund
                      <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                    </button>
                  </div>
                </motion.div>
              )
            }) : (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">
                No funds found in this category.
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center mt-8">
          <a href="/funds" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#032e92] text-[#032e92] font-semibold hover:bg-[#032e92] hover:text-white transition-all duration-200">
            View All Funds
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>
    </section>
  )
}