import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function AboutHero() {
  return (
    <section className="relative pt-48 lg:pt-56 pb-24 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Traditional Breadcrumb */}
        <div className="flex items-center justify-center gap-2 text-sm mb-8 text-gray-500 font-medium">
          <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
          <span className="text-gray-400">/</span>
          <span className="text-[#032e92]">About Us</span>
        </div>

        {/* Top Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center gap-3 mb-6"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#fca311]"></span>
            <span className="text-[#4d7aff] font-medium text-base tracking-wide">About Us</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-[#4d7aff] text-xs rotate-45" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-[46px] font-bold text-[#0a192f] leading-tight"
          >
            Helping Individuals & Businesses Build Long-Term Wealth
          </motion.h1>
        </div>

        {/* Gray Container with Split Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-[#f4f4f4] rounded-[32px] p-8 md:p-12 lg:p-16"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Content inside Gray Box */}
            <div>
              <h2 className="text-3xl lg:text-[38px] font-bold text-[#0a192f] mb-8 leading-tight pr-4">
                The Impact of Wealth Management on Modern Society
              </h2>

              <p className="text-[#666666] mb-6 leading-relaxed text-[15px]">
                Technology has revolutionized the way humans live, work, and interact. We are committed to providing trusted financial solutions that empower individuals, families, and businesses to achieve financial security.
              </p>

              <p className="text-[#666666] mb-10 leading-relaxed text-[15px]">
                From personalized investment strategies to retirement planning, financial discipline has significantly improved stability and confidence in the modern sector.
              </p>

              <button className="bg-[#4d7aff] hover:bg-[#3b66e5] text-white px-10 py-3.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
                Read More
              </button>
            </div>

            {/* Right Image inside Gray Box */}
            <div className="relative">
              <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop"
                  alt="Professional Financial Advisor"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Element */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute top-10 -left-6 md:-left-10 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-[bounce_4s_infinite]"
              >
                <div className="w-10 h-10 rounded-full bg-[#eef4ff] flex items-center justify-center text-[#032e92]">
                  <FontAwesomeIcon icon={faChartLine} />
                </div>
                <div>
                  <p className="text-xl font-bold text-[#0f172a] leading-none">15+</p>
                  <p className="text-xs text-gray-500 font-medium">Years Exp.</p>
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
