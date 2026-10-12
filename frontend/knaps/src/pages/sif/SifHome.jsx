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
// import Testimonials from '../../components/sif/Testimonials'
import FAQ from '../../components/sif/FAQ'
import Newsletter from '../../components/sif/Newsletter'

// SIF Fund Directory Components
import FundsHero from '../../components/sif/FundsHero'
import FundsTable from '../../components/sif/FundsTable'

export default function SifHome() {
  const [totalFunds, setTotalFunds] = useState(33)

  // FundSelector state (3 fund comparator slots)
  const [selectedFunds, setSelectedFunds] = useState([null, null, null])

  // Handle slot selection in FundSelector
  const handleFundSelect = (index, fundItem) => {
    setSelectedFunds(prev => {
      const updated = [...prev]
      // fundItem can be full fund object or {id, name, ...}
      updated[index] = typeof fundItem === 'object' ? fundItem : (fundItem ? { id: fundItem } : null)
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
          <FundsHero totalFunds={totalFunds} />

          <div className="py-12 sm:py-16 bg-[#ffffff]">
            <div className="max-w-[86rem] mx-auto px-2 lg:px-2">
              <FundsTable
                onTotalCountChange={(count) => {
                  if (count) setTotalFunds(count)
                }}
              />
            </div>
          </div>
        </section>

        {/* 3. Compare Top SIF Schemes */}
        <TopFunds
          selectedFunds={selectedFunds}
          onFundSelect={handleFundSelect}
          onReset={handleResetSelector}
        />

        {/* 4. Performance Heatmap */}
        <HeatmapSection />

        {/* 5. Investment Philosophy */}
        <InvestmentPhilosophy />

        {/* 6. SIF vs Traditional Instruments Comparison */}
        <Comparison />

        {/* 7. Trust & Security */}
        <TrustSection />

        {/* 8. Testimonials */}
        {/* <Testimonials /> */}

        {/* 9. Frequently Asked Questions */}
        <FAQ />

        {/* 10. Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}
