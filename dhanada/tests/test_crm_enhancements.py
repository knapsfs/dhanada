# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import json
from datetime import timedelta

import frappe
from frappe.tests.utils import FrappeTestCase
from frappe.utils import now_datetime

from dhanada.api import create_chatbot_lead, create_website_lead
from dhanada.crm_api import (
	create_crm_lead,
	crm_logout,
	delete_crm_lead,
	get_client_details,
	get_clients,
	get_lead_details,
	get_leads,
	get_tasks,
	quick_log_interaction,
	save_contact_remark,
	update_crm_lead_status,
)


class TestCrmEnhancements(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")
		frappe.local.form_dict = frappe._dict()
		frappe.local.request = None
		frappe.local.request_ip = None
		if hasattr(frappe.local, "response"):
			frappe.local.response = frappe._dict({"message": None})
		self.cleanup_leads = []
		self.cleanup_clients = []
		# Ensure test records from any previous runs are cleaned up
		test_leads = frappe.get_all("Lead", filters={"email": ["like", "%@example.com"]}, pluck="name")
		for l_name in test_leads:
			frappe.delete_doc("Lead", l_name, ignore_permissions=True, force=True)
		test_clients = frappe.get_all("Client", filters={"email": ["like", "%@example.com"]}, pluck="name")
		for c_name in test_clients:
			frappe.delete_doc("Client", c_name, ignore_permissions=True, force=True)
		frappe.db.commit()

	def tearDown(self):
		frappe.set_user("Administrator")
		for lead_name in self.cleanup_leads:
			if frappe.db.exists("Lead", lead_name):
				frappe.delete_doc("Lead", lead_name, ignore_permissions=True, force=True)
		for client_name in self.cleanup_clients:
			if frappe.db.exists("Client", client_name):
				frappe.delete_doc("Client", client_name, ignore_permissions=True, force=True)
		frappe.db.commit()
		frappe.local.request = None
		frappe.local.request_ip = None

	def test_a_exact_duplicate(self):
		"""TEST A — Submit the same enquiry twice with identical relevant submitted fields."""
		enquiry = {
			"full_name": "Rahul Sharma",
			"email": "rahul.sharma.test@example.com",
			"phone": "9876543210",
			"product": "Specialized Investment Fund (SIF)",
			"notes": "First enquiry note",
		}
		frappe.local.form_dict = frappe._dict(enquiry)
		res1 = create_website_lead()
		self.assertTrue(res1.get("success"))
		lead_id1 = res1.get("lead_name")
		self.cleanup_leads.append(lead_id1)
		self.assertFalse(res1.get("is_duplicate"))

		# Save original modified timestamp
		orig_lead = frappe.get_doc("Lead", lead_id1)
		orig_notes = orig_lead.notes

		# Second submission with exact same relevant fields (different note should not overwrite)
		dup_enquiry = {
			"full_name": "Rahul Sharma",
			"email": "rahul.sharma.test@example.com",
			"phone": "9876543210",
			"product": "Specialized Investment Fund (SIF)",
			"notes": "Second enquiry note trying to overwrite",
		}
		frappe.local.form_dict = frappe._dict(dup_enquiry)
		res2 = create_website_lead()
		self.assertTrue(res2.get("success"))
		self.assertTrue(res2.get("is_duplicate"))
		self.assertEqual(res2.get("lead_name"), lead_id1)

		# Verify no duplicate was created and existing lead data remains unchanged
		check_lead = frappe.get_doc("Lead", lead_id1)
		self.assertEqual(check_lead.notes, orig_notes)
		all_matching = frappe.get_all(
			"Lead",
			filters={"email": "rahul.sharma.test@example.com", "mobile_no": "9876543210"},
		)
		self.assertEqual(len(all_matching), 1)

	def test_b_different_name(self):
		"""TEST B — Same email, phone, and product, but different names -> two separate leads."""
		frappe.local.form_dict = frappe._dict(
			{
				"full_name": "Rahul Sharma",
				"email": "family.shared@example.com",
				"phone": "9876543211",
				"product": "Specialized Investment Fund (SIF)",
			}
		)
		res1 = create_website_lead()
		lead1 = res1.get("lead_name")
		self.cleanup_leads.append(lead1)

		frappe.local.form_dict = frappe._dict(
			{
				"full_name": "Priya Sharma",
				"email": "family.shared@example.com",
				"phone": "9876543211",
				"product": "Specialized Investment Fund (SIF)",
			}
		)
		res2 = create_website_lead()
		lead2 = res2.get("lead_name")
		self.cleanup_leads.append(lead2)

		self.assertNotEqual(lead1, lead2)
		self.assertEqual(frappe.db.get_value("Lead", lead1, "lead_name"), "Rahul Sharma")
		self.assertEqual(frappe.db.get_value("Lead", lead2, "lead_name"), "Priya Sharma")

	def test_c_different_product(self):
		"""TEST C — Same name, email, and phone, but different products -> two separate leads."""
		frappe.local.form_dict = frappe._dict(
			{
				"full_name": "Amit Patel",
				"email": "amit.patel@example.com",
				"phone": "9876543212",
				"product": "Specialized Investment Fund (SIF)",
			}
		)
		res1 = create_website_lead()
		lead1 = res1.get("lead_name")
		self.cleanup_leads.append(lead1)

		frappe.local.form_dict = frappe._dict(
			{
				"full_name": "Amit Patel",
				"email": "amit.patel@example.com",
				"phone": "9876543212",
				"product": "Portfolio Management Services (PMS)",
			}
		)
		res2 = create_website_lead()
		lead2 = res2.get("lead_name")
		self.cleanup_leads.append(lead2)

		self.assertNotEqual(lead1, lead2)
		self.assertEqual(
			frappe.db.get_value("Lead", lead1, "product_interest"), "Specialized Investment Fund (SIF)"
		)
		self.assertEqual(
			frappe.db.get_value("Lead", lead2, "product_interest"),
			"Portfolio Management Services (PMS)",
		)

	def test_d_different_phone(self):
		"""TEST D — Same name, email, and product, but different phone numbers -> two separate leads."""
		frappe.local.form_dict = frappe._dict(
			{
				"full_name": "Deepak Verma",
				"email": "deepak.verma@example.com",
				"phone": "9876543213",
				"product": "Specialized Investment Fund (SIF)",
			}
		)
		res1 = create_website_lead()
		lead1 = res1.get("lead_name")
		self.cleanup_leads.append(lead1)

		frappe.local.form_dict = frappe._dict(
			{
				"full_name": "Deepak Verma",
				"email": "deepak.verma@example.com",
				"phone": "9876543214",
				"product": "Specialized Investment Fund (SIF)",
			}
		)
		res2 = create_website_lead()
		lead2 = res2.get("lead_name")
		self.cleanup_leads.append(lead2)

		self.assertNotEqual(lead1, lead2)
		self.assertEqual(frappe.db.get_value("Lead", lead1, "mobile_no"), "9876543213")
		self.assertEqual(frappe.db.get_value("Lead", lead2, "mobile_no"), "9876543214")

	def test_e_different_email(self):
		"""TEST E — Same name, phone, and product, but different email addresses -> two separate leads."""
		frappe.local.form_dict = frappe._dict(
			{
				"full_name": "Sunita Joshi",
				"email": "sunita.personal@example.com",
				"phone": "9876543215",
				"product": "Specialized Investment Fund (SIF)",
			}
		)
		res1 = create_website_lead()
		lead1 = res1.get("lead_name")
		self.cleanup_leads.append(lead1)

		frappe.local.form_dict = frappe._dict(
			{
				"full_name": "Sunita Joshi",
				"email": "sunita.work@example.com",
				"phone": "9876543215",
				"product": "Specialized Investment Fund (SIF)",
			}
		)
		res2 = create_website_lead()
		lead2 = res2.get("lead_name")
		self.cleanup_leads.append(lead2)

		self.assertNotEqual(lead1, lead2)
		self.assertEqual(frappe.db.get_value("Lead", lead1, "email"), "sunita.personal@example.com")
		self.assertEqual(frappe.db.get_value("Lead", lead2, "email"), "sunita.work@example.com")

	def test_f_optional_fields(self):
		"""TEST F — Optional fields handling during duplicate detection."""
		# Lead with no product specified
		frappe.local.form_dict = frappe._dict(
			{
				"full_name": "Karan Singhania",
				"email": "karan.singh@example.com",
				"phone": "9876543216",
			}
		)
		res1 = create_website_lead()
		lead1 = res1.get("lead_name")
		self.cleanup_leads.append(lead1)

		# Second submission with no product specified -> exact match on submitted fields
		frappe.local.form_dict = frappe._dict(
			{
				"full_name": "Karan Singhania",
				"email": "karan.singh@example.com",
				"phone": "9876543216",
			}
		)
		res_dup = create_website_lead()
		self.assertTrue(res_dup.get("is_duplicate"))
		self.assertEqual(res_dup.get("lead_name"), lead1)

		# Third submission with product specified -> does NOT match unpopulated product
		frappe.local.form_dict = frappe._dict(
			{
				"full_name": "Karan Singhania",
				"email": "karan.singh@example.com",
				"phone": "9876543216",
				"product": "Specialized Investment Fund (SIF)",
			}
		)
		res_diff = create_website_lead()
		self.assertFalse(res_diff.get("is_duplicate"))
		lead3 = res_diff.get("lead_name")
		self.cleanup_leads.append(lead3)
		self.assertNotEqual(lead1, lead3)

	def test_g_lead_remark(self):
		"""TEST G — Save a remark on a Lead and update it."""
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Test Remark Lead",
				"mobile_no": "9876543217",
				"email": "remark.lead@example.com",
				"status": "New",
			}
		)
		lead.insert(ignore_permissions=True)
		self.cleanup_leads.append(lead.name)

		# Initial remark save
		res1 = save_contact_remark("Lead", lead.name, "Initial introductory call completed.")
		self.assertTrue(res1.get("success"))
		self.assertEqual(res1.get("latest_remark"), "Initial introductory call completed.")
		self.assertEqual(res1.get("last_contacted_by"), "Administrator")
		self.assertTrue(res1.get("last_contacted_on"))
		self.assertEqual(res1.get("days_since_contact"), 0)
		self.assertFalse(res1.get("is_contact_overdue"))

		# Check DB values
		lead_db1 = frappe.get_doc("Lead", lead.name)
		self.assertEqual(lead_db1.latest_remark, "Initial introductory call completed.")
		self.assertEqual(lead_db1.last_contacted_by, "Administrator")
		orig_timestamp = lead_db1.last_contacted_on

		# Update remark with new text
		res2 = save_contact_remark(
			"Lead", lead.name, "Follow-up meeting scheduled for portfolio review."
		)
		self.assertTrue(res2.get("success"))
		self.assertEqual(
			res2.get("latest_remark"), "Follow-up meeting scheduled for portfolio review."
		)

		lead_db2 = frappe.get_doc("Lead", lead.name)
		# Verifies that it replaced rather than appended
		self.assertEqual(
			lead_db2.latest_remark, "Follow-up meeting scheduled for portfolio review."
		)
		self.assertNotIn("Initial introductory call", lead_db2.latest_remark)
		self.assertTrue(lead_db2.last_contacted_on >= orig_timestamp)

	def test_h_client_remark(self):
		"""TEST H — Save a remark on a Client and update it."""
		client = frappe.get_doc(
			{
				"doctype": "Client",
				"first_name": "Test",
				"last_name": "Client",
				"client_name": "Test Client",
				"mobile_no": "9876543218",
				"email": "remark.client@example.com",
				"client_status": "Active",
			}
		)
		client.insert(ignore_permissions=True)
		self.cleanup_clients.append(client.name)

		# Initial remark save
		res1 = save_contact_remark("Client", client.name, "Quarterly investment review discussion.")
		self.assertTrue(res1.get("success"))
		self.assertEqual(res1.get("latest_remark"), "Quarterly investment review discussion.")
		self.assertEqual(res1.get("last_contacted_by"), "Administrator")
		self.assertTrue(res1.get("last_contacted_on"))
		self.assertEqual(res1.get("days_since_contact"), 0)
		self.assertFalse(res1.get("is_contact_overdue"))

		# Second remark replaces first
		res2 = save_contact_remark("Client", client.name, "Client approved rebalancing proposal.")
		self.assertTrue(res2.get("success"))
		self.assertEqual(res2.get("latest_remark"), "Client approved rebalancing proposal.")

		client_db = frappe.get_doc("Client", client.name)
		self.assertEqual(client_db.latest_remark, "Client approved rebalancing proposal.")
		self.assertNotIn("Quarterly investment review", client_db.latest_remark)

	def test_i_overdue_boundary(self):
		"""TEST I — Overdue boundary: 44 days (not overdue), 45 days (overdue), 46 days (overdue), None (never)."""
		now = now_datetime()

		# Case 1: 44 days ago
		lead44 = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Lead 44 Days",
				"mobile_no": "9876543220",
				"status": "Interested",
				"last_contacted_on": now - timedelta(days=44, hours=2),
				"latest_remark": "Contacted 44 days ago",
			}
		)
		lead44.insert(ignore_permissions=True)
		self.cleanup_leads.append(lead44.name)

		# Case 2: 45 days ago
		lead45 = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Lead 45 Days",
				"mobile_no": "9876543221",
				"status": "Interested",
				"last_contacted_on": now - timedelta(days=45, hours=2),
				"latest_remark": "Contacted 45 days ago",
			}
		)
		lead45.insert(ignore_permissions=True)
		self.cleanup_leads.append(lead45.name)

		# Case 3: 46 days ago
		lead46 = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Lead 46 Days",
				"mobile_no": "9876543222",
				"status": "Interested",
				"last_contacted_on": now - timedelta(days=46, hours=2),
				"latest_remark": "Contacted 46 days ago",
			}
		)
		lead46.insert(ignore_permissions=True)
		self.cleanup_leads.append(lead46.name)

		# Case 4: Never contacted (None)
		lead_never = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Lead Never Contacted",
				"mobile_no": "9876543223",
				"status": "New",
			}
		)
		lead_never.insert(ignore_permissions=True)
		self.cleanup_leads.append(lead_never.name)

		# Query via API
		details44 = get_lead_details(lead44.name)["lead"]
		details45 = get_lead_details(lead45.name)["lead"]
		details46 = get_lead_details(lead46.name)["lead"]
		details_never = get_lead_details(lead_never.name)["lead"]

		# 44 days: not overdue
		self.assertEqual(details44["days_since_contact"], 44)
		self.assertFalse(details44["is_contact_overdue"])

		# 45 days: overdue
		self.assertEqual(details45["days_since_contact"], 45)
		self.assertTrue(details45["is_contact_overdue"])

		# 46 days: overdue
		self.assertEqual(details46["days_since_contact"], 46)
		self.assertTrue(details46["is_contact_overdue"])

		# Never contacted: None / False
		self.assertIsNone(details_never["days_since_contact"])
		self.assertFalse(details_never["is_contact_overdue"])

	def test_j_timer_reset(self):
		"""TEST J — Record a new remark on an overdue record resets the overdue timer."""
		now = now_datetime()
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Overdue Lead Reset Test",
				"mobile_no": "9876543224",
				"status": "Interested",
				"last_contacted_on": now - timedelta(days=60),
				"latest_remark": "Old remark from two months ago",
			}
		)
		lead.insert(ignore_permissions=True)
		self.cleanup_leads.append(lead.name)

		# Verify it starts as overdue
		before = get_lead_details(lead.name)["lead"]
		self.assertTrue(before["is_contact_overdue"])
		self.assertGreaterEqual(before["days_since_contact"], 45)

		# Record new contact remark
		res = save_contact_remark("Lead", lead.name, "Called investor today with market update.")
		self.assertTrue(res.get("success"))
		self.assertEqual(res.get("days_since_contact"), 0)
		self.assertFalse(res.get("is_contact_overdue"))

		# Fetch via get_lead_details to confirm state
		after = get_lead_details(lead.name)["lead"]
		self.assertEqual(after["days_since_contact"], 0)
		self.assertFalse(after["is_contact_overdue"])
		self.assertEqual(after["latest_remark"], "Called investor today with market update.")

	def test_k_permissions(self):
		"""TEST K — Unauthorized users (e.g. Guest) cannot save remarks or tamper with contact metadata."""
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Permissions Test Lead",
				"mobile_no": "9876543225",
				"status": "New",
			}
		)
		lead.insert(ignore_permissions=True)
		self.cleanup_leads.append(lead.name)

		frappe.set_user("Guest")
		try:
			# Calling save_contact_remark as Guest must raise PermissionError
			with self.assertRaises(frappe.PermissionError):
				save_contact_remark("Lead", lead.name, "Guest attempt to save remark")
		finally:
			frappe.set_user("Administrator")

		# Empty remark must be rejected with ValidationError and not touch timestamp
		lead_before = frappe.get_doc("Lead", lead.name)
		with self.assertRaises(frappe.ValidationError):
			save_contact_remark("Lead", lead.name, "   ")

		lead_after = frappe.get_doc("Lead", lead.name)
		self.assertEqual(lead_before.last_contacted_on, lead_after.last_contacted_on)

	def test_l_regression(self):
		"""TEST L — Existing lead intake, pipeline, clients, tasks, and status changes continue to work."""
		# 1. Manual Lead creation
		crm_lead = create_crm_lead(
			lead_name="Manual CRM Lead",
			mobile_no="9876543226",
			email="manual.lead@example.com",
			product_interest="Mutual Funds",
		)
		self.assertTrue(crm_lead.get("name"))
		self.cleanup_leads.append(crm_lead["name"])

		# 2. Pipeline fetching
		leads = get_leads()
		self.assertIsInstance(leads, list)
		lead_names = [l["name"] for l in leads]
		self.assertIn(crm_lead["name"], lead_names)

		# 3. Status update
		updated = update_crm_lead_status(crm_lead["name"], "Interested")
		self.assertEqual(updated.get("status"), "Interested")
		# Verify status change did NOT set contact timestamp
		lead_doc = frappe.get_doc("Lead", crm_lead["name"])
		self.assertIsNone(lead_doc.last_contacted_on)

		# 4. Quick log interaction
		interaction = quick_log_interaction(
			related_lead=crm_lead["name"],
			interaction_type="Phone Call",
			summary="Introductory discussion on phone",
		)
		self.assertTrue(interaction.get("name"))
		lead_doc.reload()
		self.assertEqual(lead_doc.latest_remark, "Introductory discussion on phone")
		self.assertTrue(lead_doc.last_contacted_on)

		# 5. Clients list
		clients = get_clients()
		self.assertIsInstance(clients, list)

		# 6. Tasks list
		tasks = get_tasks()
		self.assertIsInstance(tasks, list)

	def test_m_lead_deletion(self):
		"""Verify delete_crm_lead deletes lead and linked interactions/tasks safely."""
		lead = create_crm_lead(
			lead_name="Deletion Candidate",
			mobile_no="9811122233",
			email="delcand@example.com",
			product_interest="Mutual Funds",
		)
		self.cleanup_leads.append(lead["name"])

		# Create linked interaction
		quick_log_interaction(
			related_lead=lead["name"],
			interaction_type="Phone Call",
			summary="Follow-up before deletion",
		)

		# Create linked task
		task = frappe.get_doc({
			"doctype": "Task",
			"title": "Lead Deletion Task",
			"related_lead": lead["name"],
			"due_date": "2026-10-30",
			"status": "Open",
		}).insert(ignore_permissions=True)

		# Perform deletion
		res = delete_crm_lead(lead["name"])
		self.assertEqual(res.get("status"), "ok")

		# Verify lead, interaction, and task are deleted
		self.assertFalse(frappe.db.exists("Lead", lead["name"]))
		self.assertFalse(frappe.db.exists("Task", task.name))
		self.assertFalse(frappe.db.exists("CRM Interaction", {"related_lead": lead["name"]}))

		# Deleting non-existent lead raises ValidationError
		with self.assertRaises(frappe.ValidationError):
			delete_crm_lead("NON_EXISTENT_LEAD_XYZ")

	def test_n_crm_logout(self):
		"""Verify crm_logout returns success and commits session logout safely."""
		res = crm_logout()
		self.assertEqual(res.get("status"), "ok")
		self.assertEqual(res.get("message"), "Logged out successfully")

