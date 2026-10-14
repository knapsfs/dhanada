import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Small Savings Schemes Modular Components
import SmallSavingsHero from '../components/SmallSavingsSchemes/SmallSavingsHero';
import WhatAreSmallSavingsSchemes from '../components/SmallSavingsSchemes/WhatAreSmallSavingsSchemes';
import WhyConsiderSmallSavings from '../components/SmallSavingsSchemes/WhyConsiderSmallSavings';
import HowSmallSavingsWork from '../components/SmallSavingsSchemes/HowSmallSavingsWork';
import PopularSmallSavingsSchemes from '../components/SmallSavingsSchemes/PopularSmallSavingsSchemes';
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
    document.title = 'Small Savings Schemes | Government Backed Savings, PPF, SSY & SCSS | KNAPS';
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-[#f7f9fc] min-h-screen">
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <SmallSavingsHero />

        {/* 2. What are Small Savings Schemes? */}
        <WhatAreSmallSavingsSchemes />

        {/* 3. Why Consider Small Savings Schemes? */}
        <WhyConsiderSmallSavings />

        {/* 4. How Small Savings Schemes Work */}
        <HowSmallSavingsWork />

        {/* 5. Popular Small Savings Schemes (PPF, SSY, SCSS, POMIS, NSC) */}
        <PopularSmallSavingsSchemes />

        {/* 6. Comprehensive Scheme Explorer (Filters across all 9 instruments) */}
        <SchemeExplorer />

        {/* 7. Key Features */}
        <SmallSavingsKeyFeatures />

        {/* 8. Comprehensive Comparison Table */}
        <CompareSmallSavingsSchemes />

        {/* 9. Interactive Multi-Scheme Savings Calculator */}
        <SmallSavingsCalculator />

        {/* 10. Goal-Based Savings Framework */}
        <GoalBasedSavings />

        {/* 11. Tax Benefits & Taxation (EEE vs EET vs Taxable) */}
        <SmallSavingsTaxBenefits />

        {/* 12. Interest Rates & Government Notifications (G-Sec benchmark formula) */}
        <InterestRateNotifications />

        {/* 13. Liquidity, Withdrawals & Premature Exit Rules */}
        <LiquidityAndWithdrawals />

        {/* 14. Small Savings vs Other Investments (FD, RD, Debt Mutual Funds) */}
        <SmallSavingsVsOthers />

        {/* 15. Who May Consider Small Savings Schemes? */}
        <WhoShouldConsiderSmallSavings />

        {/* 16. Risks & Things to Know */}
        <SmallSavingsRisks />

        {/* 17. Important Considerations & Operational Rules */}
        <SmallSavingsImportantConsiderations />

        {/* 18. Frequently Asked Questions (Accordion + Search) */}
        <SmallSavingsFAQ />

        {/* 19. Final CTA with Lead Capture */}
        <SmallSavingsCTA />
      </main>

      <Footer />
    </div>
  );
}
