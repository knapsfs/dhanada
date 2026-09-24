# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import json
import os
import shutil
import tempfile
from unittest.mock import MagicMock, patch

import frappe
from frappe.tests import IntegrationTestCase

from dhanada.scheduler.amfi_repository import (
	clean_github_url,
	clean_repo_subpath,
	compute_files_hash,
	ensure_amfi_repository_updated,
	get_local_amfi_repo_path,
)
from dhanada.scheduler.sync_nav_data import sync_nav_data
from dhanada.scheduler.sync_nav_performance import sync_nav_performance
from dhanada.scheduler.sync_scheme_details import sync_scheme_details


class TestAMFISchedulersArchitecture(IntegrationTestCase):
	"""
	Comprehensive test suite for the Final AMFI Scheduler Architecture:
	- Shared repository helper (ensure_amfi_repository_updated)
	- NAV scheduler (sync_nav_data)
	- NAV Performance + Monthly Heatmap scheduler (sync_nav_performance)
	- Scheme Details scheduler (sync_scheme_details)
	- Continuous DB reconciliation & change detection
	- Scheduler registration in hooks.py
	"""

	def setUp(self):
		super().setUp()
		self.test_dir = tempfile.mkdtemp(prefix="test_amfi_repo_")
		frappe.cache().delete_keys("sif_sync_*")
		frappe.cache().delete_keys("amfi_fetcher_*")

		# Clean up any leftover test records
		existing_schemes = frappe.db.get_all(
			"SIF Scheme",
			filters={
				"sebi_code": [
					"in",
					["TEST/O/E/ELSF/26/01/0001/ABSL", "TEST/O/E/ELSF/26/01/0002/ABSL", "SIF-TEST-SCHED-2"],
				]
			},
			pluck="name",
		)
		if existing_schemes:
			frappe.db.delete("SIF Scheme Modification Request", {"scheme": ["in", existing_schemes]})
			frappe.db.delete("SIF Scheme", {"name": ["in", existing_schemes]})

		frappe.db.delete(
			"SIF NAV Historical Data Entry", {"parent": ["in", ["SIF-TEST-SCHED-1", "SIF-TEST-SCHED-2"]]}
		)
		frappe.db.delete(
			"SIF NAV Historical Data", {"name": ["in", ["SIF-TEST-SCHED-1", "SIF-TEST-SCHED-2"]]}
		)
		frappe.db.delete(
			"SIF New Scheme Request",
			{
				"sebi_code": [
					"in",
					["TEST/O/E/ELSF/26/01/0001/ABSL", "TEST/O/E/ELSF/26/01/0002/ABSL", "SIF-TEST-SCHED-2"],
				]
			},
		)
		frappe.db.commit()

		# Ensure Dhanada Settings exists
		settings = frappe.get_single("Dhanada Settings")
		settings.github_amfi_fetcher_url = "https://github.com/Satyam4755/AMFI_Fetcher"
		settings.file_path_for_scheme_details = "data/sif/scheme/details"
		settings.file_path_for_nav_data = "data/sif/scheme/nav"
		settings.file_path_for_nav_performance = "data/sif/scheme/performance"
		settings.save(ignore_permissions=True)

	def tearDown(self):
		if os.path.exists(self.test_dir):
			shutil.rmtree(self.test_dir, ignore_errors=True)
		frappe.db.after_rollback.reset()
		super().tearDown()

	def _setup_mock_repo_files(self, repo_path: str):
		"""Creates mock data files in the expected repo directory structure."""
		# 1. Scheme details
		details_dir = os.path.join(repo_path, "data", "sif", "scheme", "details")
		os.makedirs(details_dir, exist_ok=True)
		sample_scheme = {
			"sebi_code": "TEST/O/E/ELSF/26/01/0001/ABSL",
			"fund_name": "Test Scheduler Apex Scheme",
			"category": "Equity Long-Short Fund",
			"fund_type": "Open Ended",
			"amc": "Aditya Birla Sun Life AMC",
			"sif_name": "Apex SIF",
			"plans": {
				"Regular": {
					"Growth": {
						"isin": "INF123TEST01",
						"sif_code": "SIF-TEST-SCHED-1",
					}
				}
			},
		}
		with open(os.path.join(details_dir, "scheme1.json"), "w", encoding="utf-8") as f:
			json.dump(sample_scheme, f)

		# 2. NAV daily
		nav_daily_dir = os.path.join(repo_path, "data", "sif", "scheme", "nav", "daily")
		os.makedirs(nav_daily_dir, exist_ok=True)
		with open(os.path.join(nav_daily_dir, "20260920.csv"), "w", encoding="utf-8") as f:
			f.write("sif_code,nav_date,nav\n")
			f.write("SIF-TEST-SCHED-1,20-Sep-2026,15.5000\n")

		# 3. NAV historical
		nav_hist_dir = os.path.join(repo_path, "data", "sif", "scheme", "nav", "historical")
		os.makedirs(nav_hist_dir, exist_ok=True)
		with open(os.path.join(nav_hist_dir, "SIF-TEST-SCHED-1.csv"), "w", encoding="utf-8") as f:
			f.write("sif_code,nav_date,nav\n")
			f.write("SIF-TEST-SCHED-1,19-Sep-2026,15.4000\n")
			f.write("SIF-TEST-SCHED-1,20-Sep-2026,15.5000\n")

		# 4. Performance
		perf_dir = os.path.join(repo_path, "data", "sif", "scheme", "performance")
		os.makedirs(perf_dir, exist_ok=True)
		sample_perf = {
			"sif_code": "SIF-TEST-SCHED-1",
			"last_updated": "2026-09-20",
			"returns": {"1_month": 1.5, "3_month": 4.2},
			"monthly_returns": {"2026-09": 1.5, "2026-08": 2.1},
		}
		with open(os.path.join(perf_dir, "perf1.json"), "w", encoding="utf-8") as f:
			json.dump(sample_perf, f)

	# =========================================================================
	# REPOSITORY TESTS (1 - 5)
	# =========================================================================

	@patch("subprocess.run")
	def test_01_repo_missing_triggers_clone(self, mock_run):
		"""1. Repository missing -> clone."""
		mock_run.return_value = MagicMock(returncode=0, stdout="Cloning into...", stderr="")
		non_existing_path = os.path.join(self.test_dir, "new_clone")

		with patch(
			"dhanada.scheduler.amfi_repository.get_local_amfi_repo_path",
			return_value=non_existing_path,
		):

			def side_effect(cmd, **kwargs):
				os.makedirs(non_existing_path, exist_ok=True)
				return MagicMock(returncode=0, stdout="Cloned", stderr="")

			mock_run.side_effect = side_effect
			res_path = ensure_amfi_repository_updated()
			self.assertEqual(res_path, non_existing_path)

			cmd = mock_run.call_args_list[0][0][0]
			self.assertEqual(cmd[0], "git")
			self.assertEqual(cmd[1], "clone")

	@patch("subprocess.run")
	def test_02_repo_exists_triggers_pull(self, mock_run):
		"""2. Repository exists -> pull/update."""
		mock_run.return_value = MagicMock(returncode=0, stdout="Already up to date.", stderr="")
		existing_path = os.path.join(self.test_dir, "existing_repo")
		os.makedirs(os.path.join(existing_path, ".git"), exist_ok=True)

		with patch(
			"dhanada.scheduler.amfi_repository.get_local_amfi_repo_path",
			return_value=existing_path,
		):
			res_path = ensure_amfi_repository_updated()
			self.assertEqual(res_path, existing_path)
			pull_called = any("pull" in call[0][0] for call in mock_run.call_args_list)
			self.assertTrue(pull_called)

	@patch("subprocess.run")
	def test_03_repository_url_from_dhanada_settings(self, mock_run):
		"""3. URL comes from Dhanada Settings."""
		settings = frappe.get_single("Dhanada Settings")
		settings.github_amfi_fetcher_url = "https://github.com/CustomOwner/Custom_Fetcher"
		settings.save(ignore_permissions=True)

		non_existing_path = os.path.join(self.test_dir, "custom_clone")
		with patch(
			"dhanada.scheduler.amfi_repository.get_local_amfi_repo_path",
			return_value=non_existing_path,
		):

			def side_effect(cmd, **kwargs):
				os.makedirs(non_existing_path, exist_ok=True)
				return MagicMock(returncode=0, stdout="Cloned", stderr="")

			mock_run.side_effect = side_effect
			ensure_amfi_repository_updated()
			cmd = mock_run.call_args_list[0][0][0]
			self.assertIn("https://github.com/CustomOwner/Custom_Fetcher", cmd)

	def test_04_repository_path_is_persistent(self):
		"""4. Repository path resolves properly across production container and local dev."""
		with patch.dict(os.environ, {"AMFI_FETCHER_LOCAL_PATH": "/custom/persistent/path"}):
			self.assertEqual(get_local_amfi_repo_path(), "/custom/persistent/path")

		with patch("os.path.exists") as mock_exists:
			mock_exists.side_effect = lambda p: p == "/.dockerenv"
			self.assertEqual(get_local_amfi_repo_path(), os.path.realpath("/home/frappe/amfi_fetcher_repo"))

		actual_path = get_local_amfi_repo_path()
		self.assertTrue(os.path.basename(actual_path) == "amfi_fetcher_repo")

	@patch("subprocess.run")
	def test_05_clone_pull_failure_stops_downstream_processing(self, mock_run):
		"""5. Clone/pull failure stops downstream processing."""
		import subprocess

		mock_run.side_effect = subprocess.CalledProcessError(
			1, ["git", "clone"], stderr="Network unreachable"
		)
		non_existing_path = os.path.join(self.test_dir, "fail_clone")

		with patch(
			"dhanada.scheduler.amfi_repository.get_local_amfi_repo_path",
			return_value=non_existing_path,
		):
			with self.assertRaises(RuntimeError):
				sync_nav_data()

			with self.assertRaises(RuntimeError):
				sync_nav_performance()

			with self.assertRaises(RuntimeError):
				sync_scheme_details()

	# =========================================================================
	# NAV SCHEDULER TESTS (6 - 10)
	# =========================================================================

	@patch("dhanada.scheduler.sync_nav_data.ensure_amfi_repository_updated")
	def test_06_nav_scheduler_calls_repository_helper_first(self, mock_ensure):
		"""6. NAV scheduler calls repository helper first."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		res = sync_nav_data(dry_run=True, force=True)
		mock_ensure.assert_called_once()
		self.assertEqual(res["status"], "success")

	@patch("dhanada.scheduler.sync_nav_data.ensure_amfi_repository_updated")
	def test_07_nav_scheduler_reads_only_file_path_for_nav_data(self, mock_ensure):
		"""7. NAV scheduler reads only file_path_for_nav_data."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		# Even if performance path is empty or invalid, NAV sync succeeds
		settings = frappe.get_single("Dhanada Settings")
		settings.file_path_for_nav_performance = "invalid/performance/path"
		settings.save(ignore_permissions=True)

		res = sync_nav_data(dry_run=True, force=True)
		self.assertEqual(res["status"], "success")
		self.assertEqual(res["type"], "nav_data")

	@patch("dhanada.scheduler.sync_nav_data.ensure_amfi_repository_updated")
	def test_08_new_daily_nav_is_processed(self, mock_ensure):
		"""8. New daily NAV is processed."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		res = sync_nav_data(dry_run=False, force=False)
		self.assertEqual(res["status"], "success")
		self.assertTrue(res["daily_processed"])

	@patch("dhanada.scheduler.sync_nav_data.ensure_amfi_repository_updated")
	def test_09_new_historical_nav_is_processed(self, mock_ensure):
		"""9. New historical NAV is processed."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		# Run once
		res1 = sync_nav_data(dry_run=False, force=False)
		self.assertEqual(res1["status"], "success")
		self.assertEqual(res1["stats"]["historical_nav_created"], 1)

		# Add a second historical CSV file
		nav_hist_dir = os.path.join(repo_path, "data", "sif", "scheme", "nav", "historical")
		with open(os.path.join(nav_hist_dir, "SIF-TEST-SCHED-2.csv"), "w", encoding="utf-8") as f:
			f.write("sif_code,nav_date,nav\n")
			f.write("SIF-TEST-SCHED-2,20-Sep-2026,10.0000\n")

		res2 = sync_nav_data(dry_run=False, force=False)
		self.assertEqual(res2["status"], "success")
		self.assertEqual(res2["stats"]["historical_nav_created"], 1)
		self.assertEqual(res2["stats"]["historical_nav_skipped"], 1)

	@patch("dhanada.scheduler.sync_nav_data.ensure_amfi_repository_updated")
	def test_10_unchanged_historical_nav_matching_db_skips_db_writes(self, mock_ensure):
		"""10. Unchanged historical NAV matching DB skips unnecessary DB writes."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		# First run creates the historical NAV doc
		res1 = sync_nav_data(dry_run=False, force=False)
		self.assertEqual(res1["status"], "success")
		self.assertEqual(res1["stats"]["historical_nav_created"], 1)

		# Second run with unchanged files and matching DB -> skips DB writes
		res2 = sync_nav_data(dry_run=False, force=False)
		self.assertEqual(res2["status"], "success")
		self.assertEqual(res2["stats"]["historical_nav_skipped"], 1)
		self.assertEqual(res2["stats"]["historical_nav_updated"], 0)
		self.assertEqual(res2["stats"]["historical_nav_created"], 0)

	@patch("dhanada.scheduler.sync_nav_data.ensure_amfi_repository_updated")
	def test_10b_manually_modified_db_is_restored_from_unchanged_repo(self, mock_ensure):
		"""10b. Unchanged repo + manually modified DB -> scheduler detects difference and restores DB."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		# First run: ingest historical NAV
		sync_nav_data(dry_run=False, force=False)

		# Manually modify DB record
		doc = frappe.get_doc("SIF NAV Historical Data", "SIF-TEST-SCHED-1")
		doc.historical_nav_data[0].nav = 999.9999
		doc.save(ignore_permissions=True)
		frappe.db.commit()

		# Next scheduler run with unchanged repo -> detects difference and restores DB
		res = sync_nav_data(dry_run=False, force=False)
		self.assertEqual(res["status"], "success")
		self.assertEqual(res["stats"]["historical_nav_updated"], 1)

		# Verify restored value
		doc.reload()
		self.assertAlmostEqual(float(doc.historical_nav_data[0].nav), 15.4000, places=4)

	# =========================================================================
	# PERFORMANCE SCHEDULER TESTS (11 - 16)
	# =========================================================================

	@patch("dhanada.scheduler.sync_nav_performance.ensure_amfi_repository_updated")
	def test_11_performance_scheduler_calls_repository_helper_first(self, mock_ensure):
		"""11. Performance scheduler calls repository helper first."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		res = sync_nav_performance(dry_run=True, force=True)
		mock_ensure.assert_called_once()
		self.assertEqual(res["status"], "success")

	@patch("dhanada.scheduler.sync_nav_performance.ensure_amfi_repository_updated")
	def test_12_performance_scheduler_reads_only_performance_path(self, mock_ensure):
		"""12. Performance scheduler reads only file_path_for_nav_performance."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		settings = frappe.get_single("Dhanada Settings")
		settings.file_path_for_nav_data = "invalid/nav/path"
		settings.save(ignore_permissions=True)

		res = sync_nav_performance(dry_run=True, force=True)
		self.assertEqual(res["status"], "success")
		self.assertEqual(res["type"], "nav_performance")

	@patch("dhanada.scheduler.sync_nav_performance.ensure_amfi_repository_updated")
	def test_13_daily_execution_processes_performance(self, mock_ensure):
		"""13. Daily execution processes performance."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		res = sync_nav_performance(dry_run=False, force=False, include_heatmap=False)
		self.assertEqual(res["status"], "success")
		self.assertEqual(res["type"], "nav_performance")

	@patch("dhanada.scheduler.sync_nav_performance.ensure_amfi_repository_updated")
	def test_14_daily_execution_does_not_process_heatmap(self, mock_ensure):
		"""14. Daily execution does NOT process heatmap."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		res = sync_nav_performance(dry_run=False, force=True, include_heatmap=False)
		self.assertEqual(res["status"], "success")
		self.assertFalse(res["heatmap_included"])

	@patch("dhanada.scheduler.sync_nav_performance.ensure_amfi_repository_updated")
	def test_15_day_one_processes_heatmap(self, mock_ensure):
		"""15. Day 1 additionally processes heatmap."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		res = sync_nav_performance(dry_run=False, force=True, include_heatmap=True)
		self.assertEqual(res["status"], "success")
		self.assertTrue(res["heatmap_included"])

	@patch("dhanada.scheduler.sync_nav_performance.ensure_amfi_repository_updated")
	def test_16_non_day_one_does_not_process_heatmap(self, mock_ensure):
		"""16. Non-day-1 execution does not process heatmap."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		with patch("dhanada.scheduler.sync_nav_performance.getdate") as mock_getdate:
			mock_date = MagicMock()
			mock_date.day = 15
			mock_date.strftime.return_value = "2026_09"
			mock_getdate.return_value = mock_date

			res = sync_nav_performance(dry_run=False, force=True)
			self.assertEqual(res["status"], "success")
			self.assertFalse(res["heatmap_included"])

	# =========================================================================
	# SCHEME DETAILS SCHEDULER TESTS (17 - 20)
	# =========================================================================

	@patch("dhanada.scheduler.sync_scheme_details.ensure_amfi_repository_updated")
	def test_17_scheme_scheduler_calls_repository_helper_first(self, mock_ensure):
		"""17. Scheme scheduler calls repository helper first."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		res = sync_scheme_details(dry_run=True, force=True)
		mock_ensure.assert_called_once()
		self.assertEqual(res["status"], "success")

	@patch("dhanada.scheduler.sync_scheme_details.ensure_amfi_repository_updated")
	def test_18_scheme_scheduler_reads_only_scheme_path(self, mock_ensure):
		"""18. Scheme scheduler reads only file_path_for_scheme_details."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		settings = frappe.get_single("Dhanada Settings")
		settings.file_path_for_nav_data = "invalid/nav/path"
		settings.file_path_for_nav_performance = "invalid/performance/path"
		settings.save(ignore_permissions=True)

		res = sync_scheme_details(dry_run=True, force=True)
		self.assertEqual(res["status"], "success")
		self.assertEqual(res["type"], "scheme_details")

	@patch("dhanada.scheduler.sync_scheme_details.ensure_amfi_repository_updated")
	def test_19_changed_scheme_data_triggers_ingestion(self, mock_ensure):
		"""19. Changed scheme data triggers existing ingestion."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		res1 = sync_scheme_details(dry_run=False, force=False)
		self.assertEqual(res1["status"], "success")

		# Add second scheme
		details_dir = os.path.join(repo_path, "data", "sif", "scheme", "details")
		with open(os.path.join(details_dir, "scheme2.json"), "w", encoding="utf-8") as f:
			json.dump(
				{
					"sebi_code": "TEST/O/E/ELSF/26/01/0002/ABSL",
					"fund_name": "Second Scheme",
					"category": "Equity Long-Short Fund",
					"fund_type": "Open Ended",
					"plans": {
						"Regular": {
							"Growth": {
								"isin": "INF123TEST02",
								"sif_code": "SIF-TEST-SCHED-2",
							}
						}
					},
				},
				f,
			)

		res2 = sync_scheme_details(dry_run=False, force=False)
		self.assertEqual(res2["status"], "success")
		self.assertEqual(res2["files_count"], 2)

	@patch("dhanada.scheduler.sync_scheme_details.ensure_amfi_repository_updated")
	def test_20_unchanged_scheme_matching_db_skips_unnecessary_writes(self, mock_ensure):
		"""20. Unchanged scheme data matching DB skips unnecessary writes."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		# Run first time -> creates approval request
		res1 = sync_scheme_details(dry_run=False, force=False)
		self.assertEqual(res1["status"], "success")

		# Run second time while approval pending / unchanged -> skipped, no duplicate approval
		res2 = sync_scheme_details(dry_run=False, force=False)
		self.assertEqual(res2["status"], "success")
		self.assertEqual(res2["stats"]["skipped"], 1)
		self.assertEqual(res2["stats"]["approvals_requested"], 0)

	@patch("dhanada.scheduler.sync_scheme_details.ensure_amfi_repository_updated")
	def test_20b_manually_modified_scheme_db_is_reconciled(self, mock_ensure):
		"""20b. Unchanged repo + manually modified scheme DB -> scheduler detects difference and reconciles."""
		repo_path = os.path.join(self.test_dir, "repo")
		self._setup_mock_repo_files(repo_path)
		mock_ensure.return_value = repo_path

		# Create SIF Scheme document in DB to simulate an existing active scheme
		if not frappe.db.exists("SIF Scheme", {"sebi_code": "TEST/O/E/ELSF/26/01/0001/ABSL"}):
			scheme_doc = frappe.new_doc("SIF Scheme")
			scheme_doc.flags.from_approval = True
			scheme_doc.flags.ignore_mandatory = True
			scheme_doc.flags.ignore_links = True
			scheme_doc.sebi_code = "TEST/O/E/ELSF/26/01/0001/ABSL"
			scheme_doc.scheme_name = "Test Scheduler Apex Scheme"
			scheme_doc.amc = "Aditya Birla Sun Life AMC"
			scheme_doc.scheme_subcategory = "Equity Long-Short Fund"
			scheme_doc.scheme_objective = "Capital appreciation"
			scheme_doc.investment_strategy = "Debt"  # Different from repo (repo has Equity)
			scheme_doc.insert(ignore_permissions=True)
			frappe.db.commit()

		res = sync_scheme_details(dry_run=False, force=False)
		self.assertEqual(res["status"], "success")
		self.assertEqual(res["stats"]["approvals_requested"], 1)

	# =========================================================================
	# SCHEDULER REGISTRATION TESTS (21 - 23)
	# =========================================================================

	def test_21_exactly_three_data_schedulers_registered_in_hooks(self):
		"""21. Exactly three data schedulers are registered."""
		from dhanada.hooks import scheduler_events

		all_tasks = []
		if "cron" in scheduler_events and isinstance(scheduler_events["cron"], dict):
			for _, tasks in scheduler_events["cron"].items():
				all_tasks.extend(tasks)
		for key, tasks in scheduler_events.items():
			if key != "cron" and isinstance(tasks, list):
				all_tasks.extend(tasks)

		self.assertIn("dhanada.scheduler.sync_nav_data.sync_nav_data", all_tasks)
		self.assertIn("dhanada.scheduler.sync_nav_performance.sync_nav_performance", all_tasks)
		self.assertIn("dhanada.scheduler.sync_scheme_details.sync_scheme_details", all_tasks)
		self.assertEqual(len(all_tasks), 3)

	def test_22_no_separate_run_sync_pipeline_registration(self):
		"""22. No separate run_sync_pipeline registration remains."""
		from dhanada.hooks import scheduler_events

		all_tasks = []
		if "cron" in scheduler_events and isinstance(scheduler_events["cron"], dict):
			for _, tasks in scheduler_events["cron"].items():
				all_tasks.extend(tasks)
		for key, tasks in scheduler_events.items():
			if key != "cron" and isinstance(tasks, list):
				all_tasks.extend(tasks)

		for task in all_tasks:
			self.assertNotIn("run_sync_pipeline", task)
			self.assertNotIn("clone_amfi_fetcher", task)

	def test_23_no_duplicate_scheduler_registration(self):
		"""23. No duplicate scheduler registration exists."""
		from dhanada.hooks import scheduler_events

		all_tasks = []
		if "cron" in scheduler_events and isinstance(scheduler_events["cron"], dict):
			for _, tasks in scheduler_events["cron"].items():
				all_tasks.extend(tasks)
		for key, tasks in scheduler_events.items():
			if key != "cron" and isinstance(tasks, list):
				all_tasks.extend(tasks)

		self.assertEqual(len(all_tasks), len(set(all_tasks)))
