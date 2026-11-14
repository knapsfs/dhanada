import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/seo/SEO";
import { PAGE_SEO } from "../components/seo/seoConfig";

// Products Components
import ServicesHero from "../components/services/ServicesHero";
import ServicesGrid from "../components/services/ServicesGrid";
import CTA from "../components/CTA";

export default function Products() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-[#f7f9fc] min-h-screen">
      {/* 
        =======================================================================
        PAGE SEO CONFIGURATION
        Managed centrally in src/components/seo/seoConfig.js (under PAGE_SEO.products).
        To change title, description, or keywords, simply edit seoConfig.js!
        =======================================================================
      */}
      <SEO
        pageKey="products"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" }
        ]}
      />
      <Navbar />

      <main>
        <ServicesHero />
        <ServicesGrid />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
