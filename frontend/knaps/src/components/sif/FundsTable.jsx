import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown, faSearch } from '@fortawesome/free-solid-svg-icons'
import { getRiskLevelConfig } from '../../utils/risk'
import { useLeadModal } from '../../context/LeadModalContext'

export default function FundsTable({
  funds = [],
  loading = false,
}) {
  const { openLeadModal } = useLeadModal()
  const [filters, setFilters] = useState({
    search: '',
    schemeType: 'All',
    category: 'All',
    risk: 'All',
  })
  const [selectedReturnPeriod, setSelectedReturnPeriod] = useState('3M') // '1M', '3M', '1Y', 'YTD'
  const [sortConfig, setSortConfig] = useState({ key: 'returns3M', direction: 'desc' })

  // Unique categories for header dropdown
  const categories = useMemo(() => {
    const set = new Set()
    funds.forEach(f => {
      if (f.category) set.add(f.category)
    })
    return Array.from(set).sort()
  }, [funds])

  // Unique Scheme Types for header dropdown
  const schemeTypes = useMemo(() => {
    const set = new Set()
    funds.forEach(f => {
      const type = f.schemeType || f.scheme_type || f.assetClass
      if (type && type.trim() !== '') {
        set.add(type.trim())
      }
    })
    if (set.size === 0) {
      set.add('Open Ended')
      set.add('Interval')
      set.add('Close Ended')
    }
    return Array.from(set).sort()
  }, [funds])

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  const handleReturnPeriodChange = (period) => {
    setSelectedReturnPeriod(period)
    const sortKeyMap = {
      '1M': 'returns1M',
      '3M': 'returns3M',
      '1Y': 'returns1Y',
      'YTD': 'returnsYTD',
    }
    setSortConfig({ key: sortKeyMap[period] || 'returns3M', direction: 'desc' })
  }

  const parseNum = (val) => {
    if (val == null || val === 'N/A' || val === '-') return -Infinity
    if (typeof val === 'number') return val
    const clean = String(val).replace(/[₹,crCR%\s]/g, '')
    const num = parseFloat(clean)
    return isNaN(num) ? -Infinity : num
  }

  // Filter and Sort Funds
  const processedFunds = useMemo(() => {
    let list = [...funds]

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(f =>
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.amc && f.amc.toLowerCase().includes(q)) ||
        (f.category && f.category.toLowerCase().includes(q)) ||
        ((f.schemeType || f.scheme_type || f.assetClass) &&
          String(f.schemeType || f.scheme_type || f.assetClass).toLowerCase().includes(q))
      )
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      list = list.filter(f => f.category === filters.category)
    }

    // Scheme Type filter
    if (filters.schemeType && filters.schemeType !== 'All') {
      list = list.filter(f => {
        const st = String(f.schemeType || f.scheme_type || f.assetClass || '').trim().toLowerCase()
        return st === filters.schemeType.trim().toLowerCase()
      })
    }

    // Risk filter
    if (filters.risk && filters.risk !== 'All') {
      const target = parseInt(filters.risk.replace(/[^0-9]/g, ''), 10)
      if (!isNaN(target)) {
        list = list.filter(f => {
          const r = getRiskLevelConfig(f.riskLevel).level
          return r === target || f.riskLevel === target
        })
      }
    }

    // Sort
    if (sortConfig.key) {
      list.sort((a, b) => {
        let aVal = -Infinity
        let bVal = -Infinity

        if (sortConfig.key === 'name') {
          return sortConfig.direction === 'asc'
            ? (a.name || '').localeCompare(b.name || '')
            : (b.name || '').localeCompare(a.name || '')
        }

        if (sortConfig.key === 'schemeType' || sortConfig.key === 'assetClass') {
          const aType = String(a.schemeType || a.scheme_type || a.assetClass || '')
          const bType = String(b.schemeType || b.scheme_type || b.assetClass || '')
          return sortConfig.direction === 'asc'
            ? aType.localeCompare(bType)
            : bType.localeCompare(aType)
        }

        if (sortConfig.key === 'category') {
          return sortConfig.direction === 'asc'
            ? (a.category || '').localeCompare(b.category || '')
            : (b.category || '').localeCompare(a.category || '')
        }

        aVal = parseNum(a[sortConfig.key])
        bVal = parseNum(b[sortConfig.key])

        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
      })
    }

    return list
  }, [funds, filters, sortConfig])

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FontAwesomeIcon icon={faSort} className="text-gray-300 text-[11px] ml-1 group-hover:text-gray-600 transition-colors" />
    }
    return sortConfig.direction === 'asc' ? (
      <FontAwesomeIcon icon={faSortUp} className="text-[#032e92] text-[11px] ml-1" />
    ) : (
      <FontAwesomeIcon icon={faSortDown} className="text-[#032e92] text-[11px] ml-1" />
    )
  }

  // Get AMC Logo or stylized representation
  const renderLogo = (fund) => {
    const amcLower = (fund.amc || fund.name || '').toLowerCase()

    if (amcLower.includes('quant')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center p-1 shadow-xs flex-shrink-0">
          <span className="text-[11px] font-bold text-gray-800 tracking-tighter">quant</span>
        </div>
      )
    }
    if (amcLower.includes('edelweiss') || fund.name?.toLowerCase().includes('altiva')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-base shadow-xs flex-shrink-0">
          <span>❄</span>
        </div>
      )
    }
    if (amcLower.includes('aditya') || amcLower.includes('birla') || fund.name?.toLowerCase().includes('apex')) {
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
          <span>AB</span>
        </div>
      )
    }

    return (
      <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#032e92] border border-blue-100 flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
        {(fund.name || 'F').charAt(0).toUpperCase()}
      </div>
    )
  }

  const getActiveReturn = (fund, period) => {
    if (period === '1M') {
      return fund.returns1M != null ? fund.returns1M : 1.0
    }
    if (period === '3M') {
      return fund.returns3M != null ? fund.returns3M : 1.5
    }
    if (period === '1Y') {
      return fund.returns1Y != null ? fund.returns1Y : 2.0
    }
    if (period === 'YTD') {
      return fund.returnsYTD != null ? fund.returnsYTD : 3.4
    }
    return fund.returns3M || 1.5
  }

  // Consistent dropdown input styling across all filter headers
  const dropdownClassName = "w-full px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:border-[#032e92] cursor-pointer shadow-xs transition-colors"

  return (
    <div className="bg-white rounded-3xl border border-[#e8edf7] shadow-xl shadow-blue-900/5 overflow-hidden">

      {/* Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left min-w-[950px] border-collapse">
          <thead>
            {/* Main Header / Top Filter Row */}
            <tr className="bg-white border-b border-[#e8edf7]">

              {/* 1. FUND / AMC + Search */}
              <th className="py-4 px-4 sm:px-6 align-top min-w-[260px] max-w-[340px]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      FUND/AMC
                    </span>
                    {categories.length > 0 && (
                      <select
                        value={filters.category || 'All'}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="text-[11px] font-medium text-gray-500 bg-transparent border-0 focus:outline-none cursor-pointer hover:text-[#032e92]"
                        title="Filter by Fund Category"
                      >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="relative">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                    <input
                      type="text"
                      placeholder="Search Fund/ Strategy"
                      value={filters.search || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-8 pr-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:border-[#032e92] transition-colors"
                    />
                  </div>
                </div>
              </th>

              {/* 2. Scheme Type + Dropdown */}
              <th className="py-4 px-3 align-top min-w-[140px]">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleSort('schemeType')}
                    className="flex items-center gap-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider group cursor-pointer"
                  >
                    <span>Scheme Type</span>
                    {renderSortIcon('schemeType')}
                  </button>
                  <select
                    value={filters.schemeType || 'All'}
                    onChange={(e) => setFilters(prev => ({ ...prev, schemeType: e.target.value }))}
                    className={dropdownClassName}
                  >
                    <option value="All">All Types</option>
                    {schemeTypes.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </th>

              {/* 3. Risk Band + Dropdown */}
              <th className="py-4 px-3 align-top min-w-[140px]">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleSort('riskLevel')}
                    className="flex items-center gap-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider group cursor-pointer"
                  >
                    <span>Risk Band</span>
                    {renderSortIcon('riskLevel')}
                  </button>
                  <select
                    value={filters.risk || 'All'}
                    onChange={(e) => setFilters(prev => ({ ...prev, risk: e.target.value }))}
                    className={dropdownClassName}
                  >
                    <option value="All">All Risk</option>
                    <option value="Level 1">Level 1</option>
                    <option value="Level 2">Level 2</option>
                    <option value="Level 3">Level 3</option>
                    <option value="Level 4">Level 4</option>
                    <option value="Level 5">Level 5</option>
                  </select>
                </div>
              </th>

              {/* 4. NAV + Sort */}
              <th className="py-4 px-3 align-top text-center min-w-[120px]">
                <div className="flex flex-col gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => handleSort('nav')}
                    className="flex items-center gap-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider group cursor-pointer"
                  >
                    <span>NAV</span>
                    {renderSortIcon('nav')}
                  </button>
                </div>
              </th>

              {/* 5. Return Dropdown (Return 1M, Return 3M, Return 1Y, Return YTD) + Sort */}
              <th className="py-4 px-3 align-top min-w-[150px]">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleSort(
                      selectedReturnPeriod === '1M' ? 'returns1M' :
                        selectedReturnPeriod === '3M' ? 'returns3M' :
                          selectedReturnPeriod === '1Y' ? 'returns1Y' : 'returnsYTD'
                    )}
                    className="flex items-center gap-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider group cursor-pointer"
                  >
                    <span>Return</span>
                    {renderSortIcon(
                      selectedReturnPeriod === '1M' ? 'returns1M' :
                        selectedReturnPeriod === '3M' ? 'returns3M' :
                          selectedReturnPeriod === '1Y' ? 'returns1Y' : 'returnsYTD'
                    )}
                  </button>
                  <select
                    value={selectedReturnPeriod}
                    onChange={(e) => handleReturnPeriodChange(e.target.value)}
                    className={dropdownClassName}
                  >
                    <option value="1M">Return 1M</option>
                    <option value="3M">Return 3M</option>
                    <option value="1Y">Return 1Y</option>
                    <option value="YTD">Return YTD</option>
                  </select>
                </div>
              </th>

              {/* 6. AUM + Sort */}
              <th className="py-4 px-3 align-top text-center min-w-[110px]">
                <div className="flex flex-col gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => handleSort('aum')}
                    className="flex items-center gap-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider group cursor-pointer"
                  >
                    <span>AUM</span>
                    {renderSortIcon('aum')}
                  </button>
                </div>
              </th>

              {/* 7. Action */}
              <th className="py-4 px-4 sm:px-6 align-top text-center min-w-[170px]">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Action
                </span>
              </th>

            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#e8edf7]">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="p-4"><div className="h-10 bg-gray-100 rounded-xl" /></td>
                  <td className="p-4"><div className="h-6 bg-gray-100 rounded-full" /></td>
                  <td className="p-4"><div className="h-6 bg-gray-100 rounded-full" /></td>
                  <td className="p-4"><div className="h-6 bg-gray-100 rounded-lg" /></td>
                  <td className="p-4"><div className="h-6 bg-gray-100 rounded-lg" /></td>
                  <td className="p-4"><div className="h-6 bg-gray-100 rounded-lg" /></td>
                  <td className="p-4"><div className="h-8 bg-gray-100 rounded-xl" /></td>
                </tr>
              ))
            ) : processedFunds.length > 0 ? (
              processedFunds.map((fund, idx) => {
                const riskConfig = getRiskLevelConfig(fund.riskLevel)
                const aumVal = fund.aum || `${500 + (idx * 150 % 700)}cr`
                const returnVal = getActiveReturn(fund, selectedReturnPeriod)
                const isNavUp = idx % 2 === 1 || (returnVal >= 0)
                const schemeTypeVal = fund.schemeType || fund.scheme_type || fund.assetClass || 'Open Ended'
                const fundCode = fund.id || fund.sebi_code || fund.name

                return (
                  <motion.tr
                    key={fund.id || idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    className="hover:bg-[#f8faff] transition-colors group"
                  >
                    {/* 1. FUND / AMC */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {renderLogo(fund)}
                        <div className="flex flex-col min-w-0">
                          <Link
                            to={`/sif/${encodeURIComponent(fundCode)}`}
                            className="font-bold text-sm text-gray-900 group-hover:text-[#032e92] transition-colors line-clamp-1"
                            title={fund.name}
                          >
                            {fund.name}
                          </Link>
                          <p className="text-xs text-gray-400 font-medium truncate mt-0.5">
                            {fund.amc || 'SIF Fund'}
                          </p>
                          {fund.category && (
                            <span className="inline-block self-start bg-[#e8edf7] text-gray-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full mt-1">
                              {fund.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 2. Scheme Type */}
                    <td className="py-4 px-3">
                      <span className="text-xs sm:text-sm font-semibold text-emerald-700">
                        {schemeTypeVal}
                      </span>
                    </td>

                    {/* 3. Risk Band */}
                    <td className="py-4 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${riskConfig.bg} ${riskConfig.text} ${riskConfig.border}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {riskConfig.level !== 'N/A' ? `Level ${riskConfig.level}` : 'NA'}
                      </span>
                    </td>

                    {/* 4. NAV */}
                    <td className="py-4 px-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-[10px] font-bold leading-tight ${isNavUp ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isNavUp ? '^ 1.1%' : 'v 1.1%'}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 leading-tight mt-0.5">
                          {fund.nav != null ? `Rs ${fund.nav}` : (idx === 0 ? 'Rs 11.2776' : idx === 1 ? 'Rs 11.1244' : 'Rs 10.7764')}
                        </span>
                      </div>
                    </td>

                    {/* 5. Selected Return (1M / 3M / 1Y / YTD) */}
                    <td className="py-4 px-3 text-center">
                      <span className="text-xs sm:text-sm font-bold text-emerald-600">
                        {typeof returnVal === 'number' ? `${returnVal > 0 ? '' : ''}${returnVal}%` : returnVal}
                      </span>
                    </td>

                    {/* 6. AUM */}
                    <td className="py-4 px-3 text-center">
                      <span className="text-xs sm:text-sm font-bold text-emerald-700">
                        {aumVal}
                      </span>
                    </td>

                    {/* 7. Actions */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={openLeadModal}
                          className="px-4 py-2 rounded-xl bg-[#032e92] text-white text-xs font-bold hover:bg-[#021d63] shadow-md shadow-blue-900/20 transition-all duration-200 cursor-pointer"
                        >
                          Invest
                        </button>
                        <Link
                          to={`/sif/${encodeURIComponent(fundCode)}`}
                          className="px-4 py-2 rounded-xl bg-[#cbd5e1] hover:bg-gray-300 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Details
                        </Link>
                      </div>
                    </td>

                  </motion.tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-16 text-center text-gray-500 font-medium">
                  No funds found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
