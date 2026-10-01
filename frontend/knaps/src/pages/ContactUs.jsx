import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactHero from '../components/contact/ContactHero';
import LuxuryContactSection from '../components/contact/LuxuryContactSection';
import OfficeExperience from '../components/contact/OfficeExperience';
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
        {/* Contact Hero matching Blogs breadcrumb hero layout */}
        <ContactHero />

        {/* The premium contact sections */}
        <LuxuryContactSection />

        <OfficeExperience />

        <CTA />
      </main>

      <Footer />
    </div>
  );
}