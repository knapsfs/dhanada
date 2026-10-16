# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import frappe
from frappe.tests.utils import FrappeTestCase
from frappe.utils import add_days, today


class TestRenewal(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")
		self.client = frappe.get_doc({
			"doctype": "Client",
			"client_type": "Individual",
			"first_name": "Arun",
			"last_name": "Joshi",
			"email": "arun.joshi.unique@example.com",
			"mobile_no": "9876543240",
			"pan": "RNWCL1234A",
		}).insert()

	def tearDown(self):
		frappe.set_user("Administrator")
		if hasattr(self, "client") and frappe.db.exists("Client", self.client.name):
			frappe.delete_doc("Client", self.client.name, ignore_permissions=True, force=True)

	def test_create_renewal_success(self):
		renewal = frappe.get_doc({
			"doctype": "Renewal",
			"client": self.client.name,
			"product_name": "Specialized Investment Fund - Tier 1",
			"renewal_date": add_days(today(), 30),
			"relationship_manager": "Administrator",
			"status": "Upcoming",
		}).insert()

		self.assertTrue(renewal.name.startswith("RNW-"))
		self.assertEqual(renewal.client_name, "Arun Joshi")
		self.assertEqual(renewal.status, "Upcoming")
		self.assertIsNone(renewal.completion_date)

	def test_renewal_completion_sets_completion_date(self):
		renewal = frappe.get_doc({
			"doctype": "Renewal",
			"client": self.client.name,
			"product_name": "Advisory Mandate",
			"renewal_date": today(),
			"relationship_manager": "Administrator",
			"status": "Upcoming",
		}).insert()

		renewal.status = "Renewed"
		renewal.save()
		renewal.reload()

		self.assertEqual(renewal.status, "Renewed")
		self.assertEqual(str(renewal.completion_date), today())
