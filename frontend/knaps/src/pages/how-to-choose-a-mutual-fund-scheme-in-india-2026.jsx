import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogHeader from '../components/blog-details/BlogHeader';
import BlogContent from '../components/blog-details/BlogContent';
import CTA from '../components/CTA';
import { getBlogByIdOrSlug } from '../data/blogsData';

export default function HowToChooseMutualFundScheme() {
    const blog = getBlogByIdOrSlug('how-to-choose-a-mutual-fund-scheme-in-india-2026');

    useEffect(() => {
        // 1. Scroll to top
        window.scrollTo(0, 0);

        // 2. SEO Title
        const originalTitle = document.title;
        document.title = "How to Choose a Mutual Fund Scheme in India 2026? | Complete Step-by-Step Guide | KNAPS";

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
        const metaDescription = "Learn how to choose the right mutual fund scheme in India for 2026. Follow our 4-parameter framework (Objective, Horizon, Riskometer, Performance), portfolio checkpoints, review strategy, and 5 valid reasons to exit.";
        updateMetaTag('description', metaDescription);
        updateMetaTag('keywords', 'How to choose mutual fund India 2026, Best mutual funds 2026, Equity Debt Hybrid Mutual Funds, Large Cap Small Cap Flexi Cap, Mutual Fund Riskometer, Sharpe Ratio Mutual Funds, When to exit mutual fund, KNAPS Private Limited');
        updateMetaTag('author', 'Saurabh Sharma, KNAPS');

        // 5. OpenGraph Tags (Facebook / LinkedIn)
        updateMetaTag('og:title', "How to Choose a Mutual Fund Scheme in India 2026? | KNAPS", true);
        updateMetaTag('og:description', metaDescription, true);
        updateMetaTag('og:type', 'article', true);
        updateMetaTag('og:url', window.location.href, true);
        updateMetaTag('og:image', blog?.image || '', true);
        updateMetaTag('og:site_name', 'KNAPS Wealth Management', true);

        // 6. Twitter Card Tags
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', "How to Choose a Mutual Fund Scheme in India 2026?");
        updateMetaTag('twitter:description', metaDescription);
        updateMetaTag('twitter:image', blog?.image || '');

        // 7. Schema.org Article Structured Data (JSON-LD)
        const jsonLdId = 'choose-mf-schema-2026';
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
            "headline": "How to choose a Mutual fund scheme in India 2026?",
            "description": metaDescription,
            "image": [
                blog?.image || ""
            ],
            "datePublished": "2026-09-23T10:00:00+05:30",
            "dateModified": "2026-09-23T10:00:00+05:30",
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

                {/* Full Rich How to Choose a Mutual Fund Content */}
                <BlogContent blog={blog} />

                {/* Global CTA */}
                <CTA />
            </main>

            <Footer />
        </div>
    );
}
