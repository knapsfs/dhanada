import json

import frappe


def fix_login_response(request, response):
	"""
	Routes users after login based on their role:
	- Administrator / System Users (System Manager, Desk Users, Employees, Sales Users):
	  Redirect directly to Frappe Desk ('/desk').
	- Website Users / Investors:
	  Redirect to the website homepage ('/').
	"""
	if (
		getattr(request, "path", None) == "/api/method/login"
		and getattr(response, "status_code", None) == 200
	):
		try:
			data = json.loads(response.data)
			user = getattr(getattr(frappe, "session", None), "user", None) or data.get("user")

			if user == "Administrator":
				data["home_page"] = "/desk"
			elif user and user != "Guest":
				user_type = frappe.db.get_value("User", user, "user_type")
				roles = frappe.get_roles(user) if hasattr(frappe, "get_roles") else []

				# System Users (Employees, Managers, Admins) go directly to Frappe Desk
				is_system_user = user_type == "System User" or any(
					r in roles
					for r in (
						"System Manager",
						"Desk User",
						"Sales User",
						"Sales Manager",
						"Employee",
						"Role Manager",
					)
				)

				if is_system_user:
					data["home_page"] = "/desk"
				else:
					# Website / Portal users (Investors) stay on frontend homepage
					if data.get("home_page") in ("knaps", "/knaps", None):
						data["home_page"] = "/"
			else:
				if data.get("home_page") in ("knaps", "/knaps"):
					data["home_page"] = "/"

			response.data = json.dumps(data).encode("utf-8")
			response.headers["Content-Length"] = str(len(response.data))
		except Exception:
			pass
