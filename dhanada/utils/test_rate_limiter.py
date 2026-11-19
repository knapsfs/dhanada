# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

import time
import uuid
from concurrent.futures import ThreadPoolExecutor

import frappe
from frappe.tests import IntegrationTestCase

from dhanada.utils.rate_limiter import check_sliding_window_rate_limit, rate_limit


class TestSlidingWindowRateLimiter(IntegrationTestCase):
	def setUp(self):
		self.test_prefix = f"test_rl:{uuid.uuid4().hex[:8]}"
		frappe.local.test_rate_limit = True

	def tearDown(self):
		if hasattr(frappe.local, "test_rate_limit"):
			delattr(frappe.local, "test_rate_limit")
		if hasattr(frappe.local, "request_ip"):
			delattr(frappe.local, "request_ip")
		if hasattr(frappe.local, "request"):
			delattr(frappe.local, "request")
		if hasattr(frappe.local, "form_dict"):
			frappe.local.form_dict = frappe._dict()

	def _make_key(self, endpoint: str, ip: str, window: int) -> bytes:
		return frappe.cache.make_key(f"{self.test_prefix}:{endpoint}:{ip}:{window}")

	def test_01_requests_below_and_at_limit(self):
		"""Test that requests below and at the limit are allowed."""
		key = self._make_key("test_api", "192.168.1.1", 60)
		limit = 5

		for _ in range(limit):
			allowed = check_sliding_window_rate_limit(key, limit=limit, window_seconds=60)
			self.assertTrue(allowed, "Requests within the limit must be allowed")

	def test_02_requests_above_limit_rejected(self):
		"""Test that requests exceeding the limit are rejected (rate limited)."""
		key = self._make_key("test_api", "192.168.1.2", 60)
		limit = 3

		for _ in range(limit):
			self.assertTrue(check_sliding_window_rate_limit(key, limit=limit, window_seconds=60))

		# Next requests must be denied
		for _ in range(3):
			self.assertFalse(check_sliding_window_rate_limit(key, limit=limit, window_seconds=60))

	def test_03_sliding_window_boundary_recovery(self):
		"""Test that older requests age out of the sliding window strictly by timestamp."""
		key = self._make_key("test_boundary", "192.168.1.3", 30)
		limit = 3
		window = 30.0

		base_time = 1000.0

		# 3 requests at t = 1000, 1010, 1020
		self.assertTrue(check_sliding_window_rate_limit(key, limit, window, current_time=base_time))
		self.assertTrue(check_sliding_window_rate_limit(key, limit, window, current_time=base_time + 10))
		self.assertTrue(check_sliding_window_rate_limit(key, limit, window, current_time=base_time + 20))

		# At t = 1025 -> inside window [995, 1025], count is 3 -> rejected
		self.assertFalse(check_sliding_window_rate_limit(key, limit, window, current_time=base_time + 25))

		# At t = 1030.5 -> window is [1000.5, 1030.5], request at 1000 has expired, count is 2 -> allowed!
		self.assertTrue(check_sliding_window_rate_limit(key, limit, window, current_time=base_time + 30.5))

		# Count is now 3 (1010, 1020, 1030.5) -> immediate next request at 1030.6 is rejected
		self.assertFalse(check_sliding_window_rate_limit(key, limit, window, current_time=base_time + 30.6))

		# At t = 1040.5 -> request at 1010 expired -> allowed
		self.assertTrue(check_sliding_window_rate_limit(key, limit, window, current_time=base_time + 40.5))

	def test_04_burst_traffic_sliding_window_guarantee(self):
		"""Test that burst at window edge cannot exceed limit in any continuous window."""
		key = self._make_key("test_burst", "192.168.1.4", 60)
		limit = 5
		window = 60.0

		base_time = 2000.0

		# 5 requests in rapid burst at t = 2059.0
		for _ in range(5):
			self.assertTrue(
				check_sliding_window_rate_limit(key, limit, window, current_time=base_time + 59.0)
			)

		# Fixed window would reset at t = 2060.0, but sliding window maintains the 59.0 entries!
		# At t = 2060.1 -> window is [2000.1, 2060.1], still contains the 5 requests -> must reject!
		self.assertFalse(check_sliding_window_rate_limit(key, limit, window, current_time=base_time + 60.1))

		# Only after 60 seconds from the burst (t = 2119.1) does capacity open up
		self.assertTrue(check_sliding_window_rate_limit(key, limit, window, current_time=base_time + 119.1))

	def test_05_concurrency_race_condition_safety(self):
		"""Test that multiple concurrent threads cannot bypass the rate limiter."""
		key = self._make_key("test_concurrency", "192.168.1.5", 60)
		limit = 8
		total_threads = 40

		def worker(_):
			return check_sliding_window_rate_limit(key, limit=limit, window_seconds=60)

		with ThreadPoolExecutor(max_workers=16) as executor:
			results = list(executor.map(worker, range(total_threads)))

		allowed_count = results.count(True)
		rejected_count = results.count(False)

		self.assertEqual(allowed_count, limit, f"Exactly {limit} requests should be allowed concurrently")
		self.assertEqual(rejected_count, total_threads - limit)

	def test_06_different_ips_independently_limited(self):
		"""Test that rate limits are isolated per client IP."""
		key_ip1 = self._make_key("test_ip_isolation", "10.0.0.1", 60)
		key_ip2 = self._make_key("test_ip_isolation", "10.0.0.2", 60)
		limit = 2

		# Saturate IP 1
		self.assertTrue(check_sliding_window_rate_limit(key_ip1, limit, 60))
		self.assertTrue(check_sliding_window_rate_limit(key_ip1, limit, 60))
		self.assertFalse(check_sliding_window_rate_limit(key_ip1, limit, 60))

		# IP 2 must not be affected
		self.assertTrue(check_sliding_window_rate_limit(key_ip2, limit, 60))
		self.assertTrue(check_sliding_window_rate_limit(key_ip2, limit, 60))
		self.assertFalse(check_sliding_window_rate_limit(key_ip2, limit, 60))

	def test_07_endpoint_key_isolation(self):
		"""Test that different endpoints are isolated even from the same IP."""
		key_ep1 = self._make_key("chatbot_response", "10.0.0.1", 60)
		key_ep2 = self._make_key("get_funds_list", "10.0.0.1", 60)
		limit = 2

		# Saturate endpoint 1
		self.assertTrue(check_sliding_window_rate_limit(key_ep1, limit, 60))
		self.assertTrue(check_sliding_window_rate_limit(key_ep1, limit, 60))
		self.assertFalse(check_sliding_window_rate_limit(key_ep1, limit, 60))

		# Endpoint 2 remains available
		self.assertTrue(check_sliding_window_rate_limit(key_ep2, limit, 60))
		self.assertTrue(check_sliding_window_rate_limit(key_ep2, limit, 60))
		self.assertFalse(check_sliding_window_rate_limit(key_ep2, limit, 60))

	def test_08_decorator_raises_429_rate_limit_exceeded_error(self):
		"""Test that the @rate_limit decorator raises frappe.RateLimitExceededError (HTTP 429)."""
		frappe.local.request_ip = "192.168.1.99"
		frappe.local.form_dict = frappe._dict({"cmd": f"test_cmd_{uuid.uuid4().hex[:6]}"})

		@rate_limit(limit=2, seconds=60, ip_based=True)
		def dummy_api():
			return "success"

		self.assertEqual(dummy_api(), "success")
		self.assertEqual(dummy_api(), "success")

		with self.assertRaises(frappe.RateLimitExceededError):
			dummy_api()

	def test_09_decorator_method_filtering(self):
		"""Test that requests with non-targeted HTTP methods bypass the rate limit."""
		frappe.local.request_ip = "192.168.1.100"
		frappe.local.form_dict = frappe._dict({"cmd": f"test_method_cmd_{uuid.uuid4().hex[:6]}"})

		# Simulate request object
		class MockRequest:
			def __init__(self, method):
				self.method = method
				self.remote_addr = "192.168.1.100"

		@rate_limit(limit=1, seconds=60, methods="POST", ip_based=True)
		def post_only_api():
			return "ok"

		# GET requests should bypass the POST rate limit
		frappe.local.request = MockRequest("GET")
		for _ in range(5):
			self.assertEqual(post_only_api(), "ok")

		# POST requests should be limited
		frappe.local.request = MockRequest("POST")
		self.assertEqual(post_only_api(), "ok")
		with self.assertRaises(frappe.RateLimitExceededError):
			post_only_api()

		frappe.local.request = None
