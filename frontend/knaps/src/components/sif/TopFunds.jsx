import { useState, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import FundSelector from './FundSelector'
import InlineComparison from './InlineComparison'
import { fetchFundsSelectorList } from '../../api/funds'

const tabs = ['All', 'Equity', 'Debt', 'Hybrid']

export default function TopFunds({
  fundsData,
  selectedFunds = [null, null, null],
  onFundSelect,
  onReset
}) {
  const [activeTab, setActiveTab] = useState('All')
  const [isComparisonVisible, setIsComparisonVisible] = useState(false)
  const [selectorFunds, setSelectorFunds] = useState(fundsData || [])
  const comparisonRef = useRef(null)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  // Load lightweight selector options once on mount if not passed
  useEffect(() => {
    let isMounted = true;
    async function loadSelector() {
      try {
        const list = await fetchFundsSelectorList();
        if (isMounted && Array.isArray(list)) {
          setSelectorFunds(list);
        }
      } catch (e) {
        console.error('Failed to load selector funds:', e);
      }
    }
    if (!fundsData || fundsData.length === 0) {
      loadSelector();
    }
    return () => { isMounted = false; };
  }, []);

  const activeCount = useMemo(() => {
    return selectedFunds.filter(f => f !== null).length
  }, [selectedFunds])

  // Automatically hide comparison if fewer than 2 funds remain selected
  useEffect(() => {
    if (activeCount < 2 && isComparisonVisible) {
      setIsComparisonVisible(false)
    }
  }, [activeCount, isComparisonVisible])

  const availableFundsForSelector = useMemo(() => {
    const source = selectorFunds.length > 0 ? selectorFunds : fundsData;
    if (activeTab === 'All') return source
    return source.filter(f => {
      const textToSearch = `${f.schemeType || ''} ${f.category || ''} ${f.investmentStrategy || ''}`.toLowerCase()
      return textToSearch.includes(activeTab.toLowerCase())
    })
  }, [activeTab, selectorFunds, fundsData])

  const handleCompare = () => {
    if (activeCount >= 2) {
      setIsComparisonVisible(true)
      setTimeout(() => {
        if (comparisonRef.current) {
          comparisonRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, 100)
    }
  }

  const handleReset = () => {
    setIsComparisonVisible(false)
    if (onReset) {
      onReset()
    }
  }

  return (
    <section id="top-funds" className="py-12 sm:py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-sm font-semibold mb-4">
            📈 Top Performing Funds
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Compare Top <span className="gradient-text">SIF Schemes</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            Compare India’s leading SIF schemes across investment strategy, portfolio construction, risk management and performance.
          </p>
        </motion.div>

        {/* Tabs */}
        {/* <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
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
        </div> */}

        {/* 3-Slot Fund Selector placed directly below tabs */}
        <FundSelector
          selectedFunds={selectedFunds}
          onFundSelect={onFundSelect}
          onReset={handleReset}
          onCompare={handleCompare}
          availableFunds={availableFundsForSelector}
        />

        {/* Unified Inline Comparison Container (rendered only when user clicks Compare) */}
        <InlineComparison
          ref={comparisonRef}
          selectedFunds={selectedFunds}
          isVisible={isComparisonVisible}
        />
      </div>
    </section>
  )
}