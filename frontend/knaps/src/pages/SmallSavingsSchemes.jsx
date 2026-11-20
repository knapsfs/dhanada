import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/seo/SEO';
import { PAGE_SEO } from '../components/seo/seoConfig';

// Post Office Small Savings Schemes Modular Components
import SmallSavingsHero from '../components/SmallSavingsSchemes/SmallSavingsHero';
import WhatAreSmallSavingsSchemes from '../components/SmallSavingsSchemes/WhatAreSmallSavingsSchemes';
import WhyConsiderSmallSavings from '../components/SmallSavingsSchemes/WhyConsiderSmallSavings';
import HowSmallSavingsWork from '../components/SmallSavingsSchemes/HowSmallSavingsWork';
import SchemeExplorer from '../components/SmallSavingsSchemes/SchemeExplorer';
import SmallSavingsKeyFeatures from '../components/SmallSavingsSchemes/SmallSavingsKeyFeatures';
import CompareSmallSavingsSchemes from '../components/SmallSavingsSchemes/CompareSmallSavingsSchemes';
import SmallSavingsCalculator from '../components/SmallSavingsSchemes/SmallSavingsCalculator';
import GoalBasedSavings from '../components/SmallSavingsSchemes/GoalBasedSavings';
import SmallSavingsTaxBenefits from '../components/SmallSavingsSchemes/SmallSavingsTaxBenefits';
import InterestRateNotifications from '../components/SmallSavingsSchemes/InterestRateNotifications';
import LiquidityAndWithdrawals from '../components/SmallSavingsSchemes/LiquidityAndWithdrawals';
import SmallSavingsVsOthers from '../components/SmallSavingsSchemes/SmallSavingsVsOthers';
import WhoShouldConsiderSmallSavings from '../components/SmallSavingsSchemes/WhoShouldConsiderSmallSavings';
import SmallSavingsRisks from '../components/SmallSavingsSchemes/SmallSavingsRisks';
import SmallSavingsImportantConsiderations from '../components/SmallSavingsSchemes/SmallSavingsImportantConsiderations';
import SmallSavingsFAQ from '../components/SmallSavingsSchemes/SmallSavingsFAQ';
import SmallSavingsCTA from '../components/SmallSavingsSchemes/SmallSavingsCTA';

export default function SmallSavingsSchemes() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-[#f7f9fc] min-h-screen">
      {/* 
        =======================================================================
        PAGE SEO CONFIGURATION
        Managed centrally in src/components/seo/seoConfig.js (under PAGE_SEO.postOffice).
        To change title, description, or keywords, simply edit seoConfig.js!
        =======================================================================
      */}
      <SEO
        pageKey="postOffice"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          { name: "Post Office Small Savings Schemes", url: "/products/post-office-small-savings-schemes" }
        ]}
      />
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <SmallSavingsHero />

        {/* 2. What are Post Office Small Savings Schemes? */}
        <WhatAreSmallSavingsSchemes />

        {/* 3. Why Consider Post Office Small Savings Schemes? */}
        <WhyConsiderSmallSavings />

        {/* 4. How Post Office Small Savings Schemes Work */}
        {/* <HowSmallSavingsWork /> */}

        {/* 5. Comprehensive Scheme Explorer */}
        <SchemeExplorer />

        {/* 6. Key Features */}
        {/* <SmallSavingsKeyFeatures /> */}

        {/* 7. Comprehensive Comparison Table */}
        {/* <CompareSmallSavingsSchemes /> */}

        {/* 8. Interactive Post Office Savings Calculator */}
        <SmallSavingsCalculator />

        {/* 9. Goal-Based Savings Alignment */}
        {/* <GoalBasedSavings /> */}

        {/* 10. Tax Benefits & Rules (Section 80C & Deemed Reinvestment) */}
        {/* <SmallSavingsTaxBenefits /> */}

        {/* 11. Interest Rates & Government Notifications */}
        {/* <InterestRateNotifications /> */}

        {/* 12. Liquidity, Withdrawals & Premature Exit Rules */}
        {/* <LiquidityAndWithdrawals /> */}

        {/* 13. Small Savings vs Other Investments (FD, RD, Debt Mutual Funds) */}
        {/* <SmallSavingsVsOthers /> */}

        {/* 14. Who May Consider Post Office Schemes? */}
        {/* <WhoShouldConsiderSmallSavings /> */}

        {/* 15. Risks & Things to Know */}
        {/* <SmallSavingsRisks /> */}

        {/* 16. Important Considerations & Operational Rules */}
        {/* <SmallSavingsImportantConsiderations /> */}

        {/* 17. Frequently Asked Questions */}
        <SmallSavingsFAQ />

        {/* 18. Final CTA with Lead Capture */}
        <SmallSavingsCTA />
      </main>

      <Footer />
    </div>
  );
}
