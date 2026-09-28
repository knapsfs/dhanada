import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogHeader from '../components/blog-details/BlogHeader';
import ArticleNavigation from '../components/blog-details/ArticleNavigation';
import CTA from '../components/CTA';
import { getBlogByIdOrSlug } from '../data/blogsData';
import { useLeadModal } from '../context/LeadModalContext';
import stoppingSipImg from '../assets/blogs/stopping-sip-when-the-market-falls.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faTriangleExclamation,
  faCompass,
  faQuoteLeft,
  faBullseye,
  faKitMedical,
  faArrowsRotate,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export default function SevenCommonMistakesMutualFunds() {
    const blog = getBlogByIdOrSlug('7-common-mistakes-beginners-make-while-investing-in-mutual-funds');
    const { openLeadModal } = useLeadModal();

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
            "dateModified": "2026-09-28T11:00:00+05:30",
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
                {/* Blog Header with Breadcrumbs, Title, Author & Share */}
                <BlogHeader blog={blog} />

                {/* Full Article Content */}
                <article className="bg-white pb-20 pt-4">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-gray-700 text-[17px] leading-[1.85]">

                        {/* Title & Introduction Section */}
                        <div className="mb-10">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0a192f] tracking-tight mb-6 leading-tight">
                                7 Common Mistakes Beginners Make While Investing in Mutual Funds
                            </h1>
                            <div className="bg-blue-50/50 border-l-4 border-[#032e92] p-5 sm:p-6 rounded-r-2xl">
                                <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-normal m-0 mb-3">
                                    Most people tend to make wrong investments in mutual funds often when decisions are driven by fear, greed, FOMO, peer pressure, or simply by lack of knowledge and planning.
                                </p>
                                <p className="text-base sm:text-lg text-[#0a192f] font-semibold leading-relaxed m-0">
                                    These are the common mistakes that you should avoid while investing in mutual funds:
                                </p>
                            </div>
                        </div>

                        {/* Quick Scannable Summary Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-8">
                            {[
                                { num: '1', title: 'Chasing Past Returns', desc: 'Investing only because it gave high returns last year.' },
                                { num: '2', title: 'Stopping SIPs in Falls', desc: 'Letting panic take over and selling when prices drop.' },
                                { num: '3', title: 'Taking Unmatched Risk', desc: 'Moving to risky funds without assessing risk tolerance.' },
                                { num: '4', title: 'Daily Portfolio Checking', desc: 'Turning profitable investments into loss-making exits.' },
                                { num: '5', title: 'Investing Without a Goal', desc: 'Treating investments as one generic pool of money.' },
                                { num: '6', title: 'No Emergency Fund', desc: 'Forced to break investments during emergencies at market lows.' },
                                { num: '7', title: 'Expecting Guaranteed Returns', desc: 'Panicking when returns vary instead of staying invested.' },
                            ].map((m, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-start gap-3 hover:border-blue-300 transition-all ${idx === 6 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                                >
                                    <span className="w-8 h-8 rounded-xl bg-[#032e92] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                        {m.num}
                                    </span>
                                    <div>
                                        <h4 className="font-bold text-[#0a192f] text-sm leading-snug">{m.title}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{m.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Detailed 7 Mistakes Section */}
                        <div className="space-y-12">

                            {/* Mistake 1 */}
                            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-blue-50/40 via-white to-blue-50/20 border border-blue-100 shadow-sm">
                                <div className="flex items-center gap-3.5 mb-5">
                                    <span className="w-10 h-10 rounded-2xl bg-[#032e92] text-white flex items-center justify-center text-base font-bold shadow-md shadow-blue-900/20 shrink-0">
                                        1
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] m-0">
                                        Choosing a fund only because it gave the highest returns in the past.
                                    </h2>
                                </div>

                                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-3">
                                    <p className="text-gray-800 leading-relaxed m-0">
                                        You see a fund that gave a return of <strong>35% last year</strong>.
                                    </p>
                                    <p className="text-gray-800 leading-relaxed italic bg-slate-50 p-3.5 rounded-xl border border-slate-100 m-0">
                                        Your first thought? <em>“I want to invest in this.”</em>
                                    </p>
                                    <p className="text-gray-800 leading-relaxed m-0">
                                        You invest and see your returns next year - <strong>10%</strong>.
                                    </p>
                                    <p className="font-bold text-[#c10000] m-0 pt-1">
                                        And that’s exactly where the mistake begins!
                                    </p>
                                </div>

                                <p className="mb-4 text-gray-700 leading-relaxed">
                                    Because you’re looking at what the fund did in the past, not what it will do in the future.
                                </p>

                                <p className="mb-4 text-gray-700 leading-relaxed">
                                    Any reason could contribute to that high return - maybe the fund took more risk, maybe that performance came from a particular market cycle, or maybe it was some cyclic industrial change.
                                </p>

                                <div className="bg-amber-50/80 border-l-4 border-amber-500 p-5 rounded-r-2xl my-6">
                                    <p className="text-sm sm:text-base text-amber-900 font-medium m-0 leading-relaxed">
                                        A high return in the previous year can make a fund look very good, but you are not investing for last year. <strong>You are investing for the future.</strong>
                                    </p>
                                </div>

                                <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-100 flex items-start gap-3.5">
                                    <FontAwesomeIcon icon={faCircleCheck} className="text-[#032e92] text-xl mt-1 shrink-0" />
                                    <div>
                                        <p className="font-bold text-[#0a192f] text-base mb-1">Before chasing the numbers:</p>
                                        <p className="text-sm sm:text-base text-gray-700 m-0">
                                            So before chasing the numbers, you need to ask: <em>Does this fund actually fit my goal, risk, and time horizon?</em>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mistake 2 */}
                            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-red-50/30 via-white to-red-50/20 border border-red-100 shadow-sm">
                                <div className="flex items-center gap-3.5 mb-5">
                                    <span className="w-10 h-10 rounded-2xl bg-[#c10000] text-white flex items-center justify-center text-base font-bold shadow-md shadow-red-900/20 shrink-0">
                                        2
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] m-0">
                                        Stopping SIPs when the market falls
                                    </h2>
                                </div>

                                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-3">
                                    <p className="font-bold text-[#0a192f] text-base m-0">Imagine this scenario:</p>
                                    <p className="text-gray-800 leading-relaxed m-0">
                                        One fine day, you see that the market is down by <strong>15%</strong>.
                                    </p>
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-2">
                                        <p className="text-gray-800 font-medium italic m-0">
                                            You start thinking: <em>“Arre yaar, mutual fund me mera paisa kam ho raha hai!”</em>
                                        </p>
                                        <p className="text-gray-800 font-medium italic m-0">
                                            You see your investment value falling, and… <strong>FEAR takes over!</strong>
                                        </p>
                                        <p className="text-red-700 font-bold m-0">
                                            <em>“Isse pehle market aur gir jaaye, paise nikaal leta hoon.”</em>
                                        </p>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed m-0">
                                        A few months ago, you were happily investing every month because the market was going up. Now that prices are falling, you're scared of losing money.
                                    </p>
                                    <p className="text-gray-900 font-bold m-0">
                                        So you exit and withdraw your money!?
                                    </p>
                                </div>

                                {/* The Irony Box */}
                                <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 rounded-2xl shadow-md my-6">
                                    <p className="text-lg font-extrabold mb-2">But here’s the irony:</p>
                                    <p className="text-red-50 text-base leading-relaxed m-0">
                                        You were buying when the price was expensive, and you are now selling when prices became cheaper!
                                    </p>
                                    <p className="text-white font-bold text-base mt-2 m-0">
                                        That’s not a strategy. That’s emotions taking over logic and making wrong decisions.
                                    </p>
                                </div>

                                {/* Infographic Image */}
                                <div className="my-8 rounded-3xl overflow-hidden border border-gray-200 shadow-lg bg-gray-50">
                                    <img
                                        src={stoppingSipImg}
                                        alt="Stopping SIP when the market falls mistake"
                                        className="w-full h-auto object-cover max-h-[500px]"
                                    />
                                    <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                                        <p className="text-xs sm:text-sm text-gray-500 font-medium m-0">
                                            Market dips allow you to accumulate more units at cheaper NAVs — never halt long-term SIPs during a correction.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-emerald-50/80 p-5 sm:p-6 rounded-2xl border border-emerald-100 flex items-start gap-3.5">
                                    <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-700 text-xl mt-1 shrink-0" />
                                    <div>
                                        <p className="font-bold text-emerald-950 text-base mb-1">Stay The Course:</p>
                                        <p className="text-sm sm:text-base text-emerald-900 leading-relaxed m-0">
                                            Market falls are scary. But if your goal and time horizon haven’t changed, a temporary fall doesn’t automatically mean - you should stop your SIP. If you are investing for the long term, you can’t change your plans every time the market changes its mood.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mistake 3 */}
                            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20 border border-amber-100 shadow-sm">
                                <div className="flex items-center gap-3.5 mb-5">
                                    <span className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-base font-bold shadow-md shadow-amber-900/20 shrink-0">
                                        3
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] m-0">
                                        Choosing a fund that is too risky
                                    </h2>
                                </div>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    You see a fund giving <strong>25% returns</strong> and think:
                                </p>

                                <blockquote className="bg-white p-4 sm:p-5 rounded-2xl border-l-4 border-amber-500 shadow-sm my-4 italic text-gray-800">
                                    “My existing fund is giving a return of only 12%!”
                                </blockquote>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    So you move your investment from your existing fund to the new fund giving 25% returns, and you forget about the risk.
                                </p>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    But high returns usually come with higher risk. And you need to ask yourself one simple question:
                                </p>

                                {/* The 10 Lakh to 7 Lakh Question Box */}
                                <div className="bg-[#0a192f] text-white p-7 rounded-2xl shadow-lg my-6">
                                    <p className="text-amber-400 font-bold uppercase text-xs tracking-wider mb-2">The Simple Question</p>
                                    <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3">
                                        What will I do if my ₹10 lakh becomes ₹7 lakh?
                                    </h3>
                                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed m-0">
                                        If you panic, lose sleep, or sell in a hurry, maybe that fund is too risky for you.
                                    </p>
                                </div>

                                <p className="text-gray-700 leading-relaxed mb-3">
                                    The real test is not how you feel when the fund performance is going up, it is how you react when it starts falling.
                                </p>

                                <p className="text-gray-700 leading-relaxed mb-3">
                                    High returns can be tempting. But you should not take more risk just because you want higher returns.
                                </p>

                                <p className="text-gray-900 font-semibold leading-relaxed mb-6">
                                    Before chasing returns, you need to know how much risk you can actually handle.
                                </p>

                                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <p className="font-bold text-[#0a192f] text-base mb-1">Take a risk assessment and see how much risk you can take.</p>
                                        <p className="text-xs sm:text-sm text-gray-500 m-0">
                                            Know your risk tolerance before choosing high-volatility funds.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => openLeadModal && openLeadModal('Risk Assessment: 7 Mistakes Blog')}
                                        className="btn-ripple px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#032e92] text-white hover:bg-[#021d63] shadow-md shrink-0 cursor-pointer transition-all"
                                    >
                                        Take Risk Assessment &rarr;
                                    </button>
                                </div>
                            </div>

                            {/* Mistake 4 */}
                            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-indigo-50/30 via-white to-indigo-50/20 border border-indigo-100 shadow-sm">
                                <div className="flex items-center gap-3.5 mb-5">
                                    <span className="w-10 h-10 rounded-2xl bg-indigo-700 text-white flex items-center justify-center text-base font-bold shadow-md shadow-indigo-900/20 shrink-0">
                                        4
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] m-0">
                                        Checking the portfolio every day
                                    </h2>
                                </div>

                                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-3">
                                    <p className="text-gray-800 leading-relaxed m-0">
                                        You invest <strong>₹10 lakh</strong> in a mutual fund.
                                    </p>
                                    <p className="text-gray-800 leading-relaxed m-0">
                                        Next month, you check the value.
                                    </p>
                                    <p className="text-indigo-950 font-bold m-0">
                                        It’s ₹9.8 lakh!
                                    </p>
                                    <div className="pl-4 border-l-2 border-indigo-200 space-y-2 py-1">
                                        <p className="text-gray-800 font-medium italic m-0">
                                            And your brain thinks- <em>“Arre! ₹20,000 kam ho gaya.”</em>
                                        </p>
                                        <p className="text-gray-700 text-sm m-0">
                                            You check again the following week. It falls a little more.
                                        </p>
                                        <p className="bg-indigo-50/80 p-3 rounded-xl border border-indigo-100 text-indigo-900 font-medium text-sm m-0">
                                            <em>“Bas, paise iss fund se nikal leta hoon. Jab market theek hoga, wapas daal dunga.”</em>
                                        </p>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed m-0 pt-1">
                                        Sounds sensible. Right?
                                    </p>
                                    <p className="text-gray-900 font-bold m-0">
                                        And you withdraw your money.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed m-0">
                                        The market starts going up again.
                                    </p>
                                    <p className="text-gray-800 leading-relaxed m-0">
                                        Now you think about entering again. <strong>My friend, you have already missed a big part of the recovery.</strong> You exit when the market was low, and you enter when it was high.
                                    </p>
                                    <p className="font-bold text-red-600 m-0">
                                        Well, I wouldn’t call it a smart move!
                                    </p>
                                </div>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    This is exactly how checking your portfolio too often can hurt you - by turning your profitable investments into loss making investments.
                                </p>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    You see a short-term fall, take the wrong decision (fear of losing), and miss the long-term growth.
                                </p>

                                <div className="bg-[#fff9db] border-l-4 border-[#f59f00] p-6 rounded-r-2xl my-6">
                                    <div className="flex items-center gap-2 mb-2 text-[#f59f00] font-bold text-base">
                                        <FontAwesomeIcon icon={faTriangleExclamation} />
                                        <span>And the scary part?</span>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-2">
                                        You may not realise the damage today. You realise it 10 years later.
                                    </p>
                                    <p className="text-base sm:text-lg text-gray-900 font-bold leading-relaxed m-0">
                                        Because ₹20,000 falling today is not the biggest problem, but missing years of compounding is.
                                    </p>
                                </div>
                            </div>

                            {/* Mistake 5 */}
                            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-teal-50/30 via-white to-teal-50/20 border border-teal-100 shadow-sm">
                                <div className="flex items-center gap-3.5 mb-5">
                                    <span className="w-10 h-10 rounded-2xl bg-teal-700 text-white flex items-center justify-center text-base font-bold shadow-md shadow-teal-900/20 shrink-0">
                                        5
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] m-0">
                                        Investing without a clear goal
                                    </h2>
                                </div>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    You start investing because everyone around you is investing.
                                </p>

                                <p className="italic text-gray-700 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    ₹5,000 here. ₹10,000 there. A few funds. Maybe an SIP.
                                </p>

                                <p className="text-gray-800 font-semibold mb-4">
                                    But do you ever ask yourself: <em>“What is this investment actually for?”</em>
                                </p>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    That question becomes important the day you need money urgently.
                                </p>

                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm my-6 space-y-3">
                                    <div className="flex items-center gap-2 text-teal-800 font-bold text-base">
                                        <FontAwesomeIcon icon={faBullseye} />
                                        <span>Without a Goal, Everything Looks Like One Cash Pool</span>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed m-0">
                                        Because without a goal, all your investments start looking like one big pool of money. So when an emergency comes, you may break the investment which you started without knowing the goal.
                                    </p>
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed m-0 pt-2 border-t border-gray-100">
                                        And that can come at a real cost! You might exit a high-return-generating investment at the wrong time, while an FD or another investment could have served the immediate need.
                                    </p>
                                </div>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    The problem isn’t investment, that’s rather a very good habit, the problem is not knowing what that investment is meant to do.
                                </p>

                                <div className="bg-teal-50/60 p-5 sm:p-6 rounded-2xl border border-teal-100 flex items-start gap-3.5">
                                    <FontAwesomeIcon icon={faCircleCheck} className="text-teal-700 text-xl mt-1 shrink-0" />
                                    <div>
                                        <p className="font-bold text-teal-950 text-base mb-1">Every Investment Needs A Purpose:</p>
                                        <p className="text-sm sm:text-base text-teal-900 leading-relaxed m-0 mb-2">
                                            Every investment should have a purpose, even if it is not clear initially, but you know it could be for the long term financial requirements like your child’s education, marriage, buying a house, etc.
                                        </p>
                                        <p className="text-sm sm:text-base text-teal-950 font-bold leading-relaxed m-0">
                                            Because when you know why you invested, you also know what you should and should not break.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mistake 6 */}
                            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20 border border-rose-100 shadow-sm">
                                <div className="flex items-center gap-3.5 mb-5">
                                    <span className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-base font-bold shadow-md shadow-rose-900/20 shrink-0">
                                        6
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] m-0">
                                        Investing without an emergency fund
                                    </h2>
                                </div>

                                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-3">
                                    <p className="text-gray-800 leading-relaxed m-0">
                                        You invest regularly. SIP is running. You see your portfolio growing. Everything is good.
                                    </p>
                                    <p className="font-bold text-rose-800 text-base m-0">
                                        Then life says, “Surprise!”
                                    </p>
                                    <p className="text-gray-800 leading-relaxed m-0">
                                        You get a critical medical emergency in the family.
                                    </p>
                                    <p className="text-gray-800 leading-relaxed m-0">
                                        Suddenly, you need to deposit <strong>₹5 lakhs</strong> in the hospital. You don’t have any emergency fund.
                                    </p>
                                    <p className="text-gray-800 leading-relaxed m-0">
                                        Most of your money is invested.
                                    </p>
                                    <p className="text-gray-900 font-semibold m-0">
                                        So now, you have to sell your investments to arrange the money.
                                    </p>
                                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-950 text-sm sm:text-base leading-relaxed">
                                        <strong>And what if the market is down that day?</strong>
                                        <p className="mt-1 m-0">
                                            You may have to sell ₹5 lakh worth of investments that are currently worth only <strong>₹4.6 lakh</strong>. You lose money because the market was down, and you needed to break investment at the wrong time.
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    And if you had stayed invested, that money could have continued compounding for years.
                                </p>

                                <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-7 sm:p-8 rounded-2xl shadow-lg my-6">
                                    <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider mb-2">
                                        <FontAwesomeIcon icon={faKitMedical} />
                                        <span>Essential Rule of Financial Planning</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3">
                                        That’s why an emergency fund matters.
                                    </h3>
                                    <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-4">
                                        It is always a good idea to maintain a separate emergency fund in safe/ liquid funds.
                                    </p>
                                    <div className="p-4 rounded-xl bg-white/10 border border-white/20">
                                        <p className="text-base sm:text-lg text-white font-bold m-0">
                                            “Investments are for the future. Emergency money is for life’s surprises. You need both.”
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mistake 7 */}
                            <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-purple-50/30 via-white to-purple-50/20 border border-purple-100 shadow-sm">
                                <div className="flex items-center gap-3.5 mb-5">
                                    <span className="w-10 h-10 rounded-2xl bg-purple-700 text-white flex items-center justify-center text-base font-bold shadow-md shadow-purple-900/20 shrink-0">
                                        7
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#0a192f] m-0">
                                        Expecting guaranteed returns
                                    </h2>
                                </div>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Mutual funds are subject to market-risk. You must have heard this statement so many times. What does this mean? It means that returns can go up, come down, and can even be negative for a period.
                                </p>

                                <p className="text-gray-800 font-semibold mb-4">
                                    The problem starts when you expect a fixed return every year.
                                </p>

                                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm my-6 space-y-3">
                                    <p className="text-gray-800 leading-relaxed m-0">
                                        Suppose you invest ₹10,000 every month and the market gives a good return one year, a low return the next year, and a negative return after that. If you keep thinking, <em>“Mujhe toh 12% chahiye tha,”</em> you may panic when the portfolio falls.
                                    </p>
                                    <p className="text-red-700 font-medium leading-relaxed m-0 bg-red-50/60 p-3.5 rounded-xl border border-red-100">
                                        What happens then? You stop your SIP when the market is down, stop giving the investment time to recover, or even sell at a loss because the returns did not match your expectation.
                                    </p>
                                </div>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    But if you stay invested, your portfolio can grow in the long term - because the return changes from year to year. A negative year does not mean the investment has failed. Over a longer period, the good and bad market phases can play out differently.
                                </p>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    The bigger problem with expecting fixed returns is that you start making decisions based on disappointment instead of the actual goal.
                                </p>

                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Mutual funds don’t promise a fixed return every year. So you should plan for a range of possible outcomes, stay invested for the appropriate time period, and review the investment based on your goal, not because one year’s return was lower than expected.
                                </p>

                                <div className="bg-purple-50/80 p-5 sm:p-6 rounded-2xl border border-purple-100 flex items-start gap-3.5">
                                    <FontAwesomeIcon icon={faArrowsRotate} className="text-purple-700 text-xl mt-1 shrink-0" />
                                    <div>
                                        <p className="font-bold text-purple-950 text-base mb-1">Realistic Expectations Beat Short-Term Disappointment:</p>
                                        <p className="text-sm sm:text-base text-purple-900 leading-relaxed font-semibold m-0">
                                            Don’t invest expecting a fixed return. Invest with a realistic return expectation and give the investment enough time to grow.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Inspirational Graham Quote */}
                        <blockquote className="relative p-8 sm:p-10 bg-gradient-to-r from-blue-50/50 via-gray-50 to-blue-50/50 rounded-3xl border border-blue-100/80 my-12 text-center shadow-sm">
                            <FontAwesomeIcon icon={faQuoteLeft} className="absolute top-6 left-8 text-3xl text-blue-200" />
                            <p className="relative z-10 text-xl sm:text-2xl text-[#0a192f] font-bold italic leading-relaxed m-0">
                                "The investor’s chief problem — and even his worst enemy — is likely to be himself."
                            </p>
                            <footer className="mt-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">— Benjamin Graham</footer>
                        </blockquote>

                        {/* Contact KNAPS WhatsApp Banner */}
                        <div className="bg-gradient-to-br from-[#032e92] via-[#021d63] to-[#011442] text-white p-8 sm:p-10 rounded-3xl shadow-xl my-12 text-center sm:text-left sm:flex items-center justify-between gap-8">
                            <div className="sm:max-w-xl mb-6 sm:mb-0">
                                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider mb-2 justify-center sm:justify-start">
                                    <FontAwesomeIcon icon={faCompass} />
                                    <span>Expert Guidance from KNAPS</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                                    Avoid Beginner Mistakes — Invest With Confidence
                                </h3>
                                <p className="text-blue-100 text-sm sm:text-base leading-relaxed m-0">
                                    You can contact us at <strong>KNAPS</strong> and avoid making the mistakes that beginners make while investing in Mutual Funds.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                                <a
                                    href="https://wa.me/+919990243143?text=common%20mistakes%20to%20avoid%20while%20investing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-ripple px-6 py-3.5 rounded-xl font-bold text-sm bg-[#25D366] text-white hover:bg-[#20ba59] shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
                                    <span>Chat on WhatsApp &rarr;</span>
                                </a>
                                <button
                                    onClick={() => openLeadModal && openLeadModal('Blog: 7 Common Mistakes in Mutual Funds')}
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
