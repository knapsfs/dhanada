import re
from math import ceil
import frappe
from frappe import _
from frappe.utils import cint, global_date_format, markdown, strip_html_tags


def _get_image_url(image_path):
	if not image_path:
		return ""
	if image_path.startswith(("http://", "https://", "data:")):
		return image_path
	return image_path if image_path.startswith("/") else f"/{image_path}"


def _get_clean_excerpt(doc, max_length=160):
	if getattr(doc, "blog_intro", None) and doc.blog_intro.strip():
		clean = strip_html_tags(doc.blog_intro).strip()
		return clean[:max_length].strip() + ("..." if len(clean) > max_length else "")
	if getattr(doc, "meta_description", None) and doc.meta_description.strip():
		clean = strip_html_tags(doc.meta_description).strip()
		return clean[:max_length].strip() + ("..." if len(clean) > max_length else "")
	content_text = _extract_html_content(doc)
	plain = strip_html_tags(content_text).strip()
	return plain[:max_length].strip() + ("..." if len(plain) > max_length else "")


def _extract_html_content(doc):
	content_type = getattr(doc, "content_type", "Rich Text")
	if content_type == "HTML":
		return getattr(doc, "content_html", "") or getattr(doc, "content", "") or ""
	elif content_type == "Markdown":
		md_text = getattr(doc, "content_md", "") or ""
		return markdown(md_text) if md_text else (getattr(doc, "content", "") or "")
	else:  # Rich Text
		return getattr(doc, "content", "") or getattr(doc, "content_html", "") or ""


def _calculate_read_time(doc, html_content):
	if getattr(doc, "read_time", None) and cint(doc.read_time) > 0:
		return f"{cint(doc.read_time)} min read"
	plain = strip_html_tags(html_content or "")
	words = len(plain.split())
	mins = max(1, ceil(words / 200))
	return f"{mins} min read"


def _format_post_dict(doc, category_map=None, blogger_map=None):
	if category_map is None:
		category_map = {}
	if blogger_map is None:
		blogger_map = {}

	cat_doc = category_map.get(doc.blog_category)
	cat_title = cat_doc.get("title") if cat_doc else (doc.blog_category or "Insights")

	blogger_doc = blogger_map.get(doc.blogger)
	author_name = (
		blogger_doc.get("full_name")
		or blogger_doc.get("short_name")
		or doc.blogger
		or "KNAPS Research"
	)
	author_role = blogger_doc.get("bio") or "Financial Research"
	author_avatar = _get_image_url(blogger_doc.get("avatar")) if blogger_doc else ""
	author_slug = doc.blogger or "shivangi"

	html_content = _extract_html_content(doc)
	excerpt = _get_clean_excerpt(doc)
	read_time_str = _calculate_read_time(doc, html_content)
	meta_img = _get_image_url(getattr(doc, "meta_image", None))

	# Format date nicely
	date_str = ""
	raw_date = getattr(doc, "published_on", None) or getattr(doc, "creation", None)
	if raw_date:
		try:
			date_str = global_date_format(raw_date)
		except Exception:
			date_str = str(raw_date)

	canonical_route = (
		f"/{doc.route.lstrip('/')}" if getattr(doc, "route", None) else f"/blogs/{doc.name}"
	)

	return {
		"id": doc.name,
		"name": doc.name,
		"title": doc.title,
		"slug": doc.name,
		"route": getattr(doc, "route", ""),
		"targetUrl": canonical_route,
		"category": cat_title,
		"category_slug": doc.blog_category or "",
		"date": date_str,
		"published_on": str(raw_date or ""),
		"image": meta_img,
		"description": excerpt,
		"content": html_content,
		"author": author_name,
		"author_slug": author_slug,
		"author_role": author_role,
		"author_image": author_avatar,
		"read_time": read_time_str,
		"content_type": getattr(doc, "content_type", "Rich Text"),
	}


@frappe.whitelist(allow_guest=True)
def get_blog_posts(category=None, limit=20, offset=0, blogger=None):
	"""Public Guest-whitelisted API to fetch published blog posts directly from Frappe DB.

	Guarantees real-time accuracy for guest visitors without permission errors.
	"""
	limit = cint(limit) or 20
	offset = cint(offset) or 0

	filters = {"published": 1}

	if category and category != "All":
		# Match either category name or category title
		matched_cat = frappe.db.get_value(
			"Blog Category", {"title": category}, "name"
		) or frappe.db.get_value("Blog Category", {"name": category}, "name")
		if matched_cat:
			filters["blog_category"] = matched_cat
		else:
			filters["blog_category"] = category

	if blogger:
		filters["blogger"] = blogger

	total = frappe.db.count("Blog Post", filters=filters)

	posts_raw = frappe.get_all(
		"Blog Post",
		filters=filters,
		fields=[
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
			"content_type",
			"content",
			"content_html",
			"content_md",
			"creation",
			"modified",
		],
		order_by="published_on desc, creation desc",
		limit_start=offset,
		limit_page_length=limit,
	)

	# Build maps for categories & bloggers
	cat_names = list({p.blog_category for p in posts_raw if p.blog_category})
	categories = (
		frappe.get_all("Blog Category", filters={"name": ["in", cat_names]}, fields=["name", "title"])
		if cat_names
		else []
	)
	category_map = {c.name: c for c in categories}

	blogger_names = list({p.blogger for p in posts_raw if p.blogger})
	bloggers = (
		frappe.get_all(
			"Blogger",
			filters={"name": ["in", blogger_names]},
			fields=["name", "short_name", "full_name", "bio", "avatar"],
		)
		if blogger_names
		else []
	)
	blogger_map = {b.name: b for b in bloggers}

	formatted_posts = [_format_post_dict(p, category_map, blogger_map) for p in posts_raw]

	return {
		"posts": formatted_posts,
		"total": total,
		"has_more": (offset + len(formatted_posts)) < total,
	}


@frappe.whitelist(allow_guest=True)
def get_blog_post_details(route_or_slug):
	"""Public Guest-whitelisted API to fetch full single blog post by name, route, or slug.

	Includes related articles and full rich HTML content.
	"""
	if not route_or_slug:
		return {"blog": None, "message": "Identifier required"}

	raw_id = str(route_or_slug).strip().lstrip("/")

	# Try finding post name by several matching strategies
	post_name = None

	# 1. Exact name match
	if frappe.db.exists("Blog Post", {"name": raw_id, "published": 1}):
		post_name = raw_id

	# 2. Exact route match
	if not post_name:
		post_name = frappe.db.get_value("Blog Post", {"route": raw_id, "published": 1}, "name")

	# 3. Route with 'blog/' prepended
	if not post_name and not raw_id.startswith("blog/"):
		alt_route = f"blog/{raw_id.replace('blogs/', '')}"
		post_name = frappe.db.get_value("Blog Post", {"route": alt_route, "published": 1}, "name")

	# 4. Match last slug component
	if not post_name:
		parts = raw_id.split("/")
		last_part = parts[-1]
		if frappe.db.exists("Blog Post", {"name": last_part, "published": 1}):
			post_name = last_part
		else:
			post_name = frappe.db.get_value(
				"Blog Post", [["route", "like", f"%{last_part}%"], ["published", "=", 1]], "name"
			)

	if not post_name:
		return {"blog": None, "message": f"Blog post not found for '{route_or_slug}'"}

	doc = frappe.get_doc("Blog Post", post_name)
	if not doc.published:
		return {"blog": None, "message": "Blog post is unpublished"}

	# Fetch category & blogger info
	cat_doc = frappe.db.get_value(
		"Blog Category", doc.blog_category, ["name", "title"], as_dict=True
	) if doc.blog_category else None
	category_map = {doc.blog_category: cat_doc} if cat_doc else {}

	blogger_doc = frappe.db.get_value(
		"Blogger", doc.blogger, ["name", "short_name", "full_name", "bio", "avatar"], as_dict=True
	) if doc.blogger else None
	blogger_map = {doc.blogger: blogger_doc} if blogger_doc else {}

	formatted = _format_post_dict(doc, category_map, blogger_map)

	# Fetch up to 3 related published posts
	related_posts = []
	rel_filters = {"published": 1, "name": ["!=", doc.name]}
	if doc.blog_category:
		rel_filters["blog_category"] = doc.blog_category

	rel_docs = frappe.get_all(
		"Blog Post",
		filters=rel_filters,
		fields=[
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
			"content_type",
			"content",
			"content_html",
			"content_md",
			"creation",
		],
		order_by="published_on desc, creation desc",
		limit_page_length=3,
	)

	if rel_docs:
		formatted_rel = [_format_post_dict(r, category_map, blogger_map) for r in rel_docs]
		related_posts = formatted_rel

	formatted["related_posts"] = related_posts

	return {"blog": formatted}


@frappe.whitelist(allow_guest=True)
def get_blog_categories():
	"""Returns all published Blog Categories that have active posts or are marked published."""
	categories = frappe.get_all(
		"Blog Category",
		filters={"published": 1},
		fields=["name", "title", "route", "description"],
		order_by="title asc",
	)
	return {"categories": categories}


@frappe.whitelist(allow_guest=True)
def get_author_profile(blogger_name):
	"""Returns blogger profile information and their published articles."""
	if not blogger_name:
		return {"author": None, "posts": []}

	b_name = frappe.db.get_value("Blogger", {"name": blogger_name}, "name") or frappe.db.get_value(
		"Blogger", {"short_name": blogger_name}, "name"
	)
	if not b_name:
		return {"author": None, "posts": [], "message": f"Author '{blogger_name}' not found"}

	blogger = frappe.get_doc("Blogger", b_name)
	posts_res = get_blog_posts(blogger=b_name, limit=50)

	author_profile = {
		"id": blogger.name,
		"name": blogger.full_name or blogger.short_name or blogger.name,
		"author_name": blogger.full_name or blogger.short_name or blogger.name,
		"short_name": blogger.short_name,
		"slug": blogger.name,
		"profile_image": _get_image_url(blogger.avatar),
		"designation": blogger.bio or "Financial Research",
		"biography": blogger.bio or "",
		"articles_count": posts_res.get("total", len(posts_res.get("posts", []))),
	}

	return {
		"author": author_profile,
		"posts": posts_res.get("posts", []),
	}
