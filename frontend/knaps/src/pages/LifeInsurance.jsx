import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/seo/SEO';
import { PAGE_SEO } from '../components/seo/seoConfig';

// Life Insurance Modular Components
import LifeInsuranceHero from '../components/LifeInsurance/LifeInsuranceHero';
import WhyLifeInsurance from '../components/LifeInsurance/WhyLifeInsurance';
import LifeInsuranceTypes from '../components/LifeInsurance/LifeInsuranceTypes';
import LifeInsuranceCalculator from '../components/LifeInsurance/LifeInsuranceCalculator';
import LifeInsuranceHowItWorks from '../components/LifeInsurance/LifeInsuranceHowItWorks';
import LifeInsuranceBenefits from '../components/LifeInsurance/LifeInsuranceBenefits';
import LifeInsuranceWhoShouldBuy from '../components/LifeInsurance/LifeInsuranceWhoShouldBuy';
import LifeInsuranceWhyChooseUs from '../components/LifeInsurance/LifeInsuranceWhyChooseUs';
import LifeInsuranceFAQ from '../components/LifeInsurance/LifeInsuranceFAQ';
import LifeInsuranceCTA from '../components/LifeInsurance/LifeInsuranceCTA';

export default function LifeInsurance() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-[#f7f9fc] min-h-screen">
      {/* 
        =======================================================================
        PAGE SEO CONFIGURATION
        Managed centrally in src/components/seo/seoConfig.js (under PAGE_SEO.lifeInsurance).
        To change title, description, or keywords, simply edit seoConfig.js!
        =======================================================================
      */}
      <SEO
        pageKey="lifeInsurance"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          { name: "Life Insurance", url: "/products/life-insurance" }
        ]}
      />
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <LifeInsuranceHero />

        {/* 2. Why Life Insurance? */}
        <WhyLifeInsurance />

        {/* 3. Types of Life Insurance */}
        <LifeInsuranceTypes />

        {/* 4. Interactive Coverage Calculator / Estimator */}
        <LifeInsuranceCalculator />

        {/* 5. How It Works */}
        {/* <LifeInsuranceHowItWorks /> */}

        {/* 6. Key Benefits */}
        {/* <LifeInsuranceBenefits /> */}

        {/* 7. Who Should Consider Life Insurance? */}
        {/* <LifeInsuranceWhoShouldBuy /> */}

        {/* 8. Why Choose Us */}
        <LifeInsuranceWhyChooseUs />

        {/* 9. FAQ Section */}
        <LifeInsuranceFAQ />

        {/* 10. Final Call to Action */}
        <LifeInsuranceCTA />
      </main>

      <Footer />
    </div>
  );
}
