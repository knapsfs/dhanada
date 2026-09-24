# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

from unittest.mock import patch

import frappe
from frappe.tests import IntegrationTestCase

from dhanada.sif.sync.scheduler import (
	run_github_sync_pipeline,
	sync_nav_performance,
	sync_scheme_details,
)

EXTRA_TEST_RECORD_DEPENDENCIES = []
IGNORE_TEST_RECORD_DEPENDENCIES = []


class IntegrationTestSIFSchemePlan(IntegrationTestCase):
	"""
	Integration tests for SIFSchemePlan, passive session isolation, and scheduler automation.
	"""

	@classmethod
	def setUpClass(cls):
		super().setUpClass()
		from dhanada.setup.bootstrap import before_tests

		before_tests()

	def setUp(self):
		super().setUp()
		frappe.local.request = None
		frappe.local.request_ip = None

	def tearDown(self):
		frappe.local.request = None
		frappe.local.request_ip = None
		super().tearDown()

	def test_data_scheduler_fixtures_and_helpers_removed(self):
		"""
		Verifies DATA_SCHEDULER_USER and execution_context module are completely removed,
		no Data Scheduler fixtures remain in hooks.py, and no database records exist.
		"""
		# 1. Ensure execution_context module does not exist
		with self.assertRaises(ImportError):
			import dhanada.utils.execution_context

		# 2. Ensure hooks fixtures do not contain Data Scheduler
		import dhanada.hooks as hooks

		for f in getattr(hooks, "fixtures", []):
			if isinstance(f, dict):
				self.assertNotEqual(f.get("name"), "Data Scheduler")
				self.assertNotEqual(f.get("role"), "Data Scheduler")
				for flt in f.get("filters", []):
					self.assertNotIn("Data Scheduler", flt)
					self.assertNotIn("datascheduler@gmail.com", flt)

		# 3. Ensure database is completely free of Data Scheduler records
		self.assertFalse(frappe.db.exists("User", "datascheduler@gmail.com"))
		self.assertFalse(frappe.db.exists("Role", "Data Scheduler"))
		self.assertFalse(frappe.db.exists("Role Profile", "Data Scheduler"))
		self.assertFalse(frappe.db.exists("Module Profile", "Data Scheduler"))
		self.assertEqual(len(frappe.get_all("Custom DocPerm", filters={"role": "Data Scheduler"})), 0)

	def test_sync_nav_performance_preserves_session_user(self):
		"""Verifies sync_nav_performance does not mutate the calling user session."""
		initial_user = frappe.session.user

		with patch("dhanada.sif.sync.scheduler.GitHubClient") as mock_client:
			mock_client.return_value.fetch_latest_nav.return_value = []
			mock_client.return_value.fetch_performance.return_value = {}
			with patch("dhanada.sif.sync.scheduler.DataMapper") as mock_mapper:
				mock_mapper.return_value.map_dataset.return_value = {}
				mock_mapper.return_value.validator.errors = []
				with patch("dhanada.sif.sync.scheduler.DataImporter"):
					res = sync_nav_performance(dry_run=True)
					self.assertEqual(res.get("status"), "success")

		self.assertEqual(frappe.session.user, initial_user)

	def test_sync_scheme_details_preserves_session_user(self):
		"""Verifies sync_scheme_details does not mutate the calling user session."""
		initial_user = frappe.session.user

		with patch("dhanada.sif.sync.scheduler.GitHubClient") as mock_client:
			mock_client.return_value.fetch_scheme_details.return_value = []
			mock_client.return_value.fetch_amfi_isin_mapping.return_value = {}
			with patch("dhanada.sif.sync.scheduler.DataMapper") as mock_mapper:
				mock_mapper.return_value.map_dataset.return_value = {}
				mock_mapper.return_value.validator.errors = []
				with patch("dhanada.sif.sync.scheduler.DataImporter"):
					res = sync_scheme_details(dry_run=True)
					self.assertEqual(res.get("status"), "success")

		self.assertEqual(frappe.session.user, initial_user)

	def test_run_github_sync_pipeline_preserves_session_user(self):
		"""Verifies master github sync pipeline preserves calling user session."""
		initial_user = frappe.session.user

		with (
			patch("dhanada.sif.sync.scheduler.sync_scheme_details") as mock_scheme,
			patch("dhanada.sif.sync.scheduler.sync_nav_performance") as mock_nav,
		):
			run_github_sync_pipeline()
			mock_scheme.assert_called_once()
			mock_nav.assert_called_once()

		self.assertEqual(frappe.session.user, initial_user)

	def test_create_website_lead_preserves_session_user_and_inserts_lead(self):
		from dhanada.api import create_website_lead

		initial_user = frappe.session.user

		frappe.local.form_dict = frappe._dict(
			{
				"full_name": "Execution Identity Test User",
				"email": "test_exec_user@example.com",
				"phone": "9999988888",
			}
		)

		res = create_website_lead()
		self.assertTrue(res.get("success"))
		self.assertEqual(frappe.session.user, initial_user)

		lead_name = res.get("lead_name")
		if lead_name and frappe.db.exists("CRM Lead", lead_name):
			lead = frappe.get_doc("CRM Lead", lead_name)
			self.assertEqual(lead.first_name, "Execution")
			self.assertEqual(lead.email, "test_exec_user@example.com")
			# Cleanup test record
			frappe.delete_doc("CRM Lead", lead_name, ignore_permissions=True, force=True)

	def test_create_chatbot_lead_preserves_session_user_and_populates_fields(self):
		from dhanada.api import create_chatbot_lead
		from dhanada.sif.conversation_service import create_conversation

		initial_user = frappe.session.user

		# Create conversation first
		conv = create_conversation(
			visitor_id="visitor-lead-test-1",
			user_name="Priya Sharma",
			email="priya.sharma@example.com",
			phone="9876543210",
			initial_message="I want to invest in Hybrid SIF schemes",
			chat_context="User interested in Hybrid SIF schemes with 10L budget.",
		)

		frappe.local.form_dict = frappe._dict(
			{
				"full_name": "Priya Sharma",
				"email": "priya.sharma@example.com",
				"mobile": "9876543210",
				"interest": "Long-Short Hybrid SIF",
				"conversation_id": conv["name"],
				"visitor_id": "visitor-lead-test-1",
			}
		)

		res = create_chatbot_lead()
		self.assertTrue(res.get("success"))
		self.assertEqual(frappe.session.user, initial_user)

		lead_name = res.get("lead_name")
		self.assertTrue(lead_name)
		self.assertTrue(frappe.db.exists("CRM Lead", lead_name))

		lead = frappe.get_doc("CRM Lead", lead_name)
		self.assertEqual(lead.first_name, "Priya")
		self.assertEqual(lead.last_name, "Sharma")
		self.assertEqual(lead.lead_name, "Priya Sharma")
		self.assertEqual(lead.email, "priya.sharma@example.com")
		self.assertEqual(lead.mobile_no, "9876543210")
		self.assertEqual(lead.source, "Website Chatbot")
		self.assertEqual(lead.custom_conversation, conv["name"])
		self.assertIn("Long-Short Hybrid SIF", lead.custom_chat_context or lead.chat_summary or "")

		# Cleanup
		frappe.delete_doc("CRM Lead", lead_name, ignore_permissions=True, force=True)
		frappe.delete_doc("Chatbot Conversation", conv["name"], ignore_permissions=True, force=True)

	def test_create_chatbot_lead_from_conversation_fallback_when_name_omitted(self):
		from dhanada.api import create_chatbot_lead
		from dhanada.sif.conversation_service import create_conversation

		initial_user = frappe.session.user

		conv = create_conversation(
			visitor_id="visitor-lead-test-2",
			user_name="Amit Patel",
			email="amit.patel@example.com",
			phone="9123456780",
			initial_message="Tell me about fund managers",
			chat_context="Discussed fund managers and track records.",
		)

		# Payload omits full_name and email, passing only conversation_id
		frappe.local.form_dict = frappe._dict(
			{
				"conversation_id": conv["name"],
				"visitor_id": "visitor-lead-test-2",
				"interest": "Fund Manager Track Records",
			}
		)

		res = create_chatbot_lead()
		self.assertTrue(res.get("success"))
		self.assertEqual(frappe.session.user, initial_user)

		lead_name = res.get("lead_name")
		lead = frappe.get_doc("CRM Lead", lead_name)

		# Proves it resolved name and contact from the conversation record instead of 'Unknown'
		self.assertEqual(lead.first_name, "Amit")
		self.assertEqual(lead.last_name, "Patel")
		self.assertEqual(lead.lead_name, "Amit Patel")
		self.assertEqual(lead.email, "amit.patel@example.com")
		self.assertEqual(lead.mobile_no, "9123456780")

		# Cleanup
		frappe.delete_doc("CRM Lead", lead_name, ignore_permissions=True, force=True)
		frappe.delete_doc("Chatbot Conversation", conv["name"], ignore_permissions=True, force=True)

	def test_create_chatbot_lead_with_json_request_body(self):
		import json

		from dhanada.api import create_chatbot_lead

		initial_user = frappe.session.user
		frappe.local.form_dict = frappe._dict()

		# Simulate raw JSON POST request
		raw_json = json.dumps(
			{
				"full_name": "Kavita Rao",
				"email": "kavita.rao@example.com",
				"phone": "9811122233",
				"interest": "SIF Tax Implications",
				"chat_summary": "Inquired about taxation on SIF capital gains.",
			}
		)

		class MockRequest:
			data = raw_json
			method = "POST"

		frappe.local.request = MockRequest()
		frappe.local.request_ip = "127.0.0.1"

		lead_name = None
		try:
			res = create_chatbot_lead()
			self.assertTrue(res.get("success"))
			self.assertEqual(frappe.session.user, initial_user)

			lead_name = res.get("lead_name")
			lead = frappe.get_doc("CRM Lead", lead_name)

			self.assertEqual(lead.first_name, "Kavita")
			self.assertEqual(lead.last_name, "Rao")
			self.assertEqual(lead.lead_name, "Kavita Rao")
			self.assertEqual(lead.email, "kavita.rao@example.com")
			self.assertEqual(lead.mobile_no, "9811122233")
			self.assertEqual(lead.source, "Website Chatbot")
		finally:
			if lead_name and frappe.db.exists("CRM Lead", lead_name):
				frappe.delete_doc("CRM Lead", lead_name, ignore_permissions=True, force=True)
			frappe.local.request = None
			frappe.local.request_ip = None

	def test_get_chatbot_config_preserves_session_user(self):
		from dhanada.api import get_chatbot_config

		initial_user = frappe.session.user
		get_chatbot_config()
		self.assertEqual(frappe.session.user, initial_user)

	def test_conversation_service_preserves_session_user(self):
		from dhanada.sif.conversation_service import create_conversation

		initial_user = frappe.session.user

		conv = create_conversation(
			visitor_id="test-visitor-uuid-123",
			user_name="Visitor Test",
			initial_message="Hello SIF bot",
		)
		self.assertEqual(frappe.session.user, initial_user)

		conv_name = conv.get("name")
		if conv_name and frappe.db.exists("Chatbot Conversation", conv_name):
			frappe.delete_doc("Chatbot Conversation", conv_name, ignore_permissions=True, force=True)

	def test_get_funds_list_preserves_session_user(self):
		from dhanada.api import get_funds_list

		initial_user = frappe.session.user
		get_funds_list()
		self.assertEqual(frappe.session.user, initial_user)

	def test_get_historical_nav_preserves_session_user(self):
		from dhanada.api import get_historical_nav

		initial_user = frappe.session.user
		get_historical_nav("sif_test_code")
		self.assertEqual(frappe.session.user, initial_user)

	def test_get_fund_details_preserves_session_user(self):
		from dhanada.api import get_fund_details

		initial_user = frappe.session.user
		get_fund_details("nonexistent_fund_code")
		self.assertEqual(frappe.session.user, initial_user)

	def test_data_importer_preserves_session_user(self):
		from dhanada.sif.sync.importer import DataImporter

		initial_user = frappe.session.user
		DataImporter(dry_run=True)
		self.assertEqual(frappe.session.user, initial_user)

	def test_create_approval_request_preserves_session_user(self):
		from dhanada.sif.sync.approval import create_approval_request

		initial_user = frappe.session.user
		create_approval_request("test_scheme", [])
		self.assertEqual(frappe.session.user, initial_user)

	def test_cleanup_execute_preserves_session_user(self):
		from dhanada.cleanup import execute as cleanup_execute

		initial_user = frappe.session.user
		cleanup_execute()
		self.assertEqual(frappe.session.user, initial_user)

	def test_get_historical_nav_returns_database_records(self):
		"""Verifies get_historical_nav reads from SIF NAV Historical Data DocType."""
		from dhanada.api import get_historical_nav, get_historical_nav_for_sif

		test_code = "SIF-TEST-PLAN"
		doc = frappe.new_doc("SIF NAV Historical Data")
		doc.sif_code = test_code
		doc.append("historical_nav_data", {"nav_date": "2026-06-15", "nav": 12.3456})
		doc.insert(ignore_permissions=True)

		data = get_historical_nav_for_sif(test_code)
		self.assertTrue(len(data) >= 1)
		self.assertEqual(data[0]["date"], "15-Jun-2026")
		self.assertAlmostEqual(data[0]["nav"], 12.3456, places=4)

		res = get_historical_nav(test_code)
		self.assertEqual(res.get("status"), "success")
		self.assertEqual(res.get("data"), data)

		frappe.delete_doc("SIF NAV Historical Data", doc.name, ignore_permissions=True, force=True)
