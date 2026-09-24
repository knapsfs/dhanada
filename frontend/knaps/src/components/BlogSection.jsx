import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';
import { getLatestBlogs } from '../data/blogsData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function BlogSection() {
  const blogs = getLatestBlogs(3);

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
              className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0f172a] tracking-tight leading-tight"
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
