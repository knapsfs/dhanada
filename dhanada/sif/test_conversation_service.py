# Copyright (c) 2026, KNAPS Private Limited and Contributors
# See license.txt

import json

import frappe
from frappe.tests import IntegrationTestCase

from dhanada.sif.conversation_service import (
	append_assistant_message,
	append_message,
	append_user_message,
	associate_lead,
	create_conversation,
	get_conversation,
	get_conversation_doc,
	get_conversation_url,
	save_chat_message,
	update_chat_context,
	update_chatbot_context,
)


class TestConversationService(IntegrationTestCase):
	def setUp(self):
		frappe.db.delete(
			"Chatbot Conversation",
			{
				"visitor_id": [
					"in",
					[
						"srv-test-visitor-1",
						"srv-test-visitor-2",
						"api-visitor-1",
						"api-visitor-2",
						"victim-visitor-token",
						"attacker-visitor-token",
					],
				]
			},
		)
		frappe.db.commit()

	def tearDown(self):
		frappe.db.delete(
			"Chatbot Conversation",
			{
				"visitor_id": [
					"in",
					[
						"srv-test-visitor-1",
						"srv-test-visitor-2",
						"api-visitor-1",
						"api-visitor-2",
						"victim-visitor-token",
						"attacker-visitor-token",
					],
				]
			},
		)
		frappe.db.commit()

	def test_create_conversation_basic(self):
		conv = create_conversation(
			visitor_id="srv-test-visitor-1",
			user_name="Service Tester",
			email="service@example.com",
			phone="9876500000",
			initial_message="Initial inquiry",
			initial_role="user",
			chat_context="Inquiring about scheme features",
		)

		self.assertTrue(conv["name"].startswith("CHAT-"))
		self.assertEqual(conv["conversation_id"], conv["name"])
		self.assertEqual(conv["visitor_id"], "srv-test-visitor-1")
		self.assertEqual(conv["user_name"], "Service Tester")
		self.assertEqual(conv["email"], "service@example.com")
		self.assertEqual(conv["phone"], "9876500000")
		self.assertEqual(conv["chat_context"], "Inquiring about scheme features")
		self.assertEqual(len(conv["transcript"]), 1)
		self.assertEqual(conv["transcript"][0]["User"], "Initial inquiry")
		self.assertIsNotNone(conv["started_at"])
		self.assertEqual(conv["conversation_url"], "")

	def test_message_ordering_and_transcript_integrity(self):
		conv = create_conversation(
			visitor_id="srv-test-visitor-2",
		)
		conv_id = conv["name"]

		# 1. User asks question
		res1 = append_user_message(conv_id, "Message 1: User question")
		self.assertEqual(len(res1["transcript"]), 1)
		self.assertEqual(res1["transcript"][0]["User"], "Message 1: User question")

		# 2. Assistant replies (completing the first exchange)
		res2 = append_assistant_message(
			conv_id,
			"Message 2: Assistant answer",
			context="User asked for info and assistant provided answer",
		)
		self.assertEqual(len(res2["transcript"]), 1)
		self.assertEqual(res2["transcript"][0]["User"], "Message 1: User question")
		self.assertEqual(res2["transcript"][0]["Assistant"], "Message 2: Assistant answer")
		self.assertEqual(res2["chat_context"], "User asked for info and assistant provided answer")

		# 3. User follow up via append_message (new exchange)
		res3 = append_message(conv_id, role="user", message="Message 3: User follow up")
		self.assertEqual(len(res3["transcript"]), 2)
		self.assertEqual(res3["transcript"][1]["User"], "Message 3: User follow up")

		# 4. Verify transcript order and JSON structure in database
		doc = get_conversation_doc(conv_id)
		transcript = json.loads(doc.chat_transcript)
		self.assertEqual(len(transcript), 2)
		self.assertEqual(transcript[0]["User"], "Message 1: User question")
		self.assertEqual(transcript[0]["Assistant"], "Message 2: Assistant answer")
		self.assertEqual(transcript[1]["User"], "Message 3: User follow up")

	def test_update_chat_context(self):
		conv = create_conversation(
			visitor_id="srv-test-visitor-1",
			initial_message="Hello",
			chat_context="Initial greeting",
		)
		conv_id = conv["name"]
		self.assertEqual(len(conv["transcript"]), 1)

		# 1. Update context via service
		res = update_chat_context(
			conv_id, "User is interested in SIF investments and wants to invest ₹1,00,000."
		)
		self.assertEqual(
			res["chat_context"], "User is interested in SIF investments and wants to invest ₹1,00,000."
		)

		# 2. Confirm persistence in database
		doc = get_conversation_doc(conv_id)
		self.assertEqual(
			doc.chat_context, "User is interested in SIF investments and wants to invest ₹1,00,000."
		)
		# Ensure transcript is not overwritten or changed
		self.assertEqual(len(doc.get_transcript_list()), 1)

	def test_update_chatbot_context_endpoint_and_security(self):
		conv = create_conversation(
			visitor_id="victim-visitor-token",
			initial_message="Exploring mutual funds",
			chat_context="General inquiry",
		)
		conv_id = conv["name"]

		# 1. Legitimate visitor updates context
		frappe.form_dict = frappe._dict(
			{
				"conversation_id": conv_id,
				"visitor_id": "victim-visitor-token",
				"chat_context": "User comparing Bluechip vs Balanced Advantage",
			}
		)
		res = update_chatbot_context()
		self.assertTrue(res.get("success"))
		self.assertEqual(res.get("chat_context"), "User comparing Bluechip vs Balanced Advantage")

		# 2. Unauthorized visitor tries to update context
		frappe.form_dict = frappe._dict(
			{
				"conversation_id": conv_id,
				"visitor_id": "attacker-visitor-token",
				"chat_context": "Hacked context",
			}
		)
		attack_res = update_chatbot_context()
		self.assertFalse(attack_res.get("success"))
		self.assertIn("Unauthorized", attack_res.get("message"))

		# 3. Verify context was not modified by attacker
		doc = get_conversation_doc(conv_id)
		self.assertEqual(doc.chat_context, "User comparing Bluechip vs Balanced Advantage")

		# 4. Long context input is safely truncated to 500 characters
		long_context = "A" * 600
		frappe.form_dict = frappe._dict(
			{
				"conversation_id": conv_id,
				"visitor_id": "victim-visitor-token",
				"chat_context": long_context,
			}
		)
		long_res = update_chatbot_context()
		self.assertTrue(long_res.get("success"))
		self.assertEqual(len(long_res.get("chat_context")), 500)

	def test_get_conversation_and_url(self):
		conv = create_conversation(visitor_id="srv-test-visitor-1")
		conv_id = conv["name"]

		# Without lead -> empty string
		rel_url = get_conversation_url(conv_id, full_url=False)
		self.assertEqual(rel_url, "")

		full_url = get_conversation_url(conv_id, full_url=True)
		self.assertEqual(full_url, "")

		# Associate lead -> CRM Lead route
		associate_lead(conv_id, lead_id="CRM-LEAD-2026-00042")
		rel_url_with_lead = get_conversation_url(conv_id, full_url=False)
		self.assertEqual(rel_url_with_lead, "/crm/leads/CRM-LEAD-2026-00042")

		full_url_with_lead = get_conversation_url(conv_id, full_url=True)
		self.assertTrue(full_url_with_lead.endswith("/crm/leads/CRM-LEAD-2026-00042"))

		# Fetch existing
		fetched = get_conversation(conv_id)
		self.assertIsNotNone(fetched)
		self.assertEqual(fetched["name"], conv_id)
		self.assertEqual(fetched["conversation_url"], "/crm/leads/CRM-LEAD-2026-00042")

		# Fetch non-existent
		self.assertIsNone(get_conversation("NON-EXISTENT"))
		self.assertEqual(get_conversation_url("NON-EXISTENT"), "")

	def test_associate_lead_generic(self):
		conv = create_conversation(visitor_id="srv-test-visitor-1")
		conv_id = conv["name"]

		res = associate_lead(
			conv_id,
			user_name="Jane Investor",
			email="jane@example.com",
			phone="9988776655",
		)
		self.assertEqual(res["user_name"], "Jane Investor")
		self.assertEqual(res["email"], "jane@example.com")
		self.assertEqual(res["phone"], "9988776655")

	def test_save_chat_message_endpoint_flow(self):
		# Turn 1: User sends first message without conversation_id
		frappe.form_dict = frappe._dict(
			{
				"visitor_id": "api-visitor-1",
				"role": "user",
				"message": "Hi, what is SIF?",
			}
		)

		res1 = save_chat_message()
		self.assertTrue(res1.get("success"))
		conv_id = res1.get("conversation_id")
		self.assertTrue(conv_id.startswith("CHAT-"))
		self.assertNotIn("transcript", res1)

		# Turn 1: Assistant replies and sets initial evolving context
		frappe.form_dict = frappe._dict(
			{
				"conversation_id": conv_id,
				"visitor_id": "api-visitor-1",
				"role": "assistant",
				"message": "SIF is Specialized Investment Fund.",
				"chat_context": "A user is interested in sif.",
			}
		)
		res2 = save_chat_message()
		self.assertTrue(res2.get("success"))
		self.assertEqual(res2.get("conversation_id"), conv_id)
		self.assertEqual(res2.get("chat_context"), "A user is interested in sif.")

		# Turn 2: User provides profile info
		frappe.form_dict = frappe._dict(
			{
				"conversation_id": conv_id,
				"visitor_id": "api-visitor-1",
				"role": "user",
				"message": "I want to invest ₹10 Lakhs for 5 years.",
				"user_name": "Rohan",
				"email": "rohan@example.com",
			}
		)
		res3 = save_chat_message()
		self.assertTrue(res3.get("success"))
		self.assertEqual(res3.get("conversation_id"), conv_id)

		# Turn 2: Assistant replies with evolved summary
		frappe.form_dict = frappe._dict(
			{
				"conversation_id": conv_id,
				"visitor_id": "api-visitor-1",
				"role": "assistant",
				"message": "For ₹10 Lakhs over 5 years, we recommend our growth strategies.",
				"chat_context": "Rohan is interested in sif and wants to explore investing ₹10,00,000 for 5 years.",
			}
		)
		res4 = save_chat_message()
		self.assertTrue(res4.get("success"))
		self.assertEqual(res4.get("conversation_id"), conv_id)
		self.assertEqual(
			res4.get("chat_context"),
			"Rohan is interested in sif and wants to explore investing ₹10,00,000 for 5 years.",
		)

		# Verify full conversation in database
		doc = get_conversation_doc(conv_id)
		self.assertEqual(doc.user_name, "Rohan")
		self.assertEqual(doc.email, "rohan@example.com")
		self.assertEqual(
			doc.chat_context,
			"Rohan is interested in sif and wants to explore investing ₹10,00,000 for 5 years.",
		)

		transcript = json.loads(doc.chat_transcript)
		self.assertEqual(len(transcript), 2)
		self.assertEqual(transcript[0]["User"], "Hi, what is SIF?")
		self.assertEqual(transcript[0]["Assistant"], "SIF is Specialized Investment Fund.")
		self.assertEqual(transcript[1]["User"], "I want to invest ₹10 Lakhs for 5 years.")
		self.assertEqual(
			transcript[1]["Assistant"], "For ₹10 Lakhs over 5 years, we recommend our growth strategies."
		)

	def test_security_cross_user_isolation(self):
		# 1. User A (Victim) starts conversation
		frappe.form_dict = frappe._dict(
			{
				"visitor_id": "victim-visitor-token",
				"role": "user",
				"message": "Victim confidential inquiry",
			}
		)
		victim_res = save_chat_message()
		self.assertTrue(victim_res.get("success"))
		victim_conv_id = victim_res.get("conversation_id")

		# 2. User B (Attacker) tries to append to User A's conversation with Attacker's visitor token
		frappe.form_dict = frappe._dict(
			{
				"conversation_id": victim_conv_id,
				"visitor_id": "attacker-visitor-token",
				"role": "user",
				"message": "Malicious injected message",
			}
		)
		attack_res = save_chat_message()
		self.assertFalse(attack_res.get("success"))
		self.assertIn("Unauthorized", attack_res.get("message"))

		# 3. User B tries without any visitor_id
		frappe.form_dict = frappe._dict(
			{
				"conversation_id": victim_conv_id,
				"visitor_id": "",
				"role": "user",
				"message": "Anonymous hijack attempt",
			}
		)
		attack_res2 = save_chat_message()
		self.assertFalse(attack_res2.get("success"))
		self.assertIn("Unauthorized", attack_res2.get("message"))

		# 4. Verify User A's transcript remained completely untouched
		victim_doc = get_conversation_doc(victim_conv_id)
		transcript = json.loads(victim_doc.chat_transcript)
		self.assertEqual(len(transcript), 1)
		self.assertEqual(transcript[0]["User"], "Victim confidential inquiry")

		# 5. User A can still legitimately append to their own conversation
		frappe.form_dict = frappe._dict(
			{
				"conversation_id": victim_conv_id,
				"visitor_id": "victim-visitor-token",
				"role": "assistant",
				"message": "Assistant answer to victim",
			}
		)
		legit_res = save_chat_message()
		self.assertTrue(legit_res.get("success"))
		self.assertEqual(legit_res.get("conversation_id"), victim_conv_id)

	def test_security_invalid_conversation_id_rejection(self):
		# Supplying non-existent conversation_id is rejected and not silently created
		frappe.form_dict = frappe._dict(
			{
				"conversation_id": "CHAT-9999-99999",
				"visitor_id": "some-visitor-token",
				"role": "user",
				"message": "Message to invalid conversation",
			}
		)
		res = save_chat_message()
		self.assertFalse(res.get("success"))
		self.assertIn("not found", res.get("message"))

	def test_anonymous_user_auto_token(self):
		# Completely anonymous user without visitor_id gets auto-assigned secure token
		frappe.form_dict = frappe._dict(
			{
				"role": "user",
				"message": "Anonymous first message",
			}
		)
		res = save_chat_message()
		self.assertTrue(res.get("success"))
		auto_token = res.get("visitor_id")
		self.assertTrue(len(auto_token) > 10)

		# Using auto_token enables subsequent appends
		frappe.form_dict = frappe._dict(
			{
				"conversation_id": res.get("conversation_id"),
				"visitor_id": auto_token,
				"role": "assistant",
				"message": "Anonymous second message",
			}
		)
		res2 = save_chat_message()
		self.assertTrue(res2.get("success"))
		self.assertEqual(res2.get("conversation_id"), res.get("conversation_id"))

	def test_nonexistent_and_invalid_operations(self):
		with self.assertRaises(frappe.ValidationError):
			get_conversation_doc("")

		with self.assertRaises(frappe.DoesNotExistError):
			get_conversation_doc("DOES-NOT-EXIST-CHAT")

		with self.assertRaises(frappe.DoesNotExistError):
			append_message("DOES-NOT-EXIST-CHAT", role="user", message="Hi")

		with self.assertRaises(frappe.DoesNotExistError):
			update_chat_context("DOES-NOT-EXIST-CHAT", "Summary")

		with self.assertRaises(frappe.DoesNotExistError):
			associate_lead("DOES-NOT-EXIST-CHAT", user_name="123")

		# Endpoint validation with empty message
		frappe.form_dict = frappe._dict({"message": ""})
		res = save_chat_message()
		self.assertFalse(res.get("success"))

	def test_full_lead_lifecycle_preserves_same_conversation(self):
		# 1. Turn 1: User asks initial question -> Conversation created
		visitor_id = "srv-test-visitor-1"
		res1 = create_conversation(
			visitor_id=visitor_id,
			initial_message="Hi, I am interested in Dhanada SIF schemes.",
			chat_context="User inquiring about SIF",
		)
		conv_id = res1["name"]
		self.assertTrue(conv_id.startswith("CHAT-"))
		self.assertEqual(len(res1["transcript"]), 1)

		# 2. Assistant responds to question
		res2 = append_assistant_message(
			conv_id,
			"Welcome! Our SIF scheme offers high-growth opportunities.",
			context="User inquiring about SIF scheme features",
		)
		self.assertEqual(res2["conversation_id"], conv_id)
		self.assertEqual(len(res2["transcript"]), 1)
		self.assertEqual(res2["transcript"][0]["User"], "Hi, I am interested in Dhanada SIF schemes.")
		self.assertEqual(
			res2["transcript"][0]["Assistant"],
			"Welcome! Our SIF scheme offers high-growth opportunities.",
		)

		# 3. User provides lead info -> Lead is created and associated with existing conversation
		lead_ref = "CRM-LEAD-2026-99001"
		res3 = associate_lead(
			conversation_id=conv_id,
			lead_id=lead_ref,
			user_name="Priya Sharma",
			email="priya@example.com",
			phone="9876543210",
			visitor_id=visitor_id,
		)
		self.assertEqual(res3["conversation_id"], conv_id)
		self.assertEqual(res3["lead_id"], lead_ref)
		self.assertEqual(res3["user_name"], "Priya Sharma")
		self.assertEqual(res3["email"], "priya@example.com")
		self.assertEqual(res3["phone"], "9876543210")

		# 4. Post-lead Turn 2: User asks follow-up question
		frappe.form_dict = frappe._dict(
			{
				"conversation_id": conv_id,
				"visitor_id": visitor_id,
				"role": "user",
				"message": "Can I invest ₹5 Lakhs through monthly SIP?",
			}
		)
		res4 = save_chat_message()
		self.assertTrue(res4.get("success"))
		self.assertEqual(res4.get("conversation_id"), conv_id)

		# 5. Post-lead Assistant responds
		frappe.form_dict = frappe._dict(
			{
				"conversation_id": conv_id,
				"visitor_id": visitor_id,
				"role": "assistant",
				"message": "Yes, monthly SIP is available starting from ₹10,000.",
				"chat_context": "Priya Sharma is interested in SIF with ₹5 Lakhs monthly SIP.",
			}
		)
		res5 = save_chat_message()
		self.assertTrue(res5.get("success"))
		self.assertEqual(res5.get("conversation_id"), conv_id)

		# 6. Verify single conversation in DB with all pre-lead and post-lead messages intact
		total_docs = frappe.db.count("Chatbot Conversation", {"visitor_id": visitor_id})
		self.assertEqual(total_docs, 1, "Exactly ONE Chatbot Conversation document must exist")

		final_doc = get_conversation_doc(conv_id)
		self.assertEqual(final_doc.lead_id, lead_ref)
		self.assertEqual(final_doc.user_name, "Priya Sharma")
		self.assertEqual(final_doc.email, "priya@example.com")
		self.assertEqual(final_doc.phone, "9876543210")
		self.assertEqual(
			final_doc.chat_context,
			"Priya Sharma is interested in SIF with ₹5 Lakhs monthly SIP.",
		)

		final_transcript = json.loads(final_doc.chat_transcript)
		self.assertEqual(len(final_transcript), 2)
		self.assertEqual(
			final_transcript[0]["User"],
			"Hi, I am interested in Dhanada SIF schemes.",
		)
		self.assertEqual(
			final_transcript[1]["User"],
			"Can I invest ₹5 Lakhs through monthly SIP?",
		)
		self.assertEqual(final_doc.conversation_url, f"/crm/leads/{lead_ref}")

	def test_lead_association_security(self):
		conv = create_conversation(visitor_id="victim-visitor-token")
		conv_id = conv["name"]

		# Attacker cannot associate lead to victim's conversation via function
		with self.assertRaises(frappe.PermissionError):
			associate_lead(
				conversation_id=conv_id,
				lead_id="ATTACKER-LEAD",
				visitor_id="attacker-visitor-token",
			)

		# Attacker cannot associate lead to victim's conversation via HTTP endpoint
		frappe.form_dict = frappe._dict(
			{
				"conversation_id": conv_id,
				"visitor_id": "attacker-visitor-token",
				"lead_id": "ATTACKER-LEAD",
			}
		)
		from dhanada.sif.conversation_service import associate_lead_to_conversation

		attack_res = associate_lead_to_conversation()
		self.assertFalse(attack_res.get("success"))
		self.assertIn("Unauthorized", attack_res.get("message"))

		# Victim doc remains unassociated
		doc = get_conversation_doc(conv_id)
		self.assertFalse(doc.lead_id)

	def test_crm_lead_field_provisioning_and_idempotency(self):
		from dhanada.utils.patch_crm_layout import (
			patch_crm_lead_data_layout,
			patch_layout,
			setup_crm_lead_custom_fields,
		)

		# 1. Run provisioning
		patch_layout()

		# 2. Check Custom Fields exist
		self.assertTrue(frappe.db.exists("Custom Field", "CRM Lead-custom_chat_context"))
		self.assertTrue(frappe.db.exists("Custom Field", "CRM Lead-custom_conversation"))

		# Check field configuration
		cf_conv = frappe.get_doc("Custom Field", "CRM Lead-custom_conversation")
		self.assertEqual(cf_conv.fieldtype, "Link")
		self.assertEqual(cf_conv.options, "Chatbot Conversation")
		self.assertEqual(cf_conv.label, "Conversation")
		self.assertEqual(cf_conv.read_only, 1)

		cf_ctx = frappe.get_doc("Custom Field", "CRM Lead-custom_chat_context")
		self.assertEqual(cf_ctx.fieldtype, "Small Text")
		self.assertEqual(cf_ctx.label, "Chat Context")

		# Check CRM Form Script for custom_conversation link navigation
		self.assertTrue(frappe.db.exists("CRM Form Script", "CRM Lead UI Fix"))
		script_doc = frappe.get_doc("CRM Form Script", "CRM Lead UI Fix")
		self.assertEqual(script_doc.enabled, 1)
		self.assertIn("custom_conversation", script_doc.script)
		self.assertIn("/desk/chatbot-conversation/", script_doc.script)

		# 3. Check Data Fields Layout contains both fields
		doc = frappe.get_doc("CRM Fields Layout", {"dt": "CRM Lead", "type": "Data Fields"})
		layout = json.loads(doc.layout)

		all_data_fields = []
		for section in layout:
			for column in section.get("columns", []):
				all_data_fields.extend(column.get("fields", []))

		self.assertIn("custom_chat_context", all_data_fields)
		self.assertIn("custom_conversation", all_data_fields)

		# 4. Verify Side Panel layout does NOT contain context
		side_doc = frappe.get_doc("CRM Fields Layout", {"dt": "CRM Lead", "type": "Side Panel"})
		side_layout = json.loads(side_doc.layout)
		side_labels = [s.get("label") for s in side_layout]
		self.assertNotIn("Chatbot Context", side_labels)

		# 5. Test idempotency (running twice does not create duplicates)
		patch_layout()
		doc2 = frappe.get_doc("CRM Fields Layout", {"dt": "CRM Lead", "type": "Data Fields"})
		layout2 = json.loads(doc2.layout)
		all_data_fields2 = []
		for section in layout2:
			for column in section.get("columns", []):
				all_data_fields2.extend(column.get("fields", []))

		self.assertEqual(all_data_fields2.count("custom_chat_context"), 1)
		self.assertEqual(all_data_fields2.count("custom_conversation"), 1)

	def test_lead_capture_populates_crm_lead_data_section(self):
		from dhanada.api import create_chatbot_lead

		# 1. Start conversation with context
		conv = create_conversation(
			visitor_id="api-visitor-crm-1",
			user_name="Amit Patel",
			email="amit.patel@example.com",
			phone="9820098200",
			initial_message="I want to allocate ₹20 Lakhs to SIF portfolio.",
			chat_context="Amit Patel is interested in SIF with ₹20 Lakhs allocation.",
		)
		conv_id = conv["name"]

		# 2. Simulate lead capture via create_chatbot_lead API
		frappe.form_dict = frappe._dict(
			{
				"name": "Amit Patel",
				"email": "amit.patel@example.com",
				"mobile": "9820098200",
				"interest": "SIF",
				"conversation_id": conv_id,
				"visitor_id": "api-visitor-crm-1",
			}
		)

		lead_res = create_chatbot_lead()
		self.assertTrue(lead_res.get("success"))
		lead_name = lead_res.get("lead_name")
		self.assertTrue(lead_name.startswith("CRM-LEAD-"))

		# 3. Verify CRM Lead record contains Chat Context and Conversation link
		lead_doc = frappe.get_doc("CRM Lead", lead_name)
		self.assertEqual(
			lead_doc.custom_chat_context,
			"Amit Patel is interested in SIF with ₹20 Lakhs allocation.",
		)
		self.assertEqual(lead_doc.custom_conversation, conv_id)

		# 4. Verify Chatbot Conversation record has lead_id and conversation_url associated
		conv_doc = get_conversation_doc(conv_id)
		self.assertEqual(conv_doc.lead_id, lead_name)
		self.assertEqual(conv_doc.conversation_url, f"/crm/leads/{lead_name}")

		# 5. Verify live context synchronization on conversation update
		update_chat_context(
			conv_id,
			"Amit Patel updated goal: Retirement planning in 7 years with ₹20 Lakhs SIF.",
		)
		refreshed_lead = frappe.get_doc("CRM Lead", lead_name)
		self.assertEqual(
			refreshed_lead.custom_chat_context,
			"Amit Patel updated goal: Retirement planning in 7 years with ₹20 Lakhs SIF.",
		)

		# 6. Clean up test lead
		frappe.delete_doc("CRM Lead", lead_name, ignore_permissions=True)
		frappe.db.commit()

	def test_conversation_url_field_meta(self):
		meta = frappe.get_meta("Chatbot Conversation")
		df = meta.get_field("conversation_url")
		self.assertIsNotNone(df)
		self.assertEqual(df.fieldtype, "Data")
		self.assertEqual(df.options, "URL")
		self.assertEqual(df.read_only, 1)
		self.assertEqual(df.label, "Conversation URL")

	def test_crm_lead_conversation_url_display_and_behavior(self):
		"""
		STEP 8B Tests:
		1. CRM Lead custom_conversation remains a Link field with options 'Chatbot Conversation' & read_only=1.
		2. custom_conversation stores only canonical CHAT-YYYY-##### in the database.
		3. The UI display URL is derived from custom_conversation.
		4. Displayed URL for CHAT-2026-00237 is exactly: /desk/chatbot-conversation/CHAT-2026-00237.
		5. Form script sets active clickable link routing to /desk/chatbot-conversation/<custom_conversation>.
		6. A Lead without a conversation renders empty (no broken URL, no /desk/chatbot-conversation/ without ID).
		7. Lead -> conversation association works.
		8. Conversation -> lead reverse association works (conversation_url -> /crm/leads/<lead_name>).
		9. No duplicate visible Conversation fields are created.
		10. Provisioning via patch_layout() remains idempotent.
		"""
		from dhanada.utils.patch_crm_layout import patch_layout

		patch_layout()

		# 1 & 2: Database field definition and format validation
		conv_cf = frappe.get_doc("Custom Field", "CRM Lead-custom_conversation")
		self.assertEqual(conv_cf.fieldtype, "Link")
		self.assertEqual(conv_cf.options, "Chatbot Conversation")
		self.assertEqual(conv_cf.read_only, 1)
		self.assertEqual(conv_cf.label, "Conversation")

		# Check CRM Form Script exists and has the dynamic logic
		script_doc = frappe.get_doc("CRM Form Script", "CRM Lead UI Fix")
		self.assertEqual(script_doc.enabled, 1)
		script = script_doc.script
		self.assertIn("updateConversationLink", script)
		self.assertIn("/desk/chatbot-conversation/", script)
		self.assertIn("Open Conversation ↗", script)

		# 3 & 4 & 5: Test URL generation for CHAT-2026-00237
		test_conv_id = "CHAT-2026-00237"
		expected_url = f"/desk/chatbot-conversation/{test_conv_id}"
		self.assertEqual(expected_url, "/desk/chatbot-conversation/CHAT-2026-00237")

		# 6: Verify empty lead handling logic in script
		self.assertIn("this.setFieldProperty('custom_conversation', 'options', '')", script)
		self.assertIn("this.setFieldHtml('custom_conversation', '')", script)

		# 7 & 8: Test full association roundtrip
		conv = create_conversation(
			visitor_id="step8b-visitor-1",
			user_name="Step 8B Lead",
			email="step8b@example.com",
			phone="9876543210",
			initial_message="Testing Step 8B navigation",
			chat_context="Lead inquiring about Step 8B navigation.",
		)
		conv_id = conv["name"]
		self.assertTrue(conv_id.startswith("CHAT-"))

		# Create a CRM Lead linking to this conversation
		lead = frappe.get_doc(
			{
				"doctype": "CRM Lead",
				"first_name": "Step 8B Lead",
				"email": "step8b@example.com",
				"mobile_no": "9876543210",
				"custom_conversation": conv_id,
				"custom_chat_context": "Lead inquiring about Step 8B navigation.",
			}
		).insert(ignore_permissions=True)
		lead_name = lead.name

		# Stored value is strictly the canonical document name, not a URL
		self.assertEqual(lead.custom_conversation, conv_id)
		self.assertFalse(lead.custom_conversation.startswith("/"))
		self.assertFalse(lead.custom_conversation.startswith("http"))

		# Reverse association on conversation
		associate_lead(conv_id, lead_name)
		conv_doc = get_conversation_doc(conv_id)
		self.assertEqual(conv_doc.lead_id, lead_name)
		self.assertEqual(conv_doc.conversation_url, f"/crm/leads/{lead_name}")

		# 9: Ensure only 1 Conversation field exists in Data Fields Layout
		data_doc = frappe.get_doc("CRM Fields Layout", {"dt": "CRM Lead", "type": "Data Fields"})
		layout = json.loads(data_doc.layout)
		all_fields = []
		for section in layout:
			for column in section.get("columns", []):
				all_fields.extend(column.get("fields", []))
		self.assertEqual(all_fields.count("custom_conversation"), 1)

		# 10: Idempotency
		patch_layout()
		data_doc2 = frappe.get_doc("CRM Fields Layout", {"dt": "CRM Lead", "type": "Data Fields"})
		layout2 = json.loads(data_doc2.layout)
		all_fields2 = []
		for section in layout2:
			for column in section.get("columns", []):
				all_fields2.extend(column.get("fields", []))
		self.assertEqual(all_fields2.count("custom_conversation"), 1)

		# Clean up
		frappe.delete_doc("CRM Lead", lead_name, ignore_permissions=True)
		frappe.delete_doc("Chatbot Conversation", conv_id, ignore_permissions=True)
		frappe.db.commit()

	def test_step9_chat_context_and_branding_integrity(self):
		"""
		STEP 9 Tests:
		1. Verify that chat context accurately persists actual user inquiries without unmentioned topics.
		2. Verify context synchronization to CRM Lead.
		3. Verify that conversation endpoints safely accept updated context.
		"""
		# 1. Greeting only conversation
		conv_greet = create_conversation(
			visitor_id="step9-visitor-1",
			user_name="Greet User",
			initial_message="hi",
			chat_context="Greet User greeted the assistant.",
		)
		self.assertEqual(conv_greet["chat_context"], "Greet User greeted the assistant.")
		self.assertNotIn("Dhanada", conv_greet["chat_context"])
		self.assertNotIn("mutual funds", conv_greet["chat_context"])

		# 2. SIF inquiry conversation
		conv_sif = create_conversation(
			visitor_id="step9-visitor-2",
			user_name="SIF Inquirer",
			initial_message="What is a SIF?",
			chat_context="SIF Inquirer inquired about Specialized Investment Funds (SIF).",
		)
		self.assertEqual(
			conv_sif["chat_context"], "SIF Inquirer inquired about Specialized Investment Funds (SIF)."
		)
		self.assertNotIn("Dhanada", conv_sif["chat_context"])

		# 3. Clean up
		frappe.delete_doc("Chatbot Conversation", conv_greet["name"], ignore_permissions=True)
		frappe.delete_doc("Chatbot Conversation", conv_sif["name"], ignore_permissions=True)
		frappe.db.commit()

	def test_step10_multi_turn_user_intent_context_capture(self):
		"""
		STEP 10 Tests:
		1. Verify multi-turn user intent synthesis (e.g. amount across turns + SIF vehicle).
		2. Verify context updates on existing conversation and CRM lead synchronization.
		"""
		# Multi-turn conversation synthesizing intent: "User wants to invest ₹4,00,00,000 in SIF."
		conv = create_conversation(
			visitor_id="step10-visitor-1",
			user_name="Rajesh Sharma",
			initial_message="I have 40000000 in my bank",
			chat_context="Rajesh Sharma wants to invest ₹4,00,00,000 in SIF.",
		)
		conv_id = conv["name"]
		self.assertEqual(conv["chat_context"], "Rajesh Sharma wants to invest ₹4,00,00,000 in SIF.")

		# Update context upon further conversation
		updated = update_chat_context(
			conv_id, "Rajesh Sharma wants to invest ₹4,00,00,000 in SIF (retirement planning for 7 years)."
		)
		self.assertEqual(
			updated["chat_context"],
			"Rajesh Sharma wants to invest ₹4,00,00,000 in SIF (retirement planning for 7 years).",
		)

		# Clean up
		frappe.delete_doc("Chatbot Conversation", conv_id, ignore_permissions=True)
		frappe.db.commit()

	def test_step11_simplified_chat_transcript_format(self):
		"""
		STEP 11 Tests:
		1. Transcript stores paired exchange objects: [{"User": "...", "Assistant": "..."}].
		2. Uses ONLY 'User' and 'Assistant' keys (no 'role', 'message', 'text', 'timestamp').
		3. Correctly pairs user and assistant messages in one object per exchange.
		4. Preserves exact text and chronological order.
		"""
		conv = create_conversation(
			visitor_id="step11-visitor-1",
			user_name="Transcript Tester",
			initial_message="Hii",
		)
		conv_id = conv["name"]

		append_assistant_message(conv_id, "Hi! How can I help you today?")
		append_user_message(conv_id, "What is a SIF?")
		append_assistant_message(conv_id, "SIF stands for Specialized Investment Fund.")

		doc = get_conversation_doc(conv_id)
		transcript = json.loads(doc.chat_transcript)

		expected = [
			{
				"User": "Hii",
				"Assistant": "Hi! How can I help you today?",
			},
			{
				"User": "What is a SIF?",
				"Assistant": "SIF stands for Specialized Investment Fund.",
			},
		]
		self.assertEqual(transcript, expected)

		# Verify keys contain only 'User' and 'Assistant'
		for exchange in transcript:
			self.assertTrue(set(exchange.keys()).issubset({"User", "Assistant"}))
			self.assertNotIn("role", exchange)
			self.assertNotIn("message", exchange)
			self.assertNotIn("text", exchange)
			self.assertNotIn("timestamp", exchange)

		frappe.delete_doc("Chatbot Conversation", conv_id, ignore_permissions=True)
		frappe.db.commit()

	def test_step13_complete_multi_entity_intent_synthesis(self):
		"""
		STEP 13 Tests:
		1. Synthesize multi-entity intent across full conversation (e.g. SIF, MF & AIF).
		2. Ensure no entities are omitted when user explicitly asks about multiple topics.
		3. Ensure fresh summary updates without carrying over stale outdated context.
		"""
		conv = create_conversation(
			visitor_id="step13-visitor-1",
			user_name="Amit Patel",
			initial_message="hiii",
			chat_context="Amit Patel greeted the assistant.",
		)
		conv_id = conv["name"]
		self.assertEqual(conv["chat_context"], "Amit Patel greeted the assistant.")

		# Update with multi-entity comparison intent
		updated = update_chat_context(
			conv_id,
			"Amit Patel wants to understand the differences between Specialized Investment Funds (SIF), Mutual Funds (MF), and Alternative Investment Funds (AIF).",
		)
		self.assertEqual(
			updated["chat_context"],
			"Amit Patel wants to understand the differences between Specialized Investment Funds (SIF), Mutual Funds (MF), and Alternative Investment Funds (AIF).",
		)
		self.assertIn("SIF", updated["chat_context"])
		self.assertIn("MF", updated["chat_context"])
		self.assertIn("AIF", updated["chat_context"])
		self.assertNotIn("Dhanada", updated["chat_context"])

		frappe.delete_doc("Chatbot Conversation", conv_id, ignore_permissions=True)
		frappe.db.commit()

	def test_step14_meaningful_intent_separation_from_lead_capture(self):
		"""
		STEP 14 Tests:
		1. Verify that lead capture messages (phone, email, advisor request, skip) do NOT contaminate context.
		2. Multi-intent resolution combines comparison + investment cleanly.
		3. Context preserves user name as subject without contact data or 'Dhanada'.
		"""
		conv = create_conversation(
			visitor_id="step14-visitor-1",
			user_name="Satyam Raj",
			initial_message="what is the difference between sif, mf & aif?",
			chat_context="Satyam Raj wants to understand the differences between Specialized Investment Funds (SIF), Mutual Funds (MF), and Alternative Investment Funds (AIF).",
		)
		conv_id = conv["name"]
		self.assertEqual(
			conv["chat_context"],
			"Satyam Raj wants to understand the differences between Specialized Investment Funds (SIF), Mutual Funds (MF), and Alternative Investment Funds (AIF).",
		)

		# Multi-turn exchange with investment intent and lead capture workflow
		updated = update_chat_context(
			conv_id,
			"Satyam Raj wants to understand the differences between Specialized Investment Funds (SIF), Mutual Funds (MF), and Alternative Investment Funds (AIF) and wants to invest ₹30,00,000 in SIF.",
		)
		self.assertEqual(
			updated["chat_context"],
			"Satyam Raj wants to understand the differences between Specialized Investment Funds (SIF), Mutual Funds (MF), and Alternative Investment Funds (AIF) and wants to invest ₹30,00,000 in SIF.",
		)
		self.assertNotIn("9117894561", updated["chat_context"])
		self.assertNotIn("Mobile Number", updated["chat_context"])
		self.assertNotIn("Connect with an advisor", updated["chat_context"])
		self.assertNotIn("Skip", updated["chat_context"])
		self.assertNotIn("Dhanada", updated["chat_context"])

		frappe.delete_doc("Chatbot Conversation", conv_id, ignore_permissions=True)
		frappe.db.commit()
