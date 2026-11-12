import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/seo/SEO';
import { PAGE_SEO } from '../components/seo/seoConfig';

// NPS Modular Components
import NpsHero from '../components/NationalPensionSystem/NpsHero';
import WhatIsNps from '../components/NationalPensionSystem/WhatIsNps';
import NpsModelExplorer from '../components/NationalPensionSystem/NpsModelExplorer';
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
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-[#f7f9fc] min-h-screen">
      {/* 
        =======================================================================
        PAGE SEO CONFIGURATION
        Managed centrally in src/components/seo/seoConfig.js (under PAGE_SEO.nps).
        To change title, description, or keywords, simply edit seoConfig.js!
        =======================================================================
      */}
      <SEO
        pageKey="nps"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          { name: "National Pension System", url: "/nps" }
        ]}
      />
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <NpsHero />

        {/* 2. What is NPS? */}
        <WhatIsNps />

        {/* 2.1. NPS Models & Categories Explorer (Master-Detail Navigational Tabs) */}
        <NpsModelExplorer />

        {/* 3. Why Consider NPS? */}
        <WhyConsiderNps />

        {/* 4. How NPS Works (4-step visual journey) */}
        {/* <HowNpsWorks /> */}

        {/* 5. Key Features */}
        {/* <NpsKeyFeatures /> */}

        {/* 6. NPS Account Types (Tier I vs Tier II) */}
        {/* <NpsAccountTypes /> */}

        {/* 7. Investment Choices (E, C, G, A) */}
        {/* <NpsInvestmentChoices /> */}

        {/* 8. Active Choice vs Auto Choice */}
        {/* <ActiveVsAutoChoice /> */}

        {/* 9. Interactive NPS Retirement Calculator */}
        <NpsCalculator />

        {/* 10. Retirement Corpus Growth */}
        {/* <RetirementCorpusGrowth /> */}

        {/* 11. NPS Tax Benefits */}
        {/* <NpsTaxBenefits /> */}

        {/* 12. NPS at Retirement / Exit */}
        {/* <NpsExitAndRetirement /> */}

        {/* 13. NPS vs Mutual Funds vs Fixed Deposits */}
        {/* <NpsComparisonTable /> */}

        {/* 14. Who May Consider NPS? */}
        {/* <WhoShouldConsiderNps /> */}

        {/* 15. Risks & Things to Know */}
        {/* <NpsRisks /> */}

        {/* 16. Important NPS Considerations */}
        {/* <NpsImportantConsiderations /> */}

        {/* 17. FAQ Section */}
        <NpsFAQ />

        {/* 18. Final Call to Action */}
        <NpsCTA />
      </main>

      <Footer />
    </div>
  );
}
