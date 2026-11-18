# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import frappe
from frappe.tests import IntegrationTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = []
IGNORE_TEST_RECORD_DEPENDENCIES = []


class IntegrationTestCategory(IntegrationTestCase):
	def test_category_creation_and_uniqueness(self):
		"""Verify Category creation and duplicate prevention."""
		cat_name = "Test Unique Asset Class"
		if frappe.db.exists("Category", cat_name):
			frappe.delete_doc("Category", cat_name, force=True, ignore_permissions=True)

		doc = frappe.get_doc(
			{
				"doctype": "Category",
				"category_name": cat_name,
			}
		).insert(ignore_permissions=True)
		self.assertEqual(doc.name, cat_name)

		# Attempt duplicate
		dup = frappe.get_doc(
			{
				"doctype": "Category",
				"category_name": cat_name,
			}
		)
		with self.assertRaises(frappe.DuplicateEntryError):
			dup.insert(ignore_permissions=True)

		frappe.delete_doc("Category", cat_name, force=True, ignore_permissions=True)
