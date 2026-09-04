import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';

const blogs = [
  {
    id: 1,
    category: 'Market Trends',
    date: 'Oct 24, 2023',
    title: 'Navigating Volatility: A Guide for Long-Term Investors',
    description: 'Discover strategies to protect your portfolio during market downturns and capitalize on emerging opportunities.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    author: 'Rahul Verma',
  },
  {
    id: 2,
    category: 'Personal Finance',
    date: 'Nov 02, 2023',
    title: '5 Steps to Building a Bulletproof Retirement Plan',
    description: 'A comprehensive approach to ensuring you have the corpus needed for a comfortable and stress-free retirement.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    author: 'Neha Kapoor',
  },
  {
    id: 3,
    category: 'Wealth Management',
    date: 'Nov 15, 2023',
    title: 'Understanding Alternative Investment Funds (AIFs)',
    description: 'An introductory guide to how high-net-worth individuals are diversifying beyond traditional stocks and bonds.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    author: 'Vikram Singh',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function BlogSection() {
  return (
    <section id="blogs" className="py-24 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
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
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a]"
            >
              Expert Financial <span className="text-[#032e92]">Perspectives</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="#all-blogs" className="px-6 py-3 rounded-xl border-2 border-[#032e92] text-[#032e92] font-semibold hover:bg-[#032e92] hover:text-white transition-all duration-300 inline-flex items-center gap-2">
              View All Articles
              <FontAwesomeIcon icon={faArrowRight} />
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
