import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Service Components
import ServicesHero from '../components/services/ServicesHero';
import ServicesIntro from '../components/services/ServicesIntro';
import ServicesGrid from '../components/services/ServicesGrid';
import WhyChooseServices from '../components/services/WhyChooseServices';
import ServicesCTA from '../components/services/ServicesCTA';
import CTA from '../components/CTA';

export default function Services() {
  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      <Navbar />

      <main>
        <ServicesHero />
        <ServicesIntro />
        <ServicesGrid />
        <WhyChooseServices />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
