import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogHeader from '../components/blog-details/BlogHeader';
import BlogContent from '../components/blog-details/BlogContent';
import CTA from '../components/CTA';
import { getBlogByIdOrSlug } from '../data/blogsData';

export default function SifVsMutualFunds() {
    const blog = getBlogByIdOrSlug('sif-vs-mutual-funds');

    useEffect(() => {
        // 1. Scroll to top
        window.scrollTo(0, 0);

        // 2. SEO Title
        const originalTitle = document.title;
        document.title = "SIF vs Mutual Funds: What's the Difference and Which One Should I Choose? | KNAPS";

        // 3. Helper to update or create meta tags
        const updateMetaTag = (nameOrProperty, value, isProperty = false) => {
            const attribute = isProperty ? 'property' : 'name';
            let meta = document.querySelector(`meta[${attribute}="${nameOrProperty}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attribute, nameOrProperty);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', value);
        };

        // 4. Meta descriptions & keywords
        const metaDescription = "Compare Specialized Investment Funds (SIFs) vs Mutual Funds in India. Learn the differences in ₹10 Lakh vs ₹500 minimum investment, long-short derivative strategies, regulatory frameworks, risk, and which suits your financial goals.";
        updateMetaTag('description', metaDescription);
        updateMetaTag('keywords', 'SIF vs Mutual Funds, Specialized Investment Funds India, SEBI SIF, Long Short Funds, Mutual Funds vs SIF, Investment Strategy, KNAPS Private Limited');
        updateMetaTag('author', 'Saurabh Sharma, KNAPS');

        // 5. OpenGraph Tags (Facebook / LinkedIn)
        updateMetaTag('og:title', "SIF vs Mutual Funds: What's the Difference and Which One Should I Choose?", true);
        updateMetaTag('og:description', metaDescription, true);
        updateMetaTag('og:type', 'article', true);
        updateMetaTag('og:url', window.location.href, true);
        updateMetaTag('og:image', blog?.image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80', true);
        updateMetaTag('og:site_name', 'KNAPS Wealth Management', true);

        // 6. Twitter Card Tags
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', "SIF vs Mutual Funds: What's the Difference and Which One Should I Choose?");
        updateMetaTag('twitter:description', metaDescription);
        updateMetaTag('twitter:image', blog?.image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80');

        // 7. Schema.org Article Structured Data (JSON-LD)
        const jsonLdId = 'sif-vs-mf-schema';
        let scriptTag = document.getElementById(jsonLdId);
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.id = jsonLdId;
            scriptTag.type = 'application/ld+json';
            document.head.appendChild(scriptTag);
        }

        const schemaData = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": window.location.href
            },
            "headline": "SIF vs Mutual Funds: What’s the Difference and Which One Should I Choose?",
            "description": metaDescription,
            "image": [
                blog?.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"
            ],
            "datePublished": "2026-09-22T10:00:00+05:30",
            "dateModified": "2026-09-22T10:00:00+05:30",
            "author": {
                "@type": "Person",
                "name": "Saurabh Sharma",
                "jobTitle": "Senior Financial Advisor",
                "worksFor": {
                    "@type": "Organization",
                    "name": "KNAPS Private Limited"
                }
            },
            "publisher": {
                "@type": "Organization",
                "name": "KNAPS Private Limited",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://knaps.in/assets/logo.png"
                }
            }
        };

        scriptTag.text = JSON.stringify(schemaData);

        // Cleanup on unmount
        return () => {
            document.title = originalTitle;
            const existingScript = document.getElementById(jsonLdId);
            if (existingScript) existingScript.remove();
        };
    }, [blog]);

    return (
        <div className="font-sans text-gray-900 bg-white min-h-screen">
            <Navbar />

            <main>
                {/* Blog Header with Breadcrumbs, Author, Share */}
                <BlogHeader blog={blog} />

                {/* Full Rich SIF vs Mutual Funds Content */}
                <BlogContent blog={blog} />

                {/* Global CTA */}
                <CTA />
            </main>

            <Footer />
        </div>
    );
}
