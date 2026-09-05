import frappe


def get_home_page(user):
	"""
	Override the home page resolution logic.
	Ensure System Users always default to /desk instead of the KNAPS public homepage
	during the login flow. If they visit / directly, they should still see KNAPS.
	"""
	if getattr(frappe.local, "request", None) and frappe.local.request.path == "/api/method/login":
		if frappe.db.get_value("User", user, "user_type") == "System User":
			return "/desk"
	return None
