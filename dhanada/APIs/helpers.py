import re
from datetime import datetime

import frappe
from dateutil.relativedelta import relativedelta
from frappe.query_builder import DocType
from frappe.utils import cstr, date_diff, getdate, nowdate


# Regular plans me se primary default plan (Growth) select karta hai.
def get_default_plan(plans):
	if not plans:
		return None

	# Filter strictly to Regular plans
	regular_plans = [
		p
		for p in plans
		if cstr(getattr(p, "type", None) if hasattr(p, "type") else p.get("type")).strip().lower()
		== "regular"
	]
	if not regular_plans:
		return None

	# Sort order: option='Growth' is preferred as primary benchmark option
	def score(p):
		s = 0
		p_opt = cstr(getattr(p, "option", None) if hasattr(p, "option") else p.get("option")).strip().lower()
		if p_opt == "growth":
			s += 10
		return s

	# Sort deterministically by score (desc) then name (desc)
	return sorted(
		regular_plans,
		key=lambda p: (
			score(p),
			getattr(p, "name", None) if hasattr(p, "name") else p.get("name", ""),
		),
		reverse=True,
	)[0]


# Insufficient history wale returns ko None karta hai taaki galat data na dikhe.
def mask_invalid_returns(perf_dict, launch_date, historical_nav=None):
	"""
	MariaDB defaults Float to 0.0. If a fund has insufficient historical coverage for a period,
	convert 0.0 to None so the frontend displays N/A and does not show false filters.
	"""
	if not perf_dict:
		return perf_dict

	# If historical_nav is present, determine actual horizon coverage
	if historical_nav and len(historical_nav) >= 2:
		try:

			def parse_single_dt(s):
				if not s:
					return None
				for fmt in ("%d-%b-%Y", "%Y-%m-%d", "%d/%m/%Y"):
					try:
						return datetime.strptime(s, fmt).date()
					except ValueError:
						pass
				return None

			first_date = parse_single_dt(historical_nav[0].get("date", ""))
			latest_date = parse_single_dt(historical_nav[-1].get("date", ""))

			if first_date and latest_date:
				if first_date > latest_date:
					first_date, latest_date = latest_date, first_date

				horizons = {
					"1_day": len(historical_nav) >= 2,
					"1_week": first_date <= (latest_date - relativedelta(days=7)),
					"1_month": first_date <= (latest_date - relativedelta(months=1)),
					"3_months": first_date <= (latest_date - relativedelta(months=3)),
					"6_months": first_date <= (latest_date - relativedelta(months=6)),
					"year_to_date": first_date <= datetime(latest_date.year, 1, 1).date(),
					"1_year": first_date <= (latest_date - relativedelta(years=1)),
					"2_years": first_date <= (latest_date - relativedelta(years=2)),
					"3_years": first_date <= (latest_date - relativedelta(years=3)),
					"5_years": first_date <= (latest_date - relativedelta(years=5)),
					"10_years": first_date <= (latest_date - relativedelta(years=10)),
					"since_inception": len(historical_nav) >= 2,
				}

				for key, is_available in horizons.items():
					if key in perf_dict and not is_available:
						perf_dict[key] = None

				return perf_dict
		except Exception:
			pass

	# Fallback to age_days if historical_nav is not available
	age_days = date_diff(nowdate(), getdate(launch_date)) if launch_date else None
	thresholds = {
		"1_day": 1,
		"1_week": 7,
		"1_month": 30,
		"3_months": 92,
		"6_months": 182,
		"1_year": 365,
		"2_years": 730,
		"3_years": 1095,
		"5_years": 1825,
		"10_years": 3650,
	}

	if age_days is not None:
		for key, min_days in thresholds.items():
			if key in perf_dict and age_days < min_days:
				perf_dict[key] = None

	return perf_dict


# SIF code ke basis par directly performance metrics laata hai.
def get_performance_for_sif(sif_code: str):
	"""
	Returns performance metrics for a given SIF code directly from SIF Scheme Plan Performance
	using Frappe Query Builder.
	"""
	if not sif_code:
		return None

	clean_code = str(sif_code).strip().upper().replace("_", "-")
	if re.match(r"^SIF\d+$", clean_code):
		clean_code = f"SIF-{clean_code[3:]}"

	code_variants = list(
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

	try:
		Plan = DocType("SIF Scheme Plan")
		Perf = DocType("SIF Scheme Plan Performance")

		query = (
			frappe.qb.from_(Plan)
			.inner_join(Perf)
			.on(Plan.performance == Perf.name)
			.select(
				Perf["1_day"],
				Perf["1_week"],
				Perf["1_month"],
				Perf["3_months"],
				Perf["6_months"],
				Perf.year_to_date,
				Perf["1_year"],
				Perf["2_years"],
				Perf["3_years"],
				Perf["5_years"],
				Perf.since_inception,
				Perf.performance_date,
			)
			.where(Plan.sif_code.isin(code_variants) & (Plan.type == "Regular"))
			.limit(1)
		)
		results = query.run(as_dict=True)
		return results[0] if results else None
	except Exception as e:
		frappe.log_error(title="Failed to fetch performance for sif_code", message=str(e))
	return None
