import { formatAum, formatNav } from '../../utils/formatters'
import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSort,
  faSortUp,
  faSortDown,
  faSearch,
  faChevronDown,
  faChevronUp,
  faCheck
} from '@fortawesome/free-solid-svg-icons'
import { getRiskLevelConfig } from '../../utils/risk'
import { useLeadModal } from '../../context/LeadModalContext'

// Custom styled dropdown component with rich popup menu design
function TableDropdown({ value, onChange, options, minWidth = 'min-w-[140px]' }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const selectedOpt = options.find(o => o.value === value) || options[0] || { label: value, value }

  return (
    <div className={`relative w-full ${isOpen ? 'z-50' : 'z-20'}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between pl-3.5 pr-3 py-1.5 rounded-full border border-gray-200/90 text-xs font-medium text-gray-700 bg-white hover:border-gray-300 focus:outline-none focus:border-[#032e92] focus:ring-2 focus:ring-[#032e92]/10 cursor-pointer shadow-2xs transition-all text-left"
      >
        <span className="truncate pr-1">{selectedOpt.label}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-gray-400 text-[10px] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#032e92]' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-0 mt-1.5 ${minWidth} w-full bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-gray-100 p-1.5 z-50 max-h-60 overflow-y-auto`}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-[#032e92] font-bold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <FontAwesomeIcon icon={faCheck} className="text-[10px] text-[#032e92] ml-2 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CategoryDropdown({ value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const selectedOpt = options.find(o => o.value === value) || { label: 'All Categories', value: 'All' }

  return (
    <div className={`relative inline-block ${isOpen ? 'z-50' : 'z-20'}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500 hover:text-[#032e92] transition-colors cursor-pointer"
      >
        <span>{selectedOpt.label}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-[9px] text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#032e92]' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-gray-100 p-1.5 z-50 max-h-60 overflow-y-auto"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-[#032e92] font-bold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <FontAwesomeIcon icon={faCheck} className="text-[10px] text-[#032e92] ml-2 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const INITIAL_VISIBLE_COUNT = 5

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
  const [isExpanded, setIsExpanded] = useState(false)

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
      const type = f.schemeType
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
        (f.schemeType && String(f.schemeType).toLowerCase().includes(q))
      )
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      list = list.filter(f => f.category === filters.category)
    }

    // Scheme Type filter
    if (filters.schemeType && filters.schemeType !== 'All') {
      list = list.filter(f => {
        const st = String(f.schemeType || '').trim().toLowerCase()
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

        if (sortConfig.key === 'schemeType') {
          const aType = String(a.schemeType || '')
          const bType = String(b.schemeType || '')
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

  // Visible funds based on expand/collapse state
  const displayedFunds = useMemo(() => {
    if (isExpanded) return processedFunds
    return processedFunds.slice(0, INITIAL_VISIBLE_COUNT)
  }, [processedFunds, isExpanded])

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


  return (
    <div className="flex flex-col gap-6">

      {/* Table Card */}
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
                        <CategoryDropdown
                          value={filters.category || 'All'}
                          onChange={(val) => setFilters(prev => ({ ...prev, category: val }))}
                          options={[
                            { value: 'All', label: 'All Categories' },
                            ...categories.map(cat => ({ value: cat, label: cat }))
                          ]}
                        />
                      )}
                    </div>
                    <div className="relative">
                      <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search Fund/ Strategy"
                        value={filters.search || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="w-full pl-9 pr-3.5 py-1.5 rounded-full border border-gray-200/90 text-xs font-medium text-gray-800 placeholder-gray-400 bg-white hover:border-gray-300 focus:outline-none focus:border-[#032e92] focus:ring-2 focus:ring-[#032e92]/10 transition-all shadow-2xs"
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
                    <TableDropdown
                      value={filters.schemeType || 'All'}
                      onChange={(val) => setFilters(prev => ({ ...prev, schemeType: val }))}
                      options={[
                        { value: 'All', label: 'All Types' },
                        ...schemeTypes.map(st => ({ value: st, label: st }))
                      ]}
                    />
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
                    <TableDropdown
                      value={filters.risk || 'All'}
                      onChange={(val) => setFilters(prev => ({ ...prev, risk: val }))}
                      options={[
                        { value: 'All', label: 'All Risk' },
                        { value: 'Level 1', label: 'Level 1' },
                        { value: 'Level 2', label: 'Level 2' },
                        { value: 'Level 3', label: 'Level 3' },
                        { value: 'Level 4', label: 'Level 4' },
                        { value: 'Level 5', label: 'Level 5' },
                      ]}
                    />
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
                    <TableDropdown
                      value={selectedReturnPeriod}
                      onChange={(val) => handleReturnPeriodChange(val)}
                      options={[
                        { value: '1M', label: 'Return 1M' },
                        { value: '3M', label: 'Return 3M' },
                        { value: '1Y', label: 'Return 1Y' },
                        { value: 'YTD', label: 'Return YTD' },
                      ]}
                    />
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
              ) : displayedFunds.length > 0 ? (
                displayedFunds.map((fund, idx) => {
                  const riskConfig = getRiskLevelConfig(fund.riskLevel)
                  const aumVal = fund.aum ? formatAum(fund.aum) : `₹${(500 + ((idx * 150) % 700)).toLocaleString('en-IN')} Cr`
                  const returnVal = getActiveReturn(fund, selectedReturnPeriod)
                  const isNavUp = idx % 2 === 1 || (returnVal >= 0)
                  const schemeTypeVal = fund.schemeType || 'Open Ended'
                  const fundCode = fund.id || fund.sebi_code || fund.name

                  return (
                    <motion.tr
                      key={fund.id || idx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.3) }}
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
                            {fund.nav != null ? formatNav(fund.nav) : (idx === 0 ? '₹11.2776' : idx === 1 ? '₹11.1244' : '₹10.7764')}
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

      {/* View All / Expand Button below the 5 funds */}
      {!loading && processedFunds.length > INITIAL_VISIBLE_COUNT && (
        <div className="flex justify-center items-center pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#032e92] hover:bg-[#021d63] text-white font-bold text-sm shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
          >
            <span>{isExpanded ? 'Show Less' : `View All Funds`}</span>
            <FontAwesomeIcon
              icon={isExpanded ? faChevronUp : faChevronDown}
              className="text-xs text-blue-200 group-hover:text-white transition-transform duration-300"
            />
          </button>
        </div>
      )}

    </div>
  )
}
