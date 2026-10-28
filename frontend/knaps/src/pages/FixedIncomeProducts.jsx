import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Fixed Income Modular Components (Featuring Fixed Deposits & GoI Bonds)
import FixedDepositHero from "../components/FixedDeposit/FixedDepositHero";
import WhatIsFixedDeposit from "../components/FixedDeposit/WhatIsFixedDeposit";
import WhyConsiderFixedDeposit from "../components/FixedDeposit/WhyConsiderFixedDeposit";
import HowFixedDepositWorks from "../components/FixedDeposit/HowFixedDepositWorks";
import FixedDepositKeyFeatures from "../components/FixedDeposit/FixedDepositKeyFeatures";
import FixedDepositTypes from "../components/FixedDeposit/FixedDepositTypes";
import FixedDepositComparison from "../components/FixedDeposit/FixedDepositComparison";
import FixedDepositCalculator from "../components/FixedDeposit/FixedDepositCalculator";
import FixedDepositInterestMaturity from "../components/FixedDeposit/FixedDepositInterestMaturity";
import WhoShouldConsiderFD from "../components/FixedDeposit/WhoShouldConsiderFD";
import FixedDepositRisks from "../components/FixedDeposit/FixedDepositRisks";
import FixedDepositTaxation from "../components/FixedDeposit/FixedDepositTaxation";
import FixedDepositFAQ from "../components/FixedDeposit/FixedDepositFAQ";
import FixedDepositCTA from "../components/FixedDeposit/FixedDepositCTA";

export default function FixedIncomeProducts() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Fixed Income Products: Fixed Deposits & GoI Bonds | KNAPS";
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-[#f7f9fc] min-h-screen">
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <FixedDepositHero />

        {/* 2. What are Fixed Income Products? */}
        <WhatIsFixedDeposit />

        {/* 3. Why Invest in Fixed Income Products? */}
        <WhyConsiderFixedDeposit />

        {/* 4. How Fixed Income Works (4-Step Visual Journey) */}
        <HowFixedDepositWorks />

        {/* 5. Key Features */}
        <FixedDepositKeyFeatures />

        {/* 6. Product Catalogue: Fixed Deposits (FD) & Government of India (GoI) Bonds */}
        <FixedDepositTypes />

        {/* 7. Comprehensive Comparison Matrix: Bank FD vs Corporate FD vs GoI Bonds vs 54EC */}
        <FixedDepositComparison />

        {/* 8. Interactive Dual Calculator: FD Maturity & GoI Bond Cashflow */}
        <FixedDepositCalculator />

        {/* 9. Interest Payout & Compounding Dynamics */}
        <FixedDepositInterestMaturity />

        {/* 10. Who Should Consider Fixed Income Products? */}
        <WhoShouldConsiderFD />

        {/* 11. Important Risks & Due Diligence */}
        <FixedDepositRisks />

        {/* 12. Taxation, TDS & Section 54EC Exemptions */}
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
