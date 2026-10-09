import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogHeader from '../components/blog-details/BlogHeader';
import BlogContent from '../components/blog-details/BlogContent';
import BlogCard from '../components/BlogCard';
import CTA from '../components/CTA';
import { getBlogPostByRoute } from '../services/blogService';

export default function BlogDetails() {
  const { id, category, slug } = useParams();
  const location = useLocation();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reading progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Determine lookup identifier from URL (pathname or params)
  const lookupKey = slug || id || location.pathname;

  // Scroll to top on page load or when article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;
    async function loadBlog() {
      setLoading(true);
      setError(null);
      try {
        const data = await getBlogPostByRoute(lookupKey);
        if (!isMounted) return;

        if (data && data.blog) {
          setBlog(data.blog);

          // Update SEO Title and Meta Description dynamically
          if (data.blog.title) {
            document.title = `${data.blog.title} | KNAPS`;
          }
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc && data.blog.description) {
            metaDesc.setAttribute('content', data.blog.description);
          }
        } else {
          setError(data?.message || 'Article not found');
        }
      } catch (err) {
        console.error('Failed to load blog details:', err);
        if (!isMounted) return;
        setError('Failed to load article');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadBlog();
    return () => {
      isMounted = false;
    };
  }, [lookupKey]);

  if (loading) {
    return (
      <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="py-40 flex flex-col items-center justify-center flex-1">
          <div className="w-12 h-12 border-4 border-[#032e92] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">Loading article from Frappe...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="py-32 px-6 text-center max-w-lg mx-auto flex-1 flex flex-col justify-center items-center">
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm w-full">
            <h2 className="text-2xl font-bold text-[#0a192f] mb-3">Article Not Found</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              The article you are trying to access does not exist or may have been unpublished in Frappe Desk.
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#032e92] text-white text-sm font-semibold hover:bg-[#021d63] transition-colors shadow-md"
            >
              Back to All Blogs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen relative">
      {/* Top Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#032e92] via-[#2563eb] to-[#38bdf8] z-50 origin-left pointer-events-none"
        style={{ scaleX }}
      />

      <Navbar />

      <main>
        {/* Dynamic Blog Header with Frappe Blogger & Category */}
        <BlogHeader blog={blog} />

        {/* Dynamic Blog Content directly from Frappe Rich Text Editor */}
        <BlogContent blog={blog} />

        {/* Related Posts Section (if available) */}
        {blog.related_posts && blog.related_posts.length > 0 && (
          <section className="py-16 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0a192f]">Related Articles</h3>
                  <p className="text-gray-500 text-sm mt-1">More insights in {blog.category}</p>
                </div>
                <Link
                  to="/blogs"
                  className="text-sm font-bold text-[#032e92] hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blog.related_posts.map((rp) => (
                  <BlogCard key={rp.id} blog={rp} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Unified Bottom CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
