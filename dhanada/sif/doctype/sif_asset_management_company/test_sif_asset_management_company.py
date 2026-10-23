# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import frappe
from frappe.tests import IntegrationTestCase


class IntegrationTestSIFAssetManagementCompany(IntegrationTestCase):
	"""Integration tests for SIFAssetManagementCompany logo uploads and privacy enforcement."""

	def tearDown(self):
		frappe.db.after_rollback.reset()
		super().tearDown()

	def test_amc_save_enforces_public_logo_url_and_record(self):
		"""Verify AMC document validation ensures amc_logo and linked File doc are public."""
		file_doc = frappe.get_doc(
			{
				"doctype": "File",
				"file_name": f"test_amc_logo_public_{frappe.generate_hash(length=8)}.png",
				"content": b"png_data_content",
				"is_private": 0,
			}
		).insert(ignore_permissions=True)

		amc = frappe.get_doc(
			{
				"doctype": "SIF Asset Management Company",
				"registration_number": f"TEST_REG_{frappe.generate_hash(length=8)}",
				"amc_name": "Test AMC Public Logo",
				"sif_name": "Test SIF",
				"code": f"CODE_{frappe.generate_hash(length=6)}",
				"rta": "CAMS",
				"amc_logo": file_doc.file_url,
			}
		).insert(ignore_permissions=True)

		amc.reload()
		self.assertTrue(amc.amc_logo.startswith("/files/"))
		self.assertEqual(amc.amc_logo, file_doc.file_url)

	def test_amc_with_private_url_is_converted_to_public(self):
		"""Verify that if an AMC is passed a /private/files URL, it converts it to /files/."""
		file_doc = frappe.get_doc(
			{
				"doctype": "File",
				"file_name": f"test_private_logo_{frappe.generate_hash(length=8)}.png",
				"content": b"test_content_private_logo",
				"is_private": 1,
			}
		).insert(ignore_permissions=True)

		self.assertEqual(file_doc.is_private, 1)
		self.assertTrue(file_doc.file_url.startswith("/private/files/"))

		amc = frappe.get_doc(
			{
				"doctype": "SIF Asset Management Company",
				"registration_number": f"TEST_REG_{frappe.generate_hash(length=8)}",
				"amc_name": "Test AMC Convert Logo",
				"sif_name": "Test SIF",
				"code": f"CODE_{frappe.generate_hash(length=6)}",
				"rta": "Kfintech",
				"amc_logo": file_doc.file_url,
			}
		).insert(ignore_permissions=True)

		amc.reload()
		file_doc.reload()
		self.assertEqual(file_doc.is_private, 0)
		self.assertTrue(file_doc.file_url.startswith("/files/"))
		self.assertTrue(amc.amc_logo.startswith("/files/"))
		self.assertEqual(amc.amc_logo, file_doc.file_url)
