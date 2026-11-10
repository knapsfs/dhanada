import frappe
from frappe.utils import now_datetime

STATIC_ROUTES = [
	{"path": "/", "priority": "1.0", "changefreq": "daily"},
	{"path": "/about", "priority": "0.8", "changefreq": "monthly"},
	{"path": "/products", "priority": "0.9", "changefreq": "weekly"},
	{"path": "/contact", "priority": "0.8", "changefreq": "monthly"},
	{"path": "/mutual-funds", "priority": "0.9", "changefreq": "weekly"},
	{"path": "/sif", "priority": "0.9", "changefreq": "weekly"},
	{"path": "/products/nps", "priority": "0.9", "changefreq": "weekly"},
	{"path": "/products/post-office-small-savings-schemes", "priority": "0.8", "changefreq": "monthly"},
	{"path": "/products/fixed-income-products", "priority": "0.8", "changefreq": "monthly"},
	{"path": "/products/life-insurance", "priority": "0.8", "changefreq": "monthly"},
	{"path": "/products/health-insurance", "priority": "0.8", "changefreq": "monthly"},
	{"path": "/products/general-insurance", "priority": "0.8", "changefreq": "monthly"},
	{"path": "/calculators/sip", "priority": "0.8", "changefreq": "monthly"},
	{"path": "/calculators/step-up-sip", "priority": "0.8", "changefreq": "monthly"},
	{"path": "/calculators/swp", "priority": "0.8", "changefreq": "monthly"},
	{"path": "/calculators/lumpsum", "priority": "0.8", "changefreq": "monthly"},
	{"path": "/calculators/retirement", "priority": "0.8", "changefreq": "monthly"},
	{"path": "/calculators/future-value", "priority": "0.8", "changefreq": "monthly"},
	{"path": "/calculators/sip-lumpsum", "priority": "0.8", "changefreq": "monthly"},
	{"path": "/blogs", "priority": "0.9", "changefreq": "daily"},
	{"path": "/author", "priority": "0.7", "changefreq": "monthly"},
	{"path": "/regulatory-disclosures", "priority": "0.7", "changefreq": "monthly"},
	{"path": "/privacy-policy", "priority": "0.5", "changefreq": "yearly"},
	{"path": "/terms-and-conditions", "priority": "0.5", "changefreq": "yearly"},
]


@frappe.whitelist(allow_guest=True)
def get_sitemap_xml():
	"""Public Guest-whitelisted API to return dynamic production sitemap XML for https://knaps.in/.

	Merges core static pages with real-time published Frappe blog posts.
	"""
	domain = "https://knaps.in"
	today = now_datetime().strftime("%Y-%m-%d")

	urls = []
	for r in STATIC_ROUTES:
		urls.append(
			f"  <url>\n    <loc>{domain}{r['path']}</loc>\n    <lastmod>{today}</lastmod>\n    <changefreq>{r['changefreq']}</changefreq>\n    <priority>{r['priority']}</priority>\n  </url>"
		)

	try:
		posts = frappe.get_all(
			"Blog Post",
			filters={"published": 1},
			fields=["name", "route", "published_on", "creation", "modified"],
			order_by="modified desc",
		)
		for p in posts:
			raw_date = p.get("published_on") or p.get("creation") or p.get("modified")
			post_date = str(raw_date)[:10] if raw_date else today
			route = p.get("route") or f"blogs/{p.get('name')}"
			clean_route = f"/{route.lstrip('/')}"
			urls.append(
				f"  <url>\n    <loc>{domain}{clean_route}</loc>\n    <lastmod>{post_date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>"
			)
	except Exception:
		pass

	xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
	xml += "\n".join(urls)
	xml += "\n</urlset>"

	frappe.response["type"] = "xml"
	frappe.response["data"] = xml
	return xml

