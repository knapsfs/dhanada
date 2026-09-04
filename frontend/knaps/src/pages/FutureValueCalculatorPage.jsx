import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FutureValueCalculator from '../components/FutureValueCalculator/FutureValueCalculator'
import Newsletter from '../components/Newsletter'

export default function FutureValueCalculatorPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Navbar />
      <main className="pt-10">
        <FutureValueCalculator />
        {/* <Newsletter /> */}
      </main>
      <Footer />
    </div>
  )
}
