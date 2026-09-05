import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass, faChevronDown
} from '@fortawesome/free-solid-svg-icons'

const sortOptions = [
  { label: 'Returns', value: 'returns' },
  { label: 'Risk', value: 'risk' },
  { label: 'Newest', value: 'newest' },
]

export default function FundFilters({ filters, setFilters, onClear, amcList = [], fundsData = [] }) {
  const [activeTab, setActiveTab] = useState('assetClass')

  const handleChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val === 'All' ? '' : val }))
  }

  // Use investmentStrategy for the UI "Asset Class" based on user requirements
  const dynamicAssetClasses = ['All', ...Array.from(new Set(fundsData.map(f => f.investmentStrategy).filter(Boolean))).sort()];
  const dynamicCategories = ['All', ...Array.from(new Set(fundsData.map(f => f.category).filter(Boolean))).sort()];
  const dynamicRiskLevels = useMemo(() => {
    const risks = new Set()
    fundsData.forEach(f => {
      if (f.riskLevel !== 'N/A') {
        risks.add(f.riskLevel)
      }
    })
    return ['All', ...Array.from(risks).sort().map(r => `Risk Level ${r}`)]
  }, [fundsData])

  const tabs = [
    { id: 'assetClass', label: 'Asset Class', options: dynamicAssetClasses },
    { id: 'category', label: 'Fund Category', options: dynamicCategories },
    { id: 'risk', label: 'Risk Level', options: dynamicRiskLevels },
  ]

  const activeTabData = tabs.find(t => t.id === activeTab)

  return (
    <section className="bg-[#f7f9fc] pb-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Unified Container */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-[#e8edf7] flex flex-col overflow-hidden">
          
          {/* Main Filter Bar (Top) */}
          <div className="p-3 lg:px-4 lg:py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#e8edf7]">
            
            {/* Left Side: Category Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(isActive ? null : tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#eef4ff] text-[#032e92]' 
                        : 'bg-transparent text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`text-[10px] transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} 
                    />
                  </button>
                )
              })}
            </div>

            {/* Right Side: Search and Sort */}
            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              {/* Search */}
              <div className="relative w-full lg:w-64">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Search Fund..."
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-[#e8edf7] text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#032e92] focus:ring-2 focus:ring-[#032e92]/10 transition-all bg-gray-50/50" />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-500">Sort by:</span>
                <div className="flex items-center gap-1.5">
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFilters(prev => ({ ...prev, sort: opt.value }))}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                        filters.sort === opt.value
                          ? 'bg-white text-gray-800 border-gray-300 shadow-sm'
                          : 'bg-transparent text-gray-500 border-[#e8edf7] hover:border-gray-300 hover:text-gray-700'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Expanded Options Area */}
          <AnimatePresence>
            {activeTab && activeTabData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-white"
              >
                <div className="p-6 lg:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                      {activeTabData.label}
                    </h3>
                    <button 
                      onClick={() => handleChange(activeTabData.id, 'All')}
                      className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      All selected
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-8 gap-y-5">
                    {activeTabData.options.map(opt => {
                      const isChecked = (filters[activeTabData.id] || 'All') === opt
                      return (
                        <label 
                          key={opt}
                          onClick={() => handleChange(activeTabData.id, opt)}
                          className="flex items-center gap-3 cursor-pointer group w-full sm:w-[calc(50%-2rem)] md:w-[calc(33.33%-2rem)] lg:w-[calc(25%-2rem)]"
                        >
                          <div className={`w-5 h-5 rounded-full border-[6px] flex-shrink-0 transition-all ${
                            isChecked 
                              ? 'border-[#032e92] bg-white' 
                              : 'border-gray-200 bg-white group-hover:border-gray-300'
                          }`} />
                          <span className={`text-sm font-medium leading-tight ${
                            isChecked ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-800'
                          }`}>
                            {opt}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
