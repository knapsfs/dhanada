# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import frappe
from frappe.tests.utils import FrappeTestCase


class TestFamily(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")
		self.test_clients = []
		self.client1 = frappe.get_doc(
			{
				"doctype": "Client",
				"client_type": "Individual",
				"first_name": "Ramesh",
				"last_name": "Agarwal",
				"email": "ramesh.agarwal.unique@example.com",
				"mobile_no": "9876543220",
				"pan": "FAMLY1234A",
				"current_portfolio_value": 5000000,
			}
		).insert()
		self.test_clients.append(self.client1.name)

		self.client2 = frappe.get_doc(
			{
				"doctype": "Client",
				"client_type": "Individual",
				"first_name": "Sunita",
				"last_name": "Agarwal",
				"email": "sunita.agarwal.unique@example.com",
				"mobile_no": "9876543221",
				"pan": "FAMLY1234B",
				"current_portfolio_value": 2500000,
			}
		).insert()
		self.test_clients.append(self.client2.name)

	def tearDown(self):
		frappe.set_user("Administrator")
		for c in getattr(self, "test_clients", []):
			if frappe.db.exists("Client", c):
				frappe.delete_doc("Client", c, ignore_permissions=True, force=True)

	def test_create_family_success_and_syncs_client(self):
		fam = frappe.get_doc(
			{
				"doctype": "Family",
				"family_name": "Agarwal Family Office",
				"primary_contact": self.client1.name,
				"members": [
					{"client": self.client1.name, "role": "Head of Family", "is_primary": 1},
					{"client": self.client2.name, "role": "Spouse", "is_primary": 0},
				],
			}
		).insert()

		self.assertTrue(fam.name.startswith("FAM-"))
		self.assertEqual(fam.total_family_portfolio_value, 7500000)

		# Verify Client family link sync
		self.client1.reload()
		self.client2.reload()
		self.assertEqual(self.client1.family, fam.name)
		self.assertEqual(self.client1.family_role, "Head of Family")
		self.assertEqual(self.client2.family, fam.name)
		self.assertEqual(self.client2.family_role, "Spouse")

	def test_family_requires_valid_primary_contact(self):
		with self.assertRaises((frappe.LinkValidationError, frappe.DoesNotExistError)):
			frappe.get_doc(
				{
					"doctype": "Family",
					"family_name": "Nonexistent Primary",
					"primary_contact": "CL-NONEXISTENT",
				}
			).insert()

	def test_family_prevents_duplicate_client_members(self):
		with self.assertRaises(frappe.DuplicateEntryError):
			frappe.get_doc(
				{
					"doctype": "Family",
					"family_name": "Duplicate Member Family",
					"primary_contact": self.client1.name,
					"members": [
						{"client": self.client1.name, "role": "Head of Family", "is_primary": 1},
						{"client": self.client1.name, "role": "Spouse", "is_primary": 0},
					],
				}
			).insert()
