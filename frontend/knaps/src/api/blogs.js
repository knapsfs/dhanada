/**
 * Official Frappe Blog Service
 * Integrates directly with Frappe core REST APIs:
 * - Blog Post (/api/resource/Blog Post)
 * - Blog Category (/api/resource/Blog Category)
 * - Blogger (/api/resource/Blogger)
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
	if (post.blog_intro && post.blog_intro.trim()) {
		const cleanIntro = stripHtml(post.blog_intro);
		return cleanIntro.length <= maxLength
			? cleanIntro
			: cleanIntro.slice(0, maxLength).trim() + "...";
	}
	if (post.meta_description && post.meta_description.trim()) {
		const cleanMeta = stripHtml(post.meta_description);
		return cleanMeta.length <= maxLength
			? cleanMeta
			: cleanMeta.slice(0, maxLength).trim() + "...";
	}
	const plain = stripHtml(post.content || post.content_html || "");
	if (!plain) return "";
	return plain.length <= maxLength ? plain : plain.slice(0, maxLength).trim() + "...";
}

/**
 * Formats published date string into user-friendly format e.g. "30 Sep 2026"
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
	if (post?.read_time) {
		const mins = parseInt(post.read_time, 10);
		if (!isNaN(mins) && mins > 0) return `${mins} min read`;
	}
	const text = stripHtml(post?.content || post?.blog_intro || "");
	const words = text.split(/\s+/).filter(Boolean).length;
	const mins = Math.max(1, Math.ceil(words / 200));
	return `${mins} min read`;
}

// In-memory cache for bloggers and categories to avoid redundant network round-trips
let cachedCategories = null;
let cachedBloggers = null;

/**
 * Fetches all official Blog Categories from Frappe
 */
export async function getBlogCategories() {
	if (cachedCategories) return cachedCategories;

	try {
		const fields = JSON.stringify(["name", "title", "route"]);
		const url = `${BASE_URL}/api/resource/Blog%20Category?fields=${encodeURIComponent(
			fields
		)}`;
		const res = await fetch(url, { headers: { Accept: "application/json" } });
		if (!res.ok) throw new Error(`HTTP error ${res.status}`);
		const json = await res.json();
		cachedCategories = json.data || [];
		return cachedCategories;
	} catch (err) {
		console.error("Failed to fetch Blog Categories from Frappe:", err);
		return [];
	}
}

/**
 * Fetches all official Bloggers from Frappe
 */
export async function getBloggers() {
	if (cachedBloggers) return cachedBloggers;

	try {
		const fields = JSON.stringify(["name", "short_name", "full_name", "bio", "avatar"]);
		const url = `${BASE_URL}/api/resource/Blogger?fields=${encodeURIComponent(fields)}`;
		const res = await fetch(url, { headers: { Accept: "application/json" } });
		if (!res.ok) throw new Error(`HTTP error ${res.status}`);
		const json = await res.json();
		cachedBloggers = json.data || [];
		return cachedBloggers;
	} catch (err) {
		console.error("Failed to fetch Bloggers from Frappe:", err);
		return [];
	}
}

/**
 * Fetches Blogger details by name or slug
 */
export async function getBlogger(nameOrSlug) {
	if (!nameOrSlug) return null;

	try {
		const url = `${BASE_URL}/api/resource/Blogger/${encodeURIComponent(nameOrSlug)}`;
		const res = await fetch(url, { headers: { Accept: "application/json" } });
		if (res.ok) {
			const json = await res.json();
			return json.data || null;
		}
	} catch {
		// fallback to searching cached bloggers
	}

	const all = await getBloggers();
	const lower = nameOrSlug.toLowerCase();
	return (
		all.find(
			(b) =>
				(b.name && b.name.toLowerCase() === lower) ||
				(b.short_name && b.short_name.toLowerCase() === lower) ||
				(b.full_name && b.full_name.toLowerCase() === lower)
		) || null
	);
}

/**
 * Formats a raw Frappe Blog Post into frontend card/page structure
 */
function formatPostData(post, categoryMap = {}, bloggerMap = {}) {
	const categoryDoc = categoryMap[post.blog_category] || null;
	const categoryTitle = categoryDoc ? categoryDoc.title : post.blog_category || "Insights";

	const bloggerDoc = bloggerMap[post.blogger] || null;
	const authorName =
		bloggerDoc?.full_name || bloggerDoc?.short_name || post.blogger || "KNAPS Research";
	const authorRole = bloggerDoc?.bio || "Financial Research";
	const authorImage = bloggerDoc?.avatar ? getFrappeImageUrl(bloggerDoc.avatar) : "";
	const authorSlug = bloggerDoc?.name || post.blogger || "Shivangi";

	const readTimeStr = getBlogReadTime(post);
	const excerptStr = getBlogExcerpt(post);
	const dateStr = formatBlogDate(post.published_on || post.creation);
	const imageUrl = getFrappeImageUrl(post.meta_image);

	// Canonical route in frontend e.g. /blog/mutual-funds/what’s-the-difference-between-sif-and-mutual-funds
	const canonicalRoute = post.route
		? `/${post.route.replace(/^\//, "")}`
		: `/blogs/${post.name}`;

	return {
		id: post.name,
		name: post.name,
		title: post.title,
		slug: post.name,
		route: post.route,
		targetUrl: canonicalRoute,
		category: categoryTitle,
		category_slug: post.blog_category,
		date: dateStr,
		published_on: post.published_on,
		image: imageUrl,
		description: excerptStr,
		content: post.content || "",
		author: authorName,
		author_slug: authorSlug,
		author_role: authorRole,
		author_image: authorImage,
		read_time: readTimeStr,
		raw: post,
	};
}

/**
 * Fetches published Blog Posts from Frappe REST API
 */
export async function getBlogPosts({
	category = null,
	limit = 20,
	offset = 0,
	blogger = null,
} = {}) {
	try {
		const [categories, bloggers] = await Promise.all([getBlogCategories(), getBloggers()]);

		const categoryMap = {};
		categories.forEach((c) => {
			categoryMap[c.name] = c;
		});

		const bloggerMap = {};
		bloggers.forEach((b) => {
			bloggerMap[b.name] = b;
		});

		const filters = [["published", "=", 1]];

		if (category && category !== "All") {
			// Find matching category name/slug
			const matchedCat = categories.find(
				(c) =>
					c.name.toLowerCase() === category.toLowerCase() ||
					c.title.toLowerCase() === category.toLowerCase()
			);
			if (matchedCat) {
				filters.push(["blog_category", "=", matchedCat.name]);
			} else {
				filters.push(["blog_category", "=", category]);
			}
		}

		if (blogger) {
			filters.push(["blogger", "=", blogger]);
		}

		const fields = JSON.stringify([
			"name",
			"title",
			"route",
			"blog_category",
			"blogger",
			"published",
			"published_on",
			"meta_image",
			"blog_intro",
			"read_time",
			"creation",
			"modified",
		]);

		const params = new URLSearchParams({
			fields: fields,
			filters: JSON.stringify(filters),
			order_by: "published_on desc, creation desc",
			limit_page_length: String(limit || 20),
			limit_start: String(offset || 0),
		});

		const url = `${BASE_URL}/api/resource/Blog%20Post?${params.toString()}`;
		const res = await fetch(url, { headers: { Accept: "application/json" } });

		if (!res.ok) {
			throw new Error(`HTTP error ${res.status}`);
		}

		const json = await res.json();
		const rawPosts = json.data || [];

		const formattedPosts = rawPosts.map((p) => formatPostData(p, categoryMap, bloggerMap));

		return {
			posts: formattedPosts,
			total: formattedPosts.length,
			has_more: formattedPosts.length >= limit,
		};
	} catch (error) {
		console.error("Failed to fetch Blog Posts from Frappe:", error);
		return { posts: [], total: 0, has_more: false, error: error.message };
	}
}

/**
 * Fetches a single Blog Post by route, slug, or name from Frappe REST API
 */
export async function getBlogPostByRoute(routeOrSlug) {
	if (!routeOrSlug) return { blog: null, message: "Route or slug is required" };

	try {
		const rawIdentifier = decodeURIComponent(routeOrSlug).trim();
		// Normalize path by stripping leading slash
		const cleanPath = rawIdentifier.replace(/^\//, "");

		// 1. Try querying by exact Frappe route
		let postSummary = null;

		// Check with route as cleanPath
		const fields = JSON.stringify(["name", "title", "route", "blog_category", "blogger"]);
		let queryRes = await fetch(
			`${BASE_URL}/api/resource/Blog%20Post?fields=${encodeURIComponent(
				fields
			)}&filters=${encodeURIComponent(
				JSON.stringify([
					["route", "=", cleanPath],
					["published", "=", 1],
				])
			)}`,
			{ headers: { Accept: "application/json" } }
		);

		if (queryRes.ok) {
			const data = await queryRes.json();
			if (data.data && data.data.length > 0) {
				postSummary = data.data[0];
			}
		}

		// 2. If not found, try matching with 'blog/' prepended if missing
		if (!postSummary && !cleanPath.startsWith("blog/")) {
			const altRoute = `blog/${cleanPath.replace(/^blogs\//, "")}`;
			queryRes = await fetch(
				`${BASE_URL}/api/resource/Blog%20Post?fields=${encodeURIComponent(
					fields
				)}&filters=${encodeURIComponent(
					JSON.stringify([
						["route", "=", altRoute],
						["published", "=", 1],
					])
				)}`,
				{ headers: { Accept: "application/json" } }
			);
			if (queryRes.ok) {
				const data = await queryRes.json();
				if (data.data && data.data.length > 0) {
					postSummary = data.data[0];
				}
			}
		}

		// 3. If not found, try querying by post 'name'
		if (!postSummary) {
			const parts = cleanPath.split("/");
			const lastPart = parts[parts.length - 1];

			queryRes = await fetch(
				`${BASE_URL}/api/resource/Blog%20Post?fields=${encodeURIComponent(
					fields
				)}&filters=${encodeURIComponent(
					JSON.stringify([
						["name", "=", lastPart],
						["published", "=", 1],
					])
				)}`,
				{ headers: { Accept: "application/json" } }
			);
			if (queryRes.ok) {
				const data = await queryRes.json();
				if (data.data && data.data.length > 0) {
					postSummary = data.data[0];
				}
			}
		}

		// 4. If not found, try partial route match on the slug
		if (!postSummary) {
			const parts = cleanPath.split("/");
			const lastPart = parts[parts.length - 1];

			queryRes = await fetch(
				`${BASE_URL}/api/resource/Blog%20Post?fields=${encodeURIComponent(
					fields
				)}&filters=${encodeURIComponent(
					JSON.stringify([
						["route", "like", `%${lastPart}%`],
						["published", "=", 1],
					])
				)}`,
				{ headers: { Accept: "application/json" } }
			);
			if (queryRes.ok) {
				const data = await queryRes.json();
				if (data.data && data.data.length > 0) {
					postSummary = data.data[0];
				}
			}
		}

		if (!postSummary) {
			return { blog: null, message: `Blog post not found for "${routeOrSlug}"` };
		}

		// 5. Fetch full document for this post to get content (Rich Text HTML)
		const docRes = await fetch(
			`${BASE_URL}/api/resource/Blog%20Post/${encodeURIComponent(postSummary.name)}`,
			{ headers: { Accept: "application/json" } }
		);

		if (!docRes.ok) {
			throw new Error(`Failed to load full post: ${docRes.status}`);
		}

		const docJson = await docRes.json();
		const fullPost = docJson.data;

		// Fetch related category and blogger
		const [categories, bloggers] = await Promise.all([getBlogCategories(), getBloggers()]);
		const categoryMap = {};
		categories.forEach((c) => {
			categoryMap[c.name] = c;
		});
		const bloggerMap = {};
		bloggers.forEach((b) => {
			bloggerMap[b.name] = b;
		});

		const formattedBlog = formatPostData(fullPost, categoryMap, bloggerMap);

		// Fetch up to 3 related published posts (excluding current post)
		let relatedPosts = [];
		try {
			const relatedFilters = [
				["published", "=", 1],
				["name", "!=", fullPost.name],
			];
			if (fullPost.blog_category) {
				relatedFilters.push(["blog_category", "=", fullPost.blog_category]);
			}
			const relParams = new URLSearchParams({
				fields: JSON.stringify([
					"name",
					"title",
					"route",
					"blog_category",
					"blogger",
					"published_on",
					"meta_image",
					"blog_intro",
					"read_time",
				]),
				filters: JSON.stringify(relatedFilters),
				order_by: "published_on desc",
				limit_page_length: "3",
			});
			const relRes = await fetch(
				`${BASE_URL}/api/resource/Blog%20Post?${relParams.toString()}`,
				{
					headers: { Accept: "application/json" },
				}
			);
			if (relRes.ok) {
				const relJson = await relRes.json();
				relatedPosts = (relJson.data || []).map((p) =>
					formatPostData(p, categoryMap, bloggerMap)
				);
			}
		} catch {
			relatedPosts = [];
		}

		formattedBlog.related_posts = relatedPosts;

		return { blog: formattedBlog };
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
		const blogger = await getBlogger(cleanId);

		if (!blogger) {
			return { author: null, posts: [], message: `Author "${nameOrSlug}" not found` };
		}

		const postsResult = await getBlogPosts({ blogger: blogger.name, limit: 50 });

		const authorProfile = {
			id: blogger.name,
			name: blogger.full_name || blogger.short_name || blogger.name,
			author_name: blogger.full_name || blogger.short_name || blogger.name,
			short_name: blogger.short_name,
			slug: blogger.name,
			profile_image: blogger.avatar ? getFrappeImageUrl(blogger.avatar) : "",
			designation: blogger.bio || "Financial Research",
			biography: blogger.bio || "",
			email: "",
			linkedin: "",
			articles_count: postsResult.posts.length,
		};

		return {
			author: authorProfile,
			posts: postsResult.posts,
		};
	} catch (error) {
		console.error("Failed to fetch author profile from Frappe:", error);
		return { author: null, posts: [], error: error.message };
	}
}

// Aliases for seamless drop-in backward compatibility with existing components
export const fetchBlogPosts = getBlogPosts;
export const fetchBlogDetails = getBlogPostByRoute;
export const fetchAuthorDetails = getAuthorProfile;
