import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// New Minimal Components
import AboutBreadcrumbHero from '../components/about/AboutBreadcrumbHero';
import AboutCompany from '../components/about/AboutCompany';
import AboutValues from '../components/about/AboutValues';
import AboutWhyInvestors from '../components/about/AboutWhyInvestors';
import AboutJourney from '../components/about/AboutJourney';
import Stats from '../components/Stats';
import AboutLeadership from '../components/about/AboutLeadership';
import AboutCallToAction from '../components/about/AboutCallToAction';
import CTA from '../components/CTA';

export default function AboutUs() {
  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      <Navbar />

      <main>
        <AboutBreadcrumbHero />
        <AboutCompany />
        <AboutValues />
        <AboutWhyInvestors />
        <AboutJourney />
        <Stats />
        <AboutLeadership />
        {/* <AboutCallToAction /> */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
