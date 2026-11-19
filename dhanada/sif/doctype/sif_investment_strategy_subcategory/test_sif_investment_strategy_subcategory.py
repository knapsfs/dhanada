# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import frappe
from frappe.tests import IntegrationTestCase

EXTRA_TEST_RECORD_DEPENDENCIES = []
IGNORE_TEST_RECORD_DEPENDENCIES = []


class IntegrationTestSIFInvestmentStrategySubcategory(IntegrationTestCase):
	"""
	Integration tests for SIFInvestmentStrategySubcategory.
	Tests category assignment, mandatory category validation, and relationships.
	"""

	def setUp(self):
		super().setUp()
		from dhanada.setup.bootstrap import ensure_sif_categories

		ensure_sif_categories()
		self.cleanup_test_records()

	def tearDown(self):
		self.cleanup_test_records()
		super().tearDown()

	def cleanup_test_records(self):
		for name in [
			"Test Multi Subcat 1",
			"Test Multi Subcat 2",
			"Test Arbitrage Subcat",
			"Test No Cat Subcat",
		]:
			if frappe.db.exists("SIF Investment Strategy Subcategory", name):
				frappe.delete_doc(
					"SIF Investment Strategy Subcategory", name, force=True, ignore_permissions=True
				)

	def test_create_subcategory_with_category(self):
		"""Verify that a subcategory can be created with a valid Category."""
		doc = frappe.get_doc(
			{
				"doctype": "SIF Investment Strategy Subcategory",
				"subcategory_name": "Test Arbitrage Subcat",
				"category": "Hybrid",
			}
		)
		doc.insert(ignore_permissions=True)
		self.assertEqual(doc.name, "Test Arbitrage Subcat")
		self.assertEqual(doc.category, "Hybrid")

	def test_prevent_subcategory_without_category(self):
		"""Verify that creating a subcategory without a Category is prevented."""
		doc = frappe.get_doc(
			{
				"doctype": "SIF Investment Strategy Subcategory",
				"subcategory_name": "Test No Cat Subcat",
				"category": None,
			}
		)
		with self.assertRaises((frappe.MandatoryError, frappe.ValidationError)):
			doc.insert(ignore_permissions=True)

	def test_prevent_subcategory_with_invalid_category(self):
		"""Verify that assigning a non-existent Category raises a ValidationError."""
		doc = frappe.get_doc(
			{
				"doctype": "SIF Investment Strategy Subcategory",
				"subcategory_name": "Test Invalid Cat Subcat",
				"category": "NonExistentCategory",
			}
		)
		with self.assertRaises((frappe.ValidationError, frappe.LinkValidationError)):
			doc.insert(ignore_permissions=True)

	def test_category_can_have_multiple_subcategories(self):
		"""Verify that a single Category can be linked to multiple subcategories."""
		frappe.get_doc(
			{
				"doctype": "SIF Investment Strategy Subcategory",
				"subcategory_name": "Test Multi Subcat 1",
				"category": "Equity",
			}
		).insert(ignore_permissions=True)

		frappe.get_doc(
			{
				"doctype": "SIF Investment Strategy Subcategory",
				"subcategory_name": "Test Multi Subcat 2",
				"category": "Equity",
			}
		).insert(ignore_permissions=True)

		subcats = frappe.db.get_all(
			"SIF Investment Strategy Subcategory",
			filters={"category": "Equity"},
			pluck="name",
		)
		self.assertIn("Test Multi Subcat 1", subcats)
		self.assertIn("Test Multi Subcat 2", subcats)
		self.assertIn("Equity Long-Short Fund", subcats)
