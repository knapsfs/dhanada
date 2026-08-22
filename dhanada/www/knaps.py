import os

import frappe


def get_context(context):
	dist_path = frappe.get_app_path("dhanada", "public", "knaps", "index.html")
	dev_path = frappe.get_app_path("dhanada", "..", "frontend", "knaps", "index.html")
	is_prod = os.path.exists(dist_path)
	index_path = dist_path if is_prod else dev_path

	if os.path.exists(index_path):
		with open(index_path, "r") as f:
			context.knaps_html = f.read()
	else:
		context.knaps_html = "<h1>KNAPS Frontend Not Found</h1>"

	context.no_cache = 1
	return context
