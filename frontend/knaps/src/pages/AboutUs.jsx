import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/seo/SEO';
import { PAGE_SEO } from '../components/seo/seoConfig';
import AboutHero from '../components/about/AboutHero';
import AboutStory from '../components/about/AboutStory';
import AboutTimeline from '../components/about/AboutTimeline';
import AboutWhyTrust from '../components/about/AboutWhyTrust';
import AboutLeadership from '../components/about/AboutLeadership';
import Stats from '../components/Stats';
import CTA from '../components/CTA';

export default function AboutUs() {
  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      {/* 
        =======================================================================
        PAGE SEO CONFIGURATION
        Managed centrally in src/components/seo/seoConfig.js (under PAGE_SEO.about).
        To change title, description, or keywords, simply edit seoConfig.js!
        =======================================================================
      */}
      <SEO
        pageKey="about"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "About Us", url: "/about" }
        ]}
      />
      <Navbar />

      <main>
        <AboutHero />
        <AboutStory />
        <AboutTimeline />
        <AboutWhyTrust />
        <Stats className="pt-8 pb-16 sm:pt-10 sm:pb-20" />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
