import frappe

@frappe.whitelist(allow_guest=True)
def get_testimonials():
	"""
	Returns list of testimonials from Frappe DocType 'Testimonials'.
	Fields: name, name1, location, description.
	"""
	return frappe.get_all(
		"Testimonials",
		fields=["name", "name1", "location", "description"],
		order_by="creation desc",
	)
