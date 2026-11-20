import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faClock,
  faUserTie,
  faLink,
  faChevronRight,
  faShareNodes,
  faCheck,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedin,
  faXTwitter,
  faWhatsapp
} from '@fortawesome/free-brands-svg-icons';
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
  const authorSlug = blog?.author_slug || blog?.authorSlug || 'Shivangi';
  const authorName = blog?.author || 'KNAPS Research';
  const authorRole = blog?.author_role || blog?.authorRole || 'Financial Content Writer';
  const authorImg = blog?.author_image || blog?.authorImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop';

  return (
    <section className="bg-gradient-to-b from-[#f4f8ff] via-[#fafcff] to-white pt-32 pb-10">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Breadcrumb Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2.5 text-sm font-medium text-gray-500 mb-8 flex-wrap"
        >
          <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-300" />
          <Link to="/blogs" className="hover:text-[#032e92] transition-colors">Blogs</Link>
          {blog?.category && (
            <>
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-300" />
              <Link
                to={`/blogs/${encodeURIComponent(blog.category_slug || blog.category)}`}
                className="text-gray-500 hover:text-[#032e92] transition-colors"
              >
                {blog.category}
              </Link>
            </>
          )}
          {blog?.title && (
            <>
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-300" />
              <span className="text-[#032e92] font-semibold truncate max-w-[240px] sm:max-w-md">
                {blog.title}
              </span>
            </>
          )}
        </motion.nav>

        {/* Header Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Category Pill */}
          <div className="inline-flex items-center gap-2 bg-[#eef5ff] text-[#032e92] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 border border-blue-100 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#032e92]"></span>
            <span>{blog?.category || 'Mutual Funds'}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0a192f] tracking-tight leading-[1.25] mb-6 max-w-5xl mx-auto">
            {blog?.title}
          </h1>

          {/* Published Date & Reading Time */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-medium text-gray-500 mb-8">
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarDays} className="text-[#032e92]" />
              <span>{blog?.date || 'Recent'}</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-[#032e92]" />
              <span>{blog?.read_time || '6 min read'}</span>
            </span>
          </div>

          {/* Author & Share Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            {/* Author */}
            <Link
              to={`/author/${encodeURIComponent(authorSlug)}`}
              className="flex items-center gap-3.5 group text-left hover:opacity-95 transition-opacity"
              title={`View ${authorName}'s profile`}
            >
              <div className="relative">
                <img
                  src={authorImg}
                  alt={authorName}
                  className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-blue-100 group-hover:ring-[#032e92] transition-all"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop';
                  }}
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] border-2 border-white">
                  <FontAwesomeIcon icon={faCheck} />
                </span>
              </div>
              <div>
                <p className="text-[#0a192f] font-bold text-base group-hover:text-[#032e92] transition-colors flex items-center gap-1.5">
                  <span>{authorName}</span>
                </p>
                <p className="text-gray-500 text-xs flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faUserTie} className="text-[#032e92]" />
                  <span>{authorRole}</span>
                </p>
              </div>
            </Link>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                <FontAwesomeIcon icon={faShareNodes} /> Share:
              </span>
              <a
                href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on WhatsApp"
                className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LinkedIn"
                className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#0A66C2] hover:text-white transition-all shadow-sm"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on X"
                className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all shadow-sm"
              >
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                title="Copy Link"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm cursor-pointer ${copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-[#032e92] hover:text-white'
                  }`}
              >
                <FontAwesomeIcon icon={copied ? faCheck : faLink} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        {blog?.image && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-h-[500px]"
          >
            <img
              src={blog.image}
              alt={blog.title || 'Blog Banner'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </motion.div>
        )}

      </div>
    </section>
  );
}
