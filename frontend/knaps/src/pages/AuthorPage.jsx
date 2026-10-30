import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faEnvelope,
  faUserTie,
  faNewspaper,
  faArrowLeft,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CTA from "../components/CTA";
import BlogCard from "../components/BlogCard";
import { getAuthorProfile } from "../services/blogService";

export default function AuthorPage() {
  const { slug } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    async function loadAuthor() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAuthorProfile(slug || "Shivangi");
        if (!isMounted) return;

        if (data.author) {
          setAuthor(data.author);
          setPosts(data.posts || []);
        } else {
          setError(data.message || "Author not found");
        }
      } catch (err) {
        if (isMounted) setError("Failed to load author profile");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAuthor();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Top Breadcrumb & Hero Background */}
        <section className="bg-gradient-to-b from-[#f8fbff] via-white to-gray-50 pt-32 pb-12">
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
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
              <span className="text-gray-400">Authors</span>
              {author?.author_name && (
                <>
                  <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
                  <span className="text-[#032e92] font-semibold">{author.author_name}</span>
                </>
              )}
            </motion.nav>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#032e92] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 text-sm font-medium">Loading author profile...</p>
              </div>
            ) : error || !author ? (
              <div className="py-16 text-center max-w-lg mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <p className="text-red-600 font-semibold mb-3">{error || "Author not found"}</p>
                <p className="text-gray-500 text-sm mb-6">
                  The author profile you are looking for may have been moved or is currently unavailable.
                </p>
                <Link
                  to="/blogs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#032e92] text-white text-sm font-semibold hover:bg-[#021d63] transition-colors shadow-md"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>Back to All Blogs</span>
                </Link>
              </div>
            ) : (
              /* Author Profile Card */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Decorative background accent */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-50/60 to-transparent rounded-bl-full pointer-events-none -mr-10 -mt-10" />

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-10">
                  {/* Profile Picture */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={author.profile_image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop"}
                      alt={author.author_name}
                      className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover shadow-lg ring-4 ring-blue-50 border border-gray-100"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-md border-2 border-white" title="Verified Author">
                      <FontAwesomeIcon icon={faCircleCheck} />
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] tracking-tight">
                        {author.author_name}
                      </h1>
                      {author.designation && (
                        <span className="inline-flex items-center gap-1.5 bg-[#eef5ff] text-[#032e92] text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                          <FontAwesomeIcon icon={faUserTie} className="text-[11px]" />
                          {author.designation}
                        </span>
                      )}
                    </div>

                    {/* Stats & Social */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-gray-500 mb-6">
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-lg">
                        <FontAwesomeIcon icon={faNewspaper} className="text-[#032e92]" />
                        <span>{author.articles_count || posts.length} Published {author.articles_count === 1 ? "Article" : "Articles"}</span>
                      </span>

                      {author.email && (
                        <a
                          href={`mailto:${author.email}`}
                          className="inline-flex items-center gap-1.5 text-gray-600 hover:text-[#032e92] bg-gray-50 hover:bg-blue-50 px-3 py-1 rounded-lg border border-gray-200 transition-colors"
                          title="Contact via Email"
                        >
                          <FontAwesomeIcon icon={faEnvelope} className="text-[#032e92]" />
                          <span>{author.email}</span>
                        </a>
                      )}

                      {author.linkedin && author.linkedin !== "#" && (
                        <a
                          href={author.linkedin.startsWith("http") ? author.linkedin : `https://${author.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-gray-600 hover:text-[#0A66C2] bg-gray-50 hover:bg-blue-50 px-3 py-1 rounded-lg border border-gray-200 transition-colors"
                          title="LinkedIn Profile"
                        >
                          <FontAwesomeIcon icon={faLinkedin} className="text-[#0A66C2]" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>

                    {/* Biography */}
                    {author.biography && (
                      <div className="text-gray-700 text-base leading-relaxed max-w-2xl bg-gray-50/70 p-5 rounded-2xl border border-gray-100">
                        <div
                          className="prose prose-sm max-w-none prose-p:my-1"
                          dangerouslySetInnerHTML={{ __html: author.biography }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </section>

        {/* Author's Articles Section */}
        {!loading && author && (
          <section className="py-12 bg-white pb-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f]">
                    Articles by {author.author_name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Explore market insights, research analysis, and wealth creation strategies.
                  </p>
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Showing {posts.length} {posts.length === 1 ? "article" : "articles"}
                </span>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-3xl p-8 border border-gray-100">
                  <FontAwesomeIcon icon={faNewspaper} className="text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-600 font-semibold mb-1">No articles published yet</p>
                  <p className="text-gray-400 text-sm">Check back soon for upcoming insights by this author.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => (
                    <BlogCard key={post.id} blog={post} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
