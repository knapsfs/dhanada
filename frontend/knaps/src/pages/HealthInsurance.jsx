import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Health Insurance Modular Components
import HealthInsuranceHero from '../components/HealthInsurance/HealthInsuranceHero';
import WhyHealthInsurance from '../components/HealthInsurance/WhyHealthInsurance';
import HealthInsurancePlans from '../components/HealthInsurance/HealthInsurancePlans';
import HealthInsuranceBenefits from '../components/HealthInsurance/HealthInsuranceBenefits';
import HealthInsuranceHowItWorks from '../components/HealthInsurance/HealthInsuranceHowItWorks';
import HealthInsuranceCoverageExplorer from '../components/HealthInsurance/HealthInsuranceCoverageExplorer';
import HealthInsuranceCalculator from '../components/HealthInsurance/HealthInsuranceCalculator';
import HealthInsuranceWhyChooseUs from '../components/HealthInsurance/HealthInsuranceWhyChooseUs';
import HealthInsuranceFAQ from '../components/HealthInsurance/HealthInsuranceFAQ';
import HealthInsuranceCTA from '../components/HealthInsurance/HealthInsuranceCTA';

export default function HealthInsurance() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-[#f7f9fc] min-h-screen">
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <HealthInsuranceHero />

        {/* 2. Why Health Insurance? */}
        <WhyHealthInsurance />

        {/* 3. Health Insurance Plans */}
        <HealthInsurancePlans />

        {/* 4. Key Benefits */}
        <HealthInsuranceBenefits />

        {/* 5. How It Works (4-step visual journey) */}
        <HealthInsuranceHowItWorks />

        {/* 6. Interactive Coverage Explorer */}
        <HealthInsuranceCoverageExplorer />

        {/* 7. Health Insurance Calculator / Estimator */}
        <HealthInsuranceCalculator />

        {/* 8. Why Choose Us */}
        <HealthInsuranceWhyChooseUs />

        {/* 9. FAQ Section */}
        <HealthInsuranceFAQ />

        {/* 10. Final Call to Action */}
        <HealthInsuranceCTA />
      </main>

      <Footer />
    </div>
  );
}
