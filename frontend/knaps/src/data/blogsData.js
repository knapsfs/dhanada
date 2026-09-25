import sevenMistakesImg from "../assets/blogs/seven-common-mistakes-begineer-makes-while-investing-in-mutual-funds.jpg";
import mfSchemeIndiaImg from "../assets/blogs/mutual-fund-scheme-in-india.jpg";
import sifVsMfImg from "../assets/blogs/sif-vs-mf.jpg";

export const blogsData = [
	{
		id: 12,
		slug: "7-common-mistakes-beginners-make-while-investing-in-mutual-funds",
		category: "Mutual Funds Guide",
		date: "Sep 23, 2026",
		readTime: "7 min read",
		title: "7 Common Mistakes Beginners Make While Investing in Mutual Funds",
		description:
			"Avoid costly mutual fund investing mistakes driven by fear, greed, FOMO, and lack of planning. Learn why chasing past returns, stopping SIPs during market dips, daily portfolio tracking, or investing without an emergency fund can derail long-term compounding.",
		image: sevenMistakesImg,
		author: "Saurabh Sharma",
		authorRole: "Senior Financial Advisor, KNAPS",
		authorImage:
			"https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
		featured: true,
	},
	{
		id: 11,
		slug: "how-to-choose-a-mutual-fund-scheme-in-india-2026",
		category: "Mutual Funds Guide",
		date: "Sep 23, 2026",
		readTime: "8 min read",
		title: "How to choose a Mutual fund scheme in India 2026?",
		description:
			"Choosing a mutual fund is simple. Learn how to shortlist across Equity, Debt, and Hybrid based on objective, horizon, riskometer, performance, expense ratio, and the 5 clear rules for when to exit.",
		image: mfSchemeIndiaImg,
		author: "Saurabh Sharma",
		authorRole: "Senior Financial Advisor, KNAPS",
		authorImage:
			"https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
		featured: true,
	},
	{
		id: 1,
		slug: "sif-vs-mutual-funds",
		category: "Specialized Investment Funds (SIF)",
		date: "Sep 22, 2026",
		readTime: "7 min read",
		title: "SIF vs Mutual Funds: What’s the Difference and Which One Should I Choose?",
		description:
			"Understand the critical differences between Specialized Investment Funds (SIFs) and Mutual Funds: minimum investment (₹10 lakh vs ₹500), derivatives, long-short strategies, and how to choose the right one.",
		image: sifVsMfImg,
		author: "Saurabh Sharma",
		authorRole: "Senior Financial Advisor, KNAPS",
		authorImage:
			"https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
		featured: true,
	},
];

export function getBlogByIdOrSlug(idOrSlug) {
	if (!idOrSlug) return blogsData[0];
	const normalized = String(idOrSlug).toLowerCase().trim();
	const found = blogsData.find(
		(b) => String(b.id) === normalized || b.slug.toLowerCase() === normalized
	);
	return found || blogsData[0];
}

export function getLatestBlogs(limit = 3) {
	return blogsData.slice(0, limit);
}

export function getRelatedBlogs(currentIdOrSlug, limit = 3) {
	const current = getBlogByIdOrSlug(currentIdOrSlug);
	return blogsData.filter((b) => b.id !== current.id).slice(0, limit);
}
