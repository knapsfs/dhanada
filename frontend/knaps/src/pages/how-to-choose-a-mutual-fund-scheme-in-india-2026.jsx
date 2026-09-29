import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogHeader from '../components/blog-details/BlogHeader';
import ArticleNavigation from '../components/blog-details/ArticleNavigation';
import CTA from '../components/CTA';
import { getBlogByIdOrSlug } from '../data/blogsData';
import { useLeadModal } from '../context/LeadModalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faTriangleExclamation,
  faCompass,
  faShieldHalved,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export default function HowToChooseMutualFundScheme() {
    const blog = getBlogByIdOrSlug('how-to-choose-a-mutual-fund-scheme-in-india-2026');
    const { openLeadModal } = useLeadModal();

    useEffect(() => {
        // 1. Scroll to top
        window.scrollTo(0, 0);

        // 2. SEO Title
        const originalTitle = document.title;
        document.title = "How to choose a Mutual fund scheme in India 2026? | KNAPS";

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
        const metaDescription = "Learn how to choose a mutual fund scheme in India in 2026 based on objective, horizon, riskometer, performance, expense ratio, and the 5 clear rules for when to exit.";
        updateMetaTag('description', metaDescription);
        updateMetaTag('keywords', 'How to choose mutual fund India 2026, Best mutual funds 2026, Equity Debt Hybrid Mutual Funds, Large Cap Small Cap Flexi Cap, Mutual Fund Riskometer, Sharpe Ratio Mutual Funds, When to exit mutual fund, KNAPS');
        updateMetaTag('author', 'Saurabh Sharma, KNAPS');

        // 5. OpenGraph Tags (Facebook / LinkedIn)
        updateMetaTag('og:title', "How to choose a Mutual fund scheme in India 2026? | KNAPS", true);
        updateMetaTag('og:description', metaDescription, true);
        updateMetaTag('og:type', 'article', true);
        updateMetaTag('og:url', window.location.href, true);
        updateMetaTag('og:image', blog?.image || '', true);
        updateMetaTag('og:site_name', 'KNAPS Wealth Management', true);

        // 6. Twitter Card Tags
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', "How to choose a Mutual fund scheme in India 2026?");
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
            "dateModified": "2026-09-25T17:00:00+05:30",
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

                {/* Main Blog Article Content */}
                <article className="bg-white pb-20 pt-4">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-gray-700 text-[17px] leading-[1.85]">

                        {/* Lead Section */}
                        <div className="text-xl sm:text-[22px] font-medium text-[#0a192f] leading-relaxed mb-8 border-l-4 border-[#032e92] pl-5 py-2 bg-blue-50/30 rounded-r-2xl">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-3">
                                How to choose a Mutual fund scheme in India 2026?
                            </h2>
                            <p className="m-0 text-gray-700 text-lg sm:text-xl font-normal leading-relaxed">
                                Choosing a mutual fund is simple. Start with shortlisting which category you want to invest in — <strong>Equity, debt, or hybrid</strong> based on these <strong>4 parameters</strong>:
                            </p>
                        </div>

                        {/* 4 Parameters Cards */}
                        <div className="space-y-8 my-10">

                            {/* 1. Investment Objective */}
                            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 border border-blue-100/80 shadow-sm">
                                <div className="flex items-center gap-3.5 mb-4">
                                    <span className="w-10 h-10 rounded-2xl bg-[#032e92] text-white flex items-center justify-center text-base font-bold shadow-md shadow-blue-900/20">
                                        1
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                                        Investment Objective
                                    </h3>
                                </div>

                                <p className="mb-6 font-medium text-gray-800">
                                    First, ask yourself what are you investing for? <strong>Income generation, capital preservation, or long-term wealth creation?</strong>
                                </p>

                                <div className="space-y-4">
                                    {/* Income generation */}
                                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                        <h4 className="font-bold text-[#032e92] text-base mb-1.5 flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#032e92]"></span>
                                            Income Generation
                                        </h4>
                                        <p className="text-sm text-gray-600 leading-relaxed m-0">
                                            If your objective is to generate income from your investment, you can consider an <strong>SWP (Systematic Withdrawal Plan)</strong>, where you withdraw a fixed amount at regular intervals (mostly on a monthly basis), or the <strong>IDCW Payout option</strong>, where the fund may distribute dividend income to investors when declared. <em>The amount and frequency of IDCW are not guaranteed.</em>
                                        </p>
                                    </div>

                                    {/* Capital preservation */}
                                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                        <h4 className="font-bold text-[#032e92] text-base mb-1.5 flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#032e92]"></span>
                                            Capital Preservation
                                        </h4>
                                        <p className="text-sm text-gray-600 leading-relaxed m-0">
                                            If your objective is capital preservation, you can consider suitable debt-oriented categories, such as <strong>Liquid, Ultra Short Duration, Short Duration, Corporate Bond or Gilt Funds</strong>.
                                        </p>
                                    </div>

                                    {/* Long-term wealth creation */}
                                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                        <h4 className="font-bold text-[#032e92] text-base mb-2 flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#032e92]"></span>
                                            Long-Term Wealth Creation
                                        </h4>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                            If your objective is long-term wealth creation, you can consider equity mutual funds. The category can be chosen based on the type of companies or investment style you want:
                                        </p>

                                        <ul className="grid sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-gray-700">
                                            <li className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                                                <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] shrink-0" />
                                                <span><strong>Large Cap Funds:</strong> focus on the top 100 companies by market cap</span>
                                            </li>
                                            <li className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                                                <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] shrink-0" />
                                                <span><strong>Large &amp; Mid Cap Funds:</strong> combine large and mid-sized companies</span>
                                            </li>
                                            <li className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                                                <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] shrink-0" />
                                                <span><strong>Mid Cap Funds:</strong> focus on companies ranked 101st–250th by market cap</span>
                                            </li>
                                            <li className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50">
                                                <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] shrink-0" />
                                                <span><strong>Small Cap Funds:</strong> focus on companies ranked 251st onwards</span>
                                            </li>
                                            <li className="flex items-center gap-2 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/50 sm:col-span-2">
                                                <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] shrink-0" />
                                                <span><strong>Multi Cap or Flexi Cap Funds:</strong> give you exposure across different company sizes</span>
                                            </li>
                                        </ul>

                                        <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#032e92]">
                                            <Link to="/blogs" className="inline-flex items-center gap-1.5 hover:underline">
                                                <span>To know more about the different strategies, you can read this Blog &rarr;</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Investment Horizon */}
                            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30 border border-emerald-100/80 shadow-sm">
                                <div className="flex items-center gap-3.5 mb-4">
                                    <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-base font-bold shadow-md shadow-emerald-900/20">
                                        2
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                                        Investment Horizon
                                    </h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    When will you need the money? If you are investing for the long term, you can consider equity-oriented mutual funds (a typical equity cycle lasts for 4-5 years usually) as you have more time to stay invested through market ups and downs. If you need to park money for a few months you can go for short term debt funds. Hybrids give the advantage of both words by having a combination of stocks and debt in your portfolio and can be used for medium term investments.
                                </p>
                            </div>

                            {/* 3. Risk Level */}
                            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 border border-amber-100/80 shadow-sm">
                                <div className="flex items-center gap-3.5 mb-4">
                                    <span className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-base font-bold shadow-md shadow-amber-900/20">
                                        3
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                                        Risk Level
                                    </h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Check the risk level of the fund and ask yourself how much risk you are willing to take. Debt mutual funds carry a risk of interest-rate and credit risk, while equity and equity-oriented hybrid funds are mainly affected by market movements and changes in stock prices.
                                </p>
                                <div className="bg-white p-4 rounded-2xl border border-amber-200/80 text-xs sm:text-sm text-gray-700">
                                    <strong>The Riskometer:</strong> Every mutual fund has a Riskometer, which indicates the scheme’s risk level from <strong>1 (Low) to 5 (Very High)</strong>. Choose a fund whose risk level matches your ability and willingness to take risk.
                                </div>
                            </div>

                            {/* 4. Performance */}
                            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-50/50 via-white to-purple-50/30 border border-purple-100/80 shadow-sm">
                                <div className="flex items-center gap-3.5 mb-4">
                                    <span className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-base font-bold shadow-md shadow-purple-900/20">
                                        4
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#0a192f]">
                                        Performance
                                    </h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Next, evaluate the fund’s performance over different periods (1month, 3 months, 6 months, 1 year, since inception) and look for consistency rather than choosing a fund simply because it delivered the highest return in the previous year, as higher return funds tends to have deeper cycles during market downturns.
                                </p>
                            </div>

                        </div>

                        {/* Scheme Selection Checkpoints */}
                        <div className="mt-14 mb-10">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-4 flex items-center gap-3">
                                <span className="w-9 h-9 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center text-lg">
                                    <FontAwesomeIcon icon={faCircleCheck} />
                                </span>
                                Checkpoints to Choose a Particular Mutual Fund Scheme
                            </h2>

                            <p className="mb-4">
                                Once you have shortlisted the right category, you can use these checkpoints to choose a particular mutual fund scheme:
                            </p>

                            <p className="mb-6 font-medium text-gray-800">
                                Compare funds within the same category. You can pick <strong>3 - 4 schemes</strong> that follow a similar investment style and compare them on the following metrics:
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 my-8">
                                {/* Metric 1 */}
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80">
                                    <h4 className="text-base font-bold text-[#0a192f] mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
                                        Check long-term performance
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed m-0">
                                        Look at the fund’s 3-year and 5-year returns and check if they have delivered consistent returns in the long term rather than just looking at the highest returns.
                                    </p>
                                </div>

                                {/* Metric 2 */}
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80">
                                    <h4 className="text-base font-bold text-[#0a192f] mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
                                        Compare performance with the benchmark
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed m-0">
                                        Check whether the fund has consistently performed in line with or better than its benchmark.
                                    </p>
                                </div>

                                {/* Metric 3 */}
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80">
                                    <h4 className="text-base font-bold text-[#0a192f] mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
                                        Look at risk along with returns
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed m-0">
                                        If two funds have delivered similar returns, check which one has taken less risk to achieve them. You can refer to the sharpe ratio for that. A higher Sharpe Ratio generally means that the fund has generated better returns for the level of risk taken.
                                    </p>
                                </div>

                                {/* Metric 4 */}
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80">
                                    <h4 className="text-base font-bold text-[#0a192f] mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
                                        Check the portfolio
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed m-0">
                                        See where the fund is investing. Check the top holdings, sectors, and allocation to understand where your money is actually being invested.
                                    </p>
                                </div>

                                {/* Metric 5 */}
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80 sm:col-span-2">
                                    <h4 className="text-base font-bold text-[#0a192f] mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#032e92]"></span>
                                        Check the cost
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed m-0">
                                        Compare the expense ratio with other funds in the same category. A lower expense ratio can help you keep more of your investment returns.
                                    </p>
                                </div>
                            </div>

                            {/* Remove schemes that don't fit */}
                            <div className="bg-[#fff9e6] border-l-4 border-amber-500 p-5 rounded-r-2xl my-6">
                                <div className="flex items-center gap-2.5 mb-1.5 text-[#b45309] font-bold text-base">
                                    <FontAwesomeIcon icon={faTriangleExclamation} />
                                    <span>Remove schemes that don’t fit</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed m-0">
                                    Eliminate funds with inconsistent performance, unsuitable asset allocation, or higher risk without a corresponding difference in returns.
                                </p>
                            </div>

                            {/* KNAPS Consultation Callout */}
                            <div className="bg-[#eef5ff] border border-blue-200/70 p-6 rounded-2xl my-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm sm:text-base text-gray-700 m-0">
                                        If you think you need to discuss further about your personal goals and objectives, you can talk to us at <strong>KNAPS</strong>.
                                    </p>
                                </div>
                                <a
                                    href="https://knaps.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                        if (openLeadModal) {
                                            e.preventDefault();
                                            openLeadModal('Blog: Choose Mutual Fund 2026');
                                        }
                                    }}
                                    className="btn-ripple px-5 py-2.5 rounded-xl font-bold text-xs bg-[#032e92] text-white hover:bg-[#021d63] whitespace-nowrap shadow-md cursor-pointer shrink-0"
                                >
                                    Book a consultation here &rarr;
                                </a>
                            </div>
                        </div>

                        {/* Section: How to review your mutual fund scheme? */}
                        <div className="mt-14 mb-10">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-4 flex items-center gap-3">
                                <span className="w-9 h-9 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center text-lg">
                                    <FontAwesomeIcon icon={faCompass} />
                                </span>
                                How to review your mutual fund scheme?
                            </h2>

                            <blockquote className="relative p-6 sm:p-8 bg-gradient-to-r from-blue-50/40 via-gray-50 to-blue-50/40 rounded-3xl border border-blue-100 my-6 text-center shadow-sm">
                                <p className="text-lg sm:text-xl text-[#0a192f] font-bold leading-relaxed m-0">
                                    "The best way to review your mutual fund scheme is to give it enough time to work and avoid checking it too frequently."
                                </p>
                            </blockquote>

                            <p className="mb-4">
                                Mutual funds are meant for the long term, so checking your portfolio every day, week, or month can make you react to normal market movements and make unnecessary changes.
                            </p>

                            <p className="mb-4">
                                Instead, give your investments time to work. A <strong>review once a year</strong> is generally enough for a long-term portfolio, or whenever there is a major change in your financial goal, income, or time horizon.
                            </p>

                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200/80 my-6 text-sm">
                                <h4 className="font-bold text-gray-900 mb-2">Example: Changing Goals &amp; Life Stages</h4>
                                <p className="text-gray-600 leading-relaxed m-0">
                                    If your goal, income or time period has changed, your investments may also need to change. For example, you may have started investing to build an emergency fund when your income was uncertain. A few years later, your income may have become more stable and your emergency fund may already be sufficient. You may now want to focus on long-term wealth creation. In that case, your investments should be reviewed based on your new goal.
                                </p>
                            </div>

                            <p className="mb-4 font-medium text-gray-800">
                                During the annual review, simply ask:
                            </p>

                            <div className="p-5 rounded-2xl bg-[#eef5ff] border-2 border-[#032e92]/30 text-center font-bold text-base sm:text-lg text-[#032e92] my-4 shadow-sm">
                                "Is this investment still right considering the goal I invested for?"
                            </div>

                            <p className="text-sm text-gray-600">
                                If the answer is <strong>yes</strong>, there may be no reason to make a change.
                            </p>
                        </div>

                        {/* Section: When to exit? */}
                        <div className="mt-14 mb-10">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-4 flex items-center gap-3">
                                <span className="w-9 h-9 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center text-lg">
                                    <FontAwesomeIcon icon={faShieldHalved} />
                                </span>
                                When to exit?
                            </h2>

                            <p className="mb-6">
                                You can take an exit or withdraw money from a mutual fund scheme in any of the following <strong>5 cases</strong>:
                            </p>

                            <div className="space-y-3.5 my-8">
                                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-start gap-4">
                                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">1</span>
                                    <div>
                                        <h4 className="font-bold text-[#0a192f] text-base mb-1">Your goal is complete</h4>
                                        <p className="text-xs sm:text-sm text-gray-600 m-0">If you have reached the amount you need for your goal, you can start withdrawing the money.</p>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-start gap-4">
                                    <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center font-bold text-sm shrink-0">2</span>
                                    <div>
                                        <h4 className="font-bold text-[#0a192f] text-base mb-1">Your goal has changed</h4>
                                        <p className="text-xs sm:text-sm text-gray-600 m-0">If you originally invested for a long-term goal but now need the money much sooner, you may need to withdraw your investment.</p>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-start gap-4">
                                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">3</span>
                                    <div>
                                        <h4 className="font-bold text-[#0a192f] text-base mb-1">The fund is consistently underperforming</h4>
                                        <p className="text-xs sm:text-sm text-gray-600 m-0">One bad year is not enough. If a fund keeps performing poorly against its category and benchmark over a longer period, it deserves a review.</p>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-start gap-4">
                                    <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">4</span>
                                    <div>
                                        <h4 className="font-bold text-[#0a192f] text-base mb-1">The fund’s strategy has changed</h4>
                                        <p className="text-xs sm:text-sm text-gray-600 m-0">If the fund starts investing in a way that no longer aligns with why you bought it earlier, you can reconsider holding it.</p>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-start gap-4">
                                    <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm shrink-0">5</span>
                                    <div>
                                        <h4 className="font-bold text-[#0a192f] text-base mb-1">You have taken more risk than you can handle</h4>
                                        <p className="text-xs sm:text-sm text-gray-600 m-0">If market falls are causing panic or the portfolio has become too risky for your current situation, reducing risk, and switching to a safer fund may make sense.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Panic Exit Warning Callout */}
                            <div className="bg-[#fff5f5] border-l-4 border-[#c10000] p-6 sm:p-7 rounded-r-3xl my-8 shadow-sm">
                                <p className="text-base sm:text-lg text-gray-800 leading-relaxed mb-3 font-medium">
                                    Most of the investors panic and exit when the market is falling. But is that a good time to exit? <strong>No! Not at all.</strong> You should consider taking an exit when there is a good reason to.
                                </p>
                                <div className="bg-red-100/70 p-4 rounded-xl border border-red-200">
                                    <p className="text-sm sm:text-base text-gray-900 font-semibold leading-relaxed m-0">
                                        In fact, falling markets are the best time to enter the markets and start investing as you can get a low price for the units you are investing in. Markets are cyclical in nature, you will be profitable when prices rise again.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact KNAPS WhatsApp / Consultation Banner */}
                        <div className="bg-gradient-to-br from-[#032e92] via-[#021d63] to-[#011442] text-white p-8 sm:p-10 rounded-3xl shadow-xl my-12 text-center sm:text-left sm:flex items-center justify-between gap-8">
                            <div className="sm:max-w-xl mb-6 sm:mb-0">
                                <span className="inline-block text-cyan-300 font-bold text-xs uppercase tracking-wider mb-2">
                                    Expert Guidance
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                                    Get Clarity on Your Investment Strategy
                                </h3>
                                <p className="text-blue-100 text-sm sm:text-base leading-relaxed m-0">
                                    You can contact <strong>KNAPS</strong> and get more clarity on How to choose a Mutual fund scheme in India 2026 as per your financial objectives, time horizon, and risk appetite.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                                <a
                                    href="https://wa.me/+919990243143?text=How%20to%20choose%20a%20mutual%20fund%20scheme%20?"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-ripple px-6 py-3.5 rounded-xl font-bold text-sm bg-[#25D366] text-white hover:bg-[#20ba59] shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
                                    <span>Chat on WhatsApp &rarr;</span>
                                </a>
                                <button
                                    onClick={() => openLeadModal && openLeadModal('Blog: Choose Mutual Fund 2026')}
                                    className="btn-ripple px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-[#032e92] hover:bg-blue-50 shadow-lg transition-all cursor-pointer"
                                >
                                    Book Consultation
                                </button>
                            </div>
                        </div>

                    </div>
                </article>

                {/* Article Navigation (Previous / Next Blog) */}
                <ArticleNavigation currentBlog={blog} />

                {/* Global CTA */}
                <CTA />
            </main>

            <Footer />
        </div>
    );
}
