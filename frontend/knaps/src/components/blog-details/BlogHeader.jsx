import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faClock, faUserTie, faLink, faChevronRight, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faLinkedin, faXTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function BlogHeader({ blog }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareUrl = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = encodeURIComponent(blog?.title || 'Check out this article on KNAPS');

  return (
    <section className="bg-gradient-to-b from-[#f8fbff] via-white to-white pt-32 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Breadcrumb Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 text-[15px] font-medium text-gray-500 mb-8 flex-wrap"
        >
          <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
          <Link to="/blogs" className="hover:text-[#032e92] transition-colors">Blogs</Link>
          {blog?.title && (
            <>
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
              <span className="text-[#032e92] truncate max-w-[280px] sm:max-w-md lg:max-w-xl">
                {blog.title}
              </span>
            </>
          )}
        </motion.nav>

        {/* Top Meta Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mt-20 mb-8"
        >
          <div className="inline-block bg-[#eef5ff] text-[#032e92] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 border border-blue-100 shadow-sm">
            {blog?.category || 'Investment Insights'}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0a192f] tracking-tight leading-tight mb-6">
            {blog?.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-medium text-gray-500 mb-8">
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarDays} className="text-[#032e92]" />
              {blog?.date}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-[#032e92]" />
              {blog?.readTime || '6 min read'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between w-full border-t border-b border-gray-100 py-5 gap-4">
            {/* Author */}
            <div className="flex items-center gap-3.5">
              <img
                src={blog?.authorImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop'}
                alt={blog?.author || 'Author'}
                className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-blue-100"
              />
              <div className="text-left">
                <p className="text-[#0a192f] font-bold text-base">{blog?.author || 'KNAPS Research'}</p>
                <p className="text-gray-500 text-xs flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faUserTie} className="text-[#032e92]" />
                  {blog?.authorRole || 'AMFI-Registered Financial Advisor'}
                </p>
              </div>
            </div>

            {/* Share Icons */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-gray-400 mr-1 uppercase tracking-wider flex items-center gap-1">
                <FontAwesomeIcon icon={faShareNodes} /> Share:
              </span>
              <a
                href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on WhatsApp"
                className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#25D366] hover:text-white transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LinkedIn"
                className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#0A66C2] hover:text-white transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on X"
                className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <button
                onClick={handleCopyLink}
                title="Copy Link"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${copied ? 'bg-emerald-500 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-[#032e92] hover:text-white'
                  }`}
              >
                <FontAwesomeIcon icon={faLink} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-gray-100"
        >
          <img
            src={blog?.image || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1600&auto=format&fit=crop'}
            alt={blog?.title || 'Blog Banner'}
            className="w-full h-full object-cover"
          />
        </motion.div>

      </div>
    </section>
  );
}
