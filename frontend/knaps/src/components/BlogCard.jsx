import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCalendarAlt, faUser, faClock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function BlogCard({ blog }) {
  if (!blog) return null;

  // Use the canonical Frappe route e.g. /blog/mutual-funds/what’s-the-difference-between-sif-and-mutual-funds
  const targetUrl = blog.targetUrl || (blog.route ? `/${blog.route.replace(/^\//, '')}` : `/blogs/${blog.name || blog.id}`);
  const authorSlug = blog.author_slug || blog.authorSlug || blog.blogger || 'Shivangi';
  const authorName = blog.author || blog.blogger || 'KNAPS Research';
  const categoryName = blog.category || 'Mutual Funds';
  const displayImage = blog.image || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1600&auto=format&fit=crop';

  return (
    <motion.div variants={itemVariants} className="h-full">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-[#032e92]/10 transition-all duration-300 group h-full flex flex-col">
        <Link to={targetUrl} className="relative h-60 overflow-hidden block">
          <img 
            src={displayImage} 
            alt={blog.title || 'Blog post image'} 
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1600&auto=format&fit=crop';
            }}
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#c10000] uppercase tracking-wider shadow-sm">
            {categoryName}
          </div>
        </Link>
        
        <div className="p-7 sm:p-8 flex flex-col flex-1">
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-[#032e92]" />
              {blog.date}
            </span>
            {blog.read_time && (
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faClock} className="text-[#032e92]" />
                {blog.read_time}
              </span>
            )}
            <Link
              to={`/author/${encodeURIComponent(authorSlug)}`}
              className="flex items-center gap-1.5 hover:text-[#032e92] transition-colors"
              title={`View ${authorName}'s profile`}
            >
              <FontAwesomeIcon icon={faUser} className="text-[#032e92]" />
              <span className="underline decoration-dotted decoration-gray-300 underline-offset-2 hover:decoration-[#032e92]">
                {authorName}
              </span>
            </Link>
          </div>
          
          <Link to={targetUrl}>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#032e92] transition-colors duration-300 line-clamp-2">
              {blog.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 mb-6 flex-1 line-clamp-3 text-sm leading-relaxed">
            {blog.description}
          </p>
          
          <Link to={targetUrl} className="inline-flex items-center gap-2 text-sm font-bold text-[#c10000] group-hover:text-[#032e92] transition-colors mt-auto pt-2">
            <span>Read Full Article</span>
            <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
