import frappe


def after_install():
	ensure_master_data()


def after_migrate():
	ensure_master_data()


def before_tests():
	from frappe.utils.fixtures import sync_fixtures

	sync_fixtures("dhanada")
	ensure_master_data()


def ensure_master_data():
	"""
	Main function to ensure all master data exists.
	Call all specific ensure_* functions from here.
	"""
	frappe.logger().info("Starting Dhanada bootstrap process...")
	ensure_crm_sources()
	ensure_sif_subcategories()
	frappe.logger().info("Finished Dhanada bootstrap process.")


def ensure_sif_subcategories():
	"""
	Ensure all 7 canonical SIF Investment Strategy Subcategories exist from fixtures.
	"""
	from dhanada.sif.sync.constants import APPROVED_SUBCATEGORIES

	for sub in APPROVED_SUBCATEGORIES:
		if not frappe.db.exists("SIF Investment Strategy Subcategory", sub):
			try:
				doc = frappe.get_doc(
					{
						"doctype": "SIF Investment Strategy Subcategory",
						"subcategory_name": sub,
					}
				)
				doc.insert(ignore_permissions=True)
				frappe.logger().info(f"Created SIF Subcategory: {sub}")
			except Exception as e:
				frappe.logger().error(f"Failed to create SIF Subcategory '{sub}': {e!s}")


def ensure_crm_sources():
	"""
	Ensure required CRM Lead Sources exist.
	"""
	required_sources = ["Website Chatbot", "Website Form", "Website", "WhatsApp", "Referral", "Manual"]

	for source in required_sources:
		if not frappe.db.exists("CRM Lead Source", {"source_name": source}):
			try:
				# Create the CRM Lead Source
				doc = frappe.get_doc({"doctype": "CRM Lead Source", "source_name": source, "details": ""})
				# Attempt to insert, ignore if it already exists (to be extra safe)
				doc.insert(ignore_permissions=True)
				frappe.logger().info(f"Created CRM Lead Source: {source}")
			except Exception as e:
				frappe.logger().error(f"Failed to create CRM Lead Source '{source}': {e!s}")
		else:
			frappe.logger().info(f"Skipped existing CRM Lead Source: {source}")
