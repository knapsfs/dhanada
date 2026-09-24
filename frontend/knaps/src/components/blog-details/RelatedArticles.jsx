import { motion } from 'framer-motion';
import BlogCard from '../BlogCard';
import { getRelatedBlogs } from '../../data/blogsData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function RelatedArticles({ currentBlog }) {
  const related = getRelatedBlogs(currentBlog?.id || 1, 3);

  return (
    <section className="py-12 sm:py-16 bg-gray-50/60 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#032e92] bg-blue-50 px-3 py-1 rounded-full">
              Keep Reading
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mt-2">
              Related <span className="text-[#032e92]">Articles</span>
            </h2>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {related.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
