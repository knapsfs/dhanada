import { motion } from 'framer-motion';
import BlogCard from '../BlogCard';

// 9 dummy blogs for the grid
const blogs = [
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
  },
  {
    id: 4,
    category: 'Insurance',
    date: 'Dec 05, 2026',
    title: 'Why Term Insurance is Crucial in Your 30s',
    description: 'Learn why buying life insurance early can save you lakhs in premiums while securing your family’s future.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    author: 'Sneha Patel',
  },
  {
    id: 5,
    category: 'Mutual Funds',
    date: 'Dec 18, 2026',
    title: 'SIP vs Lumpsum: Which is Better in a Bull Market?',
    description: 'An analytical breakdown of investment strategies to help you maximize returns depending on market conditions.',
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=800&q=80',
    author: 'Rahul Verma',
  },
  {
    id: 6,
    category: 'Tax Planning',
    date: 'Jan 10, 2027',
    title: 'Smart Tax Saving Strategies for High Earners',
    description: 'Stop paying unnecessary taxes. Explore the lesser-known sections of the Income Tax Act to optimize your returns.',
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
    author: 'Amit Joshi',
  },
  {
    id: 7,
    category: 'Retirement',
    date: 'Jan 22, 2027',
    title: 'How the NPS Can Supercharge Your Retirement Corpus',
    description: 'A deep dive into the National Pension System and how its unique tax benefits make it a must-have for retirement.',
    image: 'https://images.unsplash.com/photo-1507206130118-b5907f817163?auto=format&fit=crop&w=800&q=80',
    author: 'Vikram Singh',
  },
  {
    id: 8,
    category: 'Investment',
    date: 'Feb 05, 2027',
    title: 'The Psychology of Investing: Avoiding Common Traps',
    description: 'Why do smart people make bad financial decisions? Understand behavioral finance to improve your investment logic.',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80',
    author: 'Neha Kapoor',
  },
  {
    id: 9,
    category: 'Financial Planning',
    date: 'Feb 14, 2027',
    title: 'Planning for Your Child’s Higher Education',
    description: 'With education costs rising exponentially, here is how you can start building an education fund early and effectively.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    author: 'Sneha Patel',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function BlogsGrid() {
  return (
    <section className="py-12 bg-white pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

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
