import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogHeader from '../components/blog-details/BlogHeader';
import BlogContent from '../components/blog-details/BlogContent';
import CTA from '../components/CTA';
import { getBlogByIdOrSlug } from '../data/blogsData';

export default function BlogDetails() {
  const { id } = useParams();
  const blog = getBlogByIdOrSlug(id);

  // Scroll to top on page load or when article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      <Navbar />

      <main>
        {/* Dynamic Blog Header */}
        <BlogHeader blog={blog} />

        {/* Dynamic Blog Content */}
        <BlogContent blog={blog} />

        {/* Bottom CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
