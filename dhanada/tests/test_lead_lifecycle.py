# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import smtplib
import socket
from unittest.mock import MagicMock, patch

import frappe
from frappe.tests.utils import FrappeTestCase

from dhanada.lifecycle.api import (
	convert_lead_to_client,
	get_lead_lifecycle_status,
	mark_lead_junk,
	on_email_queue_update,
	send_onboarding_and_risk_profiler,
	send_risk_profiler,
	send_welcome_message,
	submit_client_onboarding,
	submit_risk_profile_for_lead,
	sync_lead_email_status,
	update_lead_interest,
)
from dhanada.setup.bootstrap import ensure_master_data


def get_mock_email_account():
	account = MagicMock()
	account.name = "KNAPS Outgoing Mail"
	return account


class TestLeadLifecycle(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")
		ensure_master_data()
		self.test_leads = []
		self.test_clients = []
		frappe.local.form_dict = frappe._dict()
		frappe.local.request = None
		frappe.local.request_ip = None

	def tearDown(self):
		frappe.set_user("Administrator")
		for lead_name in getattr(self, "test_leads", []):
			if frappe.db.exists("Lead", lead_name):
				frappe.db.delete("Client Onboarding Submission", {"lead": lead_name})
				frappe.db.delete("Risk Profiler Submission", {"lead": lead_name})
				frappe.db.delete("Lead", lead_name)
		for client_name in getattr(self, "test_clients", []):
			if frappe.db.exists("Client", client_name):
				frappe.db.delete("Client", client_name)
		frappe.db.commit()
		frappe.local.request = None
		frappe.local.request_ip = None

	def create_test_lead(
		self,
		first_name="Test",
		last_name="Lead",
		mobile="+919876543210",
		email="testlead@example.com",
		status="New",
	):
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"first_name": first_name,
				"last_name": last_name,
				"lead_name": f"{first_name} {last_name}".strip(),
				"mobile_no": mobile,
				"email": email,
				"status": status,
				"source": "Website",
				"assigned_to": "Administrator",
			}
		)
		lead.insert(ignore_permissions=True)
		self.test_leads.append(lead.name)
		return lead

	# =========================================================================
	# 1. SEND WELCOME MESSAGE TESTS
	# =========================================================================

	def test_welcome_message_fails_when_no_outgoing_email_account(self):
		lead = self.create_test_lead()
		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=None):
			with self.assertRaises(frappe.OutgoingEmailError):
				send_welcome_message(lead.name)

	def test_welcome_message_fails_on_invalid_email(self):
		lead = self.create_test_lead(email="")
		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with self.assertRaises(frappe.ValidationError):
				send_welcome_message(lead.name)

	def test_welcome_message_fails_on_malformed_email(self):
		lead = self.create_test_lead(email="valid@example.com")
		frappe.db.set_value("Lead", lead.name, "email", "notanemailaddress")
		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with self.assertRaises(frappe.ValidationError):
				send_welcome_message(lead.name)

	def test_welcome_message_unauthorized_user_fails(self):
		lead = self.create_test_lead()
		frappe.set_user("Guest")
		with self.assertRaises(frappe.PermissionError):
			send_welcome_message(lead.name)

	def test_welcome_message_sending_error_handled(self):
		lead = self.create_test_lead()
		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", side_effect=Exception("SMTP Connection timed out")):
				with self.assertRaises(frappe.OutgoingEmailError):
					send_welcome_message(lead.name)

	def test_welcome_message_smtp_success_and_duplicate_prevention(self):
		lead = self.create_test_lead()
		mock_queue = MagicMock()
		mock_queue.name = "EMQ-TEST-0001"
		mock_queue.status = "Sent"

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=mock_queue) as mock_send:
				res = send_welcome_message(lead.name)
				self.assertTrue(res.get("success"))
				self.assertEqual(res.get("delivery_status"), "Sent")
				mock_send.assert_called_once()

		lead.reload()
		self.assertEqual(lead.welcome_email_status, "Sent")
		self.assertIsNotNone(lead.welcome_email_sent_on)

		# Duplicate send attempt must be blocked
		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with self.assertRaises(frappe.DuplicateEntryError):
				send_welcome_message(lead.name)

	def test_welcome_message_queued_when_smtp_pending(self):
		lead = self.create_test_lead()
		mock_queue = MagicMock()
		mock_queue.name = "EMQ-TEST-0002"
		mock_queue.status = "Not Sent"
		mock_queue.error = None

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=mock_queue):
				res = send_welcome_message(lead.name)
				self.assertTrue(res.get("success"))
				self.assertEqual(res.get("delivery_status"), "Queued")

		lead.reload()
		# Never marked as Sent merely because it was queued
		self.assertEqual(lead.welcome_email_status, "Queued")
		self.assertIsNone(lead.welcome_email_sent_on)

	def test_welcome_message_smtp_failure_allows_retry(self):
		lead = self.create_test_lead()
		mock_queue = MagicMock()
		mock_queue.name = "EMQ-TEST-0003"
		mock_queue.send.side_effect = Exception("SMTP Connection Failed")

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=mock_queue):
				with self.assertRaises(frappe.OutgoingEmailError):
					send_welcome_message(lead.name)

		lead.reload()
		self.assertEqual(lead.welcome_email_status, "Failed")

	def test_welcome_message_retry_after_failure(self):
		"""
		Verifies the full retry lifecycle:
		1. First attempt fails in SMTP -> welcome_email_status marked Failed.
		2. User retries -> succeeds and welcome_email_status is set to Sent.
		3. Subsequent attempt -> blocked by duplicate protection.
		"""
		lead = self.create_test_lead()
		mock_queue = MagicMock()
		mock_queue.name = "EMQ-RETRY-0001"
		mock_queue.status = "Error"
		mock_queue.error = "535 Authentication Failed"
		mock_queue.send.side_effect = Exception("535 Authentication Failed")

		# 1. First attempt fails
		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=mock_queue):
				with self.assertRaises(frappe.OutgoingEmailError):
					send_welcome_message(lead.name)

		lead.reload()
		self.assertEqual(lead.welcome_email_status, "Failed")
		self.assertIsNone(lead.welcome_email_sent_on)

		# 2. Second attempt retries and succeeds
		mock_queue.status = "Sent"
		mock_queue.error = None
		mock_queue.send.side_effect = None

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=mock_queue):
				res = send_welcome_message(lead.name)
				self.assertTrue(res.get("success"))
				self.assertEqual(res.get("delivery_status"), "Sent")

		lead.reload()
		self.assertEqual(lead.welcome_email_status, "Sent")
		self.assertIsNotNone(lead.welcome_email_sent_on)

		# 3. Third attempt is blocked by duplicate protection
		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with self.assertRaises(frappe.DuplicateEntryError):
				send_welcome_message(lead.name)

	def test_welcome_message_concurrent_sending_blocked(self):
		"""Verifies that if an email is actively in-flight ('Sending'), concurrent sends are blocked."""
		lead = self.create_test_lead()
		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.db.get_value", return_value="EMQ-INFLIGHT-0001"):
				with self.assertRaises(frappe.DuplicateEntryError):
					send_welcome_message(lead.name)

	# =========================================================================
	# 2. STATUS TRANSITION TESTS
	# =========================================================================

	def test_status_transitions_interested_not_interested_and_junk(self):
		lead = self.create_test_lead()

		# Mark Interested
		res = update_lead_interest(lead.name, "Interested")
		self.assertTrue(res.get("success"))
		lead.reload()
		self.assertEqual(lead.status, "Interested")
		self.assertIsNone(lead.lost_reason)

		# Mark Not Interested
		res = update_lead_interest(lead.name, "Not Interested", reason="Client not ready")
		self.assertTrue(res.get("success"))
		lead.reload()
		self.assertEqual(lead.status, "Not Interested")
		self.assertEqual(lead.lost_reason, "Client not ready")
		self.assertEqual(lead.lost_notes, "Client not ready")

		# Mark Junk
		res_junk = mark_lead_junk(lead.name, reason="Spam submission")
		self.assertTrue(res_junk.get("success"))
		lead.reload()
		self.assertEqual(lead.status, "Junk")
		self.assertEqual(lead.lost_reason, "Spam submission")
		self.assertEqual(lead.lost_notes, "Spam submission")

	def test_unauthorized_status_transition(self):
		lead = self.create_test_lead()
		frappe.set_user("Guest")
		with self.assertRaises(frappe.PermissionError):
			update_lead_interest(lead.name, "Interested")

	def test_cannot_modify_status_of_already_converted_lead(self):
		client = frappe.get_doc(
			{
				"doctype": "Client",
				"first_name": "Existing",
				"last_name": "Client",
				"client_name": "Existing Client",
				"email": "client@example.com",
				"mobile_no": "9876543299",
				"pan": "ABCDE1111A",
				"pan_verification_status": "Verified",
				"client_owner": "Administrator",
			}
		).insert(ignore_permissions=True)
		self.test_clients.append(client.name)

		lead = self.create_test_lead()
		frappe.db.set_value(
			"Lead",
			lead.name,
			{
				"converted_client": client.name,
				"status": "Converted",
			},
		)
		lead.reload()

		with self.assertRaises(frappe.ValidationError):
			update_lead_interest(lead.name, "Interested")

	def test_cannot_manually_set_converted_status_without_client(self):
		lead = self.create_test_lead()
		lead.status = "Converted"
		with self.assertRaises(frappe.ValidationError):
			lead.save(ignore_permissions=True)

	def test_status_not_interested_and_junk_automatically_sets_lost_reason(self):
		lead = self.create_test_lead()
		lead.status = "Not Interested"
		lead.save(ignore_permissions=True)
		lead.reload()
		self.assertEqual(lead.lost_reason, "Not interested")

		lead.status = "Junk"
		lead.lost_reason = None
		lead.save(ignore_permissions=True)
		lead.reload()
		self.assertEqual(lead.lost_reason, "Junk")

	def test_status_history_logging(self):
		"""Verify transitions record in Lead Status Log child table."""
		lead = self.create_test_lead(status="New")
		update_lead_interest(lead.name, "Interested")
		update_lead_interest(lead.name, "Not Interested", reason="Budget constraint")

		lead.reload()
		self.assertTrue(len(lead.status_history) >= 2)
		statuses = [(row.from_status, row.to_status) for row in lead.status_history]
		self.assertIn(("New", "Interested"), statuses)
		self.assertIn(("Interested", "Not Interested"), statuses)

	# =========================================================================
	# 3. ONBOARDING & RISK PROFILER DISPATCH TESTS
	# =========================================================================

	def test_send_onboarding_fails_if_not_interested_or_nurturing(self):
		lead = self.create_test_lead(status="New")
		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with self.assertRaises(frappe.ValidationError):
				send_onboarding_and_risk_profiler(lead.name)

	def test_send_onboarding_fails_if_no_outgoing_email_account(self):
		lead = self.create_test_lead()
		update_lead_interest(lead.name, "Interested")
		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=None):
			with self.assertRaises(frappe.OutgoingEmailError):
				send_onboarding_and_risk_profiler(lead.name)

	def test_send_onboarding_and_risk_profiler_success(self):
		lead = self.create_test_lead()
		update_lead_interest(lead.name, "Interested")

		mock_queue = MagicMock()
		mock_queue.name = "EMQ-TEST-0002"

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=mock_queue) as mock_send:
				res = send_onboarding_and_risk_profiler(lead.name)
				self.assertTrue(res.get("success"))
				self.assertEqual(res.get("delivery_status"), "Queued")
				mock_send.assert_called_once()

		self.assertTrue("onboarding_url" in res)
		self.assertTrue("risk_profiler_url" in res)
		# Ensure URLs do not contain PAN or phone numbers
		self.assertNotIn(lead.mobile_no, res["onboarding_url"])
		self.assertNotIn("ABCDE", res["onboarding_url"])

		lead.reload()
		self.assertEqual(lead.status, "Nurturing")
		self.assertEqual(lead.onboarding_status, "Sent")
		self.assertEqual(lead.risk_profiler_status, "Sent")
		self.assertTrue(bool(lead.onboarding_token))

		# Verify token association in submissions
		token = lead.onboarding_token
		self.assertTrue(frappe.db.exists("Client Onboarding Submission", {"token": token, "lead": lead.name}))
		self.assertTrue(frappe.db.exists("Risk Profiler Submission", {"token": token, "lead": lead.name}))

	# =========================================================================
	# 4. SUBMISSION VALIDATION TESTS
	# =========================================================================

	def test_onboarding_submission_validation(self):
		lead = self.create_test_lead()
		update_lead_interest(lead.name, "Interested")

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=MagicMock()):
				res = send_onboarding_and_risk_profiler(lead.name)
		token = res.get("token")

		# Invalid PAN
		with self.assertRaises(frappe.ValidationError):
			submit_client_onboarding(
				token,
				{
					"full_name": "Test Lead",
					"pan": "INVALIDPAN",
					"email": "test@example.com",
					"mobile_no": "9876543210",
				},
			)

		# Valid submission
		valid_res = submit_client_onboarding(
			token,
			{
				"full_name": "Test Lead",
				"pan": "ABCDE1234F",
				"email": "test@example.com",
				"mobile_no": "9876543210",
				"address_line1": "123 Business Bay",
				"city": "Mumbai",
				"state": "Maharashtra",
				"pincode": "400001",
				"country": "India",
			},
		)
		self.assertTrue(valid_res.get("success"))

		lead.reload()
		self.assertEqual(lead.onboarding_status, "Completed")
		self.assertIsNotNone(lead.onboarding_completed_on)

	def test_risk_profiler_submission_validation(self):
		lead = self.create_test_lead()
		update_lead_interest(lead.name, "Interested")

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=MagicMock()):
				res = send_onboarding_and_risk_profiler(lead.name)
		token = res.get("token")

		# Submit valid risk profile
		res_rp = submit_risk_profile_for_lead(
			token,
			{
				"score": 15,
				"answers": [
					{"question": "Investment Horizon", "score": 3},
					{"question": "Risk Tolerance", "score": 3},
					{"question": "Volatility Comfort", "score": 3},
					{"question": "Financial Knowledge", "score": 3},
					{"question": "Liquidity Need", "score": 3},
				],
			},
		)
		self.assertTrue(res_rp.get("success"))
		self.assertEqual(res_rp.get("risk_profile"), "Moderate")

		lead.reload()
		self.assertEqual(lead.risk_profiler_status, "Completed")
		self.assertEqual(lead.risk_profile, "Moderate")
		self.assertEqual(lead.risk_score, 15)
		self.assertIsNotNone(lead.risk_profiler_completed_on)

	# =========================================================================
	# 5. CLIENT CONVERSION TESTS
	# =========================================================================

	def test_conversion_fails_if_onboarding_missing(self):
		lead = self.create_test_lead()
		update_lead_interest(lead.name, "Interested")

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=MagicMock()):
				res = send_onboarding_and_risk_profiler(lead.name)
		token = res.get("token")

		# Submit only risk profiler
		submit_risk_profile_for_lead(token, {"score": 20})

		# Conversion must fail
		with self.assertRaises(frappe.ValidationError):
			convert_lead_to_client(lead.name)

	def test_conversion_fails_if_risk_profiler_missing(self):
		lead = self.create_test_lead()
		update_lead_interest(lead.name, "Interested")

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=MagicMock()):
				res = send_onboarding_and_risk_profiler(lead.name)
		token = res.get("token")

		# Submit only onboarding
		submit_client_onboarding(
			token,
			{
				"full_name": "Incomplete Client",
				"pan": "ABCDE5678H",
				"email": "inc@example.com",
				"mobile_no": "9876543211",
				"address_line1": "456 High Street",
				"city": "Bengaluru",
				"state": "Karnataka",
				"pincode": "560001",
			},
		)

		# Conversion must fail
		with self.assertRaises(frappe.ValidationError):
			convert_lead_to_client(lead.name)

	def test_conversion_success_creates_client_and_links_lead(self):
		lead = self.create_test_lead(
			first_name="Rohan",
			last_name="Sharma",
			mobile="9876543222",
			email="rohan@example.com",
		)
		update_lead_interest(lead.name, "Interested")

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=MagicMock()):
				res = send_onboarding_and_risk_profiler(lead.name)
		token = res.get("token")

		# Complete both
		submit_client_onboarding(
			token,
			{
				"full_name": "Rohan Sharma",
				"pan": "ABCDE9999Z",
				"email": "rohan.verified@example.com",
				"mobile_no": "+919876543222",
				"address_line1": "78 Marine Drive",
				"city": "Mumbai",
				"state": "Maharashtra",
				"pincode": "400020",
				"country": "India",
			},
		)
		submit_risk_profile_for_lead(
			token,
			{
				"score": 38,
				"risk_profile": "Aggressive",
			},
		)

		# Convert
		conv_res = convert_lead_to_client(lead.name)
		self.assertTrue(conv_res.get("success"))
		client_name = conv_res.get("client") or conv_res.get("client_name")
		self.assertTrue(bool(client_name))
		self.test_clients.append(client_name)

		# Verify Client DocType
		client = frappe.get_doc("Client", client_name)
		self.assertEqual(client.lead, lead.name)
		self.assertEqual(client.pan, "ABCDE9999Z")
		self.assertEqual(client.email, "rohan.verified@example.com")
		self.assertEqual(client.mobile_no, "9876543222")
		self.assertEqual(client.risk_profile, "Aggressive")
		self.assertEqual(client.kyc_status, "Pending")
		self.assertEqual(client.total_invested_value or 0, 0)

		# Verify Lead updates
		lead.reload()
		self.assertEqual(lead.converted_client, client_name)
		self.assertEqual(lead.status, "Converted")
		self.assertIsNotNone(lead.converted_on)

	def test_duplicate_conversion_prevention(self):
		lead = self.create_test_lead(
			first_name="Pooja",
			last_name="Verma",
			mobile="9876543233",
			email="pooja@example.com",
		)
		update_lead_interest(lead.name, "Interested")

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=MagicMock()):
				res = send_onboarding_and_risk_profiler(lead.name)
		token = res.get("token")

		submit_client_onboarding(
			token,
			{
				"full_name": "Pooja Verma",
				"pan": "ABCDE8888Y",
				"email": "pooja@example.com",
				"mobile_no": "9876543233",
				"address_line1": "12 Residency Road",
				"city": "Pune",
				"state": "Maharashtra",
				"pincode": "411001",
			},
		)
		submit_risk_profile_for_lead(token, {"score": 20})

		conv_res1 = convert_lead_to_client(lead.name)
		self.assertTrue(conv_res1.get("success"))
		client_name = conv_res1.get("client")
		self.test_clients.append(client_name)

		# Second conversion attempt is idempotent and prevents duplicate client creation
		conv_res2 = convert_lead_to_client(lead.name)
		self.assertTrue(conv_res2.get("success"))
		self.assertTrue(conv_res2.get("already_converted"))
		self.assertEqual(conv_res2.get("client"), client_name)

		# Ensure exactly 1 Client was created for this lead
		self.assertEqual(frappe.db.count("Client", {"lead": lead.name}), 1)

	def test_get_lead_lifecycle_status(self):
		lead = self.create_test_lead()
		st = get_lead_lifecycle_status(lead.name)
		self.assertIsInstance(st, dict)
		self.assertEqual(st.get("status"), "New")
		self.assertEqual(st.get("welcome_email_status"), "Not Sent")
		self.assertEqual(st.get("onboarding_status"), "Not Initiated")
		self.assertEqual(st.get("risk_profiler_status"), "Not Initiated")
		self.assertIsNone(st.get("converted_client"))

	# =========================================================================
	# 7. EMAIL AUDIT, RETRY & FAILURE HANDLING TESTS
	# =========================================================================

	def test_welcome_message_smtp_auth_failure_with_gmail_guidance(self):
		"""
		Verifies SMTP authentication failure:
		- Catches SMTPAuthenticationError (e.g. 535 Username and Password not accepted).
		- Raises frappe.OutgoingEmailError with guidance about 16-character Google App Password.
		- Persists Lead.welcome_email_status as 'Failed' (not 'Sent').
		- Guarantees subsequent retry is permitted and NOT blocked with HTTP 409 (DuplicateEntryError).
		"""
		lead = self.create_test_lead()
		mock_queue = MagicMock()
		mock_queue.name = "EMQ-AUTH-0001"
		mock_queue.send.side_effect = smtplib.SMTPAuthenticationError(
			535, b"5.7.8 Username and Password not accepted"
		)

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=mock_queue):
				with self.assertRaises(frappe.OutgoingEmailError) as ctx:
					send_welcome_message(lead.name)
				self.assertIn("Google App Password", str(ctx.exception))

		lead.reload()
		self.assertEqual(lead.welcome_email_status, "Failed")
		self.assertIsNone(lead.welcome_email_sent_on)

		# Subsequent retry after fixing password: must NOT raise DuplicateEntryError (HTTP 409)
		mock_queue.send.side_effect = None
		mock_queue.status = "Sent"
		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=mock_queue):
				res = send_welcome_message(lead.name)
				self.assertTrue(res.get("success"))
				self.assertEqual(res.get("delivery_status"), "Sent")

		lead.reload()
		self.assertEqual(lead.welcome_email_status, "Sent")
		self.assertIsNotNone(lead.welcome_email_sent_on)

	def test_welcome_message_smtp_connection_failure(self):
		"""
		Verifies SMTP connection failure:
		- Catches connection errors / timeouts.
		- Raises frappe.OutgoingEmailError with connection diagnosis.
		- Persists Lead.welcome_email_status as 'Failed'.
		- Allows immediate retry when connection is restored.
		"""
		lead = self.create_test_lead()
		mock_queue = MagicMock()
		mock_queue.name = "EMQ-CONN-0001"
		mock_queue.send.side_effect = smtplib.SMTPConnectError(111, "Connection refused")

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=mock_queue):
				with self.assertRaises(frappe.OutgoingEmailError) as ctx:
					send_welcome_message(lead.name)
				self.assertIn("Connection Failed", str(ctx.exception))

		lead.reload()
		self.assertEqual(lead.welcome_email_status, "Failed")
		self.assertIsNone(lead.welcome_email_sent_on)

	def test_welcome_message_queue_dispatch_failure(self):
		"""
		Verifies queue dispatch failure (when frappe.sendmail raises):
		- Properly catches exception, logs, and raises OutgoingEmailError.
		- Persists Lead.welcome_email_status as 'Failed'.
		- Permits clean retry.
		"""
		lead = self.create_test_lead()
		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", side_effect=Exception("Database queue insert failed")):
				with self.assertRaises(frappe.OutgoingEmailError) as ctx:
					send_welcome_message(lead.name)
				self.assertIn("Failed to dispatch welcome email", str(ctx.exception))

		lead.reload()
		self.assertEqual(lead.welcome_email_status, "Failed")

	def test_welcome_message_stale_sending_lock_resets(self):
		"""
		Verifies that an email stuck in 'Sending' longer than 120s is treated as stale,
		resets to 'Not Sent', and permits retry without raising DuplicateEntryError.
		"""
		lead = self.create_test_lead()
		stale_time = frappe.utils.add_to_date(frappe.utils.now_datetime(), minutes=-5)
		stale_queue_data = {"name": "EMQ-STALE-0001", "modified": str(stale_time)}

		mock_queue = MagicMock()
		mock_queue.name = "EMQ-STALE-0001"
		mock_queue.status = "Sent"

		orig_get_value = frappe.db.get_value

		def mock_db_get_value(*args, **kwargs):
			if args and args[0] == "Email Queue":
				if kwargs.get("as_dict") or (len(args) > 2 and isinstance(args[2], list)):
					return stale_queue_data
				return "EMQ-STALE-0001"
			return orig_get_value(*args, **kwargs)

		orig_get_doc = frappe.get_doc

		def mock_get_doc(*args, **kwargs):
			if args and args[0] == "Email Queue":
				return mock_queue
			return orig_get_doc(*args, **kwargs)

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.db.get_value", side_effect=mock_db_get_value):
				with patch("frappe.get_doc", side_effect=mock_get_doc):
					res = send_welcome_message(lead.name)
					self.assertTrue(res.get("success"))
					self.assertEqual(res.get("delivery_status"), "Sent")

	def test_welcome_message_syncs_status_with_email_queue(self):
		"""
		Verifies sync_lead_email_status synchronizes Lead status with Email Queue:
		- When Email Queue is 'Sent', marks Lead 'Sent'.
		- When Email Queue is 'Error', marks Lead 'Failed'.
		"""
		lead = self.create_test_lead()
		lead.welcome_email_status = "Queued"
		lead.save()

		orig_get_value = frappe.db.get_value

		# Case 1: Email Queue transitioned to Sent by background worker
		def mock_queue_sent(*args, **kwargs):
			if args and args[0] == "Email Queue":
				return {"name": "EMQ-001", "status": "Sent", "modified": frappe.utils.now_datetime()}
			return orig_get_value(*args, **kwargs)

		with patch("frappe.db.get_value", side_effect=mock_queue_sent):
			sync_lead_email_status(lead)
			lead.reload()
			self.assertEqual(lead.welcome_email_status, "Sent")
			self.assertIsNotNone(lead.welcome_email_sent_on)

		# Case 2: Email Queue transitioned to Error
		lead.welcome_email_status = "Queued"
		lead.welcome_email_sent_on = None
		lead.save()

		def mock_queue_error(*args, **kwargs):
			if args and args[0] == "Email Queue":
				return {"name": "EMQ-002", "status": "Error", "modified": frappe.utils.now_datetime()}
			return orig_get_value(*args, **kwargs)

		with patch("frappe.db.get_value", side_effect=mock_queue_error):
			sync_lead_email_status(lead)
			lead.reload()
			self.assertEqual(lead.welcome_email_status, "Failed")

	def test_doc_events_on_email_queue_update(self):
		"""Verifies doc_events on_email_queue_update updates native Lead."""
		lead = self.create_test_lead()
		lead.welcome_email_status = "Queued"
		lead.save()

		orig_get_value = frappe.db.get_value

		def mock_queue_sent(*args, **kwargs):
			if args and args[0] == "Email Queue":
				return {"name": "EMQ-HOOK-001", "status": "Sent", "modified": frappe.utils.now_datetime()}
			return orig_get_value(*args, **kwargs)

		eq_doc = frappe._dict(
			{
				"doctype": "Email Queue",
				"name": "EMQ-HOOK-001",
				"reference_doctype": "Lead",
				"reference_name": lead.name,
				"status": "Sent",
				"modified": frappe.utils.now_datetime(),
				"message": "KNAPS Lead Welcome Email",
			}
		)
		with patch("frappe.db.get_value", side_effect=mock_queue_sent):
			on_email_queue_update(eq_doc)

		lead.reload()
		self.assertEqual(lead.welcome_email_status, "Sent")

	def test_onboarding_resend_preserves_completed_status(self):
		"""
		Verifies that if Onboarding submission is already Completed, resending
		onboarding links updates Lead status to Nurturing but preserves onboarding_status as 'Completed'.
		"""
		lead = self.create_test_lead()
		update_lead_interest(lead.name, "Interested")
		lead.reload()
		lead.onboarding_status = "Completed"
		lead.risk_profiler_status = "Not Initiated"
		lead.save()

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=MagicMock()):
				res = send_onboarding_and_risk_profiler(lead.name)
				self.assertTrue(res.get("success"))

		lead.reload()
		# onboarding_status must remain Completed, NOT overwritten to Sent
		self.assertEqual(lead.onboarding_status, "Completed")
		self.assertEqual(lead.risk_profiler_status, "Sent")
		self.assertEqual(lead.status, "Nurturing")

	def test_onboarding_and_risk_profiler_smtp_failure(self):
		"""
		Verifies that if SMTP transmission fails during onboarding dispatch,
		OutgoingEmailError is raised and submissions remain clean.
		"""
		lead = self.create_test_lead()
		update_lead_interest(lead.name, "Interested")

		mock_queue = MagicMock()
		mock_queue.name = "EMQ-OB-FAIL"
		mock_queue.send.side_effect = smtplib.SMTPAuthenticationError(535, b"Auth failed")

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", return_value=mock_queue):
				with self.assertRaises(frappe.OutgoingEmailError) as ctx:
					send_onboarding_and_risk_profiler(lead.name)
				self.assertIn("Google App Password", str(ctx.exception))

	def test_simplified_lead_form_visible_and_hidden_fields(self):
		"""
		Verify that only basic lead management fields are visible on the Lead form,
		and that all 15 audit fields are retained in the schema/DB but hidden.
		"""
		meta = frappe.get_meta("Lead")
		fields_dict = {f.fieldname: f for f in meta.fields}

		# 1. Essential Visible Fields
		visible_fields = [
			"lead_name",
			"first_name",
			"last_name",
			"lead_type",
			"status",
			"email",
			"mobile_no",
			"source",
			"product_interest",
			"notes",
		]
		for fname in visible_fields:
			self.assertIn(fname, fields_dict, f"Field '{fname}' must exist in Lead DocType")
			self.assertFalse(
				fields_dict[fname].hidden, f"Field '{fname}' must be visible on the ordinary form"
			)

		# 2. Audit Fields Retained Internally But Hidden from Ordinary Form
		hidden_fields = [
			"source_detail",
			"status_history",
			"investment_horizon",
			"investment_amount_range",
			"assigned_to",
			"risk_profile",
			"converted_client",
			"salutation",
			"city",
			"country",
			"alternate_mobile_no",
			"lost_reason",
			"lost_notes",
			"conversation_url",
			"onboarding_token",
			"risk_profiler_token",
		]
		for fname in hidden_fields:
			self.assertIn(fname, fields_dict, f"Audit field '{fname}' must exist in Lead DocType")
			self.assertTrue(
				fields_dict[fname].hidden, f"Audit field '{fname}' must be hidden from ordinary form"
			)

		# 3. Verify hidden fields are fully functional in backend operations
		lead = self.create_test_lead()
		lead.city = "Mumbai"
		lead.country = "India"
		lead.investment_horizon = "Long Term (3-5 years)"
		lead.investment_amount_range = "₹50 Lakhs - ₹1 Crore"
		lead.save()
		lead.reload()

		self.assertEqual(lead.city, "Mumbai")
		self.assertEqual(lead.country, "India")
		self.assertEqual(lead.investment_horizon, "Long Term (3-5 years)")
		self.assertEqual(lead.investment_amount_range, "₹50 Lakhs - ₹1 Crore")

	def test_welcome_mail_button_visibility_and_list_action_behavior(self):
		"""
		Verifies the lifecycle state conditions that govern form button visibility
		and row-level list action formatting.
		"""
		lead = self.create_test_lead()

		# Case A: Not Sent -> Action available
		self.assertEqual(lead.welcome_email_status, "Not Sent")
		# Form: Button 1 shown with 'Send Welcome Mail'
		show_form_btn = (
			lead.status != "Converted"
			and lead.status not in ("Not Interested", "Junk")
			and lead.welcome_email_status != "Sent"
		)
		self.assertTrue(show_form_btn)

		# Case B: Sent -> Form button HIDDEN, list action disabled
		lead.welcome_email_status = "Sent"
		lead.welcome_email_sent_on = frappe.utils.now_datetime()
		lead.save()
		lead.reload()

		show_form_btn_after_sent = (
			lead.status != "Converted"
			and lead.status not in ("Not Interested", "Junk")
			and lead.welcome_email_status != "Sent"
		)
		self.assertFalse(
			show_form_btn_after_sent, "Send Welcome Mail button must be hidden on form once Sent"
		)

		# Case C: Failed -> Form button allows retry, list action allows retry
		lead.welcome_email_status = "Failed"
		lead.save()
		lead.reload()

		show_form_btn_failed = (
			lead.status != "Converted"
			and lead.status not in ("Not Interested", "Junk")
			and lead.welcome_email_status != "Sent"
		)
		self.assertTrue(
			show_form_btn_failed, "Send Welcome Mail button must be available for retry on failure"
		)

	def test_onboarding_form_link_placeholder_safety(self):
		"""
		Verifies that the Onboarding Form Link placeholder action does not dispatch emails,
		does not generate tokens prematurely, and leaves lead state unaffected.
		"""
		lead = self.create_test_lead()
		orig_onboarding_token = lead.onboarding_token
		orig_risk_token = lead.risk_profiler_token
		orig_status = lead.status

		# The placeholder action only shows an informative message without mutating Lead
		lead.reload()
		self.assertEqual(lead.onboarding_token, orig_onboarding_token)
		self.assertEqual(lead.risk_profiler_token, orig_risk_token)
		self.assertEqual(lead.status, orig_status)
		self.assertEqual(lead.onboarding_status, "Not Initiated")
		self.assertEqual(lead.risk_profiler_status, "Not Initiated")

	def test_send_risk_profiler_success(self):
		"""
		Verifies send_risk_profiler sends the email with requested template and updates lead status to Sent.
		"""
		lead = self.create_test_lead()
		mock_sendmail = MagicMock()
		mock_queue = MagicMock()
		mock_queue.name = "EMQ-RP-101"
		mock_queue.status = "Sent"
		mock_sendmail.return_value = mock_queue

		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()):
			with patch("frappe.sendmail", mock_sendmail):
				res = send_risk_profiler(lead.name)
				self.assertEqual(res.get("status"), "success")
				self.assertTrue("risk_profiler_url" in res)
				self.assertEqual(res.get("risk_profiler_url"), "https://dev.knaps.app/sif")

				# Verify sendmail arguments
				mock_sendmail.assert_called_once()
				call_kwargs = mock_sendmail.call_args[1]
				self.assertEqual(call_kwargs["subject"], "Complete Your Risk Profile")
				self.assertIn("Complete Your Risk Profile", call_kwargs["subject"])
				self.assertIn(
					"Please complete your Risk Profiler form using the link below:", call_kwargs["content"]
				)
				self.assertIn(res["risk_profiler_url"], call_kwargs["content"])
				self.assertIn("Team KNAPS", call_kwargs["content"])

		lead.reload()
		self.assertEqual(lead.risk_profiler_status, "Sent")
		self.assertIsNotNone(lead.risk_profiler_token)

	def test_send_risk_profiler_configurable_url(self):
		"""
		Verifies profiler_url is configurable via frappe.conf without hardcoding.
		"""
		lead = self.create_test_lead()
		custom_url = "https://knaps.in/custom-risk-profiler"
		with patch.dict(frappe.conf, {"risk_profiler_url": custom_url}):
			with patch(
				"dhanada.lifecycle.api.get_outgoing_email_account", return_value=get_mock_email_account()
			):
				with patch("frappe.sendmail", return_value=MagicMock()):
					res = send_risk_profiler(lead.name)
					self.assertIn("knaps.in/custom-risk-profiler", res.get("risk_profiler_url"))

	def test_send_risk_profiler_validations(self):
		"""
		Verifies validations: missing lead, invalid email, no outgoing account.
		"""
		# 1. Non-existent lead
		with self.assertRaises(frappe.DoesNotExistError):
			send_risk_profiler("NON-EXISTENT-LEAD-999")

		# 2. Missing email
		lead = self.create_test_lead()
		lead.email = ""
		lead.save()
		with self.assertRaises(frappe.ValidationError):
			send_risk_profiler(lead.name)

		# 3. No outgoing email account
		lead.email = "investor@example.com"
		lead.save()
		with patch("dhanada.lifecycle.api.get_outgoing_email_account", return_value=None):
			with self.assertRaises(frappe.OutgoingEmailError):
				send_risk_profiler(lead.name)
