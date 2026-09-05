import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function BlogCard({ blog }) {
  return (
    <motion.div variants={itemVariants} className="h-full">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-[#032e92]/10 transition-all duration-300 group h-full flex flex-col">
        <div className="relative h-60 overflow-hidden">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#c10000] uppercase tracking-wider">
            {blog.category}
          </div>
        </div>
        
        <div className="p-8 flex flex-col flex-1">
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-[#032e92]" />
              {blog.date}
            </span>
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faUser} className="text-[#032e92]" />
              {blog.author}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#032e92] transition-colors duration-300 line-clamp-2">
            {blog.title}
          </h3>
          
          <p className="text-gray-600 mb-6 flex-1 line-clamp-3">
            {blog.description}
          </p>
          
          <Link to={`/blogs/${blog.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#c10000] group-hover:text-[#032e92] transition-colors mt-auto">
            Read Full Article
            <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
