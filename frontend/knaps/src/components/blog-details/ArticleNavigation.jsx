import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { blogsData } from '../../data/blogsData';

export default function ArticleNavigation({ currentBlog }) {
  const currentIndex = blogsData.findIndex((b) => b.id === currentBlog?.id || b.slug === currentBlog?.slug);
  
  const prevBlog = currentIndex > 0 ? blogsData[currentIndex - 1] : blogsData[blogsData.length - 1];
  const nextBlog = currentIndex < blogsData.length - 1 ? blogsData[currentIndex + 1] : blogsData[0];

  return (
    <section className="bg-white pb-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 pt-10 border-t border-gray-100">
          
          {/* Previous Article */}
          {prevBlog && (
            <Link to={`/blogs/${prevBlog.slug || prevBlog.id}`} className="group block">
              <motion.div 
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl border border-gray-100 bg-gray-50/80 hover:bg-white hover:border-[#032e92]/30 hover:shadow-lg transition-all duration-300 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-[#032e92] group-hover:bg-[#eef5ff] transition-colors shrink-0 shadow-sm border border-gray-100">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <div>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Previous Article</p>
                  <h4 className="text-[#0a192f] text-sm font-bold line-clamp-1 group-hover:text-[#032e92] transition-colors">
                    {prevBlog.title}
                  </h4>
                </div>
              </motion.div>
            </Link>
          )}

          {/* Next Article */}
          {nextBlog && (
            <Link to={`/blogs/${nextBlog.slug || nextBlog.id}`} className="group block text-right">
              <motion.div 
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl border border-gray-100 bg-gray-50/80 hover:bg-white hover:border-[#032e92]/30 hover:shadow-lg transition-all duration-300 flex items-center gap-4 justify-end flex-row-reverse"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-[#032e92] group-hover:bg-[#eef5ff] transition-colors shrink-0 shadow-sm border border-gray-100">
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
                <div>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Next Article</p>
                  <h4 className="text-[#0a192f] text-sm font-bold line-clamp-1 group-hover:text-[#032e92] transition-colors">
                    {nextBlog.title}
                  </h4>
                </div>
              </motion.div>
            </Link>
          )}

        </div>
      </div>
    </section>
  );
}
