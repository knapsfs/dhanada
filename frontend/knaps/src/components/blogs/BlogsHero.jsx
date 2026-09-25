import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function BlogsHero() {
  return (
    <section className="relative pt-[120px] lg:pt-[140px] overflow-hidden bg-gradient-to-b from-[#eef4ff] to-white">
      <div className="max-w-7xl mx-auto px-6 lg:py-8 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm mb-6">
              <span className="text-[#032e92] text-xs font-bold tracking-widest uppercase">Our Blogs</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-black tracking-tight leading-tight max-w-4xl mx-auto">
              Insights, Investment Ideas &amp; <span className="text-[#032e92]">Financial Knowledge</span>
            </h1>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center pt-5 gap-3 text-[15px] font-medium text-gray-500">
              <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
              <span className="text-[#032e92]">Blogs</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
