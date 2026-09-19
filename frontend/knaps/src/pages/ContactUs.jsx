import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServicesHero from '../components/services/ServicesHero';
import LuxuryContactSection from '../components/contact/LuxuryContactSection';
import OfficeExperience from '../components/contact/OfficeExperience';
import PremiumFAQ from '../components/contact/PremiumFAQ';
import ContactCTA from '../components/contact/ContactCTA';
import CTA from '../components/CTA';

export default function ContactUs() {

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      <Navbar />

      <main>
        {/* Reusing ServicesHero with Contact context */}
        <ServicesHero
          label="CONTACT US"
          title="Let's Build Your Financial Future "
          titleHighlight="Together"
          description="Whether you're planning investments, retirement, insurance, or wealth creation, our experienced advisors are here to guide you every step of the way."
          breadcrumbText="Contact Us"
          breadcrumbLink="/contact"
        />

        {/* The new premium sections */}
        <LuxuryContactSection />

        <OfficeExperience />

        {/* <PremiumFAQ /> */}

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
