import { motion } from 'framer-motion';
import BlogCard from '../BlogCard';

// 3 dummy blogs for related section
const relatedBlogs = [
  {
    id: 1,
    category: 'Market Trends',
    date: 'Oct 24, 2026',
    title: 'Navigating Volatility: A Guide for Long-Term Investors',
    description: 'Discover strategies to protect your portfolio during market downturns and capitalize on emerging opportunities.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    author: 'Rahul Verma',
  },
  {
    id: 2,
    category: 'Personal Finance',
    date: 'Nov 02, 2026',
    title: '5 Steps to Building a Bulletproof Retirement Plan',
    description: 'A comprehensive approach to ensuring you have the corpus needed for a comfortable and stress-free retirement.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    author: 'Neha Kapoor',
  },
  {
    id: 3,
    category: 'Wealth Management',
    date: 'Nov 15, 2026',
    title: 'Understanding Alternative Investment Funds (AIFs)',
    description: 'An introductory guide to how high-net-worth individuals are diversifying beyond traditional stocks and bonds.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    author: 'Vikram Singh',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function RelatedArticles() {
  return (
    <section className="py-24 ">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-[36px] font-bold text-[#0a192f]"
          >
            Related <span className="text-[#032e92]">Articles</span>
          </motion.h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {relatedBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
