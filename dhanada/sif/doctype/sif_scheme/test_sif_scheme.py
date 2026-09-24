# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import json
import os

import frappe
from frappe.tests import IntegrationTestCase

from dhanada.sif.sync.comparator import compare_scheme
from dhanada.sif.sync.constants import SEBI_AMC_CODE_MAP, resolve_amc
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
		Regression test using the real Apex Equity Long-Short Fund JSON data structure.
		SEBI code: APEX/O/E/ELSF/26/06/0003/ABSL
		Verifies canonical AMC resolution (ABSL -> Aditya Birla Sun Life AMC -> Apex SIF)
		and document URL mapping without external repository dependencies.
		"""
		raw_apex = {
			"sebi_code": "APEX/O/E/ELSF/26/06/0003/ABSL",
			"scheme_name": "Apex Equity Long-Short Fund",
			"fund_name": "Apex Equity Long-Short Fund",
			"sif_name": "Apex SIF",
			"scheme_type": "An open ended equity investment strategy investing in listed equity and equity related instruments including limited short exposure in equity through derivative instruments.",
			"fund_type": "An open ended equity investment strategy investing in listed equity and equity related instruments including limited short exposure in equity through derivative instruments.",
			"category": "Equity Long Short Fund",
			"riskometer_at_launch": "Risk Level 5",
			"riskometer_as_on_date": "Risk Level 1",
			"scheme_objective": "The Investment strategy seeks to generate long-term capital appreciation...",
			"face_value": "10",
			"nfo_open_date": "2026-08-10",
			"nfo_close_date": "2026-08-24",
			"allotment_date": "2026-08-31",
			"reopen_date": "2026-09-01",
			"benchmark_tier_1": "NIFTY 500 TRI",
			"asset_allocation": [
				{"allocation_type": "", "minimum_percentage": 80, "maximum_percentage": 100},
				{"allocation_type": "", "minimum_percentage": 0, "maximum_percentage": 20},
				{
					"allocation_type": "Units issued by InvITs",
					"minimum_percentage": 0,
					"maximum_percentage": 20,
				},
			],
			"plans": {
				"regular": {
					"growth": [
						{
							"plan_type": "regular",
							"option": "growth",
							"name": "Apex Equity Long-short Fund-Regular Growth- SIF- 154",
							"amfi_code": "SIF-154",
							"isin_code": "INF209K30107",
						}
					],
					"idcw": {
						"payout": [],
						"reinvestment": [],
						"transfer": [],
						"time_period": [],
						"unknown": [],
					},
					"unresolved": [],
				},
				"direct": {
					"growth": [
						{
							"plan_type": "direct",
							"option": "growth",
							"name": "Apex Equity Long-short Fund-Direct Growth-SIF- 153",
							"amfi_code": "SIF-153",
							"isin_code": "INF209K30099",
						}
					],
					"idcw": {
						"payout": [],
						"reinvestment": [],
						"transfer": [],
						"time_period": [],
						"unknown": [],
					},
					"unresolved": [],
				},
			},
			"fund_managers": [
				{"name": "Mr. Manish Gupta", "type": "Primary", "from": "2026-08-31", "to": None},
				{"name": "Mr. Harshil Suvarnkar", "type": "Comanage", "from": "2026-08-31", "to": None},
			],
			"investment_limits": {
				"minimum_application_amount": "For normal investors - Rs. 10 lakh",
				"application_multiple": "Re.1",
				"minimum_additional_amount": "Rs. 10,000",
				"minimum_redemption_amount": "Rs. 10,000",
			},
			"amc_details": {
				"sif_name": "Apex SIF",
				"amc_website": "https://mutualfund.adityabirlacapital.com/",
			},
			"documents": {
				"scheme_id": "S-31",
				"info_pdf_url": "https://portal.amfiindia.com/spages/S-31.pdf",
				"summary_pdf_url": "https://portal.amfiindia.com/spages/SSD_S-31.pdf",
				"summary_xls_url": "https://portal.amfiindia.com/spages/SSD_S-31.xls",
				"summary_xml_url": "https://portal.amfiindia.com/spages/SSD_S-31.xml",
			},
		}

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

		# Canonical AMC resolution verification from real fixture
		self.assertEqual(len(dataset.amcs), 1)
		self.assertEqual(dataset.amcs[0].code, "ABSL")
		self.assertEqual(dataset.amcs[0].amc_name, "Aditya Birla Sun Life AMC")
		self.assertEqual(dataset.amcs[0].sif_name, "Apex SIF")

	def test_canonical_amc_code_resolution(self):
		"""
		Tests resolution of SEBI AMC codes to canonical corporate names.
		"""
		# Direct SEBI code tests
		test_cases = [
			("APEX/O/E/ELSF/26/06/0003/ABSL", "Apex SIF", None, "ABSL", "Aditya Birla Sun Life AMC"),
			("ALTI/O/E/ELSF/26/05/0001/EDEL", "Altiva SIF", None, "EDEL", "Edelweiss Asset Management"),
			("TEST/O/E/ELSF/26/01/0001/ICIC", "ICICI SIF", None, "ICIC", "ICICI Prudential Asset Management"),
			("TEST/O/E/ELSF/26/01/0001/TATA", "Tata SIF", None, "TATA", "Tata Asset Management"),
			("TEST/O/E/ELSF/26/01/0001/SBIM", "SBI SIF", None, "SBIM", "SBI Funds Management"),
			(
				"TEST/O/E/ELSF/26/01/0001/JBMF",
				"Jio BlackRock SIF",
				None,
				"JBMF",
				"Jio BlackRock Asset Management",
			),
			("TEST/O/E/ELSF/26/01/0001/360O", "360 ONE SIF", None, "360O", "360 ONE Asset Management"),
			(
				"TEST/O/E/ELSF/26/01/0001/FTMF",
				"Franklin SIF",
				None,
				"FTMF",
				"Franklin Templeton Asset Management",
			),
			("TEST/O/E/ELSF/26/01/0001/KOTM", "Kotak SIF", None, "KOTM", "Kotak Mahindra Asset Management"),
			("TEST/O/E/ELSF/26/01/0001/BNDN", "Bandhan SIF", None, "BNDN", "Bandhan AMC"),
			("TEST/O/E/ELSF/26/01/0001/QNTM", "Quant SIF", None, "QNTM", "Quant Mutual Fund"),
			("TEST/O/E/ELSF/26/01/0001/UNIN", "Union SIF", None, "UNIN", "Union Asset Management"),
			("TEST/O/E/ELSF/26/01/0001/HSBC", "HSBC SIF", None, "HSBC", "HSBC Asset Management"),
			("TEST/O/E/ELSF/26/01/0001/TWCF", "Wealth SIF", None, "TWCF", "The Wealth Company Mutual Fund"),
		]

		for sebi_code, brand, web, expected_code, expected_name in test_cases:
			code, name = resolve_amc(sebi_code=sebi_code, sif_name=brand, website=web)
			self.assertEqual(code, expected_code, f"Failed resolving code for {sebi_code}")
			self.assertEqual(name, expected_name, f"Failed resolving name for {sebi_code}")

		# Fallback by brand name when sebi_code is None or has no suffix
		code_brand, name_brand = resolve_amc(sebi_code=None, sif_name="Apex SIF")
		self.assertEqual(code_brand, "ABSL")
		self.assertEqual(name_brand, "Aditya Birla Sun Life AMC")

		# Fallback by website
		code_web, name_web = resolve_amc(sebi_code=None, sif_name=None, website="https://www.edelweissmf.com")
		self.assertEqual(code_web, "EDEL")
		self.assertEqual(name_web, "Edelweiss Asset Management")

	def test_apex_amc_mapping_not_fabricated(self):
		"""
		Verifies that mapping Apex scheme details assigns Aditya Birla Sun Life AMC
		and does NOT synthesize 'Apex Asset Management'.
		"""
		payload = {
			"sebi_code": "APEX/O/E/ELSF/26/06/0003/ABSL",
			"fund_name": "Apex Equity Long-Short Fund",
			"scheme_name": "Apex Equity Long-Short Fund",
			"category": "Equity Long-Short Fund",
			"fund_type": "An open ended equity investment strategy investing in listed equity",
			"sif_name": "Apex SIF",
			"amc_details": {
				"sif_name": "Apex SIF",
				"amc_website": "https://mutualfund.adityabirlacapital.com",
			},
			"plans": {
				"regular": {
					"growth": [
						{"name": "Apex Regular Growth", "isin_code": "INF999K01011", "amfi_code": "SIF-991"}
					]
				}
			},
		}

		mapper = DataMapper(isin_sif_map={})
		dataset = mapper.map_dataset({"scheme_details": [payload]})

		# Check AMC record
		self.assertEqual(len(dataset.amcs), 1)
		amc = dataset.amcs[0]
		self.assertEqual(amc.code, "ABSL")
		self.assertEqual(amc.amc_name, "Aditya Birla Sun Life AMC")
		self.assertEqual(amc.sif_name, "Apex SIF")
		self.assertNotEqual(amc.amc_name, "Apex Asset Management")
		self.assertFalse(amc.amc_name.startswith("Apex Asset"))

		# Check Scheme record
		scheme = dataset.schemes[0]
		self.assertEqual(scheme.amc_registration_number, "ABSL")
		self.assertEqual(scheme.sif_name, "Apex SIF")

	def test_new_scheme_request_creates_canonical_amc(self):
		"""
		Verifies SIF New Scheme Request creates and links SIF Asset Management Company
		with canonical corporate name (Aditya Birla Sun Life AMC) upon approval.
		"""
		test_code = "TEST/O/E/ELSF/26/AMC/0001/ABSL"

		# Ensure clean state
		for dt, key in [
			("SIF Scheme", {"sebi_code": test_code}),
			("SIF New Scheme Request", {"sebi_code": test_code}),
		]:
			existing = frappe.db.get_value(dt, key, "name")
			if existing:
				frappe.delete_doc(dt, existing, ignore_permissions=True, force=True)

		payload = self._sample_scheme_payload(sebi_code=test_code)
		payload["sif_name"] = "Apex SIF"

		mapper = DataMapper(isin_sif_map={})
		dataset = mapper.map_dataset({"scheme_details": [payload]})

		importer = DataImporter(dry_run=False)
		importer.import_dataset(dataset)

		req_name = frappe.db.get_value("SIF New Scheme Request", {"sebi_code": test_code}, "name")
		self.assertTrue(req_name)
		req_doc = frappe.get_doc("SIF New Scheme Request", req_name)

		# Submit / Approve request
		req_doc.submit()
		self.assertEqual(req_doc.workflow_state, "Approved")
		created_scheme = frappe.get_doc("SIF Scheme", req_doc.scheme)

		# Verify linked AMC doc
		self.assertEqual(created_scheme.amc, "ABSL")
		amc_doc = frappe.get_doc("SIF Asset Management Company", "ABSL")
		self.assertEqual(amc_doc.amc_name, "Aditya Birla Sun Life AMC")
		self.assertNotEqual(amc_doc.amc_name, "Apex Asset Management")

		# Teardown
		req_doc.reload()
		if req_doc.docstatus == 1:
			req_doc.cancel()
		frappe.delete_doc("SIF New Scheme Request", req_name, ignore_permissions=True, force=True)
		frappe.delete_doc("SIF Scheme", created_scheme.name, ignore_permissions=True, force=True)

	def test_unknown_amc_code_fallback_safe(self):
		"""
		Verifies an unmapped/unknown AMC code does not fabricate a fake 'Asset Management' suffix.
		"""
		code, name = resolve_amc(sebi_code="TEST/O/E/ELSF/26/01/0001/UNKN", sif_name="Unknown Brand")
		self.assertEqual(code, "UNKN")
		self.assertIsNone(name)

	def test_amc_record_reuse_and_deduplication(self):
		"""
		Verifies that multiple schemes under the same AMC (e.g. ABSL) deduplicate cleanly into one AMC object in SyncDataset.
		"""
		p1 = self._sample_scheme_payload(sebi_code="APEX/O/E/ELSF/26/06/0001/ABSL")
		p1["sif_name"] = "Apex SIF"
		p2 = self._sample_scheme_payload(sebi_code="APEX/O/E/EELS/26/06/0002/ABSL")
		p2["sif_name"] = "Apex SIF"

		mapper = DataMapper(isin_sif_map={})
		dataset = mapper.map_dataset({"scheme_details": [p1, p2]})

		self.assertEqual(len(dataset.schemes), 2)
		self.assertEqual(len(dataset.amcs), 1)
		self.assertEqual(dataset.amcs[0].code, "ABSL")
		self.assertEqual(dataset.amcs[0].amc_name, "Aditya Birla Sun Life AMC")

	def test_existing_stale_amc_correction_via_approval(self):
		"""
		Tests that apply_amc_master_corrections reconciles all stale or fabricated AMC names
		(e.g., ABSL, EDEL, ICIC, TATA, SBIM, JBMF, 360O, FTMF, KOTM, BNDN, QNTM, UNIN, HSBC, TWCF)
		to their canonical corporate names and SIF brand names.
		"""
		from dhanada.sif.sync.approval import apply_amc_master_corrections, get_pending_amc_corrections

		# Setup a known stale record
		if not frappe.db.exists("SIF Asset Management Company", "ABSL"):
			frappe.get_doc(
				{
					"doctype": "SIF Asset Management Company",
					"code": "ABSL",
					"amc_name": "Apex Asset Management",
					"sif_name": "Apex",
					"registration_number": "ABSL",
					"rta": "CAMS",
					"is_active": 1,
				}
			).insert(ignore_permissions=True)
		else:
			frappe.db.set_value("SIF Asset Management Company", "ABSL", "amc_name", "Apex Asset Management")
			frappe.db.set_value("SIF Asset Management Company", "ABSL", "sif_name", "Apex")

		# Dry run check
		dry_res = apply_amc_master_corrections(dry_run=True)
		self.assertTrue(dry_res["dry_run"])
		self.assertGreaterEqual(dry_res["pending_count"], 1)

		# Execute approved correction
		exec_res = apply_amc_master_corrections(dry_run=False)
		self.assertFalse(exec_res["dry_run"])
		self.assertGreaterEqual(exec_res["updated_count"], 1)

		# Verify ABSL record in DB
		absl_doc = frappe.get_doc("SIF Asset Management Company", "ABSL")
		self.assertEqual(absl_doc.amc_name, "Aditya Birla Sun Life AMC")
		self.assertEqual(absl_doc.sif_name, "Apex SIF")
		self.assertFalse(
			absl_doc.amc_name.endswith("Asset Management") and absl_doc.amc_name.startswith("Apex")
		)

		# Verify no remaining pending corrections for valid mapped codes
		pending = get_pending_amc_corrections()
		self.assertEqual(len(pending), 0)

	def test_scheme_with_correct_amc_link_no_false_modification(self):
		"""
		Verifies that an existing scheme with amc link already pointing to the correct AMC code
		(e.g., 'ABSL') does NOT generate a false modification request for 'amc'.
		"""
		test_code = "TEST/O/E/ELSF/26/NOCHG/0001/ABSL"
		existing_sif = frappe.db.get_value("SIF Scheme", {"sebi_code": test_code}, "name")
		if existing_sif:
			frappe.delete_doc("SIF Scheme", existing_sif, ignore_permissions=True, force=True)

		# Ensure ABSL AMC exists
		if not frappe.db.exists("SIF Asset Management Company", "ABSL"):
			frappe.get_doc(
				{
					"doctype": "SIF Asset Management Company",
					"code": "ABSL",
					"amc_name": "Aditya Birla Sun Life AMC",
					"sif_name": "Apex SIF",
					"registration_number": "ABSL",
					"rta": "CAMS",
					"is_active": 1,
				}
			).insert(ignore_permissions=True)

		scheme_doc = frappe.get_doc(
			{
				"doctype": "SIF Scheme",
				"sebi_code": test_code,
				"scheme_name": "Apex Long-Short Fund",
				"investment_strategy": "Equity",
				"scheme_subcategory": "Equity Long-Short Fund",
				"amc": "ABSL",
				"scheme_objective": "Test",
			}
		)
		scheme_doc.flags.from_approval = True
		scheme_doc.insert(ignore_permissions=True)

		incoming = Scheme(
			sebi_code=test_code,
			scheme_name="Apex Long-Short Fund",
			amc_registration_number="ABSL",
			sif_name="Apex SIF",
			investment_strategy="Equity",
			scheme_type="Open Ended",
			scheme_subcategory="Equity Long-Short Fund",
			scheme_objective="Test",
		)

		changes = compare_scheme(scheme_doc, incoming)
		amc_changes = [c for c in changes if c["field_name"] == "amc"]
		self.assertEqual(len(amc_changes), 0, "Correctly linked AMC must produce 0 AMC changes")

		# Teardown
		frappe.delete_doc("SIF Scheme", scheme_doc.name, ignore_permissions=True, force=True)

	def test_scheme_with_incorrect_amc_link_creates_modification_request(self):
		"""
		Verifies that an existing scheme with an outdated or incorrect AMC link generates
		a SIF Scheme Modification Request with field_name 'amc', which updates upon approval.
		"""
		test_code = "TEST/O/E/ELSF/26/MODAMC/0001/ABSL"
		existing_sif = frappe.db.get_value("SIF Scheme", {"sebi_code": test_code}, "name")
		if existing_sif:
			frappe.delete_doc("SIF Scheme", existing_sif, ignore_permissions=True, force=True)

		# Ensure old and new AMCs exist
		for code, name, brand in [
			("OLDAMC", "Old Asset Management", "Old SIF"),
			("ABSL", "Aditya Birla Sun Life AMC", "Apex SIF"),
		]:
			if not frappe.db.exists("SIF Asset Management Company", code):
				frappe.get_doc(
					{
						"doctype": "SIF Asset Management Company",
						"code": code,
						"amc_name": name,
						"sif_name": brand,
						"registration_number": code,
						"rta": "CAMS",
						"is_active": 1,
					}
				).insert(ignore_permissions=True)

		scheme_doc = frappe.get_doc(
			{
				"doctype": "SIF Scheme",
				"sebi_code": test_code,
				"scheme_name": "Apex Long-Short Fund",
				"investment_strategy": "Equity",
				"scheme_subcategory": "Equity Long-Short Fund",
				"amc": "OLDAMC",
				"scheme_objective": "Test",
			}
		)
		scheme_doc.flags.from_approval = True
		scheme_doc.insert(ignore_permissions=True)

		# Build incoming with resolved canonical AMC ABSL
		incoming = Scheme(
			sebi_code=test_code,
			scheme_name="Apex Long-Short Fund",
			amc_registration_number="ABSL",
			sif_name="Apex SIF",
			investment_strategy="Equity",
			scheme_type="Open Ended",
			scheme_subcategory="Equity Long-Short Fund",
			scheme_objective="Test",
		)

		changes = compare_scheme(scheme_doc, incoming)
		amc_changes = [c for c in changes if c["field_name"] == "amc"]
		self.assertEqual(len(amc_changes), 1)
		self.assertEqual(amc_changes[0]["old_value"], "OLDAMC")
		self.assertEqual(amc_changes[0]["new_value"], "ABSL")

		# Ingest via DataImporter to create SIF Scheme Modification Request
		dataset = SyncDataset(schemes=[incoming])
		importer = DataImporter(dry_run=False)
		importer.import_dataset(dataset)

		mod_name = frappe.db.get_value(
			"SIF Scheme Modification Request", {"scheme": scheme_doc.name, "docstatus": 0}, "name"
		)
		self.assertTrue(mod_name, "Modification request must be created for AMC change")
		mod_doc = frappe.get_doc("SIF Scheme Modification Request", mod_name)

		# Approve and apply the change
		for row in mod_doc.changed_fields:
			if row.field_name == "amc":
				row.apply_change = 1
		mod_doc.save(ignore_permissions=True)
		mod_doc.submit()

		# Verify master SIF Scheme has updated amc link
		scheme_doc.reload()
		self.assertEqual(scheme_doc.amc, "ABSL")

		# Teardown
		if frappe.db.exists("SIF Scheme Modification Request", mod_name):
			mod_doc.reload()
			if mod_doc.docstatus == 1:
				mod_doc.cancel()
			frappe.delete_doc(
				"SIF Scheme Modification Request", mod_name, ignore_permissions=True, force=True
			)
		frappe.delete_doc("SIF Scheme", scheme_doc.name, ignore_permissions=True, force=True)
		if frappe.db.exists("SIF Asset Management Company", "OLDAMC"):
			frappe.delete_doc("SIF Asset Management Company", "OLDAMC", ignore_permissions=True, force=True)

	def test_existing_stale_amc_metadata_creates_modification_request(self):
		"""
		Tests Scenario A:
		Existing scheme with amc='ABSL', but linked SIF Asset Management Company has stale
		amc_name='Apex Asset Management' and sif_name='Apex'.
		Running compare_scheme / DataImporter MUST generate a SIF Scheme Modification Request
		with amc_name and sif_name changes (and no amc link change).
		Approving the request updates SIF Asset Management Company to canonical values
		and preserves SIF Scheme.amc='ABSL'.
		"""
		test_code = "TEST/O/E/ELSF/26/STALEAMC/0001/ABSL"
		existing_sif = frappe.db.get_value("SIF Scheme", {"sebi_code": test_code}, "name")
		if existing_sif:
			frappe.delete_doc("SIF Scheme", existing_sif, ignore_permissions=True, force=True)

		# Ensure ABSL AMC has stale metadata
		if not frappe.db.exists("SIF Asset Management Company", "ABSL"):
			frappe.get_doc(
				{
					"doctype": "SIF Asset Management Company",
					"code": "ABSL",
					"amc_name": "Apex Asset Management",
					"sif_name": "Apex",
					"registration_number": "ABSL",
					"rta": "CAMS",
					"is_active": 1,
				}
			).insert(ignore_permissions=True)
		else:
			frappe.db.set_value("SIF Asset Management Company", "ABSL", "amc_name", "Apex Asset Management")
			frappe.db.set_value("SIF Asset Management Company", "ABSL", "sif_name", "Apex")

		scheme_doc = frappe.get_doc(
			{
				"doctype": "SIF Scheme",
				"sebi_code": test_code,
				"scheme_name": "Apex Equity Long-Short Fund",
				"investment_strategy": "Equity",
				"scheme_subcategory": "Equity Long-Short Fund",
				"amc": "ABSL",
				"scheme_objective": "Test",
			}
		)
		scheme_doc.flags.from_approval = True
		scheme_doc.insert(ignore_permissions=True)

		incoming = Scheme(
			sebi_code=test_code,
			scheme_name="Apex Equity Long-Short Fund",
			amc_registration_number="ABSL",
			sif_name="Apex SIF",
			investment_strategy="Equity",
			scheme_type="Open Ended",
			scheme_subcategory="Equity Long-Short Fund",
			scheme_objective="Test",
		)

		changes = compare_scheme(scheme_doc, incoming)
		field_names = [c["field_name"] for c in changes]

		self.assertIn("amc_name", field_names, "amc_name must be in detected changes")
		self.assertIn("sif_name", field_names, "sif_name must be in detected changes")
		self.assertNotIn("amc", field_names, "amc link must NOT change since it is already ABSL")

		amc_name_change = next(c for c in changes if c["field_name"] == "amc_name")
		self.assertEqual(amc_name_change["old_value"], "Apex Asset Management")
		self.assertEqual(amc_name_change["new_value"], "Aditya Birla Sun Life AMC")

		sif_name_change = next(c for c in changes if c["field_name"] == "sif_name")
		self.assertEqual(sif_name_change["old_value"], "Apex")
		self.assertEqual(sif_name_change["new_value"], "Apex SIF")

		# Ingest via DataImporter to create SIF Scheme Modification Request
		dataset = SyncDataset(schemes=[incoming])
		importer = DataImporter(dry_run=False)
		importer.import_dataset(dataset)

		mod_name = frappe.db.get_value(
			"SIF Scheme Modification Request", {"scheme": scheme_doc.name, "docstatus": 0}, "name"
		)
		self.assertTrue(mod_name, "Modification request must be created for AMC metadata change")
		mod_doc = frappe.get_doc("SIF Scheme Modification Request", mod_name)

		# Approve and apply the changes
		for row in mod_doc.changed_fields:
			if row.field_name in ["amc_name", "sif_name"]:
				row.apply_change = 1
		mod_doc.save(ignore_permissions=True)
		mod_doc.submit()

		# Verify SIF Asset Management Company master is updated
		absl_doc = frappe.get_doc("SIF Asset Management Company", "ABSL")
		self.assertEqual(absl_doc.amc_name, "Aditya Birla Sun Life AMC")
		self.assertEqual(absl_doc.sif_name, "Apex SIF")

		# Verify SIF Scheme still references ABSL
		scheme_doc.reload()
		self.assertEqual(scheme_doc.amc, "ABSL")

		# Second compare should now yield 0 AMC changes
		changes_after = compare_scheme(scheme_doc, incoming)
		self.assertEqual(
			len([c for c in changes_after if c["field_name"] in ["amc", "amc_name", "sif_name"]]), 0
		)

		# Teardown
		if frappe.db.exists("SIF Scheme Modification Request", mod_name):
			mod_doc.reload()
			if mod_doc.docstatus == 1:
				mod_doc.cancel()
			frappe.delete_doc(
				"SIF Scheme Modification Request", mod_name, ignore_permissions=True, force=True
			)
		frappe.delete_doc("SIF Scheme", scheme_doc.name, ignore_permissions=True, force=True)

	def test_amc_correction_rollback_on_failure(self):
		"""
		Tests that without manual commit, an unhandled exception during AMC correction
		allows the transaction to roll back cleanly without leaving partial state.
		"""
		from unittest.mock import patch

		from dhanada.sif.sync.approval import apply_amc_master_corrections

		if not frappe.db.exists("SIF Asset Management Company", "UNIN"):
			frappe.get_doc(
				{
					"doctype": "SIF Asset Management Company",
					"code": "UNIN",
					"amc_name": "Old Union Entity",
					"sif_name": "Union",
					"registration_number": "UNIN",
					"rta": "CAMS",
					"is_active": 1,
				}
			).insert(ignore_permissions=True)
		else:
			frappe.db.set_value("SIF Asset Management Company", "UNIN", "amc_name", "Old Union Entity")
			frappe.db.set_value("SIF Asset Management Company", "UNIN", "sif_name", "Union")

		frappe.db.savepoint("before_amc_rollback_test")

		real_save = frappe.model.document.Document.save

		def failing_save(doc_self, *args, **kwargs):
			real_save(doc_self, *args, **kwargs)
			raise RuntimeError("Simulated mid-transaction failure")

		with patch("frappe.model.document.Document.save", new=failing_save):
			with self.assertRaises(RuntimeError):
				apply_amc_master_corrections(dry_run=False)

		# Roll back to the savepoint before the batch correction
		frappe.db.rollback(save_point="before_amc_rollback_test")

		current_name = frappe.db.get_value("SIF Asset Management Company", "UNIN", "amc_name")
		self.assertEqual(current_name, "Old Union Entity")
