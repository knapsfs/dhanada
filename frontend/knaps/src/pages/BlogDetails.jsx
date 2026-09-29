import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogHeader from '../components/blog-details/BlogHeader';
import BlogContent from '../components/blog-details/BlogContent';
import CTA from '../components/CTA';
import { fetchBlogDetails } from '../api/blogs';

export default function BlogDetails() {
  const { id } = useParams();
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

  // Scroll to top on page load or when article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    async function loadBlog() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBlogDetails(id);
        if (!isMounted) return;

        if (data && data.blog) {
          setBlog(data.blog);
        } else {
          setError(data?.message || 'Article not found');
        }
      } catch (err) {
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
  }, [id]);

  if (loading) {
    return (
      <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="py-40 flex flex-col items-center justify-center flex-1">
          <div className="w-12 h-12 border-4 border-[#032e92] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">Loading article...</p>
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
              Back to Blogs
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
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#032e92] via-[#2563eb] to-[#38bdf8] z-50 origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      <main>
        {/* Dynamic Blog Header */}
        <BlogHeader blog={blog} />

        {/* Dynamic Blog Content from Frappe */}
        <BlogContent blog={blog} />

        {/* Unified Bottom CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
