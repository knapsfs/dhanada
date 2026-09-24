import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// NPS Modular Components
import NpsHero from '../components/NationalPensionSystem/NpsHero';
import WhatIsNps from '../components/NationalPensionSystem/WhatIsNps';
import WhyConsiderNps from '../components/NationalPensionSystem/WhyConsiderNps';
import HowNpsWorks from '../components/NationalPensionSystem/HowNpsWorks';
import NpsKeyFeatures from '../components/NationalPensionSystem/NpsKeyFeatures';
import NpsAccountTypes from '../components/NationalPensionSystem/NpsAccountTypes';
import NpsInvestmentChoices from '../components/NationalPensionSystem/NpsInvestmentChoices';
import ActiveVsAutoChoice from '../components/NationalPensionSystem/ActiveVsAutoChoice';
import NpsCalculator from '../components/NationalPensionSystem/NpsCalculator';
import RetirementCorpusGrowth from '../components/NationalPensionSystem/RetirementCorpusGrowth';
import NpsTaxBenefits from '../components/NationalPensionSystem/NpsTaxBenefits';
import NpsExitAndRetirement from '../components/NationalPensionSystem/NpsExitAndRetirement';
import NpsComparisonTable from '../components/NationalPensionSystem/NpsComparisonTable';
import WhoShouldConsiderNps from '../components/NationalPensionSystem/WhoShouldConsiderNps';
import NpsRisks from '../components/NationalPensionSystem/NpsRisks';
import NpsImportantConsiderations from '../components/NationalPensionSystem/NpsImportantConsiderations';
import NpsFAQ from '../components/NationalPensionSystem/NpsFAQ';
import NpsCTA from '../components/NationalPensionSystem/NpsCTA';

export default function NationalPensionSystem() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'National Pension System (NPS) | Retirement Planning & Tax Savings | KNAPS';
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-[#f7f9fc] min-h-screen">
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <NpsHero />

        {/* 2. What is NPS? */}
        <WhatIsNps />

        {/* 3. Why Consider NPS? */}
        <WhyConsiderNps />

        {/* 4. How NPS Works (4-step visual journey) */}
        <HowNpsWorks />

        {/* 5. Key Features */}
        <NpsKeyFeatures />

        {/* 6. NPS Account Types (Tier I vs Tier II) */}
        <NpsAccountTypes />

        {/* 7. Investment Choices (E, C, G, A) */}
        <NpsInvestmentChoices />

        {/* 8. Active Choice vs Auto Choice */}
        <ActiveVsAutoChoice />

        {/* 9. Interactive NPS Retirement Calculator */}
        <NpsCalculator />

        {/* 10. Retirement Corpus Growth */}
        <RetirementCorpusGrowth />

        {/* 11. NPS Tax Benefits */}
        <NpsTaxBenefits />

        {/* 12. NPS at Retirement / Exit */}
        <NpsExitAndRetirement />

        {/* 13. NPS vs Mutual Funds vs Fixed Deposits */}
        <NpsComparisonTable />

        {/* 14. Who May Consider NPS? */}
        <WhoShouldConsiderNps />

        {/* 15. Risks & Things to Know */}
        <NpsRisks />

        {/* 16. Important NPS Considerations */}
        <NpsImportantConsiderations />

        {/* 17. FAQ Section */}
        <NpsFAQ />

        {/* 18. Final Call to Action */}
        <NpsCTA />
      </main>

      <Footer />
    </div>
  );
}
