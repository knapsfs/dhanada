import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Blogs Components
import BlogsHero from "../components/blogs/BlogsHero";
import BlogCategories from "../components/blogs/BlogCategories";
import BlogsGrid from "../components/blogs/BlogsGrid";
import Pagination from "../components/blogs/Pagination";
import CTA from "../components/CTA";
import { getBlogPosts } from "../services/blogService";

const BLOGS_PER_PAGE = 9;

export default function Blogs() {
  const { category: routeCategory } = useParams();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(routeCategory ? decodeURIComponent(routeCategory) : "All");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync category if URL parameter changes
  useEffect(() => {
    if (routeCategory) {
      setSelectedCategory(decodeURIComponent(routeCategory));
    } else {
      setSelectedCategory("All");
    }
    setCurrentPage(1);
  }, [routeCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    let isMounted = true;
    async function loadBlogs() {
      setLoading(true);
      setError(null);
      try {
        const catFilter = selectedCategory !== "All" ? selectedCategory : null;
        const data = await getBlogPosts({ category: catFilter, limit: 50 });
        if (isMounted) {
          if (data && data.posts) {
            setBlogs(data.posts);
          } else {
            setBlogs([]);
          }
        }
      } catch (err) {
        console.error("Failed to load blogs:", err);
        if (isMounted) setError("Failed to load published articles.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadBlogs();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    setCurrentPage(1);
    if (catName === "All") {
      navigate("/blogs");
    } else {
      navigate(`/blogs/${encodeURIComponent(catName)}`);
    }
  };

  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);

  const displayedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    return blogs.slice(startIndex, startIndex + BLOGS_PER_PAGE);
  }, [blogs, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen">
      <Navbar />

      <main>
        {/* Breadcrumb Hero */}
        <BlogsHero selectedCategory={selectedCategory} />

        {/* Dynamic Category Filter Bar from Frappe */}
        <BlogCategories
          activeCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        {/* Blogs Grid */}
        {loading ? (
          <div className="py-28 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#032e92] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm font-medium">Loading published articles...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center max-w-lg mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-sm my-10">
            <p className="text-red-600 font-semibold mb-2">{error}</p>
            <p className="text-gray-400 text-sm">Please try again later or refresh the page.</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-20 text-center max-w-lg mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-sm my-10">
            <p className="text-gray-700 font-semibold mb-2">No blog posts found</p>
            <p className="text-gray-400 text-sm">
              {selectedCategory !== "All"
                ? `There are currently no published articles in "${selectedCategory}".`
                : "Please check back soon for our latest financial insights."}
            </p>
            {selectedCategory !== "All" && (
              <button
                type="button"
                onClick={() => handleCategorySelect("All")}
                className="mt-4 px-5 py-2 rounded-xl text-xs font-bold text-[#032e92] bg-[#eef5ff] hover:bg-blue-100 transition-colors cursor-pointer"
              >
                View All Categories
              </button>
            )}
          </div>
        ) : (
          <BlogsGrid blogs={displayedBlogs} />
        )}

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
