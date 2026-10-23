import os
import frappe


def get_context(context):
	dist_path = frappe.get_app_path("dhanada", "public", "knaps", "index.html")
	dev_path = frappe.get_app_path("dhanada", "..", "frontend", "knaps", "index.html")
	is_prod = os.path.exists(dist_path)
	index_path = dist_path if is_prod else dev_path

	if os.path.exists(index_path):
		html = frappe.read_file(index_path)
		try:
			csrf_token = frappe.sessions.get_csrf_token() or ""
			csrf_script = (
				f'<script>window.csrf_token = "{csrf_token}";'
				f' window.frappe = window.frappe || {{}};'
				f' window.frappe.csrf_token = "{csrf_token}";</script>'
			)
			if "</head>" in html:
				html = html.replace("</head>", f"{csrf_script}</head>", 1)
			else:
				html = f"{csrf_script}\n{html}"
		except Exception:
			pass
		context.knaps_html = html
	else:
		context.knaps_html = "<h1>KNAPS Frontend Not Found</h1>"

	context.no_cache = 1
	return context
