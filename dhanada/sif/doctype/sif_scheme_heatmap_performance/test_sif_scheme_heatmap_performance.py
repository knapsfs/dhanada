# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

from unittest.mock import patch

import frappe
from frappe.tests import IntegrationTestCase

from dhanada.api import get_scheme_heatmap_performance
from dhanada.sif.sync.models import SchemeHeatmapPerformance, SyncDataset
from dhanada.sif.sync.scheduler import (
	DATA_SCHEDULER_USER,
	sync_nav_performance,
)


class TestSIFSchemeHeatmapPerformance(IntegrationTestCase):
	"""
	Integration tests for SIF Scheme Heatmap Performance DocType,
	DataImporter upsert logic, scheduler integration, and read-only API.
	"""

	@classmethod
	def setUpClass(cls):
		super().setUpClass()
		from dhanada.setup.bootstrap import before_tests

		before_tests()

	def setUp(self):
		super().setUp()
		frappe.set_user("Administrator")

		# Ensure test AMC exists
		if not frappe.db.exists("SIF Asset Management Company", "TEST_AMC_HM"):
			amc = frappe.new_doc("SIF Asset Management Company")
			amc.code = "TEST_AMC_HM"
			amc.amc_name = "Test AMC Heatmap"
			amc.sif_name = "Test SIF HM"
			amc.registration_number = "TEST_AMC_HM"
			amc.rta = "CAMS"
			amc.insert(ignore_permissions=True)

		# Ensure test Scheme exists
		scheme_name = frappe.db.get_value("SIF Scheme", {"sebi_code": "TEST_SCHEME_HM"}, "name")
		if not scheme_name:
			scheme = frappe.new_doc("SIF Scheme")
			scheme.sebi_code = "TEST_SCHEME_HM"
			scheme.scheme_name = "Test Heatmap Scheme"
			scheme.investment_strategy = "Equity"
			scheme.scheme_subcategory = "Equity Long-Short Fund"
			scheme.scheme_objective = "Test Heatmap Scheme Objective"
			scheme.minimum_subscription = 1000000.00
			scheme.amc = "TEST_AMC_HM"
			scheme.flags.from_approval = True
			scheme.insert(ignore_permissions=True)
			scheme_name = scheme.name

		# Create Regular Plan
		if not frappe.db.exists("SIF Scheme Plan", "TEST_ISIN_REG_HM"):
			plan = frappe.new_doc("SIF Scheme Plan")
			plan.isin = "TEST_ISIN_REG_HM"
			plan.scheme = scheme_name
			plan.type = "Regular"
			plan.option = "Growth"
			plan.sif_code = "SIF-901"
			plan.insert(ignore_permissions=True)

		frappe.db.commit()  # nosemgrep: frappe-manual-commit

	def tearDown(self):
		frappe.set_user("Administrator")
		# Clean up any created heatmap test records
		test_heatmaps = frappe.get_all(
			"SIF Scheme Heatmap Performance",
			filters={"scheme_plan": "TEST_ISIN_REG_HM"},
			pluck="name",
		)
		for hm_name in test_heatmaps:
			frappe.delete_doc("SIF Scheme Heatmap Performance", hm_name, ignore_permissions=True, force=True)
		frappe.db.commit()  # nosemgrep: frappe-manual-commit
		super().tearDown()

	def test_doctype_creation_and_upsert_idempotency(self):
		"""
		Verifies creation and upsert of SIF Scheme Heatmap Performance records.
		Running the same scheme + year multiple times must update the existing record,
		never creating duplicates.
		"""
		from dhanada.sif.sync.importer import DataImporter

		importer = DataImporter(dry_run=False)

		# Run 1: Ingest 2026 data with positive, negative, and null months
		hm1 = SchemeHeatmapPerformance(
			sif_code="SIF-901",
			year=2026,
			jan=2.15,
			feb=-1.32,
			mar=4.08,
			apr=None,  # Missing month
			may=3.21,
			jun=1.14,
			jul=-0.52,
			aug=2.44,
			sep=None,
			oct=None,
			nov=None,
			dec=None,
		)
		dataset1 = SyncDataset(heatmaps=[hm1])
		importer.import_dataset(dataset1)

		# Check record created
		doc_name = "TEST_ISIN_REG_HM-2026"
		self.assertTrue(frappe.db.exists("SIF Scheme Heatmap Performance", doc_name))
		doc = frappe.get_doc("SIF Scheme Heatmap Performance", doc_name)
		self.assertEqual(doc.scheme_plan, "TEST_ISIN_REG_HM")
		self.assertEqual(doc.sif_code, "SIF-901")
		self.assertEqual(doc.year, 2026)
		self.assertEqual(doc.jan, 2.15)
		self.assertEqual(doc.feb, -1.32)
		self.assertEqual(doc.mar, 4.08)
		self.assertIn(doc.apr, [None, 0.0])
		self.assertEqual(doc.may, 3.21)
		self.assertEqual(doc.owner, DATA_SCHEDULER_USER)

		# Direct plan must NOT receive heatmap records
		self.assertFalse(frappe.db.exists("SIF Scheme Heatmap Performance", "TEST_ISIN_DIR_HM-2026"))

		# Run 2: Next day update with updated values (e.g. Sep added, Feb revised)
		hm2 = SchemeHeatmapPerformance(
			sif_code="SIF-901",
			year=2026,
			jan=2.15,
			feb=-1.45,
			mar=4.08,
			apr=None,
			may=3.21,
			jun=1.14,
			jul=-0.52,
			aug=2.44,
			sep=1.85,
			oct=None,
			nov=None,
			dec=None,
		)
		dataset2 = SyncDataset(heatmaps=[hm2])
		importer.import_dataset(dataset2)

		# Verify single record was updated, not duplicated
		all_matching = frappe.get_all(
			"SIF Scheme Heatmap Performance",
			filters={"scheme_plan": "TEST_ISIN_REG_HM", "year": 2026},
		)
		self.assertEqual(len(all_matching), 1)

		doc_updated = frappe.get_doc("SIF Scheme Heatmap Performance", doc_name)
		self.assertEqual(doc_updated.feb, -1.45)
		self.assertEqual(doc_updated.sep, 1.85)

	def test_multiple_years_and_unknown_sif_handling(self):
		"""
		Verifies multi-year ingestion and graceful skipping of unresolved SIF codes.
		"""
		from dhanada.sif.sync.importer import DataImporter

		importer = DataImporter(dry_run=False)

		# Ingest 2025 and 2026 for SIF-901 + an unknown SIF-9999
		hm_2025 = SchemeHeatmapPerformance(
			sif_code="SIF-901",
			year=2025,
			nov=1.20,
			dec=-0.50,
		)
		hm_2026 = SchemeHeatmapPerformance(
			sif_code="SIF-901",
			year=2026,
			jan=3.10,
		)
		hm_unknown = SchemeHeatmapPerformance(
			sif_code="SIF-9999_UNKNOWN",
			year=2026,
			jan=5.00,
		)

		dataset = SyncDataset(heatmaps=[hm_2025, hm_2026, hm_unknown])
		importer.import_dataset(dataset)

		# 2025 and 2026 must exist for TEST_ISIN_REG_HM
		self.assertTrue(frappe.db.exists("SIF Scheme Heatmap Performance", "TEST_ISIN_REG_HM-2025"))
		self.assertTrue(frappe.db.exists("SIF Scheme Heatmap Performance", "TEST_ISIN_REG_HM-2026"))

		doc_2025 = frappe.get_doc("SIF Scheme Heatmap Performance", "TEST_ISIN_REG_HM-2025")
		self.assertEqual(doc_2025.nov, 1.20)
		self.assertEqual(doc_2025.dec, -0.50)
		self.assertIn(doc_2025.jan, [None, 0.0])

		# Unknown scheme must NOT produce any record
		unknown_records = frappe.get_all(
			"SIF Scheme Heatmap Performance",
			filters={"sif_code": "SIF-9999_UNKNOWN"},
		)
		self.assertEqual(len(unknown_records), 0)

	def test_scheduler_sync_nav_performance_includes_heatmaps(self):
		"""
		Verifies sync_nav_performance orchestrates NAV, performance, and heatmaps
		as DATA_SCHEDULER_USER without modifying existing performance logic.
		"""
		frappe.set_user("Administrator")
		self.assertEqual(frappe.session.user, "Administrator")

		mock_nav = []
		mock_perf = []
		mock_heatmaps = [
			{
				"sif_code": "SIF-901",
				"year": "2026",
				"jan": "1.50",
				"feb": "-0.75",
				"mar": "",
				"apr": "",
				"may": "",
				"jun": "",
				"jul": "",
				"aug": "",
				"sep": "",
				"oct": "",
				"nov": "",
				"dec": "",
			}
		]

		with patch("dhanada.sif.sync.scheduler.GitHubClient") as mock_client:
			mock_client.return_value.fetch_latest_nav.return_value = mock_nav
			mock_client.return_value.fetch_performance.return_value = mock_perf
			mock_client.return_value.fetch_heatmap_performance.return_value = mock_heatmaps

			res = sync_nav_performance(dry_run=False)
			self.assertEqual(res["status"], "success")

		# Execution switches to DATA_SCHEDULER_USER
		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)

		# Verify heatmap record created
		doc_name = "TEST_ISIN_REG_HM-2026"
		self.assertTrue(frappe.db.exists("SIF Scheme Heatmap Performance", doc_name))
		doc = frappe.get_doc("SIF Scheme Heatmap Performance", doc_name)
		self.assertEqual(doc.jan, 1.50)
		self.assertEqual(doc.feb, -0.75)
		self.assertIn(doc.mar, [None, 0.0])

	def test_get_scheme_heatmap_performance_api(self):
		"""
		Verifies the read-only API endpoint get_scheme_heatmap_performance.
		"""
		from dhanada.sif.sync.importer import DataImporter

		importer = DataImporter(dry_run=False)
		dataset = SyncDataset(
			heatmaps=[
				SchemeHeatmapPerformance(
					sif_code="SIF-901",
					year=2026,
					jan=2.50,
					feb=-1.00,
				)
			]
		)
		importer.import_dataset(dataset)

		frappe.set_user("Guest")

		# Query by scheme_plan
		res1 = get_scheme_heatmap_performance(scheme_plan="TEST_ISIN_REG_HM")
		self.assertEqual(res1["status"], "success")
		self.assertEqual(len(res1["data"]), 1)
		self.assertEqual(res1["data"][0]["scheme_plan"], "TEST_ISIN_REG_HM")
		self.assertEqual(res1["data"][0]["jan"], 2.50)
		self.assertEqual(res1["data"][0]["feb"], -1.00)

		# Query by sif_code
		res2 = get_scheme_heatmap_performance(sif_code="SIF-901")
		self.assertEqual(res2["status"], "success")
		self.assertEqual(len(res2["data"]), 1)
		self.assertEqual(res2["data"][0]["year"], 2026)

		# Query by non-existent scheme
		res3 = get_scheme_heatmap_performance(sif_code="SIF-NONEXISTENT")
		self.assertEqual(res3["status"], "success")
		self.assertEqual(len(res3["data"]), 0)
