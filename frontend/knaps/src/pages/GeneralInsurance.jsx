import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// General Insurance Modular Components
import GeneralInsuranceHero from '../components/GeneralInsurance/GeneralInsuranceHero';
import WhyGeneralInsurance from '../components/GeneralInsurance/WhyGeneralInsurance';
import GeneralInsuranceCategories from '../components/GeneralInsurance/GeneralInsuranceCategories';
import GeneralInsuranceFinder from '../components/GeneralInsurance/GeneralInsuranceFinder';
import GeneralInsuranceHowItWorks from '../components/GeneralInsurance/GeneralInsuranceHowItWorks';
import GeneralInsuranceBenefits from '../components/GeneralInsurance/GeneralInsuranceBenefits';
import GeneralInsuranceWhyChooseUs from '../components/GeneralInsurance/GeneralInsuranceWhyChooseUs';
import GeneralInsuranceFAQ from '../components/GeneralInsurance/GeneralInsuranceFAQ';
import GeneralInsuranceCTA from '../components/GeneralInsurance/GeneralInsuranceCTA';

export default function GeneralInsurance() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-[#f7f9fc] min-h-screen">
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <GeneralInsuranceHero />

        {/* 2. Why General Insurance? */}
        <WhyGeneralInsurance />

        {/* 3. Insurance Categories (Health, Motor, Travel, Home, Accident, Commercial) */}
        <GeneralInsuranceCategories />

        {/* 4. Find the Right Cover (Interactive Category/Requirement Selector) */}
        <GeneralInsuranceFinder />

        {/* 5. How It Works (4-Step Visual Journey) */}
        <GeneralInsuranceHowItWorks />

        {/* 6. Key Benefits (Risk Transfer, Cashless Network, Zero Dep, 80D, RSA) */}
        <GeneralInsuranceBenefits />

        {/* 7. Why Choose Us (Unbiased Advisory, Claims Concierge, Trust Metrics) */}
        <GeneralInsuranceWhyChooseUs />

        {/* 8. FAQ Section */}
        <GeneralInsuranceFAQ />

        {/* 9. Closing Call to Action */}
        <GeneralInsuranceCTA />
      </main>

      <Footer />
    </div>
  );
}
