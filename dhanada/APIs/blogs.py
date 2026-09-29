import math
import frappe
from frappe.rate_limiter import rate_limit


def ensure_public_file(file_url: str) -> str:
	"""
	Ensures an uploaded file is public (/files/) rather than private (/private/files/),
	preventing 403 Forbidden errors when guests access blog images.
	"""
	if not file_url:
		return file_url
	if str(file_url).startswith("/private/files/"):
		file_docs = frappe.get_all("File", filters={"file_url": file_url}, fields=["name"])
		if file_docs:
			fdoc = frappe.get_doc("File", file_docs[0].name)
			fdoc.is_private = 0
			fdoc.save(ignore_permissions=True)
			return fdoc.file_url
	return file_url


def calculate_read_time(content_or_desc: str) -> str:
	if not content_or_desc:
		return "3 min read"
	clean_text = frappe.utils.strip_html(content_or_desc)
	words = len(clean_text.split())
	mins = max(1, math.ceil(words / 200))
	return f"{mins} min read"


@frappe.whitelist(allow_guest=True)
def get_blog_posts(category: str = None, limit: int = 20, offset: int = 0):
	"""
	Returns published blog posts ordered by publish_date DESC.
	Optionally filters by category.
	"""
	try:
		filters = {"published": 1}
		if category and category.strip() and category.lower() != "all":
			filters["category"] = category.strip()

		limit = int(limit) if limit else 20
		offset = int(offset) if offset else 0

		posts = frappe.get_all(
			"Blog Post",
			filters=filters,
			fields=[
				"name",
				"blog_title",
				"slug",
				"category",
				"author",
				"publish_date",
				"featured_image",
				"short_description",
				"content",
				"creation",
			],
			order_by="publish_date desc, creation desc",
			limit_page_length=limit,
			limit_start=offset,
		)

		total_count = frappe.db.count("Blog Post", filters=filters)

		# Fetch all author details referenced in these posts
		author_ids = list({p.author for p in posts if p.author})
		authors_by_id = {}
		if author_ids:
			authors = frappe.get_all(
				"Blog Author",
				filters={"name": ["in", author_ids]},
				fields=["name", "author_name", "slug", "profile_image", "designation", "biography", "linkedin", "email"],
			)
			for a in authors:
				authors_by_id[str(a.name)] = a

		formatted_posts = []
		for p in posts:
			author_info = authors_by_id.get(str(p.author)) if p.author else None
			read_time = calculate_read_time(p.content or p.short_description)

			formatted_posts.append({
				"id": p.name,
				"title": p.blog_title,
				"slug": p.slug,
				"category": p.category,
				"date": frappe.utils.format_date(p.publish_date, "dd MMM yyyy") if p.publish_date else "",
				"publish_date": str(p.publish_date) if p.publish_date else "",
				"image": p.featured_image or "",
				"description": p.short_description or "",
				"author": author_info.author_name if author_info else "KNAPS Research",
				"author_slug": author_info.slug if author_info else "",
				"author_role": author_info.designation if author_info else "Financial Advisor",
				"author_image": author_info.profile_image if author_info else "",
				"read_time": read_time,
			})

		return {
			"status": "success",
			"posts": formatted_posts,
			"total": total_count,
			"has_more": (offset + len(formatted_posts)) < total_count,
		}
	except Exception as e:
		frappe.log_error(f"Error in get_blog_posts: {e}", "Blog API")
		return {"status": "error", "message": str(e), "posts": [], "total": 0}


@frappe.whitelist(allow_guest=True)
def get_blog_details(slug_or_id: str):
	"""
	Fetches single published blog details with complete author profile and HTML content.
	"""
	if not slug_or_id:
		return {"status": "error", "message": "Slug or ID required"}

	try:
		identifier = str(slug_or_id).strip()

		# Try lookup by slug first
		post_name = frappe.db.get_value("Blog Post", {"slug": identifier, "published": 1}, "name")
		if not post_name:
			# Try lookup by name / id
			post_name = frappe.db.get_value("Blog Post", {"name": identifier, "published": 1}, "name")

		if not post_name:
			# Case insensitive slug check
			matches = frappe.get_all("Blog Post", filters={"published": 1}, fields=["name", "slug"])
			for m in matches:
				if (m.slug or "").lower() == identifier.lower():
					post_name = m.name
					break

		if not post_name:
			return {"status": "error", "message": f"Blog post not found for {slug_or_id}"}

		post = frappe.get_doc("Blog Post", post_name)

		# Fetch author doc
		author_doc = None
		if post.author:
			try:
				author_doc = frappe.get_doc("Blog Author", post.author)
			except Exception:
				author_doc = None

		read_time = calculate_read_time(post.content or post.short_description)

		# Also find related posts in the same category
		related = []
		try:
			related_posts = frappe.get_all(
				"Blog Post",
				filters={"published": 1, "name": ["!=", post.name]},
				fields=["name", "blog_title", "slug", "category", "publish_date", "featured_image", "short_description"],
				order_by="publish_date desc",
				limit_page_length=3,
			)
			for rp in related_posts:
				related.append({
					"id": rp.name,
					"title": rp.blog_title,
					"slug": rp.slug,
					"category": rp.category,
					"date": frappe.utils.format_date(rp.publish_date, "dd MMM yyyy") if rp.publish_date else "",
					"image": rp.featured_image or "",
					"description": rp.short_description or "",
				})
		except Exception:
			related = []

		return {
			"status": "success",
			"blog": {
				"id": post.name,
				"title": post.blog_title,
				"slug": post.slug,
				"category": post.category,
				"date": frappe.utils.format_date(post.publish_date, "dd MMM yyyy") if post.publish_date else "",
				"publish_date": str(post.publish_date) if post.publish_date else "",
				"image": post.featured_image or "",
				"description": post.short_description or "",
				"content": post.content or "",
				"author": author_doc.author_name if author_doc else "KNAPS Research",
				"author_slug": author_doc.slug if author_doc else "",
				"author_role": author_doc.designation if author_doc else "Financial Advisor",
				"author_image": author_doc.profile_image if author_doc else "",
				"author_bio": author_doc.biography if author_doc else "",
				"author_linkedin": author_doc.linkedin if author_doc else "",
				"author_email": author_doc.email if author_doc else "",
				"read_time": read_time,
				"related_posts": related,
			},
		}
	except Exception as e:
		frappe.log_error(f"Error in get_blog_details: {e}", "Blog API")
		return {"status": "error", "message": str(e)}


@frappe.whitelist(allow_guest=True)
def get_author_details(slug_or_id: str):
	"""
	Returns author profile and all published posts authored by them.
	"""
	if not slug_or_id:
		return {"status": "error", "message": "Slug or ID required"}

	try:
		identifier = str(slug_or_id).strip()

		# Find author by slug or name
		author_name = frappe.db.get_value("Blog Author", {"slug": identifier}, "name")
		if not author_name:
			author_name = frappe.db.get_value("Blog Author", {"name": identifier}, "name")

		if not author_name:
			# Case-insensitive slug fallback
			all_authors = frappe.get_all("Blog Author", fields=["name", "slug"])
			for a in all_authors:
				if (a.slug or "").lower() == identifier.lower():
					author_name = a.name
					break

		if not author_name:
			return {"status": "error", "message": f"Author not found for {slug_or_id}"}

		author = frappe.get_doc("Blog Author", author_name)

		# Fetch all published posts by this author
		posts = frappe.get_all(
			"Blog Post",
			filters={"author": author.name, "published": 1},
			fields=[
				"name",
				"blog_title",
				"slug",
				"category",
				"publish_date",
				"featured_image",
				"short_description",
				"content",
				"creation",
			],
			order_by="publish_date desc, creation desc",
		)

		formatted_posts = []
		for p in posts:
			read_time = calculate_read_time(p.content or p.short_description)
			formatted_posts.append({
				"id": p.name,
				"title": p.blog_title,
				"slug": p.slug,
				"category": p.category,
				"date": frappe.utils.format_date(p.publish_date, "dd MMM yyyy") if p.publish_date else "",
				"publish_date": str(p.publish_date) if p.publish_date else "",
				"image": p.featured_image or "",
				"description": p.short_description or "",
				"author": author.author_name,
				"author_slug": author.slug,
				"author_role": author.designation or "",
				"author_image": author.profile_image or "",
				"read_time": read_time,
			})

		return {
			"status": "success",
			"author": {
				"id": author.name,
				"name": author.author_name,
				"author_name": author.author_name,
				"slug": author.slug,
				"profile_image": author.profile_image or "",
				"designation": author.designation or "",
				"biography": author.biography or "",
				"email": author.email or "",
				"linkedin": author.linkedin or "",
				"articles_count": len(formatted_posts),
			},
			"posts": formatted_posts,
		}
	except Exception as e:
		frappe.log_error(f"Error in get_author_details: {e}", "Blog API")
		return {"status": "error", "message": str(e)}
