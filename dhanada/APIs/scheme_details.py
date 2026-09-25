import math
import re

import frappe
from frappe.query_builder import DocType, Order
from frappe.query_builder.functions import Count
from frappe.rate_limiter import rate_limit

from .helpers import get_default_plan, mask_invalid_returns


# SIF code format ko clean aur standardize karta hai.
def _clean_sif_code(sif_code: str) -> list[str]:
	if not sif_code:
		return []
	clean_code = str(sif_code).strip().upper().replace("_", "-")
	if re.match(r"^SIF\d+$", clean_code):
		clean_code = f"SIF-{clean_code[3:]}"

	return list(
		dict.fromkeys(
			[
				clean_code,
				str(sif_code).strip(),
				str(sif_code).strip().upper(),
				str(sif_code).strip().lower(),
				str(sif_code).strip().lower().replace("-", "_"),
			]
		)
	)


# SIF code ke liye database se historical NAV time-series data laata hai.
def get_historical_nav_for_sif(sif_code: str) -> list[dict]:
	"""
	Loads historical NAV time-series records for a given SIF code from
	the SIF NAV Historical Data Entry table using Frappe Query Builder.
	Returns list of dicts: [{'date': '14-Oct-2025', 'nav': 10.0149}, ...]
	"""
	if not sif_code:
		return []

	code_variants = _clean_sif_code(sif_code)

	try:
		Entry = DocType("SIF NAV Historical Data Entry")

		query = (
			frappe.qb.from_(Entry)
			.select(Entry.nav_date, Entry.nav)
			.where(Entry.parent.isin(code_variants) & (Entry.parenttype == "SIF NAV Historical Data"))
			.orderby(Entry.nav_date, order=Order.asc)
		)

		records = query.run(as_dict=True)

		return [
			{
				"date": r.nav_date.strftime("%d-%b-%Y")
				if hasattr(r.nav_date, "strftime")
				else frappe.utils.format_date(r.nav_date, "dd-MMM-yyyy"),
				"nav": float(r.nav) if r.nav is not None else 0.0,
			}
			for r in records
		]
	except Exception as e:
		frappe.log_error(
			title="Historical NAV DB Query Error",
			message=f"Failed to fetch historical NAV for {sif_code}: {e}",
		)
		return []


# SIF ka historical NAV data laata hai.
@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=180, seconds=60, ip_based=True)
def get_historical_nav(
	sif_code: str | None = None,
	scheme_id: str | int | None = None,
	plan_isin: str | None = None,
	isin: str | None = None,
):
	"""
	Retrieves historical NAV time-series for a given SIF code or scheme.
	"""
	try:
		target_code = sif_code
		if not target_code and (scheme_id or plan_isin or isin):
			Plan = DocType("SIF Scheme Plan")
			query = frappe.qb.from_(Plan).select(Plan.sif_code).limit(1)
			if plan_isin or isin:
				query = query.where(Plan.isin == (plan_isin or isin))
			elif scheme_id:
				query = query.where(
					(Plan.scheme == str(scheme_id)) & (Plan.type == "Regular") & (Plan.sif_code.isnotnull())
				)
			res = query.run(as_dict=True)
			if res and res[0].get("sif_code"):
				target_code = res[0]["sif_code"]

		if not target_code:
			return {"status": "success", "data": []}

		data = get_historical_nav_for_sif(target_code)
		return {"status": "success", "data": data}
	except Exception as e:
		frappe.log_error(title="get_historical_nav API Error", message=frappe.get_traceback())
		return {"status": "error", "message": str(e)}


# Fund selector ke liye minimal funds list (id, name, category, risk) laata hai.
@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=60, seconds=60, ip_based=True)
def get_funds_selector_list():
	"""
	Lightweight selector list API. Returns only {id, name, category, risk}
	for populating the 3-slot comparator dropdowns with minimal payload.
	"""
	try:
		Scheme = DocType("SIF Scheme")
		query = (
			frappe.qb.from_(Scheme)
			.select(
				Scheme.name.as_("id"),
				Scheme.sebi_code,
				Scheme.scheme_name.as_("name"),
				Scheme.scheme_subcategory.as_("category"),
				Scheme.scheme_subcategory.as_("schemeSubcategory"),
				Scheme.investment_strategy.as_("strategy"),
				Scheme.risk_band.as_("risk"),
			)
			.where(Scheme.docstatus < 2)
			.orderby(Scheme.scheme_name, order=Order.asc)
		)
		rows = query.run(as_dict=True)
		return {"status": "success", "data": rows}
	except Exception as e:
		frappe.log_error(title="get_funds_selector_list API Error", message=frappe.get_traceback())
		return {"status": "error", "message": str(e)}


# SIF page ke liye required funds ka paginated data laata hai.
@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=60, seconds=60, ip_based=True)
def get_funds_list(
	page: int = 1,
	page_size: int = 5,
	search: str | None = None,
	strategy: str | None = None,
	subcategory: str | None = None,
	risk: str | None = None,
	sort_by: str = "returns1M",
	sort_order: str = "desc",
	all_records: bool | str = False,
):
	"""
	Optimized, paginated SIF Listing API using Frappe Query Builder.
	Projects only fields required by the listing UI and computes DB-level pagination.
	"""
	try:
		# 1. Parse and validate pagination parameters
		if isinstance(all_records, str):
			all_records = all_records.lower() in ("true", "1", "yes")

		try:
			page = max(1, int(page))
		except ValueError, TypeError:
			page = 1

		try:
			page_size = max(1, min(100, int(page_size))) if not all_records else 1000
		except ValueError, TypeError:
			page_size = 5

		# 2. Build Query Builder objects
		Scheme = DocType("SIF Scheme")
		AMC = DocType("SIF Asset Management Company")
		Plan = DocType("SIF Scheme Plan")
		Perf = DocType("SIF Scheme Plan Performance")

		# Base conditions
		conditions = Scheme.docstatus < 2

		if search and search.strip():
			q = f"%{search.strip()}%"
			conditions &= (
				Scheme.scheme_name.like(q)
				| Scheme.amc.like(q)
				| Scheme.investment_strategy.like(q)
				| Scheme.scheme_subcategory.like(q)
			)

		if strategy and strategy.strip() and strategy.strip().lower() != "all":
			conditions &= Scheme.investment_strategy == strategy.strip()

		if subcategory and subcategory.strip() and subcategory.strip().lower() != "all":
			conditions &= Scheme.scheme_subcategory == subcategory.strip()

		if risk and risk.strip() and risk.strip().lower() != "all":
			risk_num_match = re.search(r"\d+", risk)
			if risk_num_match:
				target_risk = int(risk_num_match.group(0))
				conditions &= Scheme.risk_band == target_risk

		# 3. Get total count using Query Builder COUNT query
		count_query = frappe.qb.from_(Scheme).select(Count(Scheme.name).as_("total")).where(conditions)
		count_res = count_query.run(as_dict=True)
		total_count = int(count_res[0].get("total", 0)) if count_res else 0
		total_pages = math.ceil(total_count / page_size) if page_size > 0 else 1

		# 4. Determine Sort Field and Order
		sort_field_map = {
			"name": Scheme.scheme_name,
			"scheme_name": Scheme.scheme_name,
			"investmentstrategy": Scheme.investment_strategy,
			"strategy": Scheme.investment_strategy,
			"schemesubcategory": Scheme.scheme_subcategory,
			"subcategory": Scheme.scheme_subcategory,
			"risk": Scheme.risk_band,
			"risklevel": Scheme.risk_band,
			"risk_band": Scheme.risk_band,
			"creation": Scheme.creation,
		}

		qb_order = Order.desc if str(sort_order).lower() == "desc" else Order.asc
		sort_key = str(sort_by).lower().replace("_", "")
		qb_sort_field = sort_field_map.get(sort_key)

		# 5. Fetch Scheme page slice with minimal required listing columns
		offset = (page - 1) * page_size if not all_records else 0

		data_query = (
			frappe.qb.from_(Scheme)
			.left_join(AMC)
			.on(Scheme.amc == AMC.name)
			.select(
				Scheme.name.as_("id"),
				Scheme.scheme_name.as_("name"),
				Scheme.amc.as_("amc_code"),
				AMC.amc_name.as_("amc_name"),
				AMC.amc_logo,
				Scheme.scheme_subcategory.as_("schemeSubcategory"),
				Scheme.investment_strategy.as_("investmentStrategy"),
				Scheme.risk_band.as_("risk"),
				Scheme.nfo_start_date,
				Scheme.nfo_allotment_date,
			)
			.where(conditions)
		)

		if qb_sort_field is not None:
			data_query = data_query.orderby(qb_sort_field, order=qb_order)
		elif sort_key in ("returns1m", "1m"):
			# Direct DB-level sort using join with default Regular plan performance
			data_query = (
				frappe.qb.from_(Scheme)
				.left_join(AMC)
				.on(Scheme.amc == AMC.name)
				.left_join(Plan)
				.on((Plan.scheme == Scheme.name) & (Plan.type == "Regular"))
				.left_join(Perf)
				.on(Plan.performance == Perf.name)
				.select(
					Scheme.name.as_("id"),
					Scheme.scheme_name.as_("name"),
					Scheme.amc.as_("amc_code"),
					AMC.amc_name.as_("amc_name"),
					AMC.amc_logo,
					Scheme.scheme_subcategory.as_("schemeSubcategory"),
					Scheme.investment_strategy.as_("investmentStrategy"),
					Scheme.risk_band.as_("risk"),
					Scheme.nfo_start_date,
					Scheme.nfo_allotment_date,
				)
				.where(conditions)
				.groupby(Scheme.name)
				.orderby(Perf["1_month"], order=qb_order)
			)
		elif sort_key == "nav":
			data_query = (
				frappe.qb.from_(Scheme)
				.left_join(AMC)
				.on(Scheme.amc == AMC.name)
				.left_join(Plan)
				.on((Plan.scheme == Scheme.name) & (Plan.type == "Regular"))
				.select(
					Scheme.name.as_("id"),
					Scheme.scheme_name.as_("name"),
					Scheme.amc.as_("amc_code"),
					AMC.amc_name.as_("amc_name"),
					AMC.amc_logo,
					Scheme.scheme_subcategory.as_("schemeSubcategory"),
					Scheme.investment_strategy.as_("investmentStrategy"),
					Scheme.risk_band.as_("risk"),
					Scheme.nfo_start_date,
					Scheme.nfo_allotment_date,
				)
				.where(conditions)
				.groupby(Scheme.name)
				.orderby(Plan.nav, order=qb_order)
			)
		else:
			data_query = data_query.orderby(Scheme.name, order=Order.desc)

		if not all_records:
			data_query = data_query.limit(page_size).offset(offset)

		schemes_slice = data_query.run(as_dict=True)

		if not schemes_slice:
			return {
				"status": "success",
				"data": [],
				"pagination": {
					"page": page,
					"page_size": page_size,
					"total": total_count,
					"total_pages": total_pages,
					"has_next": False,
					"has_previous": page > 1,
				},
			}

		# 6. Batch query Regular Plans and Performance for the retrieved schemes in a single targeted query
		scheme_ids = [s["id"] for s in schemes_slice]
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
				Plan.nav,
				Plan.nav_date,
				Plan.performance,
				Perf["1_month"].as_("return_1m"),
			)
			.where(Plan.scheme.isin(scheme_ids) & (Plan.type == "Regular"))
		)
		plans_records = plans_query.run(as_dict=True)

		# Group plans by scheme
		plans_by_scheme = {}
		for p in plans_records:
			s_id = str(p.scheme)
			if s_id not in plans_by_scheme:
				plans_by_scheme[s_id] = []
			plans_by_scheme[s_id].append(p)

		# 7. Assemble minimal listing records
		result = []
		for s in schemes_slice:
			s_id = str(s["id"])
			launch_date = s.get("nfo_allotment_date") or s.get("nfo_start_date")
			scheme_plans = plans_by_scheme.get(s_id, [])
			best_plan = get_default_plan(scheme_plans)

			plan_nav = None
			nav_date = None
			returns_1m = None

			if best_plan:
				plan_nav = best_plan.get("nav") if best_plan.get("nav_date") else None
				nav_date = best_plan.get("nav_date")

				if best_plan.get("performance"):
					perf_raw = {
						"1_month": best_plan.get("return_1m"),
					}
					perf_masked = mask_invalid_returns(perf_raw, launch_date)
					returns_1m = perf_masked.get("1_month")

			amc_name = s.get("amc_name") or s.get("amc_code")
			amc_logo = s.get("amc_logo")
			if amc_logo and isinstance(amc_logo, str) and amc_logo.startswith("/private/files/"):
				amc_logo = amc_logo.replace("/private/files/", "/files/")

			nav_date_str = (
				nav_date.strftime("%Y-%m-%d")
				if hasattr(nav_date, "strftime")
				else (str(nav_date) if nav_date else None)
			)

			result.append(
				{
					"id": s["id"],  # True document identifier from SIF Scheme.name
					"amc_logo": amc_logo,
					"name": s.get("name"),
					"amc": amc_name,
					"investmentStrategy": s.get("investmentStrategy"),
					"schemeSubcategory": s.get("schemeSubcategory"),
					"risk": s.get("risk"),
					"riskLevel": s.get("risk"),
					"nav": plan_nav,
					"navDate": nav_date_str,
					"returns1M": returns_1m,
				}
			)

		# If sorting by returns or NAV was requested and could not be done in SQL, sort the final page
		if str(sort_by).lower() in ("returns1m", "returns_1m", "nav"):
			sort_key_field = "returns1M" if "1m" in str(sort_by).lower() else "nav"
			reverse_order = str(sort_order).lower() == "desc"
			result.sort(
				key=lambda x: (
					x.get(sort_key_field) is not None,
					float(x.get(sort_key_field)) if x.get(sort_key_field) is not None else -999999.0,
				),
				reverse=reverse_order,
			)

		return {
			"status": "success",
			"data": result,
			"pagination": {
				"page": page,
				"page_size": page_size,
				"total": total_count,
				"total_pages": total_pages,
				"has_next": page < total_pages,
				"has_previous": page > 1,
			},
		}

	except Exception as e:
		frappe.log_error(title="get_funds_list API Error", message=frappe.get_traceback())
		return {"status": "error", "message": str(e)}


# Ek specific SIF ki complete required details laata hai.
@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
@rate_limit(limit=120, seconds=60, ip_based=True)
def get_fund_details(
	identifier: str | int | None = None,
	scheme_id: str | int | None = None,
	fund_id: str | int | None = None,
	id: str | int | None = None,
	sebi_code: str | None = None,
	plan_id: str | int | None = None,
	plan_name: str | None = None,
	isin: str | None = None,
):
	"""
	Targeted SIF Scheme Details API. Accepts internal document ID (name) or sebi_code.
	Fetches scheme metadata and plan-dependent data (historical NAV & performance)
	ONLY for the requested plan or default Regular - Growth plan.
	"""
	try:
		target_id = identifier or scheme_id or fund_id or id or sebi_code
		if not target_id:
			return {"status": "error", "message": "Identifier is required"}

		target_id = str(target_id).strip()
		Scheme = DocType("SIF Scheme")
		AMC = DocType("SIF Asset Management Company")

		# 1. Lookup scheme by name (ID) or sebi_code
		scheme_query = (
			frappe.qb.from_(Scheme)
			.left_join(AMC)
			.on(Scheme.amc == AMC.name)
			.select(
				Scheme.name.as_("id"),
				Scheme.sebi_code,
				Scheme.scheme_name.as_("name"),
				Scheme.amc.as_("amc_code"),
				AMC.amc_name.as_("amc_name"),
				AMC.amc_logo,
				Scheme.scheme_subcategory.as_("category"),
				Scheme.scheme_type.as_("schemeType"),
				Scheme.investment_strategy.as_("investmentStrategy"),
				Scheme.benchmark_tier_1.as_("benchmarkTier1"),
				Scheme.benchmark_tier_2.as_("benchmarkTier2"),
				Scheme.nfo_start_date,
				Scheme.nfo_allotment_date,
				Scheme.scheme_reopen_date.as_("reopenDate"),
				Scheme.maturity_date.as_("maturityDate"),
				Scheme.scheme_objective.as_("schemeObjective"),
				Scheme.exit_load.as_("exitLoad"),
				Scheme.minimum_subscription.as_("minInvestment"),
				Scheme.face_value.as_("faceValue"),
				Scheme.registrar,
				Scheme.custodian,
				Scheme.auditor,
				Scheme.risk_band.as_("risk"),
				Scheme.riskometer_at_launch.as_("riskometerAtLaunch"),
				Scheme.potential_risk_class.as_("potentialRiskClass"),
				Scheme.factsheet_url,
				Scheme.kim_url,
				Scheme.sai_url,
				Scheme.isid_url,
			)
			.where((Scheme.name == target_id) | (Scheme.sebi_code == target_id))
			.limit(1)
		)

		schemes = scheme_query.run(as_dict=True)
		if not schemes:
			return {"status": "error", "message": "Fund not found"}

		scheme = schemes[0]
		scheme_id = scheme["id"]
		launch_date = scheme.get("nfo_allotment_date") or scheme.get("nfo_start_date")

		# 2. AMC details
		amc_name = scheme.get("amc_name") or scheme.get("amc_code")
		amc_logo = scheme.get("amc_logo")
		if amc_logo and isinstance(amc_logo, str) and amc_logo.startswith("/private/files/"):
			amc_logo = amc_logo.replace("/private/files/", "/files/")

		# 3. Query Regular Plans using Query Builder
		Plan = DocType("SIF Scheme Plan")
		Perf = DocType("SIF Scheme Plan Performance")

		plans_query = (
			frappe.qb.from_(Plan)
			.select(
				Plan.name,
				Plan.type,
				Plan.option,
				Plan.sub_option,
				Plan.period,
				Plan.isin,
				Plan.sif_code,
				Plan.rta_code,
				Plan.nav,
				Plan.nav_date,
				Plan.aum,
				Plan.performance,
			)
			.where((Plan.scheme == scheme_id) & (Plan.type == "Regular"))
		)
		plans_records = plans_query.run(as_dict=True)

		# 4. Resolve targeted plan (requested plan or default Regular - Growth plan)
		target_plan_identifier = plan_id or plan_name or isin
		target_plan = None
		if target_plan_identifier:
			for p in plans_records:
				if (
					str(p.get("name")) == str(target_plan_identifier)
					or str(p.get("isin")) == str(target_plan_identifier)
					or str(p.get("sif_code")) == str(target_plan_identifier)
					or str(p.get("option", "")).lower() == str(target_plan_identifier).lower()
				):
					target_plan = p
					break

		if not target_plan:
			target_plan = get_default_plan(plans_records) or (plans_records[0] if plans_records else None)

		# 5. Query performance and historical NAV ONLY for the target plan
		historical_nav = []
		perf_data = None

		if target_plan:
			sif_code_val = target_plan.get("sif_code")
			if sif_code_val:
				historical_nav = get_historical_nav_for_sif(sif_code_val)

			if target_plan.get("performance"):
				perf_rows = (
					frappe.qb.from_(Perf)
					.select(
						Perf["1_day"].as_("perf_1d"),
						Perf["1_week"].as_("perf_1w"),
						Perf["1_month"].as_("perf_1m"),
						Perf["3_months"].as_("perf_3m"),
						Perf["6_months"].as_("perf_6m"),
						Perf.year_to_date.as_("perf_ytd"),
						Perf["1_year"].as_("perf_1y"),
						Perf["2_years"].as_("perf_2y"),
						Perf["3_years"].as_("perf_3y"),
						Perf["5_years"].as_("perf_5y"),
						Perf.since_inception.as_("perf_si"),
						Perf.performance_date.as_("perf_date"),
					)
					.where(Perf.name == target_plan["performance"])
					.run(as_dict=True)
				)
				if perf_rows:
					p_perf = perf_rows[0]
					perf_dict = {
						"1_day": p_perf.get("perf_1d"),
						"1_week": p_perf.get("perf_1w"),
						"1_month": p_perf.get("perf_1m"),
						"3_months": p_perf.get("perf_3m"),
						"6_months": p_perf.get("perf_6m"),
						"year_to_date": p_perf.get("perf_ytd"),
						"1_year": p_perf.get("perf_1y"),
						"2_years": p_perf.get("perf_2y"),
						"3_years": p_perf.get("perf_3y"),
						"5_years": p_perf.get("perf_5y"),
						"since_inception": p_perf.get("perf_si"),
						"performance_date": p_perf.get("perf_date"),
					}
					perf_data = mask_invalid_returns(perf_dict, launch_date, historical_nav=historical_nav)

		# 6. Assemble plans list with lightweight metadata, populating heavy fields only on target plan
		plans = []
		for p in plans_records:
			is_target = bool(target_plan and p["name"] == target_plan["name"])
			p_nav = p.get("nav") if p.get("nav_date") else None
			plans.append(
				{
					"name": p["name"],
					"type": p["type"],
					"option": p["option"],
					"sub_option": p["sub_option"],
					"period": p["period"],
					"isin": p["isin"],
					"sif_code": p["sif_code"],
					"rta_code": p.get("rta_code"),
					"nav": p_nav,
					"nav_date": p.get("nav_date"),
					"aum": p.get("aum"),
					"historical_nav": historical_nav if is_target else [],
					"performance_data": perf_data if is_target else None,
				}
			)

		target_plan_dict = next(
			(p for p in plans if target_plan and p["name"] == target_plan["name"]),
			plans[0] if plans else None,
		)

		# 7. Query Fund Managers using Query Builder
		FM_Link = DocType("SIF Scheme Fund Manager")
		FM = DocType("SIF Fund Manager")

		managers_query = (
			frappe.qb.from_(FM_Link)
			.left_join(FM)
			.on(FM_Link.manager_name == FM.name)
			.select(
				FM_Link.manager_name.as_("id"),
				FM.manager_name.as_("name"),
				FM_Link["from"].as_("from"),
				FM_Link["to"].as_("to"),
				FM_Link.is_active,
			)
			.where(FM_Link.parent == scheme_id)
		)
		manager_rows = managers_query.run(as_dict=True)
		managers = [
			{
				"name": m.get("name") or m.get("id"),
				"from": m.get("from"),
				"to": m.get("to"),
				"is_active": m.get("is_active"),
			}
			for m in manager_rows
		]

		# 8. Query Allocations using Query Builder
		Alloc = DocType("SIF Scheme Allocation")
		alloc_query = (
			frappe.qb.from_(Alloc)
			.select(
				Alloc.allocation_type.as_("type"),
				Alloc.minimum_allocation_percentage.as_("min"),
				Alloc.maximum_allocation_percentage.as_("max"),
			)
			.where(Alloc.parent == scheme_id)
		)
		allocations = alloc_query.run(as_dict=True)

		data = {
			"id": scheme["id"],  # True internal identifier
			"sebi_code": scheme.get("sebi_code"),
			"name": scheme.get("name"),
			"amc": amc_name,
			"amc_code": scheme.get("amc_code"),
			"amc_logo": amc_logo,
			"amcLogo": amc_logo,
			"logo": amc_logo,
			"category": scheme.get("category"),
			"schemeType": scheme.get("schemeType"),
			"investmentStrategy": scheme.get("investmentStrategy"),
			"benchmarkTier1": scheme.get("benchmarkTier1"),
			"benchmarkTier2": scheme.get("benchmarkTier2"),
			"launchDate": launch_date,
			"reopenDate": scheme.get("reopenDate"),
			"maturityDate": scheme.get("maturityDate"),
			"schemeObjective": scheme.get("schemeObjective"),
			"exitLoad": scheme.get("exitLoad"),
			"minInvestment": scheme.get("minInvestment"),
			"faceValue": scheme.get("faceValue"),
			"registrar": scheme.get("registrar"),
			"custodian": scheme.get("custodian"),
			"auditor": scheme.get("auditor"),
			"risk": scheme.get("risk"),
			"riskLevel": scheme.get("risk"),
			"riskometerAtLaunch": scheme.get("riskometerAtLaunch"),
			"potentialRiskClass": scheme.get("potentialRiskClass"),
			"documents": {
				"factsheet": scheme.get("factsheet_url"),
				"kim": scheme.get("kim_url"),
				"sai": scheme.get("sai_url"),
				"isid": scheme.get("isid_url"),
			},
			"managers": managers,
			"allocations": allocations,
			"plans": plans,
			"selectedPlan": target_plan_dict,
		}

		return {"status": "success", "data": data}

	except Exception as e:
		frappe.log_error(title="get_fund_details API Error", message=frappe.get_traceback())
		return {"status": "error", "message": str(e)}
