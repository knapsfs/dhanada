# Copyright (c) 2026, KNAPS Private Limited and contributors
# For license information, please see license.txt

"""Atomic Sliding-Window Rate Limiter for Dhanada APIs using Redis Lua Scripting."""

import time
import uuid
from collections.abc import Callable
from functools import wraps

import frappe
from frappe import _

SLIDING_WINDOW_LUA = """
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local member_id = ARGV[4]
local clear_before = now - window

-- Remove entries outside the sliding window
redis.call('ZREMRANGEBYSCORE', key, '-inf', clear_before)

-- Count entries within the sliding window
local current_count = redis.call('ZCARD', key)

if current_count < limit then
    redis.call('ZADD', key, now, member_id)
    redis.call('EXPIRE', key, math.ceil(window) + 2)
    return 1
else
    return 0
end
"""


def check_sliding_window_rate_limit(
	key: str | bytes,
	limit: int,
	window_seconds: int | float,
	current_time: float | None = None,
) -> bool:
	"""Atomically checks and records a request against a sliding-window rate limit.

	:param key: Redis cache key
	:param limit: Maximum allowed requests within the sliding window
	:param window_seconds: Duration of the sliding window in seconds
	:param current_time: Optional explicit timestamp (defaults to time.time())
	:return: True if the request is permitted, False if rate-limited.
	"""
	now = current_time if current_time is not None else time.time()
	member_id = f"{now}:{uuid.uuid4().hex[:12]}"

	try:
		res = frappe.cache.eval(
			SLIDING_WINDOW_LUA,
			1,
			key,
			now,
			window_seconds,
			limit,
			member_id,
		)
		return bool(res == 1)
	except Exception as exc:
		# Log cache failure and fail-open to avoid breaking API availability during Redis errors
		frappe.log_error(
			title="Rate Limiter Redis Error",
			message=f"Failed to evaluate sliding-window rate limiter for key {key}: {exc}",
		)
		return True


def rate_limit(
	key: str | None = None,
	limit: int | Callable = 5,
	seconds: int | Callable = 60,
	methods: str | list | tuple = "ALL",
	ip_based: bool = True,
):
	"""Decorator to rate limit an endpoint using an atomic sliding-window algorithm.

	Ensures that no client can exceed `limit` requests in any continuous `seconds` rolling window.
	Eliminates boundary burst attacks and race conditions present in fixed-window limiters.

	:param key: Optional form_dict key or identifier to combine with IP
	:param limit: Maximum requests permitted within the rolling window (int or callable)
	:param seconds: Window duration in seconds (int or callable)
	:param methods: Allowed HTTP methods to rate limit ('ALL', 'POST', ['GET', 'POST'], etc.)
	:param ip_based: Whether to rate limit per client IP address
	"""

	def ratelimit_decorator(fn):
		@wraps(fn)
		def wrapper(*args, **kwargs):
			# If called outside of a web request and not in explicit rate-limit testing mode, bypass
			req = getattr(frappe.local, "request", None)
			if not req:
				if not getattr(frappe.local, "request_ip", None) and not getattr(
					frappe.local, "test_rate_limit", False
				):
					return fn(*args, **kwargs)

			req_method = getattr(req, "method", None)
			if req_method and methods != "ALL":
				allowed_methods = (
					[methods.upper()] if isinstance(methods, str) else [m.upper() for m in methods]
				)
				if req_method.upper() not in allowed_methods:
					return fn(*args, **kwargs)

			_limit = limit() if callable(limit) else limit
			_seconds = seconds() if callable(seconds) else seconds

			ip = getattr(frappe.local, "request_ip", None)
			if not ip and req:
				ip = getattr(req, "remote_addr", None)
			if not ip:
				ip = "127.0.0.1" if ip_based else None

			user_key = frappe.form_dict.get(key, "") if hasattr(frappe, "form_dict") and key else ""

			identity = None
			if key and ip_based and ip:
				identity = f"{ip}:{user_key}"
			elif ip_based and ip:
				identity = ip
			elif user_key:
				identity = user_key

			if not identity:
				identity = "guest"

			cmd = getattr(getattr(frappe, "local", None), "form_dict", {}).get("cmd")
			if not cmd:
				cmd = f"{fn.__module__}.{fn.__name__}"

			cache_key = frappe.cache.make_key(f"dhanada:rl:{cmd}:{identity}:{_seconds}")

			allowed = check_sliding_window_rate_limit(cache_key, _limit, _seconds)
			if not allowed:
				frappe.throw(
					_("You hit the rate limit because of too many requests. Please try after sometime."),
					frappe.RateLimitExceededError,
				)

			return fn(*args, **kwargs)

		return wrapper

	return ratelimit_decorator
