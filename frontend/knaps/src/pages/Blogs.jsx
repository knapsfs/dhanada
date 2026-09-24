import { useState, useMemo, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Blogs Components
import ServicesHero from "../components/services/ServicesHero";
import BlogsGrid from "../components/blogs/BlogsGrid";
import Pagination from "../components/blogs/Pagination";
import CTA from "../components/CTA";
import { blogsData } from "../data/blogsData";

const BLOGS_PER_PAGE = 9;

export default function Blogs() {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const totalPages = Math.ceil(blogsData.length / BLOGS_PER_PAGE);

  const displayedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    return blogsData.slice(startIndex, startIndex + BLOGS_PER_PAGE);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

        {/* Blogs Grid (Shows up to 9 blogs per page) */}
        <BlogsGrid blogs={displayedBlogs} />

        {/* Dynamic Pagination - Only shown when totalPages > 1 */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
