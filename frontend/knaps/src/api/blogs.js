/**
 * Dynamic Blog & Author API client for KNAPS Frappe Backend
 */

export async function fetchBlogPosts({ category = null, limit = 20, offset = 0 } = {}) {
	try {
		const params = new URLSearchParams();
		if (category && category !== "All") params.append("category", category);
		if (limit) params.append("limit", limit);
		if (offset) params.append("offset", offset);

		const qs = params.toString();
		const url = `/api/method/dhanada.api.get_blog_posts${qs ? `?${qs}` : ""}`;
		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
			},
		});

		if (!res.ok) {
			throw new Error(`HTTP error ${res.status}`);
		}

		const data = await res.json();
		const result = data.message || data;

		if (result && result.status === "success") {
			return {
				posts: result.posts || [],
				total: result.total || 0,
				has_more: !!result.has_more,
			};
		}

		return { posts: [], total: 0, has_more: false };
	} catch (error) {
		console.error("Failed to fetch blog posts:", error);
		return { posts: [], total: 0, has_more: false, error: error.message };
	}
}

export async function fetchBlogDetails(slugOrId) {
	try {
		if (!slugOrId) throw new Error("Slug or ID is required");

		const url = `/api/method/dhanada.api.get_blog_details?slug_or_id=${encodeURIComponent(
			slugOrId
		)}`;
		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
			},
		});

		if (!res.ok) {
			throw new Error(`HTTP error ${res.status}`);
		}

		const data = await res.json();
		const result = data.message || data;

		if (result && result.status === "success" && result.blog) {
			return { blog: result.blog };
		}

		return { blog: null, message: result?.message || "Blog not found" };
	} catch (error) {
		console.error("Failed to fetch blog details:", error);
		return { blog: null, error: error.message };
	}
}

export async function fetchAuthorDetails(slugOrId) {
	try {
		if (!slugOrId) throw new Error("Author slug or ID is required");

		const url = `/api/method/dhanada.api.get_author_details?slug_or_id=${encodeURIComponent(
			slugOrId
		)}`;
		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
			},
		});

		if (!res.ok) {
			throw new Error(`HTTP error ${res.status}`);
		}

		const data = await res.json();
		const result = data.message || data;

		if (result && result.status === "success") {
			return {
				author: result.author || null,
				posts: result.posts || [],
			};
		}

		return { author: null, posts: [], message: result?.message || "Author not found" };
	} catch (error) {
		console.error("Failed to fetch author details:", error);
		return { author: null, posts: [], error: error.message };
	}
}
