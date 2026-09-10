import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

// Layout
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

// API
import { fetchFundsList } from '../../api/funds'

// SIF Landing Components
import Hero from '../../components/sif/Hero'
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
import FundsTable from '../../components/sif/FundsTable'

export default function SifHome() {
  const [fundsData, setFundsData] = useState([])
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

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-sans text-gray-900">
      <Navbar />

      <main>
        {/* 1. SIF Hero */}
        <Hero />

        {/* 2. Complete SIF Fund Directory with Tabular Format */}
        <section id="funds-directory">
          <FundsHero totalFunds={fundsData.length || 33} />

          <div className="py-6 sm:py-10 bg-[#f7f9fc]">
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
                <FundsTable
                  funds={fundsData}
                  loading={loading}
                />
              )}
            </div>
          </div>
        </section>

        {/* 3. Compare Top SIF Schemes */}
        {!loading && fundsData.length > 0 && (
          <TopFunds
            fundsData={fundsData}
            selectedFunds={selectedFunds}
            onFundSelect={handleFundSelect}
            onReset={handleResetSelector}
          />
        )}

        {/* 4. Performance Heatmap */}
        {!loading && fundsData.length > 0 && <HeatmapSection fundsData={fundsData} />}

        {/* 5. Investment Philosophy */}
        <InvestmentPhilosophy />

        {/* 6. SIF vs Traditional Instruments Comparison */}
        <Comparison />

        {/* 7. Trust & Security */}
        <TrustSection />

        {/* 8. Testimonials */}
        <Testimonials />

        {/* 9. Frequently Asked Questions */}
        <FAQ />

        {/* 10. Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}
