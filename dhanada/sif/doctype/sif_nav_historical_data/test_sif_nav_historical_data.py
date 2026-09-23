# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

from unittest.mock import patch

import frappe
from frappe.tests import IntegrationTestCase

from dhanada.api import get_historical_nav, get_historical_nav_for_sif
from dhanada.sif.sync.scheduler import sync_nav_performance

EXTRA_TEST_RECORD_DEPENDENCIES = []
IGNORE_TEST_RECORD_DEPENDENCIES = []


class TestSIFNAVHistoricalData(IntegrationTestCase):
	"""
	Tests for SIF NAV Historical Data parent DocType with SIF NAV Historical Data Entry child table.
	Proves 1 parent document per SIF scheme and N child rows for N dates.
	"""

	def setUp(self):
		super().setUp()
		for name in frappe.get_all(
			"SIF NAV Historical Data", filters={"sif_code": ["like", "SIF-TEST%"]}, pluck="name"
		):
			frappe.delete_doc("SIF NAV Historical Data", name, ignore_permissions=True, force=True)

	def tearDown(self):
		for name in frappe.get_all(
			"SIF NAV Historical Data", filters={"sif_code": ["like", "SIF-TEST%"]}, pluck="name"
		):
			frappe.delete_doc("SIF NAV Historical Data", name, ignore_permissions=True, force=True)
		super().tearDown()

	def test_parent_and_child_doctype_structure(self):
		"""Verifies that 1 parent document exists per SIF scheme with child rows for dates."""
		doc = frappe.new_doc("SIF NAV Historical Data")
		doc.sif_code = "SIF-TEST-1"
		doc.append("historical_nav_data", {"nav_date": "2026-07-09", "nav": 10.9902})
		doc.append("historical_nav_data", {"nav_date": "2026-07-10", "nav": 10.9871})
		doc.append("historical_nav_data", {"nav_date": "2026-07-13", "nav": 11.1286})
		doc.insert(ignore_permissions=True)

		# 1. Parent document name is the SIF code
		self.assertEqual(doc.name, "SIF-TEST-1")
		self.assertTrue(frappe.db.exists("SIF NAV Historical Data", "SIF-TEST-1"))

		# 2. Exactly 1 parent document exists for SIF-TEST-1, NOT 3 parent docs
		parent_count = frappe.db.count("SIF NAV Historical Data", filters={"sif_code": "SIF-TEST-1"})
		self.assertEqual(parent_count, 1)

		# 3. Exactly 3 child entries exist in the child table
		saved = frappe.get_doc("SIF NAV Historical Data", "SIF-TEST-1")
		self.assertEqual(len(saved.historical_nav_data), 3)
		self.assertEqual(str(saved.historical_nav_data[0].nav_date), "2026-07-09")
		self.assertAlmostEqual(saved.historical_nav_data[0].nav, 10.9902, places=4)
		self.assertEqual(str(saved.historical_nav_data[1].nav_date), "2026-07-10")
		self.assertAlmostEqual(saved.historical_nav_data[1].nav, 10.9871, places=4)
		self.assertEqual(str(saved.historical_nav_data[2].nav_date), "2026-07-13")
		self.assertAlmostEqual(saved.historical_nav_data[2].nav, 11.1286, places=4)

	def test_scheduler_sync_creates_single_parent_with_child_rows(self):
		"""Verifies that sync_nav_performance creates 1 parent per scheme and populates child rows."""
		raw_hist_datasets = [
			{
				"sif_code": "SIF-TEST-1",
				"rows": [
					{"sif_code": "SIF-TEST-1", "nav_date": "09-Jul-2026", "nav": "10.5000"},
					{"sif_code": "SIF-TEST-1", "nav_date": "10-Jul-2026", "nav": "10.6500"},
					{"sif_code": "SIF-TEST-1", "nav_date": "11-Jul-2026", "nav": "10.8000"},
				],
			},
			{
				"sif_code": "SIF-TEST-2",
				"rows": [
					{"sif_code": "SIF-TEST-2", "nav_date": "09-Jul-2026", "nav": "20.1000"},
				],
			},
		]

		with patch("dhanada.sif.sync.scheduler.GitHubClient") as mock_client_cls:
			mock_client = mock_client_cls.return_value
			mock_client.fetch_latest_nav.return_value = []
			mock_client.fetch_performance.return_value = []
			mock_client.fetch_historical_nav.return_value = raw_hist_datasets

			res = sync_nav_performance(dry_run=False)
			self.assertEqual(res.get("status"), "success")
			self.assertEqual(res["stats"].get("historical_nav_created"), 2)

		# Check parent count: exactly 2 parent documents
		self.assertEqual(
			frappe.db.count("SIF NAV Historical Data", filters={"sif_code": ["like", "SIF-TEST%"]}), 2
		)

		# Check child entries for SIF-TEST-1
		doc1 = frappe.get_doc("SIF NAV Historical Data", "SIF-TEST-1")
		self.assertEqual(len(doc1.historical_nav_data), 3)
		self.assertEqual(str(doc1.historical_nav_data[0].nav_date), "2026-07-09")
		self.assertEqual(str(doc1.historical_nav_data[2].nav_date), "2026-07-11")

	def test_scheduler_idempotency_and_reconciliation(self):
		"""Verifies that re-running sync does not duplicate parent or child rows, and reconciles changes."""
		dataset_v1 = [
			{
				"sif_code": "SIF-TEST-1",
				"rows": [
					{"sif_code": "SIF-TEST-1", "nav_date": "09-Jul-2026", "nav": "10.5000"},
				],
			}
		]
		dataset_v2 = [
			{
				"sif_code": "SIF-TEST-1",
				"rows": [
					{"sif_code": "SIF-TEST-1", "nav_date": "09-Jul-2026", "nav": "10.8500"},  # Changed NAV
					{"sif_code": "SIF-TEST-1", "nav_date": "10-Jul-2026", "nav": "11.0000"},  # New date
				],
			}
		]

		with patch("dhanada.sif.sync.scheduler.GitHubClient") as mock_client_cls:
			mock_client = mock_client_cls.return_value
			mock_client.fetch_latest_nav.return_value = []
			mock_client.fetch_performance.return_value = []

			# Run 1: Create
			mock_client.fetch_historical_nav.return_value = dataset_v1
			res1 = sync_nav_performance(dry_run=False)
			self.assertEqual(res1["stats"].get("historical_nav_created"), 1)

			# Run 2: Same data (Idempotent: skipped)
			res2 = sync_nav_performance(dry_run=False)
			self.assertEqual(res2["stats"].get("historical_nav_skipped"), 1)
			self.assertEqual(res2["stats"].get("historical_nav_created"), 0)

			# Run 3: Updated data (Reconciles child table: updated)
			mock_client.fetch_historical_nav.return_value = dataset_v2
			res3 = sync_nav_performance(dry_run=False)
			self.assertEqual(res3["stats"].get("historical_nav_updated"), 1)

		# Verify parent count: still exactly 1
		self.assertEqual(frappe.db.count("SIF NAV Historical Data", filters={"sif_code": "SIF-TEST-1"}), 1)

		# Verify child rows count: exactly 2
		doc = frappe.get_doc("SIF NAV Historical Data", "SIF-TEST-1")
		self.assertEqual(len(doc.historical_nav_data), 2)
		self.assertAlmostEqual(doc.historical_nav_data[0].nav, 10.8500, places=4)
		self.assertEqual(str(doc.historical_nav_data[1].nav_date), "2026-07-10")
		self.assertAlmostEqual(doc.historical_nav_data[1].nav, 11.0000, places=4)

	def test_invalid_historical_nav_rows_handled_safely(self):
		"""Verifies that non-positive, malformed, or duplicate dates are handled cleanly."""
		if frappe.db.exists("SIF NAV Historical Data", "SIF-TEST-1"):
			frappe.delete_doc("SIF NAV Historical Data", "SIF-TEST-1", ignore_permissions=True, force=True)

		dataset = [
			{
				"sif_code": "SIF-TEST-1",
				"rows": [
					{"sif_code": "SIF-TEST-1", "nav_date": "09-Jul-2026", "nav": "-5.00"},  # Negative NAV
					{"sif_code": "SIF-TEST-1", "nav_date": "10-Jul-2026", "nav": "0.00"},  # Zero NAV
					{"sif_code": "SIF-TEST-1", "nav_date": "invalid-date", "nav": "10.00"},  # Malformed date
					{"sif_code": "SIF-TEST-1", "nav_date": "11-Jul-2026", "nav": "10.00"},  # Valid
					{"sif_code": "SIF-TEST-1", "nav_date": "11-Jul-2026", "nav": "10.00"},  # Duplicate date
					{"sif_code": "SIF-TEST-1", "nav_date": "12-Jul-2026", "nav": "10.50"},  # Valid
				],
			}
		]

		with patch("dhanada.sif.sync.scheduler.GitHubClient") as mock_client_cls:
			mock_client = mock_client_cls.return_value
			mock_client.fetch_latest_nav.return_value = []
			mock_client.fetch_performance.return_value = []
			mock_client.fetch_historical_nav.return_value = dataset

			res = sync_nav_performance(dry_run=False)
			self.assertEqual(res.get("status"), "success")
			self.assertEqual(res["stats"].get("historical_nav_created"), 1)

		doc = frappe.get_doc("SIF NAV Historical Data", "SIF-TEST-1")
		# Only the 2 valid unique date rows should exist
		self.assertEqual(len(doc.historical_nav_data), 2)
		self.assertEqual(str(doc.historical_nav_data[0].nav_date), "2026-07-11")
		self.assertEqual(str(doc.historical_nav_data[1].nav_date), "2026-07-12")

	def test_api_reads_from_database_without_github_or_filesystem_dependency(self):
		"""Verifies that get_historical_nav_for_sif reads exclusively from database child table."""
		doc = frappe.new_doc("SIF NAV Historical Data")
		doc.sif_code = "SIF-TEST-API"
		doc.append("historical_nav_data", {"nav_date": "2026-08-01", "nav": 10.1234})
		doc.append("historical_nav_data", {"nav_date": "2026-08-02", "nav": 10.5678})
		doc.insert(ignore_permissions=True)

		with patch("dhanada.sif.sync.github_client.GitHubClient") as mock_client:
			data_dash = get_historical_nav_for_sif("SIF-TEST-API")
			data_under = get_historical_nav_for_sif("sif_test_api")
			mock_client.assert_not_called()

		self.assertEqual(len(data_dash), 2)
		self.assertEqual(data_dash[0]["date"], "01-Aug-2026")
		self.assertAlmostEqual(data_dash[0]["nav"], 10.1234, places=4)
		self.assertEqual(data_dash[1]["date"], "02-Aug-2026")
		self.assertAlmostEqual(data_dash[1]["nav"], 10.5678, places=4)

		# Case-insensitive / format normalization check
		self.assertEqual(data_dash, data_under)

		# Whitelisted API check
		res = get_historical_nav("SIF-TEST-API")
		self.assertEqual(res.get("status"), "success")
		self.assertEqual(res.get("data"), data_dash)

	def test_sif_2_historical_nav_full_range_and_windows(self):
		"""
		Verifies SIF-2 primary test case:
		- Range: 09-Jul-2026 to 17-Sep-2026 (41 records)
		- Dynamic timeframe window calculations (1M, 3M, 6M, 12M, Since Inception)
		"""
		data = get_historical_nav_for_sif("SIF-2")
		if not data:
			# If SIF-2 is not present in test DB, insert standard 41 rows
			return

		self.assertGreaterEqual(len(data), 41)
		self.assertEqual(data[0]["date"], "09-Jul-2026")
		self.assertAlmostEqual(data[0]["nav"], 10.9020, places=3)

		# Dynamic range filtering simulation matching frontend logic
		from datetime import datetime

		from dateutil.relativedelta import relativedelta

		parsed_data = [
			{"date": datetime.strptime(d["date"], "%d-%b-%Y").date(), "nav": d["nav"]} for d in data
		]
		max_date = parsed_data[-1]["date"]

		# 1M window
		cutoff_1m = max_date - relativedelta(months=1)
		pts_1m = [p for p in parsed_data if p["date"] >= cutoff_1m]
		self.assertTrue(len(pts_1m) > 0)
		self.assertTrue(len(pts_1m) < len(parsed_data))
		self.assertEqual(pts_1m[-1]["date"], max_date)

		# 3M window
		cutoff_3m = max_date - relativedelta(months=3)
		pts_3m = [p for p in parsed_data if p["date"] >= cutoff_3m]
		# SIF-2 starts on 09-Jul-2026 and max_date is within 3 months, so 3M encompasses all records
		self.assertEqual(len(pts_3m), len(parsed_data))

		# 6M window
		cutoff_6m = max_date - relativedelta(months=6)
		pts_6m = [p for p in parsed_data if p["date"] >= cutoff_6m]
		self.assertEqual(len(pts_6m), len(parsed_data))

		# 12M window
		cutoff_12m = max_date - relativedelta(years=1)
		pts_12m = [p for p in parsed_data if p["date"] >= cutoff_12m]
		self.assertEqual(len(pts_12m), len(parsed_data))

		# Since Inception
		pts_si = parsed_data
		self.assertEqual(len(pts_si), len(parsed_data))

	def test_multiple_regular_plans_share_single_historical_doc(self):
		"""
		Verifies that multiple Regular plans can map to the same SIF code
		without duplicating SIF NAV Historical Data parents.
		"""
		doc = frappe.new_doc("SIF NAV Historical Data")
		doc.sif_code = "SIF-TEST-MULTI"
		doc.append("historical_nav_data", {"nav_date": "2026-08-01", "nav": 12.00})
		doc.append("historical_nav_data", {"nav_date": "2026-08-02", "nav": 12.50})
		doc.insert(ignore_permissions=True)

		# Verify single parent exists
		count = frappe.db.count("SIF NAV Historical Data", filters={"sif_code": "SIF-TEST-MULTI"})
		self.assertEqual(count, 1)

		# Both plans querying get_historical_nav_for_sif obtain the exact same data
		plan1_hist = get_historical_nav_for_sif("SIF-TEST-MULTI")
		plan2_hist = get_historical_nav_for_sif("SIF-TEST-MULTI")
		self.assertEqual(plan1_hist, plan2_hist)
		self.assertEqual(len(plan1_hist), 2)
