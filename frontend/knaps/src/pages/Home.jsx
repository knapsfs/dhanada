import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import About from '../components/About';
import FinanceMythQuiz from '../components/MythOrFactQuiz/FinanceMythQuiz';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import HowItWorks from '../components/HowItWorks';
import Stats from '../components/Stats';
import InvestmentSolutions from '../components/InvestmentSolutions';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';
import FAQ from '../components/FAQ';
import RiskProfiler from '../components/RiskProfiler/RiskProfiler';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="font-sans text-gray-900 bg-white">
      <Navbar />

      <main>
        <Hero />
        <TrustBar />
        <About />
        <FinanceMythQuiz />
        <Services />
        <WhyChooseUs />
        <RiskProfiler />
        <HowItWorks />
        <Stats />
        <InvestmentSolutions />
        <Testimonials />
        <BlogSection />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

