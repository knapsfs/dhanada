import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';
import { fetchBlogPosts } from '../api/blogs';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function BlogSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadBlogs() {
      setLoading(true);
      try {
        const data = await fetchBlogPosts({ limit: 3 });
        if (isMounted) {
          if (data && data.posts && data.posts.length > 0) {
            setBlogs(data.posts);
          } else {
            setBlogs([]);
          }
        }
      } catch (err) {
        console.error("Failed to load homepage blogs:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="blogs" className="py-12 sm:py-16 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="flex flex-col md:flex-row justify-between items-end mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 rounded-full bg-[#eef5ff] text-[#032e92] font-semibold text-sm mb-4 uppercase tracking-wider"
            >
              Latest Insights
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-black tracking-tight leading-tight max-w-4xl mx-auto"
            >
              Blogs and <span className="text-[#032e92]">Resources</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/blogs" className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 inline-flex items-center justify-center cursor-pointer">
              View All Articles
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#032e92] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500 text-sm font-medium">Loading latest articles...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-3xl p-8 border border-gray-100 shadow-sm max-w-md mx-auto">
            <p className="text-gray-700 font-semibold mb-1">No articles available</p>
            <p className="text-gray-400 text-xs">Stay tuned for new insights and research articles.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className={`grid gap-8 ${
              blogs.length === 1
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : blogs.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
