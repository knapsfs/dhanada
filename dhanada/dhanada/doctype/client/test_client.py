# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import frappe
from frappe.tests.utils import FrappeTestCase
from dhanada.dhanada.doctype.client.client import Client


class TestClient(FrappeTestCase):
	def setUp(self):
		frappe.db.delete("Client")
		frappe.set_user("Administrator")

	def tearDown(self):
		frappe.set_user("Administrator")
		frappe.db.delete("Client")

	def test_create_individual_client_success(self):
		client = frappe.get_doc({
			"doctype": "Client",
			"client_type": "Individual",
			"first_name": "Rajesh",
			"last_name": "Kumar",
			"email": "rajesh.kumar@example.com",
			"mobile_no": "9876543210",
			"pan": "ABCDE1234F",
			"risk_profile": "Moderate",
			"client_status": "Active"
		})
		client.insert()

		self.assertTrue(client.name.startswith("CL-"))
		self.assertEqual(client.client_name, "Rajesh Kumar")
		self.assertEqual(client.pan, "ABCDE1234F")
		self.assertEqual(client.onboarding_date, frappe.utils.today())

	def test_individual_client_requires_first_name(self):
		client = frappe.get_doc({
			"doctype": "Client",
			"client_type": "Individual",
			"first_name": "",
			"client_name": "No First Name",
			"email": "test@example.com"
		})
		with self.assertRaises(frappe.MandatoryError):
			client.insert()

	def test_create_organization_client_success(self):
		client = frappe.get_doc({
			"doctype": "Client",
			"client_type": "Organization",
			"client_name": "Acme Capital Advisors LLP",
			"email": "contact@acmecapital.com",
			"mobile_no": "+919876543211",
			"pan": "AAACA1234B",
			"client_status": "Active"
		})
		client.insert()

		self.assertEqual(client.client_name, "Acme Capital Advisors LLP")
		self.assertEqual(client.client_type, "Organization")

	def test_create_family_client_success(self):
		client = frappe.get_doc({
			"doctype": "Client",
			"client_type": "Family",
			"client_name": "Mehta Family Trust",
			"email": "trust@mehta.com",
			"mobile_no": "9876543212",
			"client_status": "Active"
		})
		client.insert()

		self.assertEqual(client.client_name, "Mehta Family Trust")
		self.assertEqual(client.client_type, "Family")

	def test_pan_validation_invalid_format(self):
		client = frappe.get_doc({
			"doctype": "Client",
			"client_type": "Individual",
			"first_name": "Amit",
			"email": "amit@example.com",
			"pan": "INVALID123"
		})
		with self.assertRaises(frappe.ValidationError):
			client.insert()

	def test_pan_validation_duplicate_prevention(self):
		client1 = frappe.get_doc({
			"doctype": "Client",
			"client_type": "Individual",
			"first_name": "Client",
			"last_name": "One",
			"email": "one@example.com",
			"pan": "ABCDE5678G"
		})
		client1.insert()

		client2 = frappe.get_doc({
			"doctype": "Client",
			"client_type": "Individual",
			"first_name": "Client",
			"last_name": "Two",
			"email": "two@example.com",
			"pan": "abcde5678g"  # Case-insensitive duplicate
		})
		with self.assertRaises(frappe.DuplicateEntryError):
			client2.insert()

	def test_mobile_number_validation(self):
		client = frappe.get_doc({
			"doctype": "Client",
			"client_type": "Individual",
			"first_name": "Suresh",
			"email": "suresh@example.com",
			"mobile_no": "12345"  # Too short
		})
		with self.assertRaises(frappe.ValidationError):
			client.insert()

	def test_permissions(self):
		# Create a client as Administrator
		client = frappe.get_doc({
			"doctype": "Client",
			"client_type": "Individual",
			"first_name": "Perm",
			"last_name": "Test",
			"email": "perm@example.com",
			"mobile_no": "9876543299"
		}).insert()

		# Guest should not be allowed to read or create
		frappe.set_user("Guest")
		self.assertFalse(frappe.has_permission("Client", "read", client.name))
		self.assertFalse(frappe.has_permission("Client", "create"))
