/**
 * Official Frappe Blog Service
 * Connects directly to backend whitelisted endpoints in dhanada.api / dhanada.APIs.blogs:
 * - get_blog_posts
 * - get_blog_post_details
 * - get_blog_categories
 * - get_author_profile
 *
 * Guarantees real-time dynamic sync with Frappe Desk with zero static mock fallback.
 */

const BASE_URL = "";

/**
 * Normalizes Frappe image URLs (/files/... or full URL)
 */
export function getFrappeImageUrl(imagePath) {
	if (!imagePath) return "";
	if (
		imagePath.startsWith("http://") ||
		imagePath.startsWith("https://") ||
		imagePath.startsWith("data:")
	) {
		return imagePath;
	}
	return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
}

/**
 * Strips HTML tags safely for plain-text excerpts
 */
export function stripHtml(html) {
	if (!html) return "";
	return html
		.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
		.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Generates a clean plain-text excerpt from post intro or content
 */
export function getBlogExcerpt(post, maxLength = 160) {
	if (!post) return "";
	if (post.description && post.description.trim()) {
		return post.description;
	}
	if (post.blog_intro && post.blog_intro.trim()) {
		const cleanIntro = stripHtml(post.blog_intro);
		return cleanIntro.length <= maxLength
			? cleanIntro
			: cleanIntro.slice(0, maxLength).trim() + "...";
	}
	const plain = stripHtml(post.content || post.content_html || "");
	if (!plain) return "";
	return plain.length <= maxLength ? plain : plain.slice(0, maxLength).trim() + "...";
}

/**
 * Formats published date string into user-friendly format e.g. "27 Oct 2026"
 */
export function formatBlogDate(dateStr) {
	if (!dateStr) return "";
	try {
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return String(dateStr);
		return d.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	} catch {
		return String(dateStr);
	}
}

/**
 * Calculates read time in minutes
 */
export function getBlogReadTime(post) {
	if (post?.read_time) return post.read_time;
	const text = stripHtml(post?.content || post?.blog_intro || "");
	const words = text.split(/\s+/).filter(Boolean).length;
	const mins = Math.max(1, Math.ceil(words / 200));
	return `${mins} min read`;
}

/**
 * Fetches all official Blog Categories from Frappe
 */
export async function getBlogCategories() {
	try {
		const res = await fetch(`${BASE_URL}/api/method/dhanada.api.get_blog_categories`, {
			headers: { Accept: "application/json" },
		});
		if (res.ok) {
			const json = await res.json();
			if (json && json.message && Array.isArray(json.message.categories)) {
				return json.message.categories;
			}
		}
	} catch (err) {
		console.error("Failed to fetch Blog Categories from Frappe:", err);
	}
	return [];
}

/**
 * Fetches published Blog Posts dynamically from Frappe REST API
 */
export async function getBlogPosts({
	category = null,
	limit = 20,
	offset = 0,
	blogger = null,
} = {}) {
	try {
		const params = new URLSearchParams();
		if (category && category !== "All") {
			params.append("category", category);
		}
		if (blogger) {
			params.append("blogger", blogger);
		}
		if (limit) {
			params.append("limit", String(limit));
		}
		if (offset) {
			params.append("offset", String(offset));
		}

		const url = `${BASE_URL}/api/method/dhanada.api.get_blog_posts?${params.toString()}`;
		const res = await fetch(url, { headers: { Accept: "application/json" } });

		if (res.ok) {
			const json = await res.json();
			if (json && json.message) {
				return {
					posts: json.message.posts || [],
					total: json.message.total || 0,
					has_more: !!json.message.has_more,
				};
			}
		}

		throw new Error(`HTTP error ${res.status}`);
	} catch (error) {
		console.error("Failed to fetch Blog Posts from Frappe:", error);
		return { posts: [], total: 0, has_more: false, error: error.message };
	}
}

/**
 * Fetches a single Blog Post by route, slug, or name from Frappe Backend
 */
export async function getBlogPostByRoute(routeOrSlug) {
	if (!routeOrSlug) return { blog: null, message: "Route or slug is required" };

	try {
		const cleanId = decodeURIComponent(routeOrSlug).trim();
		const url = `${BASE_URL}/api/method/dhanada.api.get_blog_post_details?route_or_slug=${encodeURIComponent(
			cleanId
		)}`;
		const res = await fetch(url, { headers: { Accept: "application/json" } });

		if (res.ok) {
			const json = await res.json();
			if (json && json.message && json.message.blog) {
				return { blog: json.message.blog };
			}
			return { blog: null, message: json?.message?.message || "Blog post not found" };
		}

		throw new Error(`HTTP error ${res.status}`);
	} catch (error) {
		console.error("Failed to fetch Blog Details from Frappe:", error);
		return { blog: null, error: error.message };
	}
}

/**
 * Fetches Blogger details and all published articles authored by them
 */
export async function getAuthorProfile(nameOrSlug) {
	if (!nameOrSlug) return { author: null, posts: [], message: "Author identifier required" };

	try {
		const cleanId = decodeURIComponent(nameOrSlug).trim();
		const url = `${BASE_URL}/api/method/dhanada.api.get_author_profile?blogger_name=${encodeURIComponent(
			cleanId
		)}`;
		const res = await fetch(url, { headers: { Accept: "application/json" } });

		if (res.ok) {
			const json = await res.json();
			if (json && json.message) {
				return {
					author: json.message.author || null,
					posts: json.message.posts || [],
					message: json.message.message,
				};
			}
		}

		throw new Error(`HTTP error ${res.status}`);
	} catch (error) {
		console.error("Failed to fetch author profile from Frappe:", error);
		return { author: null, posts: [], error: error.message };
	}
}

// Aliases for seamless drop-in backward compatibility with existing components
export const fetchBlogPosts = getBlogPosts;
export const fetchBlogDetails = getBlogPostByRoute;
export const fetchAuthorDetails = getAuthorProfile;
