import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ELSS Modular Components
import ELSSHero from '../components/ELSS/ELSSHero';
import WhatIsELSS from '../components/ELSS/WhatIsELSS';
import WhyConsiderELSS from '../components/ELSS/WhyConsiderELSS';
import HowELSSWorks from '../components/ELSS/HowELSSWorks';
import ELSSFeatures from '../components/ELSS/ELSSFeatures';
import ELSSComparison from '../components/ELSS/ELSSComparison';
import ELSSCalculator from '../components/ELSS/ELSSCalculator';
import WhoShouldConsiderELSS from '../components/ELSS/WhoShouldConsiderELSS';
import ELSSRisks from '../components/ELSS/ELSSRisks';
import ELSSFAQ from '../components/ELSS/ELSSFAQ';
import ELSSCTA from '../components/ELSS/ELSSCTA';

export default function ELSS() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-[#f7f9fc] min-h-screen">
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <ELSSHero />

        {/* 2. What is ELSS? */}
        <WhatIsELSS />

        {/* 3. Why Consider ELSS? */}
        <WhyConsiderELSS />

        {/* 4. How ELSS Works (4-step visual journey) */}
        <HowELSSWorks />

        {/* 5. Key Features */}
        <ELSSFeatures />

        {/* 6. ELSS vs Other Tax-Saving Options (Comparison Table) */}
        <ELSSComparison />

        {/* 7. Interactive ELSS Investment & Tax-Saving Calculator */}
        <ELSSCalculator />

        {/* 8. Who May Consider ELSS? */}
        <WhoShouldConsiderELSS />

        {/* 9. Risks & Things to Know */}
        <ELSSRisks />

        {/* 10. FAQ Section */}
        <ELSSFAQ />

        {/* 11. Final Call to Action */}
        <ELSSCTA />
      </main>

      <Footer />
    </div>
  );
}
