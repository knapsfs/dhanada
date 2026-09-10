# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import json
from datetime import datetime

import frappe
from frappe.tests import IntegrationTestCase

from dhanada.sif.conversation_service import (
	append_assistant_message,
	append_message,
	append_user_message,
	associate_lead,
	create_conversation,
	get_conversation,
	get_conversation_url,
	update_chat_context,
)


class TestChatbotConversation(IntegrationTestCase):
	def setUp(self):
		frappe.db.delete("Chatbot Conversation", {"visitor_id": ["in", ["test-visitor-1", "test-visitor-2"]]})
		frappe.db.commit()

	def tearDown(self):
		frappe.db.delete("Chatbot Conversation", {"visitor_id": ["in", ["test-visitor-1", "test-visitor-2"]]})
		frappe.db.commit()

	def test_create_conversation(self):
		conv = create_conversation(
			visitor_id="test-visitor-1",
			user_name="Test User",
			email="test@example.com",
			phone="9876543210",
			initial_message="Hello, I want to learn about SIF",
			chat_context="Interested in SIF",
		)

		self.assertTrue(conv["name"].startswith("CHAT-"))
		self.assertEqual(conv["visitor_id"], "test-visitor-1")
		self.assertEqual(conv["user_name"], "Test User")
		self.assertEqual(conv["email"], "test@example.com")
		self.assertEqual(conv["phone"], "9876543210")
		self.assertEqual(conv["chat_context"], "Interested in SIF")
		self.assertEqual(len(conv["transcript"]), 1)
		self.assertEqual(conv["transcript"][0]["User"], "Hello, I want to learn about SIF")

	def test_append_messages_sequence_and_ordering(self):
		conv = create_conversation(
			visitor_id="test-visitor-2",
			user_name="Investor",
		)
		conv_id = conv["name"]

		# 1. User message
		u_conv = append_user_message(conv_id, "What is the minimum investment for SIF?")
		self.assertEqual(len(u_conv["transcript"]), 1)
		self.assertEqual(u_conv["transcript"][0]["User"], "What is the minimum investment for SIF?")

		# 2. Assistant response
		a_conv = append_assistant_message(
			conv_id,
			"The minimum investment for SIF depends on the fund strategy.",
			context="User inquired about minimum investment for SIF",
		)
		self.assertEqual(len(a_conv["transcript"]), 1)
		self.assertEqual(a_conv["transcript"][0]["User"], "What is the minimum investment for SIF?")
		self.assertEqual(
			a_conv["transcript"][0]["Assistant"],
			"The minimum investment for SIF depends on the fund strategy.",
		)
		self.assertEqual(a_conv["chat_context"], "User inquired about minimum investment for SIF")

		# 3. Third message (new user exchange)
		t_conv = append_message(conv_id, role="user", message="Thank you!")
		self.assertEqual(len(t_conv["transcript"]), 2)
		self.assertEqual(t_conv["transcript"][1]["User"], "Thank you!")

		# 4. Verify DB doc & JSON integrity
		doc = frappe.get_doc("Chatbot Conversation", conv_id)
		parsed_transcript = json.loads(doc.chat_transcript)
		self.assertEqual(len(parsed_transcript), 2)
		self.assertEqual(
			parsed_transcript[0],
			{
				"User": "What is the minimum investment for SIF?",
				"Assistant": "The minimum investment for SIF depends on the fund strategy.",
			},
		)
		self.assertEqual(parsed_transcript[1], {"User": "Thank you!"})

	def test_update_chat_context(self):
		conv = create_conversation(visitor_id="test-visitor-1")
		conv_id = conv["name"]

		updated = update_chat_context(conv_id, "Looking for high-growth mutual funds")
		self.assertEqual(updated["chat_context"], "Looking for high-growth mutual funds")

	def test_associate_lead(self):
		conv = create_conversation(visitor_id="test-visitor-1")
		conv_id = conv["name"]

		# Initially empty before lead association
		self.assertEqual(conv["conversation_url"], "")

		updated = associate_lead(
			conv_id,
			lead_id="LEAD-TEST-001",
			user_name="John Doe",
			email="john@example.com",
			phone="9876543210",
		)
		self.assertEqual(updated["lead_id"], "LEAD-TEST-001")
		self.assertEqual(updated["user_name"], "John Doe")
		self.assertEqual(updated["email"], "john@example.com")
		self.assertEqual(updated["phone"], "9876543210")
		self.assertEqual(updated["conversation_url"], "/crm/leads/LEAD-TEST-001")

		# Verify DB doc directly
		doc = frappe.get_doc("Chatbot Conversation", conv_id)
		self.assertEqual(doc.conversation_url, "/crm/leads/LEAD-TEST-001")

	def test_get_conversation_url(self):
		conv = create_conversation(visitor_id="test-visitor-1")
		conv_id = conv["name"]

		# Without lead -> empty string
		url_without_lead = get_conversation_url(conv_id)
		self.assertEqual(url_without_lead, "")

		# With lead -> CRM Lead route
		associate_lead(conv_id, lead_id="CRM-LEAD-2026-00099")
		url_with_lead = get_conversation_url(conv_id)
		self.assertEqual(url_with_lead, "/crm/leads/CRM-LEAD-2026-00099")

	def test_nonexistent_conversation_handling(self):
		result = get_conversation("NON-EXISTENT-CHAT-ID")
		self.assertIsNone(result)

		url = get_conversation_url("NON-EXISTENT-CHAT-ID")
		self.assertEqual(url, "")

		with self.assertRaises(frappe.DoesNotExistError):
			append_user_message("NON-EXISTENT-CHAT-ID", "Test message")

		with self.assertRaises(frappe.DoesNotExistError):
			append_assistant_message("NON-EXISTENT-CHAT-ID", "Test response")

		with self.assertRaises(frappe.DoesNotExistError):
			update_chat_context("NON-EXISTENT-CHAT-ID", "New context")

		with self.assertRaises(frappe.DoesNotExistError):
			associate_lead("NON-EXISTENT-CHAT-ID", user_name="John")
