# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import unittest
from datetime import timedelta
from unittest.mock import MagicMock, patch

import frappe
from frappe.tests.utils import FrappeTestCase
from frappe.utils import now_datetime

from dhanada.whatsapp_adapter import (
	clean_phone_number,
	get_approved_templates,
	get_crm_whatsapp_conversations,
	get_default_whatsapp_account,
	get_whatsapp_session_status,
	is_official_whatsapp_available,
	match_and_link_inbound_message,
	match_lead_or_client_by_phone,
	normalize_wa_message,
	send_crm_whatsapp_message,
)
from dhanada.whatsapp_api import (
	get_crm_whatsapp_conversations as api_get_conversations,
	send_crm_whatsapp_message as api_send_message,
)


class TestWhatsAppAdapter(FrappeTestCase):
	def setUp(self):
		super().setUp()
		self.cleanup_test_records()

		# Ensure Administrator session for permission testing
		frappe.set_user("Administrator")

		# Create a test Lead
		self.test_lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Test WA Lead",
				"mobile_no": "9876543210",
				"email": "test_wa_lead@example.com",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		# Create a test Client
		self.test_client = frappe.get_doc(
			{
				"doctype": "Client",
				"first_name": "Test WA",
				"last_name": "Client",
				"mobile_no": "9876500000",
				"email": "test_wa_client@example.com",
				"client_status": "Active",
			}
		).insert(ignore_permissions=True)

		frappe.db.commit()

	def tearDown(self):
		self.cleanup_test_records()
		super().tearDown()

	def cleanup_test_records(self):
		"""Remove test documents created during tests."""
		frappe.db.delete("Lead", {"email": "test_wa_lead@example.com"})
		frappe.db.delete("Client", {"email": "test_wa_client@example.com"})
		if frappe.db.table_exists("CRM WhatsApp Message"):
			frappe.db.delete("CRM WhatsApp Message", {"recipient": ["like", "%98765%"]})
		if hasattr(self, "test_lead") and self.test_lead:
			frappe.db.delete("WA Message", {"reference_docname": self.test_lead.name})
		if hasattr(self, "test_client") and self.test_client:
			frappe.db.delete("WA Message", {"reference_docname": self.test_client.name})
		if frappe.db.table_exists("WA Message"):
			frappe.db.delete("WA Message", {"message_id": ["like", "%e2e%"]})
		if frappe.db.table_exists("WA Account"):
			frappe.db.delete("WA Account", {"account_name": ["like", "_Test WA%"]})
		if frappe.db.table_exists("WA Profile"):
			frappe.db.delete("WA Profile", {"phone_number": ["like", "%98765%"]})
		frappe.db.commit()

	def test_01_phone_normalization(self):
		"""Verify clean_phone_number normalizes various input formats to E.164 digits."""
		self.assertEqual(clean_phone_number("9876543210"), "919876543210")
		self.assertEqual(clean_phone_number("+91 98765 43210"), "919876543210")
		self.assertEqual(clean_phone_number("+91-9876543210"), "919876543210")
		self.assertEqual(clean_phone_number("919876543210"), "919876543210")
		self.assertEqual(clean_phone_number(""), "")
		self.assertEqual(clean_phone_number(None), "")

	def test_02_lead_client_matching_by_phone(self):
		"""Verify match_lead_or_client_by_phone accurately finds Lead or Client."""
		dt, dn = match_lead_or_client_by_phone("9876543210")
		self.assertEqual(dt, "Lead")
		self.assertEqual(dn, self.test_lead.name)

		dt, dn = match_lead_or_client_by_phone("+919876500000")
		self.assertEqual(dt, "Client")
		self.assertEqual(dn, self.test_client.name)

		dt, dn = match_lead_or_client_by_phone("9999999999")
		self.assertIsNone(dt)
		self.assertIsNone(dn)

	def test_03_normalize_wa_message(self):
		"""Verify normalize_wa_message shapes official and custom message records consistently."""
		raw_official = {
			"name": "hash_12345",
			"message_id": "wamid_abcde",
			"direction": "Outgoing",
			"status": "Sent",
			"from": "919800000000",
			"to": "+919876543210",
			"reference_doctype": "Lead",
			"reference_docname": self.test_lead.name,
			"is_template": 0,
			"message": "Hello from KNAPS!",
			"creation": "2026-10-26 12:00:00.000000",
			"timestamp": "2026-10-26 12:00:00",
			"error_message": None,
		}

		normalized = normalize_wa_message(raw_official)
		self.assertEqual(normalized["direction"], "Outbound")
		self.assertEqual(normalized["message_type"], "text")
		self.assertEqual(normalized["content"], "Hello from KNAPS!")
		self.assertEqual(normalized["status"], "Sent")
		self.assertEqual(normalized["reference_doctype"], "Lead")
		self.assertEqual(normalized["reference_name"], self.test_lead.name)
		self.assertTrue("Oct 2026" in normalized["sent_at_formatted"])

		raw_incoming = {
			"name": "hash_67890",
			"direction": "Incoming",
			"status": "Delivered",
			"from": "+919876543210",
			"message": "I want more info on SIF.",
			"creation": "2026-10-26 12:05:00.000000",
		}
		norm_in = normalize_wa_message(raw_incoming)
		self.assertEqual(norm_in["direction"], "Inbound")
		self.assertEqual(norm_in["message_type"], "text")

	def test_04_official_app_detection(self):
		"""Verify is_official_whatsapp_available detects app in installed_apps."""
		with patch("frappe.get_installed_apps", return_value=["frappe", "dhanada", "whatsapp"]):
			self.assertTrue(is_official_whatsapp_available())

		with patch("frappe.get_installed_apps", return_value=["frappe", "dhanada"]):
			self.assertFalse(is_official_whatsapp_available())

	def test_05_missing_official_app_error_handling(self):
		"""Verify clear error is returned if the official app is missing rather than silent fallback."""
		with patch("dhanada.whatsapp_adapter.is_official_whatsapp_available", return_value=False):
			with self.assertRaises(frappe.ValidationError):
				send_crm_whatsapp_message(
					doctype="Lead",
					name=self.test_lead.name,
					message="This should fail safely.",
				)

			# get_crm_whatsapp_conversations returns provider_configured: False
			res = get_crm_whatsapp_conversations("Lead", self.test_lead.name)
			self.assertFalse(res["provider_configured"])

	def test_06_permission_failure(self):
		"""Verify non-existent document or permission failure raises proper errors."""
		with self.assertRaises(frappe.DoesNotExistError):
			get_crm_whatsapp_conversations("Lead", "NON_EXISTENT_LEAD_XYZ")

		with self.assertRaises(frappe.DoesNotExistError):
			send_crm_whatsapp_message(
				doctype="Lead",
				name="NON_EXISTENT_LEAD_XYZ",
				message="Hello",
			)

	@patch("dhanada.whatsapp_adapter.is_official_whatsapp_available", return_value=True)
	@patch("dhanada.whatsapp_adapter.get_default_whatsapp_account", return_value="Test Account")
	@patch("dhanada.whatsapp_adapter.get_whatsapp_session_status", return_value=(True, "2026-10-27 12:00:00"))
	def test_07_send_message_delegation(self, mock_sess, mock_acc, mock_avail):
		"""Verify outbound message delegates to official messages.send_message with exact parameters."""
		with patch("whatsapp.whatsapp.api.messages.send_message", return_value="hash_msg_123") as mock_send:
			with patch("frappe.db.exists", return_value=True):
				mock_doc = MagicMock()
				mock_doc.name = "hash_msg_123"
				mock_doc.status = "Sent"
				mock_doc.error_message = None
				mock_doc.message = "Hello Test Lead"
				mock_doc.timestamp = now_datetime()
				mock_doc.creation = now_datetime()

				with patch("frappe.get_doc", side_effect=lambda dt, dn=None: self.test_lead if dt == "Lead" else mock_doc):
					res = send_crm_whatsapp_message(
						doctype="Lead",
						name=self.test_lead.name,
						message="Hello Test Lead",
					)

					mock_send.assert_called_once_with(
						to="+919876543210",
						message="Hello Test Lead",
						reference_doctype="Lead",
						reference_docname=self.test_lead.name,
					)
					self.assertEqual(res["status"], "success")
					self.assertEqual(res["delivery_status"], "Sent")
					self.assertEqual(res["message_name"], "hash_msg_123")

	@patch("dhanada.whatsapp_adapter.is_official_whatsapp_available", return_value=True)
	@patch("dhanada.whatsapp_adapter.get_default_whatsapp_account", return_value="Test Account")
	@patch("dhanada.whatsapp_adapter.get_whatsapp_session_status", return_value=(True, "2026-10-27 12:00:00"))
	def test_08_send_template_delegation(self, mock_sess, mock_acc, mock_avail):
		"""Verify outbound template delegates to official messages.send_template if approved in WA Template."""
		with patch("whatsapp.whatsapp.api.messages.send_template", return_value="hash_tpl_123") as mock_send_tpl:
			with patch("frappe.db.exists", side_effect=lambda dt, fn=None: True):
				mock_doc = MagicMock()
				mock_doc.name = "hash_tpl_123"
				mock_doc.status = "Sent"
				mock_doc.error_message = None
				mock_doc.message = "Template Message Content"
				mock_doc.timestamp = now_datetime()
				mock_doc.creation = now_datetime()

				with patch("frappe.get_doc", side_effect=lambda dt, dn=None: self.test_lead if dt == "Lead" else mock_doc):
					res = send_crm_whatsapp_message(
						doctype="Lead",
						name=self.test_lead.name,
						template_name="knaps_welcome",
						template_params=["John Doe", "Advisor Smith"],
					)

					mock_send_tpl.assert_called_once_with(
						template="knaps_welcome",
						to="+919876543210",
						reference_doctype="Lead",
						reference_docname=self.test_lead.name,
					)
					self.assertEqual(res["status"], "success")
					self.assertEqual(res["message_name"], "hash_tpl_123")

	@patch("dhanada.whatsapp_adapter.is_official_whatsapp_available", return_value=True)
	@patch("dhanada.whatsapp_adapter.get_default_whatsapp_account", return_value="Test Account")
	@patch("dhanada.whatsapp_adapter.get_whatsapp_session_status", return_value=(False, None))
	def test_09_session_window_enforcement(self, mock_sess, mock_acc, mock_avail):
		"""Verify that outside 24h session window, free-form text messages are blocked."""
		with self.assertRaises(frappe.ValidationError):
			send_crm_whatsapp_message(
				doctype="Lead",
				name=self.test_lead.name,
				message="Attempting to send text outside 24h window",
			)

	def test_10_missing_account_configuration(self):
		"""Verify missing WhatsApp account configuration queues message safely with warning."""
		with patch("dhanada.whatsapp_adapter.is_official_whatsapp_available", return_value=True):
			with patch("dhanada.whatsapp_adapter.get_default_whatsapp_account", return_value=None):
				res = send_crm_whatsapp_message(
					doctype="Lead",
					name=self.test_lead.name,
					message="Testing missing account configuration",
				)
				self.assertEqual(res["status"], "queued")
				self.assertEqual(res["delivery_status"], "Queued")
				self.assertIsNotNone(res["warning"])


	def test_11_match_and_link_inbound_message(self):
		"""Verify match_and_link_inbound_message links unreferenced incoming WA Message by phone."""
		mock_wa_msg = MagicMock()
		mock_wa_msg.name = "test_wa_inbound_01"
		mock_wa_msg.direction = "Incoming"
		mock_wa_msg.reference_doctype = None
		mock_wa_msg.reference_docname = None
		mock_wa_msg.to = "test_profile_01"
		mock_wa_msg.timestamp = now_datetime()
		mock_wa_msg.is_new.return_value = False
		mock_wa_msg.flags = frappe._dict()

		real_get_value = frappe.db.get_value

		def mock_get_value_fn(dt, filters=None, fieldname=None, **kwargs):
			if dt == "WA Profile":
				return "+919876543210"
			return real_get_value(dt, filters, fieldname, **kwargs)

		with patch("frappe.db.exists", return_value=True):
			with patch("frappe.get_doc", return_value=mock_wa_msg):
				with patch("frappe.db.get_value", side_effect=mock_get_value_fn):
					ref_dt, ref_dn = match_and_link_inbound_message("test_wa_inbound_01")
					self.assertEqual(ref_dt, "Lead")
					self.assertEqual(ref_dn, self.test_lead.name)
					mock_wa_msg.db_set.assert_called_once()

	def test_12_inbound_linking_client_priority(self):
		"""Verify incoming message prioritizes Client over Lead if both could match."""
		mock_wa_msg = MagicMock()
		mock_wa_msg.name = "test_wa_client_01"
		mock_wa_msg.direction = "Incoming"
		mock_wa_msg.reference_doctype = None
		mock_wa_msg.reference_docname = None
		mock_wa_msg.to = "test_profile_client"
		mock_wa_msg.timestamp = now_datetime()
		mock_wa_msg.is_new.return_value = False
		mock_wa_msg.flags = frappe._dict()

		real_get_value = frappe.db.get_value

		def mock_get_value_fn(dt, filters=None, fieldname=None, **kwargs):
			if dt == "WA Profile":
				return "+919876500000"
			return real_get_value(dt, filters, fieldname, **kwargs)

		with patch("frappe.db.exists", return_value=True):
			with patch("frappe.get_doc", return_value=mock_wa_msg):
				with patch("frappe.db.get_value", side_effect=mock_get_value_fn):
					ref_dt, ref_dn = match_and_link_inbound_message("test_wa_client_01")
					self.assertEqual(ref_dt, "Client")
					self.assertEqual(ref_dn, self.test_client.name)

	def test_13_inbound_unmatched_phone(self):
		"""Verify message from unknown number leaves reference empty without error."""
		mock_wa_msg = MagicMock()
		mock_wa_msg.name = "test_wa_unknown_01"
		mock_wa_msg.direction = "Incoming"
		mock_wa_msg.reference_doctype = None
		mock_wa_msg.reference_docname = None
		mock_wa_msg.to = "test_profile_unknown"
		mock_wa_msg.timestamp = now_datetime()
		mock_wa_msg.flags = frappe._dict()

		real_get_value = frappe.db.get_value

		def mock_get_value_fn(dt, filters=None, fieldname=None, **kwargs):
			if dt == "WA Profile":
				return "+911111111111"
			return real_get_value(dt, filters, fieldname, **kwargs)

		with patch("frappe.db.exists", return_value=True):
			with patch("frappe.get_doc", return_value=mock_wa_msg):
				with patch("frappe.db.get_value", side_effect=mock_get_value_fn):
					ref_dt, ref_dn = match_and_link_inbound_message("test_wa_unknown_01")
					self.assertIsNone(ref_dt)
					self.assertIsNone(ref_dn)
					self.assertIsNone(mock_wa_msg.reference_doctype)

	def test_14_inbound_existing_reference_preserved(self):
		"""Verify existing reference is never overwritten by inbound hook."""
		mock_wa_msg = MagicMock()
		mock_wa_msg.name = "test_wa_existing_01"
		mock_wa_msg.direction = "Incoming"
		mock_wa_msg.reference_doctype = "CustomDoc"
		mock_wa_msg.reference_docname = "CUSTOM-001"
		mock_wa_msg.to = "test_profile_01"
		mock_wa_msg.flags = frappe._dict()

		ref_dt, ref_dn = match_and_link_inbound_message(mock_wa_msg)
		self.assertEqual(ref_dt, "CustomDoc")
		self.assertEqual(ref_dn, "CUSTOM-001")
		mock_wa_msg.db_set.assert_not_called()

	def test_15_repeated_hook_execution_idempotency(self):
		"""Verify repeated execution on same doc returns immediately without duplicate side-effects."""
		mock_wa_msg = MagicMock()
		mock_wa_msg.name = "test_wa_repeat_01"
		mock_wa_msg.direction = "Incoming"
		mock_wa_msg.reference_doctype = None
		mock_wa_msg.reference_docname = None
		mock_wa_msg.to = "test_profile_01"
		mock_wa_msg.timestamp = now_datetime()
		mock_wa_msg.is_new.return_value = False
		mock_wa_msg.flags = frappe._dict()

		real_get_value = frappe.db.get_value

		def mock_get_value_fn(dt, filters=None, fieldname=None, **kwargs):
			if dt == "WA Profile":
				return "+919876543210"
			return real_get_value(dt, filters, fieldname, **kwargs)

		with patch("frappe.db.exists", return_value=True):
			with patch("frappe.get_doc", return_value=mock_wa_msg):
				with patch("frappe.db.get_value", side_effect=mock_get_value_fn):
					# First call
					ref_dt1, ref_dn1 = match_and_link_inbound_message(mock_wa_msg)
					self.assertEqual(ref_dt1, "Lead")
					self.assertEqual(mock_wa_msg.db_set.call_count, 1)

					# Second call (repeated hook trigger)
					ref_dt2, ref_dn2 = match_and_link_inbound_message(mock_wa_msg)
					self.assertEqual(ref_dt2, "Lead")
					# db_set must not be called a second time
					self.assertEqual(mock_wa_msg.db_set.call_count, 1)

	def test_16_before_insert_lifecycle_execution(self):
		"""Verify before_insert hook populates in-memory fields without db_set or recursive save."""
		doc = frappe._dict(
			{
				"doctype": "WA Message",
				"name": "new_hash_wa_msg",
				"direction": "Incoming",
				"reference_doctype": None,
				"reference_docname": None,
				"to": "test_profile_01",
				"from": "919800000000",
				"timestamp": now_datetime(),
				"flags": frappe._dict(),
			}
		)
		doc.is_new = lambda: True
		doc.db_set = MagicMock()

		real_get_value = frappe.db.get_value

		def mock_get_value_fn(dt, filters=None, fieldname=None, **kwargs):
			if dt == "WA Profile":
				return "+919876543210"
			return real_get_value(dt, filters, fieldname, **kwargs)

		with patch("frappe.db.exists", return_value=True):
			with patch("frappe.db.get_value", side_effect=mock_get_value_fn):
				ref_dt, ref_dn = match_and_link_inbound_message(doc, "before_insert")
				self.assertEqual(ref_dt, "Lead")
				self.assertEqual(ref_dn, self.test_lead.name)
				self.assertEqual(doc.reference_doctype, "Lead")
				self.assertEqual(doc.reference_docname, self.test_lead.name)
				# Verifying no db_set is called during before_insert
				doc.db_set.assert_not_called()

	def test_17_e2e_outgoing_message_flow(self):
		"""Verify end-to-end outgoing message creation with official WA Message and mocked Meta API."""
		wa_acc = frappe.get_doc(
			{
				"doctype": "WA Account",
				"account_name": f"_Test WA Acc {frappe.generate_hash(length=6)}",
				"status": "Active",
				"phone_id": "test_phone_id_e2e",
				"business_id": "test_biz_e2e",
				"app_id": "test_app_e2e",
				"access_token": "mock_token_e2e",
			}
		).insert(ignore_permissions=True)
		orig_default = frappe.db.get_single_value("WA Settings", "default_account")
		frappe.db.set_single_value("WA Settings", "default_account", wa_acc.name)
		res = {}

		try:
			mock_meta_resp = {"messages": [{"id": "wamid.e2e.out.1"}]}
			with patch("whatsapp.whatsapp.api.whatsapp.WhatsApp.send_message", return_value=mock_meta_resp) as mock_meta:
				with patch("dhanada.whatsapp_adapter.get_whatsapp_session_status", return_value=(True, "2026-10-27 12:00:00")):
					res = send_crm_whatsapp_message(
						doctype="Lead",
						name=self.test_lead.name,
						message="E2E outgoing text message",
					)
					self.assertEqual(res["status"], "success")
					self.assertEqual(res["delivery_status"], "Sent")
					msg_doc = frappe.get_doc("WA Message", res["message_name"])
					self.assertEqual(msg_doc.direction, "Outgoing")
					self.assertEqual(msg_doc.status, "Sent")
					self.assertEqual(msg_doc.reference_doctype, "Lead")
					self.assertEqual(msg_doc.reference_docname, self.test_lead.name)
					mock_meta.assert_called_once()
		finally:
			frappe.db.set_single_value("WA Settings", "default_account", orig_default)
			if res.get("message_name"):
				frappe.db.delete("WA Message", {"name": res.get("message_name")})
			frappe.db.delete("WA Account", {"name": wa_acc.name})

	def test_18_e2e_incoming_webhook_message_flow(self):
		"""Verify end-to-end incoming webhook payload automatically links to Lead via before_insert."""
		from whatsapp.whatsapp.webhook import _create_incoming_message

		wa_acc = frappe.get_doc(
			{
				"doctype": "WA Account",
				"account_name": f"_Test WA Acc {frappe.generate_hash(length=6)}",
				"status": "Active",
				"phone_id": "test_phone_id_e2e",
				"business_id": "test_biz_e2e",
				"app_id": "test_app_e2e",
				"access_token": "mock_token_e2e",
			}
		).insert(ignore_permissions=True)

		try:
			current_epoch = int(now_datetime().timestamp())
			mock_msg = {
				"id": "wamid.e2e.in.1",
				"from": "919876543210",
				"type": "text",
				"text": {"body": "Incoming test message from lead"},
				"timestamp": str(current_epoch),
			}
			_create_incoming_message(mock_msg, wa_acc.name, {"name": "Test Lead Profile"})

			msg_name = frappe.db.get_value("WA Message", {"message_id": "wamid.e2e.in.1"}, "name")
			self.assertIsNotNone(msg_name)
			in_doc = frappe.get_doc("WA Message", msg_name)
			self.assertEqual(in_doc.direction, "Incoming")
			self.assertEqual(in_doc.docstatus, 1)
			self.assertEqual(in_doc.reference_doctype, "Lead")
			self.assertEqual(in_doc.reference_docname, self.test_lead.name)
			self.assertEqual(in_doc.message, "Incoming test message from lead")
		finally:
			frappe.db.delete("WA Message", {"message_id": "wamid.e2e.in.1"})
			frappe.db.delete("WA Account", {"name": wa_acc.name})

	def test_19_e2e_status_update_and_conversation_retrieval(self):
		"""Verify incoming message opens 24h session, status updates work, and conversations are retrieved."""
		from whatsapp.whatsapp.webhook import _create_incoming_message, _update_message_status

		wa_acc = frappe.get_doc(
			{
				"doctype": "WA Account",
				"account_name": f"_Test WA Acc {frappe.generate_hash(length=6)}",
				"status": "Active",
				"phone_id": "test_phone_id_e2e",
				"business_id": "test_biz_e2e",
				"app_id": "test_app_e2e",
				"access_token": "mock_token_e2e",
			}
		).insert(ignore_permissions=True)
		orig_default = frappe.db.get_single_value("WA Settings", "default_account")
		frappe.db.set_single_value("WA Settings", "default_account", wa_acc.name)

		try:
			# 1. Simulate incoming message from Client's phone (Client priority)
			current_epoch = int(now_datetime().timestamp())
			mock_msg = {
				"id": "wamid.e2e.client.1",
				"from": "919876500000",
				"type": "text",
				"text": {"body": "Client request for advisory"},
				"timestamp": str(current_epoch),
			}
			_create_incoming_message(mock_msg, wa_acc.name, {"name": "Client User"})

			client_msg_name = frappe.db.get_value("WA Message", {"message_id": "wamid.e2e.client.1"}, "name")
			self.assertIsNotNone(client_msg_name)
			client_doc = frappe.get_doc("WA Message", client_msg_name)
			self.assertEqual(client_doc.reference_doctype, "Client")
			self.assertEqual(client_doc.reference_docname, self.test_client.name)

			# 2. Simulate webhook status updates
			_update_message_status(
				{"id": "wamid.e2e.client.1", "status": "delivered", "timestamp": str(current_epoch + 5)},
				wa_acc.name,
			)
			client_doc.reload()
			self.assertEqual(client_doc.status, "Delivered")

			_update_message_status(
				{"id": "wamid.e2e.client.1", "status": "read", "timestamp": str(current_epoch + 10)},
				wa_acc.name,
			)
			client_doc.reload()
			self.assertEqual(client_doc.status, "Read")

			# 3. Retrieve conversation history via adapter API
			conv = get_crm_whatsapp_conversations("Client", self.test_client.name)
			self.assertTrue(conv["is_session_active"])
			self.assertIsNotNone(conv["session_expires_at"])
			self.assertTrue(conv["provider_configured"])
			self.assertGreaterEqual(conv["total_count"], 1)

			inbound_items = [m for m in conv["messages"] if m["name"] == client_msg_name]
			self.assertEqual(len(inbound_items), 1)
			self.assertEqual(inbound_items[0]["direction"], "Inbound")
			self.assertEqual(inbound_items[0]["status"], "Read")
		finally:
			frappe.db.set_single_value("WA Settings", "default_account", orig_default)
			frappe.db.delete("WA Message", {"message_id": "wamid.e2e.client.1"})
			frappe.db.delete("WA Account", {"name": wa_acc.name})


