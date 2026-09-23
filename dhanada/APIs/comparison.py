import json

import frappe
from frappe.query_builder import DocType
from frappe.rate_limiter import rate_limit

from .helpers import get_default_plan, mask_invalid_returns
from .scheme_details import get_historical_nav_for_sif


# Selected funds ka comparison data laata hai.
@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=120, seconds=60, ip_based=True)
def get_comparison_data(scheme_ids: str | list | None = None):
	"""
	Targeted Comparison API. Queries ONLY the schemes requested for comparison (e.g. 2-3 schemes)
	using Frappe Query Builder.
	"""
	try:
		if isinstance(scheme_ids, str):
			try:
				parsed = json.loads(scheme_ids)
				if isinstance(parsed, list):
					scheme_ids = parsed
				else:
					scheme_ids = [s.strip() for s in scheme_ids.split(",") if s.strip()]
			except Exception:
				scheme_ids = [s.strip() for s in scheme_ids.split(",") if s.strip()]

		if not scheme_ids:
			return {"status": "success", "data": []}

		# Clean IDs and maintain max limit of 5 to prevent abuse
		clean_ids = [str(sid).strip() for sid in scheme_ids if str(sid).strip()][:5]
		if not clean_ids:
			return {"status": "success", "data": []}

		Scheme = DocType("SIF Scheme")
		DocType("SIF Asset Management Company")

		# 1. Fetch targeted schemes with only required comparison columns
		schemes_query = (
			frappe.qb.from_(Scheme)
			.select(
				Scheme.name.as_("id"),
				Scheme.sebi_code,
				Scheme.scheme_name.as_("name"),
				Scheme.scheme_subcategory.as_("category"),
				Scheme.investment_strategy.as_("investmentStrategy"),
				Scheme.benchmark_tier_1.as_("benchmarkTier1"),
				Scheme.risk_band.as_("risk"),
				Scheme.nfo_start_date,
				Scheme.nfo_allotment_date,
			)
			.where((Scheme.name.isin(clean_ids)) | (Scheme.sebi_code.isin(clean_ids)))
		)

		schemes = schemes_query.run(as_dict=True)
		if not schemes:
			return {"status": "success", "data": []}

		matched_ids = [s["id"] for s in schemes]

		# 2. Query Regular Plans and Performance for matched schemes
		Plan = DocType("SIF Scheme Plan")
		Perf = DocType("SIF Scheme Plan Performance")

		plans_query = (
			frappe.qb.from_(Plan)
			.left_join(Perf)
			.on(Plan.performance == Perf.name)
			.select(
				Plan.name,
				Plan.scheme,
				Plan.type,
				Plan.option,
				Plan.sub_option,
				Plan.sif_code,
				Plan.nav,
				Plan.nav_date,
				Plan.aum,
				Plan.performance,
				Perf["1_day"].as_("perf_1d"),
				Perf["1_week"].as_("perf_1w"),
				Perf["1_month"].as_("perf_1m"),
				Perf["3_months"].as_("perf_3m"),
				Perf["6_months"].as_("perf_6m"),
				Perf["1_year"].as_("perf_1y"),
				Perf.since_inception.as_("perf_si"),
			)
			.where(Plan.scheme.isin(matched_ids) & (Plan.type == "Regular"))
		)
		plans_records = plans_query.run(as_dict=True)

		plans_by_scheme = {}
		for p in plans_records:
			s_id = str(p.scheme)
			if s_id not in plans_by_scheme:
				plans_by_scheme[s_id] = []
			plans_by_scheme[s_id].append(p)

		# 3. Assemble comparison items with request-local NAV caching
		result = []
		nav_cache = {}
		for s in schemes:
			s_id = str(s["id"])
			launch_date = s.get("nfo_allotment_date") or s.get("nfo_start_date")
			scheme_plans = plans_by_scheme.get(s_id, [])
			best_plan = get_default_plan(scheme_plans)

			plan_nav = None
			plan_aum = None
			historical_nav = []
			perf_data = None

			if best_plan:
				plan_nav = best_plan.get("nav") if best_plan.get("nav_date") else None
				plan_aum = best_plan.get("aum")

				sif_code_val = best_plan.get("sif_code")
				if sif_code_val:
					if sif_code_val not in nav_cache:
						nav_cache[sif_code_val] = get_historical_nav_for_sif(sif_code_val)
					historical_nav = nav_cache[sif_code_val]

				if best_plan.get("performance"):
					perf_dict = {
						"1_day": best_plan.get("perf_1d"),
						"1_week": best_plan.get("perf_1w"),
						"1_month": best_plan.get("perf_1m"),
						"3_months": best_plan.get("perf_3m"),
						"6_months": best_plan.get("perf_6m"),
						"1_year": best_plan.get("perf_1y"),
						"since_inception": best_plan.get("perf_si"),
					}
					perf_data = mask_invalid_returns(perf_dict, launch_date, historical_nav=historical_nav)

			result.append(
				{
					"id": s["id"],
					"sebi_code": s.get("sebi_code"),
					"name": s.get("name"),
					"category": s.get("category"),
					"investmentStrategy": s.get("investmentStrategy"),
					"benchmarkTier1": s.get("benchmarkTier1"),
					"benchmark": s.get("benchmarkTier1"),
					"risk": s.get("risk"),
					"riskLevel": s.get("risk"),
					"nav": plan_nav,
					"aum": plan_aum,
					"expenseRatio": None,
					"historicalNav": historical_nav,
					"performance_data": perf_data,
				}
			)

		return {"status": "success", "data": result}

	except Exception as e:
		frappe.log_error(title="get_comparison_data API Error", message=frappe.get_traceback())
		return {"status": "error", "message": str(e)}
