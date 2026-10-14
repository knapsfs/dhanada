import json
import os
import time
import unittest
from datetime import date
from unittest.mock import MagicMock, patch

import frappe
import requests

from dhanada.APIs.chatbot import chatbot_response
from dhanada.APIs.financial_retriever import (
	_SCHEME_INDEX_CACHE,
	_SCHEME_INDEX_CACHED_AT,
	CACHE_TTL_SECONDS,
	extract_date_from_query,
	find_matching_schemes,
	format_display_date,
	get_financial_grounding_or_response,
	get_scheme_index,
	handle_ambiguous_scheme,
	handle_comparison,
	handle_historical_nav,
	handle_latest_nav,
	handle_performance,
	handle_sif_categories,
	handle_untracked_mutual_fund,
	invalidate_scheme_index_cache,
	is_sif_category_query,
	is_traditional_untracked_mutual_fund,
	on_scheme_document_change,
	schedule_scheme_index_invalidation,
)


class TestFinancialRetriever(unittest.TestCase):
	"""
	Comprehensive unit test suite for Phase 5B Financial Retriever and Chatbot Integration.
	Covers:
	1. Deterministic scheme matching (exact, alias, SEBI code)
	2. Ambiguity resolution and clarification prompts
	3. NAV dates and plan type inclusion (Regular - Growth)
	4. Missing data handling without inventing figures
	5. Historical dates (exact, weekend/holiday fallback, pre-inception, future dates)
	6. Masked returns (never presenting uncompleted performance as 0.0%)
	7. Scheme comparisons with date and masked returns
	8. Untracked traditional mutual funds with educational guidance & disclosure
	9. SIF categories listing
	10. 1-hour cache TTL and invalidation
	11. Chatbot flow integration (deterministic bypass of Ollama)
	12. Ollama failure fallback when grounding facts are present
	"""

	@classmethod
	def setUpClass(cls):
		cls.orig_cwd = os.getcwd()
		sites_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../sites"))
		os.chdir(sites_dir)
		frappe.init("newSite.local")
		frappe.connect()

	@classmethod
	def tearDownClass(cls):
		if hasattr(cls, "orig_cwd"):
			os.chdir(cls.orig_cwd)

	def setUp(self):
		try:
			_ = frappe.db.get_value
		except Exception:
			frappe.init("newSite.local")
			frappe.connect()
		if getattr(frappe, "db", None) and hasattr(frappe.db, "set_value"):
			if frappe.db.exists("SIF Scheme Plan", "INF209K30107") and frappe.db.get_value("SIF Scheme Plan", "INF209K30107", "nav") != 9.91:
				frappe.db.set_value("SIF Scheme Plan", "INF209K30107", "nav", 9.91)
				frappe.db.commit()
		frappe.set_user("Guest")
		frappe.local.request = MagicMock()
		frappe.local.request.data = b"{}"
		frappe.local.request_ip = f"127.0.{abs(hash(self._testMethodName)) % 250}.1"
		frappe.local.form_dict = frappe._dict()

		invalidate_scheme_index_cache()

	def tearDown(self):
		invalidate_scheme_index_cache()

	# -------------------------------------------------------------------------
	# 1. Scheme Matching & Disambiguation Tests
	# -------------------------------------------------------------------------

	def test_scheme_matching_exact_name(self):
		"""Test exact scheme matching for registered SIF schemes."""
		matches, is_ambiguous = find_matching_schemes("What is the NAV of Apex Equity Long-Short Fund?")
		self.assertFalse(is_ambiguous)
		self.assertEqual(len(matches), 1)
		self.assertEqual(matches[0]["name"], "Apex Equity Long-Short Fund")

	def test_scheme_matching_core_alias(self):
		"""Test scheme matching without noise words (sif, fund, punctuation)."""
		matches, is_ambiguous = find_matching_schemes("Apex Equity Long Short returns")
		self.assertFalse(is_ambiguous)
		self.assertEqual(len(matches), 1)
		self.assertEqual(matches[0]["name"], "Apex Equity Long-Short Fund")

	def test_scheme_matching_sebi_code(self):
		"""Test matching directly via SEBI registration code."""
		matches, is_ambiguous = find_matching_schemes("Details of APEX/O/E/ELSF/26/06/0003/ABSL")
		self.assertFalse(is_ambiguous)
		self.assertEqual(len(matches), 1)
		self.assertEqual(matches[0]["name"], "Apex Equity Long-Short Fund")

	def test_ambiguous_scheme_matching_returns_clarification(self):
		"""Requirement 5: Query matching multiple schemes prompts for clarification."""
		matches, is_ambiguous = find_matching_schemes("What is the NAV of Apex?")
		self.assertTrue(is_ambiguous)
		self.assertGreaterEqual(len(matches), 3)

		res = handle_ambiguous_scheme("Apex", matches)
		self.assertIn("I found", res["message"])
		self.assertIn("Apex Equity Long-Short Fund", res["message"])
		self.assertIn("Which specific scheme would you like to know about?", res["message"])
		self.assertIn("Apex Equity Long-Short Fund", res["suggestions"])
		self.assertFalse(res["leadOpportunity"]["isAppropriateNow"])

	# -------------------------------------------------------------------------
	# 2. Date Parsing Tests
	# -------------------------------------------------------------------------

	def test_date_extraction_formats(self):
		"""Test date extraction across YYYY-MM-DD, DD-MM-YYYY, DD Mon YYYY, Mon DD YYYY."""
		self.assertEqual(extract_date_from_query("NAV on 2026-06-15 for Apex"), date(2026, 6, 15))
		self.assertEqual(extract_date_from_query("NAV on 15-Jun-2026 for Apex"), date(2026, 6, 15))
		self.assertEqual(extract_date_from_query("NAV on 15th June 2026 for Apex"), date(2026, 6, 15))
		self.assertEqual(extract_date_from_query("NAV on June 15, 2026 for Apex"), date(2026, 6, 15))
		self.assertEqual(extract_date_from_query("NAV on 15/06/2026 for Apex"), date(2026, 6, 15))

	# -------------------------------------------------------------------------
	# 3. Latest NAV Tests
	# -------------------------------------------------------------------------

	def test_latest_nav_includes_date_and_plan_type(self):
		"""Requirement 4: Every NAV response must include its date and plan type."""
		res, grounding = get_financial_grounding_or_response("What is the latest NAV of Apex Equity Long-Short Fund?")
		self.assertIsNotNone(res)
		self.assertIsNone(grounding)
		self.assertIn("Regular - Growth Plan", res["message"])
		self.assertIn("06-Oct-2026", res["message"])
		self.assertIn("₹9.91", res["message"])
		self.assertTrue(res["leadOpportunity"]["isAppropriateNow"])
		self.assertIn("Apex Equity Long-Short Fund", res["leadOpportunity"]["offerMessage"])

	def test_missing_latest_nav_does_not_invent_figures(self):
		"""Requirement 5: Never invent figures when data is missing."""
		mock_empty = {
			"status": "success",
			"data": {
				"name": "Newly Incepted SIF",
				"selectedPlan": {"type": "Regular", "option": "Growth", "nav": None, "nav_date": None},
			},
		}
		with patch("dhanada.APIs.financial_retriever.get_fund_details", return_value=mock_empty):
			res = handle_latest_nav(999, "Newly Incepted SIF")
			self.assertIn("currently not available", res["message"])
			self.assertNotIn("₹", res["message"])
			self.assertFalse(res["leadOpportunity"]["isAppropriateNow"])

	# -------------------------------------------------------------------------
	# 4. Historical NAV Tests
	# -------------------------------------------------------------------------

	def test_historical_nav_exact_trading_day(self):
		"""Requirement 4: Historical NAV on a valid trading day returns verified NAV with date and plan."""
		res, _ = get_financial_grounding_or_response(
			"What was the NAV of DynaSIF Equity Long - Short Fund on 15-Jun-2026?"
		)
		self.assertIsNotNone(res)
		self.assertIn("15-Jun-2026", res["message"])
		self.assertIn("Regular - Growth Plan", res["message"])
		self.assertIn("₹10.3375", res["message"])

	def test_historical_nav_weekend_fallback_to_preceding_trading_day(self):
		"""Requirement 4: Weekend date informs user market was closed and provides previous trading day NAV."""
		res, _ = get_financial_grounding_or_response(
			"What was the NAV of DynaSIF Equity Long - Short Fund on 14-Jun-2026?"
		)
		self.assertIsNotNone(res)
		self.assertIn("Markets were closed on **14-Jun-2026**", res["message"])
		self.assertIn("12-Jun-2026", res["message"])
		self.assertIn("₹10.2002", res["message"])
		self.assertIn("Regular - Growth Plan", res["message"])

	def test_historical_nav_pre_inception_date(self):
		"""Requirement 5: Pre-inception query discloses that historical NAV is not available before launch."""
		res, _ = get_financial_grounding_or_response(
			"What was the NAV of DynaSIF Equity Long - Short Fund on 01-Jan-2024?"
		)
		self.assertIsNotNone(res)
		self.assertIn("prior to the fund's inception", res["message"])
		self.assertIn("27-Feb-2026", res["message"])

	def test_historical_nav_future_date(self):
		"""Requirement 5: Future date query discloses that future NAV cannot be retrieved."""
		res, _ = get_financial_grounding_or_response(
			"What will be the NAV of DynaSIF Equity Long - Short Fund on 01-Jan-2030?"
		)
		self.assertIsNotNone(res)
		self.assertIn("cannot be retrieved for a future date", res["message"])
		self.assertIn("06-Oct-2026", res["message"])

	def test_historical_nav_without_scheme_asks_for_scheme(self):
		"""Test historical date query with no fund specified asks user which scheme to check."""
		res, _ = get_financial_grounding_or_response("What was the NAV on 15-Jun-2026?")
		self.assertIsNotNone(res)
		self.assertIn("Which SIF scheme would you like to check?", res["message"])

	# -------------------------------------------------------------------------
	# 5. Performance & Returns Tests
	# -------------------------------------------------------------------------

	def test_performance_never_presents_unavailable_as_zero(self):
		"""Requirement 4: Never present unavailable performance as 0%."""
		res, _ = get_financial_grounding_or_response("What are the returns of Apex Equity Long-Short Fund?")
		self.assertIsNotNone(res)
		self.assertIn("Regular - Growth Plan", res["message"])
		self.assertIn("1 Day", res["message"])
		self.assertIn("+0.51%", res["message"])
		self.assertIn("1 Month", res["message"])
		self.assertIn("-1.10%", res["message"])
		# Unavailable horizons (1 Year, 3 Months, 6 Months) must NOT be shown as 0.00%
		self.assertNotIn("1 Year**: 0.00%", res["message"])
		self.assertNotIn("1 Year: 0.0%", res["message"])
		self.assertIn("Longer horizons", res["message"])
		self.assertIn("operating tenures", res["message"])
		# Regulatory disclaimer
		self.assertIn("Past performance is not indicative of future returns", res["message"])

	# -------------------------------------------------------------------------
	# 6. Scheme Comparison Tests
	# -------------------------------------------------------------------------

	def test_scheme_comparison_two_schemes(self):
		"""Requirement 3: Side-by-side scheme comparison for 2 funds."""
		res, _ = get_financial_grounding_or_response(
			"Compare Apex Equity Long-Short and DynaSIF Equity Long - Short"
		)
		self.assertIsNotNone(res)
		self.assertIn("Scheme Comparison", res["message"])
		self.assertIn("DynaSIF Equity Long - Short Fund", res["message"])
		self.assertIn("Apex Equity Long-Short Fund", res["message"])
		self.assertIn("Risk Band", res["message"])
		self.assertIn("Latest NAV", res["message"])
		self.assertTrue(res["leadOpportunity"]["isAppropriateNow"])

	# -------------------------------------------------------------------------
	# 7. Untracked Traditional Mutual Funds Tests
	# -------------------------------------------------------------------------

	def test_untracked_traditional_mutual_fund_educational_guidance_and_disclosure(self):
		"""Requirement 6: Educational guidance with live-data limitation disclosure for traditional mutual funds."""
		res, _ = get_financial_grounding_or_response("What is the NAV of HDFC Top 100?")
		self.assertIsNotNone(res)
		self.assertIn("Hdfc Top 100", res["message"])
		self.assertIn("Live Data Limitation", res["message"])
		self.assertIn("Specialized Investment Funds (SIFs)", res["message"])
		self.assertIn("amfiindia.com", res["message"])
		self.assertFalse(res["leadOpportunity"]["isAppropriateNow"])

	def test_untracked_traditional_mutual_fund_sbi_bluechip(self):
		"""Requirement 6: Disclose live-data limitation for SBI Bluechip."""
		res, _ = get_financial_grounding_or_response("Tell me the returns of SBI Bluechip fund")
		self.assertIsNotNone(res)
		self.assertIn("Sbi Bluechip", res["message"])
		self.assertIn("Live Data Limitation", res["message"])

	# -------------------------------------------------------------------------
	# 8. SIF Categories Tests
	# -------------------------------------------------------------------------

	def test_sif_categories_inquiry(self):
		"""Requirement 3: Returns the 7 SEBI registered SIF investment strategy subcategories."""
		res, _ = get_financial_grounding_or_response("What are the SIF categories?")
		self.assertIsNotNone(res)
		self.assertIn("Equity Long-Short Fund", res["message"])
		self.assertIn("Equity Ex-Top 100 Long-Short Fund", res["message"])
		self.assertIn("Active Asset Allocator Long-Short Fund", res["message"])
		self.assertIn("Hybrid Long-Short Fund", res["message"])
		self.assertIn("Sectoral Debt Long-Short Fund", res["message"])
		self.assertIn("Debt Long-Short Fund", res["message"])
		self.assertIn("Sector Rotation Long-Short Fund", res["message"])
		self.assertIn("₹10 Lakhs", res["message"])

	# -------------------------------------------------------------------------
	# 9. Scheme Index Caching Tests
	# -------------------------------------------------------------------------

	def test_scheme_index_cache_ttl_and_invalidation(self):
		"""Requirement 7: Scheme index cached for 1 hour with invalidation support."""
		invalidate_scheme_index_cache()
		idx1 = get_scheme_index()
		self.assertGreater(len(idx1), 0)

		# Second call should return cached instance
		idx2 = get_scheme_index()
		self.assertIs(idx1, idx2)

		# Invalidation clears cache
		invalidate_scheme_index_cache()
		idx3 = get_scheme_index()
		self.assertIsNot(idx1, idx3)

	def test_invalidation_handler_doc_events_signatures(self):
		"""Verify that cache invalidator and doc_events hook accept all Frappe document-event signatures safely."""
		mock_doc = MagicMock()
		mock_doc.doctype = "SIF Scheme"
		mock_doc.name = "Apex Equity Long-Short Fund"

		# Zero arguments (manual programmatic call)
		invalidate_scheme_index_cache()

		# Single argument (doc only)
		on_scheme_document_change(mock_doc)

		# Standard Frappe doc_events call (doc, method)
		on_scheme_document_change(mock_doc, "on_update")
		on_scheme_document_change(mock_doc, "after_insert")
		on_scheme_document_change(mock_doc, "on_trash")
		on_scheme_document_change(mock_doc, "after_delete")

		# Extra variadic positional & keyword arguments
		on_scheme_document_change(mock_doc, "on_update", "extra_arg", foo="bar")

	def test_invalidation_handler_transaction_safety(self):
		"""Verify that invalidation handler catches unexpected errors and never fails the document transaction."""
		mock_doc = MagicMock()
		mock_doc.doctype = "SIF Scheme"

		with patch("dhanada.APIs.financial_retriever.schedule_scheme_index_invalidation", side_effect=RuntimeError("Redis connection lost")):
			# Should not raise any exception
			try:
				on_scheme_document_change(mock_doc, "on_update")
			except Exception as e:
				self.fail(f"on_scheme_document_change raised an exception during doc event: {e}")

	def test_commit_triggers_cache_invalidation(self):
		"""Verify that a successful database transaction commit triggers cache invalidation."""
		import dhanada.APIs.financial_retriever as fr

		fr.invalidate_scheme_index_cache()
		fr.get_scheme_index()
		v_before = fr._SCHEME_INDEX_CACHE_VERSION
		self.assertIsNotNone(v_before)

		mock_doc = MagicMock()
		mock_doc.doctype = "SIF Scheme"
		on_scheme_document_change(mock_doc, "on_update")

		# Before commit: Redis version must NOT change yet!
		v_pre_commit = fr._get_remote_cache_version()
		self.assertEqual(v_before, v_pre_commit)

		# After commit: Redis version is bumped and cache is invalidated
		frappe.db.commit()
		v_post_commit = fr._get_remote_cache_version()
		self.assertNotEqual(v_before, v_post_commit)
		self.assertIsNone(fr._SCHEME_INDEX_CACHE)

	def test_rollback_does_not_trigger_cache_invalidation(self):
		"""Verify that a rolled-back transaction does NOT invalidate the shared cache or bump Redis."""
		import dhanada.APIs.financial_retriever as fr

		fr.invalidate_scheme_index_cache()
		fr.get_scheme_index()
		v_before = fr._SCHEME_INDEX_CACHE_VERSION
		self.assertIsNotNone(v_before)

		mock_doc = MagicMock()
		mock_doc.doctype = "SIF Scheme"
		on_scheme_document_change(mock_doc, "on_update")

		# Roll back transaction
		frappe.db.rollback()

		# After rollback: Redis version must remain unchanged and callback queue cleared
		v_after_rollback = fr._get_remote_cache_version()
		self.assertEqual(v_before, v_after_rollback)
		if getattr(frappe, "db", None) and hasattr(frappe.db, "after_commit"):
			funcs = getattr(frappe.db.after_commit, "_functions", ())
			self.assertNotIn(fr.invalidate_scheme_index_cache, funcs)

	def test_invalidation_deduplicated_within_same_transaction(self):
		"""Verify that multiple document events in the same transaction only enqueue a single callback."""
		import dhanada.APIs.financial_retriever as fr

		mock_doc1 = MagicMock()
		mock_doc1.doctype = "SIF Scheme"
		mock_doc2 = MagicMock()
		mock_doc2.doctype = "SIF Scheme Plan"

		# Trigger multiple doc events
		on_scheme_document_change(mock_doc1, "on_update")
		on_scheme_document_change(mock_doc2, "after_insert")
		on_scheme_document_change(mock_doc1, "on_update")

		if getattr(frappe, "db", None) and hasattr(frappe.db, "after_commit"):
			funcs = getattr(frappe.db.after_commit, "_functions", ())
			invalidator_count = sum(1 for f in funcs if f == fr.invalidate_scheme_index_cache)
			self.assertEqual(invalidator_count, 1)

		frappe.db.commit()

	def test_cross_worker_invalidation_via_redis_version(self):
		"""Simulate multi-worker environment: Worker 2 detects Redis version change made by Worker 1 and refreshes cache."""
		import dhanada.APIs.financial_retriever as fr

		fr.invalidate_scheme_index_cache()
		worker1_index = fr.get_scheme_index()
		worker1_version = fr._SCHEME_INDEX_CACHE_VERSION
		self.assertIsNotNone(worker1_version)

		# Simulate Worker 2 sharing the same initial state in its own memory
		worker2_cache = list(worker1_index)
		worker2_cached_at = fr._SCHEME_INDEX_CACHED_AT
		worker2_version = worker1_version

		# Now simulate Worker 1 invalidating the cache upon a committed scheme change
		mock_doc = MagicMock()
		mock_doc.doctype = "SIF Scheme"
		fr.on_scheme_document_change(mock_doc, "on_update")
		frappe.db.commit()

		# Redis version is now bumped to a new token
		current_redis_version = fr._get_remote_cache_version()
		self.assertNotEqual(current_redis_version, worker2_version)

		# Now restore Worker 2's local in-memory state to simulate Worker 2 receiving a user query
		fr._SCHEME_INDEX_CACHE = worker2_cache
		fr._SCHEME_INDEX_CACHED_AT = worker2_cached_at
		fr._SCHEME_INDEX_CACHE_VERSION = worker2_version

		# Worker 2 calls get_scheme_index(); it should detect version mismatch and rebuild
		rebuilt_index = fr.get_scheme_index()
		self.assertIsNot(rebuilt_index, worker2_cache)
		self.assertEqual(fr._SCHEME_INDEX_CACHE_VERSION, current_redis_version)

	def test_scheme_plan_lifecycle_triggers_invalidation(self):
		"""Verify that changes to SIF Scheme Plan safely trigger cache invalidation and bump the shared version."""
		import dhanada.APIs.financial_retriever as fr

		fr.invalidate_scheme_index_cache()
		fr.get_scheme_index()
		v_before = fr._SCHEME_INDEX_CACHE_VERSION

		mock_plan = MagicMock()
		mock_plan.doctype = "SIF Scheme Plan"
		mock_plan.name = "PLAN-001"
		mock_plan.scheme = "Apex Equity Long-Short Fund"

		fr.on_scheme_document_change(mock_plan, "on_update")
		frappe.db.commit()
		v_after = fr._get_remote_cache_version()

		self.assertNotEqual(v_before, v_after)
		self.assertIsNone(fr._SCHEME_INDEX_CACHE)

	def test_hooks_doc_events_registered(self):
		"""Verify that dhanada hooks.py registers doc_events for SIF Scheme and SIF Scheme Plan."""
		from dhanada import hooks

		self.assertTrue(hasattr(hooks, "doc_events"))
		self.assertIn("SIF Scheme", hooks.doc_events)
		self.assertIn("SIF Scheme Plan", hooks.doc_events)

		for dt in ["SIF Scheme", "SIF Scheme Plan"]:
			events = hooks.doc_events[dt]
			self.assertIn("after_insert", events)
			self.assertIn("on_update", events)
			self.assertIn("on_trash", events)
			self.assertEqual(
				events["on_update"],
				"dhanada.APIs.financial_retriever.on_scheme_document_change",
			)

	def test_live_scheme_doc_event_triggers_invalidation(self):
		"""Verify that actual Frappe document run_method('on_update') executes hook and invalidates cache on commit."""
		import dhanada.APIs.financial_retriever as fr

		fr.invalidate_scheme_index_cache()
		fr.get_scheme_index()
		v_before = fr._SCHEME_INDEX_CACHE_VERSION

		schemes = frappe.get_all("SIF Scheme", limit=1)
		if schemes:
			doc = frappe.get_doc("SIF Scheme", schemes[0].name)
			doc.run_method("on_update")
			# Prior to commit, version is not yet bumped
			v_mid = fr._get_remote_cache_version()
			self.assertEqual(v_before, v_mid)

			# On commit, after_commit hook fires
			frappe.db.commit()
			v_after = fr._get_remote_cache_version()
			self.assertNotEqual(v_before, v_after)
			self.assertIsNone(fr._SCHEME_INDEX_CACHE)

	# -------------------------------------------------------------------------
	# 10. Chatbot Flow Integration Tests
	# -------------------------------------------------------------------------

	@patch("requests.post")
	def test_chatbot_response_numerical_nav_bypasses_ollama(self, mock_post):
		"""Requirement 8: Straightforward numerical NAV query returns deterministically without calling Ollama."""
		req_body = {
			"conversation_history": [
				{"role": "user", "parts": [{"text": "What is the latest NAV of Apex Equity Long-Short Fund?"}]}
			],
			"system_instruction": "You are Riddhi.",
			"is_json": True,
		}
		frappe.local.request.data = json.dumps(req_body).encode("utf-8")

		res = chatbot_response()
		self.assertTrue(res["success"])
		# Ollama must NOT have been called!
		mock_post.assert_not_called()

		parsed = json.loads(res["message"])
		self.assertIn("₹9.91", parsed["message"])
		self.assertIn("06-Oct-2026", parsed["message"])
		self.assertIn("Regular - Growth Plan", parsed["message"])

	@patch("requests.post")
	def test_chatbot_response_ambiguous_scheme_bypasses_ollama(self, mock_post):
		"""Requirement 8: Ambiguous query returns clarification deterministically without calling Ollama."""
		req_body = {
			"conversation_history": [
				{"role": "user", "parts": [{"text": "What is the NAV of Apex?"}]}
			],
			"system_instruction": "You are Riddhi.",
			"is_json": True,
		}
		frappe.local.request.data = json.dumps(req_body).encode("utf-8")

		res = chatbot_response()
		self.assertTrue(res["success"])
		mock_post.assert_not_called()

		parsed = json.loads(res["message"])
		self.assertIn("I found 3 schemes", parsed["message"])

	@patch("requests.post")
	def test_chatbot_response_untracked_mutual_fund_bypasses_ollama(self, mock_post):
		"""Requirement 8: Untracked traditional mutual fund query returns disclosure without calling Ollama."""
		req_body = {
			"conversation_history": [
				{"role": "user", "parts": [{"text": "What is the NAV of HDFC Top 100?"}]}
			],
			"system_instruction": "You are Riddhi.",
			"is_json": True,
		}
		frappe.local.request.data = json.dumps(req_body).encode("utf-8")

		res = chatbot_response()
		self.assertTrue(res["success"])
		mock_post.assert_not_called()

		parsed = json.loads(res["message"])
		self.assertIn("Live Data Limitation", parsed["message"])

	@patch("requests.post")
	def test_chatbot_response_conversational_scheme_injects_facts_to_ollama(self, mock_post):
		"""Requirement 8: Conversational scheme query grounds Ollama with verified facts."""
		mock_resp = MagicMock()
		mock_resp.status_code = 200
		mock_resp.json.return_value = {
			"model": "qwen2.5:3b",
			"message": {
				"content": json.dumps({
					"message": "Apex Equity Long-Short Fund utilizes long equity positions and short hedging.",
					"suggestions": ["Latest NAV", "Returns"],
					"leadOpportunity": {"isAppropriateNow": True, "offerMessage": "Speak with an advisor"},
					"contextSummary": "Explained strategy for Apex Equity Long-Short Fund.",
				})
			},
		}
		mock_post.return_value = mock_resp

		req_body = {
			"conversation_history": [
				{"role": "user", "parts": [{"text": "Tell me about Apex Equity Long-Short Fund strategy."}]}
			],
			"system_instruction": "You are Riddhi.",
			"is_json": True,
		}
		frappe.local.request.data = json.dumps(req_body).encode("utf-8")

		res = chatbot_response()
		self.assertTrue(res["success"])
		mock_post.assert_called_once()

		# Verify that verified facts were injected into the system message sent to Ollama
		call_args, call_kwargs = mock_post.call_args
		payload = call_kwargs["json"]
		messages = payload["messages"]
		system_msg = next((m["content"] for m in messages if m["role"] == "system"), "")
		self.assertIn("VERIFIED FINANCIAL FACTS:", system_msg)
		self.assertIn("Apex Equity Long-Short Fund", system_msg)
		self.assertIn("LATEST NAV: ₹9.91", system_msg)

	@patch("requests.post")
	def test_chatbot_response_ollama_failure_with_grounding_facts_fallback(self, mock_post):
		"""Requirement 10: Graceful fallback when Ollama times out on a grounded scheme inquiry."""
		mock_post.side_effect = requests.exceptions.Timeout("Ollama timeout")

		req_body = {
			"conversation_history": [
				{"role": "user", "parts": [{"text": "Tell me about Apex Equity Long-Short Fund strategy."}]}
			],
			"system_instruction": "You are Riddhi.",
			"is_json": True,
		}
		frappe.local.request.data = json.dumps(req_body).encode("utf-8")

		res = chatbot_response()
		self.assertTrue(res["success"])
		parsed = json.loads(res["message"])
		self.assertIn("verified details", parsed["message"])
		self.assertIn("Apex Equity Long-Short Fund", parsed["message"])
		self.assertIn("LATEST NAV: ₹9.91", parsed["message"])

	# -------------------------------------------------------------------------
	# 13. Conversational Context & Follow-Up Regression Tests (Phase 5C)
	# -------------------------------------------------------------------------

	def test_followup_latest_nav_resolves_previous_scheme(self):
		"""Requirement 3 & 4: 'What is its latest NAV?' resolves previous scheme and returns fresh NAV."""
		history = [
			{"role": "user", "parts": [{"text": "Tell me about Apex Equity Long-Short Fund"}]},
			{
				"role": "model",
				"parts": [{"text": json.dumps({"message": "Apex Equity Long-Short Fund is a prominent SIF.", "contextSummary": "Discussed Apex Equity Long-Short Fund."})}],
			},
			{"role": "user", "parts": [{"text": "What is its latest NAV?"}]},
		]
		resp, facts = get_financial_grounding_or_response("What is its latest NAV?", history=history)
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("Apex Equity Long-Short Fund", resp["message"])
		self.assertIn("₹9.91", resp["message"])
		self.assertIn("06-Oct-2026", resp["message"])
		self.assertIn("Regular - Growth Plan", resp["message"])

	def test_followup_returns_resolves_previous_scheme(self):
		"""Requirement 3 & 4: 'What about its returns?' resolves previous scheme and returns fresh performance data."""
		history = [
			{"role": "user", "parts": [{"text": "What is the NAV of Apex Equity Long-Short Fund?"}]},
			{
				"role": "model",
				"parts": [{"text": json.dumps({"message": "The latest NAV for Apex Equity Long-Short Fund is ₹9.91", "contextSummary": "Provided NAV."})}],
			},
			{"role": "user", "parts": [{"text": "What about its returns?"}]},
		]
		resp, facts = get_financial_grounding_or_response("What about its returns?", history=history)
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("Apex Equity Long-Short Fund", resp["message"])
		self.assertIn("Performance for", resp["message"])
		self.assertIn("Regular - Growth Plan", resp["message"])

	def test_followup_specific_horizon_six_months(self):
		"""Phase 6C: 'How has it performed over six months?' resolves previous scheme and directly answers 6-month horizon."""
		history = [
			{"role": "user", "parts": [{"text": "Tell me about Apex Equity Long-Short Fund"}]},
			{
				"role": "model",
				"parts": [{"text": json.dumps({"message": "Details about Apex Equity Long-Short Fund", "contextSummary": "Discussed Apex Equity Long-Short Fund."})}],
			},
			{"role": "user", "parts": [{"text": "How has it performed over six months?"}]},
		]
		resp, facts = get_financial_grounding_or_response("How has it performed over six months?", history=history)
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("The **6 Months** return for **Apex Equity Long-Short Fund**", resp["message"])
		self.assertIn("not yet available", resp["message"])
		self.assertIn("operating tenure", resp["message"])

	def test_followup_specific_horizon_six_months_available(self):
		"""Phase 6C: 'How has it performed over six months?' directly returns available 6-month return for iSIF Hybrid."""
		history = [
			{"role": "user", "parts": [{"text": "What is the NAV of iSIF Hybrid Long-Short Fund?"}]},
			{
				"role": "model",
				"parts": [{"text": json.dumps({"message": "iSIF Hybrid details", "contextSummary": "Discussed iSIF Hybrid Long-Short Fund."})}],
			},
			{"role": "user", "parts": [{"text": "How has it performed over six months?"}]},
		]
		resp, facts = get_financial_grounding_or_response("How has it performed over six months?", history=history)
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("The **6 Months** return for **iSIF Hybrid Long-Short Fund**", resp["message"])
		self.assertIn("+9.86%", resp["message"])

	def test_specific_horizon_1_month_available(self):
		"""Phase 6C: 'What is its 1 month return?' answers the 1-month horizon directly."""
		history = [
			{"role": "user", "parts": [{"text": "What is the NAV of Apex Equity Long-Short Fund?"}]},
			{
				"role": "model",
				"parts": [{"text": json.dumps({"message": "The NAV is 9.91", "contextSummary": "Provided NAV."})}],
			},
			{"role": "user", "parts": [{"text": "What is its 1 month return?"}]},
		]
		resp, facts = get_financial_grounding_or_response("What is its 1 month return?", history=history)
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("The **1 Month** return for **Apex Equity Long-Short Fund**", resp["message"])
		self.assertIn("-1.10%", resp["message"])

	def test_specific_horizon_1_day_available(self):
		"""Phase 6C: Direct 1-day return query answers directly with positive sign."""
		resp, facts = get_financial_grounding_or_response("What is the 1 day return of Apex Equity Long-Short Fund?")
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("The **1 Day** return for **Apex Equity Long-Short Fund**", resp["message"])
		self.assertIn("+0.51%", resp["message"])

	def test_specific_horizon_1_week_available(self):
		"""Phase 6C: Direct 1-week return query answers directly."""
		resp, facts = get_financial_grounding_or_response("What is the 1 week return of Apex Equity Long-Short Fund?")
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("The **1 Week** return for **Apex Equity Long-Short Fund**", resp["message"])
		self.assertIn("+1.02%", resp["message"])

	def test_specific_horizon_3_months_unavailable(self):
		"""Phase 6C: Direct 3-month return query reports tenure limitation without displaying 0.0%."""
		resp, facts = get_financial_grounding_or_response("What is the 3 month return of Apex Equity Long-Short Fund?")
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("The **3 Months** return for **Apex Equity Long-Short Fund**", resp["message"])
		self.assertIn("not yet available", resp["message"])
		self.assertNotIn("0.0%", resp["message"])

	def test_specific_horizon_1_year_unavailable(self):
		"""Phase 6C: Direct 1-year return query reports tenure limitation without displaying 0.0%."""
		resp, facts = get_financial_grounding_or_response("What is the 1 year performance of Apex Equity Long-Short Fund?")
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("The **1 Year** return for **Apex Equity Long-Short Fund**", resp["message"])
		self.assertIn("not yet available", resp["message"])
		self.assertNotIn("0.0%", resp["message"])

	def test_followup_comparison_with_new_scheme(self):
		"""Requirement 3 & 6: 'Compare it with Apex Hybrid' pairs previous scheme with new scheme."""
		history = [
			{"role": "user", "parts": [{"text": "What is the NAV of Apex Equity Long-Short Fund?"}]},
			{
				"role": "model",
				"parts": [{"text": json.dumps({"message": "The latest NAV for Apex Equity Long-Short Fund is ₹9.91", "contextSummary": "Provided NAV."})}],
			},
			{"role": "user", "parts": [{"text": "Compare it with Apex Hybrid."}]},
		]
		resp, facts = get_financial_grounding_or_response("Compare it with Apex Hybrid.", history=history)
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("Scheme Comparison", resp["message"])
		self.assertIn("Apex Equity Long-Short Fund", resp["message"])
		self.assertIn("Apex Hybrid Long-Short Fund", resp["message"])

	def test_ambiguous_followup_after_comparison_prompts_clarification(self):
		"""Requirement 5 & 6: 'What about its returns?' after a comparison asks user to clarify between the two schemes."""
		history = [
			{"role": "user", "parts": [{"text": "Compare Apex Equity Long-Short and DynaSIF Equity Long - Short"}]},
			{
				"role": "model",
				"parts": [{"text": json.dumps({
					"message": "### Scheme Comparison\n**Apex Equity Long-Short Fund**\n...**DynaSIF Equity Long - Short Fund**...",
					"contextSummary": "Compared 2 schemes side-by-side."
				})}],
			},
			{"role": "user", "parts": [{"text": "What about its returns?"}]},
		]
		resp, facts = get_financial_grounding_or_response("What about its returns?", history=history)
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("You previously discussed", resp["message"])
		self.assertIn("Apex Equity Long-Short Fund", resp["message"])
		self.assertIn("DynaSIF Equity Long - Short Fund", resp["message"])
		self.assertIn("Which scheme's returns would you like to check?", resp["message"])
		self.assertTrue(any("Apex Equity Long-Short" in s for s in resp["suggestions"]))
		self.assertTrue(any("DynaSIF" in s for s in resp["suggestions"]))

	def test_ambiguous_comparison_after_comparison_prompts_clarification(self):
		"""Requirement 5 & 6: 'Compare it with Apex Hybrid' after comparing two schemes asks which one to compare."""
		history = [
			{"role": "user", "parts": [{"text": "Compare Apex Equity Long-Short and DynaSIF Equity Long - Short"}]},
			{
				"role": "model",
				"parts": [{"text": json.dumps({
					"message": "### Scheme Comparison\n**Apex Equity Long-Short Fund**\n...**DynaSIF Equity Long - Short Fund**...",
					"contextSummary": "Compared 2 schemes side-by-side."
				})}],
			},
			{"role": "user", "parts": [{"text": "Compare it with Apex Hybrid."}]},
		]
		resp, facts = get_financial_grounding_or_response("Compare it with Apex Hybrid.", history=history)
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("You previously discussed", resp["message"])
		self.assertIn("Which scheme would you like to compare with **Apex Hybrid Long-Short Fund**?", resp["message"])

	def test_missing_context_returns_inquiry_asks_for_scheme(self):
		"""Requirement 8: 'What about its returns?' without preceding scheme context asks for scheme name."""
		history = [
			{"role": "user", "parts": [{"text": "What is an SIF?"}]},
			{"role": "model", "parts": [{"text": "An SIF is a Specialised Investment Fund regulated by SEBI."}]},
			{"role": "user", "parts": [{"text": "What about its returns?"}]},
		]
		resp, facts = get_financial_grounding_or_response("What about its returns?", history=history)
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("Which SIF scheme would you like to check the returns for?", resp["message"])
		self.assertIn("Apex Equity Long-Short Fund", resp["message"])

	def test_missing_context_nav_inquiry_asks_for_scheme(self):
		"""Requirement 8: 'What is its latest NAV?' without preceding scheme context asks for scheme name."""
		history = [
			{"role": "user", "parts": [{"text": "What is an SIF?"}]},
			{"role": "model", "parts": [{"text": "An SIF is a Specialised Investment Fund."}]},
			{"role": "user", "parts": [{"text": "What is its latest NAV?"}]},
		]
		resp, facts = get_financial_grounding_or_response("What is its latest NAV?", history=history)
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("Which SIF scheme's NAV would you like to check?", resp["message"])

	def test_missing_context_comparison_asks_for_other_scheme(self):
		"""Requirement 8: 'Compare it with Apex Hybrid' without preceding scheme context asks for second scheme."""
		history = [
			{"role": "user", "parts": [{"text": "What is an SIF?"}]},
			{"role": "model", "parts": [{"text": "An SIF is a Specialised Investment Fund."}]},
			{"role": "user", "parts": [{"text": "Compare it with Apex Hybrid."}]},
		]
		resp, facts = get_financial_grounding_or_response("Compare it with Apex Hybrid.", history=history)
		self.assertIsNotNone(resp)
		self.assertIsNone(facts)
		self.assertIn("Which scheme would you like to compare with **Apex Hybrid Long-Short Fund**?", resp["message"])

	@patch("requests.post")
	def test_chatbot_response_followup_returns_bypasses_ollama(self, mock_post):
		"""Requirement 3 & 4: Full chatbot_response RPC handles follow-up returns deterministically without calling Ollama."""
		req_body = {
			"conversation_history": [
				{"role": "user", "parts": [{"text": "What is the NAV of Apex Equity Long-Short Fund?"}]},
				{
					"role": "model",
					"parts": [{"text": json.dumps({"message": "The latest NAV for Apex Equity Long-Short Fund is ₹9.91", "contextSummary": "Provided NAV."})}],
				},
				{"role": "user", "parts": [{"text": "What about its returns?"}]},
			],
			"system_instruction": "You are Riddhi.",
			"is_json": True,
		}
		frappe.local.request.data = json.dumps(req_body).encode("utf-8")

		res = chatbot_response()
		self.assertTrue(res["success"])
		mock_post.assert_not_called()

		parsed = json.loads(res["message"])
		self.assertIn("Performance for **Apex Equity Long-Short Fund**", parsed["message"])
		self.assertIn("Regular - Growth Plan", parsed["message"])


if __name__ == "__main__":
	unittest.main()
