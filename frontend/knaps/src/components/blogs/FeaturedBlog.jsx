import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function FeaturedBlog() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-[#032e92]/10 transition-shadow duration-500 group flex flex-col lg:flex-row"
        >
          {/* Image Section */}
          <div className="relative w-full lg:w-1/2 h-[300px] lg:h-auto overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop" 
              alt="Stock market growth analysis" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/50 lg:bg-gradient-to-r lg:from-transparent lg:to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-5 py-2 rounded-full text-xs font-bold text-[#c10000] uppercase tracking-widest shadow-md">
              Featured Insight
            </div>
          </div>
          
          {/* Content Section */}
          <div className="w-full lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center">
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-gray-500 mb-6">
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-[#032e92]" />
                July 28, 2026
              </span>
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="text-[#032e92]" />
                8 min read
              </span>
            </div>
            
            <h2 className="text-3xl lg:text-[40px] font-bold text-[#0a192f] leading-tight mb-6 group-hover:text-[#032e92] transition-colors duration-300">
              The Wealth Masterclass: Building a Multi-Generational Portfolio
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              Explore advanced asset allocation strategies designed not just to grow your wealth, but to preserve it across generations. Learn how to navigate shifting market cycles while maintaining a resilient, tax-efficient financial foundation for your family's future.
            </p>
            
            <div>
              <Link 
                to="/blogs/featured" 
                className="inline-flex items-center gap-3 bg-[#032e92] hover:bg-[#021d63] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-[#032e92]/20 hover:shadow-xl hover:-translate-y-0.5"
              >
                Read Full Article
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
            
          </div>
        </motion.div>

      </div>
    </section>
  );
}
