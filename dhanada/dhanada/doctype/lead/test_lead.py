# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import frappe
from frappe.tests.utils import FrappeTestCase


class TestLead(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")
		if not frappe.db.exists("Lead Source", "Website Form"):
			frappe.get_doc({"doctype": "Lead Source", "source_name": "Website Form", "is_active": 1}).insert(ignore_permissions=True)

	def tearDown(self):
		frappe.set_user("Administrator")

	def test_create_lead_success(self):
		lead = frappe.get_doc({
			"doctype": "Lead",
			"first_name": "Vikram",
			"last_name": "Malhotra",
			"email": "vikram.malhotra@example.com",
			"mobile_no": "9876543210",
			"source": "Website Form",
			"product_interest": "Specialized Investment Fund (SIF)",
			"status": "New"
		}).insert()

		self.assertTrue(lead.name.startswith("LEAD-"))
		self.assertEqual(lead.lead_name, "Vikram Malhotra")
		self.assertEqual(lead.mobile_no, "9876543210")
		self.assertEqual(lead.status, "New")

	def test_lead_phone_and_email_validation(self):
		# Invalid email
		with self.assertRaises(frappe.ValidationError):
			frappe.get_doc({
				"doctype": "Lead",
				"first_name": "Bad",
				"last_name": "Email",
				"email": "invalid-email-string",
				"mobile_no": "9876543210"
			}).insert()

		# Invalid phone (too short)
		with self.assertRaises(frappe.ValidationError):
			frappe.get_doc({
				"doctype": "Lead",
				"first_name": "Bad",
				"last_name": "Phone",
				"email": "valid@example.com",
				"mobile_no": "12345"
			}).insert()

	def test_cannot_manually_set_converted_status_without_client(self):
		lead = frappe.get_doc({
			"doctype": "Lead",
			"first_name": "Pre",
			"last_name": "Convert",
			"email": "preconvert@example.com",
			"mobile_no": "9876543211",
			"status": "New"
		}).insert()

		lead.status = "Converted"
		with self.assertRaises(frappe.ValidationError):
			lead.save()

	def test_lead_status_transition_logs_history(self):
		lead = frappe.get_doc({
			"doctype": "Lead",
			"first_name": "Status",
			"last_name": "Logger",
			"email": "logger@example.com",
			"mobile_no": "9876543212",
			"status": "New"
		}).insert()

		lead.status = "Interested"
		lead.save()
		lead.reload()

		self.assertEqual(lead.status, "Interested")
		self.assertEqual(len(lead.status_history), 1)
		self.assertEqual(lead.status_history[0].from_status, "New")
		self.assertEqual(lead.status_history[0].to_status, "Interested")

		# Disqualify to Not Interested
		lead.status = "Not Interested"
		lead.lost_notes = "Not looking to invest at this time"
		lead.save()
		lead.reload()

		self.assertEqual(lead.status, "Not Interested")
		self.assertEqual(lead.lost_reason, "Not interested")
		self.assertEqual(len(lead.status_history), 2)
		self.assertEqual(lead.status_history[1].to_status, "Not Interested")

	def test_lead_guest_permissions(self):
		lead = frappe.get_doc({
			"doctype": "Lead",
			"first_name": "Private",
			"last_name": "Lead",
			"email": "private@example.com",
			"mobile_no": "9876543213",
			"status": "New"
		}).insert()

		frappe.set_user("Guest")
		self.assertFalse(frappe.has_permission("Lead", "read", lead.name))
		self.assertFalse(frappe.has_permission("Lead", "create"))
		self.assertFalse(frappe.has_permission("Lead", "write", lead.name))
