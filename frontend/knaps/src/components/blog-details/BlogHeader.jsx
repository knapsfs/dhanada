import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faClock, faUserTie, faLink } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

export default function BlogHeader() {
  return (
    <section className="bg-white pt-50 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Top Meta Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div className="inline-block bg-[#eef5ff] text-[#032e92] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider mb-8 border border-blue-100">
            Wealth Management
          </div>

          <h1 className="text-4xl md:text-[48px] font-bold text-[#0a192f] leading-tight mb-8">
            The Wealth Masterclass: Building a Multi-Generational Portfolio
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[15px] font-semibold text-gray-500 mb-8">
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarDays} className="text-[#c10000]" />
              July 28, 2026
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-[#c10000]" />
              8 min read
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between w-full border-t border-b border-gray-100 py-6">
            {/* Author */}
            <div className="flex items-center gap-4 mb-6 md:mb-0">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop"
                alt="Saurabh Sharma"
                className="w-14 h-14 rounded-full object-cover shadow-md"
              />
              <div className="text-left">
                <p className="text-[#0a192f] font-bold text-lg">Saurabh Sharma</p>
                <p className="text-gray-500 text-sm flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faUserTie} className="text-[#032e92]" />
                  Senior Financial Advisor
                </p>
              </div>
            </div>

            {/* Share Icons */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-400 mr-2 uppercase tracking-wider">Share:</span>
              <Link to="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#1877F2] hover:text-white transition-colors duration-300">
                <FontAwesomeIcon icon={faFacebook} />
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#0A66C2] hover:text-white transition-colors duration-300">
                <FontAwesomeIcon icon={faLinkedin} />
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-colors duration-300">
                <FontAwesomeIcon icon={faXTwitter} />
              </Link>
              <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#032e92] hover:text-white transition-colors duration-300">
                <FontAwesomeIcon icon={faLink} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[32px] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-gray-100"
        >
          <img
            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1600&auto=format&fit=crop"
            alt="Stock market growth analysis"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </motion.div>

      </div>
    </section>
  );
}
