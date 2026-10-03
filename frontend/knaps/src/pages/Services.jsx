import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Service Components
import ServicesHero from '../components/services/ServicesHero';
import ServicesIntro from '../components/services/ServicesIntro';
import ServicesGrid from '../components/services/ServicesGrid';
import ServicesProcess from '../components/services/ServicesProcess';
import WhyChooseServices from '../components/services/WhyChooseServices';
import CTA from '../components/CTA';

export default function Services() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-[#f7f9fc] min-h-screen">
      <Navbar />

      <main>
        <ServicesHero />
        <ServicesIntro />
        <ServicesGrid />
        <ServicesProcess />
        <WhyChooseServices />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
