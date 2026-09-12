import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function ServicesHero({
  label = "Our Services",
  title = "Financial Solutions Designed For ",
  titleHighlight = "Your Goals",
  description = "Whether you're planning your retirement, protecting your family, or growing your investments, our experts provide personalized financial solutions for every stage of life.",
  breadcrumbText = "Services",
  breadcrumbLink = "/services"
}) {
  return (
    <section className="relative pt-[120px] pb-12 lg:pt-[140px] lg:pb-16 overflow-hidden bg-gradient-to-b from-[#eef4ff] to-white">


      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 py-8"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm mb-6">
              <span className="text-[#032e92] text-xs font-bold tracking-widest uppercase">{label}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a192f] leading-tight mb-6">
              {title} <span className="text-[#032e92]">{titleHighlight}</span>
            </h1>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-3 text-[15px] font-medium text-gray-500">
              <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
              <Link to={breadcrumbLink} className="text-[#032e92] hover:underline">{breadcrumbText}</Link>
            </div>
          </motion.div>



        </div>
      </div>
    </section>
  );
}
