import Navbar from '../components/Navbar';
import SEO from '../components/seo/SEO';
import { PAGE_SEO } from '../components/seo/seoConfig';
import Hero from '../components/Hero';
import WhyInvestWithUs from '../components/WhyInvestWithUs';
import OurProducts from '../components/OurProducts';
import GoalFocus from '../components/GoalFocus';
import OurProcess from '../components/OurProcess';
import TrustBar from '../components/TrustBar';
import About from '../components/About';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import HowItWorks from '../components/HowItWorks';
import InvestmentSolutions from '../components/InvestmentSolutions';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="font-sans text-gray-900 bg-white">
      {/* 
        =======================================================================
        PAGE SEO CONFIGURATION
        Managed centrally in src/components/seo/seoConfig.js (under PAGE_SEO.home).
        To change title, description, or keywords, simply edit seoConfig.js!
        =======================================================================
      */}
      <SEO pageKey="home" />
      <Navbar />

      <main>
        <Hero />
        <WhyInvestWithUs />
        <OurProducts />
        <GoalFocus />
        <OurProcess />
        <TrustBar />
        {/* <About /> */}
        {/* <Services /> */}
        {/* <WhyChooseUs /> */}
        {/* <HowItWorks /> */}

        {/* <InvestmentSolutions /> */}
        <Testimonials />
        <BlogSection />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
