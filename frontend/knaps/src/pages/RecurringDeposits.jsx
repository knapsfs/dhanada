import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Recurring Deposits Modular Components
import RecurringDepositHero from '../components/RecurringDeposits/RecurringDepositHero';
import WhatIsRecurringDeposit from '../components/RecurringDeposits/WhatIsRecurringDeposit';
import WhyConsiderRecurringDeposit from '../components/RecurringDeposits/WhyConsiderRecurringDeposit';
import HowRecurringDepositWorks from '../components/RecurringDeposits/HowRecurringDepositWorks';
import RecurringDepositKeyFeatures from '../components/RecurringDeposits/RecurringDepositKeyFeatures';
import RecurringDepositTypes from '../components/RecurringDeposits/RecurringDepositTypes';
import RecurringDepositCalculator from '../components/RecurringDeposits/RecurringDepositCalculator';
import MonthlySavingsJourney from '../components/RecurringDeposits/MonthlySavingsJourney';
import RecurringDepositMaturityBreakdown from '../components/RecurringDeposits/RecurringDepositMaturityBreakdown';
import RecurringDepositComparison from '../components/RecurringDeposits/RecurringDepositComparison';
import RdVsSipComparison from '../components/RecurringDeposits/RdVsSipComparison';
import WhoShouldConsiderRD from '../components/RecurringDeposits/WhoShouldConsiderRD';
import RecurringDepositRisks from '../components/RecurringDeposits/RecurringDepositRisks';
import RecurringDepositTaxation from '../components/RecurringDeposits/RecurringDepositTaxation';
import RecurringDepositFAQ from '../components/RecurringDeposits/RecurringDepositFAQ';
import RecurringDepositCTA from '../components/RecurringDeposits/RecurringDepositCTA';

export default function RecurringDeposits() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Recurring Deposits (RD) | Structured Monthly Savings & Predictable Interest | KNAPS';
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-[#f7f9fc] min-h-screen">
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <RecurringDepositHero />

        {/* 2. What is RD? */}
        <WhatIsRecurringDeposit />

        {/* 3. Why Consider RD? */}
        <WhyConsiderRecurringDeposit />

        {/* 4. How RD Works (4-Step Visual Journey) */}
        <HowRecurringDepositWorks />

        {/* 5. Key Features */}
        <RecurringDepositKeyFeatures />

        {/* 6. Types of RD */}
        <RecurringDepositTypes />

        {/* 7. RD Calculator */}
        <RecurringDepositCalculator />

        {/* 8. Monthly Savings Journey */}
        <MonthlySavingsJourney />

        {/* 9. RD Maturity Breakdown */}
        <RecurringDepositMaturityBreakdown />

        {/* 10. RD vs FD vs Savings Account */}
        <RecurringDepositComparison />

        {/* 11. RD vs SIP */}
        <RdVsSipComparison />

        {/* 12. Who May Consider RD? */}
        <WhoShouldConsiderRD />

        {/* 13. Risks & Things to Know */}
        <RecurringDepositRisks />

        {/* 14. Taxation & Important Considerations */}
        <RecurringDepositTaxation />

        {/* 15. FAQ Section */}
        <RecurringDepositFAQ />

        {/* 16. Final Call to Action */}
        <RecurringDepositCTA />
      </main>

      <Footer />
    </div>
  );
}
