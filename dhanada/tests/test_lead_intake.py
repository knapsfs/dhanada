# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import json
import frappe
from frappe.tests.utils import FrappeTestCase

from dhanada.api import create_chatbot_lead, create_website_lead, submit_risk_profile
from dhanada.sif.conversation_service import (
	create_conversation,
	get_conversation,
	get_conversation_url,
	get_lead_url,
)


class TestLeadIntake(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")
		# Reset form_dict and local request
		frappe.local.form_dict = frappe._dict()
		frappe.local.request = None
		frappe.local.request_ip = None
		if hasattr(frappe.local, "response"):
			frappe.local.response = frappe._dict({"message": None})

	def tearDown(self):
		frappe.local.request = None
		frappe.local.request_ip = None

	def test_website_lead_creation_and_fields(self):
		"""Verify website form creates a native Lead DocType with correct field mapping and response."""
		frappe.local.form_dict = frappe._dict({
			"full_name": "Vikramaditya Roy",
			"email": "vikram.roy.test@example.com",
			"phone": "+91 9876543210",
			"product": "Specialized Investment Fund (SIF)",
			"notes": "Interested in quantitative long-short strategy.",
			"source": "Website Form",
		})

		res = create_website_lead()
		self.assertTrue(res.get("success"))
		lead_name = res.get("lead_name")
		self.assertTrue(lead_name)
		self.assertTrue(lead_name.startswith("LEAD-"))

		# Verify native Lead document fields
		self.assertTrue(frappe.db.exists("Lead", lead_name))
		lead = frappe.get_doc("Lead", lead_name)
		self.assertEqual(lead.first_name, "Vikramaditya")
		self.assertEqual(lead.last_name, "Roy")
		self.assertEqual(lead.lead_name, "Vikramaditya Roy")
		self.assertEqual(lead.email, "vikram.roy.test@example.com")
		self.assertEqual(lead.mobile_no, "9876543210")
		self.assertEqual(lead.source, "Website Form")
		self.assertEqual(lead.status, "New")
		self.assertEqual(lead.product_interest, "Specialized Investment Fund (SIF)")
		self.assertEqual(lead.notes, "Interested in quantitative long-short strategy.")
		self.assertIn("Enquiry Note: Interested in quantitative long-short strategy.", lead.chat_context or "")

		# Cleanup
		frappe.delete_doc("Lead", lead_name, ignore_permissions=True, force=True)

	def test_website_lead_duplicate_matching(self):
		"""Verify subsequent submission with same email updates existing Lead rather than duplicating."""
		frappe.local.form_dict = frappe._dict({
			"full_name": "Ananya Sen",
			"email": "ananya.sen.dup@example.com",
			"phone": "9812341234",
			"product": "Mutual Funds",
			"notes": "Initial contact.",
		})
		res1 = create_website_lead()
		self.assertTrue(res1.get("success"))
		lead_id1 = res1.get("lead_name")

		# Second submission with same email, updated product interest and notes
		frappe.local.form_dict = frappe._dict({
			"full_name": "Ananya Sen",
			"email": "ananya.sen.dup@example.com",
			"phone": "9812341234",
			"product": "Long-Short SIF Fund",
			"notes": "Follow-up question about liquidity.",
		})
		res2 = create_website_lead()
		self.assertTrue(res2.get("success"))
		lead_id2 = res2.get("lead_name")

		# Must match existing lead, no duplicate created
		self.assertEqual(lead_id1, lead_id2)
		lead = frappe.get_doc("Lead", lead_id1)
		self.assertEqual(lead.product_interest, "Long-Short SIF Fund")
		self.assertIn("Initial contact.", lead.notes)
		self.assertIn("Follow-up question about liquidity.", lead.notes)

		# Cleanup
		frappe.delete_doc("Lead", lead_id1, ignore_permissions=True, force=True)

	def test_chatbot_lead_creation_and_conversation_link(self):
		"""Verify chatbot creates native Lead and establishes two-way relationship with Chatbot Conversation."""
		conv = create_conversation(
			visitor_id="visitor-intake-test-1",
			user_name="Sameer Verma",
			email="sameer.verma.test@example.com",
			phone="9823456789",
			initial_message="Can I invest through NRI account?",
			chat_context="Inquired about FEMA compliance for NRI SIF investments.",
		)
		conv_id = conv["name"]

		frappe.local.form_dict = frappe._dict({
			"full_name": "Sameer Verma",
			"email": "sameer.verma.test@example.com",
			"phone": "9823456789",
			"interest": "NRI SIF Portfolio",
			"conversation_id": conv_id,
			"visitor_id": "visitor-intake-test-1",
		})

		res = create_chatbot_lead()
		self.assertTrue(res.get("success"))
		lead_name = res.get("lead_name")
		self.assertTrue(lead_name)
		self.assertTrue(lead_name.startswith("LEAD-"))

		# Check Lead doc
		lead = frappe.get_doc("Lead", lead_name)
		self.assertEqual(lead.lead_name, "Sameer Verma")
		self.assertEqual(lead.email, "sameer.verma.test@example.com")
		self.assertEqual(lead.mobile_no, "9823456789")
		self.assertEqual(lead.source, "Website Chatbot")
		self.assertEqual(lead.product_interest, "NRI SIF Portfolio")
		self.assertEqual(lead.chatbot_conversation, conv_id)

		# Check Chatbot Conversation doc
		conv_doc = frappe.get_doc("Chatbot Conversation", conv_id)
		self.assertEqual(conv_doc.lead_id, lead_name)
		self.assertEqual(conv_doc.conversation_url, lead_name)

		# Check route generators
		lead_url = get_lead_url(lead_name)
		self.assertEqual(lead_url, f"/app/lead/{lead_name}")

		conv_url = get_conversation_url(conv_id)
		self.assertEqual(conv_url, f"/app/lead/{lead_name}")

		# Cleanup
		frappe.delete_doc("Lead", lead_name, ignore_permissions=True, force=True)
		frappe.delete_doc("Chatbot Conversation", conv_id, ignore_permissions=True, force=True)

	def test_cross_component_duplicate_prevention(self):
		"""Verify website form lead is recognized and linked when same user uses chatbot."""
		# 1. User submits website form
		frappe.local.form_dict = frappe._dict({
			"full_name": "Neha Joshi",
			"email": "neha.joshi.cross@example.com",
			"phone": "9834567890",
			"product": "Specialized Investment Fund",
			"notes": "Requesting prospectus.",
		})
		web_res = create_website_lead()
		self.assertTrue(web_res.get("success"))
		web_lead_name = web_res.get("lead_name")

		# 2. Same user later chats with chatbot
		conv = create_conversation(
			visitor_id="visitor-cross-test",
			user_name="Neha Joshi",
			email="neha.joshi.cross@example.com",
			phone="9834567890",
			initial_message="I previously submitted a form. Can I speak to an advisor?",
		)
		frappe.local.form_dict = frappe._dict({
			"email": "neha.joshi.cross@example.com",
			"mobile": "9834567890",
			"conversation_id": conv["name"],
			"visitor_id": "visitor-cross-test",
			"interest": "Advisor Consultation",
		})
		chat_res = create_chatbot_lead()
		self.assertTrue(chat_res.get("success"))
		chat_lead_name = chat_res.get("lead_name")

		# Must be the exact same lead record
		self.assertEqual(web_lead_name, chat_lead_name)

		# Verify lead has conversation linked and updated product
		lead = frappe.get_doc("Lead", web_lead_name)
		self.assertEqual(lead.chatbot_conversation, conv["name"])
		self.assertEqual(lead.product_interest, "Advisor Consultation")

		# Cleanup
		frappe.delete_doc("Lead", web_lead_name, ignore_permissions=True, force=True)
		frappe.delete_doc("Chatbot Conversation", conv["name"], ignore_permissions=True, force=True)

	def test_risk_profiler_lead_creation_and_submission(self):
		"""Verify submit_risk_profile saves to native Lead and creates Risk Profiler Submission."""
		frappe.local.form_dict = frappe._dict({
			"full_name": "Deepak Singhal",
			"email": "deepak.singhal.risk@example.com",
			"phone": "9845678901",
			"product": "Equity Long-Short Strategy",
			"profile": "Moderately Aggressive",
			"score": 21,
			"max_score": 25,
			"answers": [
				{"questionTitle": "Investment Horizon", "selectedOptionText": "5+ years", "score": 5},
				{"questionTitle": "Market Volatility Reaction", "selectedOptionText": "Buy more during dips", "score": 5},
			],
		})

		res = submit_risk_profile()
		self.assertTrue(res.get("success"))
		lead_name = res.get("lead_name")
		self.assertTrue(lead_name)
		self.assertTrue(lead_name.startswith("LEAD-"))
		self.assertEqual(res.get("profile"), "Moderately Aggressive")
		self.assertEqual(res.get("score"), 21)

		# Check native Lead record
		lead = frappe.get_doc("Lead", lead_name)
		self.assertEqual(lead.lead_name, "Deepak Singhal")
		self.assertEqual(lead.email, "deepak.singhal.risk@example.com")
		self.assertEqual(lead.mobile_no, "9845678901")
		self.assertEqual(lead.source, "Investor Risk Profiler")
		self.assertEqual(lead.risk_profile, "Moderately Aggressive")
		self.assertEqual(lead.risk_score, 21)
		self.assertEqual(lead.risk_profiler_status, "Completed")
		self.assertTrue(lead.risk_profiler_completed_on)
		self.assertIn("Investor Risk Profile: Moderately Aggressive", lead.chat_context)
		self.assertIn("Score: 21/25", lead.chat_context)

		# Check Risk Profiler Submission record
		submissions = frappe.get_all(
			"Risk Profiler Submission",
			filters={"lead": lead_name},
			fields=["name", "score", "risk_profile", "status"],
		)
		self.assertTrue(len(submissions) >= 1)
		sub = submissions[0]
		self.assertEqual(sub.score, 21)
		self.assertEqual(sub.risk_profile, "Moderately Aggressive")
		self.assertEqual(sub.status, "Submitted")

		# Cleanup
		for s in submissions:
			frappe.delete_doc("Risk Profiler Submission", s.name, ignore_permissions=True, force=True)
		frappe.delete_doc("Lead", lead_name, ignore_permissions=True, force=True)

	def test_risk_profiler_updates_existing_lead(self):
		"""Verify submit_risk_profile updates existing Lead when user previously registered."""
		# Create initial lead
		lead = frappe.get_doc({
			"doctype": "Lead",
			"lead_name": "Rohan Deshmukh",
			"email": "rohan.deshmukh.test@example.com",
			"mobile_no": "9856789012",
			"source": "Website",
			"status": "New",
		})
		lead.insert(ignore_permissions=True)
		frappe.db.commit()
		initial_lead_name = lead.name

		# Now user completes risk profiler
		frappe.local.form_dict = frappe._dict({
			"full_name": "Rohan Deshmukh",
			"email": "rohan.deshmukh.test@example.com",
			"phone": "9856789012",
			"product": "Investor Risk Profiler",
			"profile": "Aggressive",
			"score": 24,
			"max_score": 25,
		})

		res = submit_risk_profile()
		self.assertTrue(res.get("success"))
		self.assertEqual(res.get("lead_name"), initial_lead_name)

		# Verify lead fields updated
		updated_lead = frappe.get_doc("Lead", initial_lead_name)
		self.assertEqual(updated_lead.risk_profile, "Aggressive")
		self.assertEqual(updated_lead.risk_score, 24)
		self.assertEqual(updated_lead.risk_profiler_status, "Completed")

		# Cleanup
		subs = frappe.get_all("Risk Profiler Submission", filters={"lead": initial_lead_name})
		for s in subs:
			frappe.delete_doc("Risk Profiler Submission", s.name, ignore_permissions=True, force=True)
		frappe.delete_doc("Lead", initial_lead_name, ignore_permissions=True, force=True)

	def test_lead_source_resolution_and_fallback(self):
		"""Verify unknown sources are safely handled or auto-created without breaking."""
		frappe.local.form_dict = frappe._dict({
			"full_name": "Aditi Roy",
			"email": "aditi.roy.source@example.com",
			"phone": "9867890123",
			"source": "Myth or Fact Quiz",
			"notes": "Score 5/5",
		})

		res = create_website_lead()
		self.assertTrue(res.get("success"))
		lead_name = res.get("lead_name")

		lead = frappe.get_doc("Lead", lead_name)
		self.assertEqual(lead.source, "Myth or Fact Quiz")
		self.assertTrue(frappe.db.exists("Lead Source", "Myth or Fact Quiz"))

		# Cleanup
		frappe.delete_doc("Lead", lead_name, ignore_permissions=True, force=True)
		frappe.delete_doc("Lead Source", "Myth or Fact Quiz", ignore_permissions=True, force=True)

	def test_invalid_input_handling(self):
		"""Verify validation errors return clean 400 response without throwing unhandled exceptions."""
		# Missing full_name
		frappe.local.form_dict = frappe._dict({
			"email": "missing.name@example.com",
			"phone": "9876543210",
		})
		res1 = create_website_lead()
		self.assertFalse(res1.get("success"))
		self.assertIn("Full Name is a required field", res1.get("message", ""))

		# Missing both email and phone
		frappe.local.form_dict = frappe._dict({
			"full_name": "No Contact User",
		})
		res2 = create_website_lead()
		self.assertFalse(res2.get("success"))
		self.assertIn("Please provide either your email address or phone number", res2.get("message", ""))

		# Risk profiler invalid email
		frappe.local.form_dict = frappe._dict({
			"full_name": "Invalid Email User",
			"email": "not-an-email",
			"phone": "9876543210",
		})
		res3 = submit_risk_profile()
		self.assertFalse(res3.get("success"))
		self.assertIn("valid Email Address is required", res3.get("message", ""))

	def test_guest_lead_creation_and_api_contract(self):
		"""Verify guests can create leads and the API response contract strictly matches frontend expectations."""
		frappe.set_user("Guest")
		try:
			# Website form contract
			frappe.local.form_dict = frappe._dict({
				"full_name": "Guest Investor",
				"email": "guest.investor@example.com",
				"phone": "9988776655",
				"product": "Specialized Investment Fund",
			})
			res = create_website_lead()
			self.assertIsInstance(res, dict)
			self.assertTrue(res.get("success"))
			self.assertIn("lead_name", res)
			lead_id = res["lead_name"]
			self.assertTrue(lead_id.startswith("LEAD-"))
			frappe.set_user("Administrator")
			frappe.delete_doc("Lead", lead_id, ignore_permissions=True, force=True)

			# Chatbot form contract as guest
			frappe.set_user("Guest")
			frappe.local.form_dict = frappe._dict({
				"name": "Chatbot Guest User",
				"email": "guest.chatbot@example.com",
				"mobile": "9977886655",
				"interest": "Long-Short Derivative Funds",
			})
			c_res = create_chatbot_lead()
			self.assertIsInstance(c_res, dict)
			self.assertTrue(c_res.get("success"))
			self.assertIn("lead_name", c_res)
			c_lead_id = c_res["lead_name"]
			self.assertTrue(c_lead_id.startswith("LEAD-"))
			frappe.set_user("Administrator")
			frappe.delete_doc("Lead", c_lead_id, ignore_permissions=True, force=True)

			# Risk profiler contract as guest
			frappe.set_user("Guest")
			frappe.local.form_dict = frappe._dict({
				"name": "Guest Risk Taker",
				"email": "guest.risk@example.com",
				"mobile": "9966778855",
				"profile": "Aggressive",
				"score": 23,
			})
			r_res = submit_risk_profile()
			self.assertIsInstance(r_res, dict)
			self.assertTrue(r_res.get("success"))
			self.assertIn("lead_name", r_res)
			self.assertIn("profile", r_res)
			self.assertIn("score", r_res)
			self.assertIn("message", r_res)
			r_lead_id = r_res["lead_name"]
			frappe.set_user("Administrator")
			subs = frappe.get_all("Risk Profiler Submission", filters={"lead": r_lead_id})
			for s in subs:
				frappe.delete_doc("Risk Profiler Submission", s.name, ignore_permissions=True, force=True)
			frappe.delete_doc("Lead", r_lead_id, ignore_permissions=True, force=True)
		finally:
			frappe.set_user("Administrator")

