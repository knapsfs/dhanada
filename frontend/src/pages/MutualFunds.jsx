import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/seo/SEO';
import { PAGE_SEO } from '../components/seo/seoConfig';

// Mutual Funds Modular Components
import MfHero from '../components/MutualFunds/MfHero';
import WhatAreMutualFunds from '../components/MutualFunds/WhatAreMutualFunds';
import MfTypes from '../components/MutualFunds/MfTypes';
import WhyInvestMf from '../components/MutualFunds/WhyInvestMf';
import ExploreFunds from '../components/MutualFunds/ExploreFunds';
import MfCalculator from '../components/MutualFunds/MfCalculator';
import HowToInvestMf from '../components/MutualFunds/HowToInvestMf';
import MfRisksAndTaxation from '../components/MutualFunds/MfRisksAndTaxation';
import MfFAQ from '../components/MutualFunds/MfFAQ';
import MfCTA from '../components/MutualFunds/MfCTA';

export default function MutualFunds() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-[#f7f9fc] min-h-screen">
      {/* 
        =======================================================================
        PAGE SEO CONFIGURATION
        Managed centrally in src/components/seo/seoConfig.js (under PAGE_SEO.mutualFunds).
        To change title, description, or keywords, simply edit seoConfig.js!
        =======================================================================
      */}
      <SEO
        pageKey="mutualFunds"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          { name: "Mutual Funds", url: "/mutual-funds" }
        ]}
      />
      <Navbar />

      <main>
        {/* 1. Hero: "Invest Smarter with Mutual Funds" */}
        <MfHero />

        {/* 2. What Are Mutual Funds? */}
        <WhatAreMutualFunds />

        {/* 3. Types of Mutual Funds */}
        <MfTypes />

        {/* 4. Why Invest in Mutual Funds? */}
        {/* <WhyInvestMf /> */}

        {/* 5. Explore Funds (Interactive Cards with Filters) */}
        {/* <ExploreFunds /> */}

        {/* 6. SIP & Lumpsum Calculator */}
        {/* <MfCalculator /> */}

        {/* 7. How to Invest (4-Step Roadmap) */}
        {/* <HowToInvestMf /> */}

        {/* 8. Risks & Things to Know (Market fluctuations, TER, exit load, Budget 2024 tax) */}
        {/* <MfRisksAndTaxation /> */}

        {/* 9. FAQ Section */}
        <MfFAQ />

        {/* 10. Final Call to Action */}
        <MfCTA />
      </main>

      <Footer />
    </div>
  );
}
