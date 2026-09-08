import csv
import io
import json
import os
import re
from datetime import datetime

import frappe
from dateutil.relativedelta import relativedelta
from frappe.utils import cstr, date_diff, flt, getdate, nowdate

ALLOWED_SCHEME_DATA_SUBDIRS = {
	"performance": "performance",
	"historical_nav": os.path.join("nav", "historical"),
}


def _get_candidate_scheme_base_dirs() -> list[str]:
	"""
	Returns a list of candidate base directory paths for AMFI_Fetcher scheme data.
	Supports site config overrides, environment variables, dynamic app/site relative paths,
	and standard container paths without hardcoding developer-specific paths.
	"""
	candidates = []

	# 1. Configured path via site config / common site config
	for key in ("sif_data_path", "amfi_fetcher_path", "amfi_fetcher_data_path"):
		try:
			conf_path = frappe.conf.get(key)
			if conf_path and isinstance(conf_path, str):
				candidates.append(conf_path)
		except Exception:
			pass

	# 2. Configured path via environment variables
	for env_key in ("SIF_DATA_PATH", "AMFI_FETCHER_DATA_PATH", "AMFI_FETCHER_PATH"):
		env_path = os.environ.get(env_key)
		if env_path:
			candidates.append(env_path)

	# 3. Dynamic App-relative paths (works across local bench, dev server, containerized app)
	try:
		app_path = frappe.get_app_path("dhanada")
		candidates.extend(
			[
				os.path.join(app_path, "..", "..", "..", "..", "AMFI_Fetcher", "data", "sif", "scheme"),
				os.path.join(app_path, "..", "..", "..", "AMFI_Fetcher", "data", "sif", "scheme"),
				os.path.join(app_path, "..", "..", "AMFI_Fetcher", "data", "sif", "scheme"),
				os.path.join(app_path, "..", "..", "..", "..", "data", "sif", "scheme"),
				os.path.join(app_path, "..", "..", "..", "data", "sif", "scheme"),
				os.path.join(app_path, "data", "sif", "scheme"),
			]
		)
	except Exception:
		pass

	# 4. Dynamic Site-relative paths (works with custom site volumes and multi-tenant setups)
	try:
		site_path = frappe.get_site_path()
		candidates.extend(
			[
				os.path.join(site_path, "..", "..", "..", "AMFI_Fetcher", "data", "sif", "scheme"),
				os.path.join(site_path, "..", "..", "AMFI_Fetcher", "data", "sif", "scheme"),
				os.path.join(site_path, "..", "AMFI_Fetcher", "data", "sif", "scheme"),
				os.path.join(site_path, "AMFI_Fetcher", "data", "sif", "scheme"),
				os.path.join(site_path, "data", "sif", "scheme"),
				os.path.join(site_path, "private", "data", "sif", "scheme"),
				os.path.join(site_path, "public", "data", "sif", "scheme"),
			]
		)
	except Exception:
		pass

	# 5. Standard Frappe Linux / Docker container paths
	candidates.extend(
		[
			"/home/frappe/frappe-bench/AMFI_Fetcher/data/sif/scheme",
			"/home/frappe/frappe-bench/sites/data/sif/scheme",
			"/home/frappe/AMFI_Fetcher/data/sif/scheme",
		]
	)

	return candidates


def _get_safe_scheme_data_file(data_type: str, safe_code: str, extension: str) -> str | None:
	"""
	Safely resolves the file path for scheme data (performance JSON or historical NAV CSV).
	Ensures strict path confinement within AMFI_Fetcher data directory to prevent path traversal.
	"""
	if not safe_code or not re.match(r"^[a-z0-9_]+$", safe_code):
		return None

	sub_rel = ALLOWED_SCHEME_DATA_SUBDIRS.get(data_type)
	if not sub_rel:
		return None

	filename = f"{safe_code}.{extension.lstrip('.')}"
	base_candidates = _get_candidate_scheme_base_dirs()

	for base_candidate in base_candidates:
		try:
			allowed_dir = os.path.realpath(os.path.abspath(os.path.join(base_candidate, sub_rel)))
			target_path = os.path.realpath(os.path.abspath(os.path.join(allowed_dir, filename)))

			if (
				os.path.commonpath([allowed_dir, target_path]) == allowed_dir
				and target_path.startswith(allowed_dir + os.sep)
				and os.path.isfile(target_path)
			):
				return target_path
		except Exception:
			continue

	return None


def get_default_plan(plans):
	if not plans:
		return None

	# Sort order: type='Direct' + option='Growth' is best.
	# We will score them to find the best match.
	def score(p):
		s = 0
		p_type = cstr(p.type).strip().lower()
		p_opt = cstr(p.option).strip().lower()
		if p_type == "direct":
			s += 10
		if p_opt == "growth":
			s += 5
		return s

	# Sort deterministically by score (desc) then name (desc)
	return sorted(plans, key=lambda p: (score(p), p.name or ""), reverse=True)[0]


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

			def parse_dt(s):
				for fmt in ("%d-%b-%Y", "%Y-%m-%d", "%d/%m/%Y"):
					try:
						return datetime.strptime(s, fmt).date()
					except ValueError:
						pass
				return None

			dates = sorted([parse_dt(r.get("date", "")) for r in historical_nav if r.get("date")])
			dates = [d for d in dates if d is not None]
			if len(dates) >= 2:
				first_date = dates[0]
				latest_date = dates[-1]

				horizons = {
					"1_day": len(dates) >= 2,
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
					"since_inception": len(dates) >= 2,
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


def get_performance_for_sif(sif_code: str):
	if not sif_code:
		return None
	safe_code = str(sif_code).strip().replace("-", "_").lower()
	path = _get_safe_scheme_data_file("performance", safe_code, "json")
	if not path:
		return None

	try:
		content = frappe.read_file(path)
		if not content:
			return None
		data = json.loads(content)
		returns = data.get("returns", {})
		return {
			"1_day": returns.get("1_day"),
			"1_week": returns.get("1_week"),
			"1_month": returns.get("1_month"),
			"3_months": returns.get("3_month"),
			"6_months": returns.get("6_month"),
			"year_to_date": returns.get("year_to_date"),
			"1_year": returns.get("1_year"),
			"2_years": returns.get("2_year"),
			"3_years": returns.get("3_year"),
			"5_years": returns.get("5_year"),
			"since_inception": returns.get("since_launch"),
			"performance_date": data.get("last_updated"),
		}
	except Exception as e:
		frappe.log_error(f"Failed to read performance JSON {path}: {e}")
	return None


@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
def get_funds_list():
	try:
		schemes = frappe.get_all(
			"SIF Scheme",
			fields=[
				"name",
				"sebi_code",
				"scheme_name",
				"amc",
				"investment_strategy",
				"scheme_subcategory",
				"scheme_type",
				"risk_band",
				"minimum_subscription",
				"exit_load",
				"nfo_start_date",
				"nfo_allotment_date",
			],
		)

		result = []
		for s in schemes:
			launch_date = s.nfo_allotment_date or s.nfo_start_date

			# Get plans for this scheme
			plans = frappe.get_all(
				"SIF Scheme Plan",
				filters={"scheme": s.name},
				fields=["name", "type", "option", "sub_option", "nav", "nav_date", "aum", "performance"],
			)

			best_plan = get_default_plan(plans)

			plan_nav = None
			nav_date = None
			plan_aum = None
			returns_1w = None
			returns_1m = None
			returns_3m = None
			returns_6m = None
			returns_ytd = None
			returns_1y = None
			returns_3y = None
			returns_5y = None

			if best_plan:
				plan_nav = best_plan.nav if best_plan.nav_date else None
				nav_date = best_plan.nav_date
				plan_aum = best_plan.get("aum")

				if best_plan.performance:
					perf = frappe.db.get_value(
						"SIF Scheme Plan Performance",
						best_plan.performance,
						[
							"1_week",
							"1_month",
							"3_months",
							"6_months",
							"year_to_date",
							"1_year",
							"3_years",
							"5_years",
						],
						as_dict=True,
					)
					if perf:
						perf = mask_invalid_returns(perf, launch_date)
						returns_1w = perf.get("1_week")
						returns_1m = perf.get("1_month")
						returns_3m = perf.get("3_months")
						returns_6m = perf.get("6_months")
						returns_ytd = perf.get("year_to_date")
						returns_1y = perf.get("1_year")
						returns_3y = perf.get("3_years")
						returns_5y = perf.get("5_years")

			# Get AMC name if it's a link
			amc_name = None
			if s.amc:
				amc_name = frappe.db.get_value("SIF Asset Management Company", s.amc, "amc_name") or s.amc

			cat_name = None
			if s.scheme_subcategory:
				cat_name = s.scheme_subcategory

			result.append(
				{
					"id": s.sebi_code or s.name,
					"sebi_code": s.sebi_code,
					"name": s.scheme_name,
					"amc": amc_name,
					"category": cat_name,
					"assetClass": s.scheme_type,
					"investmentStrategy": s.investment_strategy,
					"risk": s.risk_band,
					"minInvestment": s.minimum_subscription,
					"nav": plan_nav,
					"navDate": nav_date,
					"returns1W": returns_1w,
					"returns1M": returns_1m,
					"returns3M": returns_3m,
					"returns6M": returns_6m,
					"returnsYTD": returns_ytd,
					"returns1Y": returns_1y,
					"returns3Y": returns_3y,
					"returns5Y": returns_5y,
					"exitLoad": s.exit_load,
					"launchDate": launch_date,
					"aum": plan_aum,
					"expenseRatio": None,
					"rating": None,
					"isNew": False,
				}
			)

		return {"status": "success", "data": result}
	except Exception as e:
		frappe.log_error(title="get_funds_list API Error", message=frappe.get_traceback())
		return {"status": "error", "message": str(e)}


def get_historical_nav_for_sif(sif_code: str) -> list[dict]:
	"""
	Loads historical NAV time-series records for a given SIF code.
	Checks local AMFI_Fetcher directory and fallback paths.
	Returns list of dicts: [{'date': '14-Oct-2025', 'nav': 10.0149}, ...]
	"""
	if not sif_code:
		return []

	safe_code = str(sif_code).strip().lower().replace("-", "_")
	path = _get_safe_scheme_data_file("historical_nav", safe_code, "csv")
	if not path:
		return []

	records = []
	try:
		content = frappe.read_file(path)
		if not content:
			return []
		reader = csv.DictReader(io.StringIO(content))
		for r in reader:
			nav_str = r.get("nav", "").strip()
			date_str = r.get("nav_date", "").strip()
			if not nav_str or not date_str:
				continue
			try:
				nav_val = float(nav_str.replace(",", ""))
				records.append({"date": date_str, "nav": nav_val})
			except (ValueError, TypeError):
				continue
		return records
	except Exception as e:
		frappe.log_error(f"Failed to read historical CSV {path}: {e}", title="Historical NAV Read Error")

	return []


@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
def get_historical_nav(sif_code: str):
	try:
		data = get_historical_nav_for_sif(sif_code)
		return {"status": "success", "data": data}
	except Exception as e:
		return {"status": "error", "message": str(e)}


@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
def get_fund_details(identifier: str):
	try:
		# Identifier can be sebi_code or name
		scheme_name = frappe.db.get_value("SIF Scheme", {"sebi_code": identifier}, "name")
		if not scheme_name:
			scheme_name = frappe.db.get_value("SIF Scheme", {"name": identifier}, "name")

		if not scheme_name:
			return {"status": "error", "message": "Fund not found"}

		scheme = frappe.get_doc("SIF Scheme", scheme_name)

		# Resolve related data
		amc_name = None
		if scheme.amc:
			amc_name = (
				frappe.db.get_value("SIF Asset Management Company", scheme.amc, "amc_name") or scheme.amc
			)

		launch_date = scheme.nfo_allotment_date or scheme.nfo_start_date

		# Get Plans and Performance
		plans = frappe.get_all(
			"SIF Scheme Plan",
			filters={"scheme": scheme.name},
			fields=[
				"name",
				"type",
				"option",
				"sub_option",
				"period",
				"isin",
				"sif_code",
				"rta_code",
				"nav",
				"nav_date",
				"aum",
				"performance",
			],
		)

		for p in plans:
			# Fix False Zero NAV: if there is no nav_date, the nav 0.0 is a default artifact and should be None.
			if not p.nav_date:
				p.nav = None

			if p.sif_code:
				p["historical_nav"] = get_historical_nav_for_sif(p.sif_code)
			else:
				p["historical_nav"] = []

			if p.performance:
				perf = frappe.db.get_value(
					"SIF Scheme Plan Performance",
					p.performance,
					[
						"1_day",
						"1_week",
						"1_month",
						"3_months",
						"6_months",
						"year_to_date",
						"1_year",
						"3_years",
						"5_years",
						"since_inception",
						"performance_date",
					],
					as_dict=True,
				)
				p["performance_data"] = mask_invalid_returns(
					perf, launch_date, historical_nav=p.get("historical_nav")
				)
			else:
				p["performance_data"] = None

		# Managers
		managers = []
		if getattr(scheme, "managers", None):
			for m in scheme.managers:
				# Fetch actual name instead of relying on the Link ID
				actual_name = (
					frappe.db.get_value("SIF Fund Manager", m.manager_name, "manager_name") or m.manager_name
				)
				managers.append(
					{
						"name": actual_name,
						"from": getattr(m, "from", None),
						"to": getattr(m, "to", None),
						"is_active": m.is_active,
					}
				)
		# Allocations
		allocations = (
			[
				{
					"type": a.allocation_type,
					"min": a.minimum_allocation_percentage,
					"max": a.maximum_allocation_percentage,
				}
				for a in scheme.allocations
			]
			if getattr(scheme, "allocations", None)
			else []
		)

		# Find default plan for quick stats
		best_plan = get_default_plan(plans)

		data = {
			"id": scheme.sebi_code or scheme.name,
			"sebi_code": scheme.sebi_code,
			"name": scheme.scheme_name,
			"amc": amc_name,
			"category": scheme.scheme_subcategory,
			"assetClass": scheme.scheme_type,
			"schemeType": scheme.scheme_type,
			"benchmarkTier1": getattr(scheme, "benchmark_tier_1", None),
			"benchmarkTier2": getattr(scheme, "benchmark_tier_2", None),
			"launchDate": launch_date,
			"reopenDate": getattr(scheme, "scheme_reopen_date", None),
			"maturityDate": getattr(scheme, "maturity_date", None),
			"schemeObjective": scheme.scheme_objective,
			"exitLoad": scheme.exit_load,
			"minInvestment": scheme.minimum_subscription,
			"minInvestmentText": getattr(scheme, "minimum_subscription_text", None),
			"faceValue": getattr(scheme, "face_value", None),
			"registrar": getattr(scheme, "registrar", None),
			"custodian": getattr(scheme, "custodian", None),
			"auditor": getattr(scheme, "auditor", None),
			"risk": scheme.risk_band,
			"riskometerAtLaunch": getattr(scheme, "riskometer_at_launch", None),
			"potentialRiskClass": getattr(scheme, "potential_risk_class", None),
			"documents": {
				"factsheet": getattr(scheme, "factsheet_url", None),
				"kim": getattr(scheme, "kim_url", None),
				"sai": getattr(scheme, "sai_url", None),
				"isid": getattr(scheme, "isid_url", None),
			},
			"managers": managers,
			"allocations": allocations,
			"plans": plans,
			"defaultPlan": best_plan,
			# Null fields for gaps
			"fundSize": None,
			"expenseRatio": None,
			"metrics": None,
		}

		return {"status": "success", "data": data}

	except Exception as e:
		frappe.log_error(title="get_fund_details API Error", message=frappe.get_traceback())
		return {"status": "error", "message": str(e)}


@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
def create_chatbot_lead():
	try:
		lead_name = frappe.form_dict.get("lead_name")
		chat_summary_value = frappe.form_dict.get("chat_summary")

		if lead_name and frappe.db.exists("CRM Lead", lead_name):
			frappe.db.set_value("CRM Lead", lead_name, "chat_summary", chat_summary_value)
			frappe.db.commit()
			return {"success": True, "lead_name": lead_name, "updated": True}

		first_name = frappe.form_dict.get("name", "Unknown")
		last_name = ""

		if " " in first_name and first_name != "Unknown":
			parts = first_name.split(" ", 1)
			first_name = parts[0]
			last_name = parts[1]

		doc_data = {
			"doctype": "CRM Lead",
			"first_name": first_name,
			"last_name": last_name,
			"email": frappe.form_dict.get("email"),
			"mobile_no": frappe.form_dict.get("mobile"),
			"interest": frappe.form_dict.get("interest"),
			"chat_summary": chat_summary_value,
			"source": frappe.form_dict.get("source", "Website Chatbot"),
		}

		lead = frappe.get_doc(doc_data)
		lead.insert(ignore_permissions=True)
		frappe.db.commit()

		return {"success": True, "lead_name": lead.name}
	except Exception as e:
		frappe.log_error(message=frappe.get_traceback(), title="Chatbot Lead Creation Failed")
		frappe.throw(f"Failed to create Lead: {e!s}")


@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
def create_website_lead():
	try:
		full_name = frappe.form_dict.get("full_name", "").strip()
		email = frappe.form_dict.get("email", "").strip()
		phone = frappe.form_dict.get("phone", "").strip()

		if not full_name:
			frappe.throw(frappe._("Full Name is a required field."))

		if not email and not phone:
			frappe.throw(frappe._("Please provide either your email address or phone number."))

		first_name = full_name
		last_name = ""

		if " " in full_name:
			parts = full_name.split(" ", 1)
			first_name = parts[0]
			last_name = parts[1]

		doc_data = {
			"doctype": "CRM Lead",
			"first_name": first_name,
			"last_name": last_name,
			"email": email,
			"mobile_no": phone,
			"source": "Website Form",
		}

		lead = frappe.get_doc(doc_data)
		lead.insert(ignore_permissions=True)
		frappe.db.commit()

		return {"success": True, "lead_name": lead.name}
	except Exception as e:
		frappe.log_error(message=frappe.get_traceback(), title="Website Lead Creation Failed")
		# Return error cleanly to frontend
		frappe.local.response["http_status_code"] = 400
		return {"success": False, "message": str(e)}


@frappe.whitelist(allow_guest=True)  # nosemgrep: guest-whitelisted-method
def get_chatbot_config():
	"""Returns non-sensitive chatbot configuration like the API Base URL and CSRF token."""
	try:
		config = {"api_base_url": "", "csrf_token": ""}

		# Provide CSRF token for the frontend to make POST requests
		if hasattr(frappe.local, "session") and frappe.local.session:
			config["csrf_token"] = frappe.sessions.get_csrf_token()

		# Check if the doctype exists in case it hasn't been migrated yet
		if not frappe.db.exists("DocType", "Chatbot AI Credentials"):
			return config

		api_base_url = frappe.db.get_single_value("Chatbot AI Credentials", "api_base_url")
		config["api_base_url"] = api_base_url or ""
		return config
	except Exception as e:
		frappe.log_error(message=str(e), title="Chatbot Config Error")
		return {"api_base_url": ""}


@frappe.whitelist(allow_guest=True, methods=["POST"])  # nosemgrep: guest-whitelisted-method
def chatbot_response():
	"""Securely proxies the chat request to Gemini API."""
	import json

	import requests

	try:
		# 1. Fetch Credentials securely from Single DocType
		if not frappe.db.exists("DocType", "Chatbot AI Credentials"):
			return {"success": False, "message": "Chatbot AI Credentials DocType not found"}

		credentials = frappe.get_doc("Chatbot AI Credentials")
		api_key = credentials.get_password("gemini_api_key")

		if not api_key:
			return {"success": False, "message": "Gemini API key is not configured"}

		# 2. Parse request payload
		try:
			payload = json.loads(frappe.request.data)
			contents = payload.get("conversation_history", [])
			system_instruction = payload.get("system_instruction", "")
			is_json = payload.get("is_json", False)
		except Exception:
			return {"success": False, "message": "Invalid JSON payload"}

		if not contents:
			return {"success": False, "message": "Missing conversation history"}

		# 3. Format payload for Gemini REST API
		gemini_payload = {"contents": contents}

		if system_instruction:
			gemini_payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}

		if is_json:
			gemini_payload["generationConfig"] = {"responseMimeType": "application/json"}

		# 4. Fallback loop over models
		models = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-3.1-flash-lite"]

		headers = {"Content-Type": "application/json"}
		last_error = None

		for model in models:
			url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
			try:
				response = requests.post(url, json=gemini_payload, headers=headers, timeout=10)
				if response.status_code == 200:
					data = response.json()
					try:
						reply_text = data["candidates"][0]["content"]["parts"][0]["text"]
						return {"success": True, "message": reply_text}
					except (KeyError, IndexError):
						return {"success": False, "message": "Invalid response format from Gemini"}
				else:
					last_error = f"{response.status_code}: {response.text}"
			except Exception as e:
				last_error = str(e)

		# If all models fail
		frappe.log_error(
			message=f"Gemini API completely failed. Last error: {last_error}", title="Chatbot Gemini Error"
		)
		return {"success": False, "message": "I'm unable to fetch that information right now."}

	except Exception:
		frappe.log_error(message=frappe.get_traceback(), title="Chatbot Response Wrapper Error")
		return {"success": False, "message": "Internal Server Error"}
