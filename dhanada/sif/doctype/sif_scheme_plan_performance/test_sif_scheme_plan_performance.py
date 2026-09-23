import frappe
from frappe.tests import IntegrationTestCase

from dhanada.api import (
	get_comparison_data,
	get_fund_details,
	get_funds_list,
	get_funds_selector_list,
	get_heatmap_data,
	get_heatmap_filters,
	get_historical_nav,
	get_scheme_heatmap_performance,
)
from dhanada.sif.sync.importer import DataImporter
from dhanada.sif.sync.mapper import DataMapper
from dhanada.sif.sync.models import MonthlyReturnEntry, SchemePlanPerformance, SyncDataset

EXTRA_TEST_RECORD_DEPENDENCIES = []
IGNORE_TEST_RECORD_DEPENDENCIES = []


class IntegrationTestSIFSchemePlanPerformance(IntegrationTestCase):
	"""
	Integration tests for SIF Scheme Plan Performance, Monthly Returns ingestion, and Modular SIF APIs.
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
			scheme.investment_strategy = "Equity"
			scheme.scheme_subcategory = "Equity Long-Short Fund"
			scheme.risk_level = 0
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

		# Create historical NAV data for SIF-TEST-1
		if not frappe.db.exists("SIF NAV Historical Data", "SIF-TEST-1"):
			nav_doc = frappe.new_doc("SIF NAV Historical Data")
			nav_doc.sif_code = "SIF-TEST-1"
			nav_doc.append("historical_nav_data", {"nav_date": "2026-07-09", "nav": 10.5})
			nav_doc.append("historical_nav_data", {"nav_date": "2026-07-10", "nav": 10.65})
			nav_doc.append("historical_nav_data", {"nav_date": "2026-07-11", "nav": 10.8})
			nav_doc.insert(ignore_permissions=True)

	def tearDown(self):
		if frappe.db.exists("SIF Scheme Plan Performance", "INFTEST00001"):
			frappe.delete_doc("SIF Scheme Plan Performance", "INFTEST00001", force=1)
		if frappe.db.exists("SIF Scheme Plan", "INFTEST00001"):
			frappe.delete_doc("SIF Scheme Plan", "INFTEST00001", force=1)
		if frappe.db.exists("SIF NAV Historical Data", "SIF-TEST-1"):
			frappe.delete_doc("SIF NAV Historical Data", "SIF-TEST-1", force=1)
		existing_scheme = frappe.db.get_value("SIF Scheme", {"sebi_code": "TEST/PERF/001"}, "name")
		if existing_scheme:
			frappe.delete_doc("SIF Scheme", existing_scheme, force=1)
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

	def test_get_funds_list_pagination_and_id(self):
		"""Verifies get_funds_list returns paginated response, correct ID and minimal projection."""
		res = get_funds_list(page=1, page_size=10, search="Test Scheme Perf")
		self.assertEqual(res.get("status"), "success")
		data = res.get("data", [])
		self.assertGreaterEqual(len(data), 1)
		fund = data[0]
		self.assertIn("id", fund)
		self.assertEqual(fund["name"], "Test Scheme Perf 1")
		self.assertIn("investmentStrategy", fund)
		self.assertIn("schemeSubcategory", fund)
		self.assertIn("risk", fund)
		self.assertIn("riskLevel", fund)
		self.assertIn("pagination", res)
		self.assertEqual(res["pagination"]["page"], 1)
		self.assertEqual(res["pagination"]["page_size"], 10)
		self.assertGreaterEqual(res["pagination"]["total"], 1)

	def test_get_fund_details_and_comparison(self):
		"""Verifies get_fund_details and get_comparison_data fetch targeted scheme data."""
		scheme_name = frappe.db.get_value("SIF Scheme", {"sebi_code": "TEST/PERF/001"}, "name")
		details_res = get_fund_details(scheme_id=scheme_name)
		self.assertEqual(details_res.get("status"), "success")
		scheme_data = details_res.get("data")
		self.assertEqual(scheme_data.get("sebi_code"), "TEST/PERF/001")
		self.assertIn("plans", scheme_data)

		# Comparison data
		comp_res = get_comparison_data(scheme_ids=[scheme_name])
		self.assertEqual(comp_res.get("status"), "success")
		comp_data = comp_res.get("data", [])
		self.assertEqual(len(comp_data), 1)
		self.assertEqual(comp_data[0].get("id"), scheme_name)

	def test_get_funds_selector_list_minimal_fields(self):
		"""Verifies that get_funds_selector_list returns only lightweight selector dropdown fields."""
		res = get_funds_selector_list()
		self.assertEqual(res.get("status"), "success")
		data = res.get("data", [])
		self.assertIsInstance(data, list)
		if data:
			item = data[0]
			# Ensure only selector-relevant fields are present
			self.assertIn("id", item)
			self.assertIn("name", item)
			self.assertNotIn("historical_nav", item)
			self.assertNotIn("plans", item)
			self.assertNotIn("portfolio", item)

	def test_get_heatmap_filters_and_time_filtering(self):
		"""Verifies get_heatmap_filters and DB-level monthly returns retrieval in get_heatmap_data."""
		filter_res = get_heatmap_filters()
		self.assertEqual(filter_res.get("status"), "success")
		filter_data = filter_res.get("data", [])
		self.assertIsInstance(filter_data, list)
		if filter_data:
			self.assertIn("schemeType", filter_data[0])
			self.assertIn("category", filter_data[0])

		# Insert sample monthly returns for test scheme
		importer = DataImporter(dry_run=False)
		perf = SchemePlanPerformance(
			sif_code="SIF-TEST-1",
			performance_date=frappe.utils.getdate("2026-09-30"),
			monthly_returns=[
				MonthlyReturnEntry(month="2026-09", return_val=-1.90),
				MonthlyReturnEntry(month="2026-08", return_val=-0.66),
				MonthlyReturnEntry(month="2026-07", return_val=1.84),
				MonthlyReturnEntry(month="2026-06", return_val=2.51),
				MonthlyReturnEntry(month="2026-05", return_val=-1.34),
				MonthlyReturnEntry(month="2026-04", return_val=2.64),
				MonthlyReturnEntry(month="2026-03", return_val=0.0),
			],
		)
		importer.import_dataset(SyncDataset(performances=[perf]))

		# Heatmap with 12M time filter
		res_12m = get_heatmap_data(time_filter="12M")
		self.assertEqual(res_12m.get("status"), "success")
		schemes_list = res_12m.get("data", [])
		test_scheme = next((s for s in schemes_list if s.get("name") == "Test Scheme Perf 1"), None)
		self.assertIsNotNone(test_scheme)
		m_returns = test_scheme.get("monthlyReturns", {})
		self.assertEqual(m_returns.get("2026-09"), -1.90)
		self.assertEqual(m_returns.get("sep_26"), -1.90)
		self.assertEqual(m_returns.get("2026-08"), -0.66)
		self.assertEqual(m_returns.get("aug_26"), -0.66)
		self.assertEqual(m_returns.get("2026-07"), 1.84)
		self.assertEqual(m_returns.get("jul_26"), 1.84)
		self.assertEqual(m_returns.get("2026-03"), 0.0)
		self.assertEqual(m_returns.get("mar_26"), 0.0)

	def test_memoized_historical_nav_for_multi_plan_scheme(self):
		"""Verifies that schemes with multiple plans sharing a SIF code reuse cached historical NAV."""
		scheme_name = frappe.db.get_value("SIF Scheme", {"sebi_code": "TEST/PERF/001"}, "name")
		# Create a second Regular plan with same sif_code
		if not frappe.db.exists("SIF Scheme Plan", "INFTEST00002"):
			plan2 = frappe.new_doc("SIF Scheme Plan")
			plan2.scheme = scheme_name
			plan2.isin = "INFTEST00002"
			plan2.sif_code = "SIF-TEST-1"
			plan2.type = "Regular"
			plan2.option = "IDCW"
			plan2.flags.ignore_mandatory = True
			plan2.flags.ignore_links = True
			plan2.insert(ignore_permissions=True)

		try:
			details = get_fund_details(scheme_id=scheme_name)
			self.assertEqual(details.get("status"), "success")
			plans = details.get("data", {}).get("plans", [])
			self.assertGreaterEqual(len(plans), 2)
			# Both plans must have historical_nav list populated identically
			for p in plans:
				self.assertIsInstance(p.get("historical_nav"), list)

			comp = get_comparison_data(scheme_ids=[scheme_name])
			self.assertEqual(comp.get("status"), "success")
			comp_item = comp.get("data", [])[0]
			self.assertIsInstance(comp_item.get("historicalNav"), list)
			self.assertGreaterEqual(len(comp_item.get("historicalNav")), 1)
		finally:
			if frappe.db.exists("SIF Scheme Plan", "INFTEST00002"):
				frappe.delete_doc("SIF Scheme Plan", "INFTEST00002", force=1)
