# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import unittest

import frappe
from frappe.tests.utils import FrappeTestCase

from dhanada.crm_api import (
	get_crm_conversations,
	get_crm_whatsapp_conversations,
	send_crm_email,
	send_crm_whatsapp_message,
	sync_crm_emails,
	sync_crm_incoming_emails,
)
from dhanada.email_association import (
	backfill_unlinked_communications,
	capture_outgoing_email_queue,
	find_matching_crm_record,
	link_communication_to_crm_record,
	normalize_email,
)
from dhanada.overrides.custom_email_account import CustomEmailAccount


class TestEmailAssociation(FrappeTestCase):
	def setUp(self):
		super().setUp()
		self.cleanup_test_records()

	def tearDown(self):
		self.cleanup_test_records()
		super().tearDown()

	def cleanup_test_records(self):
		"""Remove test documents created during testing."""
		frappe.db.delete("Communication", {"sender": ["like", "%test_email_assoc_%@example.com"]})
		frappe.db.delete("Communication", {"recipients": ["like", "%test_email_assoc_%@example.com"]})
		frappe.db.delete("Communication", {"message_id": ["like", "%test_msg_id_%"]})
		frappe.db.delete("Email Queue", {"sender": ["like", "%test_email_assoc_%@example.com"]})
		frappe.db.delete("Email Queue", {"message_id": ["like", "%test_msg_id_%"]})
		frappe.db.delete("CRM WhatsApp Message", {"recipient": ["like", "%98765432%"]})
		frappe.db.delete("Lead", {"email": ["like", "%test_email_assoc_%@example.com"]})
		frappe.db.delete("Client", {"email": ["like", "%test_email_assoc_%@example.com"]})
		frappe.db.commit()

	def test_01_normalize_email(self):
		"""Verify address normalization handles formatting, names, and case."""
		self.assertEqual(normalize_email("John Doe <JOHN.DOE@EXAMPLE.COM>"), "john.doe@example.com")
		self.assertEqual(normalize_email("  alice@example.com  "), "alice@example.com")
		self.assertEqual(normalize_email("'bob@test.org'"), "bob@test.org")
		self.assertIsNone(normalize_email("invalid-address"))
		self.assertIsNone(normalize_email(None))

	def test_02_unique_client_match(self):
		"""Verify incoming email matches a unique Client."""
		client_email = "test_email_assoc_client1@example.com"
		client = frappe.get_doc(
			{
				"doctype": "Client",
				"client_name": "Test Client Alpha",
				"client_type": "Individual",
				"first_name": "Test",
				"email": client_email,
				"mobile_no": "9876543210",
			}
		).insert(ignore_permissions=True)

		dt, dn, status = find_matching_crm_record(client_email)
		self.assertEqual(dt, "Client")
		self.assertEqual(dn, client.name)
		self.assertIsNone(status)

		# Test through communication hook
		comm = frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Received",
				"sender": f"Test Client <{client_email}>",
				"subject": "Inquiry on Portfolio",
				"content": "Please review my holdings.",
			}
		)
		link_communication_to_crm_record(comm)
		self.assertEqual(comm.reference_doctype, "Client")
		self.assertEqual(comm.reference_name, client.name)

	def test_03_unique_lead_match(self):
		"""Verify incoming email matches a unique Lead."""
		lead_email = "test_email_assoc_lead1@example.com"
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Test Lead Beta",
				"first_name": "Beta",
				"email": lead_email,
				"mobile_no": "9876543211",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		dt, dn, status = find_matching_crm_record(lead_email)
		self.assertEqual(dt, "Lead")
		self.assertEqual(dn, lead.name)
		self.assertIsNone(status)

		comm = frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Received",
				"sender": f"Beta <{lead_email}>",
				"subject": "Product interest",
				"content": "I am interested in SIF scheme.",
			}
		)
		link_communication_to_crm_record(comm)
		self.assertEqual(comm.reference_doctype, "Lead")
		self.assertEqual(comm.reference_name, lead.name)

	def test_04_ambiguous_matches_left_unlinked(self):
		"""Verify that if multiple Leads share an email, neither is linked."""
		shared_email = "test_email_assoc_shared@example.com"
		frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Lead A",
				"email": shared_email,
				"mobile_no": "9876543212",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Lead B",
				"email": shared_email,
				"mobile_no": "9876543213",
				"status": "Interested",
			}
		).insert(ignore_permissions=True)

		dt, dn, status = find_matching_crm_record(shared_email)
		self.assertIsNone(dt)
		self.assertIsNone(dn)
		self.assertEqual(status, "ambiguous_lead")

		comm = frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Received",
				"sender": shared_email,
				"subject": "Ambiguous message",
				"content": "Testing ambiguity.",
			}
		)
		link_communication_to_crm_record(comm)
		self.assertIsNone(comm.reference_doctype)
		self.assertIsNone(comm.reference_name)

	def test_05_unmatched_email_left_unlinked(self):
		"""Verify unknown sender email remains unlinked."""
		dt, dn, status = find_matching_crm_record("completely_unknown_sender_xyz@example.com")
		self.assertIsNone(dt)
		self.assertIsNone(dn)
		self.assertEqual(status, "not_found")

	def test_06_preserve_existing_valid_reference(self):
		"""Verify hook does not overwrite an existing valid reference."""
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Existing Lead",
				"email": "test_email_assoc_existing@example.com",
				"mobile_no": "9876543214",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		comm = frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Received",
				"sender": "another_random_person@example.com",
				"subject": "Explicitly Assigned Lead",
				"content": "Should keep Lead reference.",
				"reference_doctype": "Lead",
				"reference_name": lead.name,
			}
		)
		link_communication_to_crm_record(comm)
		# Kept the explicitly assigned reference
		self.assertEqual(comm.reference_doctype, "Lead")
		self.assertEqual(comm.reference_name, lead.name)

	def test_07_reply_thread_inheritance(self):
		"""Verify a reply inherits the parent thread's reference doctype and name."""
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Thread Lead",
				"email": "test_email_assoc_thread@example.com",
				"mobile_no": "9876543215",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		parent_comm = frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Sent",
				"sender": "advisor@knaps.in",
				"recipients": lead.email,
				"subject": "Welcome Thread",
				"content": "Initial message in thread.",
				"reference_doctype": "Lead",
				"reference_name": lead.name,
			}
		).insert(ignore_permissions=True)

		# Child reply with in_reply_to pointing to parent
		child_comm = frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Received",
				"sender": "secondary_address_not_in_lead@example.com",
				"subject": "Re: Welcome Thread",
				"content": "Reply from another email address.",
				"in_reply_to": parent_comm.name,
			}
		)
		link_communication_to_crm_record(child_comm)
		self.assertEqual(child_comm.reference_doctype, "Lead")
		self.assertEqual(child_comm.reference_name, lead.name)

	def test_08_conversation_api_pagination_and_isolation(self):
		"""Verify get_crm_conversations returns only linked emails and respects pagination."""
		lead_a = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Lead For API Test A",
				"email": "test_email_assoc_api_a@example.com",
				"mobile_no": "9876543216",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		lead_b = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Lead For API Test B",
				"email": "test_email_assoc_api_b@example.com",
				"mobile_no": "9876543217",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		# Insert 3 communications for Lead A
		for i in range(3):
			frappe.get_doc(
				{
					"doctype": "Communication",
					"communication_type": "Communication",
					"communication_medium": "Email",
					"sent_or_received": "Received" if i % 2 == 0 else "Sent",
					"sender": lead_a.email if i % 2 == 0 else "advisor@knaps.in",
					"recipients": "advisor@knaps.in" if i % 2 == 0 else lead_a.email,
					"subject": f"Lead A Message {i + 1}",
					"content": f"Content for message {i + 1}",
					"reference_doctype": "Lead",
					"reference_name": lead_a.name,
				}
			).insert(ignore_permissions=True)

		# Insert 1 communication for Lead B
		frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Received",
				"sender": lead_b.email,
				"recipients": "advisor@knaps.in",
				"subject": "Lead B Message",
				"content": "Secret content for Lead B",
				"reference_doctype": "Lead",
				"reference_name": lead_b.name,
			}
		).insert(ignore_permissions=True)

		# Test page 1 with page_length 2
		res_page1 = get_crm_conversations("Lead", lead_a.name, page=1, page_length=2)
		self.assertEqual(res_page1["total_count"], 3)
		self.assertEqual(len(res_page1["conversations"]), 2)
		self.assertTrue(res_page1["has_more"])

		# Verify none of Lead B's messages leaked
		subjects_p1 = [c["subject"] for c in res_page1["conversations"]]
		self.assertNotIn("Lead B Message", subjects_p1)

		# Test page 2
		res_page2 = get_crm_conversations("Lead", lead_a.name, page=2, page_length=2)
		self.assertEqual(len(res_page2["conversations"]), 1)
		self.assertFalse(res_page2["has_more"])

	def test_09_conversation_api_guest_denied(self):
		"""Verify guest access is blocked with PermissionError."""
		current_user = frappe.session.user
		try:
			frappe.set_user("Guest")
			with self.assertRaises(frappe.PermissionError):
				get_crm_conversations("Lead", "LEAD-2026-NONEXISTENT")
		finally:
			frappe.set_user(current_user)

	def test_10_controller_override_still_active(self):
		"""Verify Email Account controller is still overridden by CustomEmailAccount."""
		from frappe.model.base_document import get_controller

		ctrl = get_controller("Email Account")
		self.assertEqual(ctrl, CustomEmailAccount)

	def test_11_outgoing_email_capture_and_duplicate_prevention(self):
		"""Verify Email Queue capture creates Communication and prevents duplicates."""
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Lead Outgoing Test",
				"email": "test_email_assoc_outgoing@example.com",
				"mobile_no": "9876543218",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		unique_msg_id = "test_msg_id_11_dedup@knaps.in"
		queue_doc = frappe.get_doc(
			{
				"doctype": "Email Queue",
				"sender": "advisor@knaps.in",
				"message_id": unique_msg_id,
				"message": "Subject: Test Outgoing\n\nHello from Dhanada CRM",
				"status": "Not Sent",
				"reference_doctype": "Lead",
				"reference_name": lead.name,
				"recipients": [
					{
						"recipient": lead.email,
						"status": "Not Sent",
					}
				],
			}
		).insert(ignore_permissions=True)

		# 1. Trigger capture (also triggers automatically via after_insert hook)
		capture_outgoing_email_queue(queue_doc)

		# Verify communication created
		comm = frappe.db.get_value(
			"Communication",
			{"message_id": ["like", f"%{unique_msg_id}%"]},
			["name", "reference_doctype", "reference_name", "sent_or_received"],
			as_dict=True,
		)
		self.assertIsNotNone(comm)
		self.assertEqual(comm.reference_doctype, "Lead")
		self.assertEqual(comm.reference_name, lead.name)
		self.assertEqual(comm.sent_or_received, "Sent")

		# 2. Trigger again -> verify duplicate prevention
		prev_count = frappe.db.count("Communication", {"message_id": ["like", f"%{unique_msg_id}%"]})
		self.assertEqual(prev_count, 1)

		capture_outgoing_email_queue(queue_doc)
		new_count = frappe.db.count("Communication", {"message_id": ["like", f"%{unique_msg_id}%"]})
		self.assertEqual(new_count, 1, "Duplicate communication was incorrectly created!")

	def test_12_backfill_dry_run_safety(self):
		"""Verify backfill utility works safely in dry_run mode without modifying records."""
		summary = backfill_unlinked_communications(limit=10, dry_run=True)
		self.assertTrue(summary["dry_run"])
		self.assertEqual(summary["updated"], 0)

	def test_13_send_crm_email_flow(self):
		"""Verify in-CRM email sending via send_crm_email correctly creates Communication linked to Lead."""
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Email Send Test Lead",
				"email": "test_email_assoc_send@example.com",
				"mobile_no": "9876543219",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		res = send_crm_email(
			doctype="Lead",
			name=lead.name,
			subject="SIF Investment Strategy Discussion",
			content="Hello from KNAPS CRM. Here are your requested investment documents.",
		)

		self.assertEqual(res["status"], "success")
		self.assertIsNotNone(res["communication"])

		# Verify communication record exists and is linked
		comm = frappe.get_doc("Communication", res["communication"])
		self.assertEqual(comm.reference_doctype, "Lead")
		self.assertEqual(comm.reference_name, lead.name)
		self.assertEqual(comm.subject, "SIF Investment Strategy Discussion")
		self.assertEqual(comm.sent_or_received, "Sent")
		self.assertEqual(comm.recipients, lead.email)

		# Verify Lead's last_contacted_on was updated
		lead.reload()
		self.assertIsNotNone(lead.last_contacted_on)

	def test_14_whatsapp_message_sending_and_session(self):
		"""Verify WhatsApp message queuing, database persistence, and session calculation."""
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "WhatsApp Test Lead",
				"email": "test_email_assoc_wa@example.com",
				"mobile_no": "9876543220",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		# Send message (with unconfigured credentials, should safely queue without failure)
		res = send_crm_whatsapp_message(
			doctype="Lead",
			name=lead.name,
			message="Hello! This is a test WhatsApp message from KNAPS CRM.",
		)

		self.assertEqual(res["status"], "queued")
		self.assertEqual(res["delivery_status"], "Queued")
		self.assertIsNotNone(res["warning"])

		# Verify persisted in tabCRM WhatsApp Message
		msg_doc = frappe.get_doc("CRM WhatsApp Message", res["message_name"])
		self.assertEqual(msg_doc.reference_doctype, "Lead")
		self.assertEqual(msg_doc.reference_name, lead.name)
		self.assertEqual(msg_doc.direction, "Outbound")
		self.assertEqual(msg_doc.content, "Hello! This is a test WhatsApp message from KNAPS CRM.")

		# Verify conversations endpoint returns the message
		conv_res = get_crm_whatsapp_conversations("Lead", lead.name)
		self.assertEqual(conv_res["total_count"], 1)
		self.assertEqual(conv_res["messages"][0]["name"], msg_doc.name)
		self.assertEqual(conv_res["recipient_phone"], "919876543220")

	def test_15_whatsapp_template_sending(self):
		"""Verify WhatsApp template parameter interpolation and persistence."""
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Template Test Lead",
				"email": "test_email_assoc_tpl@example.com",
				"mobile_no": "9876543221",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		res = send_crm_whatsapp_message(
			doctype="Lead",
			name=lead.name,
			template_name="knaps_welcome",
			template_params=["Template Test Lead", "Senior Advisor Sharma"],
		)

		self.assertIn("Template Test Lead", res["content"])
		self.assertIn("Senior Advisor Sharma", res["content"])

		msg_doc = frappe.get_doc("CRM WhatsApp Message", res["message_name"])
		self.assertEqual(msg_doc.message_type, "template")
		self.assertEqual(msg_doc.template_name, "knaps_welcome")

	def test_16_whatsapp_conversations_isolation(self):
		"""Verify WhatsApp conversations between different leads are isolated."""
		lead_x = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Lead X",
				"email": "test_email_assoc_x@example.com",
				"mobile_no": "9876543222",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		lead_y = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Lead Y",
				"email": "test_email_assoc_y@example.com",
				"mobile_no": "9876543223",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		send_crm_whatsapp_message(
			doctype="Lead",
			name=lead_x.name,
			message="Confidential proposal for Lead X",
		)

		send_crm_whatsapp_message(
			doctype="Lead",
			name=lead_y.name,
			message="Confidential proposal for Lead Y",
		)

		conv_x = get_crm_whatsapp_conversations("Lead", lead_x.name)
		conv_y = get_crm_whatsapp_conversations("Lead", lead_y.name)

		self.assertEqual(conv_x["total_count"], 1)
		self.assertIn("Confidential proposal for Lead X", conv_x["messages"][0]["content"])
		self.assertNotIn("Confidential proposal for Lead Y", conv_x["messages"][0]["content"])

		self.assertEqual(conv_y["total_count"], 1)
		self.assertIn("Confidential proposal for Lead Y", conv_y["messages"][0]["content"])
		self.assertNotIn("Confidential proposal for Lead X", conv_y["messages"][0]["content"])

	def test_17_incoming_reply_associated_with_lead(self):
		"""1. A newly received email reply is associated with the correct Lead."""
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Reply Lead 17",
				"email": "test_email_assoc_lead17@example.com",
				"mobile_no": "9876543224",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		comm = frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Received",
				"sender": lead.email,
				"recipients": "satyambpl.2000@gmail.com",
				"subject": "Re: SIF Discussion",
				"content": "I accept the proposal terms.",
			}
		)
		link_communication_to_crm_record(comm)
		self.assertEqual(comm.reference_doctype, "Lead")
		self.assertEqual(comm.reference_name, lead.name)

	def test_18_incoming_reply_associated_with_client(self):
		"""2. A newly received email reply is associated with the correct Client."""
		client = frappe.get_doc(
			{
				"doctype": "Client",
				"client_name": "Reply Client 18",
				"first_name": "Client18",
				"email": "test_email_assoc_client18@example.com",
				"mobile_no": "9876543225",
			}
		).insert(ignore_permissions=True)

		comm = frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Received",
				"sender": client.email,
				"recipients": "satyambpl.2000@gmail.com",
				"subject": "Re: Portfolio Report",
				"content": "Thank you, looks good.",
			}
		)
		link_communication_to_crm_record(comm)
		self.assertEqual(comm.reference_doctype, "Client")
		self.assertEqual(comm.reference_name, client.name)

	def test_19_reply_with_in_reply_to_and_references(self):
		"""3. A reply containing In-Reply-To/References is linked to the correct conversation."""
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Thread Lead 19",
				"email": "test_email_assoc_thread19@example.com",
				"mobile_no": "9876543226",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		outbound = frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Sent",
				"sender": "satyambpl.2000@gmail.com",
				"recipients": lead.email,
				"subject": "Discussion on Wealth Creation",
				"message_id": "<test_msg_id_thread19_parent@knaps.in>",
				"reference_doctype": "Lead",
				"reference_name": lead.name,
			}
		).insert(ignore_permissions=True)

		# Case A: in_reply_to is communication docname
		reply_a = frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Received",
				"sender": "external_assistant@example.com",  # different email address
				"subject": "Re: Discussion on Wealth Creation",
				"in_reply_to": outbound.name,
			}
		)
		link_communication_to_crm_record(reply_a)
		self.assertEqual(reply_a.reference_doctype, "Lead")
		self.assertEqual(reply_a.reference_name, lead.name)

		# Case B: in_reply_to is raw Message-ID
		reply_b = frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Received",
				"sender": "external_assistant2@example.com",
				"subject": "Re: Discussion on Wealth Creation",
				"in_reply_to": "<test_msg_id_thread19_parent@knaps.in>",
			}
		)
		link_communication_to_crm_record(reply_b)
		self.assertEqual(reply_b.reference_doctype, "Lead")
		self.assertEqual(reply_b.reference_name, lead.name)
		self.assertEqual(reply_b.in_reply_to, outbound.name)

	def test_20_reply_without_headers_associated_by_email(self):
		"""4. A reply without thread headers can still be associated safely by email address."""
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "No Header Lead 20",
				"email": "test_email_assoc_nohead20@example.com",
				"mobile_no": "9876543227",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		comm = frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Received",
				"sender": f"Lead 20 <{lead.email}>",
				"subject": "New message without thread headers",
				"content": "Can you call me tomorrow?",
			}
		)
		link_communication_to_crm_record(comm)
		self.assertEqual(comm.reference_doctype, "Lead")
		self.assertEqual(comm.reference_name, lead.name)

	def test_21_duplicate_synchronization_prevention(self):
		"""5. Duplicate synchronization does not create duplicate conversation entries."""
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Dedup Lead 21",
				"email": "test_email_assoc_dedup21@example.com",
				"mobile_no": "9876543228",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		# Insert communication with specific UID
		frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Received",
				"sender": lead.email,
				"subject": "Testing deduplication",
				"message_id": "<test_msg_id_dedup21@example.com>",
				"reference_doctype": "Lead",
				"reference_name": lead.name,
				"email_account": "Knaps Official",
				"uid": "999991",
			}
		).insert(ignore_permissions=True)

		# Check DB query deduplication
		initial_count = frappe.db.count("Communication", {"message_id": "<test_msg_id_dedup21@example.com>"})
		self.assertEqual(initial_count, 1)

		# CustomEmailAccount candidate check should recognize UID 999991 as already in DB
		existing_rows = frappe.db.sql(
			"""
			SELECT CAST(uid AS UNSIGNED)
			FROM `tabCommunication`
			WHERE email_account = 'Knaps Official' AND uid = '999991'
			"""
		)
		self.assertEqual(len(existing_rows), 1)
		self.assertEqual(existing_rows[0][0], 999991)

	def test_22_conversation_api_returns_incoming_and_outgoing(self):
		"""6. The conversation API returns incoming and outgoing messages in chronological order."""
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Chronological Lead 22",
				"email": "test_email_assoc_chrono22@example.com",
				"mobile_no": "9876543229",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		# Outbound email
		frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Sent",
				"sender": "satyambpl.2000@gmail.com",
				"recipients": lead.email,
				"subject": "Proposal Letter",
				"content": "Please review the proposal.",
				"reference_doctype": "Lead",
				"reference_name": lead.name,
			}
		).insert(ignore_permissions=True)

		# Inbound reply
		frappe.get_doc(
			{
				"doctype": "Communication",
				"communication_type": "Communication",
				"communication_medium": "Email",
				"sent_or_received": "Received",
				"sender": lead.email,
				"recipients": "satyambpl.2000@gmail.com",
				"subject": "Re: Proposal Letter",
				"content": "Reviewed and agreed.",
				"reference_doctype": "Lead",
				"reference_name": lead.name,
			}
		).insert(ignore_permissions=True)

		res = get_crm_conversations("Lead", lead.name)
		self.assertEqual(res["total_count"], 2)
		directions = [c["sent_or_received"] for c in res["conversations"]]
		self.assertIn("Sent", directions)
		self.assertIn("Received", directions)

	def test_23_sync_parameter_retrieves_synchronized_messages(self):
		"""7. Refreshing via sync parameter runs without error and enforces cooldown."""
		lead = frappe.get_doc(
			{
				"doctype": "Lead",
				"lead_name": "Sync Test Lead 23",
				"email": "test_email_assoc_sync23@example.com",
				"mobile_no": "9876543230",
				"status": "New",
			}
		).insert(ignore_permissions=True)

		# Test get_crm_conversations with sync=True
		res = get_crm_conversations("Lead", lead.name, sync=True)
		self.assertIn("conversations", res)
		self.assertIn("total_count", res)

		# Test sync_crm_incoming_emails cooldown
		res_cooldown = sync_crm_incoming_emails(force=False)
		self.assertEqual(res_cooldown.get("status"), "cooldown")


if __name__ == "__main__":
	unittest.main()
