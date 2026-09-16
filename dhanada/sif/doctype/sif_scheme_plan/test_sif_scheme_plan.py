# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

from unittest.mock import patch

import frappe
from frappe.tests import IntegrationTestCase

from dhanada.sif.sync.scheduler import (
	DATA_SCHEDULER_USER,
	run_github_sync_pipeline,
	set_scheduler_user,
	sync_nav_performance,
	sync_scheme_details,
)

EXTRA_TEST_RECORD_DEPENDENCIES = []
IGNORE_TEST_RECORD_DEPENDENCIES = []


class IntegrationTestSIFSchemePlan(IntegrationTestCase):
	"""
	Integration tests for SIFSchemePlan and SIF synchronization scheduler execution identity.
	"""

	def test_set_scheduler_user_switches_to_data_scheduler(self):
		frappe.set_user("Administrator")
		self.assertEqual(frappe.session.user, "Administrator")

		user = set_scheduler_user()
		self.assertEqual(user, DATA_SCHEDULER_USER)
		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)
		self.assertEqual(frappe.session.user, "datascheduler@gmail.com")

	def test_set_scheduler_user_raises_on_nonexistent_user(self):
		frappe.set_user("Administrator")
		with self.assertRaises(frappe.DoesNotExistError):
			set_scheduler_user("nonexistent_scheduler_user_123@example.com")

		# Ensure it did not fall back or switch to invalid user
		self.assertNotEqual(frappe.session.user, "nonexistent_scheduler_user_123@example.com")

	def test_assert_scheduler_user_raises_on_admin_or_guest(self):
		from dhanada.utils.execution_context import assert_scheduler_user

		frappe.set_user("Administrator")
		with self.assertRaises(RuntimeError):
			assert_scheduler_user()

		frappe.set_user("Guest")
		with self.assertRaises(RuntimeError):
			assert_scheduler_user()

		frappe.set_user(DATA_SCHEDULER_USER)
		current = assert_scheduler_user()
		self.assertEqual(current, DATA_SCHEDULER_USER)

	def test_sync_nav_performance_switches_user(self):
		frappe.set_user("Administrator")
		self.assertEqual(frappe.session.user, "Administrator")

		with patch("dhanada.sif.sync.scheduler.GitHubClient") as mock_client:
			mock_client.return_value.fetch_latest_nav.return_value = []
			mock_client.return_value.fetch_performance.return_value = {}
			with patch("dhanada.sif.sync.scheduler.DataMapper") as mock_mapper:
				mock_mapper.return_value.map_dataset.return_value = {}
				mock_mapper.return_value.validator.errors = []
				with patch("dhanada.sif.sync.scheduler.DataImporter"):
					sync_nav_performance(dry_run=True)

		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)

	def test_sync_scheme_details_switches_user(self):
		frappe.set_user("Administrator")
		self.assertEqual(frappe.session.user, "Administrator")

		with patch("dhanada.sif.sync.scheduler.GitHubClient") as mock_client:
			mock_client.return_value.fetch_scheme_details.return_value = []
			mock_client.return_value.fetch_amfi_isin_mapping.return_value = {}
			with patch("dhanada.sif.sync.scheduler.DataMapper") as mock_mapper:
				mock_mapper.return_value.map_dataset.return_value = {}
				mock_mapper.return_value.validator.errors = []
				with patch("dhanada.sif.sync.scheduler.DataImporter"):
					sync_scheme_details(dry_run=True)

		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)

	def test_run_github_sync_pipeline_switches_user(self):
		frappe.set_user("Administrator")
		self.assertEqual(frappe.session.user, "Administrator")

		with (
			patch("dhanada.sif.sync.scheduler.sync_scheme_details") as mock_scheme,
			patch("dhanada.sif.sync.scheduler.sync_nav_performance") as mock_nav,
		):
			run_github_sync_pipeline()
			mock_scheme.assert_called_once()
			mock_nav.assert_called_once()

		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)

	def test_create_website_lead_switches_user(self):
		from dhanada.api import create_website_lead

		frappe.set_user("Guest")
		self.assertEqual(frappe.session.user, "Guest")

		frappe.local.form_dict = frappe._dict(
			{
				"full_name": "Execution Identity Test User",
				"email": "test_exec_user@example.com",
				"phone": "9999988888",
			}
		)

		res = create_website_lead()
		self.assertTrue(res.get("success"))
		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)

		lead_name = res.get("lead_name")
		if lead_name and frappe.db.exists("CRM Lead", lead_name):
			lead = frappe.get_doc("CRM Lead", lead_name)
			self.assertEqual(lead.owner, DATA_SCHEDULER_USER)
			# Cleanup test record
			frappe.delete_doc("CRM Lead", lead_name, ignore_permissions=True, force=True)

	def test_create_chatbot_lead_switches_user_and_populates_fields(self):
		from dhanada.api import create_chatbot_lead
		from dhanada.sif.conversation_service import create_conversation

		frappe.set_user("Guest")
		self.assertEqual(frappe.session.user, "Guest")

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
		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)

		lead_name = res.get("lead_name")
		self.assertTrue(lead_name)
		self.assertTrue(frappe.db.exists("CRM Lead", lead_name))

		lead = frappe.get_doc("CRM Lead", lead_name)
		self.assertEqual(lead.first_name, "Priya")
		self.assertEqual(lead.last_name, "Sharma")
		self.assertEqual(lead.lead_name, "Priya Sharma")
		self.assertEqual(lead.email, "priya.sharma@example.com")
		self.assertEqual(lead.mobile_no, "9876543210")
		self.assertEqual(lead.lead_owner, DATA_SCHEDULER_USER)
		self.assertEqual(lead.owner, DATA_SCHEDULER_USER)
		self.assertEqual(lead.source, "Website Chatbot")
		self.assertEqual(lead.custom_conversation, conv["name"])
		self.assertIn("Long-Short Hybrid SIF", lead.custom_chat_context or lead.chat_summary or "")

		# Cleanup
		frappe.delete_doc("CRM Lead", lead_name, ignore_permissions=True, force=True)
		frappe.delete_doc("Chatbot Conversation", conv["name"], ignore_permissions=True, force=True)

	def test_create_chatbot_lead_from_conversation_fallback_when_name_omitted(self):
		from dhanada.api import create_chatbot_lead
		from dhanada.sif.conversation_service import create_conversation

		frappe.set_user("Guest")

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
		lead_name = res.get("lead_name")
		lead = frappe.get_doc("CRM Lead", lead_name)

		# Proves it resolved name and contact from the conversation record instead of 'Unknown'
		self.assertEqual(lead.first_name, "Amit")
		self.assertEqual(lead.last_name, "Patel")
		self.assertEqual(lead.lead_name, "Amit Patel")
		self.assertEqual(lead.email, "amit.patel@example.com")
		self.assertEqual(lead.mobile_no, "9123456780")
		self.assertEqual(lead.lead_owner, DATA_SCHEDULER_USER)
		self.assertEqual(lead.owner, DATA_SCHEDULER_USER)

		# Cleanup
		frappe.delete_doc("CRM Lead", lead_name, ignore_permissions=True, force=True)
		frappe.delete_doc("Chatbot Conversation", conv["name"], ignore_permissions=True, force=True)

	def test_create_chatbot_lead_with_json_request_body(self):
		import json

		from dhanada.api import create_chatbot_lead

		frappe.set_user("Guest")
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

		frappe.local.request = MockRequest()

		res = create_chatbot_lead()
		self.assertTrue(res.get("success"))
		lead_name = res.get("lead_name")
		lead = frappe.get_doc("CRM Lead", lead_name)

		self.assertEqual(lead.first_name, "Kavita")
		self.assertEqual(lead.last_name, "Rao")
		self.assertEqual(lead.lead_name, "Kavita Rao")
		self.assertEqual(lead.email, "kavita.rao@example.com")
		self.assertEqual(lead.mobile_no, "9811122233")
		self.assertEqual(lead.lead_owner, DATA_SCHEDULER_USER)
		self.assertEqual(lead.owner, DATA_SCHEDULER_USER)
		self.assertEqual(lead.source, "Website Chatbot")

		# Cleanup
		frappe.delete_doc("CRM Lead", lead_name, ignore_permissions=True, force=True)
		frappe.local.request = None

	def test_get_chatbot_config_switches_user(self):
		from dhanada.api import get_chatbot_config

		frappe.set_user("Guest")
		self.assertEqual(frappe.session.user, "Guest")

		get_chatbot_config()
		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)

	def test_conversation_service_switches_user(self):
		from dhanada.sif.conversation_service import create_conversation

		frappe.set_user("Guest")
		self.assertEqual(frappe.session.user, "Guest")

		conv = create_conversation(
			visitor_id="test-visitor-uuid-123",
			user_name="Visitor Test",
			initial_message="Hello SIF bot",
		)
		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)

		conv_name = conv.get("name")
		if conv_name and frappe.db.exists("Chatbot Conversation", conv_name):
			doc = frappe.get_doc("Chatbot Conversation", conv_name)
			self.assertEqual(doc.owner, DATA_SCHEDULER_USER)
			frappe.delete_doc("Chatbot Conversation", conv_name, ignore_permissions=True, force=True)

	def test_get_funds_list_switches_user_from_admin(self):
		from dhanada.api import get_funds_list

		frappe.set_user("Administrator")
		self.assertEqual(frappe.session.user, "Administrator")

		get_funds_list()
		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)

	def test_get_historical_nav_switches_user_from_admin(self):
		from dhanada.api import get_historical_nav

		frappe.set_user("Administrator")
		self.assertEqual(frappe.session.user, "Administrator")

		get_historical_nav("sif_test_code")
		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)

	def test_get_fund_details_switches_user_from_admin(self):
		from dhanada.api import get_fund_details

		frappe.set_user("Administrator")
		self.assertEqual(frappe.session.user, "Administrator")

		get_fund_details("nonexistent_fund_code")
		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)

	def test_data_importer_switches_user_from_admin(self):
		from dhanada.sif.sync.importer import DataImporter

		frappe.set_user("Administrator")
		self.assertEqual(frappe.session.user, "Administrator")

		DataImporter(dry_run=True)
		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)

	def test_create_approval_request_switches_user_from_admin(self):
		from dhanada.sif.sync.approval import create_approval_request

		frappe.set_user("Administrator")
		self.assertEqual(frappe.session.user, "Administrator")

		# Call with empty changes (should switch user and return None)
		create_approval_request("test_scheme", [])
		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)

	def test_cleanup_execute_switches_user_from_admin(self):
		from dhanada.cleanup import execute as cleanup_execute

		frappe.set_user("Administrator")
		self.assertEqual(frappe.session.user, "Administrator")

		cleanup_execute()
		self.assertEqual(frappe.session.user, DATA_SCHEDULER_USER)
