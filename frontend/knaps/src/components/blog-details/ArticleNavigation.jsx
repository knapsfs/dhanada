import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function ArticleNavigation() {
  return (
    <section className="bg-white pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid md:grid-cols-2 gap-6 pt-10 border-t border-gray-100">
          
          {/* Previous Article */}
          <Link to="#" className="group block">
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex items-center gap-6"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-[#032e92] group-hover:bg-[#eef5ff] transition-colors shrink-0 shadow-sm">
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Previous Article</p>
                <h4 className="text-[#0a192f] font-bold line-clamp-2 group-hover:text-[#032e92] transition-colors">
                  Navigating Volatility: A Guide for Long-Term Investors
                </h4>
              </div>
            </motion.div>
          </Link>

          {/* Next Article */}
          <Link to="#" className="group block text-right">
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex items-center gap-6 justify-end flex-row-reverse"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-[#032e92] group-hover:bg-[#eef5ff] transition-colors shrink-0 shadow-sm">
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Next Article</p>
                <h4 className="text-[#0a192f] font-bold line-clamp-2 group-hover:text-[#032e92] transition-colors">
                  Understanding Alternative Investment Funds (AIFs)
                </h4>
              </div>
            </motion.div>
          </Link>

        </div>

      </div>
    </section>
  );
}
