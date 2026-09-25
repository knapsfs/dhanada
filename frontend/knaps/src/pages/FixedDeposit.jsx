import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Fixed Deposit Modular Components
import FixedDepositHero from '../components/FixedDeposit/FixedDepositHero';
import WhatIsFixedDeposit from '../components/FixedDeposit/WhatIsFixedDeposit';
import WhyConsiderFixedDeposit from '../components/FixedDeposit/WhyConsiderFixedDeposit';
import HowFixedDepositWorks from '../components/FixedDeposit/HowFixedDepositWorks';
import FixedDepositKeyFeatures from '../components/FixedDeposit/FixedDepositKeyFeatures';
import FixedDepositTypes from '../components/FixedDeposit/FixedDepositTypes';
import FixedDepositComparison from '../components/FixedDeposit/FixedDepositComparison';
import FixedDepositCalculator from '../components/FixedDeposit/FixedDepositCalculator';
import FixedDepositInterestMaturity from '../components/FixedDeposit/FixedDepositInterestMaturity';
import WhoShouldConsiderFD from '../components/FixedDeposit/WhoShouldConsiderFD';
import FixedDepositRisks from '../components/FixedDeposit/FixedDepositRisks';
import FixedDepositTaxation from '../components/FixedDeposit/FixedDepositTaxation';
import FixedDepositFAQ from '../components/FixedDeposit/FixedDepositFAQ';
import FixedDepositCTA from '../components/FixedDeposit/FixedDepositCTA';

export default function FixedDeposit() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Fixed Deposits (FD) | Predictable Interest & Structured Savings | KNAPS';
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-[#f7f9fc] min-h-screen">
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <FixedDepositHero />

        {/* 2. What is a Fixed Deposit? */}
        <WhatIsFixedDeposit />

        {/* 3. Why Consider Fixed Deposits? */}
        <WhyConsiderFixedDeposit />

        {/* 4. How Fixed Deposit Works (4-Step Visual Journey) */}
        <HowFixedDepositWorks />

        {/* 5. Key Features */}
        <FixedDepositKeyFeatures />

        {/* 6. Types of Fixed Deposits */}
        <FixedDepositTypes />

        {/* 7. Comparison Table: Bank FD vs Corporate FD vs Alternatives */}
        <FixedDepositComparison />

        {/* 8. Interactive Fixed Deposit Maturity & Interest Calculator */}
        <FixedDepositCalculator />

        {/* 9. Interest Payout & Compounding Dynamics */}
        <FixedDepositInterestMaturity />

        {/* 10. Who Should Consider Fixed Deposits? */}
        <WhoShouldConsiderFD />

        {/* 11. Important Risks & Factors to Consider */}
        <FixedDepositRisks />

        {/* 12. Taxation & TDS Overview */}
        <FixedDepositTaxation />

        {/* 13. Frequently Asked Questions */}
        <FixedDepositFAQ />

        {/* 14. Final Call to Action */}
        <FixedDepositCTA />
      </main>

      <Footer />
    </div>
  );
}
