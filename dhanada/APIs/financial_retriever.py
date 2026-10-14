import json
import re
import time
from datetime import date, datetime
from typing import Any, Dict, List, Optional, Tuple

import frappe

from dhanada.APIs.comparison import get_comparison_data
from dhanada.APIs.helpers import get_default_plan, mask_invalid_returns
from dhanada.APIs.scheme_details import (
	get_fund_details,
	get_funds_selector_list,
	get_historical_nav_for_sif,
)

# -------------------------------------------------------------------------
# -------------------------------------------------------------------------
# Scheme Index Cache Configuration (In-Memory with Redis Multi-Worker Sync & 1-Hour TTL Fallback)
# -------------------------------------------------------------------------
_SCHEME_INDEX_CACHE: Optional[List[Dict[str, Any]]] = None
_SCHEME_INDEX_CACHED_AT: float = 0.0
_SCHEME_INDEX_CACHE_VERSION: Optional[str] = None
CACHE_TTL_SECONDS: float = 3600.0  # 1 hour
CACHE_VERSION_KEY: str = "sif_scheme_index_version"


def _get_remote_cache_version() -> Optional[str]:
	"""
	Safely retrieves the current scheme index cache version from Redis via frappe.cache().
	Returns None if Redis or Frappe cache is not available (e.g., in offline unit tests).
	"""
	try:
		if getattr(frappe, "cache", None) and callable(frappe.cache):
			c = frappe.cache()
			if c:
				val = c.get_value(CACHE_VERSION_KEY)
				if val is not None:
					return str(val)
	except Exception:
		pass
	return None


def _bump_remote_cache_version() -> Optional[str]:
	"""
	Safely bumps the scheme index cache version in Redis via frappe.cache().
	Returns the new version token string, or None if Redis is unavailable.
	"""
	new_version = f"{time.time()}_{time.monotonic_ns()}"
	try:
		if getattr(frappe, "cache", None) and callable(frappe.cache):
			c = frappe.cache()
			if c:
				c.set_value(CACHE_VERSION_KEY, new_version)
				return new_version
	except Exception as e:
		if hasattr(frappe, "log_error"):
			try:
				frappe.log_error(title="Scheme Cache Invalidation Error", message=f"Failed to bump Redis version: {e}")
			except Exception:
				pass
	return None


def invalidate_scheme_index_cache(
	doc: Any = None,
	method: Optional[str] = None,
	*args: Any,
	**kwargs: Any,
) -> None:
	"""
	Invalidates the scheme index cache across both local worker memory and other workers.
	1. Clears in-process global cache variables (_SCHEME_INDEX_CACHE).
	2. Bumps the shared version token in Redis so other workers detect the change on next read.
	3. Accepts arbitrary arguments (doc, method, etc.) to safely act as a Frappe doc_events hook.
	4. Completely exception-safe to prevent breaking database transactions.
	"""
	global _SCHEME_INDEX_CACHE, _SCHEME_INDEX_CACHED_AT, _SCHEME_INDEX_CACHE_VERSION
	_SCHEME_INDEX_CACHE = None
	_SCHEME_INDEX_CACHED_AT = 0.0
	_SCHEME_INDEX_CACHE_VERSION = None

	_bump_remote_cache_version()


def schedule_scheme_index_invalidation() -> None:
	"""
	Schedules scheme index cache invalidation to run after the active database transaction commits.
	Deduplicates callbacks within the same transaction so bulk operations only invalidate once.
	Falls back to immediate invalidation if no database connection or after_commit queue is available.
	"""
	try:
		if getattr(frappe, "db", None) and hasattr(frappe.db, "after_commit"):
			after_commit_queue = getattr(frappe.db.after_commit, "_functions", None)
			if after_commit_queue is None or invalidate_scheme_index_cache not in after_commit_queue:
				frappe.db.after_commit.add(invalidate_scheme_index_cache)
		else:
			invalidate_scheme_index_cache()
	except Exception as e:
		if hasattr(frappe, "log_error"):
			try:
				frappe.log_error(title="Scheme Cache Invalidation Scheduling Error", message=str(e))
			except Exception:
				pass


def on_scheme_document_change(
	doc: Any = None,
	method: Optional[str] = None,
	*args: Any,
	**kwargs: Any,
) -> None:
	"""
	Frappe doc_events hook handler for SIF Scheme and SIF Scheme Plan lifecycle events.
	Defers cache invalidation until the database transaction successfully commits.
	If the transaction is rolled back, the callback is automatically discarded by Frappe.
	"""
	try:
		schedule_scheme_index_invalidation()
	except Exception as e:
		if hasattr(frappe, "log_error"):
			try:
				frappe.log_error(title="Scheme Doc Event Invalidation Error", message=str(e))
			except Exception:
				pass


def build_scheme_index() -> List[Dict[str, Any]]:
	"""
	Queries registered SIF schemes and compiles an index of searchable tokens,
	names, SEBI codes, categories, and strategy metadata.
	Reuses get_funds_selector_list() whenever possible.
	"""
	schemes: List[Dict[str, Any]] = []

	try:
		res = get_funds_selector_list()
		if isinstance(res, dict) and res.get("status") == "success" and isinstance(res.get("data"), list):
			schemes = res["data"]
	except Exception as e:
		if hasattr(frappe, "log_error"):
			frappe.log_error(title="Scheme Index Build Error", message=f"Failed to fetch funds selector list: {e}")

	# If get_funds_selector_list returned empty (e.g., in unit testing with mocked DB), fallback to empty list
	index: List[Dict[str, Any]] = []
	for s in schemes:
		scheme_id = s.get("id") or s.get("name")
		name = str(s.get("name") or s.get("scheme_name") or "").strip()
		sebi_code = str(s.get("sebi_code") or "").strip()
		category = str(s.get("category") or s.get("schemeSubcategory") or "").strip()
		strategy = str(s.get("strategy") or s.get("investmentStrategy") or "").strip()
		risk = s.get("risk")

		if not name and not scheme_id:
			continue

		index.append(
			{
				"id": scheme_id,
				"name": name,
				"sebi_code": sebi_code,
				"category": category,
				"strategy": strategy,
				"risk": risk,
			}
		)

	return index


def get_scheme_index(force_refresh: bool = False) -> List[Dict[str, Any]]:
	"""
	Returns the cached scheme index if within the 1-hour TTL and matching the shared Redis version.
	Rebuilds and refreshes the cache if:
	- force_refresh is True
	- Cache is uninitialized
	- Local TTL (1 hour) has expired (fallback safety)
	- Redis cache version has been bumped by another worker or doc event
	"""
	global _SCHEME_INDEX_CACHE, _SCHEME_INDEX_CACHED_AT, _SCHEME_INDEX_CACHE_VERSION

	now = time.time()
	remote_version = _get_remote_cache_version()

	# If local cache is populated and within TTL:
	if not force_refresh and _SCHEME_INDEX_CACHE is not None and (now - _SCHEME_INDEX_CACHED_AT) < CACHE_TTL_SECONDS:
		if remote_version is not None:
			# If Redis version tracking is active, ensure our in-memory cache matches the current remote version
			if _SCHEME_INDEX_CACHE_VERSION == remote_version:
				return _SCHEME_INDEX_CACHE
		else:
			# Redis is not available: fallback to in-memory TTL
			return _SCHEME_INDEX_CACHE

	_SCHEME_INDEX_CACHE = build_scheme_index()
	_SCHEME_INDEX_CACHED_AT = now

	if remote_version is not None:
		_SCHEME_INDEX_CACHE_VERSION = remote_version
	else:
		# If Redis is active but key was not set yet, set it now
		new_v = _bump_remote_cache_version()
		_SCHEME_INDEX_CACHE_VERSION = new_v or str(now)

	return _SCHEME_INDEX_CACHE


# -------------------------------------------------------------------------
# Text Normalization & Tokenization Helpers
# -------------------------------------------------------------------------

def clean_token_text(text: str) -> str:
	"""
	Normalizes text by lowercasing, stripping punctuation, and collapsing whitespace.
	"""
	if not text:
		return ""
	cleaned = re.sub(r"[^a-z0-9\s]", " ", str(text).lower())
	return re.sub(r"\s+", " ", cleaned).strip()


NOISE_WORDS = {"fund", "funds", "sif", "sifs", "scheme", "schemes"}


def get_core_tokens(text: str) -> List[str]:
	"""
	Returns tokens without generic financial container words (fund, sif, scheme).
	"""
	cleaned = clean_token_text(text)
	return [w for w in cleaned.split() if w not in NOISE_WORDS]


# -------------------------------------------------------------------------
# Date Extraction & Formatting Helpers
# -------------------------------------------------------------------------

def extract_date_from_query(query: str) -> Optional[date]:
	"""
	Extracts a target date from natural language user queries.
	Supports:
	- YYYY-MM-DD or YYYY/MM/DD (e.g. 2026-06-15)
	- DD-MM-YYYY or DD/MM/YYYY (e.g. 15-06-2026)
	- DD Mon YYYY / DD Month YYYY (e.g. 15-Jun-2026, 15th June 2026)
	- Month DD, YYYY / Mon DD YYYY (e.g. June 15, 2026, Jun 15 2026)
	"""
	if not query or not query.strip():
		return None

	q = query.strip()

	# 1. YYYY-MM-DD or YYYY/MM/DD
	m = re.search(r"\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b", q)
	if m:
		try:
			return date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
		except ValueError:
			pass

	# 2. DD Mon YYYY (e.g. 15-Jun-2026, 15 June 2026, 15th June 2026)
	m = re.search(r"\b(\d{1,2})(?:st|nd|rd|th)?[-\s]+([A-Za-z]{3,9})[-\s,]+(\d{4})\b", q)
	if m:
		try:
			month_str = m.group(2)[:3].capitalize()
			dt = datetime.strptime(f"{m.group(1)} {month_str} {m.group(3)}", "%d %b %Y")
			return dt.date()
		except ValueError:
			pass

	# 3. DD-MM-YYYY or DD/MM/YYYY
	m = re.search(r"\b(\d{1,2})[-/](\d{1,2})[-/](\d{4})\b", q)
	if m:
		try:
			return date(int(m.group(3)), int(m.group(2)), int(m.group(1)))
		except ValueError:
			pass

	# 4. Month DD, YYYY (e.g. June 15, 2026, Jun 15 2026)
	m = re.search(r"\b([A-Za-z]{3,9})[-\s]+(\d{1,2})(?:st|nd|rd|th)?[-\s,]+(\d{4})\b", q)
	if m:
		try:
			month_str = m.group(1)[:3].capitalize()
			dt = datetime.strptime(f"{m.group(2)} {month_str} {m.group(3)}", "%d %b %Y")
			return dt.date()
		except ValueError:
			pass

	return None


def parse_date_safely(date_input: Any) -> Optional[date]:
	"""
	Safely converts date objects or strings in standard formats to datetime.date.
	"""
	if not date_input:
		return None
	if isinstance(date_input, date):
		return date_input
	if hasattr(date_input, "date"):
		return date_input.date()

	s = str(date_input).strip()
	for fmt in ("%d-%b-%Y", "%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%Y/%m/%d"):
		try:
			return datetime.strptime(s, fmt).date()
		except ValueError:
			pass
	return None


def format_display_date(d: Any) -> str:
	"""
	Formats a date object or string into standard DD-Mon-YYYY (e.g. 06-Oct-2026).
	"""
	parsed = parse_date_safely(d)
	if parsed:
		return parsed.strftime("%d-%b-%Y")
	return str(d or "")


# -------------------------------------------------------------------------
# Scheme Matching & Disambiguation Logic
# -------------------------------------------------------------------------

def find_matching_schemes(
	query: str, scheme_index: Optional[List[Dict[str, Any]]] = None
) -> Tuple[List[Dict[str, Any]], bool]:
	"""
	Matches schemes against the query deterministically.
	Returns (matches: List[dict], is_ambiguous: bool).

	- If a query specifically names 1 scheme -> ([scheme], False)
	- If a query mentions multiple distinct schemes for comparison -> ([s1, s2], False)
	- If a query mentions an umbrella/family name that matches multiple funds -> ([s1, s2, s3], True)
	- If no scheme matches -> ([], False)
	"""
	if not query or not query.strip():
		return [], False

	index = scheme_index if scheme_index is not None else get_scheme_index()
	if not index:
		return [], False

	q_clean = clean_token_text(query)
	q_tokens = set(q_clean.split())

	# 1. Direct SEBI Code Match
	for s in index:
		sebi = clean_token_text(s.get("sebi_code", ""))
		if sebi and sebi in q_clean:
			return [s], False

	# 2. Check full scheme name or core name substrings
	# Core name = scheme name stripped of generic noise words ('fund', 'sif', 'scheme')
	found_schemes_with_score: List[Tuple[Dict[str, Any], int]] = []
	for s in index:
		s_clean = clean_token_text(s.get("name", ""))
		s_core_tokens = get_core_tokens(s.get("name", ""))
		s_core = " ".join(s_core_tokens)

		if s_clean and s_clean in q_clean:
			found_schemes_with_score.append((s, len(s_clean.split())))
		elif s_core and len(s_core_tokens) >= 2 and s_core in q_clean:
			found_schemes_with_score.append((s, len(s_core_tokens)))
		else:
			# Check prefix matches of core tokens with length >= 2
			# e.g., "apex hybrid" for "Apex Hybrid Long-Short Fund"
			matched_prefix_len = 0
			for k in range(len(s_core_tokens) - 1, 1, -1):
				prefix = " ".join(s_core_tokens[:k])
				if prefix in q_clean:
					matched_prefix_len = k
					break
			if matched_prefix_len >= 2:
				found_schemes_with_score.append((s, matched_prefix_len))

	if found_schemes_with_score:
		# Group by scheme family (first core token) and retain the most specific match per family
		family_groups: Dict[str, List[Tuple[Dict[str, Any], int]]] = {}
		for s, score in found_schemes_with_score:
			core_tokens = get_core_tokens(s.get("name", ""))
			fam = core_tokens[0] if core_tokens else str(s.get("id"))
			family_groups.setdefault(fam, []).append((s, score))

		unique_found = []
		seen_ids = set()
		for fam, group in family_groups.items():
			max_score = max(score for _, score in group)
			for s, score in group:
				if score == max_score:
					sid = str(s.get("id"))
					if sid not in seen_ids:
						seen_ids.add(sid)
						unique_found.append(s)

		# If 1 scheme matched, unambiguous!
		if len(unique_found) == 1:
			return unique_found, False

		# If multiple schemes matched:
		# Check if query specifically compares distinct families or schemes
		# e.g., "Compare Apex Equity Long-Short and DynaSIF Equity Long - Short"
		is_comparison_terms = any(
			term in q_tokens for term in ("compare", "comparison", "vs", "versus", "between", "difference")
		)
		if is_comparison_terms:
			return unique_found, False

		# If distinct schemes are from different families, return all as unambiguous matches for comparison
		families = {get_core_tokens(s.get("name", ""))[0] for s in unique_found if get_core_tokens(s.get("name", ""))}
		if len(families) > 1:
			return unique_found, False

		# If all matches belong to the same family and query didn't distinguish between them, it's ambiguous
		return unique_found, True

	# 3. Family / Brand Prefix Match (e.g. user just typed "Apex", "Altiva", "DynaSIF", "Titanium")
	family_matches: List[Dict[str, Any]] = []
	for s in index:
		core_tokens = get_core_tokens(s.get("name", ""))
		if not core_tokens:
			continue
		family = core_tokens[0]
		if family in q_tokens:
			family_matches.append(s)

	if len(family_matches) == 1:
		return family_matches, False
	elif len(family_matches) > 1:
		return family_matches, True

	return [], False


# -------------------------------------------------------------------------
# Traditional Untracked Mutual Funds & SIF Categories Patterns
# -------------------------------------------------------------------------

TRADITIONAL_MF_PATTERNS = [
	r"\b(hdfc|sbi|icici\s+prudential|axis|kotak|nippon|uti|mirae\s+asset|parag\s+parikh|ppfas|dsp|aditya\s+birla\s+sun\s+life|franklin\s+templeton|motilal\s+oswal|quant\s+mutual\s+fund)\b",
	r"\b(top\s+100|bluechip|small\s+cap|mid\s+cap|midcap|large\s+cap|large\s+and\s+mid\s+cap|flexi\s+cap|flexicap|elss|tax\s+saver|balanced\s+advantage|focused\s+fund|nifty\s+50\s+index\s+fund)\b",
]

SIF_CATEGORY_PATTERNS = [
	r"\b(what\s+are\s+(the\s+)?sif\s+(sub)?categories|list\s+(the\s+)?sif\s+(sub)?categories|which\s+sif\s+(sub)?categories)\b",
	r"\b(what\s+(sub)?categories\s+(are\s+there|exist|does\s+sebi\s+allow))\b",
	r"\b(sif\s+(sub)?categories\s+list|list\s+of\s+sif\s+(sub)?categories)\b",
]

NAV_INQUIRY_PATTERNS = [
	r"\b(nav|net\s+asset\s+value|current\s+nav|latest\s+nav|today'?s\s+nav|nav\s+today|price|quote|rate)\b",
]

PERFORMANCE_INQUIRY_PATTERNS = [
	r"\b(return|returns|performance|cagr|xirr|growth|perform|performs|performed|track\s+record|yield|1m|1y|since\s+inception)\b",
	r"\b(1\s*day|1d|daily|1\s*week|1w|weekly|1\s*month|1m|monthly|3\s*months?|3m|quarter(ly)?|six\s+months|6\s*months?|6m|half\s+year(ly)?|1\s*year|1y|annual(ly)?|yearly|2\s*years?|3\s*years?|5\s*years?|ytd)\b",
]

SPECIFIC_HORIZON_PATTERNS = [
	# 6 Months (check 6 months before 1 month)
	(r"\b(6\s*months?|six\s+months?|6m|half\s+year(ly)?)\b", "6_months", "6 Months"),
	# 3 Months
	(r"\b(3\s*months?|three\s+months?|3m|quarter(ly)?)\b", "3_months", "3 Months"),
	# 1 Month
	(r"\b(1\s*month|one\s+month|1m|monthly)\b", "1_month", "1 Month"),
	# 1 Week
	(r"\b(1\s*week|one\s+week|1w|weekly|7\s*days?)\b", "1_week", "1 Week"),
	# 1 Day
	(r"\b(1\s*day|one\s+day|1d|daily)\b", "1_day", "1 Day"),
	# 1 Year
	(r"\b(1\s*year|one\s+year|1y|12\s*months?|twelve\s+months?|annual(ly)?|yearly)\b", "1_year", "1 Year"),
	# 2 Years
	(r"\b(2\s*years?|two\s+years?|2y|24\s*months?)\b", "2_years", "2 Years"),
	# 3 Years
	(r"\b(3\s*years?|three\s+years?|3y|36\s*months?)\b", "3_years", "3 Years"),
	# 5 Years
	(r"\b(5\s*years?|five\s+years?|5y|60\s*months?)\b", "5_years", "5 Years"),
	# YTD
	(r"\b(year\s+to\s+date|ytd)\b", "year_to_date", "YTD"),
	# Since Inception
	(r"\b(since\s+inception|inception)\b", "since_inception", "Since Inception"),
]


def extract_performance_horizon(query: str) -> Optional[Tuple[str, str]]:
	"""
	Extracts a specific performance horizon (e.g., '6_months', '6 Months') from natural language user query.
	Returns (horizon_key, horizon_label) or None if no specific horizon requested.
	"""
	if not query or not query.strip():
		return None
	q = query.lower()
	for pattern, key, label in SPECIFIC_HORIZON_PATTERNS:
		if re.search(pattern, q):
			return key, label
	return None

COMPARISON_INQUIRY_PATTERNS = [
	r"\b(compare|comparison|vs|versus|difference\s+between|better\s+than|which\s+is\s+better)\b",
]


def is_traditional_untracked_mutual_fund(query: str) -> Optional[str]:
	"""
	Detects if query is inquiring about a traditional mutual fund not tracked in SIF database.
	Returns detected fund/AMC name or None.
	"""
	if not query:
		return None
	q = query.lower()

	# Whitelist: If query explicitly asks about SIF, don't flag as untracked
	if "sif" in q.split() or "specialized investment fund" in q:
		return None

	# Look for full specific fund names like "HDFC Top 100", "SBI Bluechip", "Parag Parikh Flexi Cap"
	m_full = re.search(
		r"\b((?:hdfc|sbi|icici\s+prudential|axis|kotak|nippon|uti|mirae\s+asset|parag\s+parikh|ppfas|dsp|aditya\s+birla|tata|motilal\s+oswal|quant)"
		r"(?:\s+[a-z0-9\-]+){1,4}(?:\s+fund)?)\b",
		q,
	)
	if m_full:
		return m_full.group(0).title()

	# Otherwise check individual patterns
	for pat in TRADITIONAL_MF_PATTERNS:
		m = re.search(pat, q)
		if m:
			return m.group(0).title()

	return None


def is_sif_category_query(query: str) -> bool:
	"""
	Detects if query is asking for SEBI SIF subcategories or investment strategies.
	"""
	if not query:
		return False
	q = query.lower()
	for pat in SIF_CATEGORY_PATTERNS:
		if re.search(pat, q):
			return True
	return False


def is_nav_query(query: str) -> bool:
	if not query:
		return False
	q = query.lower()
	return any(re.search(pat, q) for pat in NAV_INQUIRY_PATTERNS)


def is_performance_query(query: str) -> bool:
	if not query:
		return False
	q = query.lower()
	return any(re.search(pat, q) for pat in PERFORMANCE_INQUIRY_PATTERNS)


def is_comparison_query(query: str) -> bool:
	if not query:
		return False
	q = query.lower()
	return any(re.search(pat, q) for pat in COMPARISON_INQUIRY_PATTERNS)


# -------------------------------------------------------------------------
# Deterministic Response Handlers (Frontend 4-Key JSON Schema)
# -------------------------------------------------------------------------

def handle_ambiguous_scheme(query_term: str, matches: List[Dict[str, Any]]) -> Dict[str, Any]:
	"""
	Requirement 5: Ask for clarification when a scheme name matches multiple funds.
	Provides numbered list of matching schemes and suggestions chips.
	"""
	clean_term = query_term.strip() if query_term else "the fund"
	lines = [f"I found {len(matches)} schemes matching '**{clean_term}**':\n"]
	for i, m in enumerate(matches[:5], 1):
		m_name = m.get("name") or f"Scheme {m.get('id')}"
		m_cat = m.get("category") or "SIF"
		lines.append(f"{i}. **{m_name}** ({m_cat})")

	lines.append("\nWhich specific scheme would you like to know about?")
	message = "\n".join(lines)

	suggestions = [str(m.get("name")) for m in matches[:4] if m.get("name")]

	return {
		"message": message,
		"suggestions": suggestions,
		"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
		"contextSummary": f"Ambiguity clarification requested for '{clean_term}' with {len(matches)} matches.",
	}


def handle_untracked_mutual_fund(fund_name: str) -> Dict[str, Any]:
	"""
	Requirement 6: Provide educational guidance with clear disclosure of live-data limitation
	for traditional mutual funds not tracked in the database.
	"""
	clean_name = fund_name.strip() if fund_name else "traditional mutual fund"
	message = (
		f"Traditional mutual funds like **{clean_name}** are open-ended collective investment vehicles "
		"regulated under SEBI Mutual Fund regulations, typically offering retail access with minimum investments of ₹500–₹5,000.\n\n"
		"**Live Data Limitation:** KNAPS / Dhanada specializes exclusively in **Specialized Investment Funds (SIFs)** "
		"under SEBI's specialized investment framework (minimum subscription of ₹10 Lakhs). Live daily NAV, portfolios, "
		f"and performance for traditional mutual funds like **{clean_name}** are not maintained in our SIF database.\n\n"
		"For official NAV and disclosures for this fund, please refer to AMFI India (amfiindia.com) or the respective AMC's portal."
	)
	return {
		"message": message,
		"suggestions": [
			"What is an SIF?",
			"Explore SIF Schemes",
			"SIF vs Mutual Funds",
		],
		"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
		"contextSummary": f"Educational guidance on traditional mutual fund ({clean_name}) with SIF live-data limitation disclosure.",
	}


def handle_sif_categories() -> Dict[str, Any]:
	"""
	Requirement 3: Support SIF categories and general financial education.
	Lists the 7 registered SEBI SIF subcategories.
	"""
	message = (
		"SEBI's Specialized Investment Fund (SIF) framework establishes a distinct investment class "
		"between traditional Mutual Funds and Portfolio Management Services (PMS), designed for sophisticated "
		"investors with a minimum ticket size of ₹10 Lakhs.\n\n"
		"The 7 registered SIF investment strategy subcategories are:\n"
		"1. **Equity Long-Short Fund**: Takes directional long positions while employing short derivatives to hedge drawdown risk.\n"
		"2. **Equity Ex-Top 100 Long-Short Fund**: Focuses on mid-cap and small-cap alpha generation with hedging overlays.\n"
		"3. **Active Asset Allocator Long-Short Fund**: Dynamically shifts capital across equity, debt, and cash based on valuation signals.\n"
		"4. **Hybrid Long-Short Fund**: Combines fixed-income stability with hedged equity exposure.\n"
		"5. **Sectoral Debt Long-Short Fund**: Exploits yield curve spreads and credit duration within targeted debt sectors.\n"
		"6. **Debt Long-Short Fund**: Employs duration and credit spreads to deliver hedged debt returns.\n"
		"7. **Sector Rotation Long-Short Fund**: Rotates across outperforming sectors while mitigating systematic market risk."
	)
	return {
		"message": message,
		"suggestions": [
			"Equity Long-Short",
			"Hybrid Long-Short",
			"Talk to Advisor",
		],
		"leadOpportunity": {
			"isAppropriateNow": True,
			"offerMessage": "Would you like an advisor to guide you on which SIF category suits your portfolio risk profile?",
		},
		"contextSummary": "Explained the 7 registered SEBI SIF investment strategy subcategories.",
	}


def handle_latest_nav(scheme_id: Any, scheme_name: Optional[str] = None) -> Dict[str, Any]:
	"""
	Requirement 4: Every NAV response must include its date and plan type.
	Never present missing data as invented figures.
	"""
	details_res = get_fund_details(scheme_id=scheme_id)
	if not isinstance(details_res, dict) or details_res.get("status") != "success" or not details_res.get("data"):
		name = scheme_name or f"Scheme {scheme_id}"
		return {
			"message": f"Details for **{name}** are currently unavailable in our database.",
			"suggestions": ["Explore SIF Schemes", "What is an SIF?"],
			"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
			"contextSummary": f"Fund details not found for {name}.",
		}

	fund = details_res["data"]
	name = fund.get("name") or scheme_name or f"Scheme {scheme_id}"
	plan = fund.get("selectedPlan") or {}
	nav = plan.get("nav")
	nav_date = plan.get("nav_date")
	plan_type = plan.get("type") or "Regular"
	plan_option = plan.get("option") or "Growth"

	formatted_date = format_display_date(nav_date)

	if nav is not None and formatted_date:
		formatted_nav = f"{float(nav):.4f}".rstrip("0").rstrip(".") if isinstance(nav, (int, float)) else str(nav)
		msg = (
			f"The latest NAV for **{name}** ({plan_type} - {plan_option} Plan) "
			f"is **₹{formatted_nav}** as of **{formatted_date}**."
		)
		lead_app = True
		offer = f"Would you like an advisor to provide a factsheet or allocation details for {name}?"
	else:
		msg = (
			f"The latest NAV for **{name}** ({plan_type} - {plan_option} Plan) is currently not available in our records. "
			"As this scheme may be newly launched or undergoing allotment, official NAV figures will appear once published by the AMC."
		)
		lead_app = False
		offer = None

	return {
		"message": msg,
		"suggestions": [
			"View Returns",
			"Historical NAV",
			"Compare Funds",
		],
		"leadOpportunity": {
			"isAppropriateNow": lead_app,
			"offerMessage": offer,
		},
		"contextSummary": f"Provided latest NAV for {name} ({plan_type} - {plan_option} Plan).",
	}


def handle_historical_nav(
	scheme_id: Any, target_date: date, scheme_name: Optional[str] = None
) -> Dict[str, Any]:
	"""
	Requirement 4: Historical NAV with exact date, plan type, and weekend/holiday handling.
	Never invent figures when data is missing.
	"""
	details_res = get_fund_details(scheme_id=scheme_id)
	if not isinstance(details_res, dict) or details_res.get("status") != "success" or not details_res.get("data"):
		name = scheme_name or f"Scheme {scheme_id}"
		return {
			"message": f"Historical NAV records for **{name}** are currently unavailable.",
			"suggestions": ["Explore SIF Schemes", "What is an SIF?"],
			"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
			"contextSummary": f"Historical NAV unavailable for {name}.",
		}

	fund = details_res["data"]
	name = fund.get("name") or scheme_name or f"Scheme {scheme_id}"
	plan = fund.get("selectedPlan") or {}
	plan_type = plan.get("type") or "Regular"
	plan_option = plan.get("option") or "Growth"
	historical_nav = plan.get("historical_nav") or []

	if not historical_nav and plan.get("sif_code"):
		historical_nav = get_historical_nav_for_sif(plan.get("sif_code"))

	formatted_target = format_display_date(target_date)

	if not historical_nav:
		return {
			"message": (
				f"Historical NAV time-series is currently unavailable for **{name}** "
				f"({plan_type} - {plan_option} Plan)."
			),
			"suggestions": ["Latest NAV", "Explore SIF Schemes"],
			"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
			"contextSummary": f"Historical NAV time-series empty for {name}.",
		}

	parsed_entries: List[Tuple[date, float]] = []
	for entry in historical_nav:
		d_val = entry.get("date")
		n_val = entry.get("nav")
		parsed_d = parse_date_safely(d_val)
		if parsed_d and n_val is not None:
			try:
				parsed_entries.append((parsed_d, float(n_val)))
			except (ValueError, TypeError):
				pass

	if not parsed_entries:
		return {
			"message": f"Unable to parse historical NAV dates for **{name}**.",
			"suggestions": ["Latest NAV", "Explore SIF Schemes"],
			"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
			"contextSummary": f"Historical NAV parsing failed for {name}.",
		}

	parsed_entries.sort(key=lambda x: x[0])
	earliest_date, _ = parsed_entries[0]
	latest_date, latest_nav = parsed_entries[-1]

	# 1. Future date
	if target_date > latest_date:
		formatted_latest = format_display_date(latest_date)
		formatted_latest_nav = f"{latest_nav:.4f}".rstrip("0").rstrip(".")
		msg = (
			f"Historical NAV cannot be retrieved for a future date (**{formatted_target}**). "
			f"The latest available NAV for **{name}** ({plan_type} - {plan_option} Plan) "
			f"is **₹{formatted_latest_nav}** as of **{formatted_latest}**."
		)
	# 2. Pre-inception date
	elif target_date < earliest_date:
		formatted_earliest = format_display_date(earliest_date)
		msg = (
			f"The requested date (**{formatted_target}**) is prior to the fund's inception / earliest recorded NAV date "
			f"(**{formatted_earliest}**). Historical NAV for **{name}** is not available before inception."
		)
	else:
		# 3. Check exact date
		exact_nav = None
		for d, n in parsed_entries:
			if d == target_date:
				exact_nav = n
				break

		if exact_nav is not None:
			formatted_nav = f"{exact_nav:.4f}".rstrip("0").rstrip(".")
			msg = (
				f"The NAV for **{name}** ({plan_type} - {plan_option} Plan) on "
				f"**{formatted_target}** was **₹{formatted_nav}**."
			)
		else:
			# 4. Weekend / holiday: find closest preceding trading day
			preceding_entry = None
			for d, n in parsed_entries:
				if d <= target_date:
					preceding_entry = (d, n)
				else:
					break

			if preceding_entry:
				prev_d, prev_n = preceding_entry
				formatted_prev_d = format_display_date(prev_d)
				formatted_prev_n = f"{prev_n:.4f}".rstrip("0").rstrip(".")
				msg = (
					f"Markets were closed on **{formatted_target}** (weekend or public holiday). "
					f"The preceding available NAV for **{name}** ({plan_type} - {plan_option} Plan) "
					f"was **₹{formatted_prev_n}** on **{formatted_prev_d}**."
				)
			else:
				formatted_earliest = format_display_date(earliest_date)
				msg = (
					f"No NAV found for **{name}** on **{formatted_target}**. "
					f"Earliest recorded NAV date is **{formatted_earliest}**."
				)

	return {
		"message": msg,
		"suggestions": [
			"Latest NAV",
			"View Returns",
			"Compare Funds",
		],
		"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
		"contextSummary": f"Historical NAV inquiry for {name} on {formatted_target}.",
	}


def handle_performance(
	scheme_id: Any,
	scheme_name: Optional[str] = None,
	specific_horizon: Optional[Tuple[str, str]] = None,
) -> Dict[str, Any]:
	"""
	Requirement 4 & Phase 6C:
	- If specific_horizon is requested (e.g. 1 day, 1 week, 1 month, 3 months, 6 months, 1 year),
	  answers that specific period directly.
	- If the requested period is unavailable, explicitly states it is not yet available due to tenure.
	- Never presents stored 0.0 as an actual return when uncompleted.
	- If no specific horizon is requested, provides full verified breakdown.
	- Includes regulatory compliance disclaimers.
	"""
	details_res = get_fund_details(scheme_id=scheme_id)
	if not isinstance(details_res, dict) or details_res.get("status") != "success" or not details_res.get("data"):
		name = scheme_name or f"Scheme {scheme_id}"
		return {
			"message": f"Performance data for **{name}** is currently unavailable.",
			"suggestions": ["Explore SIF Schemes", "What is an SIF?"],
			"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
			"contextSummary": f"Performance data unavailable for {name}.",
		}

	fund = details_res["data"]
	name = fund.get("name") or scheme_name or f"Scheme {scheme_id}"
	plan = fund.get("selectedPlan") or {}
	plan_type = plan.get("type") or "Regular"
	plan_option = plan.get("option") or "Growth"
	perf_data = plan.get("performance_data") or {}

	perf_date = perf_data.get("performance_date") or plan.get("nav_date")
	formatted_perf_date = format_display_date(perf_date)
	date_prefix = f" as of **{formatted_perf_date}**" if formatted_perf_date else ""

	# ---------------------------------------------------------------------
	# Specific Horizon Branch (Phase 6C)
	# ---------------------------------------------------------------------
	if specific_horizon:
		key, label = specific_horizon
		val = perf_data.get(key)

		# Check if return is valid (non-null and not an uncompleted 0.0)
		is_available = (
			val is not None
			and isinstance(val, (int, float))
			and not (val == 0.0 and key in ("3_months", "6_months", "1_year", "2_years", "3_years", "5_years"))
		)

		if is_available:
			sign = "+" if val > 0 else ""
			formatted_val = f"{sign}{val:.2f}%"
			msg = (
				f"The **{label}** return for **{name}** ({plan_type} - {plan_option} Plan)"
				f"{date_prefix} is **{formatted_val}**.\n\n"
				"*Disclaimer: Past performance is not indicative of future returns. SIF investments are subject to market risks.*"
			)
			suggestions = [
				"Latest NAV",
				"View Returns",
				"Talk to Advisor",
			]
			lead_app = True
			lead_offer = f"Would you like an advisor to review risk-aligned performance for {name}?"
			summary = f"Provided {label} return ({formatted_val}) for {name} ({plan_type} - {plan_option} Plan)."
		else:
			msg = (
				f"The **{label}** return for **{name}** ({plan_type} - {plan_option} Plan) is **not yet available**"
				f"{date_prefix}, as the scheme has not completed that operating tenure.\n\n"
				"*Disclaimer: Past performance is not indicative of future returns. SIF investments are subject to market risks.*"
			)
			suggestions = [
				"Latest NAV",
				"View Returns",
				"Explore SIF Schemes",
			]
			lead_app = True
			lead_offer = f"Would you like an advisor to provide the latest factsheet for {name}?"
			summary = f"{label} return not yet available for {name} ({plan_type} - {plan_option} Plan) due to tenure."

		return {
			"message": msg,
			"suggestions": suggestions[:4],
			"leadOpportunity": {
				"isAppropriateNow": lead_app,
				"offerMessage": lead_offer,
			},
			"contextSummary": summary,
		}

	# ---------------------------------------------------------------------
	# General Returns Breakdown Branch (When no specific period requested)
	# ---------------------------------------------------------------------
	horizon_labels = [
		("1_day", "1 Day"),
		("1_week", "1 Week"),
		("1_month", "1 Month"),
		("3_months", "3 Months"),
		("6_months", "6 Months"),
		("year_to_date", "YTD"),
		("1_year", "1 Year"),
		("2_years", "2 Years"),
		("3_years", "3 Years"),
		("5_years", "5 Years"),
		("since_inception", "Since Inception"),
	]

	available_lines: List[str] = []
	unavailable_labels: List[str] = []

	for key, label in horizon_labels:
		val = perf_data.get(key)
		# CRITICAL RULE: Never present unavailable performance as 0.0%
		if val is not None and isinstance(val, (int, float)):
			sign = "+" if val > 0 else ""
			available_lines.append(f"• **{label}**: {sign}{val:.2f}%")
		else:
			unavailable_labels.append(label)

	lines = [f"Performance for **{name}** ({plan_type} - {plan_option} Plan){date_prefix}:\n"]
	if available_lines:
		lines.extend(available_lines)
	else:
		lines.append("• Performance reporting has not yet commenced for this scheme.")

	if unavailable_labels:
		display_unavail = [u for u in unavailable_labels if u in ("3 Months", "6 Months", "1 Year", "3 Years", "5 Years")]
		if display_unavail:
			lines.append(
				f"\n*Note: Longer horizons ({', '.join(display_unavail[:3])}) are not applicable "
				"as the scheme has not completed those operating tenures.*"
			)

	lines.append("\n*Disclaimer: Past performance is not indicative of future returns. SIF investments are subject to market risks.*")

	return {
		"message": "\n".join(lines),
		"suggestions": [
			"Latest NAV",
			"Investment Strategy",
			"Talk to Advisor",
		],
		"leadOpportunity": {
			"isAppropriateNow": True,
			"offerMessage": f"Would you like an advisor to review risk-aligned performance for {name}?",
		},
		"contextSummary": f"Provided verified return performance for {name} ({plan_type} - {plan_option} Plan).",
	}


def handle_comparison(scheme_ids: List[Any]) -> Dict[str, Any]:
	"""
	Requirement 3: Support scheme comparisons (2-3 schemes).
	Reuses get_comparison_data() and presents side-by-side attributes with date and masked returns.
	"""
	clean_ids = [s for s in scheme_ids if s is not None][:3]
	comp_res = get_comparison_data(clean_ids)
	if not isinstance(comp_res, dict) or comp_res.get("status") != "success" or not comp_res.get("data"):
		return {
			"message": "Comparison data for the requested schemes is currently unavailable.",
			"suggestions": ["Explore SIF Schemes", "What is an SIF?"],
			"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
			"contextSummary": "Comparison data unavailable.",
		}

	schemes = comp_res["data"]
	if not schemes:
		return {
			"message": "No matching schemes found for comparison.",
			"suggestions": ["Explore SIF Schemes", "What is an SIF?"],
			"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
			"contextSummary": "No schemes found for comparison.",
		}

	lines = ["### Scheme Comparison (Regular - Growth Plans)\n"]
	for s in schemes:
		s_name = s.get("name")
		cat = s.get("category") or "Specialized Investment Fund"
		bench = s.get("benchmark") or s.get("benchmarkTier1") or "Not Specified"
		risk = s.get("risk") or s.get("riskLevel") or "N/A"
		nav = s.get("nav")
		nav_str = f"₹{nav:.4f}".rstrip("0").rstrip(".") if isinstance(nav, (int, float)) else "N/A"

		perf = s.get("performance_data") or {}
		p_1m = perf.get("1_month")
		p_1m_str = f"{p_1m:+.2f}%" if isinstance(p_1m, (int, float)) else "N/A"
		p_si = perf.get("since_inception")
		p_si_str = f"{p_si:+.2f}%" if isinstance(p_si, (int, float)) else "N/A"

		lines.append(f"**{s_name}**")
		lines.append(f"• Category: {cat}")
		lines.append(f"• Benchmark: {bench}")
		lines.append(f"• Risk Band: Level {risk}")
		lines.append(f"• Latest NAV: {nav_str}")
		lines.append(f"• Returns: 1 Month: {p_1m_str} | Since Inception: {p_si_str}\n")

	lines.append("*Disclaimer: Market-linked investments are subject to market risks. Comparisons are for educational purposes.*")

	suggestions = [s.get("name") for s in schemes[:2] if s.get("name")]
	suggestions.append("Talk to Advisor")

	return {
		"message": "\n".join(lines),
		"suggestions": suggestions[:4],
		"leadOpportunity": {
			"isAppropriateNow": True,
			"offerMessage": "Would you like an advisor to provide a personalized comparison report?",
		},
		"contextSummary": f"Compared {len(schemes)} schemes side-by-side.",
	}


def build_grounding_facts_for_scheme(scheme_id: Any) -> str:
	"""
	Extracts verified facts from Frappe database to ground Ollama in verified facts
	when conversational synthesis is required.
	"""
	details_res = get_fund_details(scheme_id=scheme_id)
	if not isinstance(details_res, dict) or details_res.get("status") != "success" or not details_res.get("data"):
		return ""

	data = details_res["data"]
	plan = data.get("selectedPlan") or {}
	plan_type = plan.get("type") or "Regular"
	plan_option = plan.get("option") or "Growth"
	nav = plan.get("nav")
	nav_date = format_display_date(plan.get("nav_date"))
	perf = plan.get("performance_data") or {}

	available_perf = []
	for k, lbl in [
		("1_day", "1D"),
		("1_week", "1W"),
		("1_month", "1M"),
		("3_months", "3M"),
		("6_months", "6M"),
		("1_year", "1Y"),
		("since_inception", "Since Inception"),
	]:
		v = perf.get(k)
		if v is not None and isinstance(v, (int, float)):
			available_perf.append(f"{lbl}: {v:+.2f}%")

	facts = [
		f"FUND NAME: {data.get('name')}",
		f"AMC: {data.get('amc')}",
		f"CATEGORY: {data.get('category')}",
		f"INVESTMENT STRATEGY: {data.get('investmentStrategy')}",
		f"BENCHMARK: {data.get('benchmarkTier1')}",
		f"RISK BAND: Level {data.get('risk')}",
		"MINIMUM INVESTMENT: ₹10,00,000",
		f"DEFAULT PLAN: {plan_type} - {plan_option}",
	]
	if nav is not None and nav_date:
		facts.append(f"LATEST NAV: ₹{nav} as of {nav_date}")
	if available_perf:
		facts.append(f"VERIFIED RETURNS: {', '.join(available_perf)}")
	facts.append(
		"UNAVAILABLE RETURNS: Do NOT state any returns as 0.0% if not completed. State they are not yet applicable."
	)

	return "\n".join(facts)


# -------------------------------------------------------------------------
# Conversation History & Contextual Follow-Up Helpers
# -------------------------------------------------------------------------

FOLLOWUP_PRONOUN_PATTERNS = [
	r"\b(it|its|it's|this|this\s+fund|this\s+scheme|the\s+fund|the\s+scheme|that\s+fund|that\s+scheme|same\s+fund|same\s+scheme|this\s+one|that\s+one)\b",
]


def has_followup_reference(query: str) -> bool:
	"""
	Detects if query contains anaphoric pronouns or demonstratives referencing previously discussed entities.
	"""
	if not query:
		return False
	q = query.lower()
	return any(re.search(pat, q) for pat in FOLLOWUP_PRONOUN_PATTERNS)


def extract_text_from_history_item(item: Any) -> str:
	"""
	Extracts plain text content from a conversation turn item.
	Handles Gemini-style parts, standard text/content fields, and JSON bot responses.
	"""
	if not isinstance(item, dict):
		return str(item or "").strip()

	content = ""
	parts = item.get("parts")
	if isinstance(parts, list):
		text_parts = []
		for p in parts:
			if isinstance(p, dict) and "text" in p:
				text_parts.append(str(p["text"]))
			elif isinstance(p, str):
				text_parts.append(p)
		content = " ".join(text_parts)
	elif isinstance(parts, str):
		content = parts
	elif "content" in item:
		content = str(item.get("content", ""))
	elif "text" in item:
		content = str(item.get("text", ""))

	content = content.strip()
	if content.startswith("{") and content.endswith("}"):
		try:
			data = json.loads(content)
			if isinstance(data, dict):
				msg = str(data.get("message") or "")
				summary = str(data.get("contextSummary") or "")
				return f"{msg} {summary}".strip()
		except Exception:
			pass
	return content


def extract_schemes_from_history(
	history: Optional[List[Any]],
	current_query: str = "",
	scheme_index: Optional[List[Dict[str, Any]]] = None,
) -> Tuple[List[Dict[str, Any]], bool]:
	"""
	Scans conversation history in reverse to identify the most recently discussed scheme(s).
	Returns (matches: List[dict], is_ambiguous: bool).
	- If a single scheme was discussed in the latest relevant turn: ([scheme], False)
	- If multiple schemes were discussed (comparison or ambiguous family): ([s1, s2, ...], True)
	- If no schemes were discussed: ([], False)
	"""
	if not history or not isinstance(history, list):
		return [], False

	index = scheme_index if scheme_index is not None else get_scheme_index()
	if not index:
		return [], False

	# Exclude the current user query turn if present at the end of history
	prior_items = list(history)
	if prior_items:
		last_item_text = clean_token_text(extract_text_from_history_item(prior_items[-1]))
		curr_clean = clean_token_text(current_query)
		if last_item_text == curr_clean or (isinstance(prior_items[-1], dict) and prior_items[-1].get("role") == "user"):
			prior_items = prior_items[:-1]

	for item in reversed(prior_items):
		text = extract_text_from_history_item(item)
		if not text:
			continue
		matches, is_ambiguous = find_matching_schemes(text, scheme_index=index)
		if matches:
			if len(matches) > 1:
				return matches, True
			return matches, is_ambiguous

	return [], False


# -------------------------------------------------------------------------
# Master Entry Point
# -------------------------------------------------------------------------

def get_financial_grounding_or_response(
	query: str, history: Optional[List[Any]] = None
) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
	"""
	Master financial retrieval router for dhanada/APIs/chatbot.py.

	Returns:
	- (deterministic_response: dict, None): When query can be answered deterministically
	  directly (<10ms, no LLM call required).
	- (None, grounding_facts: str): When query requires conversational synthesis but must
	  be strictly grounded in verified database facts.
	- (None, None): When query is general educational / conceptual financial inquiry.
	"""
	if not query or not query.strip():
		return None, None

	q = query.strip()
	index = get_scheme_index()

	# 1. Check SIF Categories Inquiry
	if is_sif_category_query(q):
		return handle_sif_categories(), None

	# 2. Check Traditional Untracked Mutual Fund Inquiry
	trad_fund = is_traditional_untracked_mutual_fund(q)
	if trad_fund:
		# Check if any SIF scheme also matches (if not, it's an untracked fund query)
		sif_matches, _ = find_matching_schemes(q, scheme_index=index)
		if not sif_matches:
			return handle_untracked_mutual_fund(trad_fund), None

	# 3. Deterministic Scheme Matching on current query
	matches, is_ambiguous = find_matching_schemes(q, scheme_index=index)

	# Case A: Ambiguous Scheme Match in current query (e.g. user typed "Apex" matching 3 funds)
	if is_ambiguous and len(matches) > 1:
		q_tokens = clean_token_text(q).split()
		family_term = matches[0].get("name", "").split()[0] if matches else "the fund"
		for t in q_tokens:
			if t.lower() in family_term.lower():
				family_term = t.title()
				break
		return handle_ambiguous_scheme(family_term, matches), None

	# Case B1: Multi-Scheme Comparison directly named in query (2-3 distinct schemes matched)
	if len(matches) >= 2:
		scheme_ids = [m.get("id") for m in matches]
		return handle_comparison(scheme_ids), None

	# Case B2: Comparison query with exactly 1 scheme in query (e.g. "Compare it with Apex Hybrid", "Compare with Apex Hybrid")
	if len(matches) == 1 and is_comparison_query(q):
		new_scheme = matches[0]
		hist_matches, _ = extract_schemes_from_history(history, current_query=q, scheme_index=index)

		# Filter out new_scheme from hist_matches if already present
		other_hist = [s for s in hist_matches if str(s.get("id")) != str(new_scheme.get("id"))]

		if len(other_hist) == 1:
			prev_scheme = other_hist[0]
			return handle_comparison([prev_scheme.get("id"), new_scheme.get("id")]), None
		elif len(other_hist) > 1:
			names_str = " and ".join(f"**{m.get('name')}**" for m in other_hist[:2])
			return {
				"message": (
					f"You previously discussed {names_str}. "
					f"Which scheme would you like to compare with **{new_scheme.get('name')}**?"
				),
				"suggestions": [
					f"Compare {m.get('name')} with {new_scheme.get('name')}" for m in other_hist[:2]
				],
				"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
				"contextSummary": f"Clarification requested for comparing {new_scheme.get('name')} with previously discussed schemes.",
			}, None
		else:
			return {
				"message": (
					f"Which scheme would you like to compare with **{new_scheme.get('name')}**? "
					"Please provide the name of the other scheme."
				),
				"suggestions": ["Explore SIF Schemes", "What is an SIF?"],
				"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
				"contextSummary": f"Comparison inquiry for {new_scheme.get('name')} without second scheme context.",
			}, None

	# Case C: Single Scheme Resolved directly from query (not a comparison)
	if len(matches) == 1:
		scheme = matches[0]
		scheme_id = scheme.get("id")
		scheme_name = scheme.get("name")
		target_date = extract_date_from_query(q)
		is_nav = is_nav_query(q)
		is_perf = is_performance_query(q)

		# C1: Historical NAV (Date extracted + NAV keyword)
		if target_date and is_nav:
			return handle_historical_nav(scheme_id, target_date, scheme_name), None

		# C2: Latest NAV (NAV keyword present without historical date)
		if is_nav:
			return handle_latest_nav(scheme_id, scheme_name), None

		# C3: Performance / Returns Inquiry
		if is_perf:
			specific_h = extract_performance_horizon(q)
			return handle_performance(scheme_id, scheme_name, specific_horizon=specific_h), None

		# C4: Conversational Scheme Inquiry (ground Ollama with verified facts)
		grounding_facts = build_grounding_facts_for_scheme(scheme_id)
		if grounding_facts:
			return None, grounding_facts

	# Case D: No Scheme Matched in Current Query -> Check Contextual Follow-Up
	is_followup = (
		has_followup_reference(q)
		or is_nav_query(q)
		or is_performance_query(q)
		or extract_date_from_query(q) is not None
		or bool(
			re.search(
				r"\b(strategy|benchmark|risk|expense\s+ratio|aum|minimum\s+investment|factsheet|facts|manager)\b",
				q.lower(),
			)
		)
	)

	if is_followup:
		hist_matches, hist_is_ambiguous = extract_schemes_from_history(history, current_query=q, scheme_index=index)

		# Subcase D1: Multiple schemes in history -> Ambiguous! Clarify!
		if len(hist_matches) > 1:
			names_str = " and ".join(f"**{m.get('name')}**" for m in hist_matches[:2])
			if is_performance_query(q):
				msg = f"You previously discussed {names_str}. Which scheme's returns would you like to check?"
				suggs = [f"Returns of {m.get('name')}" for m in hist_matches[:3] if m.get("name")]
			elif is_nav_query(q):
				msg = f"You previously discussed {names_str}. Which scheme's NAV would you like to check?"
				suggs = [f"Latest NAV of {m.get('name')}" for m in hist_matches[:3] if m.get("name")]
			else:
				msg = f"You previously discussed {names_str}. Which specific scheme would you like to know about?"
				suggs = [str(m.get("name")) for m in hist_matches[:3] if m.get("name")]

			return {
				"message": msg,
				"suggestions": suggs[:4],
				"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
				"contextSummary": f"Ambiguity clarification requested between previously discussed schemes ({names_str}).",
			}, None

		# Subcase D2: Single scheme resolved from history -> Retrieve fresh data!
		if len(hist_matches) == 1:
			scheme = hist_matches[0]
			scheme_id = scheme.get("id")
			scheme_name = scheme.get("name")
			target_date = extract_date_from_query(q)
			is_nav = is_nav_query(q)
			is_perf = is_performance_query(q)

			# D2.1: Historical NAV for resolved scheme
			if target_date and is_nav:
				return handle_historical_nav(scheme_id, target_date, scheme_name), None

			# D2.2: Latest NAV for resolved scheme
			if is_nav:
				return handle_latest_nav(scheme_id, scheme_name), None

			# D2.3: Performance / Returns for resolved scheme
			if is_perf:
				specific_h = extract_performance_horizon(q)
				return handle_performance(scheme_id, scheme_name, specific_horizon=specific_h), None

			# D2.4: Conversational facts for resolved scheme
			grounding_facts = build_grounding_facts_for_scheme(scheme_id)
			if grounding_facts:
				return None, grounding_facts

		# Subcase D3: No scheme found in history -> Missing context!
		target_date = extract_date_from_query(q)
		if target_date and is_nav_query(q):
			return {
				"message": (
					f"You enquired about the NAV on **{format_display_date(target_date)}**, "
					"but didn't specify which scheme. Which SIF scheme would you like to check?"
				),
				"suggestions": ["Explore SIF Schemes", "What is an SIF?"],
				"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
				"contextSummary": f"Historical NAV query for {format_display_date(target_date)} without scheme name.",
			}, None

		if is_performance_query(q):
			specific_h = extract_performance_horizon(q)
			horizon_str = f" the {specific_h[1]} return" if specific_h else " the returns"
			return {
				"message": (
					f"Which SIF scheme would you like to check{horizon_str} for? "
					"Please provide the scheme name (for example, *Apex Equity Long-Short Fund*)."
				),
				"suggestions": ["Explore SIF Schemes", "What is an SIF?"],
				"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
				"contextSummary": f"Follow-up{horizon_str} inquiry without preceding scheme context.",
			}, None

		if is_nav_query(q):
			return {
				"message": (
					"Which SIF scheme's NAV would you like to check? "
					"Please provide the scheme name (for example, *Apex Equity Long-Short Fund*)."
				),
				"suggestions": ["Explore SIF Schemes", "What is an SIF?"],
				"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
				"contextSummary": "Follow-up NAV inquiry without preceding scheme context.",
			}, None

		if has_followup_reference(q):
			return {
				"message": (
					"Which SIF scheme are you referring to? "
					"Please provide the scheme name so I can assist you with accurate details."
				),
				"suggestions": ["Explore SIF Schemes", "What is an SIF?"],
				"leadOpportunity": {"isAppropriateNow": False, "offerMessage": None},
				"contextSummary": "Follow-up inquiry without preceding scheme context.",
			}, None

	# Case E: General Educational Inquiry (Proceed to Ollama)
	return None, None
