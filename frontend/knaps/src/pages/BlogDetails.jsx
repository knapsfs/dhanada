import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServicesHero from '../components/services/ServicesHero';
import BlogHeader from '../components/blog-details/BlogHeader';
import BlogContent from '../components/blog-details/BlogContent';
import ArticleNavigation from '../components/blog-details/ArticleNavigation';
import RelatedArticles from '../components/blog-details/RelatedArticles';
import BlogCTA from '../components/blog-details/BlogCTA';
import CTA from '../components/CTA';

export default function BlogDetails() {

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      <Navbar />

      <main>


        {/* The Blog Content */}
        <BlogHeader />
        <BlogContent />
        <ArticleNavigation />

        {/* Related Posts & CTA */}
        <RelatedArticles />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
