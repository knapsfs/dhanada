import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogHeader from '../components/blog-details/BlogHeader';
import BlogContent from '../components/blog-details/BlogContent';
import CTA from '../components/CTA';
import { getBlogByIdOrSlug } from '../data/blogsData';

export default function SevenCommonMistakesMutualFunds() {
    const blog = getBlogByIdOrSlug('7-common-mistakes-beginners-make-while-investing-in-mutual-funds');

    useEffect(() => {
        // 1. Scroll to top
        window.scrollTo(0, 0);

        // 2. SEO Title
        const originalTitle = document.title;
        document.title = "7 Common Mistakes Beginners Make While Investing in Mutual Funds | KNAPS";

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
        const metaDescription = "Discover the 7 common mistakes beginners make while investing in mutual funds: chasing past returns, stopping SIPs during market falls, choosing excessively risky funds, daily portfolio tracking, lack of clear goals, investing without an emergency fund, and expecting guaranteed returns.";
        updateMetaTag('description', metaDescription);
        updateMetaTag('keywords', '7 common mistakes beginners make while investing in mutual funds, mutual fund mistakes India, stopping SIP in market crash, past returns trap, mutual fund risk assessment, checking portfolio everyday, emergency fund mutual funds, KNAPS Private Limited');
        updateMetaTag('author', 'Saurabh Sharma, KNAPS');

        // 5. OpenGraph Tags (Facebook / LinkedIn)
        updateMetaTag('og:title', "7 Common Mistakes Beginners Make While Investing in Mutual Funds | KNAPS", true);
        updateMetaTag('og:description', metaDescription, true);
        updateMetaTag('og:type', 'article', true);
        updateMetaTag('og:url', window.location.href, true);
        updateMetaTag('og:image', blog?.image || '', true);
        updateMetaTag('og:site_name', 'KNAPS Wealth Management', true);

        // 6. Twitter Card Tags
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', "7 Common Mistakes Beginners Make While Investing in Mutual Funds");
        updateMetaTag('twitter:description', metaDescription);
        updateMetaTag('twitter:image', blog?.image || '');

        // 7. Schema.org Article Structured Data (JSON-LD)
        const jsonLdId = 'seven-mistakes-schema-2026';
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
            "headline": "7 Common Mistakes Beginners Make While Investing in Mutual Funds",
            "description": metaDescription,
            "image": [
                blog?.image || ""
            ],
            "datePublished": "2026-09-23T11:00:00+05:30",
            "dateModified": "2026-09-23T11:00:00+05:30",
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

                {/* Full Rich 7 Mistakes Content */}
                <BlogContent blog={blog} />

                {/* Global CTA */}
                <CTA />
            </main>

            <Footer />
        </div>
    );
}
