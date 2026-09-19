import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Blogs Components
import ServicesHero from '../components/services/ServicesHero';
import BlogCategories from '../components/blogs/BlogCategories';
import BlogsGrid from '../components/blogs/BlogsGrid';
import Pagination from '../components/blogs/Pagination';
import CTA from '../components/CTA';

export default function Blogs() {
  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen">
      <Navbar />

      <main>
        {/* Reusing ServicesHero with Blogs specific content */}
        <ServicesHero
          label="Our Blogs"
          title="Insights, Investment Ideas & Financial "
          titleHighlight="Knowledge"
          description="Stay informed with expert insights on wealth management, retirement planning, insurance, mutual funds, and investment strategies to help you make confident financial decisions."
          breadcrumbText="Blogs"
          breadcrumbLink="/blogs"
        />
        <BlogsGrid />
        <Pagination />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
