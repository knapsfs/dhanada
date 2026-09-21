# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import json
import os

import frappe
from frappe.tests import IntegrationTestCase

from dhanada.sif.sync.comparator import compare_scheme
from dhanada.sif.sync.importer import DataImporter
from dhanada.sif.sync.mapper import DataMapper
from dhanada.sif.sync.models import Scheme, SyncDataset

EXTRA_TEST_RECORD_DEPENDENCIES = []
IGNORE_TEST_RECORD_DEPENDENCIES = []


class IntegrationTestSIFScheme(IntegrationTestCase):
	"""
	Integration tests for SIFScheme and SIF Scheme Request document URL lifecycle.
	"""

	@classmethod
	def setUpClass(cls):
		super().setUpClass()
		from dhanada.setup.bootstrap import before_tests

		before_tests()

	def tearDown(self):
		frappe.db.rollback()

	def _sample_scheme_payload(self, sebi_code="TEST/O/E/ELSF/26/01/0001/TEST", isid_url=None):
		return {
			"sebi_code": sebi_code,
			"fund_name": "Test Long-Short Equity Fund",
			"scheme_name": "Test Long-Short Equity Fund",
			"category": "Equity Long-Short Fund",
			"fund_type": "An open ended equity investment strategy investing in listed equity",
			"scheme_objective": "Test investment objective",
			"sif_name": "Test SIF",
			"minimum_application_amount": "1000000",
			"asset_allocation": [
				{
					"allocation_type": "Equity",
					"minimum_percentage": 65,
					"maximum_percentage": 100,
				}
			],
			"fund_managers": [
				{
					"name": "Mr. Test Manager",
					"type": "Primary",
					"from": "2026-01-01",
				}
			],
			"plans": {
				"regular": {
					"growth": [
						{
							"name": "Test Regular Growth",
							"isin_code": "INF999K01010",
							"amfi_code": "SIF-999",
						}
					]
				}
			},
			"documents": {
				"scheme_id": "S-999",
				"info_pdf_url": isid_url or "https://portal.amfiindia.com/spages/S-999.pdf",
				"summary_pdf_url": "https://portal.amfiindia.com/spages/SSD_S-999.pdf",
				"summary_xls_url": "https://portal.amfiindia.com/spages/SSD_S-999.xls",
				"summary_xml_url": "https://portal.amfiindia.com/spages/SSD_S-999.xml",
			},
		}

	def test_documents_mapping_from_source_json(self):
		"""
		Verifies info_pdf_url maps to isid_url while unprovided fields
		(kim_url, sai_url, factsheet_url, monthly_portfolio_disclosure_url) remain None.
		"""
		payload = self._sample_scheme_payload()
		mapper = DataMapper(isin_sif_map={})
		dataset = mapper.map_dataset({"scheme_details": [payload]})

		self.assertEqual(len(dataset.schemes), 1)
		scheme = dataset.schemes[0]
		self.assertEqual(scheme.isid_url, "https://portal.amfiindia.com/spages/S-999.pdf")
		self.assertIsNone(scheme.kim_url)
		self.assertIsNone(scheme.sai_url)
		self.assertIsNone(scheme.factsheet_url)
		self.assertIsNone(scheme.monthly_portfolio_disclosure_url)

	def test_documents_missing_or_empty_remains_none(self):
		"""Verifies missing, None, or empty documents object gracefully yields isid_url=None."""
		mapper = DataMapper(isin_sif_map={})

		# Case 1: documents is empty dict
		p1 = self._sample_scheme_payload(sebi_code="TEST/1")
		p1["documents"] = {}
		s1 = mapper.map_dataset({"scheme_details": [p1]}).schemes[0]
		self.assertIsNone(s1.isid_url)

		# Case 2: documents is None
		p2 = self._sample_scheme_payload(sebi_code="TEST/2")
		p2["documents"] = None
		s2 = mapper.map_dataset({"scheme_details": [p2]}).schemes[0]
		self.assertIsNone(s2.isid_url)

		# Case 3: info_pdf_url is empty string / whitespace
		p3 = self._sample_scheme_payload(sebi_code="TEST/3")
		p3["documents"] = {"info_pdf_url": "   "}
		s3 = mapper.map_dataset({"scheme_details": [p3]}).schemes[0]
		self.assertIsNone(s3.isid_url)

		# Case 4: documents key missing entirely
		p4 = self._sample_scheme_payload(sebi_code="TEST/4")
		del p4["documents"]
		s4 = mapper.map_dataset({"scheme_details": [p4]}).schemes[0]
		self.assertIsNone(s4.isid_url)

	def test_new_scheme_request_lifecycle_with_document_urls(self):
		"""
		Verifies full request lifecycle:
		Source JSON -> SIF New Scheme Request -> Admin Approval -> SIF Scheme master.
		"""
		test_code = "TEST/O/E/ELSF/26/DOCS/0001/TEST"
		# Cleanup if exists from prior test runs
		for dt, key in [
			("SIF Scheme", {"sebi_code": test_code}),
			("SIF New Scheme Request", {"sebi_code": test_code}),
		]:
			existing = frappe.db.get_value(dt, key, "name")
			if existing:
				frappe.delete_doc(dt, existing, ignore_permissions=True, force=True)

		payload = self._sample_scheme_payload(
			sebi_code=test_code, isid_url="https://portal.amfiindia.com/spages/S-888.pdf"
		)
		mapper = DataMapper(isin_sif_map={})
		dataset = mapper.map_dataset({"scheme_details": [payload]})

		importer = DataImporter(dry_run=False)
		importer.import_dataset(dataset)

		# 1. Verify SIF New Scheme Request is created in draft
		req_name = frappe.db.get_value("SIF New Scheme Request", {"sebi_code": test_code}, "name")
		self.assertTrue(req_name, "SIF New Scheme Request should have been created")
		req_doc = frappe.get_doc("SIF New Scheme Request", req_name)
		self.assertEqual(req_doc.isid_url, "https://portal.amfiindia.com/spages/S-888.pdf")
		self.assertFalse(req_doc.kim_url)
		self.assertFalse(req_doc.sai_url)
		self.assertFalse(req_doc.factsheet_url)
		self.assertFalse(req_doc.monthly_portfolio_disclosure_url)
		self.assertEqual(req_doc.docstatus, 0)

		# 2. Simulate Admin Approval (submission of the request)
		req_doc.submit()
		self.assertEqual(req_doc.workflow_state, "Approved")
		created_scheme_name = req_doc.scheme
		self.assertTrue(created_scheme_name, "SIF Scheme should be created and linked upon approval")

		# 3. Verify SIF Scheme master has isid_url populated
		scheme_doc = frappe.get_doc("SIF Scheme", created_scheme_name)
		self.assertEqual(scheme_doc.isid_url, "https://portal.amfiindia.com/spages/S-888.pdf")
		self.assertFalse(scheme_doc.kim_url)
		self.assertFalse(scheme_doc.sai_url)
		self.assertFalse(scheme_doc.factsheet_url)
		self.assertFalse(scheme_doc.monthly_portfolio_disclosure_url)

		# Cleanup
		if frappe.db.exists("SIF New Scheme Request", req_name):
			req_doc.reload()
			if req_doc.docstatus == 1:
				req_doc.cancel()
			frappe.delete_doc("SIF New Scheme Request", req_name, ignore_permissions=True, force=True)
		if frappe.db.exists("SIF Scheme", created_scheme_name):
			frappe.delete_doc("SIF Scheme", created_scheme_name, ignore_permissions=True, force=True)

	def test_scheme_modification_request_lifecycle_with_document_urls(self):
		"""
		Verifies modification request flow:
		Existing Scheme -> Source URL changes -> compare_scheme detects change ->
		SIF Scheme Modification Request created -> Admin Approval -> Master updated.
		"""
		test_code = "TEST/O/E/ELSF/26/MOD/0002/TEST"
		# Cleanup if exists
		existing_sif = frappe.db.get_value("SIF Scheme", {"sebi_code": test_code}, "name")
		if existing_sif:
			frappe.delete_doc("SIF Scheme", existing_sif, ignore_permissions=True, force=True)

		# Ensure AMC and Subcategory exist
		if not frappe.db.exists("SIF Investment Strategy Subcategory", "Equity Long-Short Fund"):
			frappe.get_doc(
				{
					"doctype": "SIF Investment Strategy Subcategory",
					"subcategory_name": "Equity Long-Short Fund",
				}
			).insert(ignore_permissions=True)

		amc_name = frappe.db.get_value("SIF Asset Management Company", {}, "name")
		if not amc_name:
			amc_doc = frappe.get_doc(
				{
					"doctype": "SIF Asset Management Company",
					"code": "TEST",
					"amc_name": "Test AMC",
					"sif_name": "Test",
					"registration_number": "TEST",
					"rta": "CAMS",
					"is_active": 1,
				}
			).insert(ignore_permissions=True)
			amc_name = amc_doc.name

		# 1. Create initial master SIF Scheme with initial URL
		scheme_doc = frappe.get_doc(
			{
				"doctype": "SIF Scheme",
				"sebi_code": test_code,
				"scheme_name": "Mod Test Fund",
				"investment_strategy": "Equity",
				"scheme_subcategory": "Equity Long-Short Fund",
				"amc": amc_name,
				"scheme_objective": "Initial Objective",
				"isid_url": "https://portal.amfiindia.com/spages/S-10.pdf",
			}
		)
		scheme_doc.flags.from_approval = True
		scheme_doc.insert(ignore_permissions=True)

		# 2. Build incoming Scheme with updated isid_url
		updated_scheme = Scheme(
			sebi_code=test_code,
			scheme_name="Mod Test Fund",
			amc_registration_number=None,
			investment_strategy="Equity",
			scheme_type="Open Ended",
			scheme_subcategory="Equity Long-Short Fund",
			scheme_objective="Initial Objective",
			isid_url="https://portal.amfiindia.com/spages/S-10-updated.pdf",
		)

		# 3. Compare scheme
		changes = compare_scheme(scheme_doc, updated_scheme)
		isid_changes = [c for c in changes if c["field_name"] == "isid_url"]
		self.assertEqual(len(isid_changes), 1)
		self.assertEqual(isid_changes[0]["old_value"], "https://portal.amfiindia.com/spages/S-10.pdf")
		self.assertEqual(isid_changes[0]["new_value"], "https://portal.amfiindia.com/spages/S-10-updated.pdf")

		# 4. Ingest via DataImporter to create SIF Scheme Modification Request
		dataset = SyncDataset(schemes=[updated_scheme])
		importer = DataImporter(dry_run=False)
		importer.import_dataset(dataset)

		mod_name = frappe.db.get_value(
			"SIF Scheme Modification Request", {"scheme": scheme_doc.name, "docstatus": 0}, "name"
		)
		self.assertTrue(mod_name, "Modification request must be created")
		mod_doc = frappe.get_doc("SIF Scheme Modification Request", mod_name)

		# 5. Apply and approve the change
		for row in mod_doc.changed_fields:
			if row.field_name == "isid_url":
				row.apply_change = 1
		mod_doc.save(ignore_permissions=True)
		mod_doc.submit()

		# 6. Verify master SIF Scheme has new isid_url
		scheme_doc.reload()
		self.assertEqual(scheme_doc.isid_url, "https://portal.amfiindia.com/spages/S-10-updated.pdf")

		# Cleanup
		if frappe.db.exists("SIF Scheme Modification Request", mod_name):
			mod_doc.reload()
			if mod_doc.docstatus == 1:
				mod_doc.cancel()
			frappe.delete_doc(
				"SIF Scheme Modification Request", mod_name, ignore_permissions=True, force=True
			)
		if frappe.db.exists("SIF Scheme", scheme_doc.name):
			frappe.delete_doc("SIF Scheme", scheme_doc.name, ignore_permissions=True, force=True)

	def test_apex_equity_long_short_fund_regression(self):
		"""
		Regression test using the real Apex Equity Long-Short Fund JSON fixture.
		SEBI code: APEX/O/E/ELSF/26/06/0003/ABSL
		"""
		# Locate real fixture
		candidates = [
			"/Users/smritisoni/Desktop/My_SIF/AMFI_Fetcher/data/sif/scheme/details/apex_o_e_elsf_26_06_0003_absl.json",
			os.path.join(
				os.getcwd(), "AMFI_Fetcher/data/sif/scheme/details/apex_o_e_elsf_26_06_0003_absl.json"
			),
		]
		fixture_path = None
		for c in candidates:
			if os.path.exists(c):
				fixture_path = c
				break

		self.assertTrue(
			fixture_path and os.path.exists(fixture_path), f"Apex fixture file not found in {candidates}"
		)

		with open(fixture_path) as f:
			raw_apex = json.load(f)

		mapper = DataMapper(isin_sif_map={})
		dataset = mapper.map_dataset({"scheme_details": [raw_apex]})

		self.assertEqual(len(dataset.schemes), 1)
		apex_scheme = dataset.schemes[0]

		self.assertEqual(apex_scheme.sebi_code, "APEX/O/E/ELSF/26/06/0003/ABSL")
		self.assertEqual(apex_scheme.scheme_name, "Apex Equity Long-Short Fund")
		self.assertEqual(apex_scheme.isid_url, "https://portal.amfiindia.com/spages/S-31.pdf")
		self.assertIsNone(apex_scheme.kim_url)
		self.assertIsNone(apex_scheme.sai_url)
		self.assertIsNone(apex_scheme.factsheet_url)
		self.assertIsNone(apex_scheme.monthly_portfolio_disclosure_url)
