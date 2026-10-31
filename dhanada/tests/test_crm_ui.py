# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import frappe
from frappe.tests.utils import FrappeTestCase

from dhanada.lifecycle.api import get_crm_dashboard_metrics


class TestCRMUI(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")

	def test_workspace_exists_and_configured(self):
		"""
		Verify KNAPS CRM Desk Workspace exists, is public, and is mapped to module Dhanada.
		"""
		self.assertTrue(frappe.db.exists("Workspace", "KNAPS CRM"))
		ws = frappe.get_doc("Workspace", "KNAPS CRM")
		self.assertEqual(ws.title, "KNAPS CRM")
		self.assertEqual(ws.module, "Dhanada")
		self.assertEqual(ws.public, 1)

		# Verify shortcuts
		shortcut_labels = [s.label for s in ws.shortcuts]
		expected_shortcuts = [
			"Create Lead",
			"Create Client",
			"Create Task",
			"Create Renewal",
			"Leads",
			"Clients",
			"Families",
			"Tasks",
			"Renewals",
			"Activities",
		]
		for sc in expected_shortcuts:
			self.assertIn(sc, shortcut_labels, f"Expected shortcut '{sc}' in KNAPS CRM Workspace")

		# Verify Number Cards
		nc_names = [nc.number_card_name for nc in ws.number_cards]
		expected_ncs = [
			"Total Leads",
			"New Leads",
			"Interested Leads",
			"Converted Leads",
			"Total Clients",
			"Open Tasks",
			"Upcoming Renewals",
		]
		for nc in expected_ncs:
			self.assertIn(nc, nc_names, f"Expected Number Card '{nc}' in KNAPS CRM Workspace")

		# Verify Links
		link_targets = [l.link_to for l in ws.links if l.type == "Link"]
		for dt in ["Lead", "Client", "Family", "Task", "Renewal", "CRM Interaction"]:
			self.assertIn(dt, link_targets, f"Expected link to DocType '{dt}' in KNAPS CRM Workspace")

	def test_workspace_sidebar_navigation(self):
		"""
		Verify KNAPS CRM Workspace Sidebar provides navigation to all 7 required sections.
		"""
		self.assertTrue(frappe.db.exists("Workspace Sidebar", "KNAPS CRM"))
		sb = frappe.get_doc("Workspace Sidebar", "KNAPS CRM")
		self.assertEqual(sb.title, "KNAPS CRM")
		self.assertEqual(sb.app, "dhanada")

		items = {item.label: item for item in sb.items}
		expected_items = {
			"Dashboard": ("Workspace", "KNAPS CRM"),
			"Leads": ("DocType", "Lead"),
			"Clients": ("DocType", "Client"),
			"Families": ("DocType", "Family"),
			"Tasks": ("DocType", "Task"),
			"Renewals": ("DocType", "Renewal"),
			"Activities": ("DocType", "CRM Interaction"),
		}

		for label, (link_type, link_to) in expected_items.items():
			self.assertIn(label, items, f"Sidebar must contain navigation item '{label}'")
			self.assertEqual(items[label].link_type, link_type)
			self.assertEqual(items[label].link_to, link_to)

	def test_crm_dashboard_metrics_reflect_actual_records(self):
		"""
		Verify get_crm_dashboard_metrics returns accurate counts from the database.
		"""
		metrics = get_crm_dashboard_metrics()
		self.assertIsInstance(metrics, dict)

		required_keys = [
			"total_leads",
			"new_leads",
			"interested_leads",
			"converted_leads",
			"total_clients",
			"open_tasks",
			"upcoming_renewals",
		]
		for key in required_keys:
			self.assertIn(key, metrics)

		# Compare against direct DB counts
		self.assertEqual(metrics["total_leads"], frappe.db.count("Lead"))
		self.assertEqual(metrics["new_leads"], frappe.db.count("Lead", {"status": "New"}))
		self.assertEqual(metrics["interested_leads"], frappe.db.count("Lead", {"status": "Interested"}))
		self.assertEqual(metrics["converted_leads"], frappe.db.count("Lead", {"status": "Converted"}))
		self.assertEqual(metrics["total_clients"], frappe.db.count("Client"))
		self.assertEqual(
			metrics["open_tasks"], frappe.db.count("Task", {"status": ["in", ["Open", "In Progress"]]})
		)
		self.assertEqual(metrics["upcoming_renewals"], frappe.db.count("Renewal", {"status": "Upcoming"}))

	def test_crm_dashboard_metrics_permissions_and_security(self):
		"""
		Verify metrics cannot be accessed by Guest and never leak sensitive fields (PAN, tokens).
		"""
		# 1. Guest access denied
		frappe.set_user("Guest")
		with self.assertRaises(frappe.PermissionError):
			get_crm_dashboard_metrics()

		# Reset to Administrator
		frappe.set_user("Administrator")
		metrics = get_crm_dashboard_metrics()

		# 2. No sensitive keys
		sensitive_keywords = ["pan", "token", "password", "secret", "api_key", "mobile_no", "email"]
		for k in metrics.keys():
			for sk in sensitive_keywords:
				self.assertNotIn(sk, k.lower(), f"Dashboard metric key '{k}' must not leak sensitive info")

	def test_standard_number_cards_exist(self):
		"""
		Verify each standard Number Card document exists and maps to the correct DocType and filters.
		"""
		card_specs = {
			"Total Leads": ("Lead", "Count"),
			"New Leads": ("Lead", "Count"),
			"Interested Leads": ("Lead", "Count"),
			"Converted Leads": ("Lead", "Count"),
			"Total Clients": ("Client", "Count"),
			"Open Tasks": ("Task", "Count"),
			"Upcoming Renewals": ("Renewal", "Count"),
		}

		for name, (doctype, fn) in card_specs.items():
			self.assertTrue(frappe.db.exists("Number Card", name), f"Number Card '{name}' must exist")
			card = frappe.get_doc("Number Card", name)
			self.assertEqual(card.document_type, doctype)
			self.assertEqual(card.function, fn)
			self.assertEqual(card.module, "Dhanada")

	def test_lead_and_client_links_configured(self):
		"""
		Verify Lead and Client DocTypes have dashboard links configured for seamless navigation.
		"""
		lead_meta = frappe.get_meta("Lead")
		lead_link_doctypes = [l.link_doctype for l in lead_meta.links]
		self.assertIn("Task", lead_link_doctypes)
		self.assertIn("CRM Interaction", lead_link_doctypes)
		self.assertIn("Client Onboarding Submission", lead_link_doctypes)
		self.assertIn("Risk Profiler Submission", lead_link_doctypes)

		client_meta = frappe.get_meta("Client")
		client_link_doctypes = [l.link_doctype for l in client_meta.links]
		self.assertIn("Task", client_link_doctypes)
		self.assertIn("CRM Interaction", client_link_doctypes)
		self.assertIn("Renewal", client_link_doctypes)

	def test_knaps_crm_desk_app_registration_and_desktop_icon(self):
		"""
		Verify KNAPS CRM is registered on Desk home screen with CRM.jpg logo and /desk/knaps-crm route.
		"""
		# 1. Verify add_to_apps_screen in hooks
		apps_screen = frappe.get_hooks("add_to_apps_screen", app_name="dhanada")
		crm_hook = next((a for a in apps_screen if a.get("title") == "KNAPS CRM"), None)
		self.assertIsNotNone(crm_hook, "KNAPS CRM must be configured in add_to_apps_screen")
		self.assertEqual(crm_hook.get("route"), "/desk/knaps-crm")
		self.assertEqual(crm_hook.get("logo"), "/assets/dhanada/images/CRM.jpg")

		# 2. Verify Desktop Icon in database
		self.assertTrue(
			frappe.db.exists("Desktop Icon", "KNAPS CRM"), "Desktop Icon for KNAPS CRM must exist"
		)
		icon = frappe.get_doc("Desktop Icon", "KNAPS CRM")
		self.assertEqual(icon.label, "KNAPS CRM")
		self.assertEqual(icon.icon_type, "App")
		self.assertEqual(icon.link_type, "External")
		self.assertEqual(icon.link, "/desk/knaps-crm")
		self.assertEqual(icon.logo_url, "/assets/dhanada/images/CRM.jpg")
		self.assertEqual(icon.app, "dhanada")
		self.assertEqual(icon.hidden, 0)

		# 3. Verify bootinfo extension
		from dhanada.setup.bootstrap import boot_knaps_crm

		test_bootinfo = frappe._dict(
			app_data=[{"app_name": "dhanada", "app_title": "SIF", "workspaces": ["KNAPS CRM", "SIF"]}],
			desktop_icons=[],
		)
		boot_knaps_crm(test_bootinfo)

		# Verify app_data updated
		dhanada_app = next(a for a in test_bootinfo.app_data if a["app_name"] == "dhanada")
		self.assertNotIn("KNAPS CRM", dhanada_app["workspaces"])
		crm_app = next(a for a in test_bootinfo.app_data if a["app_name"] == "knaps_crm")
		self.assertEqual(crm_app["app_title"], "KNAPS CRM")
		self.assertEqual(crm_app["app_route"], "/desk/knaps-crm")
		self.assertEqual(crm_app["app_logo_url"], "/assets/dhanada/images/CRM.jpg")

		# Verify desktop_icons updated
		crm_desk_icon = next(d for d in test_bootinfo.desktop_icons if d["label"] == "KNAPS CRM")
		self.assertEqual(crm_desk_icon["link"], "/desk/knaps-crm")
		self.assertEqual(crm_desk_icon["logo_url"], "/assets/dhanada/images/CRM.jpg")
