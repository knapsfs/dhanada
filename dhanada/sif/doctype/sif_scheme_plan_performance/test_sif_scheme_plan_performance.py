import frappe
from frappe.tests import IntegrationTestCase
from dhanada.sif.sync.models import MonthlyReturnEntry, SchemePlanPerformance, SyncDataset
from dhanada.sif.sync.importer import DataImporter
from dhanada.sif.sync.mapper import DataMapper
from dhanada.api import get_funds_list, get_scheme_heatmap_performance


EXTRA_TEST_RECORD_DEPENDENCIES = []
IGNORE_TEST_RECORD_DEPENDENCIES = []


class IntegrationTestSIFSchemePlanPerformance(IntegrationTestCase):
	"""
	Integration tests for SIF Scheme Plan Performance and Monthly Returns ingestion.
	"""

	def setUp(self):
		super().setUp()
		# Clean up any test records
		if frappe.db.exists("SIF Scheme Plan Performance", "INFTEST00001"):
			frappe.delete_doc("SIF Scheme Plan Performance", "INFTEST00001", force=1)
		if frappe.db.exists("SIF Scheme Plan", "INFTEST00001"):
			frappe.delete_doc("SIF Scheme Plan", "INFTEST00001", force=1)

		existing_scheme = frappe.db.get_value("SIF Scheme", {"sebi_code": "TEST/PERF/001"}, "name")
		if not existing_scheme:
			scheme = frappe.new_doc("SIF Scheme")
			scheme.scheme_name = "Test Scheme Perf 1"
			scheme.sebi_code = "TEST/PERF/001"
			scheme.flags.from_approval = True
			scheme.flags.ignore_mandatory = True
			scheme.flags.ignore_links = True
			scheme.insert(ignore_permissions=True)
			scheme_name = scheme.name
		else:
			scheme_name = existing_scheme

		# Create a dummy test scheme plan
		if not frappe.db.exists("SIF Scheme Plan", "INFTEST00001"):
			plan = frappe.new_doc("SIF Scheme Plan")
			plan.scheme = scheme_name
			plan.isin = "INFTEST00001"
			plan.sif_code = "SIF-TEST-1"
			plan.type = "Regular"
			plan.option = "Growth"
			plan.flags.ignore_mandatory = True
			plan.flags.ignore_links = True
			plan.insert(ignore_permissions=True)

		frappe.db.commit()

	def tearDown(self):
		if frappe.db.exists("SIF Scheme Plan Performance", "INFTEST00001"):
			frappe.delete_doc("SIF Scheme Plan Performance", "INFTEST00001", force=1)
		if frappe.db.exists("SIF Scheme Plan", "INFTEST00001"):
			frappe.delete_doc("SIF Scheme Plan", "INFTEST00001", force=1)
		existing_scheme = frappe.db.get_value("SIF Scheme", {"sebi_code": "TEST/PERF/001"}, "name")
		if existing_scheme:
			frappe.delete_doc("SIF Scheme", existing_scheme, force=1)
		frappe.db.commit()
		super().tearDown()

	def test_mapper_and_importer_monthly_returns_flow(self):
		"""Verifies that monthly returns from performance JSON are mapped and imported to child table."""
		raw_perf = {
			"sif_code": "SIF-TEST-1",
			"last_updated": "2026-09-22T10:00:00Z",
			"returns": {
				"1_day": 0.5,
				"1_week": 1.2,
				"1_month": 2.5,
				"3_month": 5.0,
				"6_month": 10.0,
				"year_to_date": 12.0,
				"1_year": 15.0,
				"2_year": 25.0,
				"3_year": 40.0,
				"5_year": 75.0,
				"10_year": 150.0,
				"since_launch": 8.5,
			},
			"monthly_returns": {
				"2026-09": -0.13,
				"2026-08": -0.14,
				"2026-07": 1.02,
			},
		}

		mapper = DataMapper()
		dataset = mapper.map_dataset({"performance": [raw_perf]})
		self.assertEqual(len(dataset.performances), 1)
		perf_entry = dataset.performances[0]
		self.assertEqual(len(perf_entry.monthly_returns), 3)

		# Import dataset
		importer = DataImporter(dry_run=False)
		importer.import_dataset(dataset)

		# Verify parent record exists
		self.assertTrue(frappe.db.exists("SIF Scheme Plan Performance", "INFTEST00001"))
		perf_doc = frappe.get_doc("SIF Scheme Plan Performance", "INFTEST00001")

		# Check standard returns
		self.assertEqual(perf_doc.get("1_day"), 0.5)
		self.assertEqual(perf_doc.get("1_week"), 1.2)
		self.assertEqual(perf_doc.get("1_month"), 2.5)
		self.assertEqual(perf_doc.get("3_months"), 5.0)
		self.assertEqual(perf_doc.get("6_months"), 10.0)
		self.assertEqual(perf_doc.get("1_year"), 15.0)
		self.assertEqual(perf_doc.get("since_inception"), 8.5)

		# Check child rows
		self.assertEqual(len(perf_doc.monthly_returns), 3)
		months_map = {row.month: row.get("return") for row in perf_doc.monthly_returns}
		self.assertEqual(months_map.get("2026-09"), -0.13)
		self.assertEqual(months_map.get("2026-08"), -0.14)
		self.assertEqual(months_map.get("2026-07"), 1.02)

	def test_idempotent_resync_and_monthly_return_updates(self):
		"""Verifies that re-syncing updates existing months in-place and adds new months without duplicates."""
		importer = DataImporter(dry_run=False)

		# Initial sync: 2026-08 and 2026-07
		perf_v1 = SchemePlanPerformance(
			sif_code="SIF-TEST-1",
			performance_date=frappe.utils.getdate("2026-08-31"),
			day_1=0.2,
			monthly_returns=[
				MonthlyReturnEntry(month="2026-08", return_val=-0.14),
				MonthlyReturnEntry(month="2026-07", return_val=1.02),
			],
		)
		ds1 = SyncDataset(performances=[perf_v1])
		importer.import_dataset(ds1)

		doc1 = frappe.get_doc("SIF Scheme Plan Performance", "INFTEST00001")
		self.assertEqual(len(doc1.monthly_returns), 2)

		# Second sync (Idempotent): Same data
		importer.import_dataset(ds1)
		doc2 = frappe.get_doc("SIF Scheme Plan Performance", "INFTEST00001")
		self.assertEqual(len(doc2.monthly_returns), 2)

		# Third sync: Updated 2026-08 value (-0.20) + new month 2026-09 (-0.13)
		perf_v2 = SchemePlanPerformance(
			sif_code="SIF-TEST-1",
			performance_date=frappe.utils.getdate("2026-09-30"),
			day_1=0.3,
			monthly_returns=[
				MonthlyReturnEntry(month="2026-09", return_val=-0.13),
				MonthlyReturnEntry(month="2026-08", return_val=-0.20),
				MonthlyReturnEntry(month="2026-07", return_val=1.02),
			],
		)
		ds2 = SyncDataset(performances=[perf_v2])
		importer.import_dataset(ds2)

		doc3 = frappe.get_doc("SIF Scheme Plan Performance", "INFTEST00001")
		# Total count should now be exactly 3 (no duplicate 2026-08)
		self.assertEqual(len(doc3.monthly_returns), 3)
		months_map = {row.month: row.get("return") for row in doc3.monthly_returns}
		self.assertEqual(months_map.get("2026-09"), -0.13)
		self.assertEqual(months_map.get("2026-08"), -0.20)  # Updated value
		self.assertEqual(months_map.get("2026-07"), 1.02)

	def test_api_get_scheme_heatmap_performance_reads_from_child_table(self):
		"""Verifies that get_scheme_heatmap_performance returns aggregated monthly returns from child table."""
		importer = DataImporter(dry_run=False)
		perf = SchemePlanPerformance(
			sif_code="SIF-TEST-1",
			performance_date=frappe.utils.getdate("2026-09-30"),
			monthly_returns=[
				MonthlyReturnEntry(month="2026-09", return_val=-0.13),
				MonthlyReturnEntry(month="2026-08", return_val=-0.14),
				MonthlyReturnEntry(month="2025-12", return_val=2.50),
			],
		)
		importer.import_dataset(SyncDataset(performances=[perf]))

		# Query API by sif_code
		res = get_scheme_heatmap_performance(sif_code="SIF-TEST-1")
		self.assertEqual(res.get("status"), "success")
		data = res.get("data", [])
		self.assertTrue(len(data) >= 2)  # 2025 and 2026 rows

		year_2026 = next((r for r in data if r["year"] == 2026 and r["scheme_plan"] == "INFTEST00001"), None)
		self.assertIsNotNone(year_2026)
		self.assertEqual(year_2026["sep"], -0.13)
		self.assertEqual(year_2026["aug"], -0.14)
		self.assertIsNone(year_2026["jan"])

		year_2025 = next((r for r in data if r["year"] == 2025 and r["scheme_plan"] == "INFTEST00001"), None)
		self.assertIsNotNone(year_2025)
		self.assertEqual(year_2025["dec"], 2.50)
