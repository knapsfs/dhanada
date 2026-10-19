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
	ensure_lead_sources()
	ensure_crm_sources()
	ensure_sif_subcategories()
	ensure_knaps_crm_workspace()
	ensure_knaps_crm_desktop_icon()
	frappe.logger().info("Finished Dhanada bootstrap process.")


def ensure_lead_sources():
	"""
	Ensure canonical Dhanada Lead Sources exist.
	"""
	canonical_sources = [
		"Website Chatbot",
		"Website Form",
		"Investor Risk Profiler",
		"Website",
		"WhatsApp",
		"Referral",
		"Manual",
		"Direct",
		"Campaign",
	]

	if not frappe.db.exists("DocType", "Lead Source"):
		return

	for source in canonical_sources:
		if not frappe.db.exists("Lead Source", {"source_name": source}):
			try:
				doc = frappe.get_doc({
					"doctype": "Lead Source",
					"source_name": source,
					"is_active": 1,
					"details": f"Canonical acquisition source: {source}",
				})
				doc.insert(ignore_permissions=True)
				frappe.logger().info(f"Created Lead Source: {source}")
			except Exception as e:
				frappe.logger().error(f"Failed to create Lead Source '{source}': {e!s}")


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


def ensure_knaps_crm_workspace():
	"""
	Ensure KNAPS CRM Number Cards, Workspace, and Workspace Sidebar exist and are synced.
	"""
	import glob
	import json
	import os

	# 1. Sync Number Cards
	card_pattern = frappe.get_app_path("dhanada", "dhanada", "number_card", "*", "*.json")
	for cf in sorted(glob.glob(card_pattern)):
		try:
			with open(cf) as f:
				data = json.load(f)
			name = data.get("name")
			if not name:
				continue
			if frappe.db.exists("Number Card", name):
				doc = frappe.get_doc("Number Card", name)
				doc.update(data)
				doc.save(ignore_permissions=True)
			else:
				doc = frappe.get_doc(data)
				doc.insert(ignore_permissions=True)
		except Exception as e:
			frappe.logger().error(f"Failed to sync Number Card from {cf}: {e!s}")

	# 2. Sync Workspace
	ws_path = frappe.get_app_path("dhanada", "dhanada", "workspace", "knaps_crm", "knaps_crm.json")
	if os.path.exists(ws_path):
		try:
			with open(ws_path) as f:
				ws_data = json.load(f)
			ws_name = ws_data.get("name", "KNAPS CRM")
			if frappe.db.exists("Workspace", ws_name):
				ws = frappe.get_doc("Workspace", ws_name)
				ws.update(ws_data)
				ws.save(ignore_permissions=True)
			else:
				ws = frappe.get_doc(ws_data)
				ws.insert(ignore_permissions=True)
		except Exception as e:
			frappe.logger().error(f"Failed to sync Workspace KNAPS CRM: {e!s}")

	# 3. Sync Workspace Sidebar
	sb_path = frappe.get_app_path("dhanada", "workspace_sidebar", "knaps_crm.json")
	if os.path.exists(sb_path):
		try:
			with open(sb_path) as f:
				sb_data = json.load(f)
			sb_name = sb_data.get("name", "KNAPS CRM")
			if frappe.db.exists("Workspace Sidebar", sb_name):
				sb = frappe.get_doc("Workspace Sidebar", sb_name)
				sb.update(sb_data)
				sb.save(ignore_permissions=True)
			else:
				sb = frappe.get_doc(sb_data)
				sb.insert(ignore_permissions=True)
		except Exception as e:
			frappe.logger().error(f"Failed to sync Workspace Sidebar KNAPS CRM: {e!s}")


def ensure_knaps_crm_desktop_icon():
	"""
	Ensure KNAPS CRM standard Desktop Icon exists and is synced.
	"""
	import json
	import os

	icon_path = frappe.get_app_path("dhanada", "desktop_icon", "knaps_crm.json")
	icon_data = {
		"app": "dhanada",
		"bg_color": "gray",
		"doctype": "Desktop Icon",
		"hidden": 0,
		"icon_type": "App",
		"idx": 5,
		"label": "KNAPS CRM",
		"link": "/knaps-crm",
		"link_type": "External",
		"logo_url": "/assets/dhanada/images/CRM.jpg",
		"name": "KNAPS CRM",
		"standard": 1,
		"roles": [],
	}

	if os.path.exists(icon_path):
		try:
			with open(icon_path) as f:
				loaded_data = json.load(f)
				icon_data.update(loaded_data)
		except Exception as e:
			frappe.logger().error(f"Failed to read Desktop Icon file {icon_path}: {e!s}")

	icon_name = icon_data.get("name", "KNAPS CRM")
	if frappe.db.exists("Desktop Icon", icon_name):
		try:
			icon_doc = frappe.get_doc("Desktop Icon", icon_name)
			icon_doc.update(icon_data)
			icon_doc.save(ignore_permissions=True)
			frappe.logger().info("Updated Desktop Icon: KNAPS CRM")
		except Exception as e:
			frappe.logger().error(f"Failed to update Desktop Icon KNAPS CRM: {e!s}")
	else:
		try:
			icon_doc = frappe.get_doc(icon_data)
			icon_doc.insert(ignore_permissions=True)
			frappe.logger().info("Created Desktop Icon: KNAPS CRM")
		except Exception as e:
			frappe.logger().error(f"Failed to create Desktop Icon KNAPS CRM: {e!s}")

	frappe.cache.delete_key("desktop_icons")
	frappe.cache.delete_key("bootinfo")


def boot_knaps_crm(bootinfo):
	"""
	Extend bootinfo so KNAPS CRM is visible on the Frappe Desk home screen and app switcher.
	"""
	# 1. Update app_data
	if hasattr(bootinfo, "app_data") and isinstance(bootinfo.app_data, list):
		# Remove KNAPS CRM from dhanada's workspaces list so sidebar resolves properly
		for a in bootinfo.app_data:
			if a.get("app_name") == "dhanada":
				workspaces = a.get("workspaces") or []
				if "KNAPS CRM" in workspaces:
					workspaces.remove("KNAPS CRM")

		# Check if KNAPS CRM is already in app_data
		if not any(
			a.get("app_name") == "knaps_crm" or a.get("app_title") == "KNAPS CRM"
			for a in bootinfo.app_data
		):
			bootinfo.app_data.append({
				"app_name": "knaps_crm",
				"app_title": "KNAPS CRM",
				"app_route": "/knaps-crm",
				"app_logo_url": "/assets/dhanada/images/CRM.jpg",
				"modules": ["Dhanada"],
				"workspaces": ["KNAPS CRM"],
			})

	# 2. Update desktop_icons
	if hasattr(bootinfo, "desktop_icons") and isinstance(bootinfo.desktop_icons, list):
		existing = next((d for d in bootinfo.desktop_icons if d.get("label") == "KNAPS CRM"), None)
		if existing:
			existing["logo_url"] = "/assets/dhanada/images/CRM.jpg"
			existing["link"] = "/knaps-crm"
			existing["hidden"] = 0
		else:
			bootinfo.desktop_icons.append({
				"label": "KNAPS CRM",
				"bg_color": "gray",
				"link": "/knaps-crm",
				"link_type": "External",
				"app": "dhanada",
				"icon_type": "App",
				"parent_icon": None,
				"icon": None,
				"link_to": None,
				"idx": len(bootinfo.desktop_icons),
				"standard": 1,
				"logo_url": "/assets/dhanada/images/CRM.jpg",
				"hidden": 0,
				"name": "KNAPS CRM",
				"restrict_removal": 0,
				"icon_image": None,
			})


